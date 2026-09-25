# Workshop — Performance for any visitor (the plan)

*Written in the W6 planning session, 25 Sep 2026, from a read of Planet's live viewer (WEB · D8, `viewer2d/viewer.js` on Garcks-PC over SSH), the hub's scripts and the public headers measured that afternoon. Jamie's brief: "optimise for any user on whatever device they may be using", not the laptop. Nothing here is built yet; every decision below is open until Jamie takes it at the next decision round, and every Planet item goes to Planet Claude as a request under rule 8. Read at the W6 decision round; after that the Coverage Plan and Active-Work carry the pointer.*

## What one visitor costs today

| Cost | Today (WEB · D8, W5-d hub) |
|---|---|
| First load | grid 157 KB (cached a day), viewer script 36 KB (not cached in the browser), first picture 56 KB; 0.3 s on a good line, about 5 s on 3G |
| Ongoing data | one 56 KB picture a second, about 200 MB an hour |
| Ongoing requests | the viewer asks `/api/meta` 8 times a second (`POLL_MS` 125, a LAN setting); the hub once every 2 s |
| Drawing | 60 frames a second always; a full-screen canvas at up to 2× the screen's sharpness; edge smoothing on |
| Per frame | ~184,000 triangle corners drawn as one call, the far half rasterised and discarded pixel by pixel; the outlines; three river meshes; the air rim |
| Per picture | colours and slopes written for every corner (~1.6 MB), sliced over frames (WEB · D7/D8), then two uploads |
| House side | constant, however many visitors: Cloudflare answers everyone from one fetch a second |

**Already right, device-neutral, leave alone:** the edge cache and the one fetch a second; the grid cached a day; a hidden tab neither asks nor draws; the restart rule; the still fallback with "last seen"; the resolution that steps down to half when frames fall under 50 a second; edge smoothing (Jamie's `?noaa` side-by-side, W5-e: stays on).

**What we cannot know (rule 11, no analytics):** no visitor will ever report a frame rate. Every number comes from devices we own or emulate.

## Findings, ranked by who they hit

1. **The canvas is the whole screen; the globe is about a third of it** on a laptop and on an upright phone alike. WEB · D9 sized the canvas to the globe and was withdrawn after a stutter seen on one laptop with an unproven cause (the NVIDIA idling between lighter frames). Every other device lost the gain.
2. **The far side of the globe is drawn and thrown away** every frame in the fragment shader (`if (vFacing < 0.0) discard`). Back-face culling skips it before the pixels: about half the cell fill for one line, if the engine's triangles wind consistently. Must be checked, not assumed (mixed winding shows holes).
3. **Data on mobile:** ~200 MB an hour. The glide runs 2.2 pictures behind, so the eye sees the interpolation, not the arrivals; a picture every 2 s halves the data and probably looks the same. A trade-off, Jamie's.
4. **Eight meta asks a second keep a phone's radio awake.** Meta is cached a second at the edge, so 7 of 8 asks return the same answer. 500 ms under `?embed` costs at most half a second of lag, hidden behind the glide.
5. **60 frames a second, forever, on battery.** The turn is under 0.3 px a frame; 30 fps on phones and on battery halves GPU time for a step still under a pixel. Visible in principle, so Jamie's. The viewer does not honour `prefers-reduced-motion`; the hub's stylesheet does.
6. **Colour per corner, not per cell.** Every picture rewrites 184,000 corners (~1.6 MB) and uploads it; D7/D8's slicing exists to hide that. One value per cell (10,242 × 4 B ≈ 40 KB) as a small texture, looked up in the vertex shader, with the elevation ramp and lake tint done on the card, makes a picture's preparation almost nothing. The one structural change; a bigger job than items 7–11 together.
7. **The viewer script is served max-age=0** (36 KB refetched every visit; the edge showed EXPIRED). A day in the browser with a version in the address when it changes. Small.
8. **No WebGL, no fallback in the hub:** the viewer shows an error inside the frame and the hub shows the frame 2.5 s after load regardless. Now `?embed` sends "drawn", the hub can keep the still until it arrives.
9. **Pictures on the wire:** 32-bit floats, 164 KB raw. Whole metres in 16 bits, or the change since the last picture, roughly halves it. Later.

**Not worth it, and why:** instancing (one mesh, ~10 draw calls a frame; nothing to instance); WebGL2 (nothing needs it); a web worker (preparation is sliced, and finding 6 removes most of it); level-of-detail meshes (the mesh is small); a depth buffer (nothing overlaps).

## Decisions for the W6 round (each with its trade-off)

| # | Decision | Options | Claude's recommendation |
|---|---|---|---|
| P-A | Reopen D9, the canvas sized to the globe | Retest the kept binary side by side with the laptop stutter *measured*, or leave two thirds of every visitor's frame flat | Retest. A laptop quirk gets a laptop-side answer; every other device gains |
| P-B | The public picture pace | 1 s (liveliest) · 2 s (half the data on phones, half the picture building) | Jamie's eye on the phone, behind the glide, is the bar |
| P-C | The embed poll, 125 → 500 ms | Numbers settle it: request count before and after | Claude decides by the numbers; Jamie confirms |
| P-D | Frame rate on phones and on battery | 60 always · 30 on phones and battery, 60 on mains | 30, with a side-by-side on Jamie's phone |
| P-E | Honour `prefers-reduced-motion` (the turn stops for those who ask) | Yes · no | Yes; nothing changes for anyone else |
| P-F | The hub keeps the still until "drawn" | Yes · no | Yes; the hub's own change, one test |
| P-G | Back-face culling | A check first (winding), then on if clean | Check, then on |
| P-H | Colour per cell (finding 6) | Now, as the next big Planet item · after A–G are measured | After: measure A, G and D first; if a cheap phone still drops frames on a picture's arrival, this is the fix |

## The items, by owner

**Planet Claude (requests, rule 8; `docs/process/requests/planet-performance.md` once Jamie decides, items numbered on from 11):**
12. Back-face culling, after a winding check (P-G).
13. D9 retested with the stutter measured on the laptop, the canvas sized to the globe (P-A).
14. Under `?embed`: the poll at 500 ms (P-C); 30 fps on a phone or on battery (P-D); the turn stopped under `prefers-reduced-motion` (P-E).
15. `viewer.js` cached a day with a version in its address (finding 7).
16. Colour per cell as a texture (P-H), when its turn comes.
17. Smaller pictures on the wire (finding 9), later.

**The hub (this repo):** the still kept until "drawn" (P-F), one test in `site/test/`; `check-public.sh` gains a data-per-minute assertion once P-B is decided (rule 9: the budget is a test).

**The door:** nothing. If P-B chooses 2 s, it is the viewer's pace, not the door's hold (W5-b/c stand).

## How we measure, without the laptop as the yardstick

- **The device matrix, owned or emulated:** Jamie's phone on mobile data · the laptop forced onto the Intel chip alone · Chrome's device emulation with 4× and 6× CPU throttling for a cheap Android · Garcks-PC (Planet Claude's own runs). Each run 60 s reading the viewer's own `?timing=log`.
- **The numbers of record, per device, in the progress log:** frames a second · longest frame gap · resolution scale reached · data per minute · requests per minute · time to first picture. Taken once before item 12 (the baseline) and after each item.
- **The how-it-works page** gets one panel per device from the same runs.
- **Order of build:** baseline → 12 (culling) → 13 (D9) → 14 (poll, fps, reduced motion) + hub P-F → re-measure → decide P-H.
