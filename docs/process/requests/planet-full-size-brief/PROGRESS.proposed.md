# Progress

*Proposed by laptop Claude on 27 Sep 2026 with the full-size brief, for session FS-0 to bring up to date and install as `docs/PROGRESS.md` (FS · D7). Remove this paragraph when installing. The file as it stood before is kept whole as `docs/archive/PROGRESS-2026-09-27.md`.*

The short pointer. Read it at the start of every session; bring it up to date at the end. **One page.** Closed work is one line here; its detail is in the session log (`docs/progress/YYYY-MM.md`).

## Where we are

**The second edition began on 27 Sep 2026** (FS · D1 to D7, `docs/FULL_SIZE_BRIEF.md`). A review of the whole project found the engine sound and the land's rules built for a planet too small to have an inside. The owner decided: keep the engine; the planet is Earth's size; the land's rules are rebuilt at that size, judged by eye, one visible change at a time; a planet lives about 5 billion years.

**One set of rules.** `main` holds everything (the three branches merged in session MG, 27 Sep). Work happens on `main`.

## Next session

**FS-0 · The house in order** (`docs/FULL_SIZE_BRIEF.md`, section 6). Read the whole brief once, then do its steps. Documents only; no world changes.

## The sessions ahead

| Session | Its one visible change | State |
|---|---|---|
| FS-0 | The house in order (documents) | next |
| FS-1 | The engine made ready: one hash on every machine | |
| FS-2 | The looking glass: `planet look` and the "before" pictures | |
| FS-3 | What good looks like: the owner's list. Then the first Fable review | |
| FS-4 | The birth: no flood | |
| FS-5 | A plate's life: a dozen or so plates with clean edges | |
| FS-6 | Quieter coasts: some coasts without a wall. Then the second Fable review | |
| FS-7 | Collisions that last: high country inland | |
| FS-8 | Interiors with a past: land with shape far from the sea | |
| WEB-13, WEB-14 | A big planet on a screen (on the laptop; any time after FS-2) | |
| FS-9 | The full-size planet goes public. Before it, the third Fable review | |

## What the owner watches

- **The public planet**, `https://planet.anjaneyaworkshop.co.uk/`: seed 28209 from year zero, live since 18:28 UTC on 27 Sep 2026 on `planet-mg` (`main` at `0cb15ac`; laptop Claude's release, the Workshop's W12-e). The seed-25660 world is kept on the server, not run. It is a quarter-size planet on the rules of 27 Sep, and nothing is judged by it.
- **The "before" pictures** of the Earth-size planet: from FS-2, in `~/planet-looks/before/`.
- The planets kept from before, none running: their files are in `worlds/` and `~/planet-nights/`, and what each needs to be carried on is in `~/planet-live/BUILD.txt` and `docs/archive/PROGRESS-2026-09-27.md`.

## Waiting for the owner

Nothing yet. At most three at a time (`CLAUDE.md`, "How we work now", rule 4).

Claude's earlier decisions that were awaiting confirmation on 27 Sep (FT · D5, CC · D2, RB · D2, D4, D5, MT · D2, TEST · D2 to D4, WEB · D12) are tools and measures that changed no world. FS-0 puts them to the owner as one line: kept as built.

## Known faults, as the Earth-size planet shows them

A wall of mountains on nearly every coast; flat land behind it; rivers in straight combs; seas inside continents; 31 to 49 plates; a flood at birth; no land above 4 km. Each has its session above. `docs/FULL_SIZE_BRIEF.md` section 1 has the measurements.

## Held for triggers

- **The world's hash depends on the machine's maths library.** Goes in FS-1.
- **The sea's level wobbles 2 to 3 m from tick to tick** (QR · D14). Trigger: Layer 3's plan. Action: put to the owner then.
- **The History panel remembers the latest 200 events** (QR · D18). Trigger: the owner wanting a longer list.
- **Drawing rivers is three quarters of a picture's preparing** (WEB · D11). Trigger: WEB-13.
- **A tick slows as plates grow many** (W1 · D25). Trigger: FS-1's measurements, then FS-5.
- **Queued by the merge's review** (MG · D1): the rock laid back under the arcs is never counted against the share asked for; a band of old floor's stand-in pull has no end; two plates cracking in one tick. Each is looked at in the session that touches its file (FS-5, FS-6).

The triggers written for the quarter-size planets (the creep, flat spells, land outside the band on long runs, river-filled old floor, the owner's planet after its floods) are closed by FS · D1 to D3. They are in the archived file.

## Queued

- **The how-it-works page** redrawn when FS-8 closes. Until then it is marked out of date.
- **The age of a range** as a viewer colour (the owner, 22 Sep: "the mountain ranges are pretty much THE exciting thing"). When: with FS-7.
- **Several cores for whole-planet passes** (E1). When: FS-1's measurements say so.
- **The number sheet** (RB · D1's piece 5): every named number with its decision. When: after FS-8.
- **Then Layer 3**, as `docs/PROJECT_BRIEF.md` has it.

## Closed sessions of the second edition

None yet. (The first edition's sessions, SETUP to MG, are one line each in the archived file.)

## Machines

- **Garcks-PC** (Linux Mint; Intel i7-3820, 4 cores, 8 threads; 15 GiB memory; GTX 1660 Super): where Planet is built and tested.
- **The hired test server** (OVHcloud `c3-32`, 16 cores, by the hour): `~/Desktop/for-planet-claude-test-server.md` has its address and rules. 16 Earth-size planets to 7 billion years took about 3.5 hours on it (CC · D1).
- **The public server** (OVHcloud VPS, London): run by the Workshop. It changes only by a release.
