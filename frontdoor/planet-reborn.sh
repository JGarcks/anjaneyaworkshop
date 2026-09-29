#!/usr/bin/env bash
# planet-reborn.sh — starts the public planet again from its first moment once it has lived its life.
# In:  /etc/planet/reborn.env (LIFE_YEARS, WORLD, BIRTH), written by server.sh at a release that asks for it; the engine's own /api/meta.
# Out: nothing while the planet is younger. At its life's end: the engine stopped, the world replaced by the copy kept at its birth, the
#      engine started, and one line in the journal. If anything is missing it stops, says why, and the planet runs on (rule 10).
# Decision: W15-c (Jamie: reborn at 5 billion years, "for now"). Done by the server, outside the simulation: Planet's rules know nothing
#   of it, and every life is the same seed's same history. The hub reads the lower tick as a restart (rule 12). Planet's own lasting
#   answer is its FS-10.
# Built in W15 — the full-size ocean planet goes public (29 Sep 2026). Run as root by planet-reborn.timer every five minutes.
#   DRY=1 says what it would do and changes nothing.
set -euo pipefail

ENV_FILE="${REBORN_ENV:-/etc/planet/reborn.env}"
META="${REBORN_META:-http://127.0.0.1:8080/api/meta}"
DRY="${DRY:-0}"

[[ -r "$ENV_FILE" ]] || { echo "no $ENV_FILE: this planet is not reborn; nothing done"; exit 0; }
# shellcheck disable=SC1090
. "$ENV_FILE"
: "${LIFE_YEARS:?$ENV_FILE has no LIFE_YEARS}" "${WORLD:?$ENV_FILE has no WORLD}" "${BIRTH:?$ENV_FILE has no BIRTH}"

# An engine that does not answer is not this script's business: its own service restarts it (planet-engine.service).
reply="$(curl -fsS --max-time 5 "$META" 2>/dev/null)" || { echo "the engine did not answer at $META; nothing done"; exit 0; }
year="$(sed -n 's/.*"year":\([0-9.eE+]*\).*/\1/p' <<<"$reply")"
[[ -n "$year" ]] || { echo "STOPPED: no year in the engine's answer; nothing done" >&2; exit 1; }

lived="$(awk -v y="$year" -v l="$LIFE_YEARS" 'BEGIN { print (y + 0 >= l + 0) ? "yes" : "no" }')"
[[ "$lived" == yes ]] || exit 0
age="$(awk -v y="$year" 'BEGIN { printf "%.3f", y / 1e9 }')"

# The copy kept at the planet's birth must be there, and must be a planet at its first moment.
[[ -s "$BIRTH" ]] || { echo "STOPPED: the planet is $age billion years old, but there is no copy of its birth at $BIRTH; it runs on" >&2; exit 1; }
born="$(sqlite3 -readonly "$BIRTH" 'select max(tick) from checkpoints' 2>/dev/null || true)"
[[ "$born" == 0 ]] || { echo "STOPPED: the copy at $BIRTH is at tick ${born:-unreadable}, not a planet's first moment; the planet runs on" >&2; exit 1; }
[[ "$WORLD" == /var/lib/planet/* && "$BIRTH" == /var/lib/planet/birth/* ]] || { echo "STOPPED: $ENV_FILE names files outside /var/lib/planet; nothing done" >&2; exit 1; }

if [[ "$DRY" == 1 ]]; then
  echo "would be reborn: the planet is $age billion years old (its life is $(awk -v l="$LIFE_YEARS" 'BEGIN { printf "%g", l / 1e9 }') billion); $WORLD would be replaced by $BIRTH. Nothing changed (DRY=1)."
  exit 0
fi

systemctl stop planet-engine
rm -f "$WORLD-wal" "$WORLD-shm"
install -o planet -g planet -m 0640 "$BIRTH" "$WORLD"
systemctl reset-failed planet-engine 2>/dev/null || true
systemctl start planet-engine
tick=""
for _ in $(seq 1 30); do
  tick="$(curl -fsS --max-time 2 "$META" 2>/dev/null | sed -n 's/.*"tick":\([0-9]*\).*/\1/p' || true)"
  [[ -n "$tick" ]] && break
  sleep 1
done
[[ -n "$tick" ]] || { echo "STOPPED: reborn, but the engine did not answer within 30 s; see journalctl -u planet-engine" >&2; exit 1; }
echo "reborn: the planet had reached $age billion years; started again from its first moment, now at tick $tick"
