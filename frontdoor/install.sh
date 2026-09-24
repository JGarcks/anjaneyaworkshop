#!/usr/bin/env bash
# install.sh — every step on Garcks-PC that needs the admin password, in one reviewed place; Jamie runs it with sudo.
# In:  a stage name — door (nginx, cloudflared and the door's config), tunnel (the tunnel's service), close (planet off the internet).
# Out: the installed files and services, and the whole run written to /var/tmp/frontdoor-install-<stage>.log for PC Claude to read.
# Decision: W2-c — system services on their own restricted accounts; no Claude types a password, so Jamie runs this, PC Claude the rest.
# Built in W2 — the front door (24 Sep 2026). Called from RUNBOOK.md steps 3, 5 and "Closing the door". Safe to run again.
set -euo pipefail

STAGE="${1:-}"
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
case "$STAGE" in door|tunnel|close) ;; *) echo "Usage: sudo bash $0 door|tunnel|close" >&2; exit 2 ;; esac
if [[ "$(id -u)" != 0 ]]; then echo "This needs the admin password: sudo bash $0 $STAGE" >&2; exit 1; fi

LOG="/var/tmp/frontdoor-install-$STAGE.log"
# Create the log (readable by PC Claude) before tee starts: tee opens it in the background, so a chmod after
# the exec could run before the file exists and stop the script (found by PC Claude on Garcks-PC, W2).
install -m 0644 /dev/null "$LOG"
exec > >(tee "$LOG") 2>&1
COMMIT="$(git -c safe.directory="$REPO" -C "$REPO" rev-parse --short HEAD)"
echo "== frontdoor install, stage '$STAGE', repo commit $COMMIT, $(date -u '+%Y-%m-%d %H:%M:%S UTC')"

fail() { echo "STOPPED: $1"; exit 1; }

case "$STAGE" in
door)
  echo "== 1. nginx, from the distribution"
  apt-get update -q
  apt-get install -y -q nginx curl gnupg

  echo "== 2. cloudflared, from Cloudflare's own apt repository"
  install -d -m 0755 /usr/share/keyrings
  curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg -o /usr/share/keyrings/cloudflare-main.gpg
  echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main' \
    > /etc/apt/sources.list.d/cloudflared.list
  apt-get update -q
  apt-get install -y -q cloudflared

  echo "== 3. the tunnel's own account (no login, no home folder)"
  id cloudflared >/dev/null 2>&1 || useradd --system --no-create-home --home-dir /nonexistent --shell /usr/sbin/nologin cloudflared
  install -d -m 0755 /etc/cloudflared

  echo "== 4. the door: config, the /home seal, and the stock welcome page switched off (it listens on every address)"
  install -m 0644 "$REPO/frontdoor/nginx.conf" /etc/nginx/conf.d/anjaneya-frontdoor.conf
  install -d -m 0755 /etc/systemd/system/nginx.service.d
  install -m 0644 "$REPO/frontdoor/nginx-protecthome.conf" /etc/systemd/system/nginx.service.d/protecthome.conf
  rm -f /etc/nginx/sites-enabled/default

  echo "== 5. nginx -t"
  nginx -t || fail "nginx -t refused the config; nothing restarted. Hand this log to PC Claude."

  echo "== 6. start at boot, and restart now"
  systemctl daemon-reload
  systemctl enable nginx
  systemctl restart nginx
  systemctl --no-pager --lines=0 status nginx || true
  echo "== listeners (nginx must show 127.0.0.1:8090 and nothing else)"
  ss -ltnp | grep -E 'nginx|:8090 ' || true
  echo "== versions"; nginx -v; cloudflared --version
  ;;

tunnel)
  CRED=/etc/cloudflared/anjaneya-frontdoor.json
  HOME_DIR="$(getent passwd "${SUDO_USER:-garcks}" | cut -d: -f6)"
  shopt -s nullglob
  NEW=("$HOME_DIR"/.cloudflared/*-*-*-*-*.json)
  echo "== 1. the tunnel's credentials into /etc/cloudflared, readable by the tunnel's account only"
  if (( ${#NEW[@]} == 1 )); then
    install -o cloudflared -g cloudflared -m 0400 "${NEW[0]}" "$CRED"
    rm -f "${NEW[0]}"
    echo "moved $(basename "${NEW[0]}") from $HOME_DIR/.cloudflared/"
  elif (( ${#NEW[@]} > 1 )); then
    fail "more than one tunnel credentials file in $HOME_DIR/.cloudflared/; PC Claude sorts out which is anjaneya-frontdoor's first."
  fi
  [[ -f "$CRED" ]] || fail "no credentials: run RUNBOOK.md step 4 (tunnel login and create) first."
  ID="$(sed -n 's/.*"TunnelID" *: *"\([0-9a-f-]\{36\}\)".*/\1/p' "$CRED")"
  [[ -n "$ID" ]] || fail "could not read the tunnel ID from $CRED."

  echo "== 2. config.yml with the tunnel ID filled in"
  sed "s/^tunnel: TUNNEL_ID$/tunnel: $ID/" "$REPO/frontdoor/config.yml" > /etc/cloudflared/config.yml
  chmod 0644 /etc/cloudflared/config.yml
  grep -q "^tunnel: $ID$" /etc/cloudflared/config.yml || fail "the tunnel ID did not go into config.yml."
  cloudflared --config /etc/cloudflared/config.yml tunnel ingress validate
  cloudflared --config /etc/cloudflared/config.yml tunnel ingress rule https://planet.anjaneyaworkshop.co.uk/api/meta

  echo "== 3. the service, on its own account, started at boot"
  install -m 0644 "$REPO/frontdoor/cloudflared-frontdoor.service" /etc/systemd/system/cloudflared-frontdoor.service
  systemctl daemon-reload
  systemctl enable cloudflared-frontdoor
  systemctl restart cloudflared-frontdoor
  sleep 5
  systemctl --no-pager --lines=0 status cloudflared-frontdoor || true
  journalctl -u cloudflared-frontdoor -n 15 --no-pager -o cat || true
  echo "TUNNEL_ID=$ID"
  ;;

close)
  systemctl disable --now cloudflared-frontdoor
  echo "The planet is off the internet: the tunnel is stopped and will not start at boot. nginx still listens on 127.0.0.1 only."
  echo "To open it again: sudo systemctl enable --now cloudflared-frontdoor"
  ;;
esac

echo "== done: stage '$STAGE' finished; the log is $LOG"
