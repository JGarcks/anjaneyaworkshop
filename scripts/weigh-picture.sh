#!/usr/bin/env bash
# weigh-picture.sh — runs a planet release for a few seconds on a spare port, on a copy of its world, and prints how many bytes its picture weighs gzipped.
# In:  the world file, the release's arguments (serve …), its settings (KEY=VALUE …) and the maths setting (GLIBC_TUNABLES=…, or empty for none); the program at /tmp/planet-release/planet.
# Out: one number on standard output (0 if no picture came within a minute); the copy, its folder and the spare engine removed on the way out.
# Decision: W11-b — the visitor budget is weighed before a release goes up, not found afterwards by check-public (Strategic Plan §Budget).
# Built in W11 — ready for a full-size planet (27 Sep 2026); W13: no maths setting unless given one. planet-release.sh sends it over SSH; nothing is installed.
set -euo pipefail
src="$1"; args="$2"; envs="$3"; tune="$4"
PORT=18080; PROGRAM="${PROGRAM:-/tmp/planet-release/planet}"
d="$(mktemp -d)"; p=""
trap '[[ -n "$p" ]] && kill "$p" 2>/dev/null; wait 2>/dev/null; rm -rf "$d"' EXIT
# SQLite's own backup, so a running engine's world is copied whole; the world belongs to the planet account, hence sudo.
# No copy, no weighing: the release would otherwise start a new world and weigh that (seen in W11's test).
sudo test -s "$src" || { echo "no world at $src" >&2; echo 0; exit 1; }
sudo sqlite3 "$src" ".backup $d/world.sqlite"
sudo chown "$(id -u)" "$d/world.sqlite"
args="$(sed "s#--world [^ ]*#--world $d/world.sqlite#; s#--port [0-9]*##" <<<"$args") --port $PORT"
cd "$d"
# shellcheck disable=SC2086  # the arguments and settings are word lists on purpose
env -u GLIBC_TUNABLES $envs $tune "$PROGRAM" $args >"$d/serve.log" 2>&1 & p=$!
for _ in $(seq 60); do
  sleep 1
  if curl -sf --max-time 5 -o "$d/picture" "http://127.0.0.1:$PORT/api/picture/elevation_m"; then gzip -6 -c "$d/picture" | wc -c; exit 0; fi
done
echo 0
