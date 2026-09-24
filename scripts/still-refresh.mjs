#!/usr/bin/env node
/*
 * still-refresh.mjs — takes the landing page's still: the planet as the public viewer draws it, saved into site/public/still/.
 * In:  the public viewer at ?still&zoom=0.9 (through the front door), and a Chromium browser — Edge or Chrome found here, or named in BROWSER.
 * Out: site/public/still/planet.webp (1200×1200, the globe 1080 wide) and planet.json (when, the tick, the key numbers, the zoom);
 *      exit 1 with the reason in plain words if anything failed, leaving the old still in place.
 * Decision: no libraries — it drives the browser over the browser's own debugging protocol, so the daily GitHub Action
 *   (W3 decision 5) needs nothing installed but the browser. STILL_RESOLVE=<ip> pins the planet's address (the held BT leftover).
 * Built in W3 — the landing page (24 Sep 2026).
 */
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const PLANET = "https://planet.anjaneyaworkshop.co.uk";
const SIZE = 1200;          // the picture is square; the page scales it to the globe it covers
const ZOOM = 0.9;           // the viewer's globe is ZOOM × SIZE wide; the page reads this from planet.json
const URL_ = `${PLANET}/?still&zoom=${ZOOM}`;
const OUT = fileURLToPath(new URL("../site/public/still/", import.meta.url));

const candidates = [
  process.env.BROWSER,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/microsoft-edge",
].filter(Boolean);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function until(what, ms, test) {
  const end = Date.now() + ms;
  for (;;) {
    const got = await test();
    if (got) return got;
    if (Date.now() > end) throw new Error(`gave up waiting for ${what} after ${ms / 1000} s`);
    await sleep(250);
  }
}

// One page, spoken to over the DevTools protocol: send() returns the reply; once() waits for an event.
function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let next = 1;
  const replies = new Map(), waiters = [];
  ws.onmessage = ({ data }) => {
    const m = JSON.parse(data);
    if (m.id && replies.has(m.id)) {
      const { resolve, reject } = replies.get(m.id);
      replies.delete(m.id);
      m.error ? reject(new Error(`${m.error.message} (${m.error.code})`)) : resolve(m.result);
    } else if (m.method) {
      for (const w of waiters.filter((w) => w.method === m.method)) { waiters.splice(waiters.indexOf(w), 1); w.resolve(m.params); }
    }
  };
  return new Promise((ready, fail) => {
    ws.onerror = () => fail(new Error("could not talk to the browser"));
    ws.onopen = () => ready({
      send: (method, params = {}) => new Promise((resolve, reject) => {
        const id = next++;
        replies.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      }),
      once: (method) => new Promise((resolve) => waiters.push({ method, resolve })),
      close: () => ws.close(),
    });
  });
}

async function main() {
  const browser = candidates.find((path) => existsSync(path));
  if (!browser) throw new Error("no Edge or Chrome found; name one in BROWSER");
  const profile = mkdtempSync(join(tmpdir(), "still-"));
  const args = [
    "--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--no-first-run",
    "--no-default-browser-check", "--hide-scrollbars", "--mute-audio", "--enable-unsafe-swiftshader",
    `--window-size=${SIZE},${SIZE}`, "about:blank",
  ];
  if (process.env.STILL_RESOLVE) args.push(`--host-resolver-rules=MAP ${new URL(PLANET).host} ${process.env.STILL_RESOLVE}`);
  const child = spawn(browser, args, { stdio: "ignore" });
  let page;
  try {
    const port = await until("the browser to start", 20_000, () => {
      const file = join(profile, "DevToolsActivePort");
      return existsSync(file) && readFileSync(file, "utf8").split("\n")[0].trim();
    });
    const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    const target = targets.find((t) => t.type === "page");
    if (!target) throw new Error("the browser opened no page");
    page = await connect(target.webSocketDebuggerUrl);

    await page.send("Emulation.setDeviceMetricsOverride", { width: SIZE, height: SIZE, deviceScaleFactor: 1, mobile: false });
    await page.send("Page.enable");
    const loaded = page.once("Page.loadEventFired");
    const nav = await page.send("Page.navigate", { url: URL_ });
    if (nav.errorText) throw new Error(`the viewer did not load: ${nav.errorText}`);
    await Promise.race([loaded, sleep(90_000).then(() => { throw new Error("the viewer took over 90 s to load"); })]);

    // ?still swaps the drawing for an <img> once everything is in; the viewer shows #error if it could not start.
    const evaluate = async (expression) =>
      (await page.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result.value;
    await until("the viewer's finished picture", 30_000, async () => {
      const state = await evaluate(`(() => {
        const e = document.getElementById('error');
        if (e && getComputedStyle(e).display !== 'none') return 'error: ' + e.textContent;
        const img = document.querySelector('img');
        return img && img.complete && img.naturalWidth > 0 ? 'ready' : '';
      })()`);
      if (state.startsWith("error")) throw new Error(`the viewer said: ${state.slice(7)}`);
      return state === "ready";
    });
    // The viewer's corner buttons are page furniture, not the planet: hidden in this headless copy only.
    await evaluate(`for (const id of ['toggle-panel', 'toggle-events', 'controls', 'inspect', 'events']) {
      const e = document.getElementById(id); if (e) e.style.display = 'none';
    }`);
    const meta = await evaluate(`fetch('/api/meta').then((r) => r.json())`);
    const shot = await page.send("Page.captureScreenshot", { format: "webp", quality: 85 });

    mkdirSync(OUT, { recursive: true });
    writeFileSync(join(OUT, "planet.webp"), Buffer.from(shot.data, "base64"));
    const record = { takenAt: new Date().toISOString(), tick: meta.tick, year: meta.year, key_numbers: meta.key_numbers, zoom: ZOOM, size: SIZE };
    writeFileSync(join(OUT, "planet.json"), JSON.stringify(record, null, 2) + "\n");
    console.log(`still taken at tick ${meta.tick}: ${Math.round(Buffer.from(shot.data, "base64").length / 1024)} KB → site/public/still/`);
  } finally {
    // Close the browser and wait for it to go, or Windows keeps its profile folder locked.
    const gone = new Promise((r) => child.once("exit", r));
    try { await page?.send("Browser.close"); } catch { child.kill(); }
    page?.close();
    await Promise.race([gone, sleep(10_000)]);
    try {
      rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
    } catch (error) {
      console.warn(`still-refresh: the still is saved, but the browser's scratch folder ${profile} was left behind (${error.code}).`);
    }
  }
}

main().catch((error) => {
  console.error(`still-refresh: no new still — ${error.message}. The old still stays in place.`);
  process.exit(1);
});
