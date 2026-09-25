import { test, expect, type Page } from "@playwright/test";
const guestKey = "digital-practice:workshop:v1:guest";
async function fill(page: Page) {
  await page.getByLabel("First name", { exact: true }).fill("Maya");
  await page.getByLabel("Last name", { exact: true }).fill("Torres");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("maya.torres@example.com");
  await page.getByLabel("Workshop session").selectOption("tuesday");
}
test("guest can correct, review, edit, submit, resume, and clear", async ({
  page,
}) => {
  await page.goto("/practice");
  await page
    .getByRole("link", { name: "Start practice: Register for a workshop" })
    .click();
  await page
    .getByRole("link", { name: "Register for the computer workshop" })
    .click();
  await page.getByRole("button", { name: "Review registration" }).click();
  await expect(page.getByLabel("First name", { exact: true })).toBeFocused();
  await expect(
    page.getByText("Use the practice first name: Maya."),
  ).toBeVisible();
  await fill(page);
  await page.reload();
  await expect(page.getByLabel("First name", { exact: true })).toHaveValue(
    "Maya",
  );
  await page.getByRole("button", { name: "Review registration" }).click();
  await page.getByRole("button", { name: "Edit answers" }).click();
  await expect(page.getByLabel("Email address")).toHaveValue(
    "maya.torres@example.com",
  );
  await page.getByRole("button", { name: "Review registration" }).click();
  await page.getByRole("button", { name: "Submit registration" }).click();
  await expect(
    page.getByRole("heading", { name: "Registration confirmed" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Registration confirmed" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear my practice" }).click();
  await page.getByRole("button", { name: "Yes, clear practice" }).click();
  expect(
    await page.evaluate((k) => localStorage.getItem(k), guestKey),
  ).toBeNull();
});
test("support can change without resetting; Spanish help leaves the task in English", async ({
  page,
}) => {
  await page.goto("/practice/workshop?mode=independent&lang=es");
  await expect(
    page.getByText(
      "Inscribe a Maya Torres en el taller de computación del martes usando la invitación.",
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: "Ayuda", exact: true }).click();
  await expect(
    page.getByText("Lee la invitación. Abre el enlace de inscripción."),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Register for the computer workshop" })
    .click();
  await page.getByLabel("First name", { exact: true }).fill("Maya");
  await page.getByLabel("Apoyo", { exact: true }).selectOption("guided");
  await expect(page.getByLabel("First name", { exact: true })).toHaveValue(
    "Maya",
  );
  await expect(
    page.getByRole("heading", { name: "Workshop registration", exact: true }),
  ).toBeVisible();
});
test("preview never touches saved progress and shares a student link", async ({
  page,
}) => {
  let calls = 0;
  await page.route(/\/api\/practice\?activity=workshop$/, (route) => {
    calls++;
    return route.abort();
  });
  await page.addInitScript(
    (k) => localStorage.setItem(k, "existing-guest-work"),
    guestKey,
  );
  await page.goto("/practice/workshop?preview=1");
  await page
    .getByRole("link", { name: "Register for the computer workshop" })
    .click();
  await page.getByRole("button", { name: "Clear my practice" }).click();
  await page.getByRole("button", { name: "Yes, clear practice" }).click();
  expect(await page.evaluate((k) => localStorage.getItem(k), guestKey)).toBe(
    "existing-guest-work",
  );
  expect(calls).toBe(0);
  await page.getByLabel("Support", { exact: true }).selectOption("independent");
  await page.getByRole("button", { name: "Copy activity link" }).click();
  await expect(page.locator("input[readonly]")).toHaveValue(
    /practice\/workshop\?mode=independent&lang=en$/,
  );
});
test("account saves retry and resume without writing game progress (mock account service)", async ({
  page,
}) => {
  let saved: unknown = null;
  let fail = false;
  await page.route(/\/api\/practice\?activity=workshop$/, async (route) => {
    if (route.request().method() === "GET")
      return route.fulfill({
        json: { signedIn: true, owner: "test-owner", state: saved },
      });
    if (fail) return route.fulfill({ status: 503 });
    saved = route.request().postDataJSON();
    return route.fulfill({ json: { saved: true } });
  });
  await page.goto("/practice/workshop");
  await page
    .getByRole("link", { name: "Register for the computer workshop" })
    .click();
  await expect(page.getByRole("status")).toHaveText("Saved to your account");
  fail = true;
  await page.getByLabel("First name", { exact: true }).fill("Maya");
  await expect(
    page.getByRole("button", { name: "Retry saving" }),
  ).toBeVisible();
  fail = false;
  await page.getByRole("button", { name: "Retry saving" }).click();
  await expect(page.getByRole("status")).toHaveText("Saved to your account");
  await page.reload();
  await expect(page.getByLabel("First name", { exact: true })).toHaveValue(
    "Maya",
  );
});
test("storage failure keeps the activity usable without claiming a save", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error("blocked");
    };
  });
  await page.goto("/practice/workshop");
  await page
    .getByRole("link", { name: "Register for the computer workshop" })
    .click();
  await expect(
    page.getByRole("button", { name: "Retry saving" }),
  ).toBeVisible();
  await fill(page);
  await page.getByRole("button", { name: "Review registration" }).click();
  await page.getByRole("button", { name: "Submit registration" }).click();
  await expect(
    page.getByRole("heading", { name: "Registration confirmed" }),
  ).toBeVisible();
});
test("explicit guest transfer is acknowledged once (mock account service)", async ({
  page,
}) => {
  const state = {
    version: 1,
    mode: "guided",
    stage: "form",
    firstName: "Maya",
    lastName: "",
    email: "",
    session: "",
  };
  let writes = 0;
  await page.addInitScript((s) => {
    sessionStorage.setItem(
      "digital-practice:workshop:transfer",
      JSON.stringify(s),
    );
    localStorage.setItem(
      "digital-practice:workshop:v1:guest",
      JSON.stringify(s),
    );
  }, state);
  await page.route(/\/api\/practice\?activity=workshop$/, (route) => {
    if (route.request().method() === "GET")
      return route.fulfill({
        json: { signedIn: true, owner: "transfer-owner", state: null },
      });
    writes++;
    return route.fulfill({ json: { saved: true } });
  });
  await page.goto("/practice/workshop?transfer=1");
  await expect(page.getByLabel("First name", { exact: true })).toHaveValue(
    "Maya",
  );
  await expect(page.getByRole("status")).toHaveText("Saved to your account");
  expect(
    await page.evaluate(() =>
      sessionStorage.getItem("digital-practice:workshop:transfer"),
    ),
  ).toBeNull();
  expect(
    await page.evaluate((k) => localStorage.getItem(k), guestKey),
  ).toBeNull();
  expect(writes).toBe(1);
});
test("mobile and enlarged text fit without horizontal scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/practice/workshop");
  await page
    .getByRole("link", { name: "Register for the computer workshop" })
    .click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.setViewportSize({ width: 683, height: 768 });
  await page
    .locator(".practice")
    .evaluate((el) => ((el as HTMLElement).style.fontSize = "40px"));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("failed loading preserves saved work until retry", async ({ page }) => {
  let fail = true;
  await page.route(/\/api\/practice\?activity=workshop$/, (route) =>
    fail
      ? route.fulfill({ status: 503 })
      : route.fulfill({ json: { signedIn: false } }),
  );
  await page.goto("/practice/workshop");
  await expect(
    page.getByText(
      "We could not open your saved practice. Your work has not been replaced.",
    ),
  ).toBeVisible();
  fail = false;
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(
    page.getByRole("link", { name: "Register for the computer workshop" }),
  ).toBeVisible();
});
test("sign in explicitly carries the current guest attempt and safe return path", async ({
  page,
}) => {
  await page.goto("/practice/workshop?lang=es");
  await page
    .getByRole("link", { name: "Register for the computer workshop" })
    .click();
  await page.getByLabel("First name", { exact: true }).fill("Maya");
  await page
    .getByRole("button", { name: "Iniciar sesión para guardar esta práctica" })
    .click();
  await expect(page).toHaveURL(/\/login\?next=/);
  const next = new URL(page.url()).searchParams.get("next");
  expect(next).toBe("/practice/workshop?mode=guided&lang=es&transfer=1");
  expect(
    await page.evaluate(
      () =>
        JSON.parse(
          sessionStorage.getItem("digital-practice:workshop:transfer") ||
            "null",
        ).firstName,
    ),
  ).toBe("Maya");
});

async function turnInHomework(page: Page) {
  await page.getByRole("button", { name: "My weekly schedule" }).click();
  await page.getByRole("link", { name: "View instructions" }).click();
  await page.getByRole("button", { name: "Turn in", exact: true }).click();
  // Wording follows the help language; the file names are the same in both.
  await expect(page.locator(".gc-error")).toContainText("My schedule.docx");
  await page.getByRole("button", { name: "+ Add or create" }).click();
  await page.getByRole("menuitem", { name: "Google Drive" }).click();
  const drive = page.getByRole("dialog", {
    name: "Insert files using Google Drive",
  });
  await drive.getByLabel("My schedule (old).docx").check();
  await drive.getByRole("button", { name: "Insert" }).click();
  await page.getByRole("button", { name: "Turn in", exact: true }).click();
  await expect(page.locator(".gc-error").first()).toContainText(
    "My schedule (old).docx",
  );
  await page
    .getByRole("button", { name: "Remove My schedule (old).docx" })
    .click();
  await page.getByRole("button", { name: "+ Add or create" }).click();
  await page.getByRole("menuitem", { name: "File", exact: true }).click();
  const files = page.getByRole("dialog", { name: "Select a file to open" });
  await files.getByRole("radio", { name: /^My schedule\.docx/ }).check();
  await files.getByRole("button", { name: "Open" }).click();
  await page.getByRole("button", { name: "Turn in", exact: true }).click();
  const confirm = page.getByRole("dialog", { name: "Turn in your work?" });
  await expect(confirm).toContainText("1 attachment will be submitted");
  await confirm.getByRole("button", { name: "Turn in" }).click();
  await expect(page.getByText("Turned in", { exact: true })).toBeVisible();
}
test("homework: find, attach the right file, turn in, comment, resume", async ({
  page,
}) => {
  await page.goto("/practice");
  await page
    .getByRole("link", { name: "Start practice: Turn in homework" })
    .click();
  await expect(page.getByRole("heading", { name: "Week 3" })).toBeVisible();
  await expect(
    page.getByText("classroom.google.com/w/english-3"),
  ).toBeVisible();
  await turnInHomework(page);
  await page.reload();
  await expect(page.getByText("Turned in", { exact: true })).toBeVisible();
  await page.getByLabel("Add class comment").fill("Monday");
  await page.getByRole("button", { name: "Post" }).click();
  await expect(page.getByText(/four words or more/)).toBeVisible();
  await page
    .getByLabel("Add class comment")
    .fill("My busiest day is Saturday because I work.");
  await page.getByRole("button", { name: "Post" }).click();
  await expect(
    page.locator(".gc-comment").filter({ hasText: "Maya Torres" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() =>
      JSON.parse(
        localStorage.getItem("digital-practice:assignment:v1:guest") || "null",
      ),
    ),
  ).toMatchObject({ stage: "complete", attached: ["schedule"] });
  await page.getByRole("button", { name: "Practice again" }).click();
  await expect(page.getByRole("heading", { name: "Week 3" })).toBeVisible();
});
test("homework: Unsubmit returns to editing; Spanish help, English class", async ({
  page,
}) => {
  await page.goto("/practice/assignment?lang=es");
  await expect(
    page.getByText(/Busca la tarea “My weekly schedule”/),
  ).toBeVisible();
  await turnInHomework(page);
  await page.getByRole("button", { name: "Unsubmit" }).click();
  await expect(
    page.getByRole("button", { name: "Remove My schedule.docx" }),
  ).toBeVisible();
});
test("teacher preview shows the guide and saves nothing", async ({ page }) => {
  let calls = 0;
  await page.route(/\/api\/practice/, (route) => {
    calls++;
    return route.abort();
  });
  await page.goto("/practice/assignment?preview=1");
  await page.getByText("Teacher guide").click();
  await expect(page.getByText("Common sticking points")).toBeVisible();
  await expect(
    page.getByText(/Choosing “My schedule \(old\)\.docx\.”/),
  ).toBeVisible();
  await page.getByRole("button", { name: "My weekly schedule" }).click();
  await page.getByRole("link", { name: "View instructions" }).click();
  expect(calls).toBe(0);
});
test("homework fits a phone screen", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/practice/assignment");
  await turnInHomework(page);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("password: right account, real code, new password, sign in, sign out", async ({
  page,
}) => {
  await page.goto("/practice");
  await page
    .getByRole("link", { name: "Start practice: Forgot your password" })
    .click();
  await page.getByRole("button", { name: /Sam Okafor/ }).click();
  await page.getByRole("link", { name: "Forgot password?" }).click();
  await expect(page.locator(".field-error")).toContainText("Sam");
  await page.getByRole("button", { name: "Use another account" }).click();
  await page.getByRole("button", { name: /Maya Torres/ }).click();
  await page.getByLabel("Password", { exact: true }).fill("guess123");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByText(/Wrong password/)).toBeVisible();
  await page.getByRole("link", { name: "Forgot password?" }).click();
  await page.getByLabel("Enter the code").fill("2024");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByText(/coupon from a pizza ad/)).toBeVisible();
  await page.getByLabel("Enter the code").fill("730418");
  await page.reload();
  await expect(page.getByLabel("Enter the code")).toHaveValue("730418");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByLabel("New password", { exact: true }).fill("abc");
  await expect(page.getByText("At least 8 characters")).toBeVisible();
  await page.getByLabel("New password", { exact: true }).fill("Blue-Harbor-27");
  await page.getByLabel("Confirm new password").fill("Blue-Harbor-72");
  await page.getByRole("button", { name: "Save password" }).click();
  await expect(page.getByText(/two passwords are different/)).toBeVisible();
  await page.getByLabel("Confirm new password").fill("Blue-Harbor-27");
  await page.getByRole("button", { name: "Save password" }).click();
  await page.getByLabel("Password", { exact: true }).fill("Blue-Harbor-27");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.getByRole("button", { name: "Account: Maya Torres" }).click();
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(
    page.getByRole("heading", { name: "You’re signed out" }),
  ).toBeVisible();
  const saved = await page.evaluate(
    () => localStorage.getItem("digital-practice:password:v1:guest") || "",
  );
  expect(saved).toContain('"stage":"complete"');
  expect(saved).not.toContain("Blue-Harbor");
});
test("password activity fits a phone screen", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/practice/password");
  await page.getByRole("button", { name: /Maya Torres/ }).click();
  await page.getByRole("link", { name: "Forgot password?" }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
