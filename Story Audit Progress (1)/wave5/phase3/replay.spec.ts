import { test, expect, type Locator } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

/**
 * Phase 3: Act I replayed from a fresh sign-up, straight through, the way a
 * learner plays it. No Studio, no test hooks for moving between days: only
 * what is on screen. Each day also gets a wrong try, Help, a reload mid-task,
 * another app opened mid-task, and a sign-out/sign-in between days.
 *
 * Every step takes a screenshot and an audit (what has focus, which visible
 * controls are under the Job Card, runaway scroll areas, English words in
 * Spanish mode). The audits go to log.jsonl for review.
 */

type Lang = "en" | "es";
const RUNS: { lang: Lang; w: number; h: number; kb: boolean }[] = [
  { lang: "en", w: 1366, h: 768, kb: true },
  { lang: "en", w: 911, h: 512, kb: false },
  { lang: "es", w: 1366, h: 768, kb: false },
  { lang: "es", w: 911, h: 512, kb: true },
];
const ONLY = process.env.REPLAY_ONLY; // e.g. "es-911"
const OUT = path.join(__dirname, "shots");

for (const run of RUNS) {
  const tag = `${run.lang}-${run.w}${process.env.REPLAY_SUFFIX ?? ""}`;
  if (ONLY && !ONLY.split(",").includes(`${run.lang}-${run.w}`)) continue;

  test(`Act I replay ${tag}`, async ({ page }) => {
    const dir = path.join(OUT, tag);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    const logFile = path.join(dir, "log.jsonl");
    await page.setViewportSize({ width: run.w, height: run.h });
    const t = (en: string, es: string) => (run.lang === "en" ? en : es);
    const name = `Replay ${run.lang} ${run.w} ${Date.now() % 100000}`;
    const first = "Replay";
    let n = 0;
    let lastLabel = "start";
    const errors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(`[after ${lastLabel}] ${m.text().slice(0, 1500)}`);
    });
    page.on("pageerror", (e) => errors.push("PAGEERROR " + e.message.slice(0, 300)));

    const log = (o: Record<string, unknown>) => fs.appendFileSync(logFile, JSON.stringify({ n, ...o }) + "\n");
    const note = (text: string) => log({ note: text });
    const card = page.locator("[data-job-card]");
    const primary = card.locator(".job-card-primary").first();
    const modal = page.locator("div.fixed.inset-0.z-\\[80\\]");
    const appWindow = page.locator("[data-app-window]");

    async function hydrated() {
      await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true", { timeout: 30_000 });
    }

    async function shot(label: string) {
      n++;
      await page.waitForTimeout(450);
      const file = `${String(n).padStart(3, "0")}-${label}.png`;
      lastLabel = label;
      await page.screenshot({ path: path.join(dir, file) });
      const audit = await page.evaluate((lang) => {
        const describe = (el: Element | null) => {
          if (!el || el === document.body) return "BODY";
          const h = el as HTMLElement;
          const r = h.getBoundingClientRect();
          const off = r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth;
          return `${h.tagName.toLowerCase()}${h.dataset.showme ? `[${h.dataset.showme}]` : ""} "${(h.innerText || h.getAttribute("aria-label") || (h as HTMLInputElement).value || "").trim().slice(0, 50)}"${off ? " (OFFSCREEN)" : ""}`;
        };
        const cardEl = document.querySelector<HTMLElement>("[data-job-card]");
        const covered: string[] = [];
        const offscreenTargets: string[] = [];
        if (cardEl) {
          const sel = "[data-app-window] button, [data-app-window] input, [data-app-window] select, [data-app-window] textarea, [data-app-window] [data-showme], [role=dialog] button, [data-testid^=bookmark-]";
          for (const el of document.querySelectorAll<HTMLElement>(sel)) {
            if (cardEl.contains(el)) continue;
            const b = el.getBoundingClientRect();
            if (!b.width || !b.height) continue;
            const x = b.left + b.width / 2, y = b.top + b.height / 2;
            if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue;
            const hit = document.elementFromPoint(x, y);
            if (hit && cardEl.contains(hit)) covered.push(describe(el));
          }
        }
        for (const el of document.querySelectorAll<HTMLElement>("[data-showme-primary]")) {
          const b = el.getBoundingClientRect();
          if (b.bottom > innerHeight || b.top < 0) offscreenTargets.push(describe(el));
        }
        const runaway: number[] = [];
        for (const el of document.querySelectorAll<HTMLElement>("[data-app-window] *")) {
          if (el.scrollHeight > 20000) runaway.push(el.scrollHeight);
        }
        // N-1: a ring up while the card's own button offers Show me (not Hide).
        const ringUp = document.querySelectorAll(".animate-showme-pulse").length > 0;
        const offersShowMe = [...(cardEl?.querySelectorAll("button") ?? [])].some((b) => /^(Show me|Muéstrame)$/.test(b.innerText.trim()));
        const staleRing = ringUp && offersShowMe;
        // N-2: the note over the app window or the card.
        const note = [...document.querySelectorAll("button")].find((b) => /^(Maria left a note|Maria dejó una nota)$/.test(b.innerText.trim()));
        let noteOver = false;
        if (note) {
          const t = note.getBoundingClientRect();
          for (const el of [cardEl, ...document.querySelectorAll("[data-app-window]")]) {
            if (!el) continue;
            const r = el.getBoundingClientRect();
            if (r.width && r.left < t.right && r.right > t.left && r.top < t.bottom && r.bottom > t.top) noteOver = true;
          }
        }
        const cardText = cardEl?.innerText.replace(/\s+/g, " ").trim().slice(0, 400) ?? null;
        const cardBox = cardEl?.getBoundingClientRect();
        const cardOut = cardBox ? cardBox.bottom > innerHeight + 1 || cardBox.right > innerWidth + 1 || cardBox.top < -1 : false;
        let english: string[] = [];
        if (lang === "es") {
          const text = [...document.querySelectorAll<HTMLElement>("[data-job-card], [data-app-window], [role=dialog], div.fixed.inset-0")]
            .map((e) => e.innerText).join("\n");
          const words = /\b(the|and|your|you|Click|Send|Reply|Next|Submit|Open|Yesterday|Today|Mon|Tue|Wed|Thu|Fri|Sat|Sun|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|hours|this week|Back|Done|Cancel|Attach|Inbox|Help|Show me|Page|Downloads|minutes?)\b/g;
          english = [...new Set(text.match(words) ?? [])];
        }
        return {
          focus: describe(document.activeElement),
          covered,
          offscreenTargets,
          runaway,
          cardText,
          cardCorner: cardEl?.dataset.corner ?? null,
          cardOut,
          english,
          staleRing,
          noteOver,
          url: location.pathname,
        };
      }, run.lang);
      log({ shot: file, label, ...audit });
      return audit;
    }

    /** Keyboard runs Tab to the control and press Enter; mouse runs click it. */
    async function press(target: Locator, label: string, opts: { forceKb?: boolean } = {}) {
      await target.waitFor({ state: "visible", timeout: 20_000 });
      if (run.kb || opts.forceKb) {
        let tabs = 0;
        const focused = () => target.evaluate((el) => el === document.activeElement || el.contains(document.activeElement)).catch(() => false);
        while (!(await focused()) && tabs < 45) {
          await page.keyboard.press("Tab");
          tabs++;
        }
        if (await focused()) {
          log({ kb: label, tabs });
          await page.keyboard.press("Enter");
          return;
        }
        log({ kb: label, tabs, unreachable: true });
        note(`KEYBOARD: could not reach "${label}" in 45 Tabs; clicked instead`);
      }
      await target.click();
    }

    async function typeInto(box: Locator, text: string) {
      await box.waitFor({ state: "visible" });
      if (run.kb) {
        const focused = await box.evaluate((el) => el === document.activeElement);
        if (!focused) {
          let tabs = 0;
          while (!(await box.evaluate((el) => el === document.activeElement)) && tabs < 45) {
            await page.keyboard.press("Tab");
            tabs++;
          }
          log({ kb: "text box", tabs, reached: await box.evaluate((el) => el === document.activeElement) });
          if (!(await box.evaluate((el) => el === document.activeElement))) await box.click();
        } else log({ kb: "text box", tabs: 0 });
      } else await box.click();
      await page.keyboard.press("ControlOrMeta+a");
      await page.keyboard.press("Backspace");
      await page.keyboard.type(text, { delay: 5 });
    }

    async function help(label: string) {
      await press(card.getByTestId("job-card-help"), `${label} help`);
      await shot(`${label}-help`);
      await press(card.getByRole("button", { name: /Back to my task|Volver a mi tarea/ }), `${label} help close`);
    }

    async function showMe(label: string) {
      const btn = card.getByRole("button", { name: /^(Show me|Muéstrame)$/ });
      if (await btn.isVisible().catch(() => false)) {
        await btn.click();
        await shot(`${label}-showme`);
      } else note(`${label}: no Show me on the card`);
    }

    /** A learner's reload: the page comes back, and they carry on with the card. */
    async function reload(label: string) {
      await page.reload();
      await hydrated();
      await shot(`${label}-after-reload`);
      if (await modal.isVisible().catch(() => false)) {
        note(`${label}: a full-screen card came back after the reload`);
        await modal.locator("[data-celebration-continue]").click();
      }
    }

    /** The card's button, until the day's app window is on screen. */
    async function openJob() {
      for (let i = 0; i < 3 && !(await appWindow.isVisible()); i++) {
        if (!(await primary.isVisible().catch(() => false))) break;
        await press(primary, "card primary (open job)");
        await appWindow.waitFor({ state: "visible", timeout: 5_000 }).catch(() => {});
      }
    }

    /** Opening another app mid-task, then coming back with the bookmark. */
    async function otherApp(label: string, other: string, back: string) {
      const o = page.getByTestId(`bookmark-${other}`);
      if (!(await o.isVisible().catch(() => false))) {
        note(`${label}: no ${other} bookmark visible for the other-app check`);
        return;
      }
      await o.click();
      await shot(`${label}-other-app-${other}`);
      await page.getByTestId(`bookmark-${back}`).click();
      await shot(`${label}-back-to-${back}`);
    }

    async function signOut(label: string) {
      await page.locator('[data-showme="shelf-status"]').click();
      await page.getByRole("button", { name: /^(Sign out|Cerrar sesión)$/ }).click();
      await page.waitForURL(/\/login/, { timeout: 20_000 });
      await hydrated();
      await shot(`${label}-signed-out`);
    }

    async function signIn(label: string) {
      await page.getByRole("button", { name }).first().click();
      await page.locator('input[placeholder="••••"]').first().click();
      await page.keyboard.type("1234");
      await page.keyboard.press("Enter");
      await card.or(modal).first().waitFor({ state: "visible", timeout: 30_000 });
      const a = await shot(`${label}-signed-in`);
      if (await modal.isVisible().catch(() => false)) {
        const back = await modal.locator("[data-welcome-back]").count();
        const stop = await modal.getByRole("button", { name: /Stop for today|Terminar por hoy/ }).count();
        note(`${label}: after sign-in a full-screen card: welcomeBack=${back} stopButton=${stop} focus=${a.focus}`);
        await press(modal.locator("[data-celebration-continue]"), `${label} welcome back continue`);
        await shot(`${label}-continued`);
      } else note(`${label}: after sign-in no full-screen card (card: ${a.cardText?.slice(0, 80)})`);
    }

    async function celebrate(label: string, expectTitle: string, stop: boolean) {
      await expect(modal).toBeVisible({ timeout: 30_000 });
      await expect(modal).toContainText(expectTitle);
      const a = await shot(`${label}-celebration`);
      if (!/celebration|continue|Stop|Terminar/.test(a.focus)) note(`${label} celebration focus: ${a.focus}`);
      if (stop) {
        await press(modal.getByRole("button", { name: /Stop for today|Terminar por hoy/ }), `${label} stop for today`);
        await page.waitForURL(/\/login/, { timeout: 20_000 });
        await hydrated();
        await shot(`${label}-stopped`);
        await signIn(label);
      } else {
        await press(modal.locator("[data-celebration-continue]"), `${label} celebration continue`);
        await shot(`${label}-after-celebration`);
      }
    }

    // ───────────────────────── Sign-up ─────────────────────────
    await page.goto("/login");
    await hydrated();
    if (run.lang === "es") await page.getByRole("button", { name: "Español" }).click();
    await shot("login");
    await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
    await page.getByPlaceholder("Jordan").fill(name);
    await page.getByPlaceholder("HARBOR-24").fill("TEST-E2E");
    await page.locator('input[placeholder="••••"]').first().click();
    await page.keyboard.type("1234");
    await shot("add-user");
    await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
    await expect(page.getByTestId("simulator-welcome")).toBeVisible({ timeout: 30_000 });
    await shot("welcome-how-this-works");
    const cont = page.getByTestId("welcome-continue");
    const contBox = await cont.boundingBox();
    if (contBox && contBox.y + contBox.height > run.h) note(`welcome: "${await cont.innerText()}" is below the fold (y=${Math.round(contBox.y)})`);
    await press(cont, "welcome continue");

    // ───────────────────────── Level 0: How this works ─────────────────────────
    await expect(card).toContainText(t(`Welcome, ${first}`, `${first}`), { timeout: 30_000 });
    const w = await shot("l0-welcome-card");
    const practice = card.getByRole("button", { name: /Practice clicking and scrolling|Practicar clics y desplazamiento/ });
    if (!(await practice.isVisible())) note("l0: practice button not visible");
    else {
      const pb = await practice.boundingBox();
      const cb = await card.boundingBox();
      if (pb && cb && pb.y + pb.height > cb.y + cb.height + 1) note(`l0: practice button is outside the card's visible area (${Math.round(pb.y)} vs card bottom ${Math.round(cb.y + cb.height)})`);
      if (pb && pb.y + pb.height > run.h) note("l0: practice button below the fold");
    }
    void w;
    // Wrong try: the Start menu before looking around.
    await page.getByTestId("shelf-start").click();
    await shot("l0-wrong-start-menu");
    // Practice (optional), as a cautious beginner would.
    await press(practice, "practice");
    await shot("l0-practice");
    await reload("l0-practice");
    await press(card.getByRole("button", { name: /Open practice notice|Abrir aviso de práctica/ }), "open practice notice");
    await shot("l0-practice-notice");
    const ready = card.locator("[data-practice-notice]").getByRole("button", { name: /^(Ready|Listo)$/ });
    if (run.kb) await press(ready, "practice ready");
    else {
      await card.locator("[data-practice-notice]").hover();
      await page.mouse.wheel(0, 400);
      await shot("l0-practice-scrolled");
      await ready.click();
    }
    await shot("l0-practice-done");
    await press(card.getByRole("button", { name: /Start looking around|Empezar a mirar/ }), "start looking around");
    await expect(card).toContainText(t("These are your bookmarks.", "Estos son tus marcadores."));
    await shot("l0-bookmarks");
    await press(card.getByRole("button", { name: /^(Next|Siguiente)$/ }), "tour next");
    await shot("l0-click-mail");
    await reload("l0-mid-tour");
    await openJob();
    await shot("l0-mid-tour-reopened");
    await press(page.getByTestId("bookmark-mail"), "bookmark mail");
    await expect(card).toContainText(t("This is your work email.", "correo"));
    await shot("l0-work-email");
    await press(card.getByRole("button", { name: /^(I understand|Entiendo)$/ }), "tour I understand");
    await shot("l0-try-help");
    await press(card.getByTestId("job-card-help"), "tour help");
    await shot("l0-help-open");
    await press(card.getByRole("button", { name: /Back to my task|Volver a mi tarea/ }), "tour help close");
    await shot("l0-help-closed");
    await press(card.getByRole("button", { name: /I'm ready for the task|Empezar la tarea/ }), "ready for the task");
    await celebrate("l0-done", t("You found your way around.", "Ya recorriste"), false);

    // ───────────────────────── Level 1: The Night Before ─────────────────────────
    await signOut("l1-start");
    await signIn("l1-start");
    const taskListOk = card.getByRole("button", { name: /^(I understand|Entiendo)$/ });
    if (await taskListOk.isVisible().catch(() => false)) {
      await shot("l1-task-list-intro");
      await press(taskListOk, "task list I understand");
    }
    await openJob();
    await shot("l1-inbox");
    const row = page.locator('[data-showme="maria-row"]');
    const replyBtn = page.locator('[data-showme="reply-button"]');
    const replyBox = page.getByRole("textbox", { name: /Your reply|Tu respuesta/ });
    const sendBtn = page.locator('[data-showme="send-button"]');
    // Reply 1: welcome.
    await press(row, "maria row 1");
    await shot("l1-r1-open");
    await press(replyBtn, "reply 1");
    await shot("l1-r1-compose");
    await typeInto(replyBox, t("Hi Maria, thank you. I am happy to start.", "Hola Maria, gracias. Estoy feliz de empezar."));
    await help("l1-r1");
    await reload("l1-r1-draft");
    await openJob();
    if (!(await replyBox.isVisible().catch(() => false))) {
      if (!(await replyBtn.isVisible().catch(() => false))) await press(row, "maria row 1 again");
      await press(replyBtn, "reply 1 again");
    }
    await shot("l1-r1-draft-back");
    const kept = await replyBox.inputValue().catch(() => "");
    if (!kept.includes("Maria")) note(`l1: reload lost the reply 1 draft (box: "${kept}")`);
    await typeInto(replyBox, t("Hi Maria, thank you. I am happy to start. Replay", "Hola Maria, gracias. Estoy feliz de empezar. Replay"));
    await press(sendBtn, "send reply 1");
    await shot("l1-r1-sent");
    await press(card.getByRole("button", { name: /Next message|Siguiente mensaje/ }), "next message 1");
    // Reply 2: start time. Wrong try first.
    await shot("l1-r2-inbox");
    await press(row, "maria row 2");
    await press(replyBtn, "reply 2");
    await typeInto(replyBox, "No");
    await press(sendBtn, "send wrong reply 2");
    await shot("l1-r2-wrong");
    await otherApp("l1-r2", "portal", "mail");
    if (!(await replyBox.isVisible().catch(() => false))) {
      if (!(await replyBtn.isVisible().catch(() => false))) await press(row, "maria row 2 again");
      await press(replyBtn, "reply 2 again");
    }
    await typeInto(replyBox, t("Yes, I will be there at 10. See you tomorrow.", "Sí, allí estaré a las 10. Nos vemos mañana."));
    await press(sendBtn, "send reply 2");
    await shot("l1-r2-sent");
    await press(card.getByRole("button", { name: /Next message|Siguiente mensaje/ }), "next message 2");
    // Reply 3: Darnell.
    await shot("l1-r3-objective");
    await showMe("l1-r3");
    await press(row, "darnell row");
    await shot("l1-r3-open");
    await press(replyBtn, "reply 3");
    await typeInto(replyBox, t("Hi Darnell, put your bag under the counter.", "Hola Darnell, deja tu bolsa debajo del mostrador."));
    await press(sendBtn, "send reply 3");
    await celebrate("l1-done", t("Your new manager got your replies.", "Tu nueva jefa recibió tus respuestas."), true);

    // ───────────────────────── Level 2: Day 2, The First Week ─────────────────────────
    await openJob();
    await shot("l2-schedule");
    const swaps = page.getByRole("button", { name: /^(Request a swap|Pedir un cambio)$/ });
    await press(swaps.first(), "wrong swap (first row)");
    await shot("l2-wrong-swap-1");
    await press(swaps.nth(1), "wrong swap (second row)");
    await shot("l2-wrong-swap-2");
    await help("l2-schedule");
    await press(page.locator('[data-showme="swap-button"]').first(), "swap Thursday");
    await shot("l2-swap-form");
    await showMe("l2-swap-form");
    await press(page.locator('[data-showme="submit-button"]'), "submit empty swap");
    await shot("l2-swap-empty-submit");
    const cover = page.locator('[data-showme="swap-cover"]');
    await cover.focus();
    await cover.selectOption("thu-late");
    await shot("l2-swap-filled");
    await reload("l2-swap-form");
    await openJob();
    await shot("l2-swap-form-back");
    if ((await cover.inputValue().catch(() => "")) !== "thu-late") note("l2: reload lost the swap choice");
    await press(page.locator('[data-showme="submit-button"]'), "submit swap");
    await expect(page.getByTestId("text-thread")).toBeVisible({ timeout: 20_000 });
    await shot("l2-text");
    const textBox = page.getByTestId("text-reply");
    await typeInto(textBox, "ok");
    await press(page.getByTestId("text-send"), "send wrong text");
    await shot("l2-text-wrong");
    await typeInto(textBox, t("Yes, Thursday works.", "Sí, el jueves está bien."));
    await press(page.getByTestId("text-send"), "send text");
    await shot("l2-text-sent");
    await press(card.getByRole("button", { name: /Next task|Siguiente tarea/ }), "next task");
    await shot("l2-t2-desktop");
    await openJob();
    await shot("l2-t2-mail");
    if (!(await replyBtn.isVisible().catch(() => false))) await press(row, "maria row cert");
    await shot("l2-t2-email");
    await press(replyBtn, "reply cert");
    await shot("l2-t2-question");
    await page.getByRole("button", { name: t("Your food handler practice test, today by 3 PM", "Tu examen de práctica de manipulador de alimentos, hoy antes de las 3 PM"), exact: true }).click();
    await shot("l2-t2-question-wrong");
    await press(page.getByRole("button", { name: t("Your food handler certificate, today by 3 PM", "Tu certificado de manipulador de alimentos, hoy antes de las 3 PM"), exact: true }), "right answer");
    await shot("l2-t2-compose");
    await press(page.locator('[data-showme="attach-button"]'), "attach file");
    await shot("l2-t2-picker");
    const picker = page.getByRole("dialog");
    await picker.getByRole("button", { name: /food-handler-certificate-2022\.pdf/ }).click();
    await shot("l2-t2-picker-expired-preview");
    await page.locator('[data-showme="attach-confirm"]').click();
    await shot("l2-t2-picker-expired-wrong");
    await showMe("l2-t2-picker-after-wrong");
    await picker.getByRole("button", { name: /food-handler-certificate\.pdf/ }).click();
    await shot("l2-t2-picker-right-preview");
    await press(page.locator('[data-showme="attach-confirm"]'), "attach confirm");
    await shot("l2-t2-attached");
    await otherApp("l2-t2", "portal", "mail");
    const body = page.locator('[data-showme="compose-body"]').last();
    await typeInto(body, t("Hi Maria, here is my food handler certificate.", "Hola Maria, aquí está mi certificado de manipulador de alimentos."));
    await reload("l2-t2-draft");
    await openJob();
    if (!(await body.isVisible().catch(() => false))) await page.getByTestId("bookmark-mail").click();
    await shot("l2-t2-draft-back");
    if (!(await body.inputValue().catch(() => "")).includes("Maria")) note("l2: reload lost the certificate note");
    await press(page.locator('[data-showme="send-button"]').last(), "send cert");
    await celebrate("l2-done", t("You checked your schedule and sent your certificate.", "Revisaste tu horario y enviaste tu certificado."), false);

    // ───────────────────────── Level 3: Day 3, Clock-In Fix ─────────────────────────
    await signOut("l3-start");
    await signIn("l3-start");
    await openJob();
    await shot("l3-clock");
    await press(page.locator('[data-showme="clockin-button"]'), "clock in");
    await shot("l3-clocked");
    await press(page.getByRole("button", { name: /^(Looks right|Se ve bien|Está bien)$/ }), "looks right (wrong)");
    await shot("l3-looks-right-wrong");
    await press(page.locator('[data-showme="something-off-button"]'), "something looks wrong");
    await shot("l3-compose");
    const c3 = page.locator('[data-showme="compose-body"]').first();
    await typeInto(c3, t("hi maria. clock is wrong", "hola maria. el reloj está mal"));
    await press(page.locator('[data-showme="send-button"]').first(), "send wrong clock note");
    await shot("l3-clock-note-wrong");
    await reload("l3-clock-note");
    await openJob();
    await shot("l3-clock-note-back");
    if (!(await c3.isVisible().catch(() => false))) {
      note("l3: after reload the clock note compose is not open");
      const off = page.locator('[data-showme="something-off-button"]');
      if (await off.isVisible().catch(() => false)) await press(off, "something looks wrong again");
      await shot("l3-clock-note-reopened");
    }
    note(`l3: clock note box after reload holds "${await c3.inputValue().catch(() => "?")}"`);
    await typeInto(c3, t("Hi Maria, I got here at 7, but the clock says 8:15. Sorry.", "Hola Maria, llegué a las 7 pero el reloj dice 8:15. Perdón."));
    await press(page.locator('[data-showme="send-button"]').first(), "send clock note");
    await shot("l3-clock-note-sent");
    await press(card.getByRole("button", { name: /Next task|Siguiente tarea/ }), "next task");
    await openJob();
    await shot("l3-shift-note");
    const note3 = page.locator('[data-showme="shift-note-box"]');
    await otherApp("l3-t2", "mail", "portal");
    await openJob();
    await typeInto(note3, "ok");
    await press(page.locator('[data-showme="shift-note-submit"]'), "submit wrong shift note");
    await shot("l3-shift-note-wrong");
    await typeInto(note3, t("It got busy at 11. We ran out of oat milk.", "Se llenó a las 11. Se acabó la leche de avena."));
    await shot("l3-shift-note-typed");
    await showMe("l3-shift-note-typed");
    await help("l3-shift-note");
    await reload("l3-shift-note");
    await openJob();
    await shot("l3-shift-note-back");
    if (!(await note3.inputValue().catch(() => "")).includes("11")) {
      note("l3: reload lost the shift note");
      await typeInto(note3, t("It got busy at 11. We ran out of oat milk.", "Se llenó a las 11. Se acabó la leche de avena."));
    }
    await press(page.locator('[data-showme="shift-note-submit"]'), "submit shift note");
    await celebrate("l3-done", t("You left Maria a clear note.", "Le dejaste a Maria una nota clara."), true);

    // ───────────────────────── Level 3a: Day 4, Write to a Coworker ─────────────────────────
    await openJob();
    await shot("l3a-inbox");
    await otherApp("l3a", "portal", "mail");
    const darnell = page.getByRole("button", { name: /Darnell Washington/ }).first();
    await press(darnell, "darnell email");
    await shot("l3a-email");
    await press(page.getByRole("button", { name: /^(Reply|Responder)$/ }), "reply darnell");
    await shot("l3a-compose");
    const c4 = page.locator("textarea").first();
    await typeInto(c4, t("ok thanks", "ok gracias"));
    await press(page.getByRole("button", { name: /^(Send|Enviar)$/ }), "send wrong darnell");
    await shot("l3a-wrong");
    await typeInto(c4, t("Hi Darnell, the extra aprons are in the storage room.", "Hola Darnell, los delantales de más están en el almacén."));
    await reload("l3a-draft");
    await openJob();
    await shot("l3a-draft-back");
    if (!(await c4.inputValue().catch(() => "")).includes("Darnell")) {
      note("l3a: reload lost the Darnell draft");
      await press(page.getByRole("button", { name: /Darnell Washington/ }).first(), "darnell again");
      await press(page.getByRole("button", { name: /^(Reply|Responder)$/ }), "reply again");
      await typeInto(c4, t("Hi Darnell, the extra aprons are in the storage room.", "Hola Darnell, los delantales de más están en el almacén."));
    }
    await help("l3a");
    await press(page.getByRole("button", { name: /^(Send|Enviar)$/ }), "send darnell");
    await celebrate("l3a-done", t("You woke up sick.", "Hoy despertaste con malestar."), false);

    // ───────────────────────── Level 3a2: Day 5, The Sick Call ─────────────────────────
    await openJob();
    const d5 = await shot("l3a2-compose");
    if (!/textarea/.test(d5.focus)) note(`l3a2: focus on open is ${d5.focus}`);
    const c5 = page.locator("textarea").first();
    await typeInto(c5, t("hi maria i am sick", "hola maria estoy enferma"));
    await press(page.getByRole("button", { name: /^(Send|Enviar)$/ }), "send wrong sick");
    await shot("l3a2-wrong");
    await otherApp("l3a2", "portal", "mail");
    await typeInto(c5, t("Hi Maria, I am sick. I can't come in today at 7. Sorry.", "Hola Maria, estoy enferma. Hoy no puedo ir a las 7. Perdón."));
    await reload("l3a2-draft");
    await openJob();
    await shot("l3a2-draft-back");
    if (!(await c5.inputValue().catch(() => "")).includes("Maria")) {
      note("l3a2: reload lost the sick-call draft");
      await typeInto(c5, t("Hi Maria, I am sick. I can't come in today at 7. Sorry.", "Hola Maria, estoy enferma. Hoy no puedo ir a las 7. Perdón."));
    }
    await help("l3a2");
    await press(page.getByRole("button", { name: /^(Send|Enviar)$/ }), "send sick");
    await celebrate("l3a2-done", t("Your first stub is here.", "Ya está tu primer recibo."), false);

    // ───────────────────────── Level 3a3: Day 6, First Paycheck ─────────────────────────
    await signOut("l3a3-start");
    await signIn("l3a3-start");
    await openJob();
    await shot("l3a3-list");
    await otherApp("l3a3", "mail", "portal");
    await openJob();
    await press(page.locator('[data-showme="target-stub"]'), "open stub");
    await shot("l3a3-stub");
    await showMe("l3a3-stub");
    await press(primary, "card primary (answer questions)");
    for (const ms of [0, 700, 1500, 3000]) {
      await page.waitForTimeout(ms ? ms - (ms === 700 ? 0 : ms === 1500 ? 700 : 1500) : 0);
      const ring = await page.evaluate(() => [...document.querySelectorAll("*")].filter((e) => /This one|Net pay\.|Pago neto\.|Look here|Mira aquí|Este\./.test((e as HTMLElement).innerText ?? "") && (e as HTMLElement).children.length < 3 && getComputedStyle(e).position === "fixed").length);
      await page.screenshot({ path: path.join(dir, `l3a3-after-back-${ms}ms.png`) });
      log({ afterBackMs: ms, spotlightLabels: ring });
    }
    await shot("l3a3-q1");
    await page.getByRole("button", { name: "$720.00", exact: true }).click();
    await shot("l3a3-q1-wrong");
    await press(page.getByRole("button", { name: "$571.32", exact: true }), "net pay");
    await shot("l3a3-q2");
    await page.getByRole("button", { name: t("40 hours", "40 horas"), exact: true }).click();
    await shot("l3a3-q2-wrong");
    await help("l3a3");
    await reload("l3a3-q2");
    await openJob();
    await shot("l3a3-q2-back");
    const h48 = page.getByRole("button", { name: t("48 hours", "48 horas"), exact: true });
    if (!(await h48.isVisible().catch(() => false))) {
      note("l3a3: after reload the hours question is not on screen");
      await page.screenshot({ path: path.join(dir, "l3a3-reload-lost.png") });
    }
    await press(h48, "48 hours");
    await celebrate("l3a3-done", t("You checked your first paycheck.", "Revisaste tu primer recibo."), true);
    await shot("act2-after-return");
    log({ consoleErrors: errors });
  });
}
