# Request to Planet — a quiet `?embed` mode for the Workshop's hub

*From laptop Claude (Workshop), for Planet Claude (Jamie's call, 24 Sep ~22:00). The Workshop never edits Planet (Workshop CLAUDE.md rule 8): the wording and the code are the Planet session's, under Planet's rules. Please record it in Planet's DECISIONS and cross-reference "Workshop W3-a / W4".*

*Items 1–4 were first sent 24 Sep 2026 (W3, via `Desktop/for-laptop-claude.txt`) and went live with 5, 6, 8 and 9 at 21:45 on 24 Sep (Planet bbb005a, WEB · D5). Items 5–9 are new from W4: 5–6 from Jamie's phone walk, 7–9 from the pauses measured below (7 was first thought "for later"; it now also fixes the 14 s freeze).*

**Who and when (Jamie, 24 Sep ~22:00):** Planet Claude, tonight — items 8, 9, then 1–6 (all viewer, all under `?embed`); item 7 is a separate, later job. Handover text: the end of `Desktop/for-laptop-claude.txt`. Live only at Jamie's word; laptop Claude watches the hub through the restart.

**Item 7 (Jamie, 24 Sep, W5-a):** now, ahead of the glide's retuning, as **one request per picture** (`/api/picture/<field>`, the contract in §Item 7). Planet Claude; the door learns the address first (Desktop Claude, runbook §For Planet item 7). Handover: the end of `Desktop/for-laptop-claude.txt`.

*Pull first: Planet's portrait fix (WEB · D2 — an upright screen fits the narrower side unless `?zoom=` is given; `main` e0a06d7, `sc-option1` 01bb0ba) is already in the live binary, rebuilt and restarted ~18:34 on 24 Sep (Desktop Claude). The hub always passes `?zoom=`, so that fix does not change it.*

## Why

The hub at anjaneyaworkshop.co.uk frames the public viewer (`planet.anjaneyaworkshop.co.uk/?embed&zoom=…`) full screen behind its words (Workshop WS · D3, W3-b). The frame is another origin, so the hub cannot change anything inside it; it can only set the address, and read one message if the viewer sends it.

## What `?embed` should do (without `?embed`, nothing changes)

1. **No buttons.** Hide ☰ (`#toggle-panel`) and History (`#toggle-events`). *(Meanwhile the hub runs the frame 56 px past every screen edge to crop them.)*
2. **No cell table on tap.** A tap or click on the globe does not open `#inspect` — on a phone, people dragging the globe open it constantly.
3. **No keyboard toggles** (H and T).
4. **Say when the first live picture is on screen:** `parent.postMessage({ planet: 'drawn', tick }, '*')`, once per load. Public information only; the hub checks the sender's origin. *(Meanwhile the hub guesses: it waits a fixed 2.5 s after the frame loads, so the live globe appears at ~3.5 s rather than ~1.2 s. It is what holds the Workshop's Phase 2 gate open, W4-d.)*
5. **Zoom out further, and never snap bigger.** `zoomBy()` clamps the globe at `view.zoom >= 0.4`. On an upright phone (390×844) the hub opens the globe at `?zoom=0.373` to fit the width (zoom is relative to the frame's height, and the frame is taller than the screen to crop the buttons). So the first pinch **outwards** snaps the globe *up* to 0.4 — 384 px on a 390 px screen, clipped at both sides — and it can go no smaller. Jamie: "zoomed so close it clips the edge of the planet … would be nice to be able to zoom out more on mobile." Proposed: under `?embed`, the floor is `min(0.4, openingZoom × 0.5)` (half the size it opened at), and a pinch never takes the zoom the wrong way.
6. **Take a new zoom by message.** When a phone turns, the hub must reload the frame to give it a new `?zoom=`: ~0.4 s of the old shape's picture (now hidden by the hub, W4), then dark and the still for ~3 s until the reload draws. Proposed: the viewer accepts `{ planet: 'zoom', zoom: <number> }` from `event.origin === 'https://anjaneyaworkshop.co.uk'` only, sets `view.zoom` (clamped as in 5) and redraws at its new canvas size — so the hub resizes the frame and sends the zoom, and a turn is seamless.

## The public picture pauses (Jamie, W4: "the planet spins but the movement stops") — measured

A 5-minute run of the hub in a browser (24 Sep, ~21:30; every request logged; no failures, field replies ~50 ms, the engine a steady ~2.4 ticks/s, the hub live throughout) gave 135 matching pictures, typically 2.1 s apart, and two kinds of pause:

- **Seven stalls of 3.1–3.5 s** (about one every 40 s): Cloudflare refreshed but the door handed back its held copy, so one round brought nothing new. The glide runs 1.5 pictures behind (`GLIDE_BEHIND`), so it catches up and rests — the surface stops while the globe turns — and past `GLIDE_LONGEST_GAP_MS` (3 s) the next picture comes as a jump.
- **One freeze of 14 s**: for six refreshes in a row the four fields came one tick apart in pairs (elevation and lake at 40517, drainage and downstream at 40518; then 40523/40524; …). Cloudflare fetches the four together, and now and then that moment straddles the engine's tick change; the door and the edge then hold the split for a second or two, so the viewer's re-asks (94 of them) get the same split and every picture is skipped until the timing drifts apart.

8. **Under `?embed`, glide further behind**: `GLIDE_BEHIND` ~2.5 and `GLIDE_LONGEST_GAP_MS` ~5000, so gaps of 3–4 s are glided through rather than rested on and jumped. Cost: the public picture sits ~2 s further behind the live world, which no visitor can see. (The same may suit the Planet room at `planet.`, which pauses the same way — Planet's call.)
9. **Don't skip forever on a one-tick split**: after the re-asks, a set whose ticks differ by one could be shown rather than skipped (or only the elevation drawn, with the last good rivers). A stopgap — item 7 below removes the split altogether.

**After items 8, 9 and 1–6 went live (21:45, 24 Sep) — measured 11 min:** pictures still median 2.1 s apart; 22 gaps of 3–4 s (8 should bridge them); but freezes of 10, 11, 13 and 38 s, with elevation 2–4 ticks out of step with the river fields throughout — beyond 9's one tick. Likely: after a split, `fetchOneTick` re-asks only the fields behind, which moves them to another refresh phase at Cloudflare's shared copy, so the split persists. Worth trying first: **re-ask all four together** (so Cloudflare refreshes them at one moment again) — or item 7, which ends it. Jamie also finds the new glide "too drawn out — too slow": GLIDE_BEHIND 2.5 may be more than needed once the freezes go.

## Item 7 — now (Jamie, 24 Sep 2026, Workshop W5-a: "A go ahead")

7. **One request per picture: the shown field and the three river fields, from one tick.** The viewer draws only when its field and the three river fields share a tick (Planet's WEB · D3). Four separate requests can straddle a tick change, and the freezes above (10–38 s) are that split persisting. One reply built from one tick cannot split, so the freezes end, and the re-ask/skip machinery has nothing left to do on this path. It also reopens a livelier picture: W4 tried taking the door's one-second hold off (pictures ~1.1 s apart instead of ~2.1 s) and had to undo it only because the four fields then never matched. With one reply the Workshop can try that again (its own step, measured).

   *Jamie chose this over fields addressed by tick (`/api/field/<name>/<tick>`): no history for the engine to keep, no more upload than today (the same bytes in one reply instead of four), and nothing new for the edge to cache. Not `?tick=`: the door and Cloudflare both key on the path alone and ignore the query.*

   **What the Workshop's side needs from it (the contract; everything else is Planet's call):**
   - **The address: `GET /api/picture/<field>`**, where `<field>` is any name `/api/field/<field>` takes (`[a-z0-9_]+`). The Workshop's door lets exactly this shape through (W5-a, installed before Planet's build goes live). If Planet would rather another name, say so in the handover file **before** going live: the door refuses any address it has not been told about.
   - **One tick for all four**, and `X-Planet-Tick` on the reply equal to that tick (the restart signal; Workshop rule 12).
   - **Content type `application/octet-stream` or `application/json`**, so the door compresses it. The layout inside (a small header with the tick and the four lengths, then the four arrays, or whatever suits) is Planet's.
   - **An unknown field → 404**, like `/api/field/`. GET only; nothing after `?` changes the reply.
   - **`/api/field/<name>` stays as it is.** The Workshop's public check, the still's daily Action and anything else may still use it.
   - **In the viewer:** every viewer, or only under `?embed`, is Planet's call (item 9 went to every viewer). If the picture request fails (a door that doesn't know it yet answers 404), the viewer says so in the console and goes back to the four-request way, never a blank or a silent freeze.

   **Checks before it goes live (Planet's own, plus):** through the door on Garcks-PC, `curl -s -D - -o /dev/null -H 'Accept-Encoding: gzip' http://127.0.0.1:8090/api/picture/elevation_m` → 200, gzip, an `X-Planet-Tick`; the planet at `planet.anjaneyaworkshop.co.uk/` and in the hub keeps drawing; `/api/field/elevation_m` unchanged. Rebuild and restart `planet.service` only at Jamie's word, as for D5.

## Item 10 — the turn hitches when a picture lands (Jamie, 24 Sep ~23:00, Workshop W5-c)

**Where the supply stands now.** Item 7 live 22:29 BST; the Workshop's door stopped holding `/api/picture/` (W5-b, 22:37) and `/api/meta` (W5-c, 22:45). A freshly loaded hub, 3 min: a new picture reaches the viewer every **1,061 ms** (median; p90 1,111; max 2,167), none over 3 s, no failures, picture replies ~74 ms (W4: 2.1 s apart, freezes to 38 s). Nothing more to gain on the wire.

**What Jamie still sees:** "still stutter, but it's close". Asked which kind: **the globe's own spin catches, about once a second** — not the land jumping. So something the viewer does when a picture arrives costs the turn a frame or more.

**What the Workshop could and couldn't measure.** In the desktop app's browser pane (throttled, ~25 fps, so not a fair test) no task over 50 ms showed in 12 s — so it is probably not one large block of work per picture, at least there. Frame timing on real hardware is Planet's to take (the viewer's own timing readout, or the browser's Performance panel on the laptop at `planet.anjaneyaworkshop.co.uk/?embed&zoom=0.6`).

**Candidates (Planet's call; listed only so nothing is missed):** the recolour or buffer rebuild for 10,242 cells happening in one frame (spread it across frames, or reuse buffers rather than allocate); a GPU upload or canvas resize on each picture; the glide's new target resetting or nudging the rotation clock (the turn should run on wall time, independent of pictures); garbage from the 164 KB parse. Separately, the glide (item 8: 2.5 pictures behind, 5 s) was sized for the old 3–4 s gaps; at a steady ~1 s it can likely come back toward 1–1.5 — Jamie's W4 note "too drawn out" still stands, second to the hitch.

**Checks:** the spin smooth through several picture arrivals on the laptop and a phone (Jamie's eye is the bar); `planet.anjaneyaworkshop.co.uk/` without `?embed` unchanged unless Planet chooses otherwise. Live at Jamie's word, as before.

## What the hub does when these land

- 1: drops the 56 px crop. 4: already listens for `{ planet: 'drawn' }` from the planet's origin and drops the 2.5 s wait by itself; then re-times the Phase 2 gate (live within 2 s). 5: nothing — pinch just works. 6: sends the zoom on a turn instead of reloading. 8–9: nothing; the Workshop re-runs its 5-minute pause monitor to confirm. 7: the pause monitor re-run (freezes gone?); `check-public.sh` gains the picture address (200, gzip, tick, one second at the edge); then, measured, the door's hold on it tried off again (W4-e); then the glide retuned to what is left (W5).

*Written in Workshop W4 — Phase 2 continued (24 Sep 2026).*
