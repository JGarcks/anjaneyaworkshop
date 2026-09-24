/*
 * tick.js — the restart rule (CLAUDE.md rule 12), as one small function the page imports.
 * In:  the last X-Planet-Tick this page saw (null before the first), and the tick that just arrived.
 * Out: "first", "same", "advanced" or "restarted".
 * Decision: a lower tick is a restart, never an error — Planet resumes from its last save and replays up to 500 ticks.
 * Built in W1 — Ground (24 Sep 2026); the landing page starts using it in Phase 2.
 */
export function tickChange(lastSeen, next) {
  if (lastSeen === null) return "first";
  if (next < lastSeen) return "restarted";
  if (next === lastSeen) return "same";
  return "advanced";
}
