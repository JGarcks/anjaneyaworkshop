# Workshop — Active Work

> **Single source of truth for the next session.** Just the live pointer + truly cross-session queues.
>
> Closed session entries belong in `progress/YYYY-MM.md`, never here. Phase plans and design content belong in `Workshop-Coverage-Plan.md` (the arc) or `Workshop-Strategic-Plan.md` (charter). If this doc grew by more than ~30 lines during the session, move the bulk out before commit (CLAUDE.md rule 6).

---

## Currently working on

**Phase 0 — Ground: closed (W1, 24 Sep 2026); Jamie's walk passed on the laptop and the phone on cellular.** The repo is on `github.com/JGarcks/anjaneyaworkshop` (private); Pages builds `site/` on every push to `main` and runs `npm test` first; `check-public.sh` 6/6 (HTTPS, http→https, www→bare, `.com`→`.co.uk` with path). Detail: `progress/2026-09.md` §W1.

**Next build session: W2 — Phase 1, the front door** (`Workshop-Coverage-Plan.md` §Phase 1): nginx config, tunnel config and the runbook written here; PC Claude's runbook step on Garcks-PC; `check-public.sh` gains the budget. Its decision round will include: PolicyRAG's quick tunnel (retire, or fold into the named tunnel's ingress).

**Pending Jamie, in order:**
1. Point a Planet session at the §8 amendment request, now at the end of `Desktop/for-laptop-claude.txt` (WS · D1, rule 8).
2. WS · D5, the new name for BlockByBlock — needed by Phase 3; it fixes a subdomain and a repo name.

**Standing:** teaching is the decision round only; no explain-back during the build — headers in the code (rule 14); laptop Claude commits, PC Claude only `frontdoor/state/` (rule 16); Planet's own quartet is *not* edited by Workshop sessions (rule 8) — the §8 amendment for WS · D1 is a request for a Planet session, written when D1 is agreed.

---

## Queued (cross-session, ride-alongside — pick when a session is already in the relevant file)

- **Trim CLAUDE.md** from 15.6 KB toward the 12 KB budget (rule 6) at the first session that touches it; the About Jamie section is the long one.
- **A second, stable planet instance** on `main` with its own world file and port, as a one-line nginx repoint — only if Jamie ever wants the site not to follow the experiments (WS · D2).
- **The 3D viewer**: when Planet's three.js viewer exists (its brief, after Layer 3), the landing page adopts it. Note only.
- **The renamed BlockByBlock's mark** for the hub, and a light room for it using the block graphic. Phase 3.
- **ClaimsDesk and PolicyRAG**: what to strip is Jamie's list; nothing from them touches the site before Phase 5.
- **Retire PolicyRAG's quick tunnel** on Garcks-PC once the named tunnel exists (Phase 1); its port 8000 can join the named tunnel's ingress later.

## Held for triggers

- **The rented server (Phase 4)** — trigger: the house's downtime showing on the site more than Jamie likes, or Jamie wanting Garcks-PC off. Then WS · D7.
- **Sub-second snapshots for visitors** — trigger: Jamie finding the once-a-second picture visibly steppier than the LAN kiosk. Action: measure it first; then a paid Cloudflare plan or a push relay, put to Jamie.
- **A restart caught mid-visit** — trigger: the "resumed" state showing more than once a day in the check log. Action: read Planet's `journalctl --user -u planet` with PC Claude; nothing on the site changes.
- **The world moving to a new build or seed** — trigger: PC Claude reporting a restart from year zero in `frontdoor/state/`. Action: the still refreshes itself; nothing else to do; note it in the log.
- **A `.com` visitor** — trigger: the redirect log showing real traffic to the `.com`. Action: none; it is working.
