/*
 * planet.js — the one address the landing page talks to beyond itself: the planet, through its front door.
 * In:  nothing.
 * Out: the planet's origin, the hub's own (the only one the viewer takes a zoom from), and the viewer's address for a given zoom.
 * Decision: one constant, so the page's script, its links and its security header can be tested against the same address.
 * Built in W3 — the landing page (24 Sep 2026).
 */
export const PLANET = "https://planet.anjaneyaworkshop.co.uk";
export const HUB = "https://anjaneyaworkshop.co.uk";   // Planet's viewer takes { planet: 'zoom' } from this origin only (its EMBED_PARENT)

// ?embed asks for the quiet viewer (Planet request, W3 decision 1A; live 24 Sep, WEB · D5).
export function viewerAddress(zoom) {
  return PLANET + "/?embed&zoom=" + zoom.toFixed(3);
}
