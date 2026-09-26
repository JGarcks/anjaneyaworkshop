# The rented server — what is installed

*What this file does: records what is on the OVH server, from which commit, when, and what the checks said. In: laptop Claude's runs of `frontdoor/server.sh`, `install.sh` and `scripts/planet-release.sh` over SSH. Out: the record the next session reads before touching the server. The decision behind it: WS · D7 and W9-a…d (the engine on the server; laptop Claude runs it, since the server needs no password on the laptop's key). Built in W9 — the rented server (26 Sep 2026). Written by laptop Claude; newest entry first.*

**The machine.** OVHcloud VPS-1 (order 259163206), Erith (London). `vps-5e97d8be.vps.ovh.net`, IPv4 57.129.161.57 (IPv6 2001:41d0:801:2000::2595, unused). Ubuntu 26.04.1 LTS, kernel 7.0.0-28, glibc 2.43; 2 vCores (Intel Haswell, with FMA and AVX2), 3.8 GB, 38 GB disk. Login: `ubuntu`, the laptop's key only (`docs/process/secrets-map.md`).

## 26 Sep 2026, 20:41 UTC — item 16 live: planet-d16-web11, program only (Jamie's word)

`released 2026-09-26 20:41 UTC: planet-d16-web11 (sha256 aac7b6e0512c4959…), the server's own world planet-seed25660-d16.sqlite kept, settings none; seed-2 hash f7ebff07… matches Garcks-PC`. Planet WEB · D11 (item 16, W7): colours and slopes sent per cell as a texture, looked up in the vertex shader; the old per-corner way kept as the fallback (`?percorner` forces it). Resumed from the save at tick 38,000; listening on 127.0.0.1:8080 only. The public `viewer.js` carries WEB · D11. `check-public.sh` 29/29. Way back if the spin stutters: planet-d16-web10.

## 26 Sep 2026, 18:30 UTC — the first release: planet-d16-web10, program only (Jamie's word)

`released 2026-09-26 18:30 UTC: planet-d16-web10 (sha256 3b84392b3de73058…), the server's own world planet-seed25660-d16.sqlite kept, settings none; seed-2 hash f7ebff07… matches Garcks-PC`. Planet WEB · D10 (items 18–20): the engine now runs `--bind 127.0.0.1` and listens on 127.0.0.1:8080 only (nginx reaches it; the unit's IP fence stays); the viewer opens at zoom 0.65 and starts its glide again on a lower tick. Resumed from the save at tick 19,003 (from ~19,130). The first run stopped at its first step, the PC's engine being stopped (a failed ask for its tick): fixed in `planet-release.sh`. **The restart test (item 19):** headless Edge on `planet.` across a deliberate `systemctl restart planet-engine` at 18:32:19 UTC — the world's tick 19,191 → 19,002, the shown picture 19,188 → 19,002 within the second and gliding on (1–4 ticks behind, as before). `check-public.sh` 29/29; ports 8080 and 8090 shut from outside.

## 26 Sep 2026, 17:19 UTC — the switch

**M1** (Jamie at Garcks-PC): the tunnel's key copied PC → server through the laptop's memory (`scp -3`), checked by its fields' names and TunnelID only (`a0abe87c-…`), the PC's handover copy deleted. **M2** (Jamie): `install.sh close` on Garcks-PC — its tunnel inactive and disabled. Then `install.sh tunnel` on the server: ingress valid, `cloudflared-frontdoor` active at 17:19:52 UTC, four connections registered (London: lhr10, lhr13 ×2, lhr15). Public requests in the server's door log from 17:20:06. **M3** (Jamie): Garcks-PC's `planet.service` inactive and disabled (W9-d). One "resumed" for visitors: tick 9,032 (PC) → 8,553 (server). `check-public.sh` 29/29 at 17:20 UTC. At 17:46 UTC: tick 12,444, planet-engine, cloudflared-frontdoor and nginx active, load 0.15.

## 26 Sep 2026, 17:07–17:12 UTC — installed from commits 53eb5cb…a1c19f4 and the hash fix

**Base (`server.sh base`).** Fully updated; unattended security updates on; SSH keys only (`sshd -T`: passwordauthentication no, kbdinteractiveauthentication no, permitrootlogin no; a password login from the laptop is refused); ufw: deny incoming, SSH (22) only; `planet` system account; `planet-engine.service` installed and enabled. 26.04 runs sshd per connection (ssh.socket), which stopped the first run at the reload: fixed in `server.sh`.

**Door (`install.sh door`).** nginx from Ubuntu; cloudflared 2026.9.3 from Cloudflare's repository; `nginx -t` ok; listeners: nginx on 127.0.0.1:8090 only. The eight door checks, on the server: elevation 200 with `Cache-Control: public, max-age=0, s-maxage=1`, `X-Planet-Tick`, gzip, the CORS and frame-ancestors headers; 35,219 bytes compressed; asked again, HIT; grid `max-age=86400`; HEAD / 200; POST 405; an unknown path 404; `/api/picture/elevation_m` 200 (164,016 bytes); `viewer.js` 200. From the laptop, ports 8080, 8090, 80 and 443 on 57.129.161.57 give no answer (the firewall).

**The engine (`planet-release.sh`).** `released 2026-09-26 17:09 UTC: planet-d16 (sha256 12074db3be9f7daa…), world planet-seed25660-d16.sqlite from Garcks-PC at tick 7431, settings none; seed-2 hash f7ebff07… matches Garcks-PC`. The server resumed from the world's last save at tick 7,000. It listens on 0.0.0.0:8080 (Planet has no bind setting, request item 18) but only loopback can reach it: the firewall, and the unit's IPAddressDeny/Allow. Engine at 18 MB and 0.5 s of CPU in its first minute.

**The hash (Planet's rule 4).** First run: the server's seed-2 hash was `784394f0…` against Garcks-PC's `f7ebff07…` — the release stopped, nothing installed. Cause: glibc 2.43 picks FMA/AVX2 versions of sin, exp and the like on this processor; Garcks-PC's i7-3820 has neither. With `GLIBC_TUNABLES=glibc.cpu.hwcaps=-AVX2,-FMA,-AVX` the server gives `f7ebff07…`, and seed 25660 f 32 at 3,000 ticks gives `b1461de6…` on both machines (`4d23ac6e…` on the server without it). The setting is in `planet-engine.service`, confirmed in the running engine's environment, and the release check runs under it.

**Not yet (then).** The tunnel, Garcks-PC's `planet.service`, `check-public.sh`: all done at the switch, above.
