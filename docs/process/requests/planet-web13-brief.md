# WEB-13 · A picture the size of the screen: the brief for its first sitting

*From laptop Claude (Workshop folder, a Fable session), 29 Sep 2026, at Jamie's word ("write the brief for WEB-13 now please"). For a Planet build session on Opus 5.5. The Workshop never edits Planet (its rule 8): everything here is a request. The wording, the design and the code are Planet's, under Planet's rules. It fills out the full-size brief's three lines on WEB-13 and the Workshop's item 21 (`docs/ITEMS_21_22.md`); where they differ, this is the newer. When acted on, please move this note to `~/planet-notes-archive/`.*

**Read first:** `CLAUDE.md`; `docs/PROGRESS.md`; the full-size brief's sections 2 and 3; `docs/ITEMS_21_22.md`; `docs/rulebook/viewer.md`; then this.

## 1. Why now

The owner wants a full-size planet on the public site, born as ocean (your FS · D30). What stops it is the picture's weight. Measured on 28 Sep from the laptop, gzipped as the door sends it:

| `/api/picture/elevation_m` | Bytes |
|---|---|
| The public planet today (f 32) | 61,226 |
| The ocean planet at full size (f 128; 2,621,616 before gzip) | 398,373 to 524,175 |
| A land planet at full size | 983,365 to 1,181,988 |
| **The Workshop's guard** (its `check-public.sh` and its release both refuse more) | **80,000** |

The ocean planets grown overnight (`~/planet-looks/ocean-planets/`) show what a visitor will watch: islands by 500 million years, island continents with rivers by 2 billion, continents by 5.

## 2. This sitting's one change

**A full-size planet drawn at today's weight:** the viewer asks the engine for the planet at level 32 (10,242 cells, today's public cell count) and draws that. Heights and lakes only.

**Not in this sitting**, each queued in section 9: rivers at a coarse level, a middle level for bigger screens, WEB-14.

## 3. Where the session works

- **Planet's code and Rust are on Garcks-PC only.** The laptop has neither (checked 29 Sep: no `cargo` on Windows or in its Ubuntu; `C:\Users\Garcks\Projects\planet` is an empty repository).
- **FS-6 is in flight in `~/Desktop/planet`.** Please do not work in that folder. Use a second copy: `git clone git@github.com:JGarcks/planet.git ~/planet-web`, on `main`, with `git config core.hooksPath scripts/hooks`. Pull before every push; never force.
- **The owner judges on the laptop's screen and a phone**, at `http://192.168.1.157:8097/` (8096 is the ocean planet; 8090 is taken).
- FS-6 touches `crates/sim`, `look.rs` and `wall_watch.rs`. This sitting touches `crates/engine/src/server.rs`, one new file beside it, and `viewer2d/`. Both may touch `main.rs`: pull often.

## 4. Decisions to put (three, all at the start, each with a picture)

Make the pictures first from copies of `~/planet-looks/ocean-planets/looks/seed-7/myr-0500/world.sqlite` and `myr-2000/world.sqlite` (copies only).

1. **How a coarse cell takes its value.** (a) The value of the full-size cell at its centre: sharp, but an island narrower than a coarse cell shows or vanishes by luck, and may flicker as crust moves. (b) The mean of the full-size cells nearest to it, by area: steady, but narrow islands sink below the sea. Show both beside the full picture at 500 million years, where the land is thin island chains.
2. **Who gets the coarse picture.** (a) The hub only (`?embed`). (b) Every viewer whose planet has more cells than the level, with `?level=full` for the owner's own network. The Workshop will likely refuse the full picture at the public door until WEB-14 (laptop Claude puts that to the owner), so under (a) the public viewer without `?embed` must still fall back to the coarse level and say so.
3. **Release before rivers, or after.** Rivers at a coarse level are sitting two. Show the 2-billion-year planet with rivers and with `?norivers`. The owner chooses: the ocean planet goes public after this sitting without rivers drawn, or waits for sitting two.

## 5. Measure first, before any change

On Garcks-PC, written into the log entry:

- The picture's and the grid's bytes, raw and gzipped at levels 1 and 6, at f 32, f 64 and f 128, for the ocean planet at 500 million and 2 billion years and for one land planet.
- The viewer's work per picture at f 128 in headless Chromium on the graphics card, at normal speed and slowed 4 and 6 times (the harness of WEB · D11 and D12).

## 6. Steps

1. **Check that level 32's points are among level 128's.** Item 21 says so; the library may place inner points otherwise. Build both grids, find the nearest full-size cell to every coarse point, print the largest gap in kilometres. Under a kilometre: the centre is that cell. Over: use the nearest cell and say so in the log.
2. **The level, in `crates/engine`** (never `crates/sim` or the world's state: rule 5). Built once at start: the coarse grid (`Grid::new(32, radius)`); for each coarse cell, the full-size cell at its centre; for each full-size cell, the coarse cell that owns it (the nearest centre, found by walking neighbours: rules 1 to 3). Values by decision 1, weighted by area. Labels (`plate`, `crust`) are never averaged.
3. **Two new addresses, as paths** (a Cloudflare rule ignores query strings on the public name):
   - `/api/level/32/grid`: the coarse grid, in today's `PGRD` layout.
   - `/api/level/32/picture/<field>`: today's `PPIC` layout, 10,242 cells, one snapshot so one tick, `X-Planet-Tick` as today. In this sitting it carries the field asked for and `lake_depth_m`, so lakes are tinted; `drainage_km2` and `downstream_cell` are left out (the layout already allows it).
   - `/api/meta` gains `"levels": [32]`. A level the engine has not got answers 404 "no such level".
   - **A planet of f 32 or less offers no level, and every reply it gives is byte for byte today's.**
4. **The viewer** chooses its level once, at load, by decision 2, and fetches the grid and the pictures from the level's addresses. Today it asks `/api/picture/` only when rivers are drawn and `/api/field/` otherwise, and one switch (`water`) stands for rivers and lakes together; at a level it always asks the level's picture, draws lakes and not rivers. That fetching and that switch are what changes. The glide, the relief, the air, the embed messages and the restart rule are not touched. It says once in the console which level it chose and why, and that rivers are not drawn at a coarse level. A click on a cell at a coarse level, outside `?embed`, reports the full-size cell at the centre, or is switched off with a plain line: the smaller honest change.
5. **Tests**, each named for the fact it checks: the new addresses' status, sizes and tick header; 404 for a level or field that does not exist; 405 for anything but GET; every full-size cell has one owner; every coarse cell owns its own centre; the owners' areas sum to the sphere; the level built twice is identical; a small planet offers no level.

## 7. Numbers to report, and the look

- **Bytes:** the coarse picture and the coarse grid, raw and gzipped at levels 1 and 6, for the worlds of section 5. Laptop Claude's estimate for the ocean planet's coarse picture, sampled crudely: 28,000 to 36,000 bytes.
- **The viewer's work per picture** at the coarse level, as section 5.
- **The look:** seed 7's ocean planet live from year zero at full size on port 8097, at one tick a second, with the ocean settings (`~/planet-looks/ocean/live/ocean.txt`). The owner looks on the laptop and on a phone, with `?embed` and without, beside the full picture on port 8096, and says yes or no.

## 8. Stop and say so, in plain words, when

- the coarse picture weighs over 80,000 bytes gzipped at level 1. Do not pack, trim or drop a field to pass;
- a golden hash moves, or anything in `crates/sim` or the world's state needs changing;
- the public quarter-size planet's replies would differ in any byte;
- the viewer's drawing needs changing to show a level (the glide, the relief, the air or the embed), beyond what it fetches and the rivers' switch;
- the door or Cloudflare would need more than the two new addresses. Write to laptop Claude; do not work round it;
- the sitting's one change is done. Rivers, the middle level and WEB-14 are not begun.

## 9. Queued, in this order

1. **Sitting two: rivers at a coarse level.** One way, for you to weigh: from each coarse cell's centre follow the full-size channels downstream until they enter a cell with another owner; that owner is the coarse cell's way down, and the channel's drainage there is its size.
2. **A middle level (64) for bigger screens.** As floats it would weigh about 107,000 to 138,000 bytes on the ocean planet, over the guard, so it needs heights packed smaller. The guard does not move (the Workshop's rule 9).
3. **WEB-14's design**, once WEB-13 is live: put to the owner with a picture before anything is built (item 22). This sitting's addresses leave room for it: a level is named in the path, so patches can be too.

## 10. The records and the reply

- Decisions as WEB · D13 onward in `docs/DECISIONS.md` (Planet's WEB · D13; the Workshop's own "WS · D13" is a different matter). `viewer.md` and `docs/COMMANDS.md` in the same commits. The log entry in 25 lines.
- **A reply for laptop Claude** on Garcks-PC's Desktop: the commit; the addresses as built; the weights and timings; what the owner said; the three decisions.
- **The release set only at the owner's word:** a program built from the named commit (never from `target/` as it lies), seed 7's world at tick 0 on the ocean settings, the seed-2 check. The Workshop's half follows: the door taught the two addresses, the guard pointed at the coarse picture, a full-size tick timed on the public server's 2 cores, the page's wording, the release.

*Written in Workshop W14 (29 Sep 2026).*
