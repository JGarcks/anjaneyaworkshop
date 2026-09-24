/*
 * tick.test.js — the restart rule's tests (CLAUDE.md rule 12).
 * In:  tickChange from public/js/tick.js.
 * Out: pass or fail; `npm test` runs it, and so does every Pages deploy.
 * Decision: each test's name states the fact it checks, so the list of names reads as the rule.
 * Built in W1 — Ground (24 Sep 2026): the simplest case first; Phase 2 adds the rest.
 */
import { expect, it } from "vitest";
import { tickChange } from "../public/js/tick.js";

it("a lower X-Planet-Tick than the last one seen is a restart, not an error", () => {
  expect(tickChange(32400, 32100)).toBe("restarted");
});
