/*
 * page.test.js — the landing page's promises that live in its files, not its script: the link set, the security header,
 *   where the words sit, and the still's handover to the live globe.
 * In:  public/index.html, public/style.css and public/_headers as written, and PLANET from public/js/planet.js.
 * Out: pass or fail; `npm test` runs it, and so does every Pages deploy.
 * Decision: a link appears only when its room exists (Strategic Plan, open question 2), so the set is listed here in full and
 *   a new room changes this test on purpose; the header must open the planet's address and nothing else beyond the site.
 * Built in W3 — the landing page (24 Sep 2026); the layout and handover tests added in W4.
 */
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { PLANET } from "../public/js/planet.js";

const read = (name) => readFileSync(new URL(`../public/${name}`, import.meta.url), "utf8");
const html = read("index.html");
const csp = read("_headers").match(/Content-Security-Policy: (.+)/)[1];
const directive = (name) => csp.split(";").map((d) => d.trim()).find((d) => d.startsWith(name + " "));

it("the hub links to exactly the rooms that exist: Planet alone in Phase 2", () => {
  const links = [...html.matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => m[1]);
  expect(links).toEqual([PLANET + "/"]);
});

it("the page still carries the name, which the public check looks for", () => {
  expect(html).toContain("Anjaneya Workshop");
});

it("the security header lets the page frame the planet and ask it for numbers, and nothing else beyond the site", () => {
  expect(directive("frame-src")).toBe(`frame-src ${PLANET}`);
  expect(directive("connect-src")).toBe(`connect-src 'self' ${PLANET}`);
  expect(directive("script-src")).toBe("script-src 'self'");
  expect(directive("default-src")).toBe("default-src 'none'");
});

it("nobody may frame the hub itself", () => {
  expect(directive("frame-ancestors")).toBe("frame-ancestors 'none'");
});

it("the framed viewer is sandboxed: it may run and read its own address, but not steer the page", () => {
  expect(html).toMatch(/<iframe [^>]*sandbox="allow-scripts allow-same-origin"/);
});

it("the rooms sit under the name, and the live line is the last thing at the bottom (Jamie, W4-a)", () => {
  expect(html).toMatch(/<header id="top">\s*<h1 id="name">[^<]*<\/h1>\s*<nav /);
  expect(html).toMatch(/<div id="words">[\s\S]*<p id="line"><\/p>\s*<\/div>/);
});

// "opacity <duration>s <easing> <delay>s" from the rule for a selector in style.css.
const css = read("style.css");
const fade = (selector) => {
  const rule = css.match(new RegExp(`^${selector.replace(/[.#]/g, "\\$&")} \\{([^}]*)\\}`, "m"))[1];
  const [, duration, delay = "0"] = rule.match(/transition: opacity ([\d.]+)s \w+(?: ([\d.]+)s)?;/);
  return { duration: Number(duration), delay: Number(delay) };
};

it("the live globe fades in only after the still has faded out: never one world morphing into another (W4-b)", () => {
  expect(fade("#planet.shown").delay).toBeGreaterThanOrEqual(fade("#still.gone").duration);
});

it("the still comes back only after the live globe has faded out", () => {
  expect(fade("#still").delay).toBeGreaterThanOrEqual(fade("#planet").duration);
});
