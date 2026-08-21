import type { Lang, Localized } from "./task-types";

export type { Lang };

export type AppKey = "mail" | "clock" | "sched" | "orders" | "form" | "book";
export type AppState = "ready" | "done" | "locked";

export interface AppDef {
  key: AppKey;
  icon: string;
  color: string;
  href: string | null;
  state: AppState;
}

export const APP_DEFS: AppDef[] = [
  { key: "mail", icon: "✉", color: "#1a73e8", href: "/mail", state: "ready" },
  { key: "clock", icon: "⏱", color: "#1e8e3e", href: null, state: "done" },
  { key: "sched", icon: "▦", color: "#8430ce", href: null, state: "ready" },
  { key: "orders", icon: "☕", color: "#b06000", href: null, state: "ready" },
  { key: "form", icon: "⚠", color: "#c5221f", href: null, state: "locked" },
  { key: "book", icon: "▤", color: "#3c4043", href: null, state: "ready" },
];

interface AppCopy {
  name: string;
  kicker: string;
  brief: string;
  points: string[];
}

export const APP_COPY: Record<Lang, Record<AppKey, AppCopy>> = {
  en: {
    mail: {
      name: "WorkMail",
      kicker: "Task 1 of 5 · Email",
      brief: "Maria needs last month's safety report. Read her email, reply, and send the file.",
      points: ["Open the email from Maria Delgado", "Click Reply and write a short answer", "Attach safety-report-july.pdf, then Send"],
    },
    clock: {
      name: "Time Clock",
      kicker: "Task 2 of 5 · Timekeeping",
      brief: "You already clocked in this morning. At the end of the shift you'll clock out.",
      points: ["Find your name on the clock screen", "Press Clock Out at 3:00 PM", "Check that today shows 8 hours"],
    },
    sched: {
      name: "Schedule",
      kicker: "Task 3 of 5 · Schedule",
      brief: "Next week's schedule is up. Find your shifts and ask for a change the right way.",
      points: ["Find the days you're working", "Notice the shift you can't work", "Send a shift-swap request to Maria"],
    },
    orders: {
      name: "Order Terminal",
      kicker: "Task 4 of 5 · Customer service",
      brief: "Take a customer's order at the counter and ring it up.",
      points: ["Greet the customer and take the order", "Ring up 2 drinks and 1 pastry", "Fix the order when they change their mind"],
    },
    form: {
      name: "Incident Form",
      kicker: "Task 5 of 5 · Reporting",
      brief: "Someone spilled a box of syrup in the back room. Write it up.",
      points: ["Say what happened, in order", "Say when and where it happened", "Send the form to your lead"],
    },
    book: {
      name: "Handbook",
      kicker: "Reference",
      brief: "The employee handbook. You can open this any time.",
      points: ["Look up how to call out sick", "Find the break rules", "Find who to ask when you're stuck"],
    },
  },
  es: {
    mail: {
      name: "WorkMail",
      kicker: "Tarea 1 de 5 · Correo",
      brief: "Maria necesita el reporte de seguridad del mes pasado. Lee su correo, responde y envía el archivo.",
      points: ["Abre el correo de Maria Delgado", "Haz clic en Responder y escribe una respuesta corta", "Adjunta safety-report-july.pdf y envía"],
    },
    clock: {
      name: "Reloj",
      kicker: "Tarea 2 de 5 · Horas",
      brief: "Ya marcaste entrada hoy. Al final del turno vas a marcar salida.",
      points: ["Busca tu nombre en la pantalla", "Marca salida a las 3:00 PM", "Revisa que hoy muestre 8 horas"],
    },
    sched: {
      name: "Horario",
      kicker: "Tarea 3 de 5 · Horario",
      brief: "Ya está el horario de la próxima semana. Busca tus turnos y pide un cambio.",
      points: ["Busca los días que trabajas", "Fíjate en el turno que no puedes trabajar", "Pide un cambio de turno a Maria"],
    },
    orders: {
      name: "Caja",
      kicker: "Tarea 4 de 5 · Servicio",
      brief: "Toma el pedido de un cliente en el mostrador y cóbralo.",
      points: ["Saluda al cliente y toma el pedido", "Cobra 2 bebidas y 1 pan dulce", "Corrige el pedido cuando cambien de opinión"],
    },
    form: {
      name: "Reporte",
      kicker: "Tarea 5 de 5 · Reportes",
      brief: "Alguien derramó una caja de jarabe en la bodega. Escríbelo.",
      points: ["Di qué pasó, en orden", "Di cuándo y dónde pasó", "Envía el formulario a tu jefa"],
    },
    book: {
      name: "Manual",
      kicker: "Referencia",
      brief: "El manual del empleado. Puedes abrirlo cuando quieras.",
      points: ["Busca cómo avisar que estás enfermo", "Busca las reglas de descanso", "Busca a quién preguntar si te atoras"],
    },
  },
};

export const DESKTOP_COPY: Record<Lang, {
  practiceBanner: string;
  langBtn: string;
  nextLabel: string;
  progressWord: string;
  appsBtn: string;
  todayLabel: string;
  continueLabel: string;
  searchPlaceholder: string;
  back: string;
  start: string;
  soon: string;
  done: string;
  ready: string;
  locked: string;
  focusHeadline: string;
  focusCta: string;
}> = {
  en: {
    practiceBanner: "Practice space — nothing here is real",
    langBtn: "Español",
    nextLabel: "Do this next",
    progressWord: "tasks done",
    appsBtn: "Apps",
    todayLabel: "Your work apps",
    continueLabel: "Continue where you left off",
    searchPlaceholder: "Search your apps and tasks…",
    back: "Not now",
    start: "Start this task",
    soon: "Coming soon",
    done: "Done",
    ready: "Ready",
    locked: "Later",
    focusHeadline: "Answer Maria's email",
    focusCta: "Open WorkMail",
  },
  es: {
    practiceBanner: "Espacio de práctica — nada aquí es real",
    langBtn: "English",
    nextLabel: "Haz esto ahora",
    progressWord: "tareas hechas",
    appsBtn: "Apps",
    todayLabel: "Tus apps de trabajo",
    continueLabel: "Continúa donde lo dejaste",
    searchPlaceholder: "Busca tus apps y tareas…",
    back: "Ahora no",
    start: "Empezar esta tarea",
    soon: "Próximamente",
    done: "Hecho",
    ready: "Listo",
    locked: "Después",
    focusHeadline: "Contesta el correo de Maria",
    focusCta: "Abrir WorkMail",
  },
};

export interface RecentItem {
  icon: string;
  color: string;
  title: Localized;
  subtitle: Localized;
  appKey: AppKey;
}

export const RECENT_ITEMS: RecentItem[] = [
  {
    icon: "⏱",
    color: "#1e8e3e",
    title: { en: "Time Clock", es: "Reloj" },
    subtitle: { en: "You clocked in this morning", es: "Marcaste entrada hoy" },
    appKey: "clock",
  },
  {
    icon: "▤",
    color: "#3c4043",
    title: { en: "Employee Handbook", es: "Manual del empleado" },
    subtitle: { en: "You opened this last week", es: "Lo abriste la semana pasada" },
    appKey: "book",
  },
];
