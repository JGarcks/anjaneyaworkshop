# Workshop — Active Work

> **Single source of truth for the next session.** Just the live pointer + truly cross-session queues.
>
> Closed session entries belong in `progress/YYYY-MM.md`, never here. Phase plans and design content belong in `Workshop-Coverage-Plan.md` (the arc) or `Workshop-Strategic-Plan.md` (charter). If this doc grew by more than ~30 lines during the session, move the bulk out before commit (CLAUDE.md rule 6).

---

## Currently working on

**Phase 0 — Ground: closed (W1).** **Phase 1 — the front door: closed (W2, 24 Sep 2026).** The planet is public at `planet.anjaneyaworkshop.co.uk` through nginx and a named tunnel on Garcks-PC (`frontdoor/`, installed state in `frontdoor/state/garcks-pc.md`). `check-public.sh` 17/17; the gate with three browsers: 28.9 KB/s up the line (budget 600), 0.48 engine fetches per address per second; Jamie's walk: smooth on the laptop and the phone. Detail: `progress/2026-09.md` §W2.

**Next build session: W3 — Phase 2, the landing page** (`Workshop-Coverage-Plan.md` §Phase 2). Its decision round will include: **confirm or undo W2-f** (browsers keep no copy; Claude's, check-settled); **how the still is refreshed** (Pages build hook or GitHub Action); **the frame's `?zoom=`** on a phone; **a livelier picture** (see Held).

**Pending Jamie, in order:**
1. Hand the phone-zoom request (end of `Desktop/for-laptop-claude.txt`) to a Planet session (rule 8).
2. WS · D5, the new name for BlockByBlock — needed by Phase 3; it fixes a subdomain and a repo name.

**Standing:** teaching is the decision round only; no explain-back during the build — headers in the code (rule 14); laptop Claude commits, PC Claude only `frontdoor/state/` (rule 16); changes to the door go through `install.sh` (Jamie's `sudo`) and PC Claude's checks; Planet is never edited here (rule 8).

---

## Queued (cross-session, ride-alongside — pick when a session is already in the relevant file)

- **Trim CLAUDE.md** from 15.6 KB toward the 12 KB budget (rule 6) at the first session that touches it; the About Jamie section is the long one.
- **A second, stable planet instance** on `main` with its own world file and port, as a one-line nginx repoint — only if Jamie ever wants the site not to follow the experiments (WS · D2).
- **Phone zoom** (Jamie's walk, W2): the viewer sizes the globe to the screen's height, so a portrait phone sees only the middle (`docs/screens/phase-1/phone-390x844-default.png`). Phase 2's frame passes `?zoom=` for its shape (0.42 fits at 390×844); the proper fix is requested of a Planet session (Desktop note, 24 Sep).
- **The 3D viewer**: when Planet's three.js viewer exists (its brief, after Layer 3), the landing page adopts it. Note only.
- **The renamed BlockByBlock's mark** for the hub, and a light room for it using the block graphic. Phase 3.
- **ClaimsDesk and PolicyRAG**: what to strip is Jamie's list; nothing from them touches the site before Phase 5.

## Held for triggers

- **The rented server (Phase 4)** — trigger: the house's downtime showing on the site more than Jamie likes, or Jamie wanting Garcks-PC off. Then WS · D7.
- **A livelier public picture** (W2 walk: smooth, but twinkle and plate movement subtler than the kiosk; "not a major issue for now"). A picture every ~2.2 s is Cloudflare's own refresh at `s-maxage=1` (gate: 0.48 edge asks per address per second), not the door's. Trigger: Jamie wanting it. Action: a paid plan or a push relay, measured first, put to Jamie.
- **A restart caught mid-visit** — trigger: the "resumed" state showing more than once a day in the check log. Action: read Planet's `journalctl --user -u planet` with PC Claude; nothing on the site changes.
- **The world moving to a new build or seed** — trigger: PC Claude reporting a restart from year zero in `frontdoor/state/`. Action: the still refreshes itself; nothing else to do; note it in the log.
- **Planet's resolution changes** (a restart with a different `--f`) — trigger: PC Claude's note of a new `f`, or `/api/meta`'s `frequency` not 32. Action: purge `planet.anjaneyaworkshop.co.uk/api/grid` at Cloudflare (the edge keeps the grid a day; nginx only a second). A new seed at f=32 needs nothing.
- **Nameserver leftover at BT** (W2): one BT resolver still sometimes asks Porkbun, whose parking answer (207.207.210.x, `openresty`) fails TLS. Trigger: still seen after 26 Sep. Action: ask Porkbun to drop the old records; until then re-run a red Phase 0 once and check `%{remote_ip}`.
