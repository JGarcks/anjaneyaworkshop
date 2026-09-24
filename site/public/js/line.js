/*
 * line.js — the words under the globe: the live line, and the "last seen" note when the house is offline.
 * In:  Planet's /api/meta reply (year, key_numbers), or a moment in time and the visitor's clock.
 * Out: "1.4731 billion years · 34% land · highest peak 2,905 m", or "last seen at 18:42".
 * Decision: the age in billions to four decimals, so its last digit turns with every picture (Jamie, W3 decision 3).
 * Built in W3 — the landing page (24 Sep 2026).
 */
const numbers = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });

export function formatAge(years) {
  return (years / 1e9).toFixed(4) + " billion years";
}

// Any part Planet does not send is left out rather than guessed.
export function formatLine(meta) {
  const parts = [formatAge(meta.year)];
  const key = meta.key_numbers ?? {};
  if (Number.isFinite(key.land_share)) parts.push(Math.round(key.land_share * 100) + "% land");
  if (Number.isFinite(key.highest_peak_m)) parts.push("highest peak " + numbers.format(key.highest_peak_m) + " m");
  return parts.join(" · ");
}

// The time alone on the same day, the date too on any other; in the visitor's own time zone
// unless a test names one.
export function formatLastSeen(when, now, timeZone) {
  const day = new Intl.DateTimeFormat("en-GB", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" });
  const time = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" }).format(when);
  if (day.format(when) === day.format(now)) return "last seen at " + time;
  const date = new Intl.DateTimeFormat("en-GB", { timeZone, day: "numeric", month: "short" }).format(when);
  return "last seen " + date + ", " + time;
}
