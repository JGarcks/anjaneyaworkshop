# Workshop — Project Rules (CLAUDE.md)

*The standing brief Claude works to: who decides what, the rules, and the checks before every commit. Claude writes the code; the owner, who is not a coder, makes every design decision (`docs/decisions.md`).*

*Read automatically when this folder is the open project. Where each rule came from, and its reasons: `docs/process/rules-lineage.md`.*

## About Jamie

- **Not a coder.** You write all the code and configuration; Jamie describes what they want in plain English and may run the safe read-only commands (`npm test`, `git log`, `git status`, `scripts/check-public.sh`). **All commits are Claude's** — seam commits mid-session and the closing commit, each named for the session. Which Claude commits what is rule 16.
- **Owner of Planet, BlockByBlock, ClaimsDesk and PolicyRAG**, the projects this site shows. Jamie's eye on a screen — the laptop and a phone — is the final bar on anything visual; the numbers from `scripts/check-public.sh` are the final bar on anything measurable. Neither is argued with.
- **Learns by deciding.** Every phase has real decisions that are Jamie's. Put each plainly with the trade-off, wait, record it in `docs/decisions.md`. Never decide it silently to save time.
- **Set-up:** the laptop (Windows) reaches GitHub, Garcks-PC and the server over SSH. **The server** runs the public planet, nginx and the tunnel; laptop Claude runs it (addresses and state: `frontdoor/state/server.md`). **Garcks-PC** (Linux Mint) is where Planet is built and tested. **PC Claude** there (Jamie: Desktop Claude or Linux Claude) is given runbook commands. **Planet Claude** is a different Claude, in Planet's own folder, for core Planet work; it takes no Workshop steps.
- **Jamie's walk is the playtest.** At every gate Jamie opens the site on the laptop and on a phone on mobile data and says what they saw; it goes in the log under *The walk*. Guess nothing a walk can tell you.
- **Narrate progress:** a one-line chat note at every milestone or change of direction.
- **Teaching is the decision round, and nothing else.** Every build session opens with a **decision round**: for every step on the plan for that session, a two-or-three-paragraph plain-English explain (no code, no inline diagram) and its one decision, all in one message, in build order. Jamie answers together; the build runs to the end. A decision that only appears mid-build is put when it appears, and Claude carries on with what doesn't depend on it. **A decision the public check settles mid-build** Claude makes and keeps building: logged as Claude's with before-and-after numbers, listed in Active-Work, confirmed or undone at the next decision round. Trade-offs the numbers cannot settle stay Jamie's. First-of-a-kind pieces are shown in chat before they land.
  - *A decision judged by eye* is put with its options and the case against each, and no recommendation (Jamie, 29 Sep 2026).
  - *Pictures:* Jamie is a visual learner; the pictures live in `docs/how-workshop-works.html`.
  - *No explain-back in chat during the build:* the explanation goes into the code (rule 14). When Jamie explains something back, Claude corrects only what is wrong, one sentence each.
- **Clerical work runs on Sonnet.** Background agents with a clear spec and no judgement call are spawned with `model: "sonnet"`; design, the decision round and reading a regression stay on the session's model.

## Project Overview

The Workshop is anjaneyaworkshop.co.uk: a dark, single-screen front door with Jamie's live planet turning in the middle of it, and quiet links to the apps, each in its own room on its own subdomain. Planet goes public first, then BlockByBlock (renamed), then the work apps once the Aviva material is out. A read-only front door on the rented server stands between Planet and the internet. Why: `docs/process/Workshop-Strategic-Plan.md`.

- **Stack:** plain HTML, CSS and JavaScript for the landing page (one screen; no framework) · Vitest for its logic · nginx and a named cloudflared tunnel on the server as the front door · Cloudflare for DNS, TLS, edge cache and Pages · shell scripts for the checks.
- **Architecture:** `site/` (the landing page and its tests) · `frontdoor/` (the configs, the runbook, and `frontdoor/state/` for what is installed) · `scripts/` (the checks and the release) · `docs/`. One folder per job.
- **What it borrows, never copies:** Planet's viewer, served by Planet itself through the front door and framed by the landing page; BlockByBlock's built files, deployed from its own repo (rule 8).
- **Git:** `github.com/JGarcks/anjaneyaworkshop`, private, single branch, commits named for the session.

## Session Workflow

Jamie's build-session invocation: *"Read `docs/process/Workshop-Active-Work.md` and `docs/process/Workshop-Coverage-Plan.md`, and execute the current item."* (Strategic-Plan only at a phase seam or when a hosting, scope or IP decision is in play.)

**Strategic-Plan** = charter; **Coverage-Plan** = the phased arc with its gates; **Active-Work** = next-thing pointer plus the cross-session queues. Sessions are named by what they advance (`W1 — the front door`).

Build session shape: **read Active-Work + Coverage-Plan → decision round → build → automated checks + eyeball → progress log → quartet walk and sizes → commit.** Prefer two short sessions to one long one; commit at every seam.

## Doc Index

| Document | When to read |
|---|---|
| `docs/process/Workshop-Active-Work.md` | Every session. |
| `docs/process/Workshop-Coverage-Plan.md` | Every build session. |
| `docs/process/Workshop-Strategic-Plan.md` | At a phase seam, or when a hosting, scope or IP decision is in play. |
| `docs/decisions.md` | The decisions table. Only at the wrap-up, and at the decision round to see what is already settled. |
| `docs/process/rules-lineage.md` | Only when reviewing or adding a rule. |
| `docs/process/secrets-map.md` | When a step needs a credential: it says where each one lives, never what it is. |
| `docs/process/progress/2026-09.md` (and later months) | When you need detail on a previous session. |
| `docs/process/requests/` | What the Workshop has asked of other projects. |
| `docs/how-workshop-works.html` | The pictures; never read for the build. |
| `frontdoor/RUNBOOK.md` | The steps PC Claude runs on Garcks-PC. |
| Planet's `docs/PROJECT_BRIEF.md` §8 | Only for what Planet's API *means*. Never edited (rule 8). |

## Immutable Rules

1. **Never rewrite an entire file.** Surgical Edit operations only; rewriting long files risks silent truncation at the end.
2. **Checks must stay green.** `npm test` in `site/` after every change there; `nginx -t` on any change under `frontdoor/`; `scripts/check-public.sh` for any session touching the front door or the page. A session never ends with a red check.
3. **No history-rewriting git operations.** Single branch: `commit`, `log`, `restore`, `revert`, and `pull` (a merge) only. No `rebase`, `reset --hard`, force-push. A commit with a mistake is fixed by another commit.
4. **Commit as you go.** Every step that runs and checks green gets committed, even mid-session.
5. **Doc-quartet drift discipline.** At session start, if the queued next action contradicts what the quartet says is current, stop and ask Jamie. At session end, before commit, walk the four docs: Active-Work pointer rotated; Coverage-Plan phase status updated; Strategic-Plan amended only if a hosting, scope or budget decision changed; CLAUDE.md gains a rule only if one was learned; the decisions table gains the session's decisions.
6. **Sizes are measured, every session (Jamie, 29 Sep 2026).** Active-Work 6 KB, CLAUDE.md 12 KB, Coverage-Plan 24 KB; no function in this repo over 60 lines. Every log entry carries a **Sizes** line: each of the three against its limit, and the longest function with its file. One over its limit is trimmed before the commit, or the entry says why not and Jamie is told in chat. A limit is moved only by Jamie. Closed phases collapse to one line; reasons go to `rules-lineage.md`. A review of any project reports the same two numbers for it.
7. **Never bundle Mojang's assets — of any kind.** No textures, models, sounds, fonts, logos or the word *Minecraft* in a product or domain name. On the hub, nothing Minecraft-shaped beyond the renamed BlockByBlock's own small mark. Every public build is scanned for Mojang assets before it ships.
8. **The Workshop never edits another project.** Planet, BlockByBlock, ClaimsDesk and PolicyRAG are shown here, never changed here. Anything needed from one of them is a request written for that project's own session, under that project's rules. This site takes their built artefacts and their public API only.
9. **The budget is a test.** The bandwidth and cache numbers in the Strategic Plan (§Budget) are asserted by `scripts/check-public.sh` against the public address. A regression blocks the commit the same way a red test does. A failed budget changes the *approach*, never the number.
10. **No silent fallbacks.** The page never shows a blank: if the engine cannot be reached it shows the last still with "last seen at", and a console warning names what failed and why. Same for a failed deploy or a failed tunnel: the runbook step says so in plain words.
11. **Nothing on the internet can write.** The front door allows GET and HEAD only; the site has no accounts, no forms, no database, no analytics. Planet's engine is never on the internet directly: only nginx talks to it. Anything that writes is a new decision, never a drift.
12. **The restart rule.** A lower `X-Planet-Tick` than the last one seen is a restart (Planet resumes from its last save and replays up to 500 ticks), never an error. Every consumer of the API in this repo implements it and has a test for it.
13. **Secrets never enter the repo.** `.gitignore` names their shapes, and `docs/process/secrets-map.md` says where each one lives, never its value. A secret seen in a diff stops the session until it is rotated.
14. **Every file explains itself.** The top of every source and config file carries a five-line plain-English note: what this file does, what comes in, what goes out, the one decision behind it, and the session it was built in. Every test's name says the fact it checks.
15. **Quality always wins (Jamie's principle, 24 Sep 2026).** When a shortcut and the right way disagree, the right way wins and the schedule moves. Nothing ships at "first pass" silently: a limitation is written into the progress log and the Coverage Plan, or it is fixed.
16. **Two Claudes and a bot, one branch.** Laptop Claude owns the repo and makes every commit, with two exceptions: PC Claude commits only under `frontdoor/state/`; the still's GitHub Action commits only under `site/public/still/`, daily. Both Claudes `git pull` before a session and `git push` at its end. The server's checkout is updated by laptop Claude's `git push` to it; it never commits. PC Claude never edits the quartet, the site or the configs; a change it needs is written into Active-Work's queue.

## Verification Workflow — Before Every Build-Session Commit

**Automated (run each step whose condition holds; log "not run, no change to X" for the rest):** 1. `npm test` in `site/` green — when anything under `site/` changed. 2. `nginx -t` clean on the server, into `frontdoor/state/server.md` — when anything under `frontdoor/` changed. 3. `scripts/check-public.sh` within budget, numbers into the log — when the front door or the page changed. 4. The link check over the deployed site — when any link or subdomain changed. 5. The Mojang-asset scan of the build output — when building a room for the public.

**Review (eyeball):** 6. **Open the site on the dev server and on the public address**; screenshot the landing page on the laptop and a phone and compare with the previous set in `docs/screens/<phase>/`. 7. **Jamie's walk**, recorded under *The walk* in the log.

**Wrap-up:** 8. Progress-log entry (format below). 9. Decisions into `docs/decisions.md`, one row each. 10. The quartet walk (rule 5) and **the sizes measured** (rule 6). 11. Commit named for the session and its numbers.

## Progress Log Discipline

`docs/process/progress/YYYY-MM.md` gets one entry per session:

```
### Session WN — <Title> (Month DD, YYYY)
<Two or three sentences: context and scope.>
**What changed.**  <the files and the numbers, not the story>
**Leave alone (already correct).**
**Verification.** <site tests, nginx -t, check-public numbers and budget result, link check>
**Public check.** <the numbers of record for this phase, if they moved: bytes per tick, cache hit ratio, time to first picture>
**Sizes.** <Active-Work, CLAUDE.md, Coverage-Plan, each against its limit; the longest function and its file>
**The walk.** <what Jamie saw on the laptop and the phone, what they asked for, where it looked wrong — or "none this session">
**Decisions.** <Jamie's decisions and reasons, one line each; Claude's check-settled ones marked as such>
**Deferred.**
```

## Lineage

Drafted **24 Sep 2026** from Explore's and Planet's CLAUDE.md; trimmed 29 Sep 2026 (W15-r). The simplest thing Jamie can explain beats the cleverer thing Jamie can't. Full lineage: `docs/process/rules-lineage.md`.
