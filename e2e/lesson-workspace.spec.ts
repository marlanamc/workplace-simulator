import { test, expect } from "@playwright/test";
import { waitForInteractive } from "./interactive";

for (const lang of ["en", "es"] as const) {
  test(`lesson mail uses one reading pane and keeps its draft (${lang})`, async ({ page }) => {
    await page.goto(`/lessons/mail-reply?lang=${lang}&preview=1`);
    await waitForInteractive(page);
    await page.getByTestId("lesson-intro-start").click();
    const card = page.locator("[data-job-card]");
    // Who the emails come from stays in Key information the whole lesson.
    const people = card.getByTestId("key-info-people");
    await expect(people).toContainText("Maria Delgado");
    await expect(people).toContainText(lang === "en" ? "She runs the cafe" : "Ella dirige el café");
    await expect(people).toContainText("Darnell Washington");
    // The Info card reopens the situation, not the people a second time.
    const situation = card.getByTestId("lesson-situation");
    await expect(situation).toHaveCount(0);
    await card.getByTestId("lesson-info-open").click();
    await expect(situation).toBeVisible();
    await expect(situation).not.toContainText("Darnell Washington");
    await card.getByTestId("lesson-info-open").click();
    const why = card.getByTestId("lesson-why");
    await expect(why).not.toHaveAttribute("open", "");
    await why.locator("summary").click();
    await expect(why.locator("p")).toBeVisible();
    await page.getByTestId('confidence-practice').getByRole('button').filter({hasText:/@/}).first().click();
    await expect(page.getByTestId("confidence-practice").getByRole("button").filter({hasText:/@/}).first()).toBeHidden();
    await page.getByTestId('confidence-practice').getByRole('button',{name:lang==='en'?'Reply':'Responder',exact:true}).click();
    const draft = page.getByRole("textbox", { name: lang === "en" ? "Message" : "Mensaje" });
    await draft.fill(lang === "en" ? "Hello Maria, thank you!" : "¡Hola Maria, gracias!");
    await page.getByTestId("confidence-practice").getByRole("button",{name:lang === "en" ? "Back to inbox" : "Volver a recibidos",exact:true}).click();
    await expect(page.getByTestId("confidence-practice").getByRole("button").filter({hasText:/@/}).first()).toBeVisible();
    await page.getByTestId('confidence-practice').getByRole('button').filter({hasText:/@/}).first().click();
    await page.getByTestId('confidence-practice').getByRole('button',{name:lang==='en'?'Reply':'Responder',exact:true}).click();
    await expect(draft).toHaveValue(lang === "en" ? "Hello Maria, thank you!" : "¡Hola Maria, gracias!");
    await page.screenshot({ path: test.info().outputPath(`mail-${lang}.png`) });
  });

  test(`new-email lesson can reopen its draft from the inbox (${lang})`, async ({ page }) => {
    await page.goto(`/lessons/mail-send-link?lang=${lang}&preview=1&smoke=1`);
    await waitForInteractive(page);
    // Draft lesson smoke mode opens the workspace directly.
    const draft = page.getByRole("textbox", { name: lang === "en" ? "Your reply" : "Tu respuesta" });
    const message = lang === "en" ? "Here is the schedule." : "Aquí está el horario.";
    await draft.fill(message);
    await page.getByTestId("mail-back-inbox").click();
    await page.getByTestId("mail-new-message").click();
    await expect(draft).toHaveValue(message);
  });

  for (const viewport of [{ width: 1366, height: 768 }, { width: 911, height: 512 }, { width: 390, height: 844 }]) {
    test(`W-4 has one reference source beside the form (${lang} ${viewport.width})`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`/lessons/w4-form?lang=${lang}&preview=1`);
      await waitForInteractive(page);
      await page.getByTestId("lesson-intro-start").click();
      const card = page.locator("[data-job-card]");
      const reference = page.getByTestId("lesson-info-card");
      await expect(reference).toHaveCount(1);
      await expect(card.getByTestId("lesson-info-card")).toBeVisible();
      await expect(reference).toContainText(lang === "en" ? "Other credits" : "Otros créditos");
      await expect(page.getByRole("heading", { name: lang === "en" ? "Robin's facts" : "Datos de Robin" })).toHaveCount(0);
      const app = page.locator('[data-app-window="active"]');
      const a = (await app.boundingBox())!;
      const b = (await card.boundingBox())!;
      expect(a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height).toBe(false);
      if (viewport.width >= 800) expect(b.width).toBeLessThanOrEqual(320);
      await reference.getByText("10/01/2026", { exact: lang === "en" }).scrollIntoViewIfNeeded();
      await page.screenshot({ path: test.info().outputPath(`w4-${lang}-${viewport.width}.png`) });
    });
  }
}

for (const lang of ["en", "es"] as const) {
  test(`restored mail chrome supports search, folders and draft recovery (${lang})`, async ({ page }, testInfo) => {
    const es = lang === "es";
    await page.goto(`/lessons/mail-attach?lang=${lang}&preview=1`);
    await waitForInteractive(page);
    await page.getByTestId("lesson-intro-start").click();
    const mail = page.getByTestId("lesson-mail");
    await expect(mail.getByTestId("mail-app-title")).toContainText(es ? "Correo" : "Mail");
    await expect(mail.getByTestId("mail-inbox-list").getByRole("button").filter({hasText: /IT Helpdesk/})).toBeVisible();
    await page.screenshot({path:testInfo.outputPath(`restored-inbox-${lang}.png`)});
    const search = mail.getByRole("textbox", {name:es?"Buscar correo":"Search mail"});
    await search.fill("certificate");
    if (!es) await expect(mail.getByTestId("mail-inbox-list").getByRole("button").filter({hasText: /IT Helpdesk/})).toHaveCount(0);
    await search.fill("");
    await mail.getByTestId("mail-inbox-list").getByRole("button").filter({hasText: /IT Helpdesk/}).click();
    await expect(mail).toContainText(es?"Sistemas nunca":"IT will never");
    await mail.getByTestId("mail-back-inbox").click();
    await mail.getByRole("button", {name: es?"Redactar":"Compose",exact:true}).click();
    await expect(mail.getByLabel(es?"Para":"To",{exact:true})).toHaveValue("");
    const message=mail.getByLabel(es?"Mensaje":"Message",{exact:true});
    await message.fill("My saved draft");
    await mail.getByTestId("mail-back-inbox").click();
    await mail.getByRole("button", {name:es?"Borradores (1)":"Drafts (1)",exact:true}).click();
    await mail.getByTestId("mail-inbox-list").getByRole("button").click();
    await expect(message).toHaveValue("My saved draft");
    await expect(page.getByTestId("lesson-practice-again")).toHaveCount(0);
  });
}
