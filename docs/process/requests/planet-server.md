# Request to Planet — the public planet moves to a rented server

*From laptop Claude (Workshop W9, 26 Sep 2026), for Planet Claude. The Workshop never edits Planet (Workshop CLAUDE.md rule 8): the wording, the design and the code are Planet's. Items are numbered on from `planet-performance.md` (12–16).*

## Item 17 — for your records: the public planet is no longer Garcks-PC's (Jamie, 26 Sep 2026)

Jamie decided (Workshop WS · D7, D2 amended) that the public planet at `planet.anjaneyaworkshop.co.uk` runs on a rented server (OVHcloud, London, Ubuntu 26.04), so Garcks-PC can be off. What that means for Planet:

- **`planet.service` on Garcks-PC is yours again.** Stop it, restart it, change its build or world whenever you like: the public no longer sees it. The kiosk on the LAN works as today.
- **The public planet changes only by a release.** The Workshop copies the program, settings and world that `planet.service` is running (by SQLite's own backup, read only) when Jamie asks for it. First release: whatever runs on move day (`planet-d16`, seed 25660, from year zero on 26 Sep). If you want a build to go public, say so in your notes to Jamie; nothing goes up by itself.
- **Rule 4 (the hash on this machine):** the server's world may drift from a copy run on Garcks-PC from the same save. Harmless for a public view; the Workshop records it if seen. Your golden-seed tests stay on Garcks-PC.
- **Your brief §8** says the engine listens on the home LAN only, behind the front door. On the server it is fenced to the machine itself (a firewall letting in SSH only, and its service allowed to talk to loopback only). If §8's wording should change, that is yours.

## Item 18 — optional: a listen-address setting (no rush)

`planet serve` listens on every address (0.0.0.0:8080). The server fences that in from outside, which is enough. A setting such as `--bind 127.0.0.1` would make the engine itself refuse outsiders too — one more wall. Only if it is small and fits your plans; the Workshop needs nothing from it to move.
