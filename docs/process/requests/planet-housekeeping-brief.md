# For the Planet session that puts the code in order (a Fable session, in Planet)

*From laptop Claude (Workshop folder, a Fable session), 29 Sep 2026, at the owner's word. The Workshop never edits Planet (its rule 8): this is a starting point, not a specification. When acted on, please move this note to `~/planet-notes-archive/`.*

## What the owner asked

The owner knew some files had grown long and had not checked on the code for a while. Laptop Claude swept it, read only, and the owner wants it resolved **as a priority: after the session now running (the updates from the second review and FS-7's read-only first steps), before FS-7 changes a rule.**

## How the owner wants it run

- **In Planet, by a Fable session at high effort**, which can build, run the tests and check the fingerprints. The laptop has no Rust and no copy of Planet, so what follows is from reading alone.
- **You are not limited to this brief.** The owner's words: have the suggestions in, "but don't limit the new session to your brief only (it will have fresh eyes and fresh context)". Do your own review of the whole codebase first. Where you disagree with anything here, say so and follow your own finding.
- **Suggested split, yours to change:** Fable plans, and does the simulation's files itself, where choosing the seams takes judgement and a fingerprint can move; Opus 5.5 does the wider, more mechanical pieces to that plan; Fable reads the finished result.

## The one rule

**No world changes.** Every golden hash and the seed-2 check are the same before and after every step. A step that moves a fingerprint is undone, or stopped and put to the owner (your rule 11). Tidying that reorders a sum can move one; that is what the check is for.

## What laptop Claude measured (29 Sep 2026, `main` at `65f15d1`)

| | |
|---|---|
| Rust | 27,245 lines in 58 files: 17,636 of code, 9,667 of tests (344 tests) |
| The viewer | `viewer2d/viewer.js`, 2,124 lines, one file, about 80 top-level variables |
| Files over 1,000 lines | 7 (`viewer.js`, `store.rs`, `sink.rs`, `saved.rs`, `erosion.rs`, `look.rs`, `settings.rs`) |
| Functions | 505; median 12 lines; 58 over 50 lines; 19 over 100 |
| `unwrap`, `expect`, `panic!` outside tests | 49, mostly in the measuring tools |
| Linter exemptions | 1 (`events.rs`, too many arguments) |
| "To do" notes | none |
| Files with no opening note | 1 (`docs/sc-night/plate-speeds/scratch_plate_speeds.rs`) |

**Sound, and to be kept:** every file's opening note with its decision; the pre-commit hook; tests beside the code (the long files are about half tests: `store.rs` 885 and 762, `erosion.rs` 449 and 773).

**The longest functions** (lines, deepest nesting):

| Function | File | Lines | Nesting |
|---|---|---|---|
| `numbers` | `crates/engine/src/look.rs` | 249 | 5 |
| `balances` | `crates/sim/src/drift/forces.rs` | 216 | 7 |
| `from_blobs` | `crates/sim/src/drift/saved.rs` | 209 | 6 |
| `report` | `crates/engine/src/plate_watch.rs` | 164 | 5 |
| `survey_looked` | `crates/sim/src/drift/survey.rs` | 158 | 6 |
| `page_text` | `crates/engine/src/look.rs` | 155 | 4 |
| `migrate` | `crates/engine/src/store.rs` | 140 | 5 |
| `weld` | `crates/sim/src/drift/collide.rs` | 136 | 4 |

## Laptop Claude's suggestions

1. **The long functions in the files FS-7 and FS-8 will edit, first**: `forces.rs` (`balances`), `margins.rs`, `sink.rs`, `collide.rs` (`weld`). Split by what each part works out, so each part can have its own test.
2. **The measuring tools.** About a dozen commands in `crates/engine/src/` (`wall_watch`, `plate_watch`, `range_watch`, `sea_check`, `speed_check`, `mountains`, `flex_what_if`, `collide_bench`, `trace`, `drift_trace`, `drift_gate`, `survey`), roughly 4,400 lines, thinly tested (`wall_watch.rs`: 613 lines of code, 62 of tests), with helpers repeated (`median` in three files, `mean` in two). FS · D31's fault, a watcher that nudged its planet, came from here. Suggested: a place of their own with one set of shared helpers; the ones no later session needs retired, with the owner's yes; a test that a watched planet keeps its twin's hash for every tool that watches a living planet.
3. **`sink.rs`** (958 lines of code since FS · D32) holds who goes under, trenches that start, arc rock, scraping and grinding. Suggested: split by job, before FS-6's third sitting.
4. **The viewer** in parts, before WEB-14 adds to it. The owner judges any viewer change by eye on the laptop and a phone; the stills must be the same.
5. **`main.rs`** (594 lines, a 190-line `main`): each command's arguments read in its own place.
6. **The scratch file in `docs/`**: given a note, moved or removed.

**Not suggested:** moving tests out of their files; any change to `settings.rs` beyond what a split needs (it is long because it is a list); any speed work (the tick budget is not crossed).

## Asked of you

1. **Your own review and plan first**, put to the owner in plain words, at most three decisions (your rule 4): the order, what is retired, and anything your review finds that this brief missed.
2. **Small steps, each committed with the checks green and the fingerprints unchanged.**
3. **A line in the log for each step**: what moved where, and the lines before and after.
4. **At the end, the same measurements again**, so the owner can see the difference, and a line on Garcks-PC's Desktop for laptop Claude.

*Written in Workshop W15 (29 Sep 2026).*
