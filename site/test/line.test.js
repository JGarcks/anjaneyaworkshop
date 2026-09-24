/*
 * line.test.js — the live line's wording and the "last seen" note.
 * In:  formatAge, formatLine and formatLastSeen from public/js/line.js, fed Planet's real meta shape.
 * Out: pass or fail; `npm test` runs it, and so does every Pages deploy.
 * Decision: times are tested in UTC so the tests read the same on any machine; the page uses the visitor's own zone.
 * Built in W3 — the landing page (24 Sep 2026).
 */
import { expect, it } from "vitest";
import { formatAge, formatLine, formatLastSeen } from "../public/js/line.js";

const meta = {
  tick: 14731, year: 1473100000.0,
  key_numbers: { land_share: 0.33546559673141374, continent_share: 0.37558877374307603, highest_peak_m: 2905.142333984375 },
};

it("the live line reads age in billions to four decimals, land share and highest peak", () => {
  expect(formatLine(meta)).toBe("1.4731 billion years · 34% land · highest peak 2,905 m");
});

it("the age's last digit moves with each tick of 100,000 years", () => {
  expect(formatAge(1473100000)).not.toBe(formatAge(1473200000));
});

it("a young planet after a restart from year zero still reads in billions", () => {
  expect(formatAge(42_100_000)).toBe("0.0421 billion years");
});

it("a peak over ten thousand metres gets its thousands separator", () => {
  expect(formatLine({ ...meta, key_numbers: { land_share: 0.5, highest_peak_m: 12345.6 } }))
    .toBe("1.4731 billion years · 50% land · highest peak 12,346 m");
});

it("a key number Planet does not send is left out, not shown as nonsense", () => {
  expect(formatLine({ year: 1473100000 })).toBe("1.4731 billion years");
});

it("last seen today shows the time alone", () => {
  expect(formatLastSeen(new Date("2026-09-24T17:42:00Z"), new Date("2026-09-24T18:10:00Z"), "UTC"))
    .toBe("last seen at 17:42");
});

it("last seen on an earlier day shows the date too", () => {
  expect(formatLastSeen(new Date("2026-09-23T17:42:00Z"), new Date("2026-09-24T09:00:00Z"), "UTC"))
    .toBe("last seen 23 Sept, 17:42");
});
