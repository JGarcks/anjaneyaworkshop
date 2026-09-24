/*
 * watch.js — the page's memory of the planet: is it live, is the house offline, did the engine just restart.
 * In:  each /api/meta answer or failure, and the framed viewer's "loaded" and "drawn" moments, each with the time it happened.
 * Out: what to show now — the live frame or the still, "last seen at …" or "resumed" — and when to reload the frame.
 * Decision: the still takes over only after ten seconds of failures (Jamie, W3 decision 4), so one dropped request on a
 *   phone does not blink it in; a lower tick is a restart, never an error (rule 12). No clocks or pages in here, so every rule is tested.
 * Built in W3 — the landing page (24 Sep 2026).
 */
import { tickChange } from "./tick.js";

export const STILL_AFTER_MS = 10_000;   // failures this long in a row: the still and "last seen"
export const RESUMED_FOR_MS = 6_000;    // how long "resumed" stays after a restart
export const DRAWN_GUESS_MS = 2_500;    // until Planet's ?embed says "drawn": the frame is trusted this long after it loads

export function createWatch({ startedAt }) {
  const s = {
    stillTakenAt: null, lastTick: null, lastMeta: null, lastOkAt: null,
    failingSince: null, lastError: null, still: false, resumedAt: null,
    frameStartedAt: startedAt, frameLoadedAt: null, frameDrawnAt: null,
  };

  return {
    // An answer from the door. Coming back from the still, the frame is reloaded: the viewer inside it may
    // have given up while the house was away.
    metaOk(meta, at) {
      const change = tickChange(s.lastTick, meta.tick);
      if (change === "restarted") s.resumedAt = at;
      s.lastTick = meta.tick;
      s.lastMeta = meta;
      s.lastOkAt = at;
      s.failingSince = null;
      const reloadFrame = s.still;
      s.still = false;
      return { change, reloadFrame };
    },

    metaFailed(reason, at) {
      if (s.failingSince === null) s.failingSince = at;
      s.lastError = reason;
      const wentStill = !s.still && at - s.failingSince >= STILL_AFTER_MS;
      if (wentStill) s.still = true;
      return { wentStill, failingFor: at - s.failingSince };
    },

    // When the still was taken (from still/planet.json, which arrives while the frame loads): "last seen" if the door never answers.
    stillTaken(at) { s.stillTakenAt = at; },

    frameReloaded(at) { s.frameStartedAt = at; s.frameLoadedAt = null; s.frameDrawnAt = null; },
    frameLoaded(at) { s.frameLoadedAt = at; },
    frameDrawn(at) { s.frameDrawnAt = at; },

    view(at) {
      const drawn = s.frameDrawnAt !== null || (s.frameLoadedAt !== null && at - s.frameLoadedAt >= DRAWN_GUESS_MS);
      // The frame shows only once the door has answered since it began loading: otherwise it may hold an error page.
      const doorAnswered = s.lastOkAt !== null && s.lastOkAt >= s.frameStartedAt;
      return {
        showFrame: !s.still && drawn && doorAnswered,
        still: s.still,
        lastSeenAt: s.still ? (s.lastOkAt ?? s.stillTakenAt) : null,
        resumed: !s.still && s.resumedAt !== null && at - s.resumedAt < RESUMED_FOR_MS,
        meta: s.lastMeta,
        lastError: s.lastError,
      };
    },
  };
}
