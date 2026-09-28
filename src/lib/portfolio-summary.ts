import type { TaskKey } from './desktop-content';
import type { Lang, Localized } from './task-types';
import type { CourseRoute } from './course-route';
import { ACTS, LEVELS, TRACKS, isLevelComplete, type Level } from './tracks-content';
import { dayNumber } from './shift-spine';
import { firstPersonSkill } from './skills';
import { PROMPTS, REFLECTION_COPY } from './tasks/portfolio-reflection/content';

/**
 * The summary a learner keeps: what they can do now, in first-person skill
 * lines, grouped under plain headings. One builder for every ending: the
 * Office route's Recap (level27) and the Job Card's "See my summary" at every
 * other route end and at "Stop here for now" (the `/summary` page).
 *
 * Credit comes from finished tasks only, never from a badge alone. Pure: the
 * date is passed in, so tests control it.
 */

/** The honest line every copy of the summary carries. */
export const HONEST_LINE: Localized = {
  en: 'Simulated workplace practice, not employment history.',
  es: 'Práctica laboral simulada, no es historial de empleo.',
};

export const SUMMARY_COPY = {
  title: { en: 'Workplace practice summary', es: 'Resumen de práctica laboral' },
  program: { en: 'Workplace Simulator, EBHCS', es: 'Workplace Simulator, EBHCS' },
  nameLabel: { en: 'Name', es: 'Nombre' },
  classLabel: { en: 'Class code', es: 'Código de clase' },
  dateLabel: { en: 'Date', es: 'Fecha' },
  programLabel: { en: 'Program', es: 'Programa' },
  canDoHeading: { en: 'What I can do now', es: 'Lo que ya puedo hacer' },
  daysLine: {
    en: (n: number) => `Days of work finished: ${n}`,
    es: (n: number) => `Días de trabajo terminados: ${n}`,
  },
  nothingYet: {
    en: 'Your skills will show here after you finish your first task.',
    es: 'Tus habilidades aparecerán aquí cuando termines tu primera tarea.',
  },
  seeSummary: { en: 'See my summary', es: 'Ver mi resumen' },
  backToDesk: { en: 'Back to my desk', es: 'Volver a mi escritorio' },
  print: { en: 'Print', es: 'Imprimir' },
} as const;

/** Plain headings instead of bare act numbers, in the order they happen. */
export const SECTION_KEYS = ['start', 'shift', 'lead', 'college', 'frontDesk', 'hired', 'office', 'teamLead'] as const;
export type SectionKey = typeof SECTION_KEYS[number];
export const SECTION_HEADINGS: Record<SectionKey, Localized> = {
  start: { en: 'Starting a new job', es: 'Empezar en un trabajo nuevo' },
  shift: { en: 'Leading a shift', es: 'Dirigir un turno' },
  lead: { en: 'Supervising a team', es: 'Supervisar a un equipo' },
  college: { en: 'Getting ready for college', es: 'Prepararme para la universidad' },
  frontDesk: { en: 'Working at a clinic front desk', es: 'Trabajar en la recepción de una clínica' },
  hired: { en: 'Getting hired', es: 'Conseguir un trabajo' },
  office: { en: 'Working in an office', es: 'Trabajar en una oficina' },
  teamLead: { en: 'Leading an office team', es: 'Dirigir un equipo de oficina' },
};

/**
 * Not workplace skills: the how-this-works tour teaches the simulator
 * itself, and the Recap is the look back that makes this summary.
 */
const NOT_A_WORK_SKILL: ReadonlySet<TaskKey> = new Set<TaskKey>(['portfolio-reflection']);

function sectionFor(level: Level, trackKey: string): SectionKey | null {
  const act = ACTS.find((a) => a.levelKeys.includes(level.key))?.key;
  if (level.key === 'level0') return null;
  switch (act) {
    case 'act1': return 'start';
    case 'act2': return 'shift';
    case 'act3':
    case 'act4': return 'lead';
    case 'act5': return level.pathTracks?.b === trackKey ? 'frontDesk' : 'college';
    case 'act6': return level.preHire ? 'hired' : 'office';
    case 'act7': return 'teamLead';
    default: return null;
  }
}

export interface SummarySection {
  key: SectionKey;
  heading: string;
  /** First-person skill lines: "I can read a pay stub." */
  items: string[];
}

/** Every finished task's skill, grouped under plain headings. */
export function summarySections(completedTaskKeys: readonly TaskKey[], lang: Lang): SummarySection[] {
  const done = new Set(completedTaskKeys);
  const items = new Map<SectionKey, string[]>();
  for (const level of LEVELS) {
    const trackKeys = level.pathTracks ? [level.pathTracks.a, level.pathTracks.b] : level.trackKeys;
    for (const trackKey of trackKeys) {
      const section = sectionFor(level, trackKey);
      const track = TRACKS.find((t) => t.key === trackKey);
      if (!section || !track) continue;
      for (const taskKey of track.taskKeys) {
        if (!done.has(taskKey) || NOT_A_WORK_SKILL.has(taskKey)) continue;
        const line = firstPersonSkill(taskKey, lang);
        const list = items.get(section) ?? [];
        // Two tasks can teach the same skill; list it once.
        if (!list.includes(line)) list.push(line);
        items.set(section, list);
      }
    }
  }
  return SECTION_KEYS.filter((key) => items.has(key)).map((key) => ({
    key,
    heading: SECTION_HEADINGS[key][lang],
    items: items.get(key)!,
  }));
}

/**
 * Days on the job the learner has finished: every workday level whose tasks
 * are all done. The night before the first shift and the getting-hired
 * sittings are not days of work. A bridge day counts when either door is done.
 */
export function workdaysFinished(completedTaskKeys: readonly TaskKey[]): number {
  const done = [...completedTaskKeys];
  return LEVELS.filter((level) => {
    if (dayNumber(level) <= 0 || level.key === 'level1' || level.preHire) return false;
    return level.pathTracks
      ? isLevelComplete(level, done, 'a') || isLevelComplete(level, done, 'b')
      : isLevelComplete(level, done, null);
  }).length;
}

/** The date as a learner would write it: "September 28, 2026" / "28 de septiembre de 2026". */
export function summaryDate(now: Date, lang: Lang, timeZone?: string): string {
  return now.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone });
}

export interface CourseSummary {
  title: string;
  /** Label/value rows: name, class code, date, program. Empty values are left out. */
  details: { label: string; value: string }[];
  honestLine: string;
  daysLine: string;
  canDoHeading: string;
  sections: SummarySection[];
}

export function buildCourseSummary(input: {
  displayName: string;
  classCode?: string;
  /** Passed in, never read here. Omit to leave the date off. */
  now?: Date;
  timeZone?: string;
  completedTaskKeys: readonly TaskKey[];
  lang: Lang;
}): CourseSummary {
  const { lang } = input;
  const details = [
    { label: SUMMARY_COPY.nameLabel[lang], value: input.displayName.trim() },
    { label: SUMMARY_COPY.classLabel[lang], value: input.classCode?.trim() ?? '' },
    { label: SUMMARY_COPY.dateLabel[lang], value: input.now ? summaryDate(input.now, lang, input.timeZone) : '' },
    { label: SUMMARY_COPY.programLabel[lang], value: SUMMARY_COPY.program[lang] },
  ].filter((row) => row.value);
  return {
    title: SUMMARY_COPY.title[lang],
    details,
    honestLine: HONEST_LINE[lang],
    daysLine: SUMMARY_COPY.daysLine[lang](workdaysFinished(input.completedTaskKeys)),
    canDoHeading: SUMMARY_COPY.canDoHeading[lang],
    sections: summarySections(input.completedTaskKeys, lang),
  };
}

/** The same summary as plain text: what Copy puts on the clipboard and Download saves. */
export function formatCourseSummary(summary: CourseSummary): string {
  const lines = [summary.title, ...summary.details.map((d) => `${d.label}: ${d.value}`), summary.honestLine, '', summary.daysLine, '', summary.canDoHeading, ''];
  for (const section of summary.sections) {
    lines.push(section.heading);
    for (const item of section.items) lines.push(`- ${item}`);
    lines.push('');
  }
  return lines.join('\n').trim();
}

/** The Recap's text: the same summary, plus the learner's own reflections. Shared by clipboard and UTF-8 download. */
export function formatPortfolioSummary(input: {
  displayName?: string;
  completedTaskKeys: readonly TaskKey[];
  answers: readonly string[];
  lang: Lang;
}): string {
  const { lang, answers } = input;
  const c = REFLECTION_COPY[lang];
  const summary = formatCourseSummary(buildCourseSummary({ displayName: input.displayName ?? '', completedTaskKeys: input.completedTaskKeys, lang }));
  const lines = [summary, '', c.reflectionHeading, ''];
  PROMPTS.forEach((prompt, i) => lines.push(prompt[lang], answers[i] ?? '', ''));
  return lines.join('\n').trim();
}

/** What the Job Card says when a route ends, or when the learner stops here. */
const ROUTE_NAMES: Record<Exclude<CourseRoute, 'pause'>, Localized> = {
  lead: { en: 'Stay and lead', es: 'Quedarme y liderar' },
  healthcare: { en: 'Front desk', es: 'Recepción' },
  office: { en: 'Office', es: 'Oficina' },
  college: { en: 'College preparation', es: 'Preparación universitaria' },
};

export const ENDING_COPY = {
  routeKicker: { en: 'Route finished', es: 'Camino terminado' },
  routeLine: (route: Exclude<CourseRoute, 'pause'>, days: number, lang: Lang) =>
    lang === 'en'
      ? `You finished the “${ROUTE_NAMES[route].en}” route: ${days} days of work in all.`
      : `Terminaste el camino «${ROUTE_NAMES[route].es}»: ${days} días de trabajo en total.`,
  coreLine: (days: number, lang: Lang) =>
    lang === 'en'
      ? `You finished the core course: ${days} days of work.`
      : `Terminaste el curso básico: ${days} días de trabajo.`,
  stopLine: (days: number, lang: Lang) =>
    lang === 'en'
      ? `You finished ${days} days of work. Your progress is saved.`
      : `Terminaste ${days} días de trabajo. Tu progreso está guardado.`,
  summaryHint: {
    en: 'Your summary lists what you can do now. You can copy it, download it, or print it.',
    es: 'Tu resumen muestra lo que ya puedes hacer. Puedes copiarlo, descargarlo o imprimirlo.',
  },
} as const;
