/*
 * watch.test.js — the page's three states: live, the still with "last seen", and "resumed" after a restart.
 * In:  createWatch from public/js/watch.js, driven with made-up times in milliseconds.
 * Out: pass or fail; `npm test` runs it, and so does every Pages deploy.
 * Decision: the tests speak in the page's own moments (a poll every 2 s, ten seconds of failures), so each name reads as a promise to a visitor.
 * Built in W3 — the landing page (24 Sep 2026).
 */
import { expect, it } from "vitest";
import { createWatch, DRAWN_GUESS_MS, RESUMED_FOR_MS } from "../public/js/watch.js";

const meta = (tick) => ({ tick, year: tick * 100_000 });

// A page that loaded its frame at 0 ms and heard from the door at 500 ms.
function livePage() {
  const w = createWatch({ startedAt: 0 });
  w.stillTaken(-86_400_000);
  w.frameLoaded(300);
  w.metaOk(meta(1000), 500);
  return w;
}

it("the still stays on top until the frame has had time to draw", () => {
  const w = livePage();
  expect(w.view(300 + DRAWN_GUESS_MS - 1).showFrame).toBe(false);
  expect(w.view(300 + DRAWN_GUESS_MS).showFrame).toBe(true);
});

it("the frame shows as soon as the viewer says it has drawn, without waiting for the guess", () => {
  const w = livePage();
  w.frameDrawn(900);
  expect(w.view(900).showFrame).toBe(true);
});

it("a frame that loaded while the door never answered is never shown (it may hold an error page)", () => {
  const w = createWatch({ startedAt: 0 });
  w.frameLoaded(300);
  w.metaFailed("network error", 2000);
  expect(w.view(10_000).showFrame).toBe(false);
});

it("one failed request does not bring the still back", () => {
  const w = livePage();
  w.metaFailed("network error", 3000);
  w.metaOk(meta(1005), 5000);
  expect(w.view(5000)).toMatchObject({ showFrame: true, still: false, lastSeenAt: null });
});

it("ten seconds of failures brings the still back with the time the door last answered", () => {
  const w = livePage();
  let went = false;
  for (let at = 3000; at <= 13_000; at += 2000) went = w.metaFailed("HTTP 530", at).wentStill || went;
  expect(went).toBe(true);
  expect(w.view(13_000)).toMatchObject({ showFrame: false, still: true, lastSeenAt: 500, lastError: "HTTP 530" });
});

it("failures for just under ten seconds keep the live picture", () => {
  const w = livePage();
  for (let at = 3000; at <= 12_999; at += 2000) w.metaFailed("timeout", at);
  expect(w.view(12_999).still).toBe(false);
});

it("with the house offline from the start, 'last seen' is the still's own time", () => {
  const w = createWatch({ startedAt: 0 });
  w.stillTaken(42);
  for (let at = 0; at <= 10_000; at += 2000) w.metaFailed("network error", at);
  expect(w.view(10_000).lastSeenAt).toBe(42);
});

it("when the door answers again the page leaves the still and reloads the frame by itself", () => {
  const w = livePage();
  for (let at = 3000; at <= 13_000; at += 2000) w.metaFailed("network error", at);
  expect(w.metaOk(meta(1100), 60_000).reloadFrame).toBe(true);
  w.frameReloaded(60_000);
  w.frameLoaded(60_400);
  expect(w.view(60_400).showFrame).toBe(false);
  expect(w.view(60_400 + DRAWN_GUESS_MS)).toMatchObject({ showFrame: true, still: false, lastSeenAt: null });
});

it("a live page never asks for the frame to be reloaded", () => {
  const w = livePage();
  expect(w.metaOk(meta(1005), 2500).reloadFrame).toBe(false);
});

it("a lower tick shows 'resumed' without a reload, then it fades after a few seconds", () => {
  const w = livePage();
  const r = w.metaOk(meta(600), 2500);
  expect(r).toEqual({ change: "restarted", reloadFrame: false });
  expect(w.view(2500).resumed).toBe(true);
  expect(w.view(2500 + RESUMED_FOR_MS).resumed).toBe(false);
});

it("the replayed ticks after a restart count as advancing, not as more restarts", () => {
  const w = livePage();
  w.metaOk(meta(600), 2500);
  expect(w.metaOk(meta(605), 4500).change).toBe("advanced");
});

it("a tab back from the background starts its ten seconds afresh: one failure on return does not bring the still", () => {
  const w = livePage();
  w.metaFailed("network error", 3000);
  w.paused();
  expect(w.metaFailed("network error", 300_000).wentStill).toBe(false);
  expect(w.view(300_000).still).toBe(false);
});

it("the line keeps the last numbers the door sent while the still is showing", () => {
  const w = livePage();
  for (let at = 3000; at <= 13_000; at += 2000) w.metaFailed("network error", at);
  expect(w.view(13_000).meta.tick).toBe(1000);
});
