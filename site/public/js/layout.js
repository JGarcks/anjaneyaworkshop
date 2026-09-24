/*
 * layout.js — where the globe, the framed viewer and the words go, for any screen size.
 * In:  the screen's width and height in CSS pixels.
 * Out: the globe's centre and width, the frame's box (larger than the screen), the viewer's ?zoom=, and where the words start.
 * Decision: the viewer fills the screen behind everything (Jamie, W3 decision 2); since it centres the globe and sizes it
 *   to its own height (width = zoom × height), the page sets the frame's box and the zoom so the globe lands where it chooses.
 * Built in W3 — the landing page (24 Sep 2026).
 */
export const SIDE = 16;     // the gutter at the screen's sides
export const TOP = 56;      // the band the name sits in
export const GAP = 20;      // between the globe and the words
export const TEXT = 80;     // the live line, the status note and the links
export const CROP = 56;     // how far the frame runs past every edge: hides the viewer's corner buttons until Planet's ?embed (W3 decision 1A)
export const MOST = 0.78;   // the globe's width at most, as a share of the screen's height
export const LEAST = 120;   // the globe's width at least, on the smallest screens

export function layout(width, height) {
  const fits = Math.min(width - 2 * SIDE, height - TOP - GAP - TEXT - SIDE, MOST * height);
  const d = Math.max(LEAST, Math.round(fits));
  // The globe and the words as one block, centred on the screen, but never up into the name's band.
  const blockTop = Math.max(TOP, Math.round((height - (d + GAP + TEXT)) / 2));
  const x = width / 2;
  const y = blockTop + d / 2;
  // The frame is centred on the globe and reaches CROP past the screen's nearer and further edges alike.
  const half = Math.max(y, height - y) + CROP;
  const frame = { left: -CROP, top: Math.round(y - half), width: width + 2 * CROP, height: Math.round(2 * half) };
  return { globe: { x, y, d }, frame, zoom: d / frame.height, textTop: Math.round(y + d / 2 + GAP) };
}
