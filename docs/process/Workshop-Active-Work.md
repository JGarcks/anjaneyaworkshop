# Workshop — Active Work

> **Single source of truth for the next session.** Just the live pointer + truly cross-session queues.
>
> Closed session entries belong in `progress/YYYY-MM.md`, never here. Phase plans and design content belong in `Workshop-Coverage-Plan.md` (the arc) or `Workshop-Strategic-Plan.md` (charter). If this doc grew by more than ~30 lines during the session, move the bulk out before commit (CLAUDE.md rule 6).

---

## Currently working on

**Phases 0–1 closed (W1, W2).** **Phase 2 — the landing page: open.** Live at `anjaneyaworkshop.co.uk`: the name and the Planet link top left, the line at the bottom, the planet full screen behind, the still handing over through the dark, the still retaken daily by GitHub (11:17 UTC). 57 tests; check-public 24/24. Planet's `?embed` (WEB · D5) live since 21:45 on 24 Sep. Detail: `progress/2026-09.md` §W3, §W4.

**Next build session: W5 — the planet's movement, then the gate.** Start here:
1. **The glide's feel (Jamie, end of W4): "too drawn out — too slow and still not keeping up with itself"** after Planet's `?embed` glide change (2.5 pictures behind, 5 s). Measure before touching anything: `scripts/hub-monitor.mjs` (pictures reaching the viewer; before the change: median 2.1 s apart, 7 stalls of 3.1–3.5 s and one 14 s freeze in 5 min) plus the viewer's own timing readout (share of frames at rest). Any fix is Planet's (`docs/process/requests/planet-embed.md`); item 7 (the four fields as one request) is the real cure for both pace and freezes.
2. **The hub's side of `?embed`:** drop the 56 px crop; send `{ planet: 'zoom' }` on a phone turn instead of reloading; re-time the live globe with "drawn" (unloaded laptop — W4's try ran under three browsers).
3. **The gate's rest:** the network unplugged a minute, `door-rate.sh 60` (Desktop Claude), Jamie's walk incl. pinch-out on the phone. The restart half passed in W4 ("resumed" 2 s after the restart, no reload).

**Pending Jamie:** who takes Planet item 7, and when · swipe-to-refresh: leave it, or try the top strip catching the pull (real phone only) · WS · D5, BlockByBlock's new name (Phase 3).

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
