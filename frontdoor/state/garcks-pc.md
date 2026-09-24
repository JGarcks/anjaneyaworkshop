# Garcks-PC — front door state

*Written by PC Claude only (CLAUDE.md rule 16). Newest entry first.*

## 2026-09-24 17:16 BST — step 3 re-run from commit ec36cb2: STOPPED at `nginx -t`

**Door (step 3), second run.** The log race is fixed: the log now reads normally (98 lines). Steps 1–4 of `install.sh door` ran: nginx 1.24.0-2ubuntu7.18 and cloudflared 2026.9.2 (Cloudflare's apt repo) are installed; the `cloudflared` system user exists (uid 997); the door config is in `/etc/nginx/conf.d/anjaneya-frontdoor.conf`, the /home seal in `nginx.service.d/protecthome.conf`; `sites-enabled/default` removed. Then:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
[emerg] mkdir() "/var/cache/nginx/planet" failed (2: No such file or directory)
nginx: configuration file /etc/nginx/nginx.conf test failed
STOPPED: nginx -t refused the config; nothing restarted.
```
Cause: Ubuntu's nginx package has no `/var/cache/nginx` (it keeps its own temp files in `/var/lib/nginx`), and nginx creates only the last directory of a `proxy_cache_path`, so the parent must exist.
**State left behind:** nginx is *running and enabled* with the package's stock config from install time. The default site was removed from disk but nginx was never restarted, so the Ubuntu welcome page is still served on **0.0.0.0:80 and [::]:80** (answers 200 on the LAN at 192.168.1.157; not on the internet, since no router port is open and no tunnel exists). Nothing on 8090. No cloudflared service unit. The quick tunnel is untouched.

**For laptop Claude.** In `install.sh door`, before `nginx -t`, create the cache directory, e.g. `install -d -o www-data -g www-data -m 0700 /var/cache/nginx/planet` (www-data is the worker user on Ubuntu). A re-run of step 3 then restarts nginx with the door config and without the default site, which also clears port 80. (The earlier "For laptop Claude" items in the entry below still stand.)

## 2026-09-24 — installing from commit b3b1d78 (in progress)

**Before.** planet.service active (Main PID 44040, `~/planet-live/planet-r20`, world `planet-seed25660-r20.sqlite`; restarted from year zero at 16:39:57 BST on 24 Sep, Planet's own switch to the r20 experiment, see `~/planet-live/BUILD.txt`); engine headers: `HTTP/1.1 200 OK`, `Cache-Control: no-store`, `X-Planet-Tick: 4149`. Listeners: 22 (all), 8000 (all, PolicyRAG in Docker), 8080 (all, planet-r20), 127.0.0.1:20241 (quick-tunnel cloudflared metrics), 127.0.0.1:631 (cups), 127.0.0.1 ports for VS Code, Tailscale on 100.76.108.61:50444 and its v6 address; nothing on 8090 or 80. nginx before: none. cloudflared before: no package; a standalone binary `~/bin/cloudflared` 2026.9.1 (not on a non-login PATH). ~/.cloudflared: does not exist. The quick tunnel was started by hand: `/home/garcks/bin/cloudflared tunnel --url http://localhost:8000` (pid 3689623, since 09:31 on 24 Sep) from a bash shell in a GNOME Terminal tab (pts/3); no user unit, system unit, crontab line, or mention in `~/PolicyRAG`. Groups: garcks adm cdrom sudo dip plugdev users lpadmin sambashare nordvpn (docker comes with new logins).
**Door (step 3). STOPPED: install.sh exited at once, having changed nothing.** Jamie ran `sudo bash ~/anjaneyaworkshop/frontdoor/install.sh door` at about 17:10 BST. The whole of `/var/tmp/frontdoor-install-door.log` (86 bytes, root 0644) is:
`chmod: cannot access '/var/tmp/frontdoor-install-door.log': No such file or directory`
Nothing was printed in Jamie's terminal. After the run: no nginx, no `cloudflared.list` apt source, no `cloudflared` user. The machine is unchanged from **Before**.
Cause: install.sh lines 15–16. `exec > >(tee "$LOG")` starts tee in the background, and `chmod 0644 "$LOG"` runs before tee has created the file, so under `set -euo pipefail` the chmod fails and the script exits. It is a race. Now that the log file exists a re-run would probably get past it, but that is luck, not a fix.

**For laptop Claude.** Fix install.sh so the log exists before tee and chmod, e.g. `install -m 0644 /dev/null "$LOG"` (or `: > "$LOG"; chmod 0644 "$LOG"`) *before* `exec > >(tee "$LOG") 2>&1`, and drop the later chmod. Then Jamie re-runs step 3. Also: Planet restarted from year zero at 16:39:57 on 24 Sep (r20 experiment, new world file `planet-seed25660-r20.sqlite`, same seed and f=32), the Active-Work trigger "the world moving to a new build or seed". PolicyRAG's quick tunnel was started by hand in a terminal (see **Before**), so step 8 will be a `pkill` plus a note.
