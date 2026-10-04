"""Add Wave 5 re-audit verdicts (Now view only) to the report's Verdicts table.
Rows are matched by their <small> level text. Re-running replaces earlier Wave 5 lines."""
import json, re, sys
REPORT = "/Users/marlanacreed/Downloads/Projects/Workplace-simulator/Story Audit Progress (1)/index.html"
data = json.load(open(sys.argv[1]))
s = open(REPORT).read()
if ".w5{" not in s:
    s = s.replace("</style>", ".w5{display:block;margin-top:6px;font-size:12px;line-height:1.4;color:var(--muted)}.w5 b{font-weight:600}.w5 .v{font-size:11px;margin-right:4px}\n</style>", 1)
CLS = {"clean": "ok", "friction": "warn", "blocks": "bad", "broken": "bad", "partial": ""}
LABEL = {"clean": "Clean", "friction": "Friction", "blocks": "Blocks beginners", "broken": "Broken", "partial": "Not fully graded"}
for small, v in data.items():
    pat = re.compile(r'(<tr><td class="k">[^<]*<small>' + re.escape(small) + r'</small></td><td>)(.*?)(</td>)', re.S)
    m = pat.search(s)
    if not m:
        print("NO ROW:", small); continue
    cell = re.sub(r'<span class="now w5">.*?</span></span>', "", m.group(2), flags=re.S)
    line = (f'<span class="now w5"><span class="v {CLS[v["ui"]]}">Wave 5 · {LABEL[v["ui"]]}</span>'
            f'<b>Learning:</b> {v["learn"]}. {v["note"]} <span class="muted">(Segment {v["seg"]})</span></span>')
    s = s[:m.start()] + m.group(1) + cell + line + m.group(3) + s[m.end():]
open(REPORT, "w").write(s)
print("updated", len(data))
