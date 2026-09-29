# WEB-13, the second brief: the full-size planet at full detail, its picture packed

*From laptop Claude (Workshop folder, a Fable session), 29 Sep 2026, at Jamie's word. It replaces the first brief of the same morning (`for-planet-claude-web13-brief.md`, now in `~/planet-notes-archive/`). For a Planet build session on Opus 5.5. The Workshop never edits Planet (its rule 8): everything here is a request. The wording, the design and the code are Planet's, under Planet's rules. When acted on, please move this note to `~/planet-notes-archive/`.*

**Read first:** `CLAUDE.md`; `docs/PROGRESS.md`; the full-size brief's sections 2 and 3; `docs/rulebook/viewer.md`; then this.

## 1. What changed, and why

The owner looked at the first brief's decision pictures (`~/planet-looks/web13/decisions/`) and said no to the coarse picture: "I'm not keen on the coarse version". Laptop Claude agrees: at level 32 the thin islands and the fine relief are lost. The first brief aimed too low, and the pictures caught it before anything was built.

**The owner's decisions (29 Sep, Workshop W14-e):**

- **Full detail for every viewer, made lighter by packing.** No coarse level.
- **The visitor's budget is 300,000 bytes a second** on the wire (it was 80,000 bytes a picture).
- **The owner's phone draws a full-size planet "fine"** (ports 8095 and 8096, home wifi), so the device is not the limit.

**From the first brief, still standing:** where the session works (a second copy, `~/planet-web`, never `~/Desktop/planet` while FS-6 is there; the owner judges on the laptop and a phone at port 8097); measure first; the records and the reply. **Fallen:** the levels, the coarse grid, its three decisions.

## 2. This sitting's one change

**Every viewer gets the full-size picture, packed to about half its weight, with nothing the eye can see lost.**

## 3. The numbers behind it

Measured by laptop Claude on today's public picture (f 32, a land planet), gzipped at levels 1 and 6:

| | Bytes before gzip | Level 1 | Level 6 |
|---|---|---|---|
| As sent today (four fields, 32-bit each) | 164,016 | 71,829 | 60,755 |
| Packed for the measurement | 92,178 | 39,532 | 31,398 |

The packing tried: heights and lake depths as whole metres in 16 bits; the river's size in 8 bits on a log scale; the way down in 32 bits. It is a measurement, not a design.

| Estimated at full size, gzipped | As sent today | Packed |
|---|---|---|
| The ocean planet, young | 398,000 to 524,000 | 220,000 to 290,000 |
| A planet with land and rivers | 983,000 to 1,182,000 | 550,000 to 650,000 |

The public door gzips at level 1 today. Laptop Claude can raise it; say if the weights ask for it.

## 4. Decisions to put (two, both at the start, each with a picture)

1. **Is the packed picture the same to the owner's eye?** Stills of seed 7's ocean planet at 500 million and 2 billion years (copies of `~/planet-looks/ocean-planets/looks/seed-7/myr-0500/world.sqlite` and `myr-2000`), drawn from today's picture and from the packed one, side by side, with a third picture marking every pixel that differs.
2. **What happens when a picture is heavier than the budget allows each second.** Once the planet has land and rivers its picture will pass 300,000 bytes. Offered: the viewer asks less often in proportion, a picture every 2 or 3 seconds, gliding between, as the public viewer already does when pictures arrive 2 or 3 ticks apart. Show the 2-billion-year planet live with a picture a second and with one every 3 seconds. If the owner says the slower one is not good enough, stop: the way on is tighter packing or WEB-14, not a looser budget.

## 5. Measure first, before any change

As the first brief's section 5: the picture's and the grid's bytes, raw and gzipped at levels 1 and 6, for the ocean planet at birth, 500 million, 2 and 5 billion years and for one land planet; the viewer's work per picture at full size in headless Chromium on the graphics card, at normal speed and slowed 4 and 6 times. Take the timings while FS-6 is not building.

## 6. Steps

1. **The packed picture, in `crates/engine`** (never `crates/sim` or the world's state: rule 5). A new address, as a path: **`/api/packed/<field>`**. One snapshot, so one tick; `X-Planet-Tick` as today. It carries what `/api/picture/<field>` carries. The layout is yours. Asked of it:
   - its header says, for each field, how its numbers are stored and the size of one step, so a viewer needs no table of its own;
   - heights and lake depths to the whole metre;
   - the way down as which neighbour (one byte), since water only ever runs to a neighbour; the sea has its own mark;
   - the river's size with steps fine enough that no river the viewer draws today appears, vanishes or changes width;
   - labels (`plate`, `crust`) exact;
   - a value that will not fit is an error said plainly, never clipped in silence.
2. **`/api/picture/` and `/api/field/` stay byte for byte as they are**, for tools, for small planets and as the way back.
3. **The viewer** asks `/api/packed/` first, for every field, and unpacks into the same arrays it draws from today. If the engine has no such address it falls back to `/api/picture/` and then the fields, saying so in the console as it does now.
4. **The pacing**, by decision 2: the least time between two fetches of the picture is today's 200 ms, or the last picture's bytes on the wire divided by 300,000 bytes a second, whichever is longer. The browser knows the bytes on the wire for its own address. The console says once when the pace slows, and why.
5. **Tests**, each named for the fact it checks: packed then unpacked, every value is within its stated step; the way down is exact; the layout's sizes; the tick header; 404 for a field that does not exist; 405 for anything but GET; the old addresses unchanged to the byte; a small planet packs too.

## 7. Numbers to report, and the look

- **Bytes:** the packed picture raw and gzipped at levels 1 and 6, for the worlds of section 5. The grid's weight as it is (it comes once a visit).
- **Bytes a second** over a minute of watching, read in the browser, at birth and at 2 billion years.
- **The viewer's work per picture**, unpacking included.
- **The look:** seed 7's ocean planet live from year zero at full size on port 8097, one tick a second, the ocean settings. The owner looks on the laptop and on a phone, with `?embed` and without, and says yes or no.

## 8. Stop and say so, in plain words, when

- the newborn ocean planet's packed picture is over 300,000 bytes gzipped at level 1. Report both levels and stop. Do not coarsen a step to pass;
- the owner can see any difference between the packed picture and today's;
- the drawing itself needs changing (the glide, the relief, the air, the embed), beyond fetching, unpacking and the pace;
- a golden hash moves, or anything in `crates/sim` or the world's state needs changing;
- the door or Cloudflare would need more than the one new address. Write to laptop Claude; do not work round it;
- the sitting's one change is done.

## 9. Queued, in this order

1. **The grid packed.** It is 6,553,692 bytes raw and about 3 MB gzipped at full size, once a visit.
2. **WEB-14**, full detail where a visitor zooms in: for when pictures grow heavier than the pace can carry. Its design is put to the owner with a picture before anything is built.
3. **Coarse levels:** dropped, unless phones later ask for them.

## 10. The records, the reply and the release

- Decisions as Planet's WEB · D13 onward; `viewer.md` and `docs/COMMANDS.md` in the same commits; the log entry in 25 lines.
- **A reply for laptop Claude** on Garcks-PC's Desktop: the commit; the address as built; the layout in a few lines; the weights and timings; what the owner said.
- **Before the release set, the planet is grown and looked at on the commit to be released.** The four ocean planets of 28 to 29 Sep were grown on `97d3cc3`; FS-6's rule may be in `main` by release day, and would change how the land comes. Seed 7 on the ocean settings, to 5 billion years on the hired server, the picture set at the seven ages, the owner's yes.
- **Then the release set, at the owner's word:** a program built from that named commit (never from `target/` as it lies), seed 7's world at tick 0, the seed-2 check. The Workshop's half follows: the door taught `/api/packed/`, the guard weighing it, a full-size tick timed on the public server's 2 cores, the About panel, the release.

*Written in Workshop W14 (29 Sep 2026).*
