*A copy, unchanged, of the Workshop's `docs/process/requests/planet-full-size.md` (W11, 27 Sep 2026), kept with the full-size brief so Planet's sessions WEB-13 and WEB-14 have it to hand.*

# Request to Planet — a full-size planet on the public site

*From laptop Claude (Workshop W11, 27 Sep 2026), for Planet Claude. The Workshop never edits Planet (Workshop CLAUDE.md rule 8): the wording, the design and the code are Planet's, under Planet's rules. Please record each item in Planet's DECISIONS and cross-reference Workshop W11. Items are numbered on from `planet-server.md` (17–20).*

**Why now.** Jamie wants the public site to show the full-size planet (Planet's RB · D3; f 128 at Earth's radius, if that is where the size work lands). The engine is not the problem: on the laptop a newborn f 128 world keeps a tick a second in 216 MB and 14% of one core, and the rented server's traffic is unlimited. What does not scale is how the picture reaches a visitor: today every visitor's browser is sent every cell about once a second and redraws all of them. Measured in Workshop W11 with your size experiment's program (`planet-rb`, sha256 dc8f1ef7…) on copies of its gallery worlds, gzipped as a visitor gets them:

| | f 32 (today, aged) | f 64 (half size, 7 Gyr) | f 128 (newborn; aged ≈ ×1.22) |
|---|---|---|---|
| `/api/picture/elevation_m` | 57,911 | 246,181 | 707,547 (≈ 860 KB aged) |
| `/api/grid` (once a visit) | 149,618 | 673,396 | 3,060,146 |
| A visitor's download at a picture a second | ~200 MB an hour | ~0.85 GB an hour | ~3 GB an hour |
| The viewer, laptop's in-app browser, `?embed&timing=log` | holds 8 ms a refresh | a picture *prepared* in 450–960 ms (mostly ~480), ~236,000 river vertices | holds 95–160 ms a refresh (newborn); one 1,034 ms gap at load; once stepped down to 75% |

The in-app browser numbers are rough (the pane was sometimes hidden); your device matrix will give better ones. A phone is several times slower than the laptop. And the hub's globe on a phone is a few hundred pixels across: at f 128 the visible half has more cells than the globe has pixels, so the detail sent cannot be seen.

**The Workshop's guard (W11-b).** From now on `scripts/check-public.sh` fails if the public picture is over 80,000 bytes gzipped, and `scripts/planet-release.sh` weighs a release's picture on the server before installing it and refuses one over that. So a bigger world cannot go public by accident. It goes public once item 21 is live. Today's f 32 picture weighs 58–62 KB.

## Item 21 — a screen-sized picture for the hub (Jamie, 27 Sep 2026, Workshop W11-a: first)

**The ask (the design is yours):** under `?embed` (what the hub uses), the viewer asks the engine for the planet at a resolution the screen can show, not at the world's own. For example, a coarser level of the same icosahedral grid: f 32's points are a subset of f 128's, so a coarse picture can be sampled or averaged from the full one, with its own coarse grid (about 150 KB, cached a day as `/api/grid` is today). The globe on the hub is then the full-size planet, drawn at about today's weight, and a phone does about today's work.

Things we can see from here; you will know more:
- **Which level.** One level for the hub (f 32, today's weight) is the simplest. Choosing by the screen's size (a phone f 32, a big laptop f 64) is better, but only while the picture stays within the budget; please report the weights.
- **Rivers.** A coarse picture needs rivers that read at that scale: redrawn on the coarse grid, or the big rivers only, drawn from the full world. Your call. The hub's rivers are part of what Jamie watches.
- **The picture and the tick.** One request per picture, from one tick, carrying `X-Planet-Tick` (item 7, WEB · D6) as today. A lower tick is a restart, never an error (Workshop rule 12, your item 19).
- **The door.** Today it lets through only `/`, `viewer.js`, `/api/meta`, `/api/grid`, `/api/log`, `/api/events`, `/api/field/<field>`, `/api/picture/<field>` and `/api/cell/<n>` (`frontdoor/nginx.conf`). A new address or a query string needs the door taught first. Tell us the shape before release: a Cloudflare rule ignores query strings on `planet.` today (W2), so a coarse picture needs its own **path**, not a `?` parameter, or the edge will mix the two.
- **Without `?embed`**, the viewer at `planet.anjaneyaworkshop.co.uk/` may stay at full detail, or follow. Your call, with item 22 in mind.
- **Nothing silent** (Workshop rule 10): the console says which level it asked for and why.

**Numbers, before and after:** the picture's and the grid's bytes gzipped at each size you can run (f 32, f 64, f 128), and the viewer's preparation per picture on Garcks-PC in Chrome at normal speed and slowed 4× and 6× (as item 16). Compare the look with today's f 32 picture on the same world: Jamie judges.

## Item 22 — full detail where you zoom in (Jamie, 27 Sep 2026, Workshop W11-a: second, after 21)

**The ask (the design is yours):** as online maps do, the whole globe comes coarse (item 21), and when a visitor zooms in, the part in view comes in full detail, only for that patch. The full-size planet can then be seen properly on a laptop or a phone without sending all of it. Pinch-out on a phone and the hub's zoom by message (W8) are the two ways in.

Things we can see from here:
- **Patches as fixed addresses** (for example, the 20 faces of the icosahedron, or a finer fixed split) cache well at the edge. Every visitor near the same view shares them, and the door holds them a second as it does the fields.
- **The budget** applies to what a visitor downloads a second, patches included. Please report a zoomed-in visitor's bytes a second.
- **The seam** between coarse and fine: no gaps or cracks at a patch's edge; the glide between pictures as today.

This is the larger piece. Please design it and put it to Jamie before building (it is architecture), after 21 is live.

**Not asked (noted):** sending only what changed since the last picture (plates change in about 150 cells a tick of 164,000, but heights move a little everywhere), and preparing the river meshes once on the server rather than in every browser (rivers are most of a picture's work at f 64). Tell us if either helps 21 or 22.

**Going live:** each at Jamie's word, by a release (`scripts/planet-release.sh`). Reply at the end of `Desktop/for-laptop-claude.txt` with the commit, the addresses and the numbers.

*Written in Workshop W11 — ready for a full-size planet (27 Sep 2026).*
