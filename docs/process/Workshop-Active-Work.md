# Workshop — Active Work

> **Single source of truth for the next session.** Just the live pointer + truly cross-session queues.
>
> Closed session entries belong in `progress/YYYY-MM.md`, never here. Phase plans and design content belong in `Workshop-Coverage-Plan.md` (the arc) or `Workshop-Strategic-Plan.md` (charter). If this doc grew by more than ~30 lines during the session, move the bulk out before commit (CLAUDE.md rule 6).

---

## Currently working on

**Phase 0 — Ground: closed (W1).** **Phase 1 — the front door: closed (W2, 24 Sep 2026).** The planet is public at `planet.anjaneyaworkshop.co.uk` through nginx and a named tunnel on Garcks-PC (`frontdoor/`, installed state in `frontdoor/state/garcks-pc.md`). `check-public.sh` 17/17; the gate with three browsers: 28.9 KB/s up the line (budget 600), 0.48 engine fetches per address per second; Jamie's walk: smooth on the laptop and the phone. Detail: `progress/2026-09.md` §W2.

**Phase 2 — the landing page: open (W3, 24 Sep 2026).** The hub is live at `anjaneyaworkshop.co.uk`: the planet full screen behind the words, the still before it and when the house is away, the live line at the bottom. Decisions W3-a…g all taken (`decisions.md`); 51 tests; check-public 17/17. Detail: `progress/2026-09.md` §W3.

**Next build session: W4 — Phase 2 continued** (Coverage Plan §Phase 2): the daily GitHub Action for the still (W3-e; rule 16 gains a still-only bot), `check-public.sh` Phase 2 (framing allowed, still under a day old, time to first picture — W3-f), screens of the still and "resumed" states, the gate. Its decision round: **how often the still is retaken** (the planet moves ~0.9 billion years an hour, so a day-old still is another world and the fade morphs one into the other); **drop the 56 px crop and the 2.5 s wait** once Planet's `?embed` lands.

**Pending Jamie, in order:**
1. Look at `anjaneyaworkshop.co.uk` on the laptop and a phone on mobile data, and say what you saw (the walk).
2. If not already done: relay the `?embed` request (the very end of `Desktop/for-laptop-claude.txt`, W3-a) to the Planet session working on the zoom request.
3. WS · D5, the new name for BlockByBlock — needed by Phase 3; it fixes a subdomain and a repo name.

**Standing:** teaching is the decision round only; no explain-back during the build — headers in the code (rule 14); laptop Claude commits, PC Claude only `frontdoor/state/` (rule 16); changes to the door go through `install.sh` (Jamie's `sudo`) and PC Claude's checks; Planet is never edited here (rule 8).

---

## Booked for the decision round after Phase 2 closes (Jamie, 24 Sep 2026)

1. **A livelier picture — WS · D13** (paid Cloudflare plan, checked first, or a push relay). 2. **Not local — WS · D7** (a rented server: the engine, or only the door). Trade-offs and prices: Strategic Plan §WS · D7, D13; priced with that day's numbers.

## Queued (cross-session, ride-alongside — pick when a session is already in the relevant file)

- **Trim CLAUDE.md** from 15.6 KB toward the 12 KB budget (rule 6) at the first session that touches it; the About Jamie section is the long one.
- **A second, stable planet instance** on `main` with its own world file and port, as a one-line nginx repoint — only if Jamie ever wants the site not to follow the experiments (WS · D2).
- **Phone zoom** (Jamie's walk, W2): the viewer sizes the globe to the screen's height, so a portrait phone sees only the middle (`docs/screens/phase-1/phone-390x844-default.png`). The hub is unaffected (it sets its own `?zoom=`, W3); the Planet room at `planet.` still opens zoomed on a phone until the Planet session's fix lands (relayed 24 Sep; being worked).
- **The 3D viewer**: when Planet's three.js viewer exists (its brief, after Layer 3), the landing page adopts it. Note only.

## Held for triggers

- **A restart caught mid-visit** — trigger: the "resumed" state showing more than once a day in the check log. Action: read Planet's `journalctl --user -u planet` with PC Claude; nothing on the site changes.
- **The world moving to a new build or seed** — trigger: PC Claude reporting a restart from year zero in `frontdoor/state/`. Action: the still refreshes itself; nothing else to do; note it in the log.
- **Planet's resolution changes** (a restart with a different `--f`) — trigger: PC Claude's note of a new `f`, or `/api/meta`'s `frequency` not 32. Action: purge `planet.anjaneyaworkshop.co.uk/api/grid` at Cloudflare (the edge keeps the grid a day; nginx only a second). A new seed at f=32 needs nothing.
- **Nameserver leftover at BT** (W2): one BT resolver still sometimes asks Porkbun, whose parking answer (207.207.210.x, `openresty`) fails TLS. Seen again 24 Sep evening (1 lookup in 6 for `planet.`; Jamie's Chrome showed `ERR_QUIC_PROTOCOL_ERROR`); Jamie chose to wait rather than bridge with records at Porkbun (W3-h). Trigger: still seen after 26 Sep. Action: ask Porkbun to drop the old records; until then re-run a red Phase 0 once and check `%{remote_ip}`.
