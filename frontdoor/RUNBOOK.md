# Front door — Runbook for PC Claude on Garcks-PC

*What this file does: the steps PC Claude runs on Garcks-PC to install the front door, and nothing else. In: this repo, pulled on Garcks-PC. Out: nginx and the named tunnel running, and `frontdoor/state/garcks-pc.md` committed and pushed. The decision behind it: W2-c — system services on their own accounts; every admin step is in `install.sh`, which **Jamie** runs with `sudo`, because no Claude types a password. Built in W2 — the front door (24 Sep 2026).*

**Who does what.** PC Claude runs every step below except the two `sudo` lines and the one sign-in link, which are Jamie's (marked **Jamie**). PC Claude commits only under `frontdoor/state/` and edits nothing else in this repo (CLAUDE.md rule 16); anything it thinks should change goes into its state file for laptop Claude.

**Never:** print, `cat` or copy the tunnel's credentials file or `cert.pem` (only their names); change `planet.service` or anything of Planet's; open a port on the router; run a step out of order. If a step's check fails, stop, write what you saw into the state file, commit, push, and tell Jamie.

---

## 1. The repo

```bash
cd ~ && [ -d anjaneyaworkshop ] || git clone git@github.com:JGarcks/anjaneyaworkshop.git
cd ~/anjaneyaworkshop && git pull && git log --oneline -1
```

If the clone is refused: `ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_workshop_pc -N "" -C "garcks-pc workshop state"`, show Jamie the `.pub` half, and wait while **Jamie** adds it to the repo as a deploy key named "Garcks-PC (state only)" with write access. Then `git clone -c core.sshCommand="ssh -i ~/.ssh/id_ed25519_workshop_pc -o IdentitiesOnly=yes" git@github.com:JGarcks/anjaneyaworkshop.git`, and say in the state file that laptop Claude must add the key to `docs/process/secrets-map.md`.

**Check:** the commit printed is the one named in Active-Work's hand-off (or later).

## 2. Look before changing anything

Nothing in this step changes the machine. Record every answer under **Before** in the state file.

```bash
systemctl --user is-active planet
curl -sS -o /dev/null -D - http://127.0.0.1:8080/api/field/elevation_m | grep -iE '^(HTTP|x-planet-tick|cache-control)'
ss -ltnp
command -v nginx cloudflared; dpkg -l nginx cloudflared 2>/dev/null | grep ^ii
ls -la ~/.cloudflared 2>/dev/null              # names only
pgrep -af cloudflared
systemctl --user list-units --all | grep -iE 'cloudflared|policyrag|tunnel'
systemctl list-units --all | grep -iE 'cloudflared|policyrag|tunnel'
crontab -l 2>/dev/null | grep -iE 'cloudflared|policyrag'
id -nG
```

**Stop and report** if anything already listens on port 8090, or if nginx is already installed and serving something else: laptop Claude adapts the config first. Otherwise note how PolicyRAG's quick tunnel is started (a user unit, a system unit, a crontab line, a script in PolicyRAG's repo, or by hand): step 8 needs it.

## 3. The door

**Jamie**, at Garcks-PC, in a terminal:

```bash
sudo bash ~/anjaneyaworkshop/frontdoor/install.sh door
```

PC Claude then reads `/var/tmp/frontdoor-install-door.log`. **Check:** `nginx -t` says *syntax is ok* and *test is successful*; the listeners show nginx on `127.0.0.1:8090` and nothing on port 80; the last line is `== done`.

Then prove the door from the PC itself (no password needed). Each line's expected answer follows it:

```bash
D=http://127.0.0.1:8090
curl -s -o /dev/null -D - -H 'Accept-Encoding: gzip' $D/api/field/elevation_m | grep -iE '^(HTTP|cache-control|x-planet-tick|content-encoding|x-cache-status|access-control-allow-origin|content-security-policy)'
#   200; Cache-Control: public, max-age=0, s-maxage=1; X-Planet-Tick: <n>; Content-Encoding: gzip; Access-Control-Allow-Origin: https://anjaneyaworkshop.co.uk; frame-ancestors 'self' https://anjaneyaworkshop.co.uk
curl -s -o /dev/null -w '%{size_download} bytes compressed\n' -H 'Accept-Encoding: gzip' $D/api/field/elevation_m
#   about 35,000 (41,000 uncompressed)
curl -s -o /dev/null -D - $D/api/field/elevation_m | grep -i x-cache-status          #   HIT (asked again within the second)
curl -s -o /dev/null -D - $D/api/grid | grep -i cache-control                        #   public, max-age=86400
curl -s -I $D/ | head -1                                                             #   200 (HEAD works; the engine itself refuses HEAD)
curl -s -o /dev/null -w '%{http_code}\n' -X POST $D/api/meta                         #   405
curl -s -o /dev/null -w '%{http_code}\n' $D/anything-else                            #   404
curl -s -o /dev/null -w '%{http_code}\n' --max-time 3 http://192.168.1.157:8090/     #   000 (the door is not on the LAN)
```

## 4. Create the tunnel (as garcks)

```bash
cloudflared tunnel login
```

It prints a link. **Jamie** opens it (on this PC or the laptop), signs in to Cloudflare, picks **anjaneyaworkshop.co.uk**, and presses Authorize. `cert.pem` lands in `~/.cloudflared/`. Then:

```bash
cloudflared tunnel create anjaneya-frontdoor
ls ~/.cloudflared                                  # cert.pem and one <tunnel-id>.json — names only
```

## 5. The tunnel's service

**Jamie**:

```bash
sudo bash ~/anjaneyaworkshop/frontdoor/install.sh tunnel
```

PC Claude reads `/var/tmp/frontdoor-install-tunnel.log`. **Check:** `ingress validate` says *OK*; the rule check names rule 1 and `http://127.0.0.1:8090`; the service is *active (running)*; the journal shows *Registered tunnel connection* (up to four); the last lines give `TUNNEL_ID=…`. Then `cloudflared tunnel info anjaneya-frontdoor` lists a connector. The credentials file has moved out of `~/.cloudflared` into `/etc/cloudflared/`.

## 6. Go public (last, once the door is proven)

Only if Active-Work's hand-off says the Cloudflare Cache Rule for the planet subdomain is in place (laptop Claude makes it first, W2-d):

```bash
cloudflared tunnel route dns anjaneya-frontdoor planet.anjaneyaworkshop.co.uk
sleep 30
for i in 1 2; do curl -s -o /dev/null -D - https://planet.anjaneyaworkshop.co.uk/api/meta | grep -iE '^(HTTP|cf-cache-status|cache-control)'; done
#   200 both times; the second within the second says cf-cache-status: HIT
```

## 7. Delete the account-wide certificate

```bash
rm ~/.cloudflared/cert.pem && ls -la ~/.cloudflared
```

Only the tunnel's own key (in `/etc/cloudflared/`, readable by the `cloudflared` account alone) remains; it can run this one tunnel and nothing else. Changing the tunnel's public name later needs a fresh `tunnel login`.

## 8. Retire PolicyRAG's quick tunnel (W2-e)

Stop it the way step 2 found it is started, and stop it starting again. Nothing in PolicyRAG's repo is edited (rule 8).

- **A user unit:** `systemctl --user disable --now <unit>`.
- **A crontab line:** tell Jamie the exact line; **Jamie** removes it with `crontab -e`; then stop the process.
- **A system unit:** **Jamie** runs `sudo systemctl disable --now <unit>`.
- **A script inside PolicyRAG's repo, or started by hand:** stop the process (`pkill -f 'cloudflared.*8000'` — check the pattern against step 2's `pgrep` first) and write what starts it into the state file; laptop Claude writes a request for a PolicyRAG session.

**Check:** `pgrep -af cloudflared` shows only the `cloudflared-frontdoor` service's process; PolicyRAG, if it was running, still answers on `http://127.0.0.1:8000/` on the LAN.

## 9. Report

Write `frontdoor/state/garcks-pc.md` from the template below, then:

```bash
cd ~/anjaneyaworkshop && git pull && git add frontdoor/state/ && git commit -m "W2 — PC Claude: the front door installed on Garcks-PC (state)" && git push
```

---

## At the Phase 1 gate (when laptop Claude asks)

While Jamie has three browsers watching the planet through the public address:

```bash
bash ~/anjaneyaworkshop/frontdoor/door-rate.sh 60
```

Paste the output under **The gate** in the state file with the time; commit and push as in step 9.

## Changing the door later

`git pull`; then **Jamie** runs `sudo bash ~/anjaneyaworkshop/frontdoor/install.sh door` (for `nginx.conf` or the nginx add-on) or `… install.sh tunnel` (for `config.yml` or the tunnel's service). PC Claude records the commit and the log's checks in the state file.

## Closing the door

**Jamie**: `sudo bash ~/anjaneyaworkshop/frontdoor/install.sh close` takes the planet off the internet at once and keeps it off after a reboot. Planet itself carries on; the LAN kiosk is unaffected.

---

## State file template — `frontdoor/state/garcks-pc.md`

```markdown
# Garcks-PC — front door state

*Written by PC Claude only (CLAUDE.md rule 16). Newest entry first.*

## <date, time> — installed from commit <short hash>

**Before.** planet.service <active?>; listeners <…>; nginx/cloudflared before <versions or none>; ~/.cloudflared <names>; the quick tunnel was started by <…>; groups <…>.
**Door (step 3).** nginx <version>; `nginx -t`: <the two lines>; listeners after: <…>; the eight curl checks: <each result>.
**Tunnel (steps 4–5).** cloudflared <version>; TUNNEL_ID <id>; ingress validate <…>; service <active?>; connections registered <n>.
**Public (step 6).** DNS route <created?>; the two public fetches: <status, cf-cache-status each>.
**cert.pem (step 7).** deleted <yes/no>; ~/.cloudflared now <names>.
**Quick tunnel (step 8).** <how it was stopped; what used to start it; pgrep after; PolicyRAG on :8000 after>.
**For laptop Claude.** <anything to change in the repo, the secrets map, or the queues — or "nothing">.

## The gate
<door-rate.sh output, with the time, when asked>
```
