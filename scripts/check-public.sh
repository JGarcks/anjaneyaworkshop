#!/usr/bin/env bash
# check-public.sh — the public check: asserts, against the live addresses, what each closed phase promised.
# In:  nothing but the internet; optional first argument overrides the site (default https://anjaneyaworkshop.co.uk).
# Out: one PASS/FAIL line per assertion with the number behind it; exit 0 only if every assertion passed.
# Decision: the budget is a test (CLAUDE.md rule 9) — a FAIL here blocks the commit exactly as a red npm test does.
# Built in W1 — Ground (24 Sep 2026): Phase 0's assertions only (HTTPS on both domains, the redirects); Phase 1 adds the budget.
set -u

SITE="${1:-https://anjaneyaworkshop.co.uk}"
HOST="${SITE#https://}"
COM="anjaneyaworkshop.com"
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

echo "Public check, Phase 0 — $(date -u '+%Y-%m-%d %H:%M:%S UTC')"

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

echo
if (( failures == 0 )); then
  echo "All Phase 0 assertions passed."
else
  echo "$failures assertion(s) failed."
fi
exit $(( failures > 0 ))
