#!/usr/bin/env bash
# door-rate.sh — how hard the door worked in the last minute: the engine's load and the house's upload, from nginx's log.
# In:  /var/log/nginx/anjaneya-frontdoor.log (the 'door' format in nginx.conf); optional window in seconds (default 60).
# Out: requests at the door, bytes per second up the line, and engine fetches per second for each address.
# Decision: the budget is measured at nginx (Strategic Plan §Budget: under 0.6 MB/s; about one engine fetch per address per
#   second per Cloudflare location with a viewer, W4-e).
# Built in W2 — the front door (24 Sep 2026); W4 counts BYPASS. PC Claude runs it at the Phase 1 gate while three browsers watch; the numbers go into state/.
set -euo pipefail

WINDOW="${1:-60}"
LOG="${DOOR_LOG:-/var/log/nginx/anjaneya-frontdoor.log}"
SINCE="$(date -d "-$WINDOW sec" '+%Y-%m-%dT%H:%M:%S')"

# Log fields: 1 time, 2 method, 3 path, 4 status, 5 cache status, 6 bytes sent, 7 seconds.
# An engine fetch is a MISS, an EXPIRED or a BYPASS (the live numbers, never held since W4-e); a HIT or an UPDATING
# was answered from the door's memory.
awk -v since="$SINCE" -v window="$WINDOW" '
  $1 >= since { n++; bytes += $6; if ($5 == "MISS" || $5 == "EXPIRED" || $5 == "BYPASS") { up[$3]++; fetches++ } }
  END {
    printf "window: last %d s (from %s)\n", window, since
    printf "requests at the door: %d (%.1f per second)\n", n, n / window
    printf "bytes up the line: %.1f KB/s  (budget: under 600 KB/s)\n", bytes / window / 1024
    printf "engine fetches: %d (%.2f per second)\n", fetches, fetches / window
    for (p in up) printf "  %-32s %.2f per second\n", p, up[p] / window
  }' "$LOG"
