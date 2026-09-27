import type { TaskKey } from "@/lib/desktop-content";
import type { Lang } from "@/lib/task-types";

/**
 * Sentences a learner actually typed in the Story Mode Audit (27 Sep 2026),
 * with what the task *should* do with them. Today many of these are graded the
 * wrong way round; `curriculum/story-audit-tracker.md` says which fix owns each.
 *
 * Grading tests import this list rather than restating the sentences, so the
 * audit's evidence and the tests cannot drift apart. `field` names the box
 * when a task has more than one.
 */
export type AuditSentence = {
  task: TaskKey;
  /** The audit's day label, so a failure points back to the report. */
  day: string;
  lang: Lang;
  field?: string;
  text: string;
  expect: "accept" | "reject";
  why: string;
};

export const STORY_AUDIT_SENTENCES: AuditSentence[] = [
  // ── Rejected today, but correct ────────────────────────────────────────
  { task: "call-out-sick", day: "Day 5", lang: "en", text: "I am sick. I no come today.", expect: "accept", why: "Says sick and not coming, in beginner English." },
  { task: "call-out-sick", day: "Day 5", lang: "en", text: "i cant go to work today", expect: "accept", why: "Says not coming today." },
  { task: "incident", day: "Day 7", lang: "en", text: "he is ok, i mop the floor and say sorry", expect: "accept", why: "True facts: customer is fine, floor cleaned, apology given." },
  { task: "mail-send-link", day: "Day 10", lang: "en", text: "I did not attach it. It is shared in Drive.", expect: "accept", why: "Explains the file is shared, not attached." },
  { task: "team-meeting", day: "Day 16", lang: "en", field: "title", text: "team meeting next week", expect: "accept", why: "A plain, accurate meeting title." },
  { task: "team-meeting", day: "Day 16", lang: "en", field: "agenda", text: "talk about schedule and saturday", expect: "accept", why: "One honest agenda line about the schedule." },
  { task: "priority-call", day: "Day 17", lang: "en", text: "I will tell the barista about the milk", expect: "accept", why: "Promises no free drink; the correction wrongly says it does." },
  { task: "college-offer", day: "Day 18", lang: "en", text: "yes ok thank you", expect: "accept", why: "A clear yes." },
  { task: "enrollment", day: "Day 21 A", lang: "en", text: "I like to learn english and work in hospital", expect: "accept", why: "An honest reason for the application." },
  { task: "billing-sheet", day: "Day 23 B", lang: "en", text: "row 4 is wrong. It should be $85.", expect: "accept", why: "Names the row and the right charge." },
  { task: "confidentiality-call", day: "Day 24 B", lang: "en", text: "Sorry, I can not give information. Maya will call you.", expect: "accept", why: "Shares nothing and offers a callback." },
  // Shares nothing, but the task also asks for a callback. The correction must ask for that, not for a refusal (see the privacy tests).
  { task: "confidentiality-call", day: "Day 24 B", lang: "en", text: "I can not give information", expect: "reject", why: "Shares nothing; only the callback offer is missing." },
  // No field: the start date as the audit typed it inside a reply. Graded by the reply's date check.
  { task: "job-offer", day: "Day 28", lang: "en", text: "October 6th", expect: "accept", why: "The right start date, written with an ordinal." },
  { task: "job-offer", day: "Day 28", lang: "en", text: "6th of October", expect: "accept", why: "The right start date, day first." },
  { task: "job-offer", day: "Day 28", lang: "en", field: "reply", text: "ok i come monday", expect: "accept", why: "A clear acceptance with the day." },
  // No field: the gap half of the summary. The full summary also needs the total (see the grading tests).
  { task: "ops-report-packet", day: "Day 36", lang: "en", text: "Thursday morning open no person", expect: "accept", why: "Names the coverage gap without the phrase \"coverage gap\"." },
  { task: "portfolio-reflection", day: "Day 37", lang: "en", text: "email / computer / no scared / is good", expect: "accept", why: "The card says a few words each is fine." },

  // Privacy, in both languages and around the edges (added with the #4 fix).
  { task: "confidentiality-call", day: "Day 24 B", lang: "en", text: "I can't tell you if she has an appointment. I can have Maya call you back.", expect: "accept", why: "A refused confirmation is not a leak." },
  { task: "confidentiality-call", day: "Day 24 B", lang: "es", text: "Lo siento, no puedo dar información. Maya te va a llamar.", expect: "accept", why: "Shares nothing and offers a callback." },
  { task: "patient-intake", day: "Day 22 B", lang: "es", field: "decline", text: "No puedo compartir eso. Es privado.", expect: "accept", why: "A plain refusal." },
  { task: "patient-intake", day: "Day 22 B", lang: "en", field: "decline", text: "Sorry Tomás, I can't tell you why she is here. It is only for the care team.", expect: "accept", why: "Refuses the question without answering it." },

  // ── Accepted today, but wrong ──────────────────────────────────────────
  { task: "timeclock", day: "Day 3", lang: "en", text: "hi maria. clock is wrong", expect: "reject", why: "No times; Maria cannot fix the punch." },
  { task: "incident", day: "Day 7", lang: "en", text: "The customer was badly hurt. I did not clean anything and did not tell anyone.", expect: "reject", why: "Every fact is false." },
  { task: "college-offer", day: "Day 18", lang: "en", text: "I do not accept the class", expect: "reject", why: "A no, graded as accepting." },
  { task: "reply-all", day: "Day 20", lang: "en", text: "I am not sure", expect: "reject", why: "Not a yes or a no." },
  { task: "enrollment", day: "Day 21 A", lang: "en", text: "asdf college asdf asdf asdf", expect: "reject", why: "Nonsense around a keyword." },
  { task: "patient-intake", day: "Day 22 B", lang: "en", field: "form", text: "x / x / x", expect: "reject", why: "Nothing copied from the paper form." },
  { task: "patient-intake", day: "Day 22 B", lang: "en", field: "decline", text: "Sorry Tomas, she is here for her cough. I cant show the form.", expect: "reject", why: "Gives away the reason for the visit." },
  { task: "confidentiality-call", day: "Day 24 B", lang: "en", text: "Maya comes at 11:30 today. I cannot tell you more, but I will have Maya call you back.", expect: "reject", why: "Confirms the appointment time to an unverified caller." },
  { task: "confidentiality-call", day: "Day 24 B", lang: "en", text: "She has an appointment today, but I can't say the time. Maya will call you back.", expect: "reject", why: "Confirms the visit before refusing." },
  { task: "confidentiality-call", day: "Day 24 B", lang: "es", text: "Sí, tiene cita a las 11:30. Maya te llama después.", expect: "reject", why: "Confirms the visit and its time." },
  { task: "patient-intake", day: "Day 22 B", lang: "es", field: "decline", text: "Perdón Tomás, ella está aquí por su tos. No puedo mostrar el formulario.", expect: "reject", why: "Gives away the reason for the visit." },
  { task: "interview-practice", day: "Day 27", lang: "en", text: "money money money money money money", expect: "reject", why: "Word count is not an answer." },
  // The audit filed this under Day 31's scheduling task, but the question box is the video call's chat (same day).
  { task: "video-call", day: "Day 31", lang: "en", field: "question", text: "hi", expect: "reject", why: "Not a question." },
  { task: "meeting-minutes", day: "Day 34", lang: "en", field: "followup", text: "", expect: "reject", why: "The follow-up email is the point of the task." },
  { task: "meeting-minutes", day: "Day 34", lang: "en", field: "notes", text: "ok / ok", expect: "reject", why: "No decisions or owners." },
  { task: "ops-report-packet", day: "Day 36", lang: "en", text: "Everything fine. 4820 thursday morning need", expect: "reject", why: "Says everything is fine while a shift is uncovered." },

  // ── Spanish, for each check rewired by #5 ──────────────────────────────
  { task: "call-out-sick", day: "Day 5", lang: "es", text: "Estoy enferma. Hoy no voy a trabajar.", expect: "accept", why: "Says not coming today." },
  { task: "call-out-sick", day: "Day 5", lang: "es", text: "Estoy enfermo hoy.", expect: "reject", why: "Only says sick." },
  { task: "timeclock", day: "Day 3", lang: "es", text: "Hola Maria, llegué a las 7 pero el reloj dice 8:15.", expect: "accept", why: "Gives the arrival time." },
  { task: "timeclock", day: "Day 3", lang: "es", text: "hola maria. el reloj está mal", expect: "reject", why: "No times." },
  { task: "incident", day: "Day 7", lang: "es", text: "El cliente está bien. Limpié el piso y pedí perdón.", expect: "accept", why: "True facts, beginner Spanish." },
  { task: "incident", day: "Day 7", lang: "es", text: "El cliente se lastimó mucho. No limpié nada.", expect: "reject", why: "False facts." },
  { task: "mail-send-link", day: "Day 10", lang: "es", text: "No lo adjunté. Está compartido en Drive.", expect: "accept", why: "Shared, not attached." },
  { task: "mail-send-link", day: "Day 10", lang: "es", text: "Te adjunto el horario.", expect: "reject", why: "Sends a copy." },
  { task: "team-meeting", day: "Day 16", lang: "es", field: "title", text: "reunión del equipo", expect: "accept", why: "A plain title." },
  { task: "team-meeting", day: "Day 16", lang: "es", field: "title", text: "hola", expect: "reject", why: "Says nothing about the meeting." },
  { task: "team-meeting", day: "Day 16", lang: "es", field: "agenda", text: "hablar del horario y el sábado", expect: "accept", why: "One line, two topics." },
  { task: "team-meeting", day: "Day 16", lang: "es", field: "agenda", text: "horario", expect: "reject", why: "Only one thing." },
  { task: "priority-call", day: "Day 17", lang: "es", text: "Perdón, le voy a decir al barista lo de la leche.", expect: "accept", why: "Acknowledges, promises nothing free." },
  { task: "priority-call", day: "Day 17", lang: "es", text: "Tu próxima bebida es gratis.", expect: "reject", why: "Over-promises." },
  { task: "college-offer", day: "Day 18", lang: "es", text: "sí, gracias", expect: "accept", why: "A clear yes." },
  { task: "college-offer", day: "Day 18", lang: "es", text: "No acepto la clase", expect: "reject", why: "A no." },
  { task: "reply-all", day: "Day 20", lang: "es", text: "Sí, podemos recibir la entrega del viernes.", expect: "accept", why: "A yes." },
  { task: "reply-all", day: "Day 20", lang: "es", text: "No estoy segura", expect: "reject", why: "Not a yes or a no." },
  { task: "enrollment", day: "Day 21 A", lang: "es", text: "Quiero aprender inglés y trabajar en un hospital", expect: "accept", why: "An honest reason." },
  { task: "enrollment", day: "Day 21 A", lang: "es", text: "asdf universidad asdf asdf", expect: "reject", why: "Nonsense around a keyword." },
  { task: "patient-intake", day: "Day 22 B", lang: "es", field: "form", text: "maya ansari / 3/12/1998 / seguimiento", expect: "accept", why: "Copied from the paper form." },
  { task: "billing-sheet", day: "Day 23 B", lang: "es", text: "La fila 4 está mal. Debe ser $85.", expect: "accept", why: "Names the row and the charge." },
  { task: "billing-sheet", day: "Day 23 B", lang: "es", text: "La fila 4 está mal.", expect: "reject", why: "No right charge." },
  { task: "interview-practice", day: "Day 27", lang: "es", text: "Me gusta trabajar con personas y aprender cosas nuevas", expect: "accept", why: "A real answer." },
  { task: "interview-practice", day: "Day 27", lang: "es", text: "dinero dinero dinero dinero dinero dinero", expect: "reject", why: "One word on repeat." },
  { task: "job-offer", day: "Day 28", lang: "es", field: "reply", text: "Acepto, gracias. Empiezo el 6 de octubre.", expect: "accept", why: "Accepts with the date." },
  { task: "job-offer", day: "Day 28", lang: "es", field: "reply", text: "No acepto el puesto.", expect: "reject", why: "A no." },
  { task: "video-call", day: "Day 31", lang: "es", field: "question", text: "¿Para cuándo es el reporte?", expect: "accept", why: "A question." },
  { task: "video-call", day: "Day 31", lang: "es", field: "question", text: "hola", expect: "reject", why: "A hello." },
  { task: "meeting-minutes", day: "Day 34", lang: "es", field: "followup", text: "Cierre del sábado: Jordan, sábado. Proveedor: Alex, lunes.", expect: "accept", why: "Who and when." },
  { task: "meeting-minutes", day: "Day 34", lang: "es", field: "followup", text: "gracias a todos", expect: "reject", why: "No owners or days." },
  { task: "meeting-minutes", day: "Day 34", lang: "es", field: "notes", text: "Jordan cierre sábado / Alex llama proveedor", expect: "accept", why: "Decisions and owners." },
  { task: "ops-report-packet", day: "Day 36", lang: "es", text: "El jueves en la mañana no hay nadie en la apertura.", expect: "accept", why: "Names the gap." },
  { task: "ops-report-packet", day: "Day 36", lang: "es", text: "Todo bien. 4820 jueves mañana", expect: "reject", why: "Says all is fine." },
  { task: "portfolio-reflection", day: "Day 37", lang: "es", text: "correo / computadora / sin miedo / está bien", expect: "accept", why: "A few words each." },
  { task: "portfolio-reflection", day: "Day 37", lang: "es", text: "correo /  / sin miedo / bien", expect: "reject", why: "Question 2 is blank." },
];
