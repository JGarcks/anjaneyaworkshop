# Workshop — Active Work

> **Single source of truth for the next session.** Just the live pointer + truly cross-session queues.
>
> Closed session entries belong in `progress/YYYY-MM.md`, never here. Phase plans and design content belong in `Workshop-Coverage-Plan.md` (the arc) or `Workshop-Strategic-Plan.md` (charter). If this doc grew by more than ~30 lines during the session, move the bulk out before commit (CLAUDE.md rule 6).

---

## Currently working on

**Phases 0, 1 and 4 closed (W1, W2, W9).** The engine, nginx and the tunnel run on OVH's VPS-1 in London (57.129.161.57, `frontdoor/state/server.md`); Garcks-PC's planet and tunnel are stopped; the public planet changes only by `scripts/planet-release.sh`, at Jamie's word. **Phase 2 — the landing page: open.** Live at `anjaneyaworkshop.co.uk`; the still retaken daily by GitHub (11:17 UTC). 64 tests; check-public 29/29. Detail: `progress/2026-09.md` §W3, §W4, §W8.

**Planet's second edition (W12, W14):** Opus 5.5 builds, Fable reviews; the brief and the two reviews' notes are in `requests/planet-full-size-brief/`. Planet's FS-0 to FS-4 are done. **FS-5 (water) is parked, nothing adopted; FS-6 (coasts) is next, on the test server (W14-b, W14-c); then the second Fable review.** Jamie's guide: https://claude.ai/artifact/DUeKJYvnAZymyDPgXPrLzh (source in `guide/`). Planet's own `docs/PROGRESS.md` says which session is next. **The ocean planet (Planet's FS · D30):** Jamie wants it public at full size; it needs WEB-13 first, which since 29 Sep is full detail with the picture packed, not a screen-sized picture (W14-e; `requests/planet-web13-brief-2.md`), for a Planet session in a second copy on Garcks-PC; **the visitor's budget is 300,000 bytes a second** (W14-e, in both scripts); the ocean planets grow their own continents (land 26 to 29% by 5 billion years); the Workshop's half after WEB-13: the door taught `/api/packed/`, the guard weighing it and its pace, a full-size tick timed on the server, the page's wording and its About panel (W14-d, `landing-page-about.md`), the release.

**The public planet (W13):** `planet-fs1` (Planet `12bf5a7`), seed 28209 from year zero, since 21:54 UTC on 27 Sep. Detail: `progress/2026-09.md` §W13.

**Next build session: W15 — the Planet half of the performance round, then Phase 2's gate.** At its decision round, W6's recommendations as revised in W7:
1. Planet items 12 (culling), 14 (a steady 30 fps only where 60 cannot be held) and 15 (`viewer.js` cached with a version), the baseline first on a quiet Garcks-PC (`Workshop-Performance-Plan.md`).
2. The gate's rest: the server's engine stopped a minute, `door-rate.sh 60` on the server, Jamie's walk on the laptop and phone incl. pinch-out.
3. W11-b's figure is settled: 300,000 bytes a second (Jamie, W14-e).
4. The judder Jamie saw (Planet Claude's note on Garcks-PC's Desktop): WS · D13 brought forward. Pictures past the edge cache (WS · D4 and rule 9's `s-maxage=1`), or the viewer gliding at the engine's pace (a Planet viewer change, laptop session). Judged by Jamie's eye.
5. The test server's `GLIBC_TUNABLES` line (programs since FS-1 need none): off when FS-6's planets are not running.

**Pending Jamie:** the walk of the FS-1 planet · the phone walk · the D11 difference pictures: out of Planet's repository? · swipe-to-refresh: leave it, or try the top strip (real phone only) · WS · D5, BlockByBlock's new name · Planet's FS · D25, in Planet · the test server bills about £7.50 a day, to about 27 Oct.

**Who's who:** CLAUDE.md §About Jamie and rule 16; laptop Claude also runs the server over SSH (key only). Notes between Claudes live on Garcks-PC's Desktop and are archived by whoever acts on them (W12-d); the Workshop's record of its requests is `requests/`.

---

## Booked (Jamie, 24 Sep 2026; W9 26 Sep)

**A livelier picture — WS · D13**: brought forward to W15 (item 4) by the judder Jamie saw (W13). From W4: a paid Cloudflare plan would not help; a push relay from the server; the server's traffic is unlimited.

## Queued (cross-session, ride-alongside — pick when a session is already in the relevant file)

- **The hub does not notice a stopped tick** (W12): if Planet's engine stops while its server still answers, the page shows a frozen planet as live (`watch.js` goes still only on failed requests). Flagged as its own task. The engine's half is public since W13 (a crash stops the program; the service restarts it); a planet that hangs without crashing would still look live.
- **Trim CLAUDE.md** (16.4 KB → 12) at the first session that touches it, and **this file** (→ 4 KB; W14 took it from 5.9) at W15's wrap-up (rule 6); CLAUDE.md's About Jamie section is the long one.
- **More on the server** (Jamie asked, W9): Planet's background test runs at the lowest priority, or other apps — a scope decision for Jamie after a few days of the site on it; VPS-2 (4 vCores, 8 GB) if wanted. Planet Claude would need its own login.
- **Garcks-PC's idle door**: nginx on 127.0.0.1 and the stopped tunnel, kept for the way back (RUNBOOK §M2); remove once the server has run a month.
- **The 3D viewer**: when Planet's three.js viewer exists (its brief, after Layer 3), the landing page adopts it. Note only.

## Held for triggers

- **A restart caught mid-visit** — trigger: the "resumed" state showing more than once a day in the check log. Action: laptop Claude reads `journalctl -u planet-engine` on the server; nothing on the site changes.
- **A Planet release** (Jamie's word; `scripts/planet-release.sh`) — a new world or seed: the still refreshes itself at its next run; note the release line in `frontdoor/state/server.md` and the log. If the release's hash check stops it, tell Jamie and Planet Claude.
- **Planet's resolution changes** (a restart with a different `--f`) — trigger: a release with a new `--f`, or `/api/meta`'s `frequency` not 32. Action: purge `planet.anjaneyaworkshop.co.uk/api/grid` at Cloudflare (the edge keeps the grid a day; nginx only a second). A new seed at f=32 needs nothing.
- **Nameserver leftover at BT** (W2, W3-h): a BT resolver sometimes returns Porkbun's parking address (207.207.210.x), which fails TLS. Trigger: still seen after 26 Sep. Action: ask Porkbun to drop the old records; meanwhile re-run a red Phase 0 once and check `%{remote_ip}`.
