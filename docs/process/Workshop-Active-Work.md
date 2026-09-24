# Workshop — Active Work

> **Single source of truth for the next session.** Just the live pointer + truly cross-session queues.
>
> Closed session entries belong in `progress/YYYY-MM.md`, never here. Phase plans and design content belong in `Workshop-Coverage-Plan.md` (the arc) or `Workshop-Strategic-Plan.md` (charter). If this doc grew by more than ~30 lines during the session, move the bulk out before commit (CLAUDE.md rule 6).

---

## Currently working on

**Phase 0 — Ground: closed (W1, 24 Sep 2026); Jamie's walk passed on the laptop and the phone on cellular.** The repo is on `github.com/JGarcks/anjaneyaworkshop` (private); Pages builds `site/` on every push to `main` and runs `npm test` first; `check-public.sh` 6/6 (HTTPS, http→https, www→bare, `.com`→`.co.uk` with path). Detail: `progress/2026-09.md` §W1.

**In flight: W2 — Phase 1, the front door.** Laptop Claude's half is done and pushed: `frontdoor/` (nginx.conf, config.yml, the two service files, install.sh, door-rate.sh, RUNBOOK.md), `check-public.sh` Phase 1, and the Cloudflare Cache Rule "Planet: cache the door's replies (W2)" — **in place, Active** (so RUNBOOK step 6 may run). Decisions W2-a…e in `../decisions.md`.

**The planet is public** at `planet.anjaneyaworkshop.co.uk` (RUNBOOK steps 1–6 done by PC Claude; tunnel ID committed; Cache Rule's Browser TTL fixed to respect origin). `check-public.sh` 17/17 at 16:34 UTC.

**Still to do:** PC Claude runs RUNBOOK steps 7 (delete `cert.pem`) and 8 (retire the quick tunnel) and reports; then Jamie's walk (the viewer through the door vs the LAN kiosk, phone on mobile data); the gate's three-browser `door-rate.sh`; close Phase 1 or write up why not.

**Pending Jamie, in order:**
1. Run the hand-off above with PC Claude.
2. WS · D5, the new name for BlockByBlock — needed by Phase 3; it fixes a subdomain and a repo name.

*(Done: Planet's §8 amendment — Planet session SC-d recorded it as WEB D1, Planet commit 463115f.)*

**Standing:** teaching is the decision round only; no explain-back during the build — headers in the code (rule 14); laptop Claude commits, PC Claude only `frontdoor/state/` (rule 16); Planet's own quartet is *not* edited by Workshop sessions (rule 8) — the §8 amendment for WS · D1 is a request for a Planet session, written when D1 is agreed.

---

## Queued (cross-session, ride-alongside — pick when a session is already in the relevant file)

- **Trim CLAUDE.md** from 15.6 KB toward the 12 KB budget (rule 6) at the first session that touches it; the About Jamie section is the long one.
- **A second, stable planet instance** on `main` with its own world file and port, as a one-line nginx repoint — only if Jamie ever wants the site not to follow the experiments (WS · D2).
- **Phone zoom** (Jamie's walk, W2): the viewer sizes the globe to the screen's height (`view.zoom` 0.9), so on a portrait phone it overflows the width. Phase 2's frame passes `?zoom=` for its shape (0.42 fits at 375×812, checked); the proper fix — fit the narrower side — is Planet's code: a request for a Planet session at Jamie's word (rule 8).
- **The 3D viewer**: when Planet's three.js viewer exists (its brief, after Layer 3), the landing page adopts it. Note only.
- **The renamed BlockByBlock's mark** for the hub, and a light room for it using the block graphic. Phase 3.
- **ClaimsDesk and PolicyRAG**: what to strip is Jamie's list; nothing from them touches the site before Phase 5.
- **If PC Claude's step 8 finds PolicyRAG's quick tunnel is started from PolicyRAG's own repo:** write a request into PolicyRAG's queue for a PolicyRAG session (rule 8). Retiring it is decided (W2-e) and is RUNBOOK step 8.

## Held for triggers

- **The rented server (Phase 4)** — trigger: the house's downtime showing on the site more than Jamie likes, or Jamie wanting Garcks-PC off. Then WS · D7.
- **Livelier public picture** — at the next decision round (Jamie, W2 walk: smooth, but the sea's twinkle and plate movement subtler than the kiosk; "not a major issue for now"). Measured: a picture every ~2.2 s (door + edge stack). First option: the door holds nothing (≈1.1 s, ~3 ticks; more engine requests, same upload) — a change to WS · D4, Jamie's.
- **Sub-second snapshots for visitors** — trigger: Jamie finding the once-a-second picture visibly steppier than the LAN kiosk. Action: measure it first; then a paid Cloudflare plan or a push relay, put to Jamie.
- **A restart caught mid-visit** — trigger: the "resumed" state showing more than once a day in the check log. Action: read Planet's `journalctl --user -u planet` with PC Claude; nothing on the site changes.
- **The world moving to a new build or seed** — trigger: PC Claude reporting a restart from year zero in `frontdoor/state/`. Action: the still refreshes itself; nothing else to do; note it in the log.
- **Planet's resolution changes** (a restart with a different `--f`) — trigger: PC Claude's note of a new `f`, or `/api/meta`'s `frequency` not 32. Action: purge `planet.anjaneyaworkshop.co.uk/api/grid` at Cloudflare (the edge keeps the grid a day; nginx only a second). A new seed at f=32 needs nothing.
- **Nameserver move still reaching BT** — found W2: Porkbun's `maceio.ns.porkbun.com` still answers with its parking addresses (207.207.210.229/.107, `openresty`), and BT's 81.139.57.100 sometimes still asks it, so the laptop now and then gets a TLS failure on the `.co.uk`, `www`, the `.com` or `planet.`. The registry and BT's NS answer say Cloudflare; it clears as BT's cache expires (≤ 48 h from 24 Sep morning). Trigger: still seen after 26 Sep. Action: then ask Porkbun to drop the zone's old records; before then, nothing — re-run a red Phase 0 once, and check `%{remote_ip}` before believing it.
- **A `.com` visitor** — trigger: the redirect log showing real traffic to the `.com`. Action: none; it is working.
