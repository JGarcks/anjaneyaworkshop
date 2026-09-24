/*
 * tick.test.js — the restart rule's tests (CLAUDE.md rule 12).
 * In:  tickChange from public/js/tick.js.
 * Out: pass or fail; `npm test` runs it, and so does every Pages deploy.
 * Decision: each test's name states the fact it checks, so the list of names reads as the rule.
 * Built in W1 — Ground (24 Sep 2026): the simplest case first; W3 — the landing page added the rest.
 */
import { expect, it } from "vitest";
import { tickChange } from "../public/js/tick.js";

it("a lower X-Planet-Tick than the last one seen is a restart, not an error", () => {
  expect(tickChange(32400, 32100)).toBe("restarted");
});

it("the first tick a page sees is neither a restart nor progress", () => {
  expect(tickChange(null, 14731)).toBe("first");
});

it("the same tick twice (the edge's one-second copy) is not progress", () => {
  expect(tickChange(14731, 14731)).toBe("same");
});

it("a higher tick is the world moving on", () => {
  expect(tickChange(14731, 14736)).toBe("advanced");
});

it("a restart from year zero (a new experiment) is a restart too", () => {
  expect(tickChange(14731, 0)).toBe("restarted");
});
