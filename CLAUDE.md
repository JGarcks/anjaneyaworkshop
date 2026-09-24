# Workshop — Project Rules (CLAUDE.md)

*For a reader new to this folder: this is the standing brief the AI agent (Claude) works to — who decides what, the project's rules, and the checks before every commit. The agent writes the code and the configuration; the project owner, who is not a coder, makes every design decision (`docs/decisions.md`).*

*Read automatically by Claude Code when this folder is the open project, and by Cowork when it is the connected folder. Drafted 24 Sep 2026 from two parents: Explore's `CLAUDE.md` (Jamie's current operating model, 24 Sep 2026 state) and Planet's `CLAUDE.md` (the project this site shows, 24 Sep 2026 state). What carried over and what did not: `docs/process/rules-lineage.md` — read that only when reviewing a rule.*

## About Jamie

- **Not a coder.** You write all the code and configuration; Jamie describes what they want in plain English and may run the safe read-only commands (`npm test`, `git log`, `git status`, `scripts/check-public.sh`). **All commits are Claude's** — seam commits mid-session and the closing commit, each named for the session. Which Claude commits what is rule 16.
- **Owner of Planet, BlockByBlock, ClaimsDesk and PolicyRAG**, the projects this site shows. Jamie's eye on a screen — the laptop and a phone — is the final bar on anything visual; the numbers from `scripts/check-public.sh` are the final bar on anything measurable. Neither is argued with.
- **Learns by deciding.** Every phase has real decisions that are Jamie's. Put each plainly with the trade-off, wait, record it in `docs/decisions.md`. Never decide it silently to save time.
- **Set-up:** the laptop (Windows, `desktop-tmsridg`) runs Cowork or the Code tab and reaches GitHub over SSH; its sandbox **cannot reach the home LAN**. Garcks-PC (Linux Mint, 192.168.1.157) runs Planet as `planet.service` on port 8080 and will run the front door; Claude Code there is "PC Claude". Home connection 75 Mbps down, 17.5 Mbps up. **Performance here means the upload and the cache**, not frame time: the budget is in the Strategic Plan.
- **Jamie's walk is the playtest.** At every gate Jamie opens the site on the laptop and on a phone on mobile data and says what they saw. That note goes in the progress log under *The walk* and is the design input for the landing page. Guess nothing a walk can tell you.
- **Narrate progress:** a one-line chat note at every milestone or change of direction.
- **Teaching is the decision round, and nothing else.** Every build session opens with a **decision round**: for every step on the plan for that session, a two-or-three-paragraph plain-English explain (no code, no inline diagram) and its one decision, all in one message, in build order. Jamie answers together; the build runs to the end. A decision that only appears mid-build is put when it appears, and Claude carries on with what doesn't depend on it. **A decision the public check settles mid-build** Claude makes and keeps building: logged as Claude's with before-and-after numbers, listed in Active-Work, confirmed or undone at the next decision round. Trade-offs the numbers cannot settle stay Jamie's. First-of-a-kind pieces (the first nginx config, the first test, the first Pages deploy) are shown in chat before they land.
  - *Pictures:* Jamie is a visual learner. The pictures live in `docs/how-workshop-works.html`, started after Phase 1 from a real run: one request followed from a phone to the engine and back, with the real headers, cache hits and timings at each hop.
  - *No explain-back in chat during the build.* The explanation goes into the code instead (rule 14) and into the how-it-works page. When Jamie explains something back, Claude corrects only what is wrong, one sentence per correction, never a fresh explanation.
- **Clerical work runs on Sonnet.** Background agents with a clear spec and no judgement call (link checks, bulk renames, counting check rows) are spawned with `model: "sonnet"`. The front door's design, the landing page's look, the decision round and reading a regression stay on the session's model.

## Project Overview

The Workshop is anjaneyaworkshop.co.uk: a dark, single-screen front door with Jamie's live planet turning in the middle of it, and quiet links to the apps, each in its own room on its own subdomain. Planet goes public first, then BlockByBlock (renamed), then the work apps once the Aviva material is out. Planet itself is never changed by this project: a read-only front door on Garcks-PC stands between it and the internet. Why it is shaped this way: `docs/process/Workshop-Strategic-Plan.md`.

- **Stack:** plain HTML, CSS and JavaScript for the landing page (one screen; no framework) · Vitest for its logic (the restart rule, the still fallback, the live line) · nginx and a named cloudflared tunnel on Garcks-PC as the front door · Cloudflare for DNS, TLS, edge cache and Pages · shell scripts for the checks. **No accounts, no forms, no database, nothing that writes.**
- **Architecture:** `site/` (the landing page and its tests) · `frontdoor/` (nginx and cloudflared config, the runbook for Garcks-PC, and `frontdoor/state/` for what is installed) · `scripts/` (`check-public.sh` and the deploy) · `docs/` (the quartet, decisions, progress, the how-it-works page). One folder per job.
- **What it borrows, never copies:** Planet's viewer, served by Planet itself through the front door and framed by the landing page; BlockByBlock's built files, deployed from its own repo. No source from either lives here (rule 8).
- **Location / tool:** `$HOME\Desktop\Anjaneya Workshop` on the laptop, the connected folder in Cowork or the project folder in the Code tab. Git: `github.com/JGarcks/anjaneyaworkshop`, private, single branch, commits named for the session. Garcks-PC pulls `frontdoor/` from the same repo.

## Session Workflow

Jamie's build-session invocation: *"Read `docs/process/Workshop-Active-Work.md` and `docs/process/Workshop-Coverage-Plan.md`, and execute the current item."* (Strategic-Plan only at a phase seam or when a hosting, scope or IP decision is in play.)

**Strategic-Plan** = charter (what the Workshop is, the decisions and their reasons, the budget, the IP line); **Coverage-Plan** = the phased arc with its gates; **Active-Work** = next-thing pointer plus the cross-session queues. Sessions are named by what they advance (`W1 — the front door`).

Build session shape: **read Active-Work + Coverage-Plan → decision round → build → automated checks + eyeball → progress log → quartet walk → commit.** Prefer two short sessions to one long one; commit at every seam. A session that needs Garcks-PC hands PC Claude the runbook step and waits for its report in `frontdoor/state/` (rule 16).

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
| `docs/how-workshop-works.html` | The pictures. Started after Phase 1; never read for the build. |
| `frontdoor/RUNBOOK.md` | The steps PC Claude runs on Garcks-PC, and nothing else. |
| Planet's `CLAUDE.md`, `docs/PROJECT_BRIEF.md` §8 | Only when a question is about what Planet's API *means* (fields, tick, restart). Read the section, not the file. Never edit them (rule 8). |

## Immutable Rules

1. **Never rewrite an entire file.** Surgical Edit operations only; rewriting long files risks silent truncation at the end.
2. **Checks must stay green.** `npm test` in `site/` after every change there; `nginx -t` (run by PC Claude) on any change under `frontdoor/`; `scripts/check-public.sh` against the public address once Phase 1 is live, for any session touching the front door or the page. A session never ends with a red check.
3. **No history-rewriting git operations.** Single branch: `commit`, `log`, `restore`, `revert`, and `pull` (a merge) only. No `rebase`, `reset --hard`, force-push. A commit with a mistake is fixed by another commit.
4. **Commit as you go.** Every step that runs and checks green gets committed, even mid-session. A landing page with no live line is a commit; the live line is the next one.
5. **Doc-quartet drift discipline.** At session start, if the queued next action contradicts what the quartet says is current, stop and ask Jamie. At session end, before commit, walk the four docs: Active-Work pointer rotated; Coverage-Plan phase status updated; Strategic-Plan amended only if a hosting, scope or budget decision changed; CLAUDE.md gains a rule only if one was learned; the decisions table gains the session's decisions.
6. **Session-end trim discipline — whole quartet.** Active-Work ≈ 4 KB, CLAUDE.md ≈ 12 KB, Coverage-Plan ≈ 24 KB. Closed phases collapse to one line (the progress log holds the detail); reasons go to `docs/process/rules-lineage.md`.
7. **Never bundle Mojang's assets — of any kind.** No textures, models, sounds, fonts, logos or the word *Minecraft* in a product or domain name. On the hub, nothing Minecraft-shaped beyond the renamed BlockByBlock's own small mark; the "Not an official Minecraft product" line lives in that app's room, not on the hub. Every public build is scanned for Mojang assets before it ships.
8. **The Workshop never edits another project.** Planet, BlockByBlock, ClaimsDesk and PolicyRAG are shown here, never changed here. Anything the site needs from one of them is a request written into that project's own queue for that project's own session, under that project's rules. This site takes their built artefacts and their public API only.
9. **The budget is a test.** The bandwidth and cache numbers in the Strategic Plan (§Budget) are asserted by `scripts/check-public.sh` against the public address: gzip on, `s-maxage=1` (a second at the edge, none in the browser), `X-Planet-Tick` present, a POST refused with 405, the second fetch of a field within a second a cache hit. A regression blocks the commit the same way a red test does. A failed budget changes the *approach*, never the number.
10. **No silent fallbacks.** The page never shows a blank: if the engine cannot be reached it shows the last still with "last seen at", and a console warning names what failed and why. Same for a failed deploy or a failed tunnel: the runbook step says so in plain words.
11. **Nothing on the internet can write.** The front door allows GET and HEAD only; the site has no accounts, no forms, no database, no analytics. Planet's engine is never on the internet directly: it binds to the home LAN and only nginx talks to it (WS · D1). Multiplayer, comments, uploads — if any of it ever comes, it is a new decision, never a drift.
12. **The restart rule.** A lower `X-Planet-Tick` than the last one seen is a restart (Planet resumes from its last save and replays up to 500 ticks), never an error. Every consumer of the API in this repo implements it and has a test for it.
13. **Secrets never enter the repo.** Tunnel credentials, Cloudflare tokens, deploy keys, VPS keys: `.gitignore` names their shapes from the first commit, and `docs/process/secrets-map.md` says where each one lives (a path or an account), never its value. A secret seen in a diff stops the session until it is rotated.
14. **Every file explains itself.** The top of every source and config file carries a five-line plain-English note: what this file does, what comes in, what goes out, the one decision behind it, and the session it was built in. Every test's name says the fact it checks. This is the substitute for explain-back in chat (§About Jamie); it costs nothing and reads as code quality.
15. **Quality always wins (Jamie's principle, 24 Sep 2026).** When a shortcut and the right way disagree, the right way wins and the schedule moves. Nothing ships at "first pass" silently: a limitation is written into the progress log and the Coverage Plan, or it is fixed.
16. **Two Claudes, one branch (Jamie, 24 Sep 2026).** Laptop Claude owns the repo and makes every commit, with one exception: PC Claude commits only under `frontdoor/state/` — what it installed on Garcks-PC, from which commit, when, and what `nginx -t` and the service status said. Both `git pull` before a session and `git push` at its end. Reports between the two go through `frontdoor/state/`, not the Desktop note, once the repo exists. PC Claude never edits the quartet, the site or the configs; a change it needs is written into Active-Work's queue.

## Verification Workflow — Before Every Build-Session Commit

**Automated (run each step whose condition holds; log "not run, no change to X" for the rest):** 1. `npm test` in `site/` green — when anything under `site/` changed. 2. `nginx -t` clean on Garcks-PC (PC Claude, reported in `frontdoor/state/`) — when anything under `frontdoor/` changed. 3. `scripts/check-public.sh` within budget, numbers into the log — from Phase 1 on, when the front door or the page changed. 4. The link check over the deployed site — when any link or subdomain changed. 5. The Mojang-asset scan of the build output — when building a room for the public.

**Review (eyeball):** 6. **Open the site on the dev server and on the public address**; screenshot the landing page on the laptop and a phone and compare with the previous phase's set in `docs/screens/<phase>/`. The framed viewer must look the same as the viewer on the LAN. 7. **Jamie's walk**, recorded under *The walk* in the log. Jamie's eye is the bar on anything visual.

**Wrap-up:** 8. Progress-log entry (format below). 9. Decisions into `docs/decisions.md`, one row each. 10. The quartet walk (rule 5) and trim (rule 6). 11. Commit named for the session and its numbers.

## Progress Log Discipline

`docs/process/progress/YYYY-MM.md` gets one entry per session:

```
### Session WN — <Title> (Month DD, YYYY)
<Two or three sentences: context and scope.>
**What changed.**  <the files and the numbers, not the story>
**Leave alone (already correct).**
**Verification.** <site tests, nginx -t, check-public numbers and budget result, link check>
**Public check.** <the numbers of record for this phase, if they moved: bytes per tick, cache hit ratio, time to first picture>
**The walk.** <what Jamie saw on the laptop and the phone, what they asked for, where it looked wrong — or "none this session">
**Decisions.** <Jamie's decisions and reasons, one line each; Claude's check-settled ones marked as such>
**Deferred.**
```

## What Works Well — Calibration Anchor

The doc quartet, each with one job · the public check as the work queue for the budget and Jamie's walk as the queue for looks · the shown projects reached through their artefacts and APIs, never their source · one folder per job · commit messages name the session · automated → eyeball → wrap-up order · learning by deciding, with the how-it-works page as the picture · the simplest thing Jamie can explain beats the cleverer thing Jamie can't.

## Lineage

Drafted **24 Sep 2026** from Explore's CLAUDE.md (24 Sep 2026 state) and Planet's CLAUDE.md (24 Sep 2026 state). Full dated lineage in `docs/process/rules-lineage.md`.
