/*
 * main.js — the landing page at work: places the frame and the still, asks the planet for its numbers every two seconds, shows what watch.js decides.
 * In:  the screen's size; /api/meta through the front door; the framed viewer's load (and, once Planet has ?embed, its "drawn" message); still/planet.json.
 * Out: the frame and the still where layout.js puts them, one or the other on screen; the live line; "last seen at …" or "resumed";
 *   a console warning naming any failure (rule 10).
 * Decision: every rule lives in the tested modules (watch, line, layout); this file only wires them to the page. It asks with the browser's
 *   ordinary caching, never "no-store", so Cloudflare's one-second copy answers every visitor and the house sees one ask a second.
 * Built in W3 — the landing page (24 Sep 2026).
 */
import { layout } from "./layout.js";
import { formatLastSeen, formatLine } from "./line.js";
import { PLANET, viewerAddress } from "./planet.js";
import { createWatch } from "./watch.js";

const POLL_MS = 2000;          // how often the page asks for the live line
const ASK_TIMEOUT_MS = 4000;   // an ask with no answer by then counts as a failure
const RESHAPE_AFTER_MS = 400;  // a resize settles this long before the frame is reshaped
const RESHAPE_SHARE = 0.02;    // the zoom must change by more than this to reload the frame (a phone turned, a window resized)

const $ = (id) => document.getElementById(id);
const frame = $("planet"), still = $("still"), line = $("line"), status = $("status");

const watch = createWatch({ startedAt: Date.now() });
let stillZoom = 0.9;           // replaced by still/planet.json's own figure when it arrives
let stillMeta = null;          // the numbers the still was taken with: the line before the door first answers
let frameZoom = null;
let timer = null, asking = false;

function place() {
  const L = layout(window.innerWidth, window.innerHeight);
  const px = (n) => n + "px";
  Object.assign(frame.style, { left: px(L.frame.left), top: px(L.frame.top), width: px(L.frame.width), height: px(L.frame.height) });
  const size = L.globe.d / stillZoom;
  Object.assign(still.style, { left: px(L.globe.x), top: px(L.globe.y), width: px(size), height: px(size) });
  return L;
}

function loadFrame(L) {
  frameZoom = L.zoom;
  watch.frameReloaded(Date.now());
  frame.src = viewerAddress(L.zoom);
}

// The line as one span per part, so a narrow screen wraps it between parts, never inside one.
let shownLine = "";
function setLine(text) {
  if (text === shownLine) return;
  shownLine = text;
  line.replaceChildren(...text.split(" · ").flatMap((part, i) => {
    const span = document.createElement("span");
    span.textContent = part;
    return i === 0 ? [span] : [" · ", span];
  }));
}

function render() {
  const now = Date.now();
  const v = watch.view(now);
  frame.classList.toggle("shown", v.showFrame);
  still.classList.toggle("gone", v.showFrame);   // never both: style.css hands one to the other through the dark (W4-b)
  const meta = v.meta ?? stillMeta;
  if (meta) setLine(formatLine(meta));
  const note = v.lastSeenAt !== null ? formatLastSeen(new Date(v.lastSeenAt), new Date(now)) : v.resumed ? "resumed" : "";
  if (note) status.textContent = note;
  status.classList.toggle("shown", note !== "");
}

function soon(ms) {
  clearTimeout(timer);
  timer = setTimeout(ask, ms);
}

async function ask() {
  if (asking) return;
  if (document.hidden) return soon(POLL_MS);   // a hidden tab asks nothing and counts no failures
  asking = true;
  try {
    const reply = await fetch(PLANET + "/api/meta", { signal: AbortSignal.timeout(ASK_TIMEOUT_MS), credentials: "omit" });
    if (!reply.ok) throw new Error("HTTP " + reply.status);
    const meta = await reply.json();
    if (!Number.isFinite(meta.tick) || !Number.isFinite(meta.year)) throw new Error("a reply without a tick or a year");
    if (watch.metaOk(meta, Date.now()).reloadFrame) {
      console.info("Planet's front door is answering again: reloading the live picture.");
      loadFrame(place());
    }
  } catch (error) {
    const reason = error.name === "TimeoutError" ? `no answer within ${ASK_TIMEOUT_MS / 1000} s`
      : error.name === "TypeError" ? "the request failed (the network, the address, or the house offline)"
      : error.message;
    const { wentStill, failingFor } = watch.metaFailed(reason, Date.now());
    if (wentStill) {
      console.warn(`Planet's front door (${PLANET}/api/meta) has not answered for ${Math.round(failingFor / 1000)} s; last reason: ${reason}. Showing the still with "last seen".`);
    }
  } finally {
    asking = false;
    render();
    soon(POLL_MS);
  }
}

frame.addEventListener("load", () => { watch.frameLoaded(Date.now()); render(); });

// Planet's ?embed (requested, W3 decision 1A) will say when its first picture is on screen; until then watch.js waits a fixed time.
window.addEventListener("message", (event) => {
  if (event.origin !== PLANET || event.source !== frame.contentWindow) return;
  if (event.data && event.data.planet === "drawn") { watch.frameDrawn(Date.now()); render(); }
});

let reshape = null;
window.addEventListener("resize", () => {
  clearTimeout(reshape);
  reshape = setTimeout(() => {
    const L = place();
    if (Math.abs(L.zoom - frameZoom) / frameZoom > RESHAPE_SHARE && !watch.view(Date.now()).still) loadFrame(L);
    render();
  }, RESHAPE_AFTER_MS);
});

document.addEventListener("visibilitychange", () => { if (document.hidden) watch.paused(); else soon(0); });

fetch("still/planet.json")
  .then((reply) => { if (!reply.ok) throw new Error("HTTP " + reply.status); return reply.json(); })
  .then((record) => {
    stillZoom = record.zoom;
    stillMeta = record;
    watch.stillTaken(Date.parse(record.takenAt));
    place();
    render();
  })
  .catch((error) => console.warn(`The still's record (still/planet.json) could not be read: ${error.message}. The still shows at its usual size, without its time.`));

loadFrame(place());
ask();
setInterval(render, 250);   // the fade-in and "resumed" run on time as well as on answers
