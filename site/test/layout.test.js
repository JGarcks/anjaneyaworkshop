/*
 * layout.test.js — the full-screen frame's geometry on the screens that matter: the laptop, a phone upright and turned.
 * In:  layout() from public/js/layout.js.
 * Out: pass or fail; `npm test` runs it, and so does every Pages deploy.
 * Decision: each test checks a promise the page makes to the eye (fits, centred, words beneath, buttons hidden),
 *   not the arithmetic behind it, so the numbers can be tuned at Jamie's walk without rewriting the tests.
 * Built in W3 — the landing page (24 Sep 2026).
 */
import { describe, expect, it } from "vitest";
import { layout, reshapes, BOTTOM, CROP, SIDE, TEXT, TOP } from "../public/js/layout.js";

const screens = { laptop: [1440, 900], phone: [390, 844], "phone turned": [844, 390], "small laptop": [1280, 720] };

for (const [name, [w, h]] of Object.entries(screens)) {
  describe(`on a ${name} (${w}×${h})`, () => {
    const L = layout(w, h);

    it("the globe fits on the screen with the side gutter", () => {
      expect(L.globe.d).toBeLessThanOrEqual(w - 2 * SIDE);
      expect(L.globe.y - L.globe.d / 2).toBeGreaterThanOrEqual(TOP);
    });

    it("the words sit at the very bottom of the screen, clear of the globe", () => {
      expect(L.textTop + TEXT + BOTTOM).toBe(h);
      expect(L.textTop).toBeGreaterThan(L.globe.y + L.globe.d / 2);
    });

    it("the viewer's zoom makes its globe exactly the chosen width (width = zoom × frame height)", () => {
      expect(L.zoom * L.frame.height).toBeCloseTo(L.globe.d, 5);
    });

    it("the frame is centred on the globe, so the viewer's centred globe lands there", () => {
      expect(L.frame.left + L.frame.width / 2).toBeCloseTo(L.globe.x, 5);
      expect(L.frame.top + L.frame.height / 2).toBeCloseTo(L.globe.y, 0);
    });

    it("the frame covers the whole screen (and no more than CROP past it, since ?embed hides the buttons — W5-d)", () => {
      expect(L.frame.left).toBeLessThanOrEqual(-CROP);
      expect(L.frame.top).toBeLessThanOrEqual(-CROP);
      expect(L.frame.left + L.frame.width).toBeGreaterThanOrEqual(w + CROP);
      expect(L.frame.top + L.frame.height).toBeGreaterThanOrEqual(h + CROP);
      expect(L.frame.width).toBe(w + 2 * CROP);
    });
  });
}

it("on an upright phone the globe spans the width, less the gutters", () => {
  expect(layout(390, 844).globe.d).toBe(390 - 2 * SIDE);
});

it("turning a phone needs the viewer reloaded (its zoom lives in its address)", () => {
  expect(reshapes(layout(390, 844).zoom, layout(844, 390).zoom)).toBe(true);
});

it("a window a few pixels shorter does not reload the viewer", () => {
  expect(reshapes(layout(1440, 900).zoom, layout(1440, 896).zoom)).toBe(false);
});

it("the first load always loads the viewer", () => {
  expect(reshapes(null, layout(1440, 900).zoom)).toBe(true);
});
