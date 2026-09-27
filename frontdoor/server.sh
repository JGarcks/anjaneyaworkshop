#!/usr/bin/env bash
# server.sh — the rented server's own steps (the door itself is install.sh door and tunnel, the same as on Garcks-PC).
# In:  a stage — base (firewall, SSH, updates, the planet account and service) or engine (a release put in /tmp/planet-release by scripts/planet-release.sh).
# Out: the server locked down, and the public planet running from the release; the run logged to /var/tmp/server-<stage>.log.
# Decision: WS · D7 (the engine on the server), W9-b (the tunnel stays; nothing opens but SSH). Laptop Claude runs this over SSH with sudo.
# Built in W9 — the rented server (26 Sep 2026); W13 (27 Sep): a release keeps a copy of the world and installs the service file. Safe to run again.
set -euo pipefail

STAGE="${1:-}"
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
case "$STAGE" in base|engine) ;; *) echo "Usage: sudo bash $0 base|engine" >&2; exit 2 ;; esac
if [[ "$(id -u)" != 0 ]]; then echo "This needs root: sudo bash $0 $STAGE" >&2; exit 1; fi

LOG="/var/tmp/server-$STAGE.log"
install -m 0644 /dev/null "$LOG"
exec > >(tee "$LOG") 2>&1
COMMIT="$(git -c safe.directory="$REPO" -C "$REPO" rev-parse --short HEAD 2>/dev/null || echo unknown)"
echo "== server, stage '$STAGE', repo commit $COMMIT, $(date -u '+%Y-%m-%d %H:%M:%S UTC')"

fail() { echo "STOPPED: $1"; exit 1; }

case "$STAGE" in
base)
  echo "== 1. up to date, with security updates from now on by themselves"
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -q
  apt-get full-upgrade -y -q
  apt-get install -y -q ufw unattended-upgrades sqlite3 git curl
  systemctl enable --now unattended-upgrades

  echo "== 2. SSH by key only (the key this session is using is already in; a password never opens it)"
  # Refuse to lock the door on ourselves: only go on if the user running sudo has a key on record.
  KEYS="$(getent passwd "${SUDO_USER:-ubuntu}" | cut -d: -f6)/.ssh/authorized_keys"
  [[ -s "$KEYS" ]] || fail "no key in $KEYS; passwords left on so nobody is locked out."
  printf '# Workshop (W9): keys only, never root.\nPasswordAuthentication no\nKbdInteractiveAuthentication no\nPermitRootLogin no\n' \
    > /etc/ssh/sshd_config.d/10-workshop.conf
  sshd -t || fail "sshd -t refused the change; nothing reloaded."
  # Ubuntu 26.04 starts sshd per connection (ssh.socket), so there is often no service to reload: the next login reads it.
  if systemctl is-active --quiet ssh; then systemctl reload ssh; else echo "ssh starts per connection (ssh.socket): the change applies from the next login"; fi

  echo "== 3. the firewall: SSH in, nothing else (the tunnel only goes out)"
  ufw default deny incoming
  ufw default allow outgoing
  ufw allow OpenSSH
  ufw --force enable
  ufw status verbose

  echo "== 4. the planet's own account (no login, no home folder) and its service, not started until a release"
  id planet >/dev/null 2>&1 || useradd --system --no-create-home --home-dir /nonexistent --shell /usr/sbin/nologin planet
  install -d -m 0755 /opt/planet /etc/planet
  install -m 0644 "$REPO/frontdoor/planet-engine.service" /etc/systemd/system/planet-engine.service
  systemctl daemon-reload
  systemctl enable planet-engine
  echo "== versions"; lsb_release -ds; uname -r
  ;;

engine)
  REL=/tmp/planet-release
  for f in planet world.sqlite engine.env RELEASE.txt; do [[ -s "$REL/$f" ]] || fail "$REL/$f missing: run scripts/planet-release.sh from the laptop."; done
  # shellcheck disable=SC1091
  WORLD="$(. "$REL/engine.env"; sed -n 's/.*--world \([^ ]*\).*/\1/p' <<<"$PLANET_ARGS")"
  [[ "$WORLD" == /var/lib/planet/* ]] || fail "engine.env's --world is not under /var/lib/planet: $WORLD"

  echo "== 1. stop the engine (it saves as it goes; the world on disk is the one we replace or keep)"
  systemctl stop planet-engine || true

  echo "== 1b. a copy of that world as it stands, the way back (W13)"
  # A newer program's saves can be unreadable to an older one (Planet's FS-1 plates, for one, to planet-mg), and a new
  # world of the same name replaces the file. So the world is copied first, by the planet account (SQLite's side files
  # stay its own) with SQLite's backup, into /var/lib/planet/kept. No copy, no release: the old engine starts again.
  if [[ -f "$WORLD" ]]; then
    install -d -o planet -g planet -m 0750 /var/lib/planet/kept
    COPY="/var/lib/planet/kept/$(basename "$WORLD" .sqlite).before-$(date -u +%Y%m%d-%H%M).sqlite"
    if runuser -u planet -- sqlite3 "$WORLD" ".backup '$COPY'" && [[ -s "$COPY" ]]; then
      echo "kept: $COPY ($(stat -c %s "$COPY") bytes)"
    else
      systemctl start planet-engine || true
      fail "could not copy $WORLD; the old engine started again, nothing installed."
    fi
  else
    echo "no world at $WORLD yet (a new name): nothing to keep; the older worlds in /var/lib/planet are left as they are"
  fi

  echo "== 2. the program, the settings, the release note, and the service file from this repo (so a change to it goes up with a release)"
  install -m 0755 "$REL/planet" /opt/planet/planet
  install -m 0644 "$REL/engine.env" /etc/planet/engine.env
  install -m 0644 "$REL/RELEASE.txt" /opt/planet/RELEASE.txt
  install -m 0644 "$REPO/frontdoor/planet-engine.service" /etc/systemd/system/planet-engine.service
  systemctl daemon-reload
  cat /opt/planet/RELEASE.txt

  echo "== 3. the world"
  install -d -o planet -g planet -m 0750 /var/lib/planet
  if grep -q '^keep-world: yes' "$REL/RELEASE.txt"; then
    [[ -f "$WORLD" ]] || fail "keep-world asked for, but $WORLD is not on the server."
    echo "kept the server's own world: $WORLD"
  else
    rm -f "$WORLD" "$WORLD-wal" "$WORLD-shm"
    install -o planet -g planet -m 0640 "$REL/world.sqlite" "$WORLD"
    echo "world copied in: $WORLD"
  fi

  echo "== 4. start, and ask it for its numbers"
  # A crash limit reached before (planet-engine.service, W13-d) must not refuse a release's start.
  systemctl reset-failed planet-engine 2>/dev/null || true
  systemctl start planet-engine
  for i in $(seq 1 30); do curl -fsS --max-time 2 http://127.0.0.1:8080/api/meta >/dev/null 2>&1 && break; sleep 1; done
  curl -fsS --max-time 2 http://127.0.0.1:8080/api/meta | head -c 300 || fail "the engine did not answer on 127.0.0.1:8080 in 30 s; see journalctl -u planet-engine."
  echo
  systemctl --no-pager --lines=5 status planet-engine || true
  ss -ltnp | grep -E ':8080 |:8090 ' || true
  rm -rf "$REL"
  ;;
esac

echo "== done: stage '$STAGE' finished; the log is $LOG"
