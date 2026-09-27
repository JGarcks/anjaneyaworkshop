# Workshop — Active Work

> **Single source of truth for the next session.** Just the live pointer + truly cross-session queues.
>
> Closed session entries belong in `progress/YYYY-MM.md`, never here. Phase plans and design content belong in `Workshop-Coverage-Plan.md` (the arc) or `Workshop-Strategic-Plan.md` (charter). If this doc grew by more than ~30 lines during the session, move the bulk out before commit (CLAUDE.md rule 6).

---

## Currently working on

**Phases 0, 1 and 4 closed (W1, W2, W9).** The engine, nginx and the tunnel run on OVH's VPS-1 in London (57.129.161.57, `frontdoor/state/server.md`); Garcks-PC's planet and tunnel are stopped; the public planet changes only by `scripts/planet-release.sh`, at Jamie's word. **Phase 2 — the landing page: open.** Live at `anjaneyaworkshop.co.uk`; the still retaken daily by GitHub (11:17 UTC). 64 tests; check-public 29/29. Detail: `progress/2026-09.md` §W3, §W4, §W8.

**W7, W11 closed** (§W7, §W11): colour per cell and the drawing the size of the globe live and walked; the visitor budget (the picture ≤ 80,000 bytes) tested by check-public and at every release.

**W12, Planet's meta review (27 Sep):** Planet keeps its engine and reshapes the land at Earth's size, judged by Jamie's eye (W12-a); Opus 5.5 builds it, Fable reviews (W12-b). The brief is with Planet: `requests/planet-full-size-brief/` (its sessions FS-0 to FS-9; items 21–22 are its WEB-13 and WEB-14). **The public planet is seed 28209 from year zero on `planet-mg`** since 18:28 UTC (W12-e); the seed-25660 world is kept on the server. Planet's FS-0 and FS-1 closed 27 Sep; FS-2 is under way. The hired test server is kept for full-size planets (W12-c), idle; its next use FS-2. Jamie's session guide, with a tick for each session: `requests/planet-full-size-brief/guide/` and https://claude.ai/artifact/DUeKJYvnAZymyDPgXPrLzh. Detail: `progress/2026-09.md` §W12.

**The FS-1 release — waiting on Jamie's three answers.** Planet's FS-1 (`12bf5a7`): one program grows one world on every machine without W9-e's setting (seed 2 `7e7e8b15…` on Garcks-PC, the test server and the laptop); a crashed simulation stops the program, for the unit's `Restart=on-failure` to restart; plates saved in a form older programs cannot open. To put: when (Claude: a short session before W13), which world (Claude: seed 28209 carries on, MG · D2), a crash that repeats (Claude: stop after 3 in half an hour; the hub shows "last seen"). The Workshop's half first: the setting out of `planet-engine.service`, the release trying without it (back only for an older program), a copy of the world before a newer program opens it, the unit installed with each release. Then Planet Claude's release set, `planet-release.sh --keep-world`, the setting off the test server, W9-e and W10-c retired. Reads of the public server need Jamie's approval in auto mode. Detail: §W12, *Planet's FS-1*.

**Next build session: W13 — the Planet half of the performance round, then Phase 2's gate.** At its decision round, W6's recommendations as revised in W7:
1. Planet items 12 (culling), 14 (a steady 30 fps only where 60 cannot be held) and 15 (`viewer.js` cached with a version), the baseline first on a quiet Garcks-PC (`Workshop-Performance-Plan.md`).
2. The gate's rest: the server's engine stopped a minute, `door-rate.sh 60` on the server, Jamie's walk on the laptop and phone incl. pinch-out.
3. Confirm or undo W11-b's 80,000 (Claude's, settled by the numbers); W9-e and W10-c retire at the FS-1 release.

**Pending Jamie:** the FS-1 release's three (above) · the D11 difference pictures: out of Planet's repository (its rule 11)? · the phone walk · swipe-to-refresh: leave it, or try the top strip catching the pull (real phone only) · WS · D5, BlockByBlock's new name (Phase 3) · the test server bills about £7.50 a day while kept.

**Who's who:** CLAUDE.md §About Jamie and rule 16; laptop Claude also runs the server over SSH (key only). Notes between Claudes live on Garcks-PC's Desktop and are archived by whoever acts on them (W12-d); the Workshop's record of its requests is `requests/`.

---

## Booked (Jamie, 24 Sep 2026; W9 26 Sep)

**A livelier picture — WS · D13**, put with the server's own numbers after a few days of it (W4: a paid Cloudflare plan would not help; a push relay from the server; the server's traffic is unlimited). WS · D7 decided in W9: the engine moved.

## Queued (cross-session, ride-alongside — pick when a session is already in the relevant file)

- **The hub does not notice a stopped tick** (W12): if Planet's engine stops while its server still answers, the page shows a frozen planet as live (`watch.js` goes still only on failed requests). Flagged as its own task. The engine's half is done (FS-1: a crash stops the program) and goes public with the FS-1 release; a planet that hangs without crashing would still look live.
- **Trim CLAUDE.md** (16.2 KB → 12) at the first session that touches it, and **this file** (6.6 KB → 4) at the next build session's wrap-up (rule 6); CLAUDE.md's About Jamie section is the long one.
- **More on the server** (Jamie asked, W9): Planet's background test runs at the lowest priority, or other apps — a scope decision for Jamie after a few days of the site on it; VPS-2 (4 vCores, 8 GB) if wanted. Planet Claude would need its own login.
- **Garcks-PC's idle door**: nginx on 127.0.0.1 and the stopped tunnel, kept for the way back (RUNBOOK §M2); remove once the server has run a month.
- **The 3D viewer**: when Planet's three.js viewer exists (its brief, after Layer 3), the landing page adopts it. Note only.

## Held for triggers

- **A restart caught mid-visit** — trigger: the "resumed" state showing more than once a day in the check log. Action: laptop Claude reads `journalctl -u planet-engine` on the server; nothing on the site changes.
- **A Planet release** (Jamie's word; `scripts/planet-release.sh`) — a new world or seed: the still refreshes itself at its next run; note the release line in `frontdoor/state/server.md` and the log. If the release's hash check stops it, tell Jamie and Planet Claude.
- **Planet's resolution changes** (a restart with a different `--f`) — trigger: a release with a new `--f`, or `/api/meta`'s `frequency` not 32. Action: purge `planet.anjaneyaworkshop.co.uk/api/grid` at Cloudflare (the edge keeps the grid a day; nginx only a second). A new seed at f=32 needs nothing.
- **Nameserver leftover at BT** (W2, W3-h): a BT resolver sometimes returns Porkbun's parking address (207.207.210.x), which fails TLS. Trigger: still seen after 26 Sep. Action: ask Porkbun to drop the old records; meanwhile re-run a red Phase 0 once and check `%{remote_ip}`.
