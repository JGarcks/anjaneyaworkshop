#!/usr/bin/env bash
# planet-release.sh — copies the planet Garcks-PC is running (its program, settings and, by default, its world) to the rented server.
# In:  the server's address; Garcks-PC's planet.service as it stands (read, never changed); --keep-world to change only the program.
# Out: the server's planet-engine restarted on that release, and a line for frontdoor/state/server.md with what went up and when.
# Decision: WS · D2 as amended (the public planet changes only by a deliberate copy, like a release) and WS · D7 (the engine on the server).
# Built in W9 — the rented server (26 Sep 2026). Laptop Claude runs it: ssh reaches both machines from the laptop; nothing is kept here.
set -euo pipefail

SERVER="${1:-}"; KEEP="${2:-}"
[[ -n "$SERVER" ]] || { echo "Usage: bash scripts/planet-release.sh <server address> [--keep-world]" >&2; exit 2; }
PC=garcks@192.168.1.157
VPS="ubuntu@$SERVER"
SSH=(ssh -o BatchMode=yes -o ConnectTimeout=10)

echo "== 1. what Garcks-PC is running (planet.service, read only)"
ARGV="$("${SSH[@]}" "$PC" 'systemctl --user show planet -p ExecStart --value' | sed -n 's/.*argv\[\]=\([^;]*\) ;.*/\1/p' | head -1)"
ENVS="$("${SSH[@]}" "$PC" 'systemctl --user show planet -p Environment --value')"
read -r -a WORDS <<<"$ARGV"
BIN="${WORDS[0]}"; ARGS=("${WORDS[@]:1}")
PC_WORLD=""; for i in "${!ARGS[@]}"; do [[ "${ARGS[$i]}" == --world ]] && PC_WORLD="${ARGS[$((i+1))]}"; done
[[ -n "$BIN" && -n "$PC_WORLD" && "${ARGS[0]}" == serve ]] || { echo "STOPPED: could not read the program and world from planet.service: $ARGV" >&2; exit 1; }
NAME="$(basename "$PC_WORLD")"
echo "program: $BIN"; echo "world:   $PC_WORLD"; echo "args:    ${ARGS[*]}"; echo "settings: ${ENVS:-none}"

# The same arguments with the world moved to the server's folder.
SARGS="$(printf '%s ' "${ARGS[@]}" | sed "s#--world [^ ]*#--world /var/lib/planet/$NAME#; s/ $//")"
SUM="$("${SSH[@]}" "$PC" "sha256sum '$BIN'" | cut -c1-16)"
TICK="$("${SSH[@]}" "$PC" 'curl -s --max-time 3 http://127.0.0.1:8080/api/meta' | sed -n 's/.*"tick":\([0-9]*\).*/\1/p')"

echo "== 2. a consistent copy of the world, taken while the engine runs (SQLite's own backup; the original is only read)"
"${SSH[@]}" "$VPS" 'rm -rf /tmp/planet-release && mkdir -p /tmp/planet-release'
if [[ "$KEEP" == --keep-world ]]; then
  "${SSH[@]}" "$VPS" 'echo kept > /tmp/planet-release/world.sqlite'
else
  "${SSH[@]}" "$PC" "rm -f /tmp/planet-release-world.sqlite && sqlite3 '$PC_WORLD' '.backup /tmp/planet-release-world.sqlite'"
  scp -q -3 "$PC:/tmp/planet-release-world.sqlite" "$VPS:/tmp/planet-release/world.sqlite"
  "${SSH[@]}" "$PC" 'rm -f /tmp/planet-release-world.sqlite'
fi

echo "== 3. the program, the settings and the release note to the server"
scp -q -3 "$PC:$BIN" "$VPS:/tmp/planet-release/planet"
{
  echo "# /etc/planet/engine.env — written by scripts/planet-release.sh; read by planet-engine.service."
  for kv in $ENVS; do echo "$kv"; done
  echo "PLANET_ARGS=\"$SARGS\""
} | "${SSH[@]}" "$VPS" 'cat > /tmp/planet-release/engine.env'
NOTE="released $(date -u '+%Y-%m-%d %H:%M UTC'): $(basename "$BIN") (sha256 $SUM…), world $NAME from Garcks-PC at tick ${TICK:-?}, settings ${ENVS:-none}"
{
  echo "$NOTE"
  [[ "$KEEP" == --keep-world ]] && echo "keep-world: yes"
  echo "args: $SARGS"
} | "${SSH[@]}" "$VPS" 'cat > /tmp/planet-release/RELEASE.txt'

echo "== 3b. the same planet on both machines? (Planet's rule 4 promises its hash on Garcks-PC only; Planet Claude's check, 26 Sep)"
# A short run of seed 2 in an empty folder on each machine (about a second; writes nothing). Different hashes mean the
# server's processor would grow a different world from the same save: stop, and tell Jamie and Planet Claude.
HASH_RUN='d=$(mktemp -d) && cd "$d" && "$0" run --seed 2 --f 8 --ticks 2000 | sed -n "s/^world hash //p"; rm -rf "$d"'
PC_HASH="$("${SSH[@]}" "$PC" "sh -c '$HASH_RUN' '$BIN'")"
VPS_HASH="$("${SSH[@]}" "$VPS" "chmod +x /tmp/planet-release/planet && sh -c '$HASH_RUN' /tmp/planet-release/planet")"
echo "Garcks-PC: $PC_HASH"; echo "server:    $VPS_HASH"
[[ -n "$PC_HASH" && "$PC_HASH" == "$VPS_HASH" ]] || { echo "STOPPED: the hashes differ; nothing installed. Tell Jamie and Planet Claude." >&2; exit 1; }
NOTE="$NOTE; seed-2 hash ${PC_HASH:0:8}… matches Garcks-PC"
"${SSH[@]}" "$VPS" "echo 'hash: seed 2, f 8, 2000 ticks = $PC_HASH on both machines' >> /tmp/planet-release/RELEASE.txt"

echo "== 4. install and start on the server"
"${SSH[@]}" "$VPS" 'sudo bash ~/anjaneyaworkshop/frontdoor/server.sh engine'
echo "== for frontdoor/state/server.md:"
echo "- $NOTE"
