import { test, expect, type Page } from "@playwright/test";
import { waitForInteractive } from "./interactive";
import { verifyShowMe } from "./show-me";
import { FOLLOWUP_ROUNDS } from "@/lib/tasks/lesson-followups/content";

async function start(page: Page, key: string, lang: string) {
  await page.goto(`/lessons/${key}?lang=${lang}`);
  await waitForInteractive(page);
  await page.getByTestId("lesson-intro-start").click();
}
async function choose(page: Page, field: string, value: string) {
  if (field === "attachment") await page.getByTestId(`practice-attach-${value}`).click();
  else await page.getByTestId(`practice-field-${field}`).locator(`input[value="${value}"]`).check();
}
async function confirm(page: Page) {
  await page.getByTestId("practice-review-button").click();
  await expect(page.getByTestId("practice-review")).toBeVisible();
  await page.getByTestId("practice-confirm").click();
}
for (const lang of ["en", "es"]) {
  test(`absence lesson waits for both follow-ups and restarts (${lang})`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await start(page, "call-out-sick", lang);
    const card = page.locator("[data-job-card]");
    await page.locator('textarea[data-showme="compose-body"]').fill(lang === "en" ? "I cannot work today." : "No puedo trabajar hoy.");
    await page.locator('[data-showme="send-button"]').click();
    await expect(page.getByTestId("lesson-followup")).toHaveAttribute("data-round", "absence-policy");
    await verifyShowMe(page, lang === "en" ? "en" : "es", "followup-sources");
    await expect(page.getByTestId("lesson-practice-again")).toHaveCount(0);
    await choose(page, "contact", "email");
    await choose(page, "message", "shift");
    await page.getByTestId("practice-review-button").click();
    await expect(card).toContainText(lang === "en" ? "50 minutes" : "50 minutos");
    await expect(page.locator('input[value="shift"]')).toBeChecked();
    await choose(page, "contact", "call");
    await page.getByTestId("practice-review-button").click();
    await page.getByRole("button", { name: lang === "en" ? "Edit" : "Editar", exact: true }).click();
    await expect(page.locator('input[value="call"]')).toBeChecked();
    await confirm(page);
    await expect(page.getByTestId("lesson-followup")).toHaveAttribute("data-round", "absence-no-answer");
    await expect(page.getByTestId("lesson-practice-again")).toHaveCount(0);
    await choose(page, "contact", "desk");
    await choose(page, "message", "approved");
    await page.getByTestId("practice-review-button").click();
    await expect(card).toContainText(lang === "en" ? "Rosa has not answered" : "Rosa no ha contestado");
    await choose(page, "message", "pending");
    await confirm(page);
    await expect(page.getByTestId("lesson-practice-again")).toBeVisible();
    await page.getByTestId("lesson-practice-again").click();
    await expect(page.locator('textarea[data-showme="compose-body"]')).toHaveValue("");
    await expect(page.getByTestId("lesson-followup")).toHaveCount(0);
    expect(errors).toEqual([]);
  });
  test(`appointments require duration and handle no available time (${lang})`, async ({ page }) => {
    await start(page, "appointment-scheduling", lang);
    await page.locator('[data-showme="reason-select"]').selectOption("booked");
    await page.getByRole("row").filter({ hasText: "11:30" }).click();
    await page.locator('[data-showme="offer-button"]').click();
    await page.locator('[data-showme="confirm-body"]').fill(lang === "en" ? "You can come at 11:30." : "Puede venir a las 11:30.");
    await page.getByRole("button", { name: lang === "en" ? "Send confirmation" : "Enviar confirmación", exact: true }).click();
    await expect(page.getByTestId("lesson-followup")).toHaveAttribute("data-round", "appointment-duration");
    await choose(page, "start", "200");
    await choose(page, "end", "300");
    await page.getByTestId("practice-review-button").click();
    await expect(page.locator("[data-job-card]")).toContainText("15");
    await choose(page, "start", "230");
    await confirm(page);
    await choose(page, "existing", "cancel");
    await choose(page, "reply", "945");
    await page.getByTestId("practice-review-button").click();
    await expect(page.locator("[data-job-card]")).toContainText("10:15");
    await choose(page, "reply", "ask");
    await confirm(page);
    await expect(page.getByTestId("lesson-practice-again")).toBeVisible();
  });
}

for (const lang of ["en", "es"]) {
  test(`files change from viewing to authorized editing (${lang})`, async ({ page }) => {
    await start(page, "files", lang);
    await page.locator('[data-showme="shared-drive"]').click();
    await page.getByRole("button", { name: /sched_91426.pdf/ }).click();
    await page.locator('[data-showme="preview-rename"]').click();
    await page.locator('[data-showme="rename-input"]').fill("schedule-week-of-sep-14");
    await page.locator('[data-showme="rename-input"]').press("Enter");
    await page.locator('[data-showme="can-view"]').click();
    await page.getByRole("button", { name: lang === "en" ? "Share" : "Compartir", exact: true }).click();
    await expect(page.getByTestId("lesson-followup")).toHaveAttribute("data-round", "files-current");
    await choose(page, "file", "sep");
    await choose(page, "access", "view");
    await confirm(page);
    await choose(page, "person", "priya");
    await choose(page, "access", "view");
    await page.getByTestId("practice-review-button").click();
    await expect(page.locator("[data-job-card]")).toContainText(lang === "en" ? "will not let her make changes" : "no le permite hacer cambios");
    await choose(page, "access", "edit");
    await confirm(page);
    await expect(page.getByTestId("lesson-practice-again")).toBeVisible();
  });
  test(`attachments require removal and allow asking for a missing file (${lang})`, async ({ page }) => {
    await start(page, "mail-attach", lang);
    await page.locator('[data-showme="maria-row"]').click();
    await page.locator('[data-showme="reply-button"]').click();
    await page.getByRole("button", { name: lang === "en" ? "Your food handler certificate, today by 3 PM" : "Tu certificado de manipulador de alimentos, hoy antes de las 3 PM", exact: true }).click();
    await page.locator('[data-showme="attach-button"]').click();
    await page.getByRole("button", { name: /food-handler-certificate.pdf/ }).click();
    await page.locator('[data-showme="attach-confirm"]').click();
    await page.locator('[data-showme="compose-body"]').fill(lang === "en" ? "Here is my food handler certificate." : "Aquí está mi certificado de manipulador de alimentos.");
    await page.locator('[data-showme="send-button"]').click();
    await expect(page.getByTestId("lesson-followup")).toHaveAttribute("data-round", "attachment-replace");
    await choose(page, "message", "replaced");
    await page.getByTestId("practice-review-button").click();
    await expect(page.locator("[data-job-card]")).toContainText(lang === "en" ? "August is still attached" : "Agosto sigue adjunto");
    await page.getByRole("button", { name: lang === "en" ? "Remove attachment" : "Quitar adjunto" }).click();
    await choose(page, "attachment", "sep");
    await confirm(page);
    await choose(page, "attachment", "none");
    await choose(page, "message", "ask");
    await confirm(page);
    await expect(page.getByTestId("lesson-practice-again")).toBeVisible();
    await expect(page.getByTestId("practice-confirm")).toHaveCount(0);
  });
}

test("independent follow-up supports Help, keyboard choices and narrow screens", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto("/lessons/call-out-sick?mode=independent");
  await waitForInteractive(page);
  await page.getByTestId("lesson-intro-start").click();
  await page.locator('[data-showme="compose-body"]').fill("I cannot work today.");
  await page.locator('[data-showme="send-button"]').click();
  const card = page.locator("[data-job-card]");
  await expect(card).toContainText(FOLLOWUP_ROUNDS["call-out-sick"]![0].goal.en);
  await expect(card).not.toContainText("Workplaces have different contact rules.");
  expect(await page.evaluate(() => localStorage.getItem("lesson-attempt:call-out-sick:guest"))).toBeNull();
  await card.getByTestId("job-card-help").click();
  await expect(card).toContainText("Workplaces have different contact rules.");
  await card.getByRole("button", { name: "Back to my task", exact: true }).click();
  await expect(card).toContainText(FOLLOWUP_ROUNDS["call-out-sick"]![0].goal.en);
  await page.screenshot({ path: "test-results/expanded-lesson-desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  // Keyboard navigation uses the native radio group, including the correct final option.
  const first = page.getByTestId("practice-field-contact").locator('input[value="email"]');
  await first.focus();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await expect(page.getByTestId("practice-field-contact").locator('input[value="call"]')).toBeChecked();
  await choose(page, "message", "shift");
  await confirm(page);
  await choose(page, "contact", "desk");
  await choose(page, "message", "pending");
  await confirm(page);
  await expect(page.getByTestId("lesson-practice-again")).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("lesson-attempt:call-out-sick:guest") || "null")?.attempts)).toBe(1);
  await page.screenshot({ path: "test-results/expanded-lesson-phone.png" });
});
