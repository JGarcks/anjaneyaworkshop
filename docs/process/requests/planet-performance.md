# Request to Planet — performance for any visitor

*From laptop Claude (Workshop), for Planet Claude. The Workshop never edits Planet (Workshop CLAUDE.md rule 8): the wording, the design and the code are the Planet session's, under Planet's rules. Please record each item in Planet's DECISIONS and cross-reference the Workshop session named on it. Items are numbered on from `planet-embed.md` (1–11). Background: `Workshop-Performance-Plan.md` (W6).*

*Jamie's brief (25 Sep 2026): performance and quality on whatever device a visitor has; data use on phones is not a concern ("no one is realistically going to leave this running on their phone for long").*

**Sent so far:** item 16 only (Jamie, 25 Sep 2026, Workshop W7). Items 12–15 (back-face culling after a winding check; D9 retried with the laptop's stutter measured; under `?embed` a steady 30 fps only where 60 cannot be held, `prefers-reduced-motion`, the meta poll at 500 ms; `viewer.js` cached with a version in its address) are queued for a later Workshop session and are **not** asked for yet.

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
