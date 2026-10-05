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
// Discover every Show me reporter, including shared lesson and non-Task views.
const reporters = readdirSync(join(process.cwd(), "src"), { recursive: true, encoding: "utf8" })
  .filter((path) => path.endsWith(".tsx"))
  .map((path) => join(process.cwd(), "src", path))
  .filter((path) => /onShowMe=/.test(readFileSync(path, "utf8")));
const taskFiles = [...new Set([
  ...readdirSync(TASK_DIR)
    .filter((f) => f.endsWith("Task.tsx"))
    .map((f) => join(TASK_DIR, f)),
  ...reporters,
])];

function read(path: string) {
  const src = readFileSync(path, "utf8");
  // A task that draws its document in a sibling file (OnboardingFormsTask ->
  // W4Document) marks its Show me targets there, so those count as its own.
  const dir = path.slice(0, path.lastIndexOf("/"));
  const children = [...src.matchAll(/from ["']\.\/([A-Za-z0-9]+)["']/g)]
    .map((m) => join(dir, `${m[1]}.tsx`))
    .filter((child) => { try { readFileSync(child); return true; } catch { return false; } })
    .map((child) => readFileSync(child, "utf8"));
  // Offline recovery intentionally points outside the app, at the shelf.
  const shell = path.endsWith("OfflinePage.tsx") ? readFileSync(join(process.cwd(), "src/components/Shelf.tsx"), "utf8") : "";
  return { name: path.split("/").pop()!, src, targetsSrc: [src, ...children, shell].join("\n") };
}
const tasks = taskFiles.map(read);

/**
 * Ids the task can hand to the spotlight, from wherever it builds them.
 * Comparison operands are dropped first: `view === "list" ? "swap-button"`
 * names one target, not two, and "list" is a view rather than a control.
 */
function showMeIds(src: string): string[] {
  const ids = new Set<string>();
  for (const m of src.matchAll(/const (?:showMeIds?|SHOW_ME_IDS|APPT_SHOW_ME)\s*=([\s\S]*?);\n/g)) {
    const chosen = m[1].replace(/`[^`]*`/g, "").replace(/[!=]==?\s*["'][^"']*["']/g, "");
    for (const q of chosen.matchAll(/["']([a-z0-9-]+)["']/g)) ids.add(q[1]);
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
    else for (const q of m[2].matchAll(/["']([a-z0-9-]+)["']/g)) ids.add(q[1]);
  }
  for (const m of src.matchAll(/showMeId=["']([a-z0-9-]+)["']/g)) ids.add(m[1]);
  // A shared component that renders the target itself (PickerModal's
  // `showMeList` / `showMeConfirm`) takes the id as a prop.
  for (const m of src.matchAll(/showMe(?:Row|List|Confirm):\s*"([a-z0-9-]+)"/g)) ids.add(m[1]);
  return [...ids];
}

describe("job card wiring", () => {
  it.each(tasks)("$name points Show me at a control that exists", ({ src, targetsSrc }) => {
    const targets = showMeTargets(targetsSrc);
    for (const id of showMeIds(src)) {
      // A named id with no matching `data-showme` means pressing Show me
      // highlights nothing at all, and says nothing about why.
      expect(targets, `no data-showme="${id}" for this step`).toContain(id);
    }
  });

  it.each(tasks)("$name offers Show me only when it can point somewhere", ({ src, targetsSrc }) => {
    if (!/onShowMe=/.test(src)) return;
    expect(showMeTargets(targetsSrc).length, "offers Show me but marks no target").toBeGreaterThan(0);
    expect(src, "offers Show me but never renders the spotlight").toContain("ShowMeHighlight");
  });

  it.each(tasks)("$name sends its corrections to the card", ({ src }) => {
    if (!/\bsay\(|\brecordWrong\(/.test(src)) return;
    // NudgeToast is the seam that routes a wrong click into the card's
    // correction block. Without it the coaching is computed and discarded.
    expect(src, "coaches the learner but never mounts the correction seam").toContain("NudgeToast");
  });

  it.each(tasks)("$name hands Help to the card when it has a Help drawer", ({ src }) => {
    if (!src.includes("<HelpDrawer")) return;
    if (!src.includes("<RightNowBar")) return;
    // Without onHelp the card has no ?, and the lesson stays buried in the
    // window header — the one place a lost learner is not looking.
    expect(src, "has Help but never hands it to the card").toMatch(/<RightNowBar[\s\S]*onHelp=/);
  });

  it.each(tasks)("$name names its own finish", ({ src }) => {
    if (!src.includes("<TaskDoneActions")) return;
    const call = src.match(/<TaskDoneActions[\s\S]*?\/>/)![0];
    // Without a kicker the card's green header falls back to a generic word,
    // and the learner is told "Done" instead of what they just did.
    expect(call, "finishes without telling the card what was finished").toMatch(/kicker=/);
  });

  // Wave 5 F-9/F-22: the card says "Done" only for the job just completed,
  // matched by this key. A wrong key would silently hide a real finish, so a
  // literal key must be a job this same file checks or completes.
  it.each(tasks)("$name labels its finish with a job it owns", ({ src }) => {
    if (!src.includes("<TaskDoneActions") && !src.includes("<DoneBlock")) return;
    const keys = [...src.matchAll(/<(?:TaskDoneActions|DoneBlock)\s+taskKey="([a-z0-9-]+)"/g)].map((m) => m[1]);
    for (const key of keys) {
      expect(src, `finish labelled "${key}" but this file never checks or completes it`).toMatch(
        new RegExp(`(includes|markComplete)\\(\\s*["']${key}["']`),
      );
    }
    const calls = src.match(/<TaskDoneActions[\s\S]*?\/>/g) ?? [];
    for (const call of calls) expect(call, "finish without a taskKey").toMatch(/taskKey=/);
  });
});
