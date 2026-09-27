# Planet

*Proposed by laptop Claude on 27 Sep 2026 with the full-size brief, for session FS-0 to install as Planet's `CLAUDE.md` at the owner's word (FS · D7). Remove this paragraph when installing. What changed from the file before: the commands moved whole to `docs/COMMANDS.md`; "How we work now" is new; the habit "the best design wins" gains its second sentence; testing is judged at full size. The thirteen rules are word for word as they were.*

A simulated spherical planet that runs around the clock: real geology, emergent climate, evolving life, and eventually peoples whose history is written by a small locally trained language model. Working title is "planet"; rename when the world has a name.

**The second edition (from 27 Sep 2026, FS · D1).** The engine is kept. The rules that shape the land are being rebuilt at the planet's real size, Earth's, judged by the owner's eye, one visible change at a time. Why, and the sessions ahead: `docs/FULL_SIZE_BRIEF.md`.

## What to read

| Document | When |
|---|---|
| `docs/PROGRESS.md` | Every session. One page: where we are, the next session, what waits for the owner. |
| `docs/FULL_SIZE_BRIEF.md` | Every session: sections 2 and 3, then this session's part of section 6, and nothing else of it. |
| `docs/rulebook/look.md` | Every session that changes the world: what good looks like, in the owner's words. |
| `docs/RULEBOOK.md` and the subject's page | Before touching a rule: the rules in force, their numbers, the roads tried and dropped. |
| `docs/COMMANDS.md` | When a command is needed that is not among the everyday ones below. |
| `docs/PROJECT_BRIEF.md` | At a layer's start or its gate. |
| `docs/DECISIONS.md` | To add an entry, and for the entries a Rulebook line points to. Entries before 28 Sep 2026 are in `docs/archive/DECISIONS-2026-09.md`. |
| `docs/progress/YYYY-MM.md` | Only when detail on a past session is needed. |
| `docs/research/` | Before starting a layer, the section for it. |

## Working with the owner

The owner is a hobbyist with little traditional coding experience who steers and reviews while you write the code. The owner is a visual learner: a picture is worth more than a table, and a table more than a paragraph.

- Explain what you are about to do, and why, in plain language before you do it. Avoid jargon or define it.
- Work in small steps. After each one, run the tests, show something visible where possible, and commit.
- Ask before changing architecture, adding a major dependency, or touching any rule in this file.
- Say so plainly when something is not working or when you are unsure. Do not paper over a failing test.
- One layer at a time. Do not start a layer until the previous layer's gate in the brief has passed.

## How we work now

1. **Full size is the judge.** The planet is Earth's size: radius 6,371 km, f = 128, 163,842 cells about 60 km across (FS · D2). A change to a rule that shapes the world is grown at that size before it is kept. Nothing is adopted on a small planet's evidence. Half size is for quick previews; small worlds are for tests.
2. **The owner's eye is the gate.** A change that shapes the world is kept when the owner has seen the same set of pictures before and after (`planet look`) and said yes. Numbers sit beside the pictures. They support the eye; they do not decide.
3. **One visible change a session.** A session changes one thing the owner can see, and ends when the owner has looked. No second world-shaping change is begun until then.
4. **At most three decisions are put in a session**, all at its start, each with its options, what each costs, and a picture or a number the owner can check. No lists to confirm. If three of Claude's own decisions are already waiting for the owner, nothing new is built until they are cleared.
5. **Causes before numbers.** When a fault shows, find the rule that makes it and change the rule's shape. A number is never turned to cancel the side effect of another rule. If a fix needs a second fix, stop and tell the owner.
6. **Kilometres and years.** Every rule is written in kilometres, years and what rock and water do. None is written in cells, neighbour rings, shares of the planet or "times the radius". A rule that must know the cell's size says why in its note.
7. **A planet lives about 5 billion years** in deep time (FS · D3). Rules are judged over that life.
8. **Tripwires tell; they do not choose.** Land between 25 and 40% and continent between 32 and 45% over a planet's life are tripwires: the owner is told when one is crossed. No rule is chosen because it lands nearer the middle.
9. **Many-planet runs only when a picture cannot answer**, and only for a gap bigger than the planets' own luck. Three seeds and the owner's eye are the usual test. Every score carries its margin (TEST · D1).
10. **Nothing is scripted** (W1 · D26, as FS · D4 reads it). What happens comes from rules standing for nature acting on the planet's state. A rule may act over a wide area, and a planet may be born with a past. Nothing happens on a schedule, and nothing steers a planet toward a figure. Every stand-in is said to be one.
11. **Stop and say so, in plain words, when:** a fix needs a second fix; a test would have to be loosened to pass; a tripwire or the look list would have to move; the change cannot be shown in a picture; the session's one visible change is done.

**A session's shape:** read → say the plan in plain words and put the session's decisions → build → the checks → the pictures → the owner looks → the records → commit and push.

## Who does what

- **Build sessions run on Opus 5.5. Reviews run on Fable**, in a fresh session, at the points the brief marks (FS · D6). Clerical work with a clear spec and no judgement call (bulk formatting, counting) may run on a cheaper model.
- **Claude makes every commit** and pushes `main` at the end of every session. The owner may run the safe commands that only read.
- **The public planet changes only by a release, at the owner's word.** Set `planet.service` on Garcks-PC to the build (program, settings, world), say so to the owner, and leave a note for laptop Claude, who copies it to the server. Experiments here are never public.
- **Viewer work is done in a Planet session on the laptop**, where the owner judges it.
- **The hired test server** grows planets many at once. It is never used to serve one. Creating and deleting it is the owner's and laptop Claude's.
- **Notes between Claudes** live on Garcks-PC's Desktop. Whoever acts on one moves it to `~/planet-notes-archive/` in the same session.

## Working habits

- **Decisions are the owner's, and are recorded.** Put each real design decision plainly with its trade-off and wait. Record it in `docs/DECISIONS.md` with its ID and who made it, in twelve lines at most. A decision that a test number settles mid-build Claude may make and keep building: logged as Claude's with the before-and-after numbers, listed in `docs/PROGRESS.md`, and confirmed or undone by the owner next session. This never covers a rule that shapes the world: those wait for the owner's eye.
- **Every file explains itself.** Every source file opens with a short plain-English note: what this file does, what comes in, what goes out, the one decision behind it, and the session it was built in. Every test's name says the fact it checks.
- **The best design wins, and the owner must be able to see it.** Choose what gives the best world and the soundest code; explaining it well is Claude's job, not a reason to pick a weaker design (L2 · D9). Simplicity breaks ties, because simple code has fewer bugs. A design whose effect cannot be shown to the owner in a picture, or in a number they can check, is not ready to be put (FS · D7).
- **A tidy-up must not change the world.** A change meant to be housekeeping only must leave the golden hash unchanged, or it is reverted.
- **The Rulebook is kept with the rules.** A decision that changes a rule updates its line in the Rulebook in the same commit, and moves a retired rule to that page's roads tried and dropped (RB · D1).
- **Ideas go in the queue, not into the session.** Anything that occurs mid-session and is not needed for its one visible change goes under Queued in `docs/PROGRESS.md`, with why it is not being done now.
- **Oddities are held for triggers.** Something unexplained but harmless is written down in `docs/PROGRESS.md` with what to watch for and what to do if it appears.
- **When the build differs from the brief, amend the brief** with the date and the reason.
- **No history-rewriting git operations.** `commit`, `log`, `restore`, `revert` only. No `rebase`, `reset --hard` or force-push. A commit with a mistake is fixed by another commit.
- **Surgical edits to long documents.** Do not rewrite a long file whole; edit the part that changes.
- **The documents keep their size.** `PROGRESS.md` is one page. A session's log entry is 25 lines at most. Closed work collapses to one line.
- **Pictures live outside the repository** (rule 11): in `~/planet-looks/`, with the command that remakes them in the session's log entry.

## Rules that must not be broken

1. **The world is a graph on a sphere.** Every system is written as "this cell and its neighbours" using the neighbour table. Never use x/y grid coordinates or latitude/longitude as an index.
2. **Never assume six neighbours.** Twelve cells are pentagons with five. Always use the stored neighbour count.
3. **Weight by real geometry.** Flow, diffusion, spread, and migration use the stored per-cell area and per-edge distance. Cells are not uniform.
4. **Deterministic and seeded.** One master seed. Same seed plus same tick count gives the same world hash, every time, on this machine. No randomness from the clock, thread scheduling, or hash-map iteration order. Random draws are derived from (master seed, system, tick, cell, draw index) so parallel execution order cannot matter. Parallel sums use a fixed order or integer accumulators.
5. **Engine and viewers are separate.** The engine is headless. Viewers are read-only and can never alter world state. What someone looks at must never change what happens.
6. **Interventions are logged.** Any deliberate change to the world from outside (seeding a species, placing people) goes through one intervention interface and is recorded with its tick, so a replay reproduces it.
7. **Language model output never feeds back into the simulation.** Names and stories are stored as annotations. The sim must run identically with the model switched off.
8. **Plain arrays indexed by cell id** (struct of arrays) for all per-cell data. No general-purpose ECS for grid systems.
9. **Checkpoints are atomic.** The engine can be killed at any moment and resume from the last checkpoint with an identical result.
10. **The world is damageable.** Forests can be cleared, species exterminated, rivers dammed. Never bake in static data that a later layer will need to change.
11. **Everything is procedural.** No hand-made art assets or binary blobs in the repository.
12. **No Claude-written prose in language-model training data.** You build the machinery (grammar engine, slot filling, data pipeline); the owner supplies the phrases and word lists, or they come from public domain text. See the brief, section 9.
13. **Every layer logs notable events** to the events table from the start (eruptions, extinctions, speciations, ice ages), not only once people exist.

## Testing discipline

- Every system ships with unit tests and invariant checks. They run on small worlds, where they are quick.
- The golden-seed test must pass before every commit. If behaviour changes on purpose, update the golden hash in the same commit and note why in `docs/DECISIONS.md`.
- A test that pins one of the model's own numbers is recorded again when a rule is adopted, never loosened to let a change through.
- The tests prove the bookkeeping and that the same seed gives the same world. They do not prove the planet looks right. The look does that, at full size.

## Before every commit

In this order. For a check whose condition does not hold, note "not run, no change to X" in the session log; never skip one silently.

1. **Automated:** the formatter check and the linter with no warnings; the full test suite; the golden-seed test. Kill-and-resume gives the same hash, when the run loop, checkpoint or any system's state changed.
2. **The look:** when a rule that shapes the world changed, the picture set before and after, at full size, seen by the owner. When only the viewer changed, the viewer, and say what was seen.
3. **Wrap-up:** decisions into `docs/DECISIONS.md`, the rules they change into the Rulebook; commit with a message that names the session and the step.

## End of every session

Run the checks above, then: the session's entry in `docs/progress/YYYY-MM.md`; `docs/PROGRESS.md` brought up to date and kept to its page; commit; `git push`.

## Stack and layout

Rust (stable) for the engine, SQLite for the world file, plain HTML and JavaScript for the 2D debug viewer, three.js for the later 3D viewer, Python with PyTorch for language-model training under `lm/`. Layout: `crates/world` (grid and state), `crates/sim` (systems), `crates/engine` (run loop, checkpoints, HTTP server), `viewer2d/`, `scripts/`, `worlds/` (world files, git-ignored); to come: `viewer3d/`, `lab/`, `lm/`.

## Everyday commands

Run from the project folder. Every other command, with its options, is in `docs/COMMANDS.md`; keep that file current as commands come into existence.

- Build everything: `cargo build --workspace`
- Run every test (the golden-seed and kill tests among them): `cargo test --workspace`
- The formatter and the linter, both clean before a commit: `cargo fmt --all --check` and `cargo clippy --workspace --all-targets -- -D warnings`
- The two gate checks alone: `cargo test --workspace gate_`
- A full-size planet flat out, printing its hash: `cargo run --release --bin planet -- run --seed 1 --f 128 --radius 6371 --ticks 1000`
- The picture set of a planet (from session FS-2): `cargo run --release --bin planet -- look --world FILE --out ~/planet-looks/NAME`
- A planet live in the viewer on a spare port: `cargo run --release --bin planet -- serve --port 8095 --tps 2.5`, then `http://localhost:8095/`. Stop a spare server by its process number (`ss -ltnp | grep :8095`), never by pattern.
- A planet's own log: `cargo run --release --bin planet -- log --world FILE`
- The public planet's log, read as a viewer reads it, at the start of every session: `curl -s https://planet.anjaneyaworkshop.co.uk/api/log`
- Try other numbers without a rebuild: `cargo run --release --bin planet -- settings`, and `--settings FILE` on any command that makes a planet
- Git refuses a commit when the formatter, the linter or a test fails (`scripts/hooks/pre-commit`). On a fresh copy, switch that on once: `git config core.hooksPath scripts/hooks`
- The off-machine copy, at the end of every session, never with force: `git push`
