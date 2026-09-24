# Workshop — Rules Lineage

*Why each CLAUDE.md rule exists and where it came from. Read only when reviewing or adding a rule. The rules themselves live in `../../CLAUDE.md`; this file holds the reasons so the rules can stay short (rule 6).*

## The two parents

**Explore's `CLAUDE.md`** (24 Sep 2026) — Jamie's current operating model, itself drafted from BlockByBlock's SKILL.md and ClaimsDesk's CLAUDE.md the same day. It supplies the *shape* of this file whole: About Jamie, the decision round, clerical work on Sonnet, the doc index, the size-budgeted trim, the decisions table, "every file explains itself", the verification order. Jamie chose this shape over Planet's four-file quartet on 24 Sep 2026 (WS · D9).

**Planet's `CLAUDE.md`** (20–24 Sep 2026) — the rules of the project this site shows. It contributed what the site must *respect* rather than how it works: rule 5 (engine and viewers separate; viewers read-only), the brief's §8 (the engine never on the internet), rule 9 (checkpoints and resume — the restart rule follows from it), and the habit of reading the owner's planet's log at the start of a session, which becomes reading `frontdoor/state/` here.

## Rule by rule

| Rule | Origin | Notes |
|---|---|---|
| 1 Never rewrite a file | Explore 1 ← BlockByBlock #7 ← ClaimsDesk 1 | Unchanged in wording since May. |
| 2 Checks green | Explore 2 | Reworded for this stack: site tests, `nginx -t` on the PC, the public check from Phase 1. |
| 3 No history rewriting | Explore 3 ← BlockByBlock #11 | Born 5 May 2026 when a `git rebase --abort` wiped uncommitted drawer work. `pull` added explicitly because two Claudes share the branch (rule 16); a pull is a merge, never a rebase. |
| 4 Commit as you go | Explore 4 ← BlockByBlock #12 | Same incident. |
| 5 Quartet drift | Explore 5 ← BlockByBlock #13 | "Hosting, scope or budget" replaces "engine, scope or budget" as the Strategic-Plan trigger. |
| 6 Trim with size budgets | Explore 6 ← ClaimsDesk 6 | Budgets kept as Explore's. The first draft of CLAUDE.md is over (15.6 KB); queued in Active-Work. |
| 7 No Mojang assets | Explore 7 ← BlockByBlock #8 | Widened once more: no Minecraft imagery on the hub beyond the renamed app's own mark, and the disclaimer line lives in that room, not on the hub. The domain name joins the product name. |
| 8 Never edit another project | Explore 8 ("never edit `../src`") | The exact analogue, and it matters more here: four projects are shown, each with its own rules. Requests go into their queues. Planet's §8 amendment for WS · D1 is the first such request. |
| 9 Budget is a test | Explore 9 ← ClaimsDesk 12 | The budget is bandwidth and cache, not frame time; `scripts/check-public.sh` is the assertion. |
| 10 No silent fallbacks | Explore 10 ← BlockByBlock's magenta tile | The still and "last seen" are this project's magenta block. |
| 11 Nothing on the internet can write | Explore 13 ("no server, ever"), inverted | This project exists to run a server, so the letter of Explore 13 cannot hold; its reasons (free hosting, nothing to protect) survive as the write ban, the no-accounts ban and the engine-LAN-only line (WS · D1). |
| 12 The restart rule | New (24 Sep 2026), from Planet rule 9 and PC Claude's note | Planet resumes from its last save and replays up to 500 ticks; a lower tick is normal. Replaces Explore 11 (typed worker contracts) as this project's one contract. |
| 13 Secrets never enter the repo | ClaimsDesk 8, which Explore dropped | Back because this is the first project in the set with real credentials. `secrets-map.md` holds locations, never values. |
| 14 Every file explains itself | Explore 14 ← ClaimsDesk 17 | Extended to config files (nginx, cloudflared, scripts), which are most of this repo. |
| 15 Quality always wins | Explore 15 ← Jamie, 24 Sep 2026 | Quoted as Jamie's founding stipulation. |
| 16 Two Claudes, one branch | New (Jamie, 24 Sep 2026; WS · D10) | The laptop's sandbox cannot reach the LAN; the PC must run the front door. One owner per file tree avoids conflicts without rebase. |

## What was deliberately left behind

- **Explore 11 (typed worker contracts) and 12 (renders at least as well as Preview)** — engine rules. The eyeball bar "the framed viewer looks the same as on the LAN" carries 12's instinct into the verification workflow without being a rule.
- **Explore's kids-as-playtesters** — replaced by Jamie's walk on the laptop and a phone; there is no second audience to observe.
- **Explore's benchmark, presets and graphics ladder** — the budget here is a handful of HTTP numbers, not a frame-time distribution.
- **Planet's rules 1–4, 6–13** — the world's own physics and determinism. The site reads their outputs and never touches them; rule 4 (hash on this machine) reappears only as a note under WS · D7.
- **Planet's "Pictures at each gate" as a gate condition** — kept as a habit (the how-it-works page, WS · D12) but not as a gate, because a phase here is closed by the public check and Jamie's walk.
