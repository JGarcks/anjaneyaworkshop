#!/usr/bin/env bash
# check-public.sh — the public check: asserts, against the live addresses, what each closed phase promised.
# In:  nothing but the internet; optional first argument overrides the site; THROUGH=<n> runs phases 0..n (default 2).
# Out: one PASS/FAIL line per assertion with the number behind it; exit 0 only if every assertion passed.
# Decision: the budget is a test (CLAUDE.md rule 9) — a FAIL here blocks the commit exactly as a red npm test does.
# Built in W1 — Ground (24 Sep 2026), Phase 0 (HTTPS, redirects); W2 — the front door added Phase 1 (the budget at the door);
#   W3 — the landing page began Phase 2 (browsers re-check the hub's files; W4 adds the rest).
set -u

SITE="${1:-https://anjaneyaworkshop.co.uk}"
HOST="${SITE#https://}"
COM="anjaneyaworkshop.com"
PLANET="${PLANET:-https://planet.anjaneyaworkshop.co.uk}"
THROUGH="${THROUGH:-2}"   # before the door is live (W2, until RUNBOOK step 6): THROUGH=0, and the log says so
failures=0

pass() { printf 'PASS  %s\n' "$1"; }
fail() { printf 'FAIL  %s\n' "$1"; failures=$((failures + 1)); }

# status_and_location URL -> prints "<status> <location>" without following redirects.
status_and_location() {
  # curl prints the -w line even when it fails (as "000 "), so a failure needs no extra handling here.
  curl -sS -o /dev/null --max-time 15 -w '%{http_code} %{redirect_url}' "$1" 2>/dev/null || true
}

# expect_redirect URL TARGET — URL must answer 301 or 308 with Location exactly TARGET.
expect_redirect() {
  local got code where
  got="$(status_and_location "$1")"
  code="${got%% *}"; where="${got#* }"
  if [[ ( "$code" == 301 || "$code" == 308 ) && "$where" == "$2" ]]; then
    pass "$1 → $code $where"
  else
    fail "$1 → expected 301 to $2, got $code ${where:-(no Location)}"
  fi
}

echo "Public check, phases 0 to $THROUGH — $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo
echo "Phase 0 — Ground ($SITE)"

# 1. The site answers over HTTPS with the page, and says how long it took.
body="$(curl -sS --max-time 15 -w '\n%{http_code} %{time_total}' "$SITE/" 2>/dev/null)"
tail_line="${body##*$'\n'}"; code="${tail_line%% *}"; secs="${tail_line#* }"
if [[ "$code" == 200 && "$body" == *"Anjaneya Workshop"* ]]; then
  pass "$SITE/ → 200 over HTTPS in ${secs}s"
else
  fail "$SITE/ → expected 200 with the page, got ${code:-no answer}"
fi

# 2. Plain HTTP is upgraded to HTTPS.
expect_redirect "http://$HOST/" "https://$HOST/"

# 3. www goes to the bare address, keeping the path.
expect_redirect "https://www.$HOST/some/path?x=1" "https://$HOST/some/path?x=1"

# 4. The .com (bare and www, any path) goes to the .co.uk, keeping the path.
expect_redirect "https://$COM/" "https://$HOST/"
expect_redirect "https://$COM/some/path?x=1" "https://$HOST/some/path?x=1"
expect_redirect "https://www.$COM/" "https://$HOST/"

# ---- Phase 1 — the front door: the Budget section of the Strategic Plan, asserted at the public address.
# headers URL [curl options…] -> the reply's status line and headers, lower-cased, one per line.
headers() { local url="$1"; shift; curl -sS -o /dev/null -D - --max-time 15 "$@" "$url" 2>/dev/null | tr -d '\r' | tr 'A-Z' 'a-z'; }
# header NAME HEADERS -> the value of that header, or nothing.
header() { grep -m1 "^$1:" <<<"$2" | cut -d' ' -f2-; }
status_of() { head -1 <<<"$1" | awk '{print $2}'; }

if (( THROUGH >= 1 )); then
  echo
  echo "Phase 1 — the front door ($PLANET)"

  # 5. A field arrives compressed, labelled one second, with the tick (the restart signal, rule 12).
  h="$(headers "$PLANET/api/field/elevation_m" -H 'Accept-Encoding: gzip')"
  wire="$(curl -sS -o /dev/null --max-time 15 -w '%{size_download}' -H 'Accept-Encoding: gzip' "$PLANET/api/field/elevation_m" 2>/dev/null)"
  if [[ "$(status_of "$h")" == 200 && "$(header content-encoding "$h")" == gzip && "${wire:-0}" -gt 0 && "${wire:-0}" -lt 41000 ]]; then
    pass "field elevation_m → 200, gzip, $wire bytes on the wire (41,000 uncompressed)"
  else
    fail "field elevation_m → expected 200 gzip under 41,000 bytes, got $(status_of "$h") $(header content-encoding "$h") ${wire:-?} bytes"
  fi
  tick="$(header x-planet-tick "$h")"
  if [[ "$tick" =~ ^[0-9]+$ ]]; then pass "X-Planet-Tick present on a field ($tick)"; else fail "X-Planet-Tick missing on a field"; fi

  # 6. One second at the edge and none in the browser on meta and fields (W2-f); a day on the grid.
  for path in /api/meta /api/field/elevation_m; do
    cc="$(header cache-control "$(headers "$PLANET$path")")"
    if [[ "$cc" == "public, max-age=0, s-maxage=1" ]]; then pass "$path Cache-Control: $cc"; else fail "$path Cache-Control: expected public, max-age=0, s-maxage=1, got ${cc:-none}"; fi
  done
  cc="$(header cache-control "$(headers "$PLANET/api/grid")")"
  if [[ "$cc" == "public, max-age=86400" ]]; then pass "/api/grid Cache-Control: $cc"; else fail "/api/grid Cache-Control: expected public, max-age=86400, got ${cc:-none}"; fi

  # 7. Read-only (rule 11): a POST is refused; HEAD still works.
  code="$(curl -sS -o /dev/null --max-time 15 -w '%{http_code}' -X POST -d x=1 "$PLANET/api/meta" 2>/dev/null)"
  if [[ "$code" == 405 ]]; then pass "POST /api/meta → 405"; else fail "POST /api/meta → expected 405, got $code"; fi
  code="$(curl -sS -o /dev/null --max-time 15 -w '%{http_code}' -I "$PLANET/" 2>/dev/null)"
  if [[ "$code" == 200 ]]; then pass "HEAD / → 200"; else fail "HEAD / → expected 200, got $code"; fi

  # 8. The second fetch within a second is answered by Cloudflare's edge (three tries, since a pair can straddle a second).
  hit=""
  for try in 1 2 3; do
    headers "$PLANET/api/meta" >/dev/null
    second="$(header cf-cache-status "$(headers "$PLANET/api/meta")")"
    if [[ "$second" == hit ]]; then hit="try $try"; break; fi
  done
  if [[ -n "$hit" ]]; then pass "second fetch of /api/meta within a second → edge HIT ($hit)"; else fail "second fetch of /api/meta → expected edge HIT, got ${second:-no cf-cache-status}"; fi

  # 9. The hub may read the API, and only our pages may frame the planet (W2-a).
  h="$(headers "$PLANET/")"
  acao="$(header access-control-allow-origin "$(headers "$PLANET/api/meta")")"
  if [[ "$acao" == "https://anjaneyaworkshop.co.uk" ]]; then pass "Access-Control-Allow-Origin: $acao"; else fail "Access-Control-Allow-Origin: expected https://anjaneyaworkshop.co.uk, got ${acao:-none}"; fi
  csp="$(header content-security-policy "$h")"
  if [[ "$csp" == "frame-ancestors 'self' https://anjaneyaworkshop.co.uk" ]]; then pass "framing: $csp"; else fail "framing: expected frame-ancestors 'self' https://anjaneyaworkshop.co.uk, got ${csp:-none}"; fi

  # 10. Anything but Planet's own addresses stops at the door.
  code="$(curl -sS -o /dev/null --max-time 15 -w '%{http_code}' "$PLANET/not-a-planet-address" 2>/dev/null)"
  if [[ "$code" == 404 ]]; then pass "an unknown path → 404 at the door"; else fail "an unknown path → expected 404, got $code"; fi

  echo "(The engine's load and the house's upload are measured at nginx: frontdoor/door-rate.sh, pasted into frontdoor/state/.)"
fi

# ---- Phase 2 — the landing page.
if (( THROUGH >= 2 )); then
  echo
  echo "Phase 2 — the landing page ($SITE)"

  # 11. Browsers re-check the hub's files on every visit, so a deploy reaches everyone at once (W3-i: the zone's Browser Cache TTL
  #     is "Respect Existing Headers"; at its default 4 hours Jamie's Chrome kept the holding page's style for hours after W3's deploy).
  for path in / /style.css /js/main.js /still/planet.webp; do
    cc="$(header cache-control "$(headers "$SITE$path")")"
    if [[ "$cc" == *"max-age=0"* ]]; then pass "$path Cache-Control: $cc"; else fail "$path Cache-Control: expected max-age=0 (browsers re-check), got ${cc:-none} — is the zone's Browser Cache TTL back from \"Respect Existing Headers\"?"; fi
  done
fi

echo
if (( failures == 0 )); then
  echo "All assertions for phases 0 to $THROUGH passed."
else
  echo "$failures assertion(s) failed."
fi
exit $(( failures > 0 ))
