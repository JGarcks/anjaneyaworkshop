/*
 * layout.js — where the globe, the framed viewer and the words go, for any screen size.
 * In:  the screen's width and height in CSS pixels.
 * Out: the globe's centre and width, the frame's box (larger than the screen), and the viewer's ?zoom=.
 * Decision: the viewer fills the screen behind everything (Jamie, W3 decision 2); since it centres the globe and sizes it
 *   to its own height (width = zoom × height), the page sets the frame's box and the zoom so the globe lands where it chooses:
 *   centred between the name at the top and the words at the very bottom (Jamie, W3, on seeing the first layout).
 * Built in W3 — the landing page (24 Sep 2026).
 */
export const SIDE = 16;     // the gutter at the screen's sides
export const TOP = 56;      // the band the name sits in
export const GAP = 20;      // at least this between the globe and the words
export const TEXT = 88;     // the live line, the status note and the links (style.css #words)
export const BOTTOM = 12;   // the words' distance from the screen's bottom edge (style.css #words)
export const CROP = 56;     // how far the frame runs past every edge: hides the viewer's corner buttons until Planet's ?embed (W3 decision 1A)
export const MOST = 0.78;   // the globe's width at most, as a share of the screen's height
export const LEAST = 120;   // the globe's width at least, on the smallest screens

export function layout(width, height) {
  // The globe gets the band between the name and the words, and sits in its middle.
  const bandTop = TOP, bandBottom = height - BOTTOM - TEXT - GAP;
  const fits = Math.min(width - 2 * SIDE, bandBottom - bandTop, MOST * height);
  const d = Math.max(LEAST, Math.round(fits));
  const x = width / 2;
  const y = Math.round((bandTop + bandBottom) / 2);
  // The frame is centred on the globe and reaches CROP past the screen's nearer and further edges alike.
  const half = Math.max(y, height - y) + CROP;
  const frame = { left: -CROP, top: Math.round(y - half), width: width + 2 * CROP, height: Math.round(2 * half) };
  return { globe: { x, y, d }, frame, zoom: d / frame.height, textTop: height - BOTTOM - TEXT };
}
