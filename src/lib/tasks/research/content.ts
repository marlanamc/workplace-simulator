import type { Lang, Lesson, Localized } from "@/lib/task-types";

export const CREDIBLE_KEY = "database";

export const RESULTS = [
  {
    key: "promo",
    kind: { en: "Sponsored", es: "Patrocinado" },
    title: { en: "Top 10 workplace tips that HR doesn't want you to know", es: "10 tips de trabajo que RR. HH. no quiere que sepas" },
    source: { en: "careersuccess.biz", es: "careersuccess.biz" },
    blurb: {
      en: "Buy our guide. Instant download. Limited offer.",
      es: "Compra nuestra guía. Descarga inmediata. Oferta limitada.",
    },
  },
  {
    key: "outdated",
    kind: { en: "Article · 2014", es: "Artículo · 2014" },
    title: { en: "Email is dying: what offices will use instead", es: "El correo se acaba: qué usarán las oficinas" },
    source: { en: "OfficeTrends Magazine", es: "OfficeTrends Magazine" },
    blurb: {
      en: "A 2014 prediction that every workplace would drop email by 2018.",
      es: "Una predicción de 2014 de que toda oficina dejaría el correo en 2018.",
    },
  },
  {
    key: "forum",
    kind: { en: "Forum", es: "Foro" },
    title: { en: "My manager is the worst, what should I do lol", es: "Mi gerente es lo peor, ¿qué hago jaja" },
    source: { en: "r/jobs", es: "r/jobs" },
    blurb: {
      en: "Anonymous replies. No names. No sources.",
      es: "Respuestas anónimas. Sin nombres. Sin fuentes.",
    },
  },
  {
    key: "database",
    kind: { en: "Library database", es: "Base de datos" },
    title: { en: "Workplace communication: a review of professional email practice", es: "Comunicación en el trabajo: una revisión del correo profesional" },
    source: { en: "BHCC Library · Academic Search", es: "Biblioteca BHCC · Academic Search" },
    blurb: {
      en: "Peer-reviewed, 2024. Authors and a journal are named.",
      es: "Revisado por pares, 2024. Nombran autores y una revista.",
    },
  },
] as const;

export const RESEARCH_COPY: Record<Lang, {
  helpBtn: string;
  heading: string;
  query: string;
  pickLabel: string;
  whyLabel: string;
  whyHint: string;
  cite: string;
  needPick: string;
  empty: string;
  weak: string;
  sentKicker: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
}> = {
  en: {
    helpBtn: "Help me with this step",
    heading: "Library search",
    query: "workplace email professional",
    pickLabel: "Which one would you cite?",
    whyLabel: "Why this one",
    whyHint: "One line — who wrote it, or why you can trust it…",
    cite: "Cite this source",
    needPick: "Pick a result first.",
    empty: "Say why in one line.",
    weak: "Say it is from a database, or that it was reviewed, or that it names its authors — not just that you like it.",
    sentKicker: "Source cited",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
  },
  es: {
    helpBtn: "Ayúdame con este paso",
    heading: "Búsqueda en la biblioteca",
    query: "correo profesional en el trabajo",
    pickLabel: "¿Cuál citarías?",
    whyLabel: "Por qué este",
    whyHint: "Una línea — quién lo escribió, o por qué puedes confiar en él…",
    cite: "Citar esta fuente",
    needPick: "Primero elige un resultado.",
    empty: "Di por qué en una línea.",
    weak: "Di que es de una base de datos, o que fue revisado, o que nombra a sus autores — no solo que te gusta.",
    sentKicker: "Fuente citada",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
  },
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "It is from the library database and names its authors.",
    "Peer-reviewed, 2024 — not an ad or a forum.",
    "Es de la base de datos y tiene autores.",
  ],
  es: [
    "Es de la base de datos de la biblioteca y nombra autores.",
    "Revisado por pares, 2024 — no es un anuncio ni un foro.",
    "It is from the library database and names its authors.",
  ],
};

export function whyHoldsUp(body: string): boolean {
  const t = body.toLowerCase();
  if (t.trim().length < 12) return false;
  return /database|base de datos|peer|revis|author|autor|journal|revista|library|biblioteca|2024|academic/.test(t);
}

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Cite a source you can trust",
      s: [
        "An ad is trying to sell you something. A forum post is anonymous. A prediction from 2014 is out of date.",
        "A library database gives you the authors, the year, and the journal.",
        "Your one line should point to one of those facts, not just say \"it looks good.\"",
      ],
      tip: "If you cannot say who wrote it, do not cite it.",
    },
  ],
  es: [
    {
      t: "Cita una fuente en la que puedas confiar",
      s: [
        "Un anuncio te quiere vender algo. Un mensaje de foro es anónimo. Una predicción de 2014 ya está desactualizada.",
        "Una base de datos de biblioteca te da los autores, el año y la revista.",
        "Tu línea debe señalar uno de esos datos, no solo decir \"se ve bien.\"",
      ],
      tip: "Si no puedes decir quién lo escribió, no lo cites.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Read the four results.", es: "Lee los cuatro resultados." },
  { en: "Pick the library database.", es: "Elige la base de datos." },
  { en: "Write one line on why you can trust it.", es: "Escribe una línea sobre por qué puedes confiar en él." },
];
