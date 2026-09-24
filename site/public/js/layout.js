/*
 * layout.js — where the globe, the framed viewer and the words go, for any screen size.
 * In:  the screen's width and height in CSS pixels.
 * Out: the globe's centre and width, the frame's box (larger than the screen), the viewer's ?zoom=, and whether a new shape needs a reload.
 * Decision: the viewer fills the screen behind everything (Jamie, W3 decision 2); since it centres the globe and sizes it
 *   to its own height (width = zoom × height), the page sets the frame's box and the zoom so the globe lands where it chooses:
 *   centred between the name and rooms at the top and the line at the very bottom (Jamie, W3 first look; W4-a).
 * Built in W3 — the landing page (24 Sep 2026); bands re-measured in W4 when the rooms moved under the name; W5-d drops the crop.
 */
export const SIDE = 16;     // the gutter at the screen's sides
export const TOP = 80;      // the band the name and the rooms beneath it sit in (style.css #top: 72 px measured, W4)
export const GAP = 20;      // at least this between the globe and the words
export const TEXT = 44;     // the status note and the live line (style.css #words: 37 px measured, W4)
export const BOTTOM = 12;   // the words' distance from the screen's bottom edge (style.css #words)
// How far the frame runs past every edge. W3 ran it 56 px out to hide the viewer's corner buttons (decision 1A); Planet's
// ?embed hides them itself since 24 Sep, and the hidden margin cost the viewer 22–46% more pixels a frame (Jamie: the spin
// smoother on planet. than on the hub), so none (W5-d).
export const CROP = 0;
export const MOST = 0.78;   // the globe's width at most, as a share of the screen's height
export const LEAST = 120;   // the globe's width at least, on the smallest screens
export const RESHAPE_SHARE = 0.02;   // the zoom must change by more than this to reload the frame (a phone turned, a window resized)

// Whether a new screen shape needs the viewer reloaded: its zoom is fixed in its address, and the frame is from another
// address, so a new zoom means a new load (until Planet's ?embed takes a zoom by message).
export function reshapes(fromZoom, toZoom) {
  return fromZoom === null || Math.abs(toZoom - fromZoom) / fromZoom > RESHAPE_SHARE;
}

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
