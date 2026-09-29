# Workshop — Active Work

> **Single source of truth for the next session.** Just the live pointer + truly cross-session queues.
>
> Closed session entries belong in `progress/YYYY-MM.md`, never here. Phase plans and design content belong in `Workshop-Coverage-Plan.md` (the arc) or `Workshop-Strategic-Plan.md` (charter). Its limit is 6 KB, measured every session (CLAUDE.md rule 6).

---

## Currently working on

**Phases 0, 1 and 4 closed (W1, W2, W9).** The public planet runs on OVH's VPS-1 (`frontdoor/state/server.md`) and changes only by `scripts/planet-release.sh`, at Jamie's word; today `planet-fs1`, seed 28209, since 27 Sep (W13). **Phase 2 — the landing page: open.** Live; 75 tests; check-public 29/29. Detail: `progress/2026-09.md`.

**Planet's second edition:** Opus 5.5 builds, Fable reviews; the brief, the reviews' notes and Jamie's guide are in `requests/planet-full-size-brief/` (the guide, redrawn 29 Sep: https://claude.ai/artifact/DUeKJYvnAZymyDPgXPrLzh). Two reviews, the water review and the housekeeping done (HK, `9197309`; checked, W15-s); **FS-7 (plates) is next**, then FS-6's third sitting (W15-i, W15-j); inner heat and volcanoes are in the plan (W15-l). The third review: before FS-10. Planet's own `docs/PROGRESS.md` says which session is next.

**W15 — the full-size ocean planet goes public: held by Jamie (W15-k)** until FS-7's first change has had Jamie's look. The Workshop's half is built and live (the door, the guard, the About panel, the rebirth: `progress/2026-09.md` §W15). **At the release:** seed 7 grown again on the commit released; a full-size tick timed on the server at its plate count; `planet-release.sh --reborn-at-myr=5000`; the grid purged at Cloudflare; `check-public.sh`; Jamie's walk on the laptop and the phone; Planet Claude's four notes archived.

**Next build session: W16 — the Planet half of the performance round, then Phase 2's gate.** At its decision round, W6's recommendations as revised in W7:
1. Planet items 12 (culling), 14 (a steady 30 fps only where 60 cannot be held) and 15 (`viewer.js` cached with a version), the baseline first on a quiet Garcks-PC (`Workshop-Performance-Plan.md`).
2. The gate's rest: the server's engine stopped a minute, `door-rate.sh 60` on the server, Jamie's walk on the laptop and phone incl. pinch-out.
3. Confirm or undo W15-f (Claude's): the guard's ceiling of 450,000 bytes a picture.
4. The judder Jamie saw (Planet Claude's note on Garcks-PC's Desktop): WS · D13 brought forward. Pictures past the edge cache (WS · D4 and rule 9's `s-maxage=1`), or the viewer gliding at the engine's pace (a Planet viewer change, laptop session). Judged by Jamie's eye.
**Pending Jamie:** the walk of the FS-1 planet · the phone walk · the D11 difference pictures: out of Planet's repository? · swipe-to-refresh: leave it, or try the top strip (real phone only) · WS · D5, BlockByBlock's new name · the trench rule looked at again at FS-7's look (W15-o).

---

## Queued (cross-session, ride-alongside — pick when a session is already in the relevant file)

- **The hub does not notice a stopped tick** (W12): if Planet's engine stops while its server still answers, the page shows a frozen planet as live (`watch.js` goes still only on failed requests). Flagged as its own task. The engine's half is public since W13 (a crash stops the program; the service restarts it); a planet that hangs without crashing would still look live.
- **CLAUDE.md is 13.0 KB against 12** (trimmed W15-r): the log's format to a file of its own, or the limit 13 KB — Jamie's.
- **No test server exists** (deleted 29 Sep at Jamie's word, W15-p): a new one when a Planet session asks, its address into Garcks-PC's Desktop note.
- **The viewer in parts** (Planet's HK · D1): a WEB session on the laptop before WEB-14; each new file a door entry and a release (Planet's `HK_VIEWER_REVIEW.md`).
- **More on the server** (Jamie asked, W9): Planet's background test runs at the lowest priority, or other apps — a scope decision for Jamie after a few days of the site on it; VPS-2 (4 vCores, 8 GB) if wanted. Planet Claude would need its own login.
- **Garcks-PC's idle door**: nginx on 127.0.0.1 and the stopped tunnel, kept for the way back (RUNBOOK §M2); remove once the server has run a month.
- **The 3D viewer**: when Planet's three.js viewer exists (its brief, after Layer 3), the landing page adopts it. Note only.

## Held for triggers

- **The grid packed** (W15-e: Jamie chose after the release, "for now", to be looked at again). At full size a first visit of the day downloads 3.1 MB before the planet moves (about 1.5 MB packed, an estimate). Trigger, whichever comes first: Jamie's phone walk on mobile data shows the still for more than about 5 s; the site is posted and has visitors; the second or third Fable review. Action: put it to Jamie again with the measured wait; the work is Planet's (queued in its WEB-13 reply).
- **A restart caught mid-visit** — trigger: the "resumed" state showing more often than the planet's rebirths (about two a day at one tick a second, W15-c). Action: laptop Claude reads `journalctl -u planet-engine` on the server; nothing on the site changes.
- **A Planet release** (Jamie's word; `scripts/planet-release.sh`) — a new world or seed: the still refreshes itself at its next run; note the release line in `frontdoor/state/server.md` and the log. If the release's hash check stops it, tell Jamie and Planet Claude.
- **Planet's resolution changes** (a restart with a different `--f`) — trigger: a release with a new `--f`, or `/api/meta`'s `frequency` not 32. Action: purge `planet.anjaneyaworkshop.co.uk/api/grid` at Cloudflare (the edge keeps the grid a day; nginx only a second). A new seed at f=32 needs nothing.
- **Nameserver leftover at BT** (W2, W3-h): a BT resolver sometimes returns Porkbun's parking address (207.207.210.x), which fails TLS. Trigger: still seen after 26 Sep. Action: ask Porkbun to drop the old records; meanwhile re-run a red Phase 0 once and check `%{remote_ip}`.
