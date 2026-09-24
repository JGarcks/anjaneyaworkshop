/*
 * planet.js — the one address the landing page talks to beyond itself: the planet, through its front door.
 * In:  nothing.
 * Out: the planet's origin, and the viewer's address for a given zoom.
 * Decision: one constant, so the page's script, its links and its security header can be tested against the same address.
 * Built in W3 — the landing page (24 Sep 2026).
 */
export const PLANET = "https://planet.anjaneyaworkshop.co.uk";

// ?embed asks for the quiet viewer (Planet request, W3 decision 1A); until Planet has it, the viewer ignores the word.
export function viewerAddress(zoom) {
  return PLANET + "/?embed&zoom=" + zoom.toFixed(3);
}
