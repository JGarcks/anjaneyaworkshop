# The full-size brief: Planet's second edition

*From laptop Claude (Workshop folder, a Fable session), 27 Sep 2026, at the owner's word, after the meta review of the same day. For Planet's sessions, which the owner means to run mostly on Opus 5.5, coming back to Fable for reviews. The Workshop never edits Planet (its rule 8): everything here is a request. The wording, the design and the code are Planet's, under Planet's rules. Please file this brief word for word as `docs/FULL_SIZE_BRIEF.md`, as the earlier briefs were filed, and record the owner's decisions in section 2 as FS · D1 to D7.*

*With it, in the same folder: `CLAUDE.proposed.md` and `PROGRESS.proposed.md` (the two workflow documents, trimmed, for session FS-0 to install), `ITEMS_21_22.md` (the Workshop's request for the viewer, unchanged), and `reference/` (`look_map.py` and `look_numbers.py`, the two small scripts the review's pictures and measurements were made with: use them or not).*

**How to read this.** Every session reads sections 2 and 3, then its own part of section 6. Sections 1, 4 and 5 are read once, in session FS-0.

---

## 1. What the review found

Read only: Planet's four branches, its session log, its decisions (148 then), the Rulebook, the findings, the research and the code; and the two planets' own data, fetched as a viewer fetches it. The owner's page with the maps and the chart: https://claude.ai/artifact/M4oXiKmu7MExEN2sPPJKWN

**The rules build high ground in one place: a strip within about 500 km of the sea.** Arc rock reaches 400 km from a trench and a collision's rock 375 km (`arc_reach_km`, `collision_reach_km`). Nothing in the rules reaches farther.

| Measured 27 Sep 2026, both from seed 25660 on today's rules | Quarter size (f 32, 22.5 billion years) | Earth size (f 128, 2.1 billion years) |
|---|---|---|
| Land within 500 km of the open sea | 97% | 37% |
| Of land above 1 km, the share within 500 km of the sea | 100% | 95% |
| Half of all land stands below | 576 m | 160 m |
| Farthest land from the open sea | 630 km | 3,330 km |
| Plates, from 400 million years on | 4 to 17 | 31 to 49 |
| Land at birth, then at its lowest in the first 500 million years | 30%, then 14% at 60 million years | 30%, then 3% at 50 million years |
| Highest ground above the sea, and the sea's level above the fixed level, at the last reading | 4.5 km and 0.5 km | 3.6 km and 1.4 km |
| The two added together, at every reading since 200 million years | 2.1 to 5.0 km (usually about 4.0) | 5.0 km, always |

- **The small planet's good looks came from its size.** Its continents are all coast, so the strip is the continent. At Earth's size the strip is a rim and two thirds of the land lies behind it, flat, with nothing to shape it.
- **The fixes found on the small planet do not carry over.** The radius scale is 1 at Earth's size (`for_this_planet`), so the Earth-size planet already runs the 10-million-year weld and the full arc rock and grinding. It still looks like this.
- **The highest ground has been the ceiling less the sea's rise.** Crust stops at 65 km, which floats at 5.0 km above a fixed level. On the Earth-size planet the coastal wall stands at that ceiling all the time, and the sea has risen about 1.5 km above the fixed level, so nothing stands higher than about 3.5 km above the sea. The small planet's ranges are usually below the ceiling.
- **Why a wall on every coast:** about half of every coast has a trench (Earth: about a fifth), because every border either opens or closes and none slides, and because floor 180 million years old beside its own continent breaks away within about 20 million years. At quarter size an ocean closes before its floor grows old. At Earth's size the floor grows old first, so that rule goes from occasional to usual.
- **Why so many plates:** plates are born three ways (a crack, an old margin's band, a stranded band) and die one way (no crust left). Nothing merges them. Births are clocked in millions of years and shares of the planet; a plate's life is its width over its speed, four times longer at Earth's size. A band of old floor may break again after 50 quiet million years.
- **Why flat interiors and rivers in combs:** nothing roughens the land after a planet is born. There is one bedrock, the same rain everywhere, and the first world's noise is set in shares of the radius, so its finest relief is 160 km at Earth's size against 40. Rivers grade the interior to the sea and then follow the grid.
- **Why seas inside continents:** they are ocean floor cut off from the ocean by ribbons of arc (COASTS findings). The sea is any cell below sea level, joined to the ocean or not; hollows stand brim-full; nothing evaporates.
- **What is sound, by all three code reviews:** the grid and its checks; the random draws; saving that survives a kill; each plate carrying its own map, which never smears; the rock books; the read-only server; the tests' bookkeeping; the measuring tools; the records. **Keep the engine.**
- **How it got here:** the whole drifting-plate model was planned, agreed and built in one afternoon (20 Sep) on a size nobody chose. Five days then went on holding the continents' share steady to 20 billion years, on gaps smaller than a planet's luck. No gate guards the look.

---

## 2. The owner's decisions (27 Sep 2026)

The owner, to laptop Claude, after reading the review: **"absolutely agree with you on all points and happy to keep the engine and go full size"**, and: **"I intend to use Opus 5.5 for the majority of the work, and coming to you (Fable) for things like this."** Please record these, in Planet's own wording:

| | Decided | It replaces |
|---|---|---|
| **FS · D1** | **Keep the engine; reshape the land at full size.** The rules that shape the land are rebuilt on the Earth-size planet, judged by the owner's eye on pictures, one visible change at a time. | LK · D1's order (the look on the small planet first, full size last); the mountains plan's steps 2 and 3 |
| **FS · D2** | **The planet's size is Earth's:** radius 6,371 km, f = 128, 163,842 cells about 60 km across. Half size (3,186 km, f = 64) is for quick previews only and never the judge. Quarter size is for unit tests, and for the public planet until the viewer can carry full size. | The brief's quarter radius (never decided, RB · D2); "the size is chosen from the half-size experiment" (RB · D3) |
| **FS · D3** | **A planet lives about 5 billion years in deep time.** Rules are judged over that life. What happens at its end (a new planet is born, or the clock slows) is put to the owner in session FS-9. | Judging to 20 billion years (SC · D5); the nights and their screen (TEST · D2) |
| **FS · D4** | **"Nothing scripted" is read as the owner meant it:** a rule may answer the planet's own state over a wide area (a collision raising land 1,000 km inland is a cause), and a planet may be born with a past (old worn ranges, uneven crust, harder and softer rock). Still ruled out: anything on a schedule, and any target that steers a planet toward a figure. | The strict reading of W1 · D26 (flat newborn continents; no rule reaching past a plate's edge) |
| **FS · D5** | **The hired test server is kept** for growing full-size planets. It costs about £7.50 a day while it exists; the credit runs to about 27 Oct. Creating and deleting it stays the owner's and laptop Claude's. | "The test server can be deleted" |
| **FS · D6** | **Build sessions run on Opus 5.5; reviews run on Fable** at the points marked in section 7, in a fresh session. | |
| **FS · D7** | **The rules of work in section 3**, and the workflow documents trimmed as in section 4. | The habits they name |

---

## 3. How a session works from now on

These are the second edition's rules of work, the same eleven as "How we work now" in `CLAUDE.proposed.md`. They stand beside Planet's thirteen rules that must not be broken, which are unchanged.

1. **Full size is the judge.** The planet is Earth's size (FS · D2). A change to a rule that shapes the world is grown at that size before it is kept. Nothing is adopted on a small planet's evidence.
2. **The owner's eye is the gate.** A change that shapes the world is kept when the owner has seen the same set of pictures before and after, and said yes. Numbers sit beside the pictures. They support the eye; they do not decide.
3. **One visible change a session.** A session changes one thing the owner can see, and ends when the owner has looked. No second world-shaping change is begun until then.
4. **At most three decisions are put in a session**, all at its start, each with its options, what each costs, and a picture or a number the owner can check. No lists to confirm. If three of Claude's own decisions are already waiting for the owner, nothing new is built until they are cleared.
5. **Causes before numbers.** When a fault shows, find the rule that makes it and change the rule's shape. A number is never turned to cancel the side effect of another rule. If a fix needs a second fix, stop and tell the owner.
6. **Kilometres and years.** Every rule is written in kilometres, years and what rock and water do. None is written in cells, neighbour rings, shares of the planet or "times the radius". A rule that must know the cell's size says why in its note.
7. **A planet lives about 5 billion years** in deep time (FS · D3). Rules are judged over that life.
8. **Tripwires tell; they do not choose.** Land between 25 and 40% and continent between 32 and 45% over a planet's life are tripwires: the owner is told when one is crossed. No rule is chosen because it lands nearer the middle.
9. **Many-planet runs only when a picture cannot answer**, and only for a gap bigger than the planets' own luck (`scripts/score_runs.py` says how many planets that takes). Three seeds and the owner's eye are the usual test.
10. **Nothing is scripted** (W1 · D26, as FS · D4 reads it). A rule may act over a wide area, and a planet may be born with a past. Nothing happens on a schedule, and nothing steers a planet toward a figure. Every stand-in is said to be one.
11. **Stop and say so, in plain words, when:** a fix needs a second fix; a test would have to be loosened to pass; a tripwire or the look list would have to move; the change cannot be shown in a picture; the session's one visible change is done.

Pictures live outside the repository (rule 11 of the thirteen): in `~/planet-looks/`, with the command that remakes them written in the session's log entry.

**A session's shape:** read (section "How to read this") → say the plan in plain words and put the session's decisions, all at once → build → the checks → the pictures → the owner looks → the records (the decision, the Rulebook's line, the log entry, `PROGRESS.md`) → commit and push.

---

## 4. The documents: what each becomes

A session should be able to start by reading about 30 KB. Today `CLAUDE.md` is 27 KB, `PROGRESS.md` 45 KB against its own "about a page", and `DECISIONS.md` 388 KB. All of this is session FS-0's work, and changes no world.

| Document | Today | What it becomes | Stays | Goes |
|---|---|---|---|---|
| `CLAUDE.md` | 27 KB, three quarters of it commands | About 15 KB: `CLAUDE.proposed.md`, installed whole at the owner's word (FS · D7) | The thirteen rules, word for word; working with the owner; the habits that still hold; before every commit; end of every session | The commands, moved whole and unchanged to `docs/COMMANDS.md`; "develop on small worlds, run the real world at 40,962 or more" |
| `docs/PROGRESS.md` | 45 KB | One page: `PROGRESS.proposed.md`, brought up to date on the day | Where we are; the next session; what waits for the owner; the triggers still alive | The nine paragraphs of which planet ran when; the forty closed sessions; triggers written for retired planets. The whole old file is kept as `docs/archive/PROGRESS-2026-09-27.md` |
| `docs/DECISIONS.md` | 388 KB, 150 entries; "no session can read it whole" | Renamed unchanged to `docs/archive/DECISIONS-2026-09.md`. A new `docs/DECISIONS.md` begins with FS · D1, its first lines saying where the older entries are | Every entry, untouched | Nothing. New entries are short: what was decided, by whom, the options, the picture or number, the Rulebook lines changed. Twelve lines at most |
| `docs/progress/2026-09.md` | 221 KB | Left as it is. From FS-0 an entry is at most 25 lines: what changed, what was seen, the checks, the decisions, what is left | | The old `PROGRESS.md` pasted into an entry |
| `docs/RULEBOOK.md` and its pages | 65 KB | The working reference, as now. Two new pages: `rulebook/look.md` (what good looks like: session FS-3) and `rulebook/second-edition.md` (section 5 of this brief, as a page). `gates.md` rewritten for the new gate | Every rule's line, its grade, the roads tried and dropped | The maps' "guarded by: the creep's line"; the nine questions now answered (1, 2, 4, 7 and 9 by FS · D1 to D3) |
| `docs/PROJECT_BRIEF.md` | 41 KB | Amended, not rewritten: one dated paragraph each under sections 5 (size), 6 (a planet's life), 7 (Layers 1 and 2 re-opened, the look as the gate's first clause) and 12 (the target) | The vision, the architecture, the layers, the rules' reasons | |
| The closed plans: `W1_PLAN`, `W4_PLAN`, `SC_PROPOSAL`, `MOUNTAINS_PLAN`, `FASTER_TESTING_BRIEF`, `QUALITY_REVIEW`, `planet-log.md` | 80 KB | Moved to `docs/archive/`, unchanged, with a line in `docs/archive/README.md` saying that paths in older documents are as they were before the move | | |
| The findings: `SC_*`, `MOUNTAINS`, `COASTS`, `FT1`, `FT_LUCK` | 85 KB | Left where they are: the Rulebook points at them | | |
| The research: `RESEARCH*.md` | 215 KB | Moved to `docs/research/`, unchanged | | |
| `docs/how-planet-works.html` | Layer 2 as it was on 22 Sep | Left as it is, marked at its top as out of date, and redrawn when the rule sessions close | | |

**Asked of FS-0's decision round (one decision):** the moves and the two installs above, as a whole, yes or no.

---

## 5. What stays, what goes, what is rebuilt

By the Rulebook's pages. "Measured again" means at full size, in the session that touches the subject, with the pictures.

| Page | Stays | Goes | Rebuilt, and in which session |
|---|---|---|---|
| `crust.md` | Height from thickness; the densities; floor's depth by age; floor 7 km thick; river rock alone never makes continent | The height clamp, if a hash check shows it never binds | The two ceilings (70 km behind trenches, 65 km at collisions) made one, in FS-7. Floor becoming continent at 18 and 25 km (stand-ins) measured again in FS-6 |
| `plates.md` | Each plate's own map; the look-ups; plates moved by their forces, with no momentum | | The typical plate as a share of the planet; cracking's timing; the crack's wander in shares of the radius: FS-5, in kilometres |
| `first-world.md` | Continents each on a plate of their own; land 30% at birth | Flat newborn continents, by FS · D4 | The first floor's age: FS-4. Twelve plates and five continents, never weighed against the area: FS-4. A planet born with a past: FS-8 |
| `floor.md` | Floor made where plates part; its birth tick; its sinking | | The first floor's speed (7 km a million years, measured at quarter size): FS-4 |
| `trenches.md` | Continent stays on top; arc rock at Earth's rate by closing speed; scraping; grinding; the returned share as mechanisms | The radius scale on arc rock and grinding (it is 1 at full size; the switch goes once the public planet is full size) | What counts as a trench (any closing at all, today); old margins and stranded floor; arc rock at a trench's ends, which is not made to add up: FS-6. The numbers 0.5 and 0.10 are measured again there |
| `collisions.md` | Continent cannot sink; the squeeze; rock past a plateau going to the nearest continent with room; a dead plate leaves the lists | The weld clock as what ends a squeeze | A collision ended by the forces that stop the plates; the belt's 150 km and its reach; arc rock past the root thrown away; the loss at sutures: FS-7 |
| `erosion.md` | Drainage by Priority-Flood; cutting, carrying, deltas; the write-back; nothing erosion moves leaves the world | | One bedrock everywhere; the same rain everywhere (rain is Layer 3's); water shared at the power 8, fitted at 55 km cells: FS-8. The numbers 0.003 and 0.016 are measured again with rain |
| `sea.md` | A fixed volume of water; the sea settled last | | The sea as any cell below sea level; hollows brim-full; trapped floor: FS-8 |
| `size.md` | One tick is 100,000 years; plates at Earth's speeds in kilometres | The radius 1,593 km and f = 32 as the real size; everything "scaled by the radius" | The page rewritten in FS-0 for FS · D2 |
| `gates.md` | Nothing scripted (as FS · D4 reads it); hold-out seeds; error bars; the property tests; the bookkeeping clauses of W1's gate, kept as tests | The creep's line to 20 billion years; the night's screen and its fit; a tick under 8 ms at f = 32; "almost no bare floor past 250 million years" as a clause that must pass (shown, not judged, until FS-6) | The gate's first clause is the look, at full size (FS-3). A tick budget at full size (FS-1). The soak keeps every rule check and prints its land and continent without failing on them |
| `saving.md` | Seeds, draws, checkpoints, the hash, the log, events; a planet carrying on under a newer program's numbers and saying so (MG · D2) | The promise of the hash "on this machine" only | Pure-Rust maths, so every machine grows the same world: FS-1 |
| `viewer.md` | The look of the picture: colours, relief, the glide, the rim of air, rivers as ribbons | | How a big planet reaches the screen (the Workshop's items 21 and 22): WEB-13 and WEB-14, on the laptop |

**The tools.** Kept as they are: `planet survey`, `mountains`, `collide`, `settings`, `speed-check`, `sea-check` (to 5 billion years), `log`, `trace`; `scripts/score_runs.py`, `luck.py`, `coasts.py`. Kept as a runner for growing several planets at once, its screen off unless asked: `scripts/night.py`. Parked: `flex-what-if`. New: `planet look` (FS-2).

**The confirming nights** (a 5 and a 7.5-million-year weld on fresh seeds, on the server): brought home and filed in FS-0. No decision rests on them: at full size the weld is already 10 million years.

**The 5-million-year weld is not adopted.**

---

## 6. The sessions

In order. Each is one sitting. A session that finishes early stops; it does not start the next. The order of FS-4 to FS-8 may be changed by the owner in FS-3, once the look list says what matters most.

### FS-0 · The house in order (documents; no world changed)

- **Read first:** this whole brief.
- **Decisions to put (3):** the documents of section 4, as a whole; the three worktrees (`~/planet-option1`, `~/planet-speeds`, `~/planet-mountains`) removed now that their branches are in `main` (the branches stay; it frees their build folders); the habit's new wording in `CLAUDE.proposed.md` ("the best design wins, and the owner must be able to see it").
- **Steps:**
  1. Record FS · D1 to D7 as the first entries of the new `docs/DECISIONS.md`.
  2. The documents, as section 4. `docs/COMMANDS.md` is the old `CLAUDE.md`'s Commands section word for word. `PROGRESS.proposed.md` is brought up to date on the day before it is installed.
  3. `docs/rulebook/second-edition.md` from section 5; `size.md` and `gates.md` rewritten for FS · D2 and the new gate; the Rulebook's front page's nine questions marked answered where they are.
  4. The confirming nights brought home from the server (`~/planet-tests/weld-confirm`, `weld-confirm-b`), a sha256 checked on both sides, their results added to `docs/FT1_FINDINGS.md` section 7 as they are.
  5. The Earth-size test planet on port 8096 stopped by its process number, and its world kept as the planet the owner saw: a copy by SQLite's own backup in `~/planet-looks/the-planet-the-owner-saw/`. (The "before" set is grown afresh in FS-2, after FS-1 changes the rounding.)
  6. A note for laptop Claude that the server is idle and kept (FS · D5).
- **Checks:** the formatter, the linter, every test, the golden hashes unchanged (no code changed).
- **Done when:** a fresh session can start from `CLAUDE.md`, `PROGRESS.md` and this brief, and `docs/` has at most twelve files at its top.

### FS-1 · The engine made ready (every hash changes once; no rule changes)

- **Why now:** pure-Rust maths changes every world by a rounding, so it must come before the pictures that everything later is compared with.
- **Decisions to put (3):** the `libm` crate as a new dependency (held since 26 Sep); a tick budget at full size, from the measurements below; sparse plate maps now, or when the files and the tick ask for it.
- **Steps:**
  1. Measure first, at full size, on Garcks-PC and on the server: seconds a tick for a newborn planet and for one with 40 plates, alone and 16 at once; memory; the world file's size.
  2. The simulation's sine, cosine, exponential and the like from `libm`; `powi` written as multiplications; a lint that refuses the standard library's versions in `crates/sim` and `crates/world`. The calls are in `turn.rs`, `forces.rs`, `collide.rs`, `sink.rs`, `floor_age.rs`, `crack.rs`, `grid.rs` and `hydrology.rs`. Every golden hash and the grid's pin are recorded again. What can be shown: over the first ten ticks every cell's numbers agree with the old program's to within a rounding (cell by cell, as SC · D1 did). Later the two drift apart into different planets of the same kind, as the server's did without its setting.
  3. If the simulation's thread fails, the whole program stops, so the service starts it again. Today the server would go on answering with a frozen planet (`main.rs`, where the engine's thread is started).
  4. If the owner chose it: each plate keeps only the cells within its reach (an Earth-size world file is 1 GB today, about 97% of it "no crust here"); the write-ahead file cut back after a save.
- **Checks:** all of them; kill-and-resume; the hash the same on Garcks-PC, the laptop and the server **without** the special setting.
- **For the Workshop afterwards:** the server's and the test machines' maths setting (its W9-e, W10-c) can go at the next release. Tell laptop Claude.
- **Done when:** one program gives one hash on three machines, and the tick's cost at full size is written in `PROGRESS.md`.

### FS-2 · The looking glass (a tool; no world changed)

- **Goal:** any planet can be looked at the same way every time, in minutes, without the viewer.
- **Decisions to put (2):** the ages a planet is looked at (suggested: 100 million, 1, 3 and 5 billion years); a small picture-writing crate as a dependency, or the PNG written by hand.
- **Steps:**
  1. `planet look --world FILE --out FOLDER` (the file opened for reading only) and `planet look --seed N --f 128 --radius 6371 --myr 3000 --out FOLDER` (grows, saves at each age, then looks).
  2. **The picture set, the same six every time**, the same colours and the same light: the whole planet's heights with rivers and lakes; the whole planet's plates, with every coast drawn by kind (a trench within 200 km, or quiet); the whole planet's crust thickness; close-up A, the inside of the largest continent; close-up B, the highest range; close-up C, the biggest river from its mouth to its head. Drawn by the engine straight from the cells (for each pixel the nearest cell, found by walking the neighbour table from the last pixel's cell; `reference/look_map.py` does it in 100 lines).
  3. **The numbers beside them**, one page: land and continent; plates over 1% of the planet and under 0.1%; the highest ground and the sea's level; land's mean height by distance from the open sea, and the share of land within 500 km of it (`reference/look_numbers.py`); the share of ocean-facing coast with a trench within 200 km; ocean floor cut off from the ocean; the lowest land share in the first 500 million years.
  4. **The "before" set:** three Earth-size planets on today's rules, seeds 25660, 1 and 2, grown on the server to 5 billion years and looked at each age. Every later change is compared with these.
  5. A gallery page for the owner, as the forty-eight planets had.
- **Done when:** the owner has the "before" gallery open, and one command remakes it.

### FS-3 · What good looks like (the owner's list; documents only)

- **Goal:** the gate's first clause, in the owner's words.
- **How:** with the "before" pictures open, the owner says what a good planet shows. Six to ten lines, each something that can be seen in the picture set, each with the number that shadows it. **Offered, for the owner to replace:** mountains inland as well as on coasts; some coasts with mountains and some without; interiors with shape (highlands, basins, old worn ranges); no sea inside a continent without a cause; rivers that branch like trees; a dozen or so large plates with clean edges; no flood at birth; high ranges that last.
- **Decisions to put (2):** the list itself; which three lines matter most, which sets the order of FS-4 to FS-8.
- **Steps:** `docs/rulebook/look.md`; `gates.md`'s first clause; the amendment to section 7 of `docs/PROJECT_BRIEF.md` names the list.
- **Then: the first Fable review** (section 7).

### FS-4 · The birth (one visible change: no flood at birth)

- **The fault:** at Earth's size the first floor is born 116 million years old on average (42 at quarter size), the water is measured into basins that then shallow, the sea rises about 450 m, and land falls from 30% to 3%. The quarter-size planet floods too, to 14%. Floor born at the 180-million-year cap is also old enough to break away at once, so plates go from 12 to 23 in 60 million years.
- **Where:** `first_floor_km_per_myr` (7), `first_floor_oldest_myr` (180), `floor.rs` `first_floor_ages_myr`; `old_margin_myr` (180) and its test in `margins.rs`.
- **What can be seen from here (the design is the session's):** the first floor's age worked out from the plates' own speeds and the ocean's width, in kilometres and years, and kept below the age at which a margin is ripe. FT-1 found 28 km a million years gives no flood and 13 plates.
- **Decisions to put (3):** the rule for the first floor's age; how many plates and continents a full-size planet is born with (12 and 5 were Earth's counts on a sixteenth of its area); whether the planet's first 100 million years are shown to a visitor, or the planet is born a little aged.
- **The look:** the picture set at 0, 100 and 500 million years and at 1 and 3 billion, three seeds, before and after. The lowest land share in the first 500 million years.
- **Not now:** a planet born with a past (FS-8).

### FS-5 · A plate's life (one visible change: a dozen or so plates with clean edges)

- **Measure first:** at full size, plates born by kind and plates dead, each 100 million years, to 3 billion years, beside the same count on a quarter-size planet.
- **Where:** `crack.rs` (the chance is by share of the planet, its divisor written into the code; the wander and the land beside the crack are shares of the radius); `margins.rs` (a band is itself a plate of old floor with no continent, so after 50 quiet million years it may break again; a parent's clock is not reset by a break; the least band is 0.3% of the planet); `collide.rs` (a plate dies only when no crust is left; a weld moves the continent and leaves the loser's floor behind as a plate); `forces.rs` (`TYPICAL_PLATE_SHARE`, `TYPICAL_TRENCH_SHARE`, `PULL_FIT`, fitted at f = 32).
- **What can be seen from here:** a way for plates to merge when nothing moves between them; bands that cannot break again at once; sizes in square kilometres; clocks that know how long an ocean takes to cross.
- **Decisions to put (2 or 3):** the merge rule, as a design in plain words with a picture; the band's least size in kilometres; anything the measurement shows.
- **The look:** the plates picture at 1, 2 and 3 billion years. Plates over 1% of the planet, and under 0.1%.

### FS-6 · Quieter coasts (one visible change: some coasts without a wall)

- **The fault:** 48% of all plate boundary is trench (Earth 20%); about half of every coast has a trench within 200 km (Earth about a fifth). Arc rock is charged along two to three times Earth's length of trench, which is also why Earth's own figures grow the continents past any line.
- **Where:** `sink.rs` (any closing above zero makes a trench; arc rock laid by distance from the nearest trench cell, so a trench's ends and lone trench cells lay a ring of rock); `margins.rs`.
- **What can be seen from here:** borders that slide when they close slowly or at a shallow angle, with no trench, no arc and no grinding; margins that stay quiet until something beyond the floor's age makes them fail; arc rock that adds up to what its trench earned.
- **Decisions to put (3):** what makes a border slide; what makes a quiet coast fail; whether "almost no floor past 250 million years" is still asked of a planet.
- **The look:** the coasts-by-kind picture. The share of coast with a trench. **Tripwire:** the continents' share over 5 billion years, which should now grow less.
- **Then: the second Fable review.**

### FS-7 · Collisions that last (one visible change: high country inland)

- **The fault:** a collision ends by a clock. On Earth one lasts about 50 million years and three quarters of the land above 3 km is one plateau more than 1,000 km inland. On Planet 660 to 2,900 km of front is under way at once against Earth's 12,000, and the land above 3 km is a coastal rim.
- **Where:** `collide.rs` (`weld_after_ticks`, `spread_rock`, `nearest_with_room`, `add_rock`); `forces.rs` (the collision's brake, which already exists); `sink.rs` (arc rock due to crust over 50 to 70 km is thrown away, not passed inland; the two ceilings).
- **What can be seen from here:** the squeeze ended by the forces that stop the plates; a belt that widens inland as the squeeze goes on; one ceiling; the loss at sutures switched on once collisions last.
- **Decisions to put (3):** what ends a collision; how far inland a range may grow; the ceiling.
- **The look:** close-up B; land above 3 km by distance from the sea; the highest ground and the sea's level side by side.

### FS-8 · Interiors with a past (one visible change: land with shape far from the sea)

- **The fault:** behind the rim the land stands at 110 to 150 m for 3,000 km. Nothing acts there.
- **Where:** `tectonics.rs` and `noise.rs` (the first world's noise has fixed octaves on the unit sphere); `carry.rs` (what a spot of crust carries); `erosion.rs` (one bedrock; lake beds are never cut); `hydrology.rs` (flats given a slope of 1 cm a km; water shared at the power 8; the sea is any cell below sea level).
- **What can be seen from here, by FS · D4:** a planet born with a past, its noise in kilometres at several scales: uneven crust, old worn ranges, harder and softer rock carried on the plate's map and cut at different rates. Basins that open where continents stretch (SC · D2 point 7, never built). The sea only where it joins the ocean.
- **Decisions to put (3):** what a newborn planet's past holds; rock's hardness; inland water now, or with rain in Layer 3.
- **The look:** close-ups A and C. The spread of heights among land more than 1,000 km from the sea.
- **Two sessions if need be:** the past first, water second.

### WEB-13 and WEB-14 · A big planet on a screen (on the laptop, as the owner does viewer work)

- The Workshop's items 21 and 22, in `ITEMS_21_22.md`: a screen-sized picture for the hub, then full detail where a visitor zooms in. A whole Earth-size picture is 2.6 MB a refresh today, sixteen times what the viewer was built for.
- **When:** any time after FS-2. WEB-13 lets the owner watch a full-size planet live while the rule sessions run; both must be live before FS-9.

### FS-9 · The full-size planet goes public

- **Decisions to put (3):** what happens when a planet reaches 5 billion years (a new planet is born, or the clock slows); the pace a visitor sees; the first public seed.
- **Steps:** the engine's part of FS · D3; the release set in `planet.service` on Garcks-PC; laptop Claude copies it, at the owner's word. The Workshop's guard weighs the picture (at most 80,000 bytes) and its door needs any new address taught first.
- **Before it: the third Fable review.**

### Then Layer 3

Climate, as the project brief has it. Rain that differs from place to place is what will finish the rivers and the erosion numbers, which is why they are not tuned before it.

---

## 7. When to come back to Fable

A fresh session, which reads this brief, `PROGRESS.md`, `docs/rulebook/look.md`, the last three sessions' log entries and the latest picture set, and reports to the owner: what is better, what is not, whether the rules of section 3 held, and whether the next sessions are still the right ones.

1. **After FS-3**, before the first rule changes: the look list and the "before" set.
2. **After FS-6**, halfway.
3. **Before FS-9**, before anything full-size is public.
4. **At any time**, when the owner is unsure, when a stop of rule 11 has fired twice in a row, or when three sessions in a row have shown the owner nothing better.

---

## 8. Notes between Claudes

- Notes live on Garcks-PC's Desktop, named `for-planet-claude-…` or `for-laptop-claude-…`. The laptop's own long note file is retired (27 Sep).
- Whoever acts on a note moves it to `~/planet-notes-archive/` in the same session. A note still on the Desktop is a note nobody has acted on.
- On the Desktop now: this brief's folder; `for-planet-claude-test-server.md` (the server's address and rules, kept up to date by laptop Claude).
- The Workshop's own record of what it asked of Planet is `docs/process/requests/` in its repository.

---

## 9. Left open by this brief

- What ends a planet's life, and what a visitor sees then (FS-9).
- Whether the rule sessions' order changes (FS-3).
- The how-it-works page: redrawn when FS-8 closes.
- The public planet until FS-9: seed 28209 at quarter size on `main`'s program of 27 Sep (`planet-mg`), released by laptop Claude at 18:28 UTC on 27 Sep at the owner's word, running on as today. It is a small planet on the old rules, and nothing is judged by it. The release note is in `~/planet-notes-archive/`.

*Written in Workshop W12 (27 Sep 2026).*
