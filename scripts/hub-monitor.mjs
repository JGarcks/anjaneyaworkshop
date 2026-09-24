#!/usr/bin/env node
/*
 * hub-monitor.mjs — watches the public hub in headless Edge: every /api/ request from the page and the framed viewer, and the page's state each second.
 * In:  seconds, an output file (default monitor.json), width and height (default 1440 900), and "mobile" for a phone.
 * Out: the JSON log (requests with send/finish times, status, tick, edge and door cache status; the frame's console; the hub's state),
 *      a line printed at every change of state, and a screenshot whenever a note ("last seen", "resumed") appears.
 * Decision: measured as a visitor sees it, from outside, so the viewer's pauses can be told apart from the house, the tunnel and
 *   Cloudflare (W4: 7 stalls of 3.1–3.5 s and one 14 s freeze in 5 minutes). Read it with hub-monitor-report.mjs.
 * Built in W4 — Phase 2 continued (24 Sep 2026). Needs Edge at its usual Windows path.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const [SECS = "300", OUT = "monitor.json", W = "1440", H = "900", MOBILE = ""] = process.argv.slice(2);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const profile = mkdtempSync(join(tmpdir(), "mon-"));
const child = spawn("C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", ["--headless=new", "--remote-debugging-port=0",
  `--user-data-dir=${profile}`, "--no-first-run", "--enable-unsafe-swiftshader", "--window-size=1440,900", "about:blank"], { stdio: "ignore" });
let port; for (let i = 0; i < 80 && !port; i++) { await sleep(250); const f = join(profile, "DevToolsActivePort"); if (existsSync(f)) port = readFileSync(f, "utf8").split("\n")[0].trim(); }
const ws = new WebSocket((await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()).webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
const send = (method, params = {}, sessionId) => new Promise((resolve) => { const i = ++id; pending.set(i, resolve); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
const t0 = Date.now(); const now = () => Date.now() - t0;
const reqs = new Map(); const done = []; const consoleLines = []; const states = [];
const attached = new Set();
ws.onmessage = async ({ data }) => {
  const m = JSON.parse(data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); return; }
  const s = m.sessionId;
  if (m.method === "Target.attachedToTarget") {
    const ns = m.params.sessionId;
    if (attached.has(m.params.targetInfo.targetId)) return; attached.add(m.params.targetInfo.targetId);
    await send("Network.enable", {}, ns); await send("Runtime.enable", {}, ns);
    await send("Target.setAutoAttach", { autoAttach: true, waitForDebuggerOnStart: true, flatten: true }, ns);
    await send("Runtime.runIfWaitingForDebugger", {}, ns);
    return;
  }
  const key = (rid) => s + "/" + rid;
  if (m.method === "Network.requestWillBeSent" && m.params.request.url.includes("/api/")) {
    reqs.set(key(m.params.requestId), { url: m.params.request.url.replace(/^https:\/\/([^/]+)/, (_, h) => (h.startsWith("planet") ? "" : h)), sent: now() });
  }
  if (m.method === "Network.responseReceived" && reqs.has(key(m.params.requestId))) {
    const r = reqs.get(key(m.params.requestId)); const h = Object.fromEntries(Object.entries(m.params.response.headers).map(([k, v]) => [k.toLowerCase(), v]));
    Object.assign(r, { status: m.params.response.status, tick: h["x-planet-tick"] ? Number(h["x-planet-tick"]) : null, edge: h["cf-cache-status"], door: h["x-cache-status"], headersAt: now() });
  }
  if (m.method === "Network.loadingFinished" && reqs.has(key(m.params.requestId))) { const r = reqs.get(key(m.params.requestId)); r.end = now(); r.bytes = m.params.encodedDataLength; done.push(r); reqs.delete(key(m.params.requestId)); }
  if (m.method === "Network.loadingFailed" && reqs.has(key(m.params.requestId))) { const r = reqs.get(key(m.params.requestId)); r.end = now(); r.failed = m.params.errorText; done.push(r); reqs.delete(key(m.params.requestId)); }
  if (m.method === "Runtime.consoleAPICalled") consoleLines.push({ t: now(), type: m.params.type, text: m.params.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 300) });
  if (m.method === "Runtime.exceptionThrown") consoleLines.push({ t: now(), type: "exception", text: (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text).slice(0, 300) });
};
const { targetId } = await send("Target.createTarget", { url: "about:blank" });
await sleep(800);
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });

attached.add(targetId);
await send("Emulation.setDeviceMetricsOverride", { width: Number(W), height: Number(H), deviceScaleFactor: MOBILE ? 2 : 1, mobile: !!MOBILE }, sessionId);
await send("Network.enable", {}, sessionId); await send("Runtime.enable", {}, sessionId); await send("Page.enable", {}, sessionId);
await send("Target.setAutoAttach", { autoAttach: true, waitForDebuggerOnStart: true, flatten: true }, sessionId);
console.log("navigate", JSON.stringify(await send("Page.navigate", { url: "https://anjaneyaworkshop.co.uk/" }, sessionId)));
const end = Date.now() + Number(SECS) * 1000;
while (Date.now() < end) {
  await sleep(1000);
  const r = await send("Runtime.evaluate", { expression: `({ frame: document.getElementById('planet')?.className, status: document.getElementById('status')?.textContent, line: document.getElementById('line')?.textContent, hidden: document.hidden })`, returnByValue: true }, sessionId);
  const v = r?.result?.value || {}; const prev = states.at(-1);
  states.push({ t: now(), ...v });
  const sig = (x) => `${x?.frame}|${x?.status}`;
  if (prev && sig(prev) !== sig(v)) {
    console.log(`${new Date().toISOString().slice(11, 19)} UTC  ${(now() / 1000).toFixed(0)} s  frame=${v.frame || "-"} note="${v.status || ""}"  ${v.line || ""}`);
    if (v.status) { const shot = await send("Page.captureScreenshot", { format: "png" }, sessionId); writeFileSync(OUT.replace(".json", `-${Math.round(now() / 1000)}s.png`), Buffer.from(shot.data, "base64")); }
  }
}
writeFileSync(OUT, JSON.stringify({ done, console: consoleLines, states }, null, 1));
console.log(`saved ${done.length} requests, ${consoleLines.length} console lines, ${states.length} states → ${OUT}`);
try { await send("Browser.close"); } catch {} ws.close(); process.exit(0);
