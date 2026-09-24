# Workshop — Coverage Plan

*Drafted 24 September 2026 alongside `Workshop-Strategic-Plan.md` (the charter — read that first for what the Workshop is and why it is shaped this way). Status: **active** — Phase 0 opened by W1 (24 Sep 2026) after Jamie's first decision round. Estimates are evening sessions of the kind Jamie's projects already run; they are sized for "quality always wins", not for speed.*

## What this doc is

The multi-session execution plan for the site. Phases are **live milestones with checkable gates**, not feature lists. A phase closes when its gate passes on the public address and Jamie's walk (laptop and phone) clears it, in that order. Per the charter, the planet goes public first (Phases 1–2); the rooms follow; the rented server is optional and last but one.

Same discipline as Planet's layers: no side-quests mid-phase. Tempting items go to Active-Work's queues.

## Who does what

"Laptop Claude" is the Cowork or Code-tab session on the laptop: it writes everything and makes every commit but one kind. "PC Claude" is Claude Code on Garcks-PC: it runs `frontdoor/RUNBOOK.md` steps, and commits only `frontdoor/state/` (CLAUDE.md rule 16). Jamie holds the accounts and rules at the decision round. A phase that needs both Claudes is written so laptop Claude's part lands first and PC Claude's step is one runbook section.

## Phase sequence

### Phase 0 — Ground (1 session)

No site code. Everything the site needs to exist well.

- **Git.** `git init` in this folder; the quartet, `.gitignore` and this plan as the first commit; a private remote at `github.com/JGarcks/anjaneyaworkshop` (P0-b); laptop Claude's public key added as a read-write deploy key; `git push`. Verify nothing under `.gitignore`'s shapes is tracked before the first push (rule 13).
- **Cloudflare.** Jamie makes the account and adds both domains; the nameservers at Porkbun are pointed at Cloudflare's; DNS records for the apex and `www`; the `.com` zone set to redirect every path to the `.co.uk`. A holding page (one dark screen, the name, nothing else) deployed to Pages from `site/` so both addresses answer over HTTPS. The holding page is not the landing page and is replaced in Phase 2.
- **Scaffold.** `site/package.json` with Vitest and one passing test (the restart rule's simplest case); `scripts/check-public.sh` with the Phase 0 checks only (HTTPS on both addresses, the redirect).
- **Planet's queue.** The request for its §8 amendment (WS · D1) written into Planet's PROGRESS queue by a Planet session at Jamie's word — not by a Workshop session (rule 8).
- **Quartet in place.** `CLAUDE.md` loads when this folder is the open project; the first session confirms it does and records the decision round in `../decisions.md`.

**Gate:** `https://anjaneyaworkshop.co.uk` and `https://anjaneyaworkshop.com` both answer over HTTPS; the `.com` redirects; `npm test` in `site/` runs one passing test; the repo is on the remote with the quartet in it.

### Phase 1 — The front door (1–2 sessions, one PC Claude step)

Planet on the internet, read-only, with Planet untouched.

- **nginx config** (`frontdoor/nginx.conf`, with its header): local listen port; `proxy_pass` to 8080; GET/HEAD only, 405 otherwise; gzip for JSON and `application/octet-stream`; a one-second micro-cache keyed on the path alone, `proxy_cache_lock` so simultaneous misses collapse; `Cache-Control` rewritten to `public, max-age=1`, a day for `/api/grid`; `X-Planet-Tick` passed through; `Access-Control-Allow-Origin` for the `.co.uk`; a per-address rate limit with a short burst.
- **Tunnel config** (`frontdoor/config.yml`): the named tunnel's ingress, `planet.anjaneyaworkshop.co.uk` → nginx's local port, everything else 404. The tunnel's credentials never enter the repo (rule 13); `secrets-map.md` says where they live.
- **Runbook** (`frontdoor/RUNBOOK.md`): install nginx and cloudflared; create the named tunnel and its DNS route; install both as services starting at boot; `nginx -t`; start; the `curl` lines that prove each header; what to write into `frontdoor/state/`. Written for PC Claude, step by step, nothing else in it.
- **PC Claude's step:** runs the runbook; commits `frontdoor/state/garcks-pc.md` (installed commit, date, `nginx -t` output, service status, the curl results); pushes.
- **`scripts/check-public.sh`** gains the Phase 1 assertions (the Budget section of the charter): gzip, `max-age=1`, `X-Planet-Tick`, 405 on POST, edge cache hit on the second fetch within a second, and the origin request rate read from the engine's serve log (PC Claude pastes the count into `state/`).
- **Retire PolicyRAG's quick tunnel** (W2-e: retired; folding it in would put an unstripped work app on the domain before Phase 5) — RUNBOOK step 8.
- **Cloudflare Cache Rule** on the planet subdomain (W2): without it Cloudflare treats the API as dynamic and caches nothing, whatever the door's label says. Eligible for cache, Edge TTL from the origin's `Cache-Control`, **Browser TTL set to respect origin** (unset, the zone's 4-hour default overrides `max-age=1`), query strings ignored.

**Gate:** `https://planet.anjaneyaworkshop.co.uk/` shows the live viewer from a phone on mobile data; `check-public.sh` passes every Phase 1 assertion; the engine's own log shows about one request per URL per second while three browsers watch; Jamie's walk: the viewer through the door looks the same as on the LAN kiosk, allowing for the once-a-second snapshot (WS · D4).

**If the gate fails:** the session writes up *why* (cache misses? compression? the tunnel? the rate limit?) in `docs/process/progress/`, and the next session changes the approach — not the budget.

### Phase 2 — The landing page (2–3 sessions)

The dark hub, live.

- **The page** (`site/index.html`, style and script, with headers): background `#0b0e14`; the viewer framed with the panel hidden; the name top left; the live line under the globe from `/api/meta` every few seconds (age in billions of years, land share, highest peak); the links, low-contrast off-white, brightening on hover, each with a small mark; no scroll; the globe draggable, resuming its own turn when released.
- **The behaviours:** the still shown before the grid arrives and fading into the live picture; the still with "last seen at" when the door cannot be reached; "resumed" on a lower tick (rule 12); phone layout (globe full width, links beneath).
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

- **WS · D7** decided at this phase's decision round with the numbers then: move the engine or only the front door.
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
| 1 The front door | in progress | 24 Sep 2026 (W2) | | Public since 24 Sep ~17:30 BST; check-public 17/17; waiting on RUNBOOK steps 7–8, the three-browser rate and Jamie's walk. Limitation: the "any audience" budget holds for the fields the page draws; a visitor switching the full viewer through all 13 fields adds ~20–35 KB/s per field per Cloudflare location — measured at the gate |
| 2 The landing page | not started | | | |
| 3 BlockByBlock's room | not started | | | Needs the new name (WS · D5) |
| 4 The rented server | not started | | | optional; WS · D7 |
| 5 The work apps | not started | | | Needs Jamie's strip list per app |

— end —
