# build_guide.py — builds Jamie's Planet session guide as plain HTML from the list of sessions below.
# In:  nothing but this file: each session's name, what it is for, what Jamie is asked, what Jamie should see.
# Out: planet-session-guide.html (a whole page, to open from the folder) and planet-session-guide.artifact.html
#      (the same page without its outer wrapper, which is what is published as the private page on claude.ai).
# Decision: the words are written once, here, from the full-size brief; the page's script only ticks and copies (W12).
# Built in W12 — Planet's meta review (27 Sep 2026). After changing a session here: python build_guide.py, then republish.
import html
import io
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))

PC = "Garcks-PC · Opus 5.5"
LAPTOP_PLANET = "This laptop · a Planet session"
LAPTOP_FABLE = "This laptop · Fable"


def later(code, extra=""):
    return ("Read docs/PROGRESS.md, then docs/FULL_SIZE_BRIEF.md sections 2 and 3 and the part of section 6 for "
            + code + "." + extra + " Run session " + code + ".")


def review(n):
    return ("Please do Fable review " + str(n) + " of Planet's second edition, as section 7 of the full-size brief "
            "sets out. Planet is read only.")


WHAT_A_REVIEW_GIVES = ("A short report: what is better, what is not, whether the rules of work held, and whether the "
                       "next sessions are still the right ones.")

GROUPS = [
    ("Getting ready", "Four sessions that change no planet. They put the paperwork, the engine and the pictures in "
     "place, and end with your own list of what good looks like.", [
        dict(id="FS-0", name="The house in order", short="Paperwork", where=PC, kind="Documents only",
             why="Puts Planet's paperwork in order, so every later session can start by reading a little and know "
                 "what to do. It records your decisions of 27 September.",
             asked=["The documents as a whole: a shorter `CLAUDE.md`, a one-page `PROGRESS.md`, the old decisions "
                    "file archived untouched and a fresh one begun, closed plans and research moved into folders.",
                    "The three old worktrees removed. Their branches stay; this only frees disk.",
                    "The habit's new wording: the best design wins, and the owner must be able to see it."],
             also="It also brings the last test runs home from the server, stops the Earth-size test planet and "
                  "keeps its file, and puts Claude's tools of 27 September to you as one line to confirm.",
             see="A docs folder with about a dozen files at its top, and a progress page that fits one screen.",
             done="A fresh session can start from `CLAUDE.md`, `PROGRESS.md` and the brief alone.",
             say="Read docs/FULL_SIZE_BRIEF.md in full, then run session FS-0."),
        dict(id="FS-1", name="The engine made ready", short="Engine", where=PC, kind="Engine · no rule changes",
             why="Makes every machine grow the same planet from the same seed, makes a stopped engine start itself "
                 "again, and measures what one tick of a full-size planet costs.",
             asked=["A new maths library, so every machine rounds alike.",
                    "A budget for how long one full-size tick may take.",
                    "Whether each plate stores only its own cells now, or later. Today an Earth-size world file is "
                    "1 GB, nearly all of it empty."],
             also="Afterwards laptop Claude can drop the server's special maths setting at the next release.",
             see="Nothing looks different. Every planet's fingerprint changes once, which is why this comes before "
                 "the pictures.",
             done="One program gives one fingerprint on Garcks-PC, the laptop and the server, and the cost of a "
                  "tick is written in `PROGRESS.md`.",
             say=later("FS-1")),
        dict(id="FS-2", name="The looking glass", short="Pictures", where=PC + " · the test server",
             kind="A tool · no world changed",
             why="Builds `planet look`: one command that takes the same six pictures of any planet, with the same "
                 "colours and the same light, and a page of numbers beside them. Then it grows the three planets "
                 "that every later change is compared with.",
             asked=["The ages a planet is looked at. Suggested: 100 million, 1, 3 and 5 billion years.",
                    "A small picture library, or pictures written by hand."],
             see="A gallery of three Earth-size planets on today's rules: the before pictures.",
             done="You have the before gallery open, and one command remakes it.",
             say=later("FS-2")),
        dict(id="FS-3", name="What good looks like", short="Look list", where=PC, kind="Documents only",
             why="Your list of what a good planet shows, in your own words. Six to ten lines, each something you "
                 "can see in the pictures. It becomes the first clause of the gate.",
             asked=["The list itself.",
                    "Which three lines matter most. That can change the order of FS-4 to FS-8."],
             see="Your look list as a page of the Rulebook.",
             done="The list is written down, and every line has a number that shadows it.",
             say=later("FS-3")),
        dict(id="R1", name="Fable review 1", short="Review", where=LAPTOP_FABLE, kind="Review", review=True,
             why="A second pair of eyes before the first rule changes. Can a picture show every line of the look "
                 "list? Are the before pictures sound? Did the sessions keep to the rules of work?",
             see=WHAT_A_REVIEW_GIVES,
             done="You have the report and have said whether FS-4 to FS-8 keep their order.",
             say=review(1)),
    ]),
    ("Reshaping the land", "Five sessions, each with one change you can see. Each one is grown at full size on "
     "three seeds, and kept only when you have seen the same pictures before and after and said yes.", [
        dict(id="FS-4", name="The birth", short="Birth", where=PC, kind="Changes the world",
             change="No flood at birth",
             why="A newborn planet keeps its land. Today the Earth-size planet falls from 30% land to 3% in its "
                 "first 50 million years and takes about two billion years to recover.",
             asked=["How the first ocean floor gets its age.",
                    "How many plates and continents a full-size planet is born with.",
                    "Whether a visitor sees the first 100 million years, or the planet is born a little aged."],
             see="Before and after at birth, at 100 and 500 million years, and at 1 and 3 billion.",
             done="You have seen the pictures and said yes, or said no and the change is dropped.",
             say=later("FS-4")),
        dict(id="FS-5", name="A plate's life", short="Plates", where=PC, kind="Changes the world",
             change="A dozen or so plates with clean edges",
             why="Plates are born, join and die sensibly. Today the Earth-size planet fills with 30 to 50 small "
                 "ragged plates, because plates are born three ways, die one way and never join.",
             asked=["How two plates become one.",
                    "The smallest piece that may break away, in kilometres.",
                    "Anything the count of plates born and lost brings up."],
             see="The plates picture at 1, 2 and 3 billion years, before and after.",
             done="You have seen the pictures and said yes, or said no and the change is dropped.",
             say=later("FS-5")),
        dict(id="FS-6", name="Quieter coasts", short="Coasts", where=PC, kind="Changes the world",
             change="Some coasts without a wall",
             why="Not every coast gets a trench and a range. Borders may slide past each other, and quiet coasts "
                 "stay quiet for longer. This also slows the continents' growth.",
             asked=["What makes a border slide.",
                    "What makes a quiet coast fail.",
                    "Whether almost no ocean floor older than 250 million years is still asked of a planet."],
             see="Every coast drawn by kind. About half have a trench today; Earth has about a fifth.",
             done="You have seen the pictures and said yes, or said no and the change is dropped.",
             say=later("FS-6")),
        dict(id="R2", name="Fable review 2", short="Review", where=LAPTOP_FABLE, kind="Review", review=True,
             why="Halfway. Is the planet better to look at than the before pictures, and by how much? Did any "
                 "session turn a number to cancel another rule's side effect?",
             see=WHAT_A_REVIEW_GIVES,
             done="You have the report.",
             say=review(2)),
        dict(id="FS-7", name="Collisions that last", short="Collisions", where=PC, kind="Changes the world",
             change="High country inland",
             why="Ranges rise where continents meet, grow wide enough to be highlands, and are left behind as old "
                 "worn hills. Today a collision is ended by a clock.",
             asked=["What ends a collision.",
                    "How far inland a range may grow.",
                    "The ceiling on how high a range may stand."],
             see="The highest range close up, and how much of the high land lies far from the sea.",
             done="You have seen the pictures and said yes, or said no and the change is dropped.",
             say=later("FS-7")),
        dict(id="FS-8", name="Interiors with a past", short="Interiors", where=PC, kind="Changes the world",
             change="Land with shape far from the sea",
             why="The land behind the coastal ranges gets a shape of its own: old ranges, basins, harder and "
                 "softer rock. Today it stands at about 120 m for 3,000 km.",
             asked=["What a newborn planet's past holds.",
                    "How rock's hardness works.",
                    "Inland water now, or with rain in Layer 3."],
             also="It may take two sessions: the past first, water second.",
             see="The inside of the largest continent close up, and its biggest river from mouth to head.",
             done="You have seen the pictures and said yes, or said no and the change is dropped.",
             say=later("FS-8")),
    ]),
    ("On this laptop, alongside", "Two viewer sessions, done here where you judge the picture. Any time after "
     "FS-2, and both before FS-9.", [
        dict(id="WEB-13", name="A picture the size of the screen", short="Screen-sized", where=LAPTOP_PLANET,
             kind="Viewer", side=True,
             why="The viewer asks for the planet at a size the screen can show, so a full-size planet turns "
                 "smoothly. Today a full-size picture is 2.6 MB a refresh, sixteen times what the viewer was "
                 "built for.",
             asked=["Which size of picture the hub gets, and whether a big laptop gets a finer one.",
                    "How rivers are drawn at that size."],
             see="An Earth-size planet live in the viewer, smooth on this laptop and on a phone.",
             done="You have watched it on both and said it is smooth.",
             say=later("WEB-13", " Read docs/ITEMS_21_22.md as well.")),
        dict(id="WEB-14", name="Detail where you zoom", short="Zoom detail", where=LAPTOP_PLANET, kind="Viewer",
             side=True,
             why="The whole globe comes coarse, and the part you zoom into comes in full detail, as online maps "
                 "do.",
             asked=["Its design, which is put to you before anything is built."],
             see="Zooming in on a full-size planet brings up its detail, with no gaps or seams.",
             done="You have zoomed in and out on this laptop and a phone and said yes.",
             say=later("WEB-14", " Read docs/ITEMS_21_22.md as well.")),
    ]),
    ("Going public", "The last step of the second edition, after the third review.", [
        dict(id="R3", name="Fable review 3", short="Review", where=LAPTOP_FABLE, kind="Review", review=True,
             why="Before anything full-size is public. Does the planet meet your look list? Is anything left "
                 "that a visitor would see?",
             see=WHAT_A_REVIEW_GIVES,
             done="You have the report.",
             say=review(3)),
        dict(id="FS-9", name="The full-size planet goes public", short="Public", where=PC + ", then laptop Claude",
             kind="Release",
             why="The Earth-size planet takes the small one's place on the website.",
             asked=["What happens when a planet reaches 5 billion years: a new planet is born, or the clock slows.",
                    "The pace a visitor sees.",
                    "The first public seed."],
             also="Laptop Claude does the release, at your word.",
             see="The full-size planet at planet.anjaneyaworkshop.co.uk.",
             done="The public check passes and you have walked the site on this laptop and a phone.",
             say=later("FS-9")),
    ]),
]

SHAPE = [
    ("It reads", "the progress page, the rules of work and its own part of the brief."),
    ("It tells you the plan", "in plain words, and puts its decisions: three at most, all at once."),
    ("It builds", "one change."),
    ("It checks", "the formatter, the tests and the fingerprints."),
    ("It makes the pictures", "the same six, before and after, at full size."),
    ("You look", "and say yes or no."),
    ("It writes the records", "then commits and pushes."),
]

RULES = [
    ("Full size is the judge.", "Nothing is kept on a small planet's evidence."),
    ("Your eye is the gate.", "Numbers sit beside the pictures; they do not decide."),
    ("One visible change a session.", "No second change until you have looked at the first."),
    ("At most three decisions a session.", "All at its start, each with its options and a picture or number."),
    ("Causes before numbers.", "A number is never turned to cancel another rule's side effect."),
    ("Kilometres and years.", "No rule is written in cells or shares of the planet."),
    ("A planet lives about 5 billion years.", "Rules are judged over that life."),
    ("Tripwires tell; they do not choose.", "Land 25 to 40%, continent 32 to 45%."),
    ("Many-planet runs only when a picture cannot answer.", "Three seeds and your eye are the usual test."),
    ("Nothing is scripted.", "No schedules, and nothing steers a planet toward a figure."),
    ("It stops and says so", "when one of the signs below appears."),
]

STOPS = [
    "puts more than three decisions to you, or a list to confirm",
    "wants to judge a change on a small planet",
    "proposes a second fix to cancel the side effects of the first",
    "wants to loosen a test, or move a tripwire or a line of your look list",
    "starts a second visible change before you have looked at the first",
    "cannot show you the change in a picture",
]

WHERE = [
    ("The brief", "In Planet, as `docs/FULL_SIZE_BRIEF.md`, since FS-0 filed it. The Workshop keeps the copy it "
     "sent, in `docs/process/requests/planet-full-size-brief/`."),
    ("The review", '<a href="https://claude.ai/artifact/M4oXiKmu7MExEN2sPPJKWN">Planet Meta Review</a>, with the '
     "maps and the chart."),
    ("The pictures", "In `~/planet-looks/` on Garcks-PC, never in the repository. The planet you saw on "
     "27 September is kept there; the before pictures come in FS-2."),
    ("The public planet", '<a href="https://planet.anjaneyaworkshop.co.uk/">planet.anjaneyaworkshop.co.uk</a>. '
     "Until FS-9 it is a quarter-size planet on the old rules, and nothing is judged by it."),
    ("Notes between Claudes", "On Garcks-PC's Desktop. Whoever acts on one moves it to `~/planet-notes-archive/`."),
    ("The test server", "Kept for growing full-size planets. About £7.50 a day while it exists; laptop Claude "
     "deletes it at your word."),
]

MAIN = ["FS-0", "FS-1", "FS-2", "FS-3", "R1", "FS-4", "FS-5", "FS-6", "R2", "FS-7", "FS-8", "R3", "FS-9"]
SIDE = ["WEB-13", "WEB-14"]


def text(s):
    """Plain words to HTML: escaped, with `code` in backticks; a string that already holds a link is kept."""
    if "<a " in s:
        return re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
    return re.sub(r"`([^`]+)`", r"<code>\1</code>", html.escape(s, quote=False))


def anchor(session_id):
    return session_id.lower()


def every_session():
    return [s for _, _, sessions in GROUPS for s in sessions]


def route_svg():
    by_id = {s["id"]: s for s in every_session()}
    step, left, y, side_y = 78, 46, 78, 168
    width = left * 2 + step * len(MAIN)
    out = ['<svg id="route" viewBox="0 0 %d 214" role="img" aria-label="The route: FS-0 to FS-3 get ready, then '
           'the first review; FS-4 to FS-6 reshape the land, then the second review; FS-7 and FS-8, then the third '
           'review; FS-9 goes public; then Layer 3. The two viewer sessions run alongside on the laptop, any time '
           'after FS-2 and both before FS-9.">' % width]
    x_of = {sid: left + i * step for i, sid in enumerate(MAIN)}
    end_x = left + len(MAIN) * step
    out.append('<line class="track" x1="%d" y1="%d" x2="%d" y2="%d"/>' % (left, y, end_x, y))
    # the side track: leaves after FS-2, joins before FS-9
    a, b = x_of["FS-2"] + step // 2, x_of["FS-9"] - step // 2
    out.append('<path class="track side" d="M%d %d V%d H%d V%d" fill="none"/>' % (a, y, side_y, b, y))
    side_x = {"WEB-13": a + (b - a) // 3, "WEB-14": a + 2 * (b - a) // 3}
    for sid in MAIN + SIDE:
        s = by_id[sid]
        x = x_of.get(sid, side_x.get(sid))
        cy = y if sid in x_of else side_y
        out.append('<a href="#%s"><g class="stop" data-stop="%s">' % (anchor(sid), sid))
        out.append('<rect class="hit" x="%d" y="%d" width="%d" height="78" fill="transparent"/>'
                   % (x - step // 2 + 2, cy - 40, step - 4))
        if s.get("review"):
            out.append('<rect class="mark" x="%d" y="%d" width="16" height="16" transform="rotate(45 %d %d)"/>'
                       % (x - 8, cy - 8, x, cy))
        else:
            out.append('<circle class="mark" cx="%d" cy="%d" r="9"/>' % (x, cy))
        out.append('<text class="code" x="%d" y="%d" text-anchor="middle">%s</text>'
                   % (x, cy - 20, html.escape(sid if not s.get("review") else "Fable")))
        out.append('<text class="name" x="%d" y="%d" text-anchor="middle">%s</text>'
                   % (x, cy + 30, html.escape(s["short"])))
        out.append('</g></a>')
    out.append('<circle class="end" cx="%d" cy="%d" r="5"/>' % (end_x, y))
    out.append('<text class="code" x="%d" y="%d" text-anchor="middle">Layer 3</text>' % (end_x, y - 20))
    out.append('<text class="name" x="%d" y="%d" text-anchor="middle">Climate</text>' % (end_x, y + 30))
    out.append('<text class="aside" x="%d" y="%d">on this laptop, alongside</text>' % (a + 12, side_y - 12))
    out.append('</svg>')
    return "\n".join(out)


def card(s):
    sid = s["id"]
    classes = "session" + (" review" if s.get("review") else "") + (" side" if s.get("side") else "")
    out = ['<article class="%s" id="%s" data-id="%s">' % (classes, anchor(sid), sid)]
    out.append('<header>')
    out.append('<div class="title"><span class="code">%s</span><h3>%s</h3></div>'
               % (html.escape("Review" if s.get("review") else sid), html.escape(s["name"])))
    out.append('<label class="tick" for="tick-%s"><input type="checkbox" id="tick-%s" data-tick="%s">'
               '<span>Done</span><span class="when" id="when-%s"></span></label>' % (sid, sid, sid, sid))
    out.append('</header>')
    out.append('<p class="chips"><span class="chip">%s</span><span class="chip">%s</span>'
               '<span class="chip nextchip" hidden>Next</span></p>'
               % (html.escape(s["where"]), html.escape(s["kind"])))
    if s.get("change"):
        out.append('<p class="change"><span>The one change you will see</span>%s</p>' % html.escape(s["change"]))
    out.append('<div class="facts">')
    out.append('<div><h4>What it is for</h4><p>%s</p>%s</div>'
               % (text(s["why"]), ('<p class="also">%s</p>' % text(s["also"])) if s.get("also") else ""))
    if s.get("asked"):
        out.append('<div><h4>You will be asked</h4><ol>%s</ol></div>'
                   % "".join("<li>%s</li>" % text(a) for a in s["asked"]))
    out.append('<div><h4>%s</h4><p>%s</p></div>'
               % ("You will get" if s.get("review") else "You should see", text(s["see"])))
    out.append('<div><h4>Done when</h4><p>%s</p></div>' % text(s["done"]))
    out.append('</div>')
    out.append('<div class="say"><h4>Say this to start it</h4><div class="sayrow"><p class="words" id="say-%s">%s</p>'
               '<button type="button" id="copy-%s" data-copy="say-%s">Copy</button></div></div>'
               % (sid, html.escape(s["say"], quote=False), sid, sid))
    out.append('</article>')
    return "\n".join(out)


def page():
    names = {s["id"]: (("Fable review " + s["id"][1]) if s.get("review") else s["id"] + " · " + s["name"])
             for s in every_session()}
    parts = [HEAD]
    parts.append('<div class="wrap">')
    parts.append('<header class="top"><p class="eyebrow">Planet · the second edition · from 27 September 2026</p>'
                 '<h1>Planet session guide</h1>'
                 '<p class="standfirst">What each session is for, what you will be asked, and what you should see '
                 'at the end. Tick a session when it is done and the next one lights up.</p>'
                 '<p class="here" id="here"><span class="label">Next</span> <a id="here-link" href="#fs-0">FS-0 · '
                 'The house in order</a></p></header>')
    parts.append('<section aria-labelledby="h-route"><h2 id="h-route">The route</h2>'
                 '<div class="routewrap" tabindex="0">' + route_svg() + '</div>'
                 '<p class="legend"><span><i class="k circle"></i>a session</span>'
                 '<span><i class="k diamond"></i>a Fable review</span>'
                 '<span><i class="k circle filled"></i>done</span>'
                 '<span><i class="k circle ring"></i>next</span></p></section>')
    parts.append('<section aria-labelledby="h-shape"><h2 id="h-shape">Every session has the same shape</h2>'
                 '<ol class="shape">' + "".join('<li><b>%s</b> %s</li>' % (html.escape(a), html.escape(b))
                                                  for a, b in SHAPE) + '</ol></section>')
    parts.append('<section aria-labelledby="h-sessions"><h2 id="h-sessions">The sessions</h2>')
    for title, lead, sessions in GROUPS:
        parts.append('<div class="group"><div class="grouphead"><h3 class="groupname">%s</h3><p>%s</p></div>'
                     % (html.escape(title), html.escape(lead)))
        parts.extend(card(s) for s in sessions)
        parts.append('</div>')
    parts.append('<p class="after"><b>Then Layer 3: climate.</b> Rain that differs from place to place is what '
                 'finishes the rivers and the erosion numbers, which is why they are not tuned before it.</p>')
    parts.append('</section>')
    parts.append('<section class="pair" aria-label="Rules and stop signs">'
                 '<div><h2 id="h-rules">What every session keeps to</h2><ol class="rules">'
                 + "".join('<li><b>%s</b> %s</li>' % (html.escape(a), html.escape(b)) for a, b in RULES)
                 + '</ol></div>'
                 '<div><h2 id="h-stop">Say stop when a session</h2><ul class="stops">'
                 + "".join('<li>%s</li>' % html.escape(s) for s in STOPS)
                 + '</ul><p class="muted">Each of these is a rule the session has agreed to. Saying stop costs '
                   'nothing, and a Fable review is there when it happens twice running.</p></div></section>')
    parts.append('<section aria-labelledby="h-where"><h2 id="h-where">Where things are</h2><dl class="where">'
                 + "".join('<dt>%s</dt><dd>%s</dd>' % (html.escape(a), text(b)) for a, b in WHERE)
                 + '</dl></section>')
    parts.append('<footer><p id="kept">Your ticks are kept in this browser.</p>'
                 '<p>Written by laptop Claude on 27 September 2026 from the full-size brief. If the brief and this '
                 'page ever disagree, the brief is right.</p></footer>')
    parts.append('</div>')
    script = SCRIPT.replace("__MAIN__", json.dumps(MAIN)).replace("__SIDE__", json.dumps(SIDE)) \
                   .replace("__NAMES__", json.dumps(names, ensure_ascii=False))
    parts.append("<script>\n" + script + "\n</script>")
    return "\n".join(parts)


HEAD = """<title>Planet Session Guide</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,500;7..72,650&family=Source+Sans+3:wght@400;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
:root{
  --ground:#EEF1F3; --surface:#FAFBFC; --ink:#15202B; --ink-2:#3F4D59; --muted:#5A6873;
  --rule:#D3DAE0; --accent:#1F5C8A; --accent-soft:#DCE8F1; --range:#8C5430; --on-accent:#FFFFFF;
  --serif:"Literata", Georgia, "Times New Roman", serif;
  --sans:"Source Sans 3", system-ui, -apple-system, "Segoe UI", sans-serif;
  --mono:"IBM Plex Mono", ui-monospace, "Cascadia Mono", Consolas, monospace;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    color-scheme:dark;
    --ground:#0D151D; --surface:#15202B; --ink:#E6ECF1; --ink-2:#BCC7D1; --muted:#8C9BA8;
    --rule:#263442; --accent:#7DB9E4; --accent-soft:#1B3246; --range:#D9A06E; --on-accent:#0D151D;
  }
}
:root[data-theme="dark"]{
  color-scheme:dark;
  --ground:#0D151D; --surface:#15202B; --ink:#E6ECF1; --ink-2:#BCC7D1; --muted:#8C9BA8;
  --rule:#263442; --accent:#7DB9E4; --accent-soft:#1B3246; --range:#D9A06E; --on-accent:#0D151D;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
@media (prefers-reduced-motion: reduce){html{scroll-behavior:auto}}
body{background:var(--ground);color:var(--ink);font-family:var(--sans);font-size:17px;line-height:1.5;margin:0}
.wrap{max-width:1080px;margin:0 auto;padding-inline:20px;padding-block:40px 80px;display:flex;flex-direction:column;gap:56px}
section{display:flex;flex-direction:column;gap:18px}
p,ul,ol,dl,dd,h1,h2,h3,h4,figure{margin:0}
h1,h2,h3{font-family:var(--serif);font-weight:650;line-height:1.15;text-wrap:balance}
h1{font-size:clamp(2rem,5.4vw,3rem);letter-spacing:-0.01em}
h2{font-size:clamp(1.4rem,3vw,1.8rem)}
h3{font-size:1.22rem}
h4{font-family:var(--mono);font-weight:500;font-size:.72rem;letter-spacing:.09em;text-transform:uppercase;color:var(--muted)}
a{color:var(--accent)}
code{font-family:var(--mono);font-size:.85em;background:var(--accent-soft);padding:.05em .3em;border-radius:3px;overflow-wrap:anywhere}
.eyebrow{font-family:var(--mono);font-size:.76rem;letter-spacing:.09em;text-transform:uppercase;color:var(--muted)}
.standfirst{font-size:1.2rem;line-height:1.45;color:var(--ink-2);max-width:60ch}
.top{display:flex;flex-direction:column;gap:14px}
.here{display:flex;flex-wrap:wrap;align-items:center;gap:10px;font-size:1.08rem}
.here .label,.chip.nextchip{font-family:var(--mono);font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;background:var(--accent);color:var(--on-accent);padding:3px 8px;border-radius:3px}
.here a{font-weight:600}
.muted{color:var(--muted);font-size:.95rem;max-width:60ch}

/* the route */
.routewrap{overflow-x:auto;background:var(--surface);border:1px solid var(--rule);border-radius:6px;padding:10px 6px}
.routewrap:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
#route{display:block;min-width:1000px;width:100%;height:auto}
#route .track{stroke:var(--rule);stroke-width:3}
#route .track.side{stroke-width:2}
#route .mark{fill:var(--surface);stroke:var(--muted);stroke-width:2}
#route .end{fill:var(--muted)}
#route .code{font-family:var(--mono);font-size:12px;fill:var(--ink-2)}
#route .name{font-family:var(--sans);font-size:12.5px;fill:var(--muted)}
#route .aside{font-family:var(--sans);font-size:12.5px;fill:var(--muted)}
#route a:hover .name,#route a:focus .name{fill:var(--ink)}
#route .stop.done .mark{fill:var(--accent);stroke:var(--accent)}
#route .stop.next .mark{stroke:var(--accent);stroke-width:4}
#route .stop.next .code,#route .stop.next .name{fill:var(--ink);font-weight:600}
.legend{display:flex;flex-wrap:wrap;gap:6px 22px;font-size:.9rem;color:var(--muted)}
.legend span{display:inline-flex;align-items:center;gap:8px}
.k{display:inline-block;width:13px;height:13px;border:2px solid var(--muted);background:var(--surface)}
.k.circle{border-radius:50%}
.k.diamond{transform:rotate(45deg);width:11px;height:11px}
.k.filled{background:var(--accent);border-color:var(--accent)}
.k.ring{border-color:var(--accent);border-width:4px}

/* the shape of a session */
ol.shape{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(210px,100%),1fr));gap:14px 26px;counter-reset:s}
ol.shape li{counter-increment:s;border-top:1px solid var(--rule);padding-top:10px;color:var(--ink-2)}
ol.shape li::before{content:counter(s);font-family:var(--mono);font-size:.78rem;color:var(--range);display:block;margin-bottom:2px}
ol.shape b{color:var(--ink);font-weight:600}

/* the sessions */
.group{display:flex;flex-direction:column;gap:14px;margin-top:10px}
.grouphead{display:flex;flex-direction:column;gap:4px;border-top:2px solid var(--ink);padding-top:12px}
.grouphead p{color:var(--ink-2);max-width:70ch}
.session{border:1px solid var(--rule);border-radius:6px;padding:18px 20px;display:flex;flex-direction:column;gap:14px;scroll-margin-top:16px}
.session.next{background:var(--surface);border-color:var(--accent);box-shadow:0 0 0 1px var(--accent)}
.session.done{background:transparent}
.session.done .title h3,.session.done .title .code{color:var(--muted)}
.session header{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:10px 20px}
.title{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 14px;min-width:0}
.title .code{font-family:var(--mono);font-size:.95rem;color:var(--range);font-weight:500}
.tick{display:inline-flex;align-items:center;gap:8px;font-size:.95rem;color:var(--ink-2);cursor:pointer;white-space:nowrap}
.tick input{width:20px;height:20px;accent-color:var(--accent);cursor:pointer;margin:0}
.tick input:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.when{color:var(--muted);font-variant-numeric:tabular-nums}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{font-size:.84rem;color:var(--ink-2);border:1px solid var(--rule);border-radius:3px;padding:1px 8px}
.chip.nextchip{border:0}
.change{font-family:var(--serif);font-size:1.12rem;display:flex;flex-direction:column;gap:2px}
.change span{font-family:var(--mono);font-size:.72rem;letter-spacing:.09em;text-transform:uppercase;color:var(--muted)}
.facts{display:grid;grid-template-columns:1fr;gap:16px 40px}
@media (min-width:720px){.facts{grid-template-columns:1fr 1fr}.session.review .facts{grid-template-columns:repeat(3,1fr)}}
.facts > div{display:flex;flex-direction:column;gap:5px}
.facts p,.facts li{color:var(--ink-2)}
.facts ol{padding-left:1.2em;display:flex;flex-direction:column;gap:4px}
.facts ol li::marker{font-family:var(--mono);font-size:.85em;color:var(--range)}
.also{font-size:.95rem;color:var(--muted)}
.say{display:flex;flex-direction:column;gap:6px;border-top:1px solid var(--rule);padding-top:12px}
.sayrow{display:flex;flex-wrap:wrap;align-items:flex-start;gap:10px 14px}
.words{font-family:var(--mono);font-size:.84rem;line-height:1.5;color:var(--ink);background:var(--accent-soft);padding:8px 10px;border-radius:4px;flex:1 1 320px;min-width:0;overflow-wrap:anywhere;user-select:all}
button{font:inherit;font-size:.9rem;color:var(--accent);background:transparent;border:1px solid var(--accent);border-radius:4px;padding:6px 14px;cursor:pointer}
button:hover{background:var(--accent-soft)}
button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.after{max-width:66ch;color:var(--ink-2)}

/* rules, stop signs, where */
.pair{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(340px,100%),1fr));gap:36px 48px}
.pair > div{display:flex;flex-direction:column;gap:16px}
ol.rules{padding-left:1.4em;display:flex;flex-direction:column;gap:7px;color:var(--ink-2)}
ol.rules li::marker{font-family:var(--mono);font-size:.85em;color:var(--range)}
ol.rules b{color:var(--ink);font-weight:600}
ul.stops{padding-left:1.1em;display:flex;flex-direction:column;gap:7px;color:var(--ink-2)}
dl.where{display:grid;grid-template-columns:minmax(0,13em) minmax(0,1fr);gap:10px 24px;max-width:82ch}
dl.where dt{font-weight:600}
dl.where dd{color:var(--ink-2)}
@media (max-width:560px){dl.where{grid-template-columns:1fr;gap:2px}dl.where dd{margin-bottom:10px}}
footer{border-top:1px solid var(--rule);padding-top:16px;font-size:.9rem;color:var(--muted);display:flex;flex-direction:column;gap:6px;max-width:80ch}
</style>"""

SCRIPT = r"""(function () {
  var MAIN = __MAIN__, SIDE = __SIDE__, NAMES = __NAMES__;
  var ALL = MAIN.concat(SIDE), KEY = 'planet-session-guide', done = {}, doc = null, writing = Promise.resolve();
  var kept = document.getElementById('kept');

  function local() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function keepLocal() { try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {} }
  function day(iso) {
    var d = new Date(iso + 'T12:00:00');
    return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  function paint() {
    var next = null;
    for (var i = 0; i < MAIN.length; i++) { if (!done[MAIN[i]]) { next = MAIN[i]; break; } }
    ALL.forEach(function (id) {
      var card = document.getElementById(id.toLowerCase());
      var box = document.getElementById('tick-' + id);
      var when = document.getElementById('when-' + id);
      var stop = document.querySelector('[data-stop="' + id + '"]');
      var isDone = !!done[id], isNext = id === next;
      if (card) {
        card.classList.toggle('done', isDone);
        card.classList.toggle('next', isNext);
        var chip = card.querySelector('.nextchip');
        if (chip) chip.hidden = !isNext;
      }
      if (box) box.checked = isDone;
      if (when) when.textContent = isDone ? day(done[id]) : '';
      if (stop) { stop.classList.toggle('done', isDone); stop.classList.toggle('next', isNext); }
    });
    var link = document.getElementById('here-link'), label = document.querySelector('#here .label');
    if (next) { link.textContent = NAMES[next]; link.setAttribute('href', '#' + next.toLowerCase()); label.textContent = 'Next'; }
    else { link.textContent = 'Layer 3: climate'; link.setAttribute('href', '#h-sessions'); label.textContent = 'All done'; }
  }

  function tick(id, on) {
    var now = {};
    Object.keys(done).forEach(function (k) { now[k] = done[k]; });
    if (on) now[id] = new Date().toISOString().slice(0, 10); else delete now[id];
    done = now; paint(); keepLocal();
    if (doc) {
      var body = { done: JSON.parse(JSON.stringify(done)) }, ref = doc;
      writing = writing.then(function () { return ref.set(body); }).catch(function () {
        kept.textContent = 'That tick could not be saved with the page. It is kept in this browser.';
      });
    }
  }

  ALL.forEach(function (id) {
    var box = document.getElementById('tick-' + id);
    if (box) box.addEventListener('change', function () { tick(id, box.checked); });
  });

  Array.prototype.forEach.call(document.querySelectorAll('button[data-copy]'), function (b) {
    b.addEventListener('click', function () {
      var el = document.getElementById(b.getAttribute('data-copy')), words = el.textContent;
      function back(t) { setTimeout(function () { b.textContent = 'Copy'; }, t); }
      function copied() { b.textContent = 'Copied'; back(1600); }
      function select() {
        var r = document.createRange(); r.selectNodeContents(el);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        b.textContent = 'Selected: press Ctrl+C'; back(3000);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(words).then(copied, select);
      else select();
    });
  });

  done = local();
  paint();

  // Kept with the page when the page can reach its own store; otherwise in this browser.
  if (window.claude && typeof window.claude.use === 'function') {
    window.claude.use('db').then(function (db) {
      if (!db) return;
      var ref = db.doc('progress/sessions');
      doc = ref;
      ref.onSnapshot(function (snap) {
        var body = snap.exists ? snap.data() : null, from = (body && body.done) || {}, now = {};
        Object.keys(from).forEach(function (k) { if (typeof from[k] === 'string') now[k] = from[k]; });
        done = now; paint(); keepLocal();
        kept.textContent = 'Your ticks are kept with this page, so they follow you to any device you open it on.';
      }, function () {
        doc = null;
        kept.textContent = 'Your ticks are kept in this browser.';
      });
    }).catch(function () {});
  }
})();"""

STANDALONE_HEAD = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
                   '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
                   '<style>html{color-scheme:light}body{margin:0}img{max-width:100%}[hidden]{display:none!important}'
                   '</style>\n')

if __name__ == "__main__":
    body = page()
    with io.open(os.path.join(HERE, "planet-session-guide.artifact.html"), "w", encoding="utf-8",
                 newline="\n") as f:
        f.write(body)
    title_end = body.index("</style>") + len("</style>")
    whole = STANDALONE_HEAD + body[:title_end] + "\n</head>\n<body>\n" + body[title_end:] + "\n</body>\n</html>\n"
    with io.open(os.path.join(HERE, "planet-session-guide.html"), "w", encoding="utf-8", newline="\n") as f:
        f.write(whole)
    print("wrote", len(body.encode("utf-8")), "bytes;", len(every_session()), "sessions")
