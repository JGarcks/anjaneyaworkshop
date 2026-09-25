/*
 * watch.js — the page's memory of the planet: is it live, is the house offline, did the engine just restart.
 * In:  each /api/meta answer or failure, and the framed viewer's "loaded" and "drawn" moments, each with the time it happened.
 * Out: what to show now — the live frame or the still, "last seen at …" or "resumed" — and when to reload the frame.
 * Decision: the still takes over only after ten seconds of failures (Jamie, W3 decision 4), so one dropped request on a
 *   phone does not blink it in; a lower tick is a restart, never an error (rule 12); the frame shows only once the viewer says
 *   "drawn", so a device that cannot draw keeps the still for good (Jamie, W8-a). No clocks or pages in here, so every rule is tested.
 * Built in W3 — the landing page (24 Sep 2026); W8 drops the 2.5 s guess for Planet's "drawn".
 */
import { tickChange } from "./tick.js";

export const STILL_AFTER_MS = 10_000;   // failures this long in a row: the still and "last seen"
export const RESUMED_FOR_MS = 6_000;    // how long "resumed" stays after a restart
export const DRAWN_LATE_MS = 15_000;    // a frame loaded this long with no "drawn" gets a console warning (it keeps the still either way)

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

    // The tab went into the background and stops asking: a run of failures from before cannot carry over to its return.
    paused() { if (!s.still) s.failingSince = null; },

    // When the still was taken (from still/planet.json, which arrives while the frame loads): "last seen" if the door never answers.
    stillTaken(at) { s.stillTakenAt = at; },

    frameReloaded(at) { s.frameStartedAt = at; s.frameLoadedAt = null; s.frameDrawnAt = null; },
    frameLoaded(at) { s.frameLoadedAt = at; },
    frameDrawn(at) { s.frameDrawnAt = at; },

    view(at) {
      const drawn = s.frameDrawnAt !== null;
      // The frame shows only once the door has answered since it began loading: otherwise it may hold an error page.
      const doorAnswered = s.lastOkAt !== null && s.lastOkAt >= s.frameStartedAt;
      return {
        showFrame: !s.still && drawn && doorAnswered,
        drawn,
        // Loaded, the door answering, and still no picture: the viewer could not draw here (no 3D graphics, or its own error).
        drawnLate: !drawn && !s.still && doorAnswered && s.frameLoadedAt !== null && at - s.frameLoadedAt >= DRAWN_LATE_MS,
        still: s.still,
        lastSeenAt: s.still ? (s.lastOkAt ?? s.stillTakenAt) : null,
        resumed: !s.still && s.resumedAt !== null && at - s.resumedAt < RESUMED_FOR_MS,
        meta: s.lastMeta,
        lastError: s.lastError,
      };
    },
  };
}
