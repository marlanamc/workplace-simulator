import { test, expect, type Page } from "@playwright/test";
import { continuePastStudioArrival } from "./studio-arrival";

/**
 * The golden path a brand-new learner walks in their first minutes:
 * sign up → open the tour from the Job Card → follow the walkthrough → finish
 * Level 0 → the next job (Mail) is one blue button away.
 *
 * Each run signs up a fresh throwaway learner (unique name, test class
 * code), so runs never collide with each other or with real accounts.
 */

const CLASS_CODE = "TEST-E2E";

/** The card, wherever it is parked. It is on every screen. */
function jobCard(page: Page) {
  return page.locator("[data-job-card]");
}

/**
 * A brand-new learner lands on the desktop and meets the Job Card first.
 * Three beats: welcome, drag, then shrink. Moving to another corner and
 * clicking the collapse arrow advance the two practice beats.
 */
async function clearIntroBeats(page: Page, firstName: string) {
  const card = jobCard(page);
  await expect(card.getByText(`Welcome, ${firstName}`, { exact: false })).toBeVisible({
    timeout: 20_000,
  });
  await card.getByRole("button", { name: "OK", exact: true }).click();
  await expect(card.getByText("Drag the blue top of this card to a corner.")).toBeVisible();
  await expect(card.getByRole("button", { name: "I understand", exact: true })).toHaveCount(0);
  const handle = card.getByTestId("job-card-drag-handle");
  const box = await handle.boundingBox();
  if (!box) throw new Error("Job Card drag handle is not visible");
  // A click and a short drag within the same corner must not skip practice.
  const x = box.x + 35;
  const y = box.y + box.height / 2;
  await page.mouse.click(x, y);
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 15, y - 15, { steps: 3 });
  await page.mouse.up();
  await expect(card.getByText("Drag the blue top of this card to a corner.")).toBeVisible();
  await expect(card).toHaveAttribute("data-corner", "bl");
  const current = await handle.boundingBox();
  if (!current) throw new Error("Job Card drag handle is not visible");
  await page.mouse.move(current.x + 35, current.y + current.height / 2);
  await page.mouse.down();
  await page.mouse.move(current.x + 35, 50, { steps: 12 });
  await page.mouse.up();
  await expect(card).toHaveAttribute("data-corner", "tl");
  await expect(card.getByText("Click the arrow to shrink it.")).toBeVisible();
  await card.getByTestId("job-card-collapse").click();
}

async function signUp(page: Page, name: string, enterDesktop = true) {
  await page.goto("/login");
  // The lock screen shows a user picker first; new learners go through Add user.
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(name);
  await page.getByPlaceholder("HARBOR-24").fill(CLASS_CODE);
  // The PIN is a segmented input, so type it rather than fill it.
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await expect(page.getByTestId("simulator-welcome")).toBeVisible({ timeout: 20_000 });
  await expect(page.locator("[data-job-card]")).toHaveCount(0);
  if (enterDesktop) await page.getByTestId("welcome-continue").click();
}

test("first session: sign up, finish the walkthrough, see the next job", async ({ page }) => {
  const name = `E2e ${Date.now()}`;
  await signUp(page, name);
  await clearIntroBeats(page, "E2e");

  // The card names the first job and its button is what opens the Browser —
  // the desktop → job → desktop loop, learned on the very first tap.
  const card = jobCard(page);
  await expect(card.getByText("Look around this computer.")).toBeVisible();

  // Start would open a second map of the same computer. Keep them on the card.
  await page.getByTestId("shelf-start").click();
  await expect(page.getByPlaceholder("Search your apps and tasks")).toHaveCount(0);
  await expect(card.getByText("looking around", { exact: false })).toBeVisible();

  await card.getByRole("button", { name: "Open the Web Browser" }).click();

  // First a look beat: the address bar and back arrow are display-only here;
  // you navigate with the bookmarks.
  await expect(page.getByText("These are your bookmarks.", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Show me", exact: true }).click();

  // One instruction at a time; it advances only on the real click.
  await expect(page.getByText("Click Mail.")).toBeVisible();
  await page.getByTestId("bookmark-mail").click();

  // Pause on Mail so they notice it is their work email.
  await expect(page.getByText("This is your work email.", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "I understand" }).click();

  // Spotlight the real Help control — the ? on the Job Card.
  await expect(card.getByText("Tap the ? on this card to try Help.")).toBeVisible();
  await page.getByTestId("job-card-help").click();
  await expect(card.getByText("Where to look", { exact: true })).toBeVisible();

  // Help is in the Job Card. Close it with the same visible control a learner uses.
  await card.getByRole("button", { name: "I understand. Back to my task", exact: true }).click();
  await expect(card.getByText("You tried Help. You are ready for your first task.")).toBeVisible();
  await page.getByRole("button", { name: "I'm ready for the task" }).click();

  // Level 0 done — the level-up celebration takes over, and its one button
  // hands off to the first real job.
  await expect(page.getByText("You know how this computer works.")).toBeVisible();
  await page.getByRole("button", { name: "Open my first task" }).click();

  // Day One: the list on the shelf is now real. Point at the orange pin so
  // nobody has to know the word "briefcase".
  await expect(jobCard(page).getByText("orange button on the bottom bar", { exact: false })).toBeVisible();
  const spotlight = page.getByTestId("task-list-spotlight");
  await expect(spotlight).toHaveCount(1);
  const outline = await spotlight.boundingBox();
  const viewport = page.viewportSize();
  if (!outline || !viewport) throw new Error("Missing spotlight geometry");
  expect(outline.x).toBeGreaterThanOrEqual(4);
  expect(outline.y).toBeGreaterThanOrEqual(4);
  expect(outline.x + outline.width).toBeLessThanOrEqual(viewport.width - 4);
  expect(outline.y + outline.height).toBeLessThanOrEqual(viewport.height - 4);
  await expect(page.getByTestId("shelf-my-job")).not.toHaveClass(/animate-showme-pulse/);
  await page.screenshot({ path: test.info().outputPath("task-list-introduction.png"), animations: "disabled" });
  await jobCard(page).getByRole("button", { name: "I understand" }).click();

  // Mail is open: Maria's email is findable in the inbox. Scope to the inbox —
  // "Maria Delgado" also appears in the desktop briefing behind the window.
  await expect(
    page.getByText("Maria Delgado", { exact: true }).first(),
  ).toBeVisible({ timeout: 15_000 });
});

test("the job card introduces itself on an empty desktop, then names the job", async ({ page }) => {
  await signUp(page, `E2e Card ${Date.now()}`);

  // Screen one is the desktop, not a browser window: no tab strip, no
  // bookmark bar, no welcome modal. Only the card is talking.
  await expect(jobCard(page)).toBeVisible({ timeout: 20_000 });
  await expect(page.locator('[data-testid="bookmark-mail"]')).toHaveCount(0);
  await clearIntroBeats(page, "E2e");

  // Past the beats it becomes the job card and names the next job. The first
  // day is the one-task tour, so there is deliberately no "Task 1 of 1"
  // counter — the day's name carries the position on its own.
  await expect(jobCard(page).getByText("How this works", { exact: true })).toBeVisible();
  await expect(jobCard(page).getByText("of 1", { exact: false })).toHaveCount(0);
});

test("the job card follows the learner into the app and drives the job", async ({ page }) => {
  await signUp(page, `E2e Drive ${Date.now()}`);
  await expect(jobCard(page)).toBeVisible({ timeout: 20_000 });

  await page.goto("/studio");
  await page.getByRole("button", { name: "Start of Day 3: Clock-In Fix" }).click();
  await continuePastStudioArrival(page, /^Clock in$|^Marcar entrada$/);

  // The card is still there once an app window is open - that is the whole
  // point of it: the surface that sets up the job does not vanish.
  const card = jobCard(page);
  await expect(card).toBeVisible({ timeout: 20_000 });
  await expect(card.getByText("Task ", { exact: false })).toBeVisible();
});

test("studio time machine teleports one account to a later level", async ({ page }) => {
  const name = `E2e Tm ${Date.now()}`;
  await signUp(page, name);
  await expect(jobCard(page)).toBeVisible({ timeout: 20_000 });

  await page.goto("/studio");
  await page.getByRole("button", { name: "Start of Day 5: The Sick Call" }).click();
  await continuePastStudioArrival(page, /Write to Maria|Escribirle a Maria/);

  // Celebration opens Mail into compose; Job Card is already on the write step.
  await expect(jobCard(page).getByText("Write one short line.")).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole("heading", { name: "Can't come in today" })).toBeVisible();
});

test("language choice on the login page sticks after signing in and reloading", async ({ page }) => {
  const name = `E2e Es ${Date.now()}`;
  await page.goto("/login");
  await page.getByRole("button", { name: "Español" }).click();
  await expect(page.getByText("Chromebook de práctica. Nada aquí es real.")).toBeVisible();

  await page.getByRole("button", { name: "Agregar usuario" }).click();
  await page.getByPlaceholder("Jordan").fill(name);
  await page.getByPlaceholder("HARBOR-24").fill(CLASS_CODE);
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: "Agregar", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Te damos la bienvenida al Simulador de Trabajo" })).toBeVisible();
  await page.reload();
  await expect(page.getByTestId("simulator-welcome")).toBeVisible();
  await page.getByTestId("welcome-continue").click();


  // The card greets them in Spanish...
  const spanishIntro = jobCard(page).getByText("Bienvenida", { exact: false });
  await expect(spanishIntro).toBeVisible({ timeout: 20_000 });

  // ...and a reload does NOT silently reset them to English.
  await page.reload();
  await expect(spanishIntro).toBeVisible({ timeout: 20_000 });

  // Exercise the full translated tour and manual card recovery at Chromebook size.
  await page.setViewportSize({ width: 1024, height: 768 });
  const card = jobCard(page);
  await card.getByRole("button", { name: "OK", exact: true }).click();
  await expect(card.getByText("Arrastra la parte azul de esta tarjeta a una esquina.")).toBeVisible();
  const handle = card.getByTestId("job-card-drag-handle");
  await handle.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(card.getByText("Arrastra la parte azul de esta tarjeta a una esquina.")).toBeVisible();
  await page.keyboard.press("ArrowUp");
  await expect(card).toHaveAttribute("data-corner", "tl");
  await expect(card.getByText("Haz clic en la flecha para encogerla.")).toBeVisible();
  await card.getByTestId("job-card-collapse").click();
  await expect(card.getByText("Conoce esta computadora.")).toBeVisible();
  await card.getByTestId("job-card-collapse").click();
  await expect(card.getByTestId("job-card-collapse")).toHaveAttribute("aria-expanded", "false");
  await card.getByTestId("job-card-collapse").click();
  await card.getByRole("button", { name: "Abrir el navegador web", exact: true }).click();
  await expect(card.getByText("Estos son tus marcadores.", { exact: false })).toBeVisible();
  await card.getByRole("button", { name: "Muéstramelos", exact: true }).click();
  await page.getByTestId("bookmark-mail").click();
  await card.getByRole("button", { name: "Entiendo", exact: true }).click();
  await expect(card.getByText("Toca el ? en esta tarjeta para probar Ayuda.")).toBeVisible();
  await card.getByTestId("job-card-help").click();
  await expect(card.getByText("Dónde mirar", { exact: true })).toBeVisible();
  await card.getByRole("button", { name: "Entiendo. Volver a mi tarea", exact: true }).click();
  await card.getByRole("button", { name: "Estoy listo para la tarea", exact: true }).click();
  await page.getByRole("button", { name: "Abrir mi primera tarea", exact: true }).click();
  await expect(card.getByText("Este botón naranja en la barra de abajo abre tu lista de tareas.")).toBeVisible();
  await card.getByRole("button", { name: "Entiendo", exact: true }).click();
  await expect(page.getByText("Maria Delgado", { exact: true }).first()).toBeVisible();
});

test("schedule: repeated wrong days get specific help and the correct day still opens the swap", async ({ page }) => {
  await signUp(page, `E2e Schedule ${Date.now()}`);
  await expect(jobCard(page)).toBeVisible({ timeout: 20_000 });
  await page.goto("/studio");
  await page.getByRole("button", { name: "Start of Day 2: The First Week", exact: true }).click();
  await continuePastStudioArrival(page, /See my schedule|Ver mi horario/);
  // Arrival CTA already opens Portal — the Job Card is on the schedule step.
  await expect(jobCard(page).getByText("personal calendar on your phone", { exact: false })).toBeVisible();
  await expect(page.getByText("Your personal calendar")).toBeVisible();
  await expect(page.getByRole("heading", { name: "My Calendar" })).toBeVisible();
  await page.getByTitle("Cambiar a español").click();
  await expect(jobCard(page).getByText("calendario personal de tu teléfono", { exact: false })).toBeVisible();
  await expect(page.getByText("Tu calendario personal")).toBeVisible();
  await page.getByTitle("Switch to English").click();
  const swaps = page.getByRole("button", { name: "Request a swap", exact: true });
  await swaps.nth(0).click();
  await expect(jobCard(page).getByText("That shift is fine.", { exact: false })).toBeVisible();
  await expect(jobCard(page).getByText("Look at Thursday, Aug 27.", { exact: false })).toHaveCount(0);
  await swaps.nth(1).click();
  await expect(jobCard(page).getByText("Look at Thursday, Aug 27.", { exact: false }).first()).toBeVisible();
  await swaps.nth(2).click();
  await expect(page.getByRole("combobox").first()).toHaveValue("Thu");
  await expect(jobCard(page).getByText("Look at Thursday, Aug 27.", { exact: false })).toHaveCount(0);
  await expect(jobCard(page).getByText("personal calendar on your phone", { exact: false })).toBeVisible();
  await expect(page.getByRole("heading", { name: "My Calendar" })).toBeVisible();
  await expect(page.getByText("Your personal calendar")).toBeVisible();
  await expect(page.getByText("Which shift could you work instead?")).toBeVisible();
});

test("payday starts with a forgotten clock-in, not clock-out", async ({ page }) => {
  await signUp(page, `E2e Timeclock ${Date.now()}`);
  await expect(jobCard(page)).toBeVisible({ timeout: 20_000 });
  await page.goto("/studio");
  await page.getByRole("button", { name: "Start of Day 3: Clock-In Fix", exact: true }).click();
  await continuePastStudioArrival(page, /^Clock in$|^Marcar entrada$/);
  // Arrival CTA already opens the Time Clock — no separate "Next: Clock in" handoff.
  await expect(jobCard(page).getByText("You got here at 7.", { exact: false })).toBeVisible();
  await expect(page.getByText("Not clocked in")).toBeVisible();
  await expect(page.getByText("Now 8:15 AM")).toBeVisible();
  await expect(page.getByRole("button", { name: "Clock In", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Clock Out", exact: true })).toHaveCount(0);
  await jobCard(page).getByTestId("job-card-collapse").click();
  await page.getByRole("button", { name: "Clock In", exact: true }).click();
  await expect(page.getByText("Clock-in time", { exact: true })).toBeVisible();
  await expect(page.getByText("8:15 AM").first()).toBeVisible();
  await expect(page.getByText("You arrived", { exact: true })).toHaveCount(0);
  await jobCard(page).getByTestId("job-card-collapse").click();
  await page.getByRole("button", { name: "Looks right", exact: true }).click();
  await expect(jobCard(page).getByText("You got here at 7:00 AM", { exact: false })).toBeVisible();
  await expect(page.getByRole("button", { name: "Something looks wrong. Message my supervisor", exact: true })).toBeVisible();
});

test("welcome explains the purpose, supports language choice, and stays dismissed on reload", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await signUp(page, `E2e Welcome ${Date.now()}`, false);
  const welcome = page.getByTestId("simulator-welcome");
  await expect(welcome.getByRole("heading", { level: 1 })).toHaveText("Welcome to the Workplace Simulator");
  await expect(welcome.getByRole("listitem")).toHaveCount(5);
  await expect(welcome.getByRole("link", { name: "mcreed@ebhcs.org" })).toHaveAttribute("href", "mailto:mcreed@ebhcs.org");
  await expect(welcome.getByText("Your first job: Harborside Cafe", { exact: false })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath("welcome-en.png"), fullPage: true, animations: "disabled" });
  await welcome.getByRole("button", { name: "Español", exact: true }).click();
  await expect(welcome.getByRole("heading", { level: 1 })).toHaveText("Te damos la bienvenida al Simulador de Trabajo");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByTestId("welcome-continue").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("welcome-continue")).toBeVisible();
  await page.screenshot({ path: test.info().outputPath("welcome-es-mobile.png"), fullPage: true, animations: "disabled" });
  await page.getByTestId("welcome-continue").click();
  await expect(jobCard(page)).toBeVisible();
  await page.reload();
  await expect(page.getByTestId("simulator-welcome")).toHaveCount(0);
  await expect(jobCard(page)).toBeVisible();
});
