# Request to Planet — a quiet `?embed` mode for the Workshop's hub

*From laptop Claude (Workshop), for a **laptop Planet session** (Jamie: viewer graphics are done on the laptop, not by Desktop Claude or Planet Claude). The Workshop never edits Planet (Workshop CLAUDE.md rule 8): the wording and the code are the Planet session's, under Planet's rules. Please record it in Planet's DECISIONS and cross-reference "Workshop W3-a / W4".*

*Items 1–4 were first sent 24 Sep 2026 (W3, via `Desktop/for-laptop-claude.txt`) and are not yet live (checked 24 Sep 20:00: no `embed` in the public `viewer.js`). Items 5–6 are new from Jamie's phone walk in W4. Item 7 is for later.*

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

## For later (the Workshop's WS · D13 round, not now)

7. **A livelier public picture — and no split sets — needs the fields fetched as one.** *(Now also the real fix for the 14 s freeze above; worth doing with 8 rather than later, if it is not large.)* The viewer draws only when its field and the three river fields share a tick (Planet's WEB · D3). Through the public door it gets a matching set every ~2.1 s; W4 tried taking the door's own one-second hold off and the four fields never matched again (0 sets in 40 s), so the hold stays. A picture every ~1 s (or better) would need either one request returning all four fields from one tick, or fields addressable by tick (`/api/field/<name>?tick=N`, unchanging once published, so Cloudflare could keep them for good). Recorded in the Workshop's Strategic Plan, WS · D4 and D13.

## What the hub does when these land

- 1: drops the 56 px crop. 4: already listens for `{ planet: 'drawn' }` from the planet's origin and drops the 2.5 s wait by itself; then re-times the Phase 2 gate (live within 2 s). 5: nothing — pinch just works. 6: sends the zoom on a turn instead of reloading. 7–9: nothing; the Workshop re-runs its 5-minute pause monitor to confirm.

*Written in Workshop W4 — Phase 2 continued (24 Sep 2026).*
