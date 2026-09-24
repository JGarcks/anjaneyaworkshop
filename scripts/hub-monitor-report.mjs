#!/usr/bin/env node
/*
 * hub-monitor-report.mjs — reads hub-monitor.mjs's log: when the viewer could draw a new picture, the pauses, and what the wire did in each.
 * In:  the JSON log (default run5min.json).
 * Out: pictures (moments all four fields — elevation and the three river fields — share a new tick), the gaps between them,
 *      every gap over 3 s with the ticks each field saw and the edge/door cache status, request latency, failures, the hub's state.
 * Decision: a "picture" is rebuilt from the replies the way the viewer's fetchOneTick needs it (Planet WEB · D3: one tick for all four);
 *   it measures what reaches the viewer, not the glide it draws from them.
 * Built in W4 — Phase 2 continued (24 Sep 2026).
 */
import { readFileSync } from "node:fs";
const d = JSON.parse(readFileSync(process.argv[2] || "run5min.json", "utf8"));
const FIELDS = ["elevation_m", "drainage_km2", "downstream_cell", "lake_depth_m"];
const fields = d.done.filter((r) => r.url.startsWith("/api/field/")).map((r) => ({ ...r, name: r.url.slice(11).replace(/\?.*/, "") }))
  .sort((a, b) => (a.end ?? a.sent) - (b.end ?? b.sent));
const q = (xs, p) => { const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
const s1 = (ms) => (ms / 1000).toFixed(1);

// 1. Pictures: the moments all four latest replies share a tick not shown before.
const latest = {}; const pictures = [];
for (const r of fields) {
  if (r.failed || r.status !== 200) continue;
  latest[r.name] = r.tick;
  const ts = FIELDS.map((f) => latest[f]);
  if (ts.every((t) => t !== undefined && t === ts[0]) && (pictures.length === 0 || pictures.at(-1).tick !== ts[0])) pictures.push({ t: r.end, tick: ts[0] });
}
const gaps = pictures.slice(1).map((p, i) => ({ from: pictures[i], to: p, ms: p.t - pictures[i].t, ticks: p.tick - pictures[i].tick }));
console.log(`run: ${s1(d.states.at(-1)?.t ?? 0)} s; field replies ${fields.length}; new matching pictures ${pictures.length}`);
console.log(`gap between pictures (ms): median ${q(gaps.map((g) => g.ms), 0.5)}, p90 ${q(gaps.map((g) => g.ms), 0.9)}, max ${Math.max(...gaps.map((g) => g.ms))}`);
const hist = {}; for (const g of gaps) { const b = g.ms < 1500 ? "<1.5 s" : g.ms < 2500 ? "1.5–2.5 s" : g.ms < 3000 ? "2.5–3 s" : g.ms < 4000 ? "3–4 s" : g.ms < 6000 ? "4–6 s" : "6 s+"; hist[b] = (hist[b] || 0) + 1; }
console.log("gaps by size:", JSON.stringify(hist));

// 2. The engine's own pace: ticks per second between pictures (should be ~2.5).
const rates = gaps.map((g) => g.ticks / (g.ms / 1000));
console.log(`engine pace seen (ticks/s between pictures): median ${q(rates, 0.5)?.toFixed(2)}, min ${Math.min(...rates).toFixed(2)}`);

// 3. Every pause over 3 s, and what the wire did in it.
const long = gaps.filter((g) => g.ms > 3000);
console.log(`\npauses over 3 s: ${long.length}`);
for (const g of long) {
  const inside = fields.filter((r) => r.sent >= g.from.t && r.sent <= g.to.t);
  const ticksSeen = {}; for (const r of inside) (ticksSeen[r.name] ??= []).push(r.tick);
  const slow = inside.filter((r) => r.end - r.sent > 1000).map((r) => `${r.name} ${r.end - r.sent} ms`);
  const bad = inside.filter((r) => r.failed || r.status !== 200).map((r) => `${r.name} ${r.failed || r.status}`);
  const edge = {}; for (const r of inside) edge[`${r.edge}/${r.door}`] = (edge[`${r.edge}/${r.door}`] || 0) + 1;
  console.log(`- ${s1(g.from.t)}→${s1(g.to.t)} s: ${g.ms} ms, tick ${g.from.tick}→${g.to.tick} (+${g.ticks}); ${inside.length} field asks; edge/door ${JSON.stringify(edge)}`);
  console.log(`    ticks each field saw: ${FIELDS.map((f) => `${f.split("_")[0]} ${[...new Set(ticksSeen[f] || [])].join(",")}`).join(" | ")}`);
  if (slow.length) console.log(`    slow: ${slow.join("; ")}`);
  if (bad.length) console.log(`    failed: ${bad.join("; ")}`);
}

// 4. Everything else: latency, failures, the hub's own state, console.
const lat = fields.filter((r) => r.end).map((r) => r.end - r.sent);
console.log(`\nfield latency ms: median ${q(lat, 0.5)}, p95 ${q(lat, 0.95)}, max ${Math.max(...lat)}`);
const metas = d.done.filter((r) => r.url.startsWith("/api/meta"));
const mlat = metas.filter((r) => r.end).map((r) => r.end - r.sent);
console.log(`meta asks ${metas.length}: latency median ${q(mlat, 0.5)}, p95 ${q(mlat, 0.95)}, max ${Math.max(...mlat)}; not 200: ${metas.filter((r) => r.failed || r.status !== 200).length}`);
console.log(`non-200 or failed anywhere: ${JSON.stringify(d.done.filter((r) => r.failed || r.status !== 200).map((r) => `${s1(r.sent)}s ${r.url} ${r.failed || r.status}`))}`);
const st = {}; for (const s of d.states) { const k = `${s.frame || "-"}|${s.status || ""}|hidden:${s.hidden}`; st[k] = (st[k] || 0) + 1; }
console.log("hub state each second:", JSON.stringify(st));
console.log("console:", JSON.stringify(d.console.slice(0, 10)));
