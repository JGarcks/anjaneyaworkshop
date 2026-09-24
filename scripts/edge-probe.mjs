#!/usr/bin/env node
/*
 * edge-probe.mjs — how often a visitor gets a new picture: asks Cloudflare for one planet address ten times a second and reads its replies.
 * In:  a path (default /api/field/elevation_m; fields carry X-Planet-Tick, meta does not), seconds (default 60), ms between asks (default 100).
 * Out: how often the tick changed (the picture a visitor sees), how often Cloudflare refreshed its copy, and for each refresh
 *      whether the door answered from its own hold (X-Cache-Status) and brought a new tick or the same one.
 * Decision: measured from outside, as a visitor sees it, so it needs nothing on Garcks-PC; it found the door's whole-second hold
 *   repeating a third of Cloudflare's refreshes (W4-e), and re-measures after any change to the door or at the WS · D13 round.
 * Built in W4 — Phase 2 continued (24 Sep 2026). From PowerShell (Git Bash rewrites a leading "/" into a Windows path).
 */
const [path = "/api/field/elevation_m", SECS = "60", INT = "100"] = process.argv.slice(2);
const URL_ = "https://planet.anjaneyaworkshop.co.uk" + path;
const rows = [];
const t0 = Date.now();
while (Date.now() - t0 < Number(SECS) * 1000) {
  const sent = Date.now();
  try {
    const r = await fetch(URL_, { headers: { "Accept-Encoding": "gzip" }, cache: "no-store" });
    await r.arrayBuffer();
    rows.push({ t: sent - t0, edge: r.headers.get("cf-cache-status"), door: r.headers.get("x-cache-status"),
      tick: Number(r.headers.get("x-planet-tick")), colo: (r.headers.get("cf-ray") || "").split("-")[1] });
  } catch (error) { rows.push({ t: sent - t0, error: error.message }); }
  const wait = Number(INT) - (Date.now() - sent);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
}

const ok = rows.filter((r) => !r.error);
const tally = (list, key) => list.reduce((m, r) => ((m[key(r)] = (m[key(r)] || 0) + 1), m), {});
const spread = (xs) => { const s = [...xs].sort((a, b) => a - b); const q = (p) => s[Math.floor(p * (s.length - 1))];
  return s.length ? `median ${q(0.5)} ms, p90 ${q(0.9)}, min ${s[0]}, max ${s.at(-1)} (mean ${Math.round(s.reduce((a, b) => a + b, 0) / s.length)})` : "none"; };

// A new picture: the tick a visitor reads changed since the reply before.
const changes = ok.filter((r, i) => i > 0 && r.tick !== ok[i - 1].tick);
// A refresh: Cloudflare went to the door rather than answer from its copy.
const refreshes = ok.filter((r) => r.edge !== "HIT");
const byDoor = tally(refreshes.slice(1), (r) => `door ${r.door}: ${r.tick !== refreshes[refreshes.indexOf(r) - 1].tick ? "new tick" : "same tick"}`);

console.log(`${path}, ${SECS} s, an ask every ${INT} ms: ${ok.length} replies, ${rows.length - ok.length} errors; Cloudflare location ${JSON.stringify(tally(ok, (r) => r.colo))}`);
console.log(`Cloudflare's answers: ${JSON.stringify(tally(ok, (r) => r.edge))}`);
console.log(`new picture ${changes.length} times: ${spread(changes.slice(1).map((c, i) => c.t - changes[i].t))}`);
console.log(`  ticks per new picture: ${JSON.stringify(tally(changes, (c) => c.tick - ok[ok.indexOf(c) - 1].tick))}`);
console.log(`Cloudflare refreshed ${refreshes.length} times: ${spread(refreshes.slice(1).map((r, i) => r.t - refreshes[i].t))}`);
console.log(`  each refresh, by the door's answer: ${JSON.stringify(byDoor)}`);
