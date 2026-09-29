#!/usr/bin/env bash
# planet-start.sh — starts the public planet's program with its arguments, keeping the corner's words together as one.
# In:  PLANET_ARGS (words, split here) and PLANET_CORNER (one phrase, or empty), both from /etc/planet/engine.env via planet-engine.service.
# Out: the Planet program in place of this script (exec), so systemd watches the engine itself.
# Decision: W15-d (the corner reads "Born as ocean"). systemd splits PLANET_ARGS at every space, which would hand the engine
#   "Born", "as" and "ocean" as three arguments; the phrase travels in a setting of its own and is quoted here.
# Built in W15 — the full-size ocean planet goes public (29 Sep 2026). Installed by frontdoor/server.sh engine.
#   PROGRAM is only for trying this script against a stand-in.
set -euo pipefail
corner=()
[[ -n "${PLANET_CORNER:-}" ]] && corner=(--corner "$PLANET_CORNER")
# shellcheck disable=SC2086  # PLANET_ARGS is a word list on purpose
exec "${PROGRAM:-/opt/planet/planet}" ${PLANET_ARGS:?engine.env has no PLANET_ARGS} "${corner[@]}"
