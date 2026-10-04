import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CAST } from "@/lib/cast";
import { PDF_READER_CHROME } from "@/lib/desktop-content";
import { INTRO_BEATS } from "@/lib/job-card-content";
import { PDF_DOCUMENTS } from "@/lib/pdf-content";
import { storyMailAfter, storyMailsUpTo } from "@/lib/story-beats";
import { fileDateLabel } from "@/lib/story-dates";
import type { Lang } from "@/lib/task-types";
import { FIRST_REPLY_GUIDANCE } from "@/lib/tasks/mail/opening";
import {
  FILES,
  MAIL_COPY,
  MAIL_JOB_CARD_STEPS,
  bodyForTask,
  emailsForTask,
  mailEtiquetteAnswersDarnell,
} from "@/lib/tasks/mail/content";
import { PAYSTUB_COPY } from "@/lib/tasks/paystub/content";
import { TASKS } from "@/lib/tasks/registry";
import { SCHEDULE_COPY } from "@/lib/tasks/schedule/content";
import { REVIEW_COPY } from "@/lib/tasks/shift-review/content";
import { SWAP_COPY } from "@/lib/tasks/swap-request/content";
import { TIMECLOCK, TIMECLOCK_COPY } from "@/lib/tasks/timeclock/content";
import { TOUR_COPY, tourEventIntro } from "@/lib/tasks/tour/content";
import { downloadsFor } from "@/lib/tasks/upload-schedule/content";
import { ACTS, LEVELS, taskKeysForLevel } from "@/lib/tracks-content";
import { WELCOME_COPY } from "@/lib/welcome-content";

const LANGS: Lang[] = ["en", "es"];

/**
 * English month and weekday abbreviations. Case-sensitive, and without "Mar":
 * Spanish writes "Mar" for Tuesday and "mar"/"may" in lower case for months.
 */
const ENGLISH_DATE = /\b(Jan|Feb|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/;
/** Where the aprons are, the way a note would say it. */
const STORAGE_ROOM = /storage room|almac[eé]n/i;
const ENGLISH_CHROME = /\b(this week|Downloads|Page|Zoom|Print|Download)\b/;

const ACT_I_TASKS = ACTS.find((a) => a.key === "act1")!.levelKeys.flatMap((k) =>
  taskKeysForLevel(LEVELS.find((l) => l.key === k)!, null),
);

describe("Act I Spanish: dates and chrome follow the learner (Wave 5 F-11)", () => {
  it("the Time Clock's week total and punch dates are Spanish", () => {
    expect(TIMECLOCK.weekHours.es).toBe("16h 05m esta semana");
    expect(TIMECLOCK.weekHours.es).not.toMatch(ENGLISH_CHROME);
    for (const r of TIMECLOCK.recent) expect(r.date.es).not.toMatch(ENGLISH_DATE);
    expect(TIMECLOCK.recent.map((r) => r.date.es)).toEqual(["Mar, 18 ago", "Mié, 19 ago"]);
  });

  it("file dates read in Spanish; anything else is left as written", () => {
    expect(fileDateLabel("Jul 14", "es")).toBe("14 jul");
    expect(fileDateLabel("Aug 1, 2026", "es")).toBe("1 ago 2026");
    expect(fileDateLabel("Sep 4", "es")).toBe("4 sept");
    expect(fileDateLabel("Aug 1", "en")).toBe("Aug 1");
    expect(fileDateLabel("Draft", "es")).toBe("Draft");
    expect(fileDateLabel("Foo 3", "es")).toBe("Foo 3");
  });

  it("every file picker date column is Spanish in Spanish mode (Day 2 and Day 10)", () => {
    const pickers = [...FILES, ...downloadsFor(true)];
    const columns = pickers.flatMap((f) => f.columns ?? []);
    expect(columns.length).toBeGreaterThan(5);
    for (const col of columns) expect(fileDateLabel(col, "es"), col).not.toMatch(ENGLISH_DATE);
  });

  it("every PDF Reader file date is Spanish in Spanish mode", () => {
    for (const d of PDF_DOCUMENTS) expect(fileDateLabel(d.date, "es"), d.id).not.toMatch(ENGLISH_DATE);
  });

  it("the PDF Reader's chrome is Spanish", () => {
    expect(PDF_READER_CHROME.es.downloads).toBe("Descargas");
    expect(PDF_READER_CHROME.es.page).toBe("Página");
    for (const v of Object.values(PDF_READER_CHROME.es)) expect(v).not.toMatch(ENGLISH_CHROME);
  });

  it("the PDF Reader draws no English chrome of its own", () => {
    const src = readFileSync(join(process.cwd(), "src/app/pdf-reader/PdfReaderClient.tsx"), "utf8");
    expect(src).not.toMatch(/>\s*(Downloads|Page 1 \/ 1)\s*</);
    expect(src).not.toMatch(/(aria-label|title)="[A-Z]/);
  });

  it("the Portal tab and the Time Clock heading are one name", () => {
    expect(TIMECLOCK_COPY.es.heading).toBe("Reloj marcador");
    const src = readFileSync(join(process.cwd(), "src/app/browser/PortalPage.tsx"), "utf8");
    // The tab reads the heading instead of carrying its own translation.
    expect(src).toContain("TIMECLOCK_COPY.es.heading");
    expect(src).not.toMatch(/"Reloj [a-z]+"/);
  });
});

describe("Act I Help reads the same everywhere (Wave 5 F-19, F-24)", () => {
  const HELP_COPY: Record<string, Record<Lang, { lessonKicker: string; gotIt: string }>> = {
    tour: TOUR_COPY,
    "mail-reply": MAIL_COPY,
    schedule: SCHEDULE_COPY,
    "schedule (swap form)": SWAP_COPY,
    "mail-attach": MAIL_COPY,
    timeclock: TIMECLOCK_COPY,
    "shift-review": REVIEW_COPY,
    "mail-etiquette": MAIL_COPY,
    "call-out-sick": MAIL_COPY,
    paystub: PAYSTUB_COPY,
  };

  it("covers every Act I task", () => {
    for (const task of ACT_I_TASKS) expect(Object.keys(HELP_COPY), task).toContain(task);
  });

  it.each(LANGS)("every Act I Help closes with the same words (%s)", (lang) => {
    const labels = new Set(Object.values(HELP_COPY).map((c) => c[lang].gotIt));
    expect([...labels]).toEqual([lang === "en" ? "I understand. Back to my task" : "Entendido. Volver a mi tarea"]);
  });

  it.each(LANGS)("no Act I Help calls itself a 2-minute lesson (%s)", (lang) => {
    for (const [task, c] of Object.entries(HELP_COPY)) {
      expect(c[lang].lessonKicker, task).not.toMatch(/2|minut|lesson|lecci/i);
      expect(c[lang].lessonKicker, task).toBe(lang === "en" ? "Quick help" : "Ayuda rápida");
    }
  });
});

describe("Act I first-day wording (Wave 5 F-19)", () => {
  it.each(LANGS)("the night-before cards do not call it the first day (%s)", (lang) => {
    const kickers = [INTRO_BEATS[0].kicker[lang], tourEventIntro(lang, "Ana").kicker];
    for (const k of kickers) expect(k).not.toMatch(/first day|primer d[ií]a/i);
    // It agrees with the card that follows: "Your first shift is tomorrow".
    for (const k of kickers) expect(k).toMatch(/first shift|primer turno/i);
  });

  it("the welcome's Spanish is not a calque", () => {
    expect(WELCOME_COPY.purposeLine2.es).not.toMatch(/Comete/);
    expect(WELCOME_COPY.purposeLine2.es).toBe("Puedes equivocarte, volver a intentarlo y aprender.");
  });

  it("every published phone number uses one format", () => {
    const phones = Object.values(CAST).flatMap((m) => ("phone" in m && m.phone ? [m.phone] : []));
    expect(phones.length).toBeGreaterThan(0);
    for (const p of phones) expect(p).toMatch(/^\(\d{3}\) \d{3}-\d{4}$/);
  });
});

describe("Day 4's answer is in the story before Day 4 (Wave 5 F-18)", () => {
  const note = storyMailAfter("timeclock")!;

  it.each(LANGS)("Maria's Day 3 note says where the aprons are (%s)", (lang) => {
    expect(note.subject.en).toBe("Your hours note");
    const line = note.body![lang].find((l) => /apron|delantal/i.test(l));
    expect(line, "no apron line").toBeDefined();
    expect(line).toMatch(STORAGE_ROOM);
    // The same reader that grades Darnell's reply finds the storage room in it.
    expect(mailEtiquetteAnswersDarnell(line!)).toBe(true);
  });

  it("the note is already in the inbox when Day 4 starts", () => {
    const beforeDay4 = ACT_I_TASKS.slice(0, ACT_I_TASKS.indexOf("mail-etiquette"));
    expect(beforeDay4).toContain("timeclock");
    const inbox = storyMailsUpTo("mail-etiquette", beforeDay4, {});
    expect(inbox.map((m) => m.key)).toContain(note.key);
  });

  it.each(LANGS)("Day 4's own mail and card do not give the answer away (%s)", (lang) => {
    const day4 = [
      ...emailsForTask("mail-etiquette").flatMap((e) => [e.subject[lang], e.preview[lang], ...(e.body?.[lang] ?? [])]),
      ...bodyForTask("mail-etiquette", lang, "Ana").plain,
      ...bodyForTask("mail-etiquette", lang, "Ana").full,
      MAIL_JOB_CARD_STEPS.openMail["mail-etiquette"][lang],
      MAIL_JOB_CARD_STEPS.writeEtiquette[lang],
      MAIL_JOB_CARD_STEPS.send[lang],
      JSON.stringify(LEVELS.find((l) => l.key === "level3a")),
      TASKS["mail-etiquette"].handoffCta?.[lang] ?? "",
      JSON.stringify(TASKS["mail-etiquette"].shiftMoment ?? ""),
    ];
    for (const text of day4) expect(text).not.toMatch(STORAGE_ROOM);
  });
});

describe("The Night Before's first reply (Wave 5 F-15)", () => {
  it.each(LANGS)("the card asks only for the required reply and Send action (%s)", (lang) => {
    const line = FIRST_REPLY_GUIDANCE[lang];
    expect(line).not.toMatch(/hello|greeting|your name|salud|tu nombre/i);
    expect(line).toMatch(lang === "en" ? /Write a short reply.*click Send/ : /Escribe una respuesta corta.*clic en Enviar/);
  });
});
