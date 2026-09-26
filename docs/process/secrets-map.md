# Workshop — Secrets Map

*Where each credential lives. Never a value, never a file that contains one (CLAUDE.md rule 13). Update this the moment a credential is created, moved or rotated.*

| Credential | Lives at | Who uses it | Created |
|---|---|---|---|
| Laptop Claude's SSH key (deploy key on `planet`, read-only) | `C:\Users\Garcks\Projects\.claude-ssh\id_ed25519` on the laptop; public half in `Desktop/for-laptop-claude.txt` | Laptop Claude, for git over SSH | 24 Sep 2026 |
| Laptop Claude's workshop key (read-write deploy key on `anjaneyaworkshop` only; GitHub allows a deploy key on one repo, W1-b) | `C:\Users\Garcks\Projects\.claude-ssh\id_ed25519_workshop` on the laptop; public half in the repo's Settings → Deploy keys | Laptop Claude, for git over SSH on this repo (this repo's `core.sshCommand`) | 24 Sep 2026 |
| The Planet key's public half (`id_ed25519.pub`) on Garcks-PC | `~/.ssh/authorized_keys` on Garcks-PC | Unused: the laptop's sandbox cannot reach the LAN. Harmless; remove if wanted. | 24 Sep 2026 |
| Cloudflare account | Jamie's Cloudflare account, signed in with Google as `jamie.garcka@gmail.com` (no separate password). No API token exists: Pages builds by watching the repo (W1-a) | Jamie | 24 Sep 2026 (W1) |
| Cloudflare's access to GitHub (not a secret; an access grant) | GitHub → Settings → Applications → *Cloudflare Workers and Pages*, installed on `JGarcks` for `anjaneyaworkshop` only | Cloudflare Pages, to build on push | 24 Sep 2026 (W1) |
| Named tunnel credentials (the tunnel's own key; runs this one tunnel only) | `/etc/cloudflared/anjaneya-frontdoor.json` on Garcks-PC, owned by the `cloudflared` account, mode 0400 (moved there from `~/.cloudflared/` by `frontdoor/install.sh tunnel`) | `cloudflared-frontdoor.service` on Garcks-PC | not yet (W2, RUNBOOK step 4) |
| Cloudflare origin certificate `cert.pem` (account-wide for the zone) | `~/.cloudflared/cert.pem` on Garcks-PC **only between RUNBOOK steps 4 and 7**, then deleted; a fresh `cloudflared tunnel login` re-creates it if ever needed | PC Claude, to create the tunnel and its DNS route | not yet (W2) |
| Porkbun account | Jamie's; username `Garcks` | Jamie, for nameservers and renewals | 22 Apr 2026 |
| OVHcloud account (the rented server, W9-a) | Jamie's; OVH account ID and the card on file are in OVH's control panel, never here | Jamie, for the bill and the control panel | 26 Sep 2026 (W9) |
| The server's login | The laptop's `~/.ssh/id_ed25519` (public half "anjaneya-games") in `~ubuntu/.ssh/authorized_keys` on the server; passwords switched off by `frontdoor/server.sh base`. OVH's emailed first password, if one came, stays in Jamie's email | Laptop Claude, over SSH | 26 Sep 2026 (W9) |
| Named tunnel credentials on the server | `/etc/cloudflared/anjaneya-frontdoor.json` on the server, owned by `cloudflared`, mode 0400 — the same key as Garcks-PC's, handed over by RUNBOOK §M1; the PC's copy stays for the way back | `cloudflared-frontdoor.service` on the server | at the move (W9) |
