# Workshop — Active Work

> **Single source of truth for the next session.** Just the live pointer + truly cross-session queues.
>
> Closed session entries belong in `progress/YYYY-MM.md`, never here. Phase plans and design content belong in `Workshop-Coverage-Plan.md` (the arc) or `Workshop-Strategic-Plan.md` (charter). If this doc grew by more than ~30 lines during the session, move the bulk out before commit (CLAUDE.md rule 6).

---

## Currently working on

**Phases 0–1 closed (W1, W2).** **Phase 4 — the rented server: live since 17:19 UTC on 26 Sep (W9, brought forward); its gate's last half, Garcks-PC off an hour with the site unchanged, is Jamie's next look.** The engine, nginx and the tunnel run on OVH's VPS-1 in London (57.129.161.57, `frontdoor/state/server.md`); Garcks-PC's planet and tunnel are stopped (W9-d); the public planet changes only by `scripts/planet-release.sh`, at Jamie's word. **Phase 2 — the landing page: open.** Live at `anjaneyaworkshop.co.uk`: the name and the Planet link top left, the line at the bottom, the planet full screen behind, the still handing over through the dark, the still retaken daily by GitHub (11:17 UTC). 64 tests; check-public 29/29. Planet's `?embed` (WEB · D5) live since 21:45 on 24 Sep; since W8 the hub keeps the still until "drawn" and turns a phone by message. Detail: `progress/2026-09.md` §W3, §W4, §W8.

**Parked — W7, colour per cell (Jamie, 25 Sep): Garcks-PC is maxed by Planet's test runs; its numbers need a quiet machine.** Item 16 (`requests/planet-performance.md`) is written; the handover ends `Desktop/for-laptop-claude.txt`, marked PARKED. To resume: Jamie says go, the PARKED line comes off, Desktop Claude passes it on; Planet Claude builds and measures; live at Jamie's word, Jamie watching the spin (W7-c). Then: log its numbers, the hub monitor and W5-e's 10 s laptop measurement, Jamie's look. Live viewer: WEB · D8 (D9 withdrawn).

**Next build session: W10 — the Planet half of the performance round, then Phase 2's gate (W8, the hub's half, done; split W8-d). Waits for item 16 live and measured.** At its decision round, W6's recommendations as revised in W7:
1. Planet items 12 (culling, after a winding check), 13 (D9 retried, the stutter measured), 14 (a steady 30 fps only where 60 cannot be held; `prefers-reduced-motion`; meta poll 500 ms, Claude's by the numbers), 15 (`viewer.js` cached with a version) — the baseline first, on a quiet Garcks-PC (device matrix, `Workshop-Performance-Plan.md`).
2. The gate's rest: the server's engine stopped a minute (the still and "last seen", then recovery by itself), `door-rate.sh 60` on the server (laptop Claude), Jamie's walk on the laptop and phone incl. pinch-out, after the Planet items (the turn passed on Jamie's Android, W8). The restart half passed in W4; the live globe at 1.76 s headless (W8).
3. Confirm or undo W9-e (glibc's fast paths off on the server; Claude's, settled by the hash).

**Pending Jamie:** Garcks-PC off an hour (Phase 4's gate) · item 16 live and watched · the phone walk · swipe-to-refresh: leave it, or try the top strip catching the pull (real phone only) · WS · D5, BlockByBlock's new name (Phase 3).

**Who's who:** laptop Claude writes and commits, and runs the server over SSH (key only, sudo without a password); Desktop Claude (the docs' "PC Claude") runs runbook steps on Garcks-PC and commits only `frontdoor/state/`; Planet Claude does Planet's code (rule 8: never edited here). Requests go through `Desktop/for-laptop-claude.txt`.

---

## Booked (Jamie, 24 Sep 2026; W9 26 Sep)

**A livelier picture — WS · D13**, put with the server's own numbers after a few days of it (W4: a paid Cloudflare plan would not help; a push relay from the server; the server's traffic is unlimited). WS · D7 decided in W9: the engine moved.

## Queued (cross-session, ride-alongside — pick when a session is already in the relevant file)

- **Trim CLAUDE.md** from 16.2 KB toward the 12 KB budget (rule 6) at the first session that touches it; the About Jamie section is the long one.
- **More on the server** (Jamie asked, W9): Planet's background test runs at the lowest priority, or other apps — a scope decision for Jamie after a few days of the site on it; VPS-2 (4 vCores, 8 GB) if wanted. Planet Claude would need its own login.
- **Garcks-PC's idle door**: nginx on 127.0.0.1 and the stopped tunnel, kept for the way back (RUNBOOK §M2); remove once the server has run a month.
- **The 3D viewer**: when Planet's three.js viewer exists (its brief, after Layer 3), the landing page adopts it. Note only.

## Held for triggers

- **A restart caught mid-visit** — trigger: the "resumed" state showing more than once a day in the check log. Action: laptop Claude reads `journalctl -u planet-engine` on the server; nothing on the site changes.
- **A Planet release** (Jamie's word; `scripts/planet-release.sh`) — a new world or seed: the still refreshes itself at its next run; note the release line in `frontdoor/state/server.md` and the log. If the release's hash check stops it, tell Jamie and Planet Claude.
- **Planet's resolution changes** (a restart with a different `--f`) — trigger: a release with a new `--f`, or `/api/meta`'s `frequency` not 32. Action: purge `planet.anjaneyaworkshop.co.uk/api/grid` at Cloudflare (the edge keeps the grid a day; nginx only a second). A new seed at f=32 needs nothing.
- **Nameserver leftover at BT** (W2, W3-h): a BT resolver sometimes returns Porkbun's parking address (207.207.210.x), which fails TLS. Trigger: still seen after 26 Sep. Action: ask Porkbun to drop the old records; meanwhile re-run a red Phase 0 once and check `%{remote_ip}`.
