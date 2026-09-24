# Workshop — Active Work

> **Single source of truth for the next session.** Just the live pointer + truly cross-session queues.
>
> Closed session entries belong in `progress/YYYY-MM.md`, never here. Phase plans and design content belong in `Workshop-Coverage-Plan.md` (the arc) or `Workshop-Strategic-Plan.md` (charter). If this doc grew by more than ~30 lines during the session, move the bulk out before commit (CLAUDE.md rule 6).

---

## Currently working on

**Phases 0–1 closed (W1, W2).** **Phase 2 — the landing page: open.** Live at `anjaneyaworkshop.co.uk`: the name and the Planet link top left, the line at the bottom, the planet full screen behind, the still handing over through the dark, the still retaken daily by GitHub (11:17 UTC). 57 tests; check-public 24/24. Planet's `?embed` (WEB · D5) live since 21:45 on 24 Sep. Detail: `progress/2026-09.md` §W3, §W4.

**Next build session: W5 — the planet's movement, then the gate.** Start here:
0. **Done 24 Sep (W5-a…c):** Planet items 7 (`/api/picture/`, one request per picture) and 10 (the spin's catch: pictures prepared a slice a frame; glide 1.5 behind) live; the door no longer holds `/api/picture/` or `/api/meta`. A picture reaches the hub every ~1.05 s, none over 3 s (was 2.1 s, freezes to 38 s). Detail: `progress/2026-09.md` §W5-a.
1. **Open from it:** Jamie's walk after item 10 on the laptop: "best it's been by far — not perfect, good enough for now" (a small catch left, held); the phone not yet walked; the frame-rate numbers from Jamie's Chrome for Planet Claude not taken (the tab was hidden, then closed). `check-public.sh` does not yet assert `/api/picture/` (200, gzip, tick, BYPASS at the door). W5-c is Claude's, by the numbers — confirm or undo at the next round.
2. **The hub's side of `?embed`:** drop the 56 px crop; send `{ planet: 'zoom' }` on a phone turn instead of reloading; re-time the live globe with "drawn" (unloaded laptop — W4's try ran under three browsers).
3. **The gate's rest:** the network unplugged a minute, `door-rate.sh 60` (Desktop Claude), Jamie's walk incl. pinch-out on the phone. The restart half passed in W4 ("resumed" 2 s after the restart, no reload).

**Pending Jamie:** Planet item 11 (less GPU work, same picture — W5-e) live at Jamie's word, then laptop Claude re-measures · the phone walk after item 10 · W5-c (meta not held) to confirm · swipe-to-refresh: leave it, or try the top strip catching the pull (real phone only) · WS · D5, BlockByBlock's new name (Phase 3).

**Who's who:** laptop Claude writes and commits; Desktop Claude (the docs' "PC Claude") runs runbook steps on Garcks-PC and commits only `frontdoor/state/`; Planet Claude does Planet's code (rule 8: never edited here). Requests go through `Desktop/for-laptop-claude.txt`.

---

## Booked for the decision round after Phase 2 closes (Jamie, 24 Sep 2026)

1. **A livelier picture — WS · D13** (W4: a paid Cloudflare plan would not help; Planet item 7, the fields as one request, or a push relay). 2. **Not local — WS · D7** (a rented server: the engine, or only the door). Trade-offs and prices: Strategic Plan §WS · D7, D13; priced with that day's numbers.

## Queued (cross-session, ride-alongside — pick when a session is already in the relevant file)

- **Trim CLAUDE.md** from 16.2 KB toward the 12 KB budget (rule 6) at the first session that touches it; the About Jamie section is the long one.
- **A second, stable planet instance** on `main` with its own world file and port, as a one-line nginx repoint — only if Jamie ever wants the site not to follow the experiments (WS · D2).
- **The 3D viewer**: when Planet's three.js viewer exists (its brief, after Layer 3), the landing page adopts it. Note only.

## Held for triggers

- **A restart caught mid-visit** — trigger: the "resumed" state showing more than once a day in the check log. Action: read Planet's `journalctl --user -u planet` with PC Claude; nothing on the site changes.
- **The world moving to a new build or seed** — trigger: PC Claude reporting a restart from year zero in `frontdoor/state/`. Action: the still refreshes itself; nothing else to do; note it in the log.
- **Planet's resolution changes** (a restart with a different `--f`) — trigger: PC Claude's note of a new `f`, or `/api/meta`'s `frequency` not 32. Action: purge `planet.anjaneyaworkshop.co.uk/api/grid` at Cloudflare (the edge keeps the grid a day; nginx only a second). A new seed at f=32 needs nothing.
- **Nameserver leftover at BT** (W2): one BT resolver still sometimes asks Porkbun, whose parking answer (207.207.210.x, `openresty`) fails TLS. Seen again 24 Sep evening (1 lookup in 6 for `planet.`; Jamie's Chrome showed `ERR_QUIC_PROTOCOL_ERROR`); Jamie chose to wait rather than bridge with records at Porkbun (W3-h). Trigger: still seen after 26 Sep. Action: ask Porkbun to drop the old records; until then re-run a red Phase 0 once and check `%{remote_ip}`.
