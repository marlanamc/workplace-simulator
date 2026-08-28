import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * The Job Card is the only surface that tells a learner what to do, and every
 * task feeds it through the same four seams. Each seam fails *silently* when
 * it is left unconnected - the card keeps rendering, just without the thing
 * the task meant to say - so none of these show up as a crash or a type
 * error. They show up as a learner stuck in front of a card that has stopped
 * being true. Hence a test.
 */

const TASK_DIR = join(process.cwd(), "src/app/browser");
const EXTRA = [join(process.cwd(), "src/app/mail/MailClient.tsx")];

const taskFiles = [
  ...readdirSync(TASK_DIR)
    .filter((f) => f.endsWith("Task.tsx"))
    .map((f) => join(TASK_DIR, f)),
  ...EXTRA,
];

function read(path: string) {
  return { name: path.split("/").pop()!, src: readFileSync(path, "utf8") };
}
const tasks = taskFiles.map(read);

/**
 * Ids the task can hand to the spotlight, from wherever it builds them.
 * Comparison operands are dropped first: `view === "list" ? "swap-button"`
 * names one target, not two, and "list" is a view rather than a control.
 */
function showMeIds(src: string): string[] {
  const ids = new Set<string>();
  for (const m of src.matchAll(/const showMeId\s*=([\s\S]*?);\n/g)) {
    const chosen = m[1].replace(/[!=]==?\s*"[^"]*"/g, "");
    for (const q of chosen.matchAll(/"([a-z0-9-]+)"/g)) ids.add(q[1]);
  }
  for (const m of src.matchAll(/toggleFor\(\s*"([a-z0-9-]+)"\s*\)/g)) ids.add(m[1]);
  for (const m of src.matchAll(/setShowMeTarget\([^)]*?"([a-z0-9-]+)"/g)) ids.add(m[1]);
  return [...ids];
}

/** Ids the task actually marks on a control, literal or conditional. */
function showMeTargets(src: string): string[] {
  const ids = new Set<string>();
  for (const m of src.matchAll(/data-showme=(?:"([a-z0-9-]+)"|\{([^}]*)\})/g)) {
    if (m[1]) ids.add(m[1]);
    else for (const q of m[2].matchAll(/"([a-z0-9-]+)"/g)) ids.add(q[1]);
  }
  return [...ids];
}

describe("job card wiring", () => {
  it.each(tasks)("$name points Show me at a control that exists", ({ src }) => {
    const targets = showMeTargets(src);
    for (const id of showMeIds(src)) {
      // A named id with no matching `data-showme` means pressing Show me
      // highlights nothing at all, and says nothing about why.
      expect(targets, `no data-showme="${id}" for this step`).toContain(id);
    }
  });

  it.each(tasks)("$name offers Show me only when it can point somewhere", ({ src }) => {
    if (!/onShowMe=/.test(src)) return;
    expect(showMeTargets(src).length, "offers Show me but marks no target").toBeGreaterThan(0);
    expect(src, "offers Show me but never renders the spotlight").toContain("ShowMeHighlight");
  });

  it.each(tasks)("$name sends its corrections to the card", ({ src }) => {
    if (!/\bsay\(|\brecordWrong\(/.test(src)) return;
    // NudgeToast is the seam that routes a wrong click into the card's
    // correction block. Without it the coaching is computed and discarded.
    expect(src, "coaches the learner but never mounts the correction seam").toContain("NudgeToast");
  });

  it.each(tasks)("$name names its own finish", ({ src }) => {
    if (!src.includes("<TaskDoneActions")) return;
    const call = src.match(/<TaskDoneActions[\s\S]*?\/>/)![0];
    // Without a kicker the card's green header falls back to a generic word,
    // and the learner is told "Done" instead of what they just did.
    expect(call, "finishes without telling the card what was finished").toMatch(/kicker=/);
  });
});
