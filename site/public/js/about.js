/*
 * about.js — whether the About panel's words are true of the planet now on show.
 * In:  Planet's /api/meta reply (radius_km, changed_numbers).
 * Out: true when the public planet is the size of Earth and was born as ocean; false for any other planet, or a reply without those facts.
 * Decision: the About link shows only while its words are true (W14-d), as a room's link shows only when the room exists (W4-a);
 *   so the words can never outlive the planet they describe, and the page needs no release of its own when the planet changes.
 * Built in W15 — the full-size ocean planet goes public (29 Sep 2026).
 */
export const EARTH_RADIUS_KM = 6371;
// Born as ocean: Planet's ocean settings give a thousandth of the planet as land at birth (its FS · D30); today's planets are born
// with 30%. Anything up to a hundredth counts, so a slightly different ocean planet still does.
export const MOST_LAND_AT_BIRTH = 0.01;

export function landAtBirth(meta) {
  const numbers = Array.isArray(meta?.changed_numbers) ? meta.changed_numbers : [];
  for (const entry of numbers) {
    const found = /^\s*first_land_share\s*=\s*([0-9.eE+-]+)\s*$/.exec(String(entry));
    if (found && Number.isFinite(Number(found[1]))) return Number(found[1]);
  }
  return null;   // not said: the planet was born on today's numbers, with its continents drawn in
}

export function aboutHolds(meta) {
  if (!meta || !Number.isFinite(meta.radius_km)) return false;
  const born = landAtBirth(meta);
  return Math.round(meta.radius_km) === EARTH_RADIUS_KM && born !== null && born <= MOST_LAND_AT_BIRTH;
}

// Why the link is hidden, for the console (rule 10: nothing silent).
export function whyNot(meta) {
  if (!meta || !Number.isFinite(meta.radius_km)) return "the planet has not said its size";
  if (Math.round(meta.radius_km) !== EARTH_RADIUS_KM) return `the planet on show has a radius of ${Math.round(meta.radius_km)} km, not Earth's ${EARTH_RADIUS_KM}`;
  const born = landAtBirth(meta);
  if (born === null) return "the planet on show was born with its continents, not as ocean";
  return `the planet on show was born with ${born * 100}% land, more than an ocean planet's`;
}
