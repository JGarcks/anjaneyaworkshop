# Workshop — Active Work

> **Single source of truth for the next session.** Just the live pointer + truly cross-session queues.
>
> Closed session entries belong in `progress/YYYY-MM.md`, never here. Phase plans and design content belong in `Workshop-Coverage-Plan.md` (the arc) or `Workshop-Strategic-Plan.md` (charter). If this doc grew by more than ~30 lines during the session, move the bulk out before commit (CLAUDE.md rule 6).

---

## Currently working on

**Nothing is open. The quartet is drafted (24 Sep 2026, planning session in Cowork) and awaits Jamie's first decision round before Phase 0.** No code exists; no `package.json`; the folder holds docs only; there is no git repo yet.

**Pending Jamie, in order:**
1. The first decision round: rule on WS · D1, D4 and D8 (Claude's proposals) in `../decisions.md`, and P0-a, P0-b.
2. WS · D5, the new name for BlockByBlock — not needed until Phase 3, but it fixes a subdomain and a repo name, so sooner is cheaper.
3. Accounts: a Cloudflare account; a read-write deploy key for laptop Claude on the new repo (its public key is in `Desktop/for-laptop-claude.txt`).

**First build session: Phase 0 — Ground** (`Workshop-Coverage-Plan.md` §Phase 0). Its gate: the repo on a private remote with the quartet in it, both domains answering over HTTPS with a holding page, the `.com` redirecting.

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
