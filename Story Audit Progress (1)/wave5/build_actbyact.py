"""Rebuild the report's "Act by act" view from act_status.json and the verdicts-*.json files.
Run: python3 wave5/build_actbyact.py  (from the "Story Audit Progress (1)" folder).
Edit act_status.json (status, statusLabel, plan checkboxes) to update it."""
import json, glob, html, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
REPORT = os.path.join(HERE, "..", "index.html")
acts = json.load(open(os.path.join(HERE, "act_status.json")))["acts"]
verdicts = {}
for f in glob.glob(os.path.join(HERE, "verdicts-*.json")):
    verdicts.update(json.load(open(f)))
s = open(REPORT).read()
names = dict((m.group(2), m.group(1)) for m in re.finditer(r'<tr><td class="k">([^<]*)<small>([^<]*)</small>', s))
CLS = {"clean": "ok", "friction": "warn", "blocks": "bad", "broken": "bad", "partial": ""}
LABEL = {"clean": "Clean", "friction": "Friction", "blocks": "Blocks", "broken": "Broken", "partial": "Not fully graded"}
STATUS = {"progress": "st-next", "waiting": "st-planned", "signoff": "st-review", "done": "st-merged"}
out = ['<section id="actbyact" aria-labelledby="abya-h">',
       '<h2 id="abya-h">Act by act</h2>',
       '<p class="small">' + " · ".join(f'<a href="#abya-{a["key"]}">{html.escape(a["title"].split(" · ")[0] + (" " + a["title"].split(" · ")[1] if a["key"] in ("college","frontdesk") else ""))}</a>' for a in acts) + '</p>',
       '<p class="muted prose">One act at a time, slowly. The next act starts only after the owner signs off on the current one. Verdicts are from the Wave 5 re-audit (29 Sep, build 469078f), except Act I, which is from the Phase 3 replays (30 Sep, main after PR #56, with the N-7 to N-9 fixes in PR #57); the full notes are in each segment report and <code>wave5/phase3/</code>.</p>']
for a in acts:
    rows = []
    counts = {}
    for key in a["rows"]:
        v = verdicts.get(key)
        name = names.get(key, key)
        if not v:
            rows.append(f'<li><b>{html.escape(name)}</b> <span class="muted">not graded</span></li>'); continue
        counts[v["ui"]] = counts.get(v["ui"], 0) + 1
        rows.append(f'<li><span class="v {CLS[v["ui"]]}">{LABEL[v["ui"]]}</span><b>{html.escape(name)}</b> <span class="muted">· learning {v["learn"]}</span><br><span class="small">{v["note"]}</span></li>')
    ORDER = ["broken", "blocks", "friction", "partial", "clean"]
    SING = {"blocks": "block", "broken": "broken", "friction": "friction", "partial": "not fully graded", "clean": "clean"}
    tally = " · ".join(f'{counts[k]} {SING[k] if counts[k] == 1 else LABEL[k].lower()}' for k in ORDER if k in counts)
    plan = ""
    if a.get("plan"):
        items = "".join(f'<li><span aria-hidden="true">{"☑" if done else "☐"}</span> {html.escape(t)}</li>' for t, done in a["plan"])
        plan = f'<h4>Fix-up checklist</h4><ul class="abya-plan">{items}</ul><p class="small muted">Plan: {a.get("planNote", "<code>curriculum/act-1-fixup-plan.md</code>")}.</p>'
    if a.get("decisions"):
        plan += '<h4>Owner decisions needed</h4><ul>' + "".join(f"<li>{html.escape(d)}</li>" for d in a["decisions"]) + "</ul>"
    finds = "".join(f"<li>{f}</li>" for f in a["findings"])
    out.append(f'''<article class="abya-act" id="abya-{a["key"]}">
<div class="abya-head"><h3>{html.escape(a["title"])} <span class="muted small">{html.escape(a["days"])}</span></h3><span class="st {STATUS[a["status"]]}">{html.escape(a["statusLabel"])}</span></div>
<p class="small"><b>Wave 5:</b> {tally or "not graded"} · <a href="wave5/segment-{a["seg"]}.md">Segment {a["seg"]} report</a></p>
<details{" open" if a["status"]=="progress" else ""}><summary>Sittings and findings</summary>
<h4>Key findings</h4><ul>{finds}</ul>
<h4>Sittings</h4><ul class="abya-rows">{"".join(rows)}</ul>
</details>
{plan}
</article>''')
out.append("</section>")
block = "\n".join(out)
s = re.sub(r'<section id="actbyact".*?</section>', lambda m: block, s, flags=re.S) if 'id="actbyact"' in s else s.replace('<section class="progress now" id="progress"', block + '\n\n<section class="progress now" id="progress"', 1)
open(REPORT, "w").write(s)
print("act-by-act view rebuilt:", len(acts), "acts")
