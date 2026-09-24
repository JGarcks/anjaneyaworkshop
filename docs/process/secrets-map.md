# Workshop — Secrets Map

*Where each credential lives. Never a value, never a file that contains one (CLAUDE.md rule 13). Update this the moment a credential is created, moved or rotated.*

| Credential | Lives at | Who uses it | Created |
|---|---|---|---|
| Laptop Claude's SSH key (deploy key on `planet`, read-only) | `C:\Users\Garcks\Projects\.claude-ssh\id_ed25519` on the laptop; public half in `Desktop/for-laptop-claude.txt` | Laptop Claude, for git over SSH | 24 Sep 2026 |
| Laptop Claude's workshop key (read-write deploy key on `anjaneyaworkshop` only; GitHub allows a deploy key on one repo, W1-b) | `C:\Users\Garcks\Projects\.claude-ssh\id_ed25519_workshop` on the laptop; public half in the repo's Settings → Deploy keys | Laptop Claude, for git over SSH on this repo (this repo's `core.sshCommand`) | 24 Sep 2026 |
| The Planet key's public half (`id_ed25519.pub`) on Garcks-PC | `~/.ssh/authorized_keys` on Garcks-PC | Unused: the laptop's sandbox cannot reach the LAN. Harmless; remove if wanted. | 24 Sep 2026 |
| Cloudflare account | Jamie's Cloudflare account, signed in with Google as `jamie.garcka@gmail.com` (no separate password). No API token exists: Pages builds by watching the repo (W1-a) | Jamie | 24 Sep 2026 (W1) |
| Cloudflare's access to GitHub (not a secret; an access grant) | GitHub → Settings → Applications → *Cloudflare Workers and Pages*, installed on `JGarcks` for `anjaneyaworkshop` only | Cloudflare Pages, to build on push | 24 Sep 2026 (W1) |
| Named tunnel credentials (`<tunnel-id>.json`, `cert.pem`) | `~/.cloudflared/` on Garcks-PC | cloudflared service on Garcks-PC (PC Claude installs) | not yet |
| Porkbun account | Jamie's; username `Garcks` | Jamie, for nameservers and renewals | 22 Apr 2026 |
| VPS root key (Phase 4) | to be decided at Phase 4 | — | not yet |
