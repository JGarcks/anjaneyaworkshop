# Workshop — Coverage Plan

*Drafted 24 September 2026 alongside `Workshop-Strategic-Plan.md` (the charter — read that first for what the Workshop is and why it is shaped this way). Status: **active** — Phase 0 opened by W1 (24 Sep 2026) after Jamie's first decision round. Estimates are evening sessions of the kind Jamie's projects already run; they are sized for "quality always wins", not for speed.*

## What this doc is

The multi-session execution plan for the site. Phases are **live milestones with checkable gates**, not feature lists. A phase closes when its gate passes on the public address and Jamie's walk (laptop and phone) clears it, in that order. Per the charter, the planet goes public first (Phases 1–2); the rooms follow; the rented server is optional and last but one.

Same discipline as Planet's layers: no side-quests mid-phase. Tempting items go to Active-Work's queues.

## Who does what

"Laptop Claude" is the Cowork or Code-tab session on the laptop: it writes everything and makes every commit but one kind. "PC Claude" is Claude Code on Garcks-PC: it runs `frontdoor/RUNBOOK.md` steps, and commits only `frontdoor/state/` (CLAUDE.md rule 16). Jamie holds the accounts and rules at the decision round. A phase that needs both Claudes is written so laptop Claude's part lands first and PC Claude's step is one runbook section.

## Phase sequence

### Phase 0 — Ground — closed (W1, 24 Sep 2026)

Git, Cloudflare (both domains, Pages from `site/`), the scaffold and first test, `check-public.sh` Phase 0. Detail: `progress/2026-09.md` §W1.

### Phase 1 — The front door — closed (W2, 24 Sep 2026)

nginx and a named tunnel on Garcks-PC (`frontdoor/`: config, service files, `install.sh`, `RUNBOOK.md`, `state/`); a Cloudflare Cache Rule on `planet.` (eligible, Edge TTL from origin, **Browser TTL respect origin** — unset, the zone's 4 h wins — query strings ignored); meta and fields `public, max-age=0, s-maxage=1` (W2-f); `check-public.sh` Phase 1 (eleven assertions). Gate: 17/17; 28.9 KB/s up and 0.48 engine fetches per address per second with three browsers; walk smooth on laptop and phone. Limits carried: a picture every ~2.2 s (the edge's own refresh), subtler than the kiosk; the budget covers the fields the page draws, not a visitor cycling all thirteen. Detail: `progress/2026-09.md` §W2.

### Phase 2 — The landing page (2–3 sessions) — open (W3, 24 Sep 2026)

The dark hub, live. *W3 built and deployed the page, the line, the fallbacks and a hand-taken still (decisions W3-a…g: full-screen frame, words at the very bottom, still after ~10 s of failures, a daily GitHub Action for the still). Limitations until Planet's `?embed` lands: the frame is cropped 56 px past every edge to hide the viewer's corner buttons, a tap on the globe can still open the viewer's cell table (partly visible), and the live picture waits a fixed 2.5 s after the frame loads (live at ~3.5 s; the still at 0.7 s). W4: the Action, check-public Phase 2, the three-state screens, the gate.* *W4 (24 Sep) built the look change, the handover through the dark, the daily still Action and check-public Phase 2 (24/24); Planet's `?embed` went live (WEB · D5) and the gate's restart half passed. Open: the planet's movement ("too drawn out", Jamie — W5 first), the hub's side of `?embed` (crop off, zoom by message), the live globe within 2 s, the network-unplug half and the walk.*

- **The page** (`site/index.html`, style and script, with headers): background `#0b0e14`; the viewer framed with the panel hidden; the name top left; the live line under the globe from `/api/meta` every few seconds (age in billions of years, land share, highest peak); the links, low-contrast off-white, brightening on hover, each with a small mark; no scroll; the globe draggable, resuming its own turn when released.
- **The behaviours:** the still shown before the grid arrives and fading into the live picture; the still with "last seen at" when the door cannot be reached; "resumed" on a lower tick (rule 12); phone layout (globe full width, links beneath; the frame passes `?zoom=` for its shape, since the viewer sizes the globe to the height — W2 walk).
- **The still:** `scripts/still-refresh` fetches the viewer's `?still` picture through the door on a schedule (a Pages build hook or a GitHub Action, Jamie's call at the decision round) and commits it, so the fallback is never older than a day.
- **Tests:** the restart rule, the fallback, the live line's formatting, the link set. `check-public.sh` gains time-to-first-picture and the "resumed" check.
- **Deploy:** Pages builds from `site/` on every push to `main`; the holding page from Phase 0 is replaced.
- **Screens:** `docs/screens/phase-2/` — laptop and phone, the three states (live, still, resumed).

**Gate:** Jamie opens the page on the laptop and a phone and the planet is turning within 2 s on the home connection; unplugging Garcks-PC's network for a minute shows the still and "last seen", and the page recovers by itself; a restart of `planet.service` (PC Claude, at Jamie's word) shows "resumed" without a reload; every test green; Jamie's walk recorded.

### Phase 3 — The first room: BlockByBlock, renamed (2 sessions)

- **The name first** (WS · D5): applied in its own repo by a BlockByBlock session (rule 8), and to the subdomain, before anything here.
- **The room:** its built files deployed to Pages at `<name>.anjaneyaworkshop.co.uk` from its own repo (re-run `check-public.sh` after Pages reports the domain Active: W1 saw the bare address with no certificate for a few minutes during the switchover); the block graphic as its emblem; the "Not an official Minecraft product" line in the room; its 504 tests in its deploy.
- **The hub:** its mark and link appear on the landing page — the first link with a room behind it.
- **The scan:** the room's build output scanned for Mojang assets before it ships (rule 7).

**Gate:** a schematic drops in and a guide builds, on the public address, on the laptop and a phone; the scan is clean; the hub's link works; Jamie's walk.

### Phase 4 — The rented server (2–3 sessions, optional)

*Booked (Jamie, 24 Sep 2026): WS · D7 and WS · D13 (a livelier picture) are put at the decision round after Phase 2 closes, priced then; if Jamie says go, this phase may run before Phase 3.*

- **WS · D7** decided with the numbers then: move the engine or only the front door.
- **WS · D13** decided alongside: a paid Cloudflare plan, a push relay (easier from a server), or neither.
- **A VPS** (Hetzner or similar, Europe); the front door's nginx and, if the engine moves, Planet's service and world file; the tunnel retired if the engine moves, kept if not; one DNS record changed.
- **Runbooks** for the move and for the move back; `secrets-map.md` gains the VPS key.
- **If the engine moves:** Planet's golden-seed test run on the new machine first, per Planet's own queue; the result recorded.

**Gate:** the Phase 1 gate again from the new address, and Garcks-PC switched off for an hour with the site unchanged.

### Phase 5 — The work apps (2–3 sessions each)

- **What to strip** is Jamie's list, per app, made before the session.
- **The room** for each, deployed from its own repo once stripped; nothing from either touches the site before then, screenshots included.

**Gate:** nothing Aviva-branded or Aviva-worded in the deployed files, checked by a search of the build output; Jamie's sign-off; the hub's link works.

### The how-it-works page (after Phase 1; a session of its own or the tail of one)

`docs/how-workshop-works.html`: one request followed from a phone to the engine and back — DNS, TLS at the edge, the edge cache (hit or miss), the tunnel, nginx's micro-cache, the engine's reply, `X-Planet-Tick`, gzip on the way back — with the real headers, byte counts and timings from a real run, one panel per hop. Extended a phase per session as Planet's is (WS · D12).

## Effort summary

| Phase | Sessions | Cumulative |
|---|---|---|
| 0 Ground | 1 | 1 |
| 1 The front door | 1–2 | 3 |
| 2 The landing page | 2–3 | 6 |
| 3 BlockByBlock's room | 2 | 8 |
| 4 The rented server (optional) | 2–3 | 11 |
| 5 The work apps | 2–3 each | 15 |

Roughly six evening sessions to the planet live on the landing page; the rest as Jamie wants them. The estimates carry the "quality always wins" weighting; do not compress them to hit a date.

## Per-phase verification workflow

Mirrors CLAUDE.md's three-group structure.

**Automated checks (run first, all must pass):**

1. `npm test` in `site/` — green.
2. `nginx -t` on Garcks-PC — clean (PC Claude, reported in `frontdoor/state/`), when `frontdoor/` changed.
3. `scripts/check-public.sh` — every assertion for the phases closed so far passes against the public address.
4. The link check over the deployed site, when any link or subdomain changed.
5. The Mojang-asset scan of a room's build output, when a room ships.

**Review (eyeball, not commands):**

6. Open the site on the dev server and on the public address; screenshot the laptop and a phone into `docs/screens/<phase>/` and compare with the previous phase's set. The framed viewer must look the same as the viewer on the LAN.
7. Jamie's walk, recorded under *The walk* in the progress log.

**Wrap-up:**

8. Progress-log entry; decisions rows; Active-Work pointer; this doc's phase status; CLAUDE.md only if a rule was learned.
9. Commit, named for the session and its numbers (laptop Claude's).

## Queues

Live in `Workshop-Active-Work.md` (ride-alongside items and held-for-triggers) — that file is the single home.

## Relationship to other docs

- `Workshop-Strategic-Plan.md` — the charter: purpose, principles, decisions log, the experience, architecture, reuse map, budget, IP line, risks, costs. This doc executes it.
- `Workshop-Active-Work.md` — names the phase in flight, what is pending Jamie, and holds the two queues.
- `../decisions.md` — the decisions table.
- `../../CLAUDE.md` — the rules and the verification workflow.
- `../archive/WEBSITE_PLAN.md` — the planning session's single document, superseded by this doc and the charter on 24 Sep 2026.
- Planet's `CLAUDE.md` and `docs/PROJECT_BRIEF.md` §8 — what the site must respect; never edited from here (rule 8).

## Phase status (the live pointer for this arc)

| Phase | Status | Opened | Closed | Notes |
|---|---|---|---|---|
| 0 Ground | closed | 24 Sep 2026 (W1) | 24 Sep 2026 (W1) | check-public 6/6; npm test 1/1 locally and in the Pages build; walk passed on laptop and phone (cellular). Limitation: no phone screenshot on file (headless Edge crops below ~500 px) |
| 1 The front door | closed | 24 Sep 2026 (W2) | 24 Sep 2026 (W2) | Public since ~17:30 BST; check-public 17/17; gate: 28.9 KB/s up, 0.48 engine fetches/address/s with three browsers; walk smooth on laptop and phone (after W2-f). Pictures every ~2.2 s (Cloudflare's edge refresh), subtler than the kiosk — held. Limitation: the "any audience" budget holds for the fields the page draws; a visitor switching the full viewer through all 13 fields adds ~20–35 KB/s per field per Cloudflare location — measured at the gate |
| 2 The landing page | open | 24 Sep 2026 (W3) | | Live; 64 tests; check-public 29/29 (Phase 2: browsers re-check, framing, still under 26 h, time to first picture 0.37–0.53 s by fetches; W8: the picture and what the door holds). W8: the still until "drawn" (live at 1.76 s headless, upright phone), a turn by message, no reload. Daily still Action green. Gate: restart half passed (W4); network half, the 2 s line and the walk open. Limitation: the public picture's pace and pauses (W4 monitor; Planet request items 7–9; items 7 and 10 live 24 Sep, W5-a…c: a picture every ~1.05 s, no freezes; the spin awaits Jamie's walk). W7: colour per cell requested (Planet item 16, parked). W8 did the hub's half; the Planet half and the gate's rest are W9, after item 16 |
| 3 BlockByBlock's room | not started | | | Needs the new name (WS · D5) |
| 4 The rented server | not started | | | optional; WS · D7 |
| 5 The work apps | not started | | | Needs Jamie's strip list per app |

— end —
