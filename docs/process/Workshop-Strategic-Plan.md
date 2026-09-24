# Workshop — Strategic Plan

*Stable charter. Drafted 24 September 2026 (Fable 5.1 planning session with Jamie in Cowork; no code). Split from `WEBSITE_PLAN.md` (now `docs/archive/`) the same day when the folder got its own quartet. Status: **active charter** — WS · D1, D4 and D8 were Claude's proposals and Jamie agreed all three at W1's decision round (24 Sep 2026); the rest were agreed in the planning session's chat. All are recorded in `../decisions.md`. Companion execution plan: `Workshop-Coverage-Plan.md`; next-thing pointer: `Workshop-Active-Work.md`; rules: `../../CLAUDE.md`.*

> **Read this doc for "what is the Workshop and why is it shaped this way."** For "what are we doing next session," read Active-Work and the Coverage Plan.

---

## Purpose

anjaneyaworkshop.co.uk is Jamie's front door: a dark, single-screen page with the live planet turning in the middle of it, one line of live numbers, and quiet links to the apps, each in its own room on its own subdomain. Two things it must do:

1. **Show the planet, live.** Jamie's own planet — the one on Garcks-PC, experiments included — turning on the page, a moment behind the engine, for anyone who opens the address. Planet itself is never changed by this project; a read-only front door stands between it and the internet.
2. **Give the apps a home.** BlockByBlock (renamed) first; ClaimsDesk and PolicyRAG once the Aviva material is out. Each is its own room with its own character; the hub stays quiet.

The name Anjaneya came with Jamie's yoga-teacher qualification. The site does not need to tell that story.

## Jamie's stipulations → design principles

1. **Quality from the first line.** No holding page that becomes the site. The front door, the landing page and the repo are built to ship standard from session one: tested, checked, documented.
2. **Planet is shown, not touched.** The engine keeps listening on the home LAN alone (Planet's brief §8); the site takes its public API through a front door and frames its viewer. Nothing Planet's owner does — a restart, a new seed, a new build — is a problem for the site; the site follows.
3. **Quality always wins.** When a shortcut and the right way disagree, the right way wins and the schedule moves. The Coverage Plan's estimates are sized for that.
4. **Nothing on the internet can write.** GET and HEAD only at the door; no accounts, no forms, no database, no analytics. This is what keeps hosting free and the attack surface a single read-only path.
5. **Own art, own names.** No Mojang asset or name anywhere on the site; the renamed BlockByBlock's room carries the disclaimer, the hub carries nothing Minecraft-shaped beyond that app's small mark.

## Decisions log

Each decision records the choice, the reasoning, and what it would take to overrule it. The table of record is `../decisions.md`.

### WS · D1 — Planet on the internet: a read-only front door; the engine stays LAN-only (agreed, W1)

**Choice.** nginx on Garcks-PC in front of Planet's port 8080, exposed through a named cloudflared tunnel at `planet.anjaneyaworkshop.co.uk`. The engine's own bind and behaviour do not change. Planet's brief §8 ("never exposed to the internet") is amended, by a Planet session at Jamie's word, to say: the engine listens on the home network only; a read-only front door is the one thing on the internet.

**Why.** Rule 5 of Planet (viewers read-only) is kept to the letter: the door allows nothing but GET and HEAD. §8's spirit — nothing on the internet reaches the engine directly — is kept: only nginx talks to 8080. The alternative, no public view, is the site without its planet.

**Overrule if.** Jamie decides the planet should stay private after all; then the landing page shows a nightly still instead of a live frame, and everything else in this plan stands.

### WS · D2 — The public planet is Jamie's own, experiments included (agreed)

**Choice.** The site shows whatever is on 8080. When Jamie moves it to a new build or restarts it from year zero, the site follows; the page says "resumed" quietly on a restart and refreshes its still.

**Why.** Honest and simple, and it does not ask Jamie to change how they work. A second, stable instance on `main` with its own world file and port is one nginx line if it is ever wanted; it is held in Active-Work.

### WS · D3 — The landing page frames the existing viewer; no new renderer (agreed)

**Choice.** The viewer Planet serves at `/` — globe by default, dark `#0b0e14`, self-spinning, relief-lit, with its atmosphere rim — is framed in the page with the panel hidden. The page's background is the same colour, so the frame's edge is invisible.

**Why.** Nothing maintained twice; the look is the viewer's look; and Planet's brief plans a three.js 3D viewer after Layer 3, which the landing page adopts when it exists rather than pre-empting.

### WS · D4 — One-second cache at the door and at the edge (agreed, W1; the door's hold on the live numbers removed, W4-e)

*W4's probe (60 s, ten asks a second through London): Cloudflare refreshes about every 1.1 s, but nginx counts its second in whole seconds and held each copy 1–2 s, so 14 of 42 refreshes repeated the last picture — a new one every ~2.1 s. W4-e: the door no longer holds meta, fields, events or log. Measured after (same probe, 60 s): a new picture every **1,068 ms** (median; max 1,218), 2–3 ticks each, every refresh a new tick (41 of 41) — twice as lively, free. A paid Cloudflare plan would not change this, as far as W4 could tell: edge times are whole seconds on every plan, and the free one already gives one second.*

**Choice.** nginx holds each reply for one second and collapses simultaneous misses into one fetch; it replaces the engine's `no-store` with `public, max-age=0, s-maxage=1` so Cloudflare caches for a second and browsers keep no copy (W2-f: a browser's own second stacked on the others and made the viewer jump). `/api/grid` is cached for a day. *Measured in W2:* the edge refreshes about every 2.1 s at that setting, so visitors get a new snapshot about every 2.2 s instead of every 400 ms tick — smooth, but the sea's twinkle and plate movement subtler than the kiosk.

**Why.** The engine's tick is 400 ms but Cloudflare's cache works in whole seconds, and sub-second edge caching is not on the free plan. The viewer's glide (Planet's QR · D14) smooths between snapshots already, so the picture stays even, a moment further behind. The kiosk on the LAN is unaffected. See *Budget* for the numbers.

**Overrule if.** Jamie finds the once-a-second picture visibly steppier than the LAN kiosk. Then a paid plan or a push relay, measured first.

### WS · D5 — BlockByBlock is renamed before it goes public (open: the name is Jamie's)

**Choice.** A new name before Phase 3, which fixes its subdomain, its repo and its how-it-works page.

**Why.** "Block by Block" is Mojang, Microsoft and UN-Habitat's programme using Minecraft for public-space design ([blockbyblock.org](https://www.blockbyblock.org/about/), [Minecraft Wiki](https://minecraft.wiki/w/Block_by_Block)). A public app of that name, about Minecraft, invites a complaint; a rename now costs a few hours of find-and-replace.

### WS · D6 — Subdomains for the apps; `.co.uk` is the site; `.com` redirects (agreed)

One place to remember; each room independent of the hub and of each other.

### WS · D7 — The rented server: move the engine, or only the front door (deferred to Phase 4)

**The trade.** Moving the engine makes the site independent of the house and costs a VPS (about €4 to €8 a month runs it: 6 ms per tick at 2.5 ticks a second is under 2% of one core); Planet's rule 4 promises its hash on Garcks-PC only, so a world file resumed elsewhere may diverge from that point, harmless for a public view and recorded if it happens. Leaving the engine home keeps Jamie's kiosk and experiments as they are and keeps the tunnel. Decide with the numbers then.

**Booked (Jamie, 24 Sep 2026):** put at the decision round after Phase 2 closes, with WS · D13, rather than waiting for a trigger.

### WS · D13 — A livelier public picture (open; booked for the decision round after Phase 2)

*Since W4-e a visitor gets a picture about every 1.1 s, 2–3 ticks at a time (the door's own hold was half the gap; see WS · D4); the rest of this paragraph is the W2 state it started from, and the kiosk's 400 ms still needs a push relay.*

**The trade.** Through Cloudflare a visitor gets a picture about every 2.2 s (the edge's own refresh at `s-maxage=1`, measured in W2), 5–6 ticks at a time; the viewer glides smoothly between them, but the sea's twinkle and plate movement are subtler than on the kiosk, which shows every 400 ms tick. A paid Cloudflare plan may shorten the edge's refresh (check what each tier really changes before paying); a push relay — every tick sent to each visitor over one connection — would match the kiosk but is a new moving part that likely wants a server (WS · D7). Neither is needed for the site to work.

### WS · D8 — Cloudflare for DNS, TLS, edge cache, Pages and the tunnel (agreed, W1)

**Choice.** Porkbun stays the registrar; the domains' nameservers move to Cloudflare. Pages hosts the static rooms; the named tunnel exposes the front door; the edge cache serves the fan-out.

**Why.** One provider, all on the free plan, and the edge cache is what makes the home upload budget hold. The alternative — Porkbun DNS and a port opened on the router — publishes the home address and gives no cache.

**Overrule if.** Cloudflare's free plan changes under us; then DNS moves back to Porkbun and the tunnel is replaced by a VPS relay (WS · D7 brought forward).

### WS · D9 — Explore's quartet shape, prefix "Workshop" (agreed)

Jamie's newest operating model; the owner reads one way of working. `rules-lineage.md` records what changed.

### WS · D10 — Two Claudes, one branch (agreed)

Laptop Claude owns the repo; PC Claude commits only under `frontdoor/state/`; `pull` is a merge. CLAUDE.md rule 16.

### WS · D11 — Secrets never enter the repo; a map says where they live (agreed)

CLAUDE.md rule 13; `secrets-map.md`.

### WS · D12 — The how-it-works page (agreed)

`docs/how-workshop-works.html`, started after Phase 1 from a real run: one request followed from a phone to the engine and back, with the real headers, cache hits and timings at each hop.

## The experience

**A visitor.** Opens anjaneyaworkshop.co.uk on a phone or a laptop. The page is dark; a planet is already turning, slowly, in the middle; beneath it one line in a light monospace reads the planet's age in billions of years, its land share and its highest peak, and the age ticks up while they watch. Top left, the name, small. Below, a few links in the same off-white at low contrast, brightening on hover: Planet, the renamed BlockByBlock, later ClaimsDesk and PolicyRAG, each with a small mark of its own. The page does not scroll. They can drag the planet; when they let go it resumes its slow turn. Nothing else is on the screen. One sentence at most, in Jamie's words; none is fine.

**What they do not see.** Before the 410 KB grid arrives, the last still, fading into the live picture. If the house is offline, that still with "last seen at" beneath it. After a restart of the engine, a quiet "resumed". Never a blank, never a broken frame.

**Planet, the room.** The link opens the full viewer at `planet.anjaneyaworkshop.co.uk`: the panel, the colour key, the History drawer with its chart, every field, exactly as Jamie sees it on the LAN.

**The other rooms** have their own character and are out of this document's scope; each has its own repo and, when it goes public, its own line in the Coverage Plan.

## Architecture

```
Visitor → Cloudflare (DNS, TLS, edge cache)
            ├→ Cloudflare Pages: the landing page, the static rooms
            └→ named cloudflared tunnel: planet.anjaneyaworkshop.co.uk
                 → nginx on Garcks-PC (gzip, 1-second micro-cache, GET/HEAD only, rate limit)
                    → Planet engine :8080, LAN only, unchanged
```

**The front door (nginx).** About twenty lines. Listens on a local port that only the tunnel talks to; forwards to 8080. Allows GET and HEAD only (405 otherwise, before the engine sees it). Compresses replies (elevation 41 KB → 35 KB, sediment → 21 KB, plate → 1.7 KB, crust → 1.2 KB, measured by PC Claude). Micro-caches each reply for one second on the path alone (so a query string cannot bust it) and collapses simultaneous misses into one upstream fetch. Rewrites `Cache-Control` to `public, max-age=0, s-maxage=1`; caches `/api/grid` for a day. Passes `X-Planet-Tick` through. Sends `Access-Control-Allow-Origin: https://anjaneyaworkshop.co.uk` so the landing page, on a different origin, may read `/api/meta` for its live line. Rate-limits per address as a backstop behind Cloudflare.

**The tunnel (cloudflared).** A named tunnel installed as a systemd service on Garcks-PC, starting at boot, routing `planet.anjaneyaworkshop.co.uk` to nginx's local port. No port opened on the router; the home address never published. It replaces PolicyRAG's quick tunnel, whose address changes on every start.

**The landing page.** Plain HTML, CSS and JavaScript, one screen. An iframe of the viewer with the panel hidden; a small script that polls `/api/meta` every few seconds for the live line, implements the restart rule (a lower tick is a restart), swaps in the still on failure and records "last seen". The still is refreshed by a scheduled fetch of the viewer's `?still` picture through the front door. Tests (Vitest) cover the restart rule, the fallback and the line's formatting. Deployed to Cloudflare Pages from the repo on every push to `main`.

**The repo.**

```
anjaneyaworkshop/
  CLAUDE.md
  .gitignore
  site/                     the landing page: index.html, style, script, tests, package.json
  frontdoor/                nginx.conf, cloudflared config.yml, RUNBOOK.md (PC Claude's steps)
    state/                  what is installed on Garcks-PC, from which commit, when (PC Claude's only commits)
  scripts/                  check-public.sh (the budget as a test), deploy, still-refresh
  docs/
    decisions.md
    how-workshop-works.html (after Phase 1)
    screens/<phase>/        the laptop and phone screenshots at each gate
    process/                the quartet, rules-lineage, secrets-map, progress/YYYY-MM.md
    archive/                WEBSITE_PLAN.md, the planning session's single document
```

## Reuse map

| Project | Used by the Workshop how | Notes |
|---|---|---|
| Planet's viewer (`/`, `/viewer.js`) | Framed in the landing page; the Planet room | Served by Planet itself through the front door; never copied. Relative `/api/...` URLs, so it works unchanged behind the tunnel. |
| Planet's API (`/api/meta`, `/api/grid`, `/api/field/*`, `/api/log`, `/api/events`, `/api/cell/*`) | Read-only, through the door and the edge cache | `X-Planet-Tick` on field replies is the restart signal. Thirteen fields, 10,242 cells at f=32; 41 KB per field uncompressed. |
| Planet's `?still` | The landing page's fallback picture | Fetched on a schedule through the door. |
| BlockByBlock's built files | Deployed as a room from its own repo (Phase 3) | Its 504 tests run in its own deploy; its name changes first (WS · D5). |
| ClaimsDesk, PolicyRAG | Rooms, Phase 5, after stripping | Nothing from them touches the site before then. |
| Planet's source, BlockByBlock's source | **Not used** | Rule 8. |

## Budget

Stated as numbers a session can measure, asserted by `scripts/check-public.sh` (CLAUDE.md rule 9).

- **Home upload:** 17.5 Mbps ≈ 2.2 MB/s. Without the door, one viewer drawing elevation alone pulls about 100 KB/s uncompressed, and every viewer pulls separately: five viewers fill the upload. With the door, the house sends each field once per second per Cloudflare location that has a viewer: about 35 KB/s for elevation, roughly 100 KB/s for elevation plus the three river fields the viewer draws. Five busy locations ≈ 0.5 MB/s, a quarter of the upload, whether ten people are watching or ten thousand. **Budget: origin egress under 0.6 MB/s at any audience**, measured at nginx.
- **The door's replies:** gzip on for JSON and binary fields; `Cache-Control: public, max-age=0, s-maxage=1` on `/api/meta`, `/api/field/*`, `/api/events`, `/api/log` (one second at the edge, none in the browser); a day on `/api/grid`; `X-Planet-Tick` present on fields; POST → 405; the second fetch of the same field within a second a cache hit at the edge.
- **The engine's load:** about one request per URL per second per Cloudflare location with a viewer, however many browsers watch there, read at nginx (`frontdoor/door-rate.sh`). *Amended W4-e (Jamie, 24 Sep 2026): was "per URL per second" overall while the door held a second too; the door's hold made a third of Cloudflare's refreshes repeat the last picture.*
- **Time to first picture:** under 2 s on the home connection for a warm load; the still must be on screen before the grid arrives.
- **Restart:** the page shows "resumed" and carries on within one poll of a lower tick; no reload needed.

## Engineering quality standard

- **Every file explains itself** (CLAUDE.md rule 14): a five-line plain-English header on every source and config file, nginx and cloudflared included; every test named for the fact it checks.
- **Tests before behaviour is trusted:** the restart rule, the still fallback, the live line's formatting, the link set. `scripts/check-public.sh` is the integration test and runs against the real address.
- **No silent fallbacks** (rule 10): the still and "last seen" are the visible failure; a console warning names the cause.
- **Surgical edits** (rule 1) and **commit as you go** (rule 4) apply here as everywhere in the set.
- **Config is code:** nginx and cloudflared files live in the repo with headers and are the only thing PC Claude installs; what it installed is recorded in `frontdoor/state/`.

## Naming, IP and the public line

**The hub.** Anjaneya Workshop is Jamie's name and needs no line of any kind.

**BlockByBlock.** Renamed before public (WS · D5). Its room carries the "Not an official Minecraft product" line and may use the block graphic as its emblem, since the app is about Minecraft schematics and saying so is fair; the graphic reads as Minecraft's grass block and pickaxe, so it does not appear on the hub beyond a small mark, and never as the site's brand. BlockByBlock's own rule 8 (no Mojang textures in the repo) stands, and its build output is scanned before it ships.

**The work apps.** Nothing Aviva-branded or Aviva-worded in any deployed file, checked by a search of the build output, and Jamie's sign-off on each, before either goes public.

## Risks and how the plan handles them

| Risk | Mitigation |
|---|---|
| The home upload cannot carry an audience | The door's micro-cache and Cloudflare's edge cache make origin egress independent of audience size; asserted by the public check. |
| The house is offline (power, router, reboot) | The static rooms are on Pages and stay up; the landing page shows the still and "last seen"; Planet's service and the tunnel start at boot. Phase 4 removes the dependency if Jamie wants it removed. |
| A restart of the engine mid-visit | The restart rule (CLAUDE.md rule 12); "resumed" on the page. |
| The world moves to a new build or seed at Jamie's word | WS · D2: the site follows; the still refreshes itself. |
| The engine reached directly from the internet | It is not on the internet; only nginx talks to it; the tunnel exposes nginx; the router opens nothing. |
| Two Claudes editing the same files | Rule 16: one owner per file tree; PC Claude commits only `frontdoor/state/`. |
| A credential in a commit | Rule 13 and `.gitignore` from commit one; a secret in a diff stops the session until rotated. |
| The BlockByBlock name draws a complaint | Renamed before Phase 3 (WS · D5). |
| Cloudflare's free plan changes | DNS moves back to Porkbun; the tunnel is replaced by a VPS relay (WS · D7 brought forward). |
| Determinism on a different CPU (Phase 4, if the engine moves) | Planet's rule 4; recorded; the golden-seed test run on the new machine first, as Planet's own queue already says. |

## Costs

Until Phase 4 the site costs nothing beyond the domains: $16.74 a year ($5.66 for the `.co.uk`, $11.08 for the `.com`, Porkbun's renewal estimates from the order of 22 Apr 2026). Cloudflare's DNS, TLS, cache, Pages and named tunnel are all on the free plan. The rented server, if Phase 4 happens, is about €50 to €100 a year (a small European VPS at roughly €4 to €8 a month, approximate; price it then).

## Open questions for Jamie

1. **The new name for BlockByBlock** (WS · D5) — not needed until Phase 3; it fixes a subdomain and a repo name.
2. **Which apps get a mark on the hub before their room exists** — a link with no room is worse than no link; the plan says a mark appears only when its room does.

## Success criteria

- **Phase 1 (the front door):** `planet.anjaneyaworkshop.co.uk` shows the live viewer from a phone on mobile data; `curl -I` shows gzip, `s-maxage=1` and `X-Planet-Tick`; a POST gets 405; the engine's log shows about one request per URL per second while several browsers watch.
- **Phase 2 (the landing page):** Jamie opens anjaneyaworkshop.co.uk on the laptop and a phone and the planet is turning within 2 s; unplugging Garcks-PC's network for a minute shows the still and "last seen", and the page recovers by itself.
- **Phase 4 (if taken):** Garcks-PC switched off for an hour with the site unchanged.
- **The set:** every room reachable from the hub, each on its own subdomain, nothing Mojang's or Aviva's in any deployed file.

— end —
