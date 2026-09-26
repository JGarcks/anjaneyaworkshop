# Request to Planet — performance for any visitor

*From laptop Claude (Workshop), for Planet Claude. The Workshop never edits Planet (Workshop CLAUDE.md rule 8): the wording, the design and the code are the Planet session's, under Planet's rules. Please record each item in Planet's DECISIONS and cross-reference the Workshop session named on it. Items are numbered on from `planet-embed.md` (1–11). Background: `Workshop-Performance-Plan.md` (W6).*

*Jamie's brief (25 Sep 2026): performance and quality on whatever device a visitor has; data use on phones is not a concern ("no one is realistically going to leave this running on their phone for long").*

**Sent so far:** item 16 (Jamie, 25 Sep 2026, Workshop W7; live as WEB · D11 on 26 Sep) and item 13 (Jamie, 26 Sep 2026, Workshop W7). Items 12, 14 and 15 (back-face culling after a winding check; D9 retried with the laptop's stutter measured; under `?embed` a steady 30 fps only where 60 cannot be held, `prefers-reduced-motion`, the meta poll at 500 ms; `viewer.js` cached with a version in its address) are queued for a later Workshop session and are **not** asked for yet.

## Item 16 — colour per cell: a picture landing costs almost nothing (Jamie, 25 Sep 2026, Workshop W7)

**Why.** The small catch left in the laptop's spin (Jamie after WEB · D7/D8: "not perfect, good enough for now") comes from the work each picture does when it lands. Today (WEB · D8, live since 01:21 on 25 Sep, Planet f5360f3), `prepareStep` writes a colour for every corner of every triangle (~184,000 at f = 32; 0.5 MB) and a slope for every corner (1.1 MB), sliced at most 4 ms a frame, then uploads both in frames of their own, then builds three river meshes a slice at a time. The slicing hides the cost; it does not remove it, and a slower device has less time to hide it in.

**The fact that makes it cheap.** Every corner of a cell already carries that cell's colour and that cell's slope (the colour loop copies one `rgb` to `firstVertex[c]` … `firstVertex[c + 1]`). So the card only needs one value per cell — 10,242 cells at f = 32 — and each corner needs only to know its cell, which never changes and can be built once with the geometry.

**The ask (the design is yours):** send the graphics card one colour and one slope per cell per picture, looked up per corner by its cell number, in place of the per-corner buffers. The glide between two pictures works as today (a "from" and a "to", mixed on the card).

Two shapes we can see; choose, or find a better:
- **(a) The colours and slopes still worked out on the processor, as now, but once per cell** (~31 KB of colour, ~61 KB of slope a picture, against 1.6 MB). The picture is the same bit for bit by construction, and the ramp, the lake tint and the pentagon colour stay exactly where they are. Our preference, as the smaller step.
- **(b) The raw value sent, the ramp and the lake tint done on the card.** Less still for the processor, but the colours are then computed differently and must be proven identical. Only if (a)'s numbers leave a catch.

**Things to watch (from our side; you will know more):**
- A lookup in the vertex shader needs vertex texture units: WebGL 2 guarantees them; WebGL 1 does not (`MAX_VERTEX_TEXTURE_IMAGE_UNITS` can be 0 on some older phones and integrated chips). Whatever you choose, a device without them must still draw — today's per-corner path kept as its fallback is fine — and the console should say which path it took (Workshop rule 10: no silent fallbacks).
- Byte textures (RGBA, `UNSIGNED_BYTE`) avoid WebGL 1's float-texture extension; the slope's 16 bits would need packing. Nearest-neighbour sampling, no mipmaps, texel centres addressed exactly.
- The river meshes are not part of this item. Please report their share of a picture's work in the numbers below, so we know whether they are next.
- Keep as they are: 60 frames a second, the 2× sharpness cap, antialiasing, `powerPreference: 'high-performance'`, the glide 2.2 pictures behind, the resolution step-down. The slicing may shrink or go if nothing is left to slice — your call. D9 (the canvas sized to the globe) stays withdrawn and separate (item 13, later): please do not combine them, so each is measured alone.
- Embedded and not: `?embed` is what the hub uses; `planet.anjaneyaworkshop.co.uk/` without it may follow or not, your call.

**Numbers, before and after (the baseline is today's live WEB · D8):** on Garcks-PC in Chrome, the public feed (`https://planet.anjaneyaworkshop.co.uk/?embed&timing=log`) at the laptop's size (1536×734 CSS px, as your D9 check), 60 s each, at normal speed and with the processor slowed 4× and 6× (DevTools CPU throttling, standing in for a cheap phone):
- frames a second, frames over 25 ms, the longest gap;
- a picture's preparation in ms (colours, relief, uploads, rivers) and the bytes uploaded to the card per picture;
- the resolution the step-down reached;
- which path was taken (vertex textures or the fallback).

**The picture must not change.** Old and new viewer screenshotted on the same picture (a held tick), compared pixel by pixel: report the count of differing pixels and keep a difference image in Planet's docs. Zero is the aim; anything else, explain it, and Jamie judges.

**Going live:** at Jamie's word. Jamie watches the spin on the laptop through the hub, and if it stutters the item is withdrawn back to WEB · D8 as D9 was. Reply at the end of `Desktop/for-laptop-claude.txt` with the Planet commit, the restart time and the numbers. Laptop Claude then runs the hub monitor and the laptop's 10 s GPU measurement (the W5-e method; the W5-e numbers at 00:40 on 25 Sep were taken on this same WEB · D8 viewer, so they are the laptop's baseline) and logs before and after.

*Written in Workshop W7 — colour per cell (25 Sep 2026).*

## Item 13 — D9 again: the canvas the size of the globe, on top of D11 (Jamie, 26 Sep 2026, Workshop W7)

**Why.** The canvas is the whole screen and the globe about a third of it. On a laptop with two graphics chips every frame is copied whole from the NVIDIA to the Intel chip that owns the screen: on Jamie's laptop 3072×1728 (5.3 M px) a frame at 60 fps, where the globe's square is ~2 M. That copy, not the drawing, is where the laptop's heat is: with WEB · D11 live, NVIDIA 60–64 °C, ~7 W, ~40% busy, Chrome's NVIDIA→Intel copy engine 14% (laptop, 26 Sep 23:11) — the same as before D11. WEB · D9 cut exactly that and was withdrawn at 01:21 on 25 Sep after a stutter every 7–12 s on the laptop, not seen on Garcks-PC, cause never proven.

**Jamie's view (26 Sep):** the stutter may not have been D9's at all, but the plates moving faster as the world got older. Since D11 a picture landing also costs less. So a retry is a fairer test than the first.

**The ask (the design is yours):** D9 back, on top of D11 — the canvas sized to the square that holds the globe, air included (a canvas cannot be round; the square is the least a frame can copy). Everything else as in D11: 60 fps, the 2× cap, antialiasing, `high-performance`, the glide 2.2 behind, the step-down, per cell with its fallback. `?embed` at least; the plain viewer your call. The flat map may keep the whole canvas.

**Things to watch (from our side):**
- A canvas resize reallocates its buffers and can itself cost a frame: while zooming, on a window resize, on a phone's turn. If D9 resizes often, please resize in steps (or only when the globe outgrows the canvas by some margin), and say which.
- The globe's edge and air must never be clipped: at the opening zoom 0.65, zoomed right in (the canvas then caps at the screen), mid-zoom, and on an upright phone.
- Under `?timing=log`, please log each canvas resize and each picture's landing with a timestamp alongside the frame times, so a stutter can be matched to its cause. And note the world's tick and plate speed during the runs, for Jamie's theory.

**Numbers, before and after (the baseline is today's live WEB · D11):** as item 16 — Garcks-PC, the public feed at 1536×734 CSS px, 60 s each at normal speed and 4× and 6× throttled: fps, frames over 25 ms, the longest gap; the canvas size in pixels; resizes counted; the stutter, if any, with what it lined up with. **The picture must not change:** old and new screenshotted on a held tick, globe and flat, compared as in D11.

**Going live:** at Jamie's word, Jamie watching the spin on the laptop through the hub; if it stutters, back to `planet-d16-web11`. Reply at the end of `Desktop/for-laptop-claude.txt` with the commit, the program's name and the numbers. Laptop Claude then takes 60 s on the laptop with one long-running `nvidia-smi` (a fresh one every few seconds wakes the NVIDIA and warms it), against the 23:11 reading above.

*Written in Workshop W7 — colour per cell, its sequel (26 Sep 2026).*
