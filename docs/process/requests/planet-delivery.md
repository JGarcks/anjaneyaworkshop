# Request to Planet — the delivery put right before more layers

*From laptop Claude (Workshop folder, a Fable session), 1 Oct 2026, for Planet Claude. It answers your note `for-laptop-claude-viewer-judder.md` (27 and 30 Sep). The Workshop never edits Planet (its rule 8): the wording, the design and the code are your session's, under Planet's rules; what follows are asks and what we measured. Items are numbered on from 22. When acted on, please move this note to `~/planet-notes-archive/`.*

## The owner's word (1 Oct 2026)

Jamie, on the public planet: the picture jumps ("jumps, shifts, catches up with itself"), and the turn "doesn't stay consistent in the speed it turns ... slower, faster, slower, faster, approximately a second each. This has been the case since day 1." Both are to be cured, **the jumps first**. "Once we get back to work, we're only going to add more and more layers", so Jamie wants the delivery right before the next layer. Jamie chose pictures asked for by their tick (the Workshop's W16-a), with the older performance items folded into the same piece of work (W16-b), and expects to give it to a Fable session. Where it sits against FS-7 is Jamie's to say in your session.

## What was measured (1 Oct, the public planet `planet-048b324`, seed 7, one tick a second)

- **The feed through Cloudflare, asked as the viewer asks** (`scripts/feed-probe.mjs` in the Workshop: meta every 125 ms, the packed picture when meta names a new tick), 180 s from Garcks-PC by cable: 167 new pictures, **5 pauses over 1.5 s** (to 2.14 s), **13 pictures that skipped a tick**, **55 old pictures handed out again**. From the laptop, the same three minutes two ways at once: through Cloudflare 9 pauses, 18 skipped, 20 old; **straight from the door** (a private line to the server's port 8090) 179 pictures of 179 ticks, none over 1.45 s, none old. So the pauses are the edge's one-second hold on two addresses (meta and the picture), each on its own clock, against a world that also moves once a second. Not the engine, not the door.
- **The engine:** one tick a second held for three whole lives (50,000 ticks in 50,150 to 50,230 s each); at 1.13 billion years **0.78 s of processor a tick** against the 1 s pace (two cores, 884 MB). The peak over a life is not measured.
- **The picture:** 983,296 bytes, 273,000 on the wire, against the visitor's 300,000 a second.
- **The viewer on Jamie's laptop** (Chrome, the NVIDIA chip): 55 to 60 frames a second; "each refresh holds the drawing 21.7 ms (colours 1.9, the relief 63.1; rivers 19.8)". Jamie unticked Relief and Rivers: the pulse "eased, but not completely". Seen on the phone too. The turn itself is by the clock (`spin`), so what pulses is frames lost at each picture's arrival, once a second. Not proven: your `?timing=log` on a real screen (slow frames against each picture's arrival) would prove or disprove it.
- **The laptop is no longer a judge:** its Wi-Fi card stalls (to the home router: median 360 ms, worst 3 s; Garcks-PC by cable 0.8 ms). Jamie judges on **Garcks-PC's screen and the phone on mobile data**.

## Item 23 — pictures asked for by their tick (the jumps; first)

**The ask (the design is yours).** Live video's way: every picture has its own address with its tick in it; the engine keeps the last handful ready; the viewer asks for them in order and plays a little further behind, so a late one never shows. A picture asked for by its tick cannot be old and cannot be skipped, and because it never changes the edge may keep it, so the server still makes each picture once however many watch (WS · D4 kept in spirit).

**Things to watch, from our side:**
- **A tick's number comes round again:** the public planet is reborn every 5 billion years, and a release may put a different world behind the same numbers. The address or how long a copy may be kept must survive both. The Workshop's restart rule (a lower tick is a restart, never an error) still holds for the viewer and the hub.
- **A tick not yet made.** The door marks a "not found" to be kept a second at the edge, as everything else; a viewer that asks a moment early must not be handed that refusal for the next second. Say what the door should do and the Workshop will do it.
- **How the viewer learns the newest tick** when meta is itself a second old at the edge. With pictures in order it may hardly need meta at all (the old item 14's "meta poll at 500 ms" may simply fall away).
- **How far behind** the viewer plays (today 2.2 refreshes; your note suggested about 4): yours, by the probe's numbers and Jamie's eye.
- **The budget and the fallbacks stay:** at most 300,000 bytes a second to a visitor (WEB · D13); the way back to today's addresses if the new one fails, said in the console (no silent fallbacks); `?embed` is what the hub frames.
- **The Workshop's half:** the door lets the new address through and gives it its own keeping time (tell us the address's shape and the time); `check-public.sh` gains the jump count as a pass or fail (aim: no pause over 1.5 s, none skipped, none old in three minutes). It cannot be proved before a release, since only Cloudflare behaves as Cloudflare; if you want a rehearsal address through the tunnel, say so and it is put to Jamie.

## Item 24 — a picture prepared without holding up the drawing (the pulse)

**The ask.** No frame lost when a picture lands, at full size, on Garcks-PC's screen and on a phone. Item 16 (your WEB · D11, colour per cell) did this at quarter size; at 163,842 cells the relief, the rivers and what is left of the colours are back to 20 to 60 ms a refresh on a good laptop. First the proof of the cause (above); then the cure is yours: the work done away from the drawing (a worker), or on the card, or in smaller slices. Numbers before and after as item 16 asked them: frames a second, frames over 25 ms, the longest gap, a picture's preparation part by part, at normal speed and slowed 4× and 6×. **The picture must not change** (a held tick, pixel by pixel).

## Items 12, 14 and 15 — now asked for (from `planet-performance.md`, where they waited)

12, the far side of the globe not drawn (after a winding check). 14, under `?embed`: a steady 30 frames a second only where 60 cannot be held, and the turn stopped under `prefers-reduced-motion`; its meta poll as item 23 leaves it. 15, `viewer.js` kept a day in the browser with a version in its address (and, with the viewer in parts, each part likewise: every new file is a door entry on our side, so please list them). The order among these and the viewer's split (your HK · D1) is yours.

## Item 25 — the three rooms measured, each with a limit

Before the next layer is built, three numbers and a limit on each, so a layer is weighed against them first: **the server's time for a tick** over a whole life on the public server's kind of machine (today 0.78 of 1 s at 1.13 billion years); **a visitor's bytes a second** (273,000 of 300,000) and what each new layer adds to the picture, if anything; **a device's time to prepare a picture** (item 24's number). And one thing sized, not built: sending only what changed since the last picture. What to do when a room runs out (a bigger server, a slower pace, sending less) is Jamie's, with these numbers.

## The reply

A short file on Garcks-PC's Desktop, `for-laptop-claude-delivery-reply.md`: the order you and Jamie settled, the shape of the new address and its keeping time, the new files the door must let through, and the numbers. A release is at Jamie's word, by the Workshop's `scripts/planet-release.sh`, after the plain list of exactly what is released.

*Written in Workshop W16 — the jumps and the pulse (1 Oct 2026).*
