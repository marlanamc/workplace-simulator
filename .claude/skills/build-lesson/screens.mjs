// Screenshots of one lesson at Chromebook size (1366x768), for the learner-view check.
//
//   node .claude/skills/build-lesson/screens.mjs <taskKey> [en|es] [guided|independent]
//
// Needs the dev server on http://localhost:3000. Saves the intro screen, the
// first task screen, and the Show me spotlight (Guided only) to a temp folder
// and prints the paths. Later steps: drive them yourself with Playwright.
import { chromium } from "playwright";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [taskKey, lang = "en", mode = "guided"] = process.argv.slice(2);
if (!taskKey) {
  console.error("Usage: node .claude/skills/build-lesson/screens.mjs <taskKey> [en|es] [guided|independent]");
  process.exit(1);
}

const out = mkdtempSync(join(tmpdir(), `lesson-${taskKey}-`));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

const shot = async (name) => {
  const path = join(out, `${name}.png`);
  await page.screenshot({ path });
  console.log(path);
};

await page.goto(`http://localhost:3000/lessons/${taskKey}?lang=${lang}&mode=${mode}`);
await page.getByTestId("lesson-intro").waitFor();
await shot("1-intro");

await page.getByTestId("lesson-intro-start").click();
// Past the info card's arrival pulse, so the shot shows the resting state.
await page.waitForTimeout(5500);
await shot("2-task");

const showMe = page.locator("[data-job-card]").getByRole("button", { name: /^(Show me|Muéstrame)$/ });
if (await showMe.count()) {
  await showMe.click();
  await page.waitForTimeout(400);
  await shot("3-show-me");
} else if (mode === "guided") {
  console.log("NOTE: no Show me on the first step. Is there nothing to click?");
}

if (errors.length) console.log("Page errors:", errors);
await browser.close();
