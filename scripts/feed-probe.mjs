#!/usr/bin/env node
/*
 * feed-probe.mjs — the jump count: asks a planet for its pictures the way the viewer does and counts what would show as a jump.
 * In:  seconds (default 180) and an address (default the public planet; the door itself through a private line also works).
 * Out: how many new pictures came, the pauses over 1.5 s, the pictures that skipped a tick, and the old pictures handed out again.
 * Decision: W16-a (Jamie, 1 Oct 2026): the jumps are cured by pictures asked for by their tick (Planet item 23); this is the number
 *   that says so, taken before and after. It measures only; it becomes a line of check-public.sh when item 23 is public.
 * Built in W16 — the jumps and the pulse (1 Oct 2026). Before, public: 9 pauses, 18 skipped, 20 old in 180 s; the door alone: 0, 0, 0.
 */
import { tickChange } from "../site/public/js/tick.js";

const [SECS = "180", BASE = "https://planet.anjaneyaworkshop.co.uk"] = process.argv.slice(2);
const POLL_MS = 125;       // the viewer's own pace of asking /api/meta (Planet's viewer.js, POLL_MS)
const PAUSE_MS = 1500;     // a wait for a new picture longer than this is counted as a pause
// Cloudflare refuses Node's own user agent (403), so the probe names a browser and itself.
const headers = { "User-Agent": "Mozilla/5.0 (feed-probe, anjaneyaworkshop)", "Accept-Encoding": "gzip" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// One ask as the viewer makes it: meta first; if it names a tick not yet shown, the packed picture straight after.
// Returns the picture's tick, or null when meta had nothing new.
async function ask(state) {
  const meta = await (await fetch(BASE + "/api/meta", { headers, cache: "no-store" })).json();
  state.seen = Math.max(state.seen, meta.tick);
  if (state.seen <= state.shown) return null;
  const reply = await fetch(BASE + "/api/packed/elevation_m", { headers, cache: "no-store" });
  await reply.arrayBuffer();
  if (!reply.ok) throw new Error(`/api/packed/elevation_m answered ${reply.status}`);
  return Number(reply.headers.get("x-planet-tick"));
}

// Counts one picture: new (with how long since the last and how many ticks it carried) or old.
// A lower tick is a restart (CLAUDE.md rule 12, the page's own tick.js): the count starts again from it, and it is no jump.
function count(state, tick, now) {
  const change = tickChange(state.shown < 0 ? null : state.shown, tick);
  if (change === "same") { state.old++; return; }
  if (change === "restarted") { state.restarts++; state.seen = tick; }
  if (change === "advanced") {
    state.gaps.push(Math.round(now - state.lastAt));
    state.carried[tick - state.shown] = (state.carried[tick - state.shown] || 0) + 1;
  }
  state.shown = tick; state.seen = Math.max(state.seen, tick); state.lastAt = now;
}

const state = { seen: -1, shown: -1, lastAt: 0, gaps: [], carried: {}, old: 0, restarts: 0, failed: 0 };
const start = performance.now();
while (performance.now() - start < Number(SECS) * 1000) {
  const sent = performance.now();
  try {
    const tick = await ask(state);
    if (tick !== null) count(state, tick, performance.now());
  } catch (error) { state.failed++; console.warn(`feed-probe: an ask failed (${error.message})`); }
  const wait = POLL_MS - (performance.now() - sent);
  if (wait > 0) await sleep(wait);
}

const sorted = [...state.gaps].sort((a, b) => a - b);
const pauses = state.gaps.filter((g) => g > PAUSE_MS);
const skipped = Object.entries(state.carried).filter(([ticks]) => Number(ticks) > 1).reduce((n, [, times]) => n + times, 0);
console.log(`${BASE}, ${SECS} s: ${state.gaps.length} new pictures, one every ${sorted[sorted.length >> 1] ?? "?"} ms (median), the longest wait ${sorted.at(-1) ?? "?"} ms`);
console.log(`  pauses over ${PAUSE_MS} ms: ${pauses.length}${pauses.length ? ` (${pauses.join(", ")} ms)` : ""}`);
console.log(`  pictures that skipped a tick: ${skipped} (ticks carried: ${JSON.stringify(state.carried)})`);
console.log(`  old pictures handed out again: ${state.old}; restarts seen: ${state.restarts}; asks that failed: ${state.failed}`);
