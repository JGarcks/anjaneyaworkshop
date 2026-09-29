/*
 * about.test.js — the About link shows only while its words are true of the planet on show.
 * In:  replies shaped as Planet's /api/meta; public/index.html and docs/process/landing-page-about.md as written.
 * Out: pass or fail; `npm test` runs it, and so does every Pages deploy.
 * Decision: the words were agreed with Jamie before they were built (W14-d), so the page is held to them to the letter,
 *   and the link to the facts they state (the size of Earth, born as ocean).
 * Built in W15 — the full-size ocean planet goes public (29 Sep 2026).
 */
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { aboutHolds, landAtBirth, whyNot } from "../public/js/about.js";

const ocean = { radius_km: 6371.0, frequency: 128, changed_numbers: ["first_continent_count = 1", "first_land_share = 0.001"] };
const quarter = { radius_km: 1593.0, frequency: 32 };
const earthSizeWithContinents = { radius_km: 6371.0, frequency: 128 };

it("a planet the size of Earth, born as ocean, is what the About says", () => {
  expect(aboutHolds(ocean)).toBe(true);
});

it("today's quarter-size public planet is not, so the link stays hidden", () => {
  expect(aboutHolds(quarter)).toBe(false);
  expect(whyNot(quarter)).toContain("1593 km");
});

it("a full-size planet born with its continents is not born as ocean", () => {
  expect(aboutHolds(earthSizeWithContinents)).toBe(false);
  expect(landAtBirth(earthSizeWithContinents)).toBe(null);
  expect(whyNot(earthSizeWithContinents)).toContain("born with its continents");
});

it("a full-size planet born with a fifth of it land is not an ocean planet", () => {
  const islands = { radius_km: 6371, changed_numbers: ["first_land_share = 0.2"] };
  expect(aboutHolds(islands)).toBe(false);
  expect(landAtBirth(islands)).toBe(0.2);
});

it("a quarter-size ocean planet is not the size of Earth", () => {
  expect(aboutHolds({ ...ocean, radius_km: 1593 })).toBe(false);
});

it("a reply without the facts shows nothing rather than guessing", () => {
  expect(aboutHolds(undefined)).toBe(false);
  expect(aboutHolds({})).toBe(false);
  expect(aboutHolds({ radius_km: 6371, changed_numbers: "first_land_share = 0.001" })).toBe(false);
  expect(aboutHolds({ radius_km: 6371, changed_numbers: ["first_land_share = lots"] })).toBe(false);
});

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const html = read("../public/index.html");
const plain = (text) => text.replace(/<[^>]+>/g, "").replace(/\*\*/g, "").replace(/&#39;|&rsquo;/g, "'").replace(/\s+/g, " ").trim();

it("the About panel says the words Jamie agreed, to the letter (docs/process/landing-page-about.md)", () => {
  const agreed = read("../../docs/process/landing-page-about.md");
  const paragraphs = agreed.split("## The text")[1].split("## ")[0].split("\n")
    .filter((line) => line.startsWith("> ") && line.length > 2).map((line) => plain(line.slice(2)));
  expect(paragraphs).toHaveLength(3);
  const panel = html.match(/<dialog id="about"[^>]*>([\s\S]*?)<\/dialog>/)[1];
  const shown = [...panel.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => plain(m[1]));
  expect(shown).toEqual(paragraphs);
});

it("the About link starts hidden, and is a button, not a link to anywhere", () => {
  expect(html).toMatch(/<button id="about-open" type="button" hidden[^>]*>About<\/button>/);
});

it("the panel takes nothing in: no form, no input, no link out (rule 11)", () => {
  const panel = html.match(/<dialog id="about"[^>]*>([\s\S]*?)<\/dialog>/)[1];
  expect(panel).not.toMatch(/<(form|input|textarea|select|a)\b/);
});
