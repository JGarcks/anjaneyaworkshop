#!/usr/bin/env bash
# planet-release.sh — copies the planet Garcks-PC is running (its program, settings and, by default, its world) to the rented server.
# In:  the server's address; Garcks-PC's planet.service as it stands (read, never changed); --keep-world to change only the program.
# Out: the server's planet-engine restarted on that release, and a line for frontdoor/state/server.md with what went up and when.
# Decision: WS · D2 as amended (the public planet changes only by a deliberate copy, like a release) and WS · D7 (the engine on the server).
# Built in W9 — the rented server (26 Sep 2026); W13 (27 Sep): the maths setting found by the hash, not assumed. Laptop Claude runs it from the laptop.
#   W15 (29 Sep): --reborn-at-myr=N asks the server to start the planet again from its first moment when it reaches N million years (W15-c).
set -euo pipefail

SERVER="${1:-}"; KEEP=""; REBORN_MYR=""
for word in "${@:2}"; do
  case "$word" in
    --keep-world) KEEP=--keep-world ;;
    --reborn-at-myr=*) REBORN_MYR="${word#--reborn-at-myr=}" ;;
    *) echo "Not understood: $word" >&2; SERVER="" ;;
  esac
done
[[ -n "$SERVER" ]] || { echo "Usage: bash scripts/planet-release.sh <server address> [--keep-world] [--reborn-at-myr=5000]" >&2; exit 2; }
[[ -z "$REBORN_MYR" || "$REBORN_MYR" =~ ^[1-9][0-9]*$ ]] || { echo "--reborn-at-myr wants a whole number of million years, got: $REBORN_MYR" >&2; exit 2; }
[[ -z "$REBORN_MYR" || -z "$KEEP" ]] || { echo "A planet is reborn from its first moment, so --reborn-at-myr cannot go with --keep-world." >&2; exit 2; }
PC=garcks@192.168.1.157
VPS="ubuntu@$SERVER"
SSH=(ssh -o BatchMode=yes -o ConnectTimeout=10)

echo "== 1. what Garcks-PC is running (planet.service, read only)"
ARGV="$("${SSH[@]}" "$PC" 'systemctl --user show planet -p ExecStart --value' | sed -n 's/.*argv\[\]=\([^;]*\) ;.*/\1/p' | head -1)"
ENVS="$("${SSH[@]}" "$PC" 'systemctl --user show planet -p Environment --value')"
# The corner's words (W15-d) are one phrase with spaces in it, and systemd shows the arguments with their quotes gone: the
# phrase is everything after --corner up to the next --option. It travels in a setting of its own (PLANET_CORNER).
CORNER="$(sed -n 's/.* --corner \(.*\)$/\1/p' <<<"$ARGV" | sed 's/ --[a-z].*$//')"
if [[ -n "$CORNER" ]]; then
  [[ "$CORNER" =~ ^[A-Za-z0-9\ ,.-]+$ ]] || { echo "STOPPED: the corner's words must be letters, numbers, spaces, commas, full stops or hyphens, got: $CORNER" >&2; exit 1; }
  ARGV="${ARGV/ --corner $CORNER/}"
fi
read -r -a WORDS <<<"$ARGV"
BIN="${WORDS[0]}"; ARGS=("${WORDS[@]:1}")
PC_WORLD=""; for i in "${!ARGS[@]}"; do [[ "${ARGS[$i]}" == --world ]] && PC_WORLD="${ARGS[$((i+1))]}"; done
[[ -n "$BIN" && -n "$PC_WORLD" && "${ARGS[0]}" == serve ]] || { echo "STOPPED: could not read the program and world from planet.service: $ARGV" >&2; exit 1; }
NAME="$(basename "$PC_WORLD")"
echo "program: $BIN"; echo "world:   $PC_WORLD"; echo "args:    ${ARGS[*]}"; echo "corner:  ${CORNER:-none}"; echo "settings: ${ENVS:-none}"

# The same arguments with the world moved to the server's folder.
SARGS="$(printf '%s ' "${ARGS[@]}" | sed "s#--world [^ ]*#--world /var/lib/planet/$NAME#; s/ $//")"
SUM="$("${SSH[@]}" "$PC" "sha256sum '$BIN'" | cut -c1-16)"
# The PC's engine is normally stopped since the move (W9-d), so no tick is an answer, not a failure.
TICK="$("${SSH[@]}" "$PC" 'curl -s --max-time 3 http://127.0.0.1:8080/api/meta || true' | sed -n 's/.*"tick":\([0-9]*\).*/\1/p')"

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
  echo "PLANET_CORNER=\"$CORNER\""
} | "${SSH[@]}" "$VPS" 'cat > /tmp/planet-release/engine.env'
if [[ "$KEEP" == --keep-world ]]; then WORLD_NOTE="the server's own world $NAME kept"; else WORLD_NOTE="world $NAME from Garcks-PC at tick ${TICK:-?}"; fi
NOTE="released $(date -u '+%Y-%m-%d %H:%M UTC'): $(basename "$BIN") (sha256 $SUM…), $WORLD_NOTE, settings ${ENVS:-none}"
{
  echo "$NOTE"
  [[ "$KEEP" == --keep-world ]] && echo "keep-world: yes"
  [[ -n "$REBORN_MYR" ]] && echo "reborn-at-years: ${REBORN_MYR}000000"
  [[ -n "$CORNER" ]] && echo "corner: $CORNER"
  echo "args: $SARGS"
} | "${SSH[@]}" "$VPS" 'cat > /tmp/planet-release/RELEASE.txt'

echo "== 3b. the same planet on both machines? (Planet's rule 4 promises its hash on Garcks-PC only; Planet Claude's check, 26 Sep)"
# A short run of seed 2 in an empty folder on each machine (about a second; writes nothing). Different hashes mean the
# server's processor would grow a different world from the same save: stop, and tell Jamie and Planet Claude.
HASH_RUN='d=$(mktemp -d) && cd "$d" && "$0" run --seed 2 --f 8 --ticks 2000 | sed -n "s/^world hash //p"; rm -rf "$d"'
PC_HASH="$("${SSH[@]}" "$PC" "sh -c '$HASH_RUN' '$BIN'")"
# On the server, first as the program is: from Planet's FS-1 it carries its own maths and needs no setting. Only if
# that differs, again with W9-e's setting (the C library's FMA/AVX2 paths off), which a program older than FS-1 needs
# on this processor; the setting that matched then goes into the release's own settings, engine.env (W13).
MATHS=GLIBC_TUNABLES=glibc.cpu.hwcaps=-AVX2,-FMA,-AVX
TUNE=""
VPS_HASH="$("${SSH[@]}" "$VPS" "chmod +x /tmp/planet-release/planet && env -u GLIBC_TUNABLES sh -c '$HASH_RUN' /tmp/planet-release/planet")"
echo "Garcks-PC:                $PC_HASH"; echo "server, no setting:       $VPS_HASH"
if [[ -n "$PC_HASH" && "$PC_HASH" != "$VPS_HASH" ]]; then
  TUNE="$MATHS"
  VPS_HASH="$("${SSH[@]}" "$VPS" "env $TUNE sh -c '$HASH_RUN' /tmp/planet-release/planet")"
  echo "server, with the setting: $VPS_HASH"
fi
[[ -n "$PC_HASH" && "$PC_HASH" == "$VPS_HASH" ]] || { echo "STOPPED: the hashes differ; nothing installed. Tell Jamie and Planet Claude." >&2; exit 1; }
if [[ -n "$TUNE" ]]; then
  "${SSH[@]}" "$VPS" "echo '$TUNE' >> /tmp/planet-release/engine.env"
  NOTE="$NOTE; seed-2 hash ${PC_HASH:0:8}… matches Garcks-PC with the maths setting (a program older than FS-1)"
else
  NOTE="$NOTE; seed-2 hash ${PC_HASH:0:8}… matches Garcks-PC with no maths setting"
fi
"${SSH[@]}" "$VPS" "echo 'hash: seed 2, f 8, 2000 ticks = $PC_HASH on both machines${TUNE:+, the server with $TUNE}' >> /tmp/planet-release/RELEASE.txt"

echo "== 3c. the visitor budget: the release's picture weighed before it goes up (W11-b; Strategic Plan §Budget)"
# The release runs for a few seconds on the server, on a spare port and a copy of its world, and its picture is weighed
# gzipped, as a visitor gets it. Over the ceiling, nothing is installed: a bigger planet goes public only once the viewer
# sends the hub a screen-sized picture (Planet item 21, W11-a). At f 32 the picture is about 58 KB; at f 64 about 246 KB.
# W14-e (Jamie, 29 Sep 2026): the budget is 300,000 bytes a second, and a full-size planet goes public at full detail with
# its picture packed (Planet's WEB-13), not screen-sized. W15: weigh-picture.sh weighs the packed picture when the
# program serves one and the unpacked one otherwise, so a full-size planet on a program older than WEB-13 (its picture
# about 280 to 1,200 KB) is still refused. A release's picture is its youngest and lightest; as the planet ages
# check-public.sh watches the ceiling (450,000 bytes a picture).
PICTURE_MAX=300000
if [[ "$KEEP" == --keep-world ]]; then SRC="/var/lib/planet/$NAME"; else SRC=/tmp/planet-release/world.sqlite; fi
WEIGHT="$("${SSH[@]}" "$VPS" "bash -s -- $(printf '%q ' "$SRC" "$SARGS" "$ENVS" "$TUNE")" < "$(dirname "$0")/weigh-picture.sh" || true)"
echo "the release's picture: ${WEIGHT:-?} bytes gzipped (ceiling $PICTURE_MAX)"
[[ "${WEIGHT:-0}" =~ ^[0-9]+$ && "$WEIGHT" -gt 0 ]] || { echo "STOPPED: the release did not serve a picture within a minute on the spare port; nothing installed." >&2; exit 1; }
[[ "$WEIGHT" -le "$PICTURE_MAX" ]] || { echo "STOPPED: the picture is $WEIGHT bytes, over the visitor budget of $PICTURE_MAX a second; nothing installed. A bigger planet waits for the packed picture (Planet's WEB-13, W14-e). Tell Jamie." >&2; exit 1; }
NOTE="$NOTE; picture $WEIGHT bytes gzipped"

echo "== 4. install and start on the server"
"${SSH[@]}" "$VPS" 'sudo bash ~/anjaneyaworkshop/frontdoor/server.sh engine'
echo "== for frontdoor/state/server.md:"
echo "- $NOTE"
