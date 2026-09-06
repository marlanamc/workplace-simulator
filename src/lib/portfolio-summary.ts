import type { TaskKey } from './desktop-content';
import type { Lang } from './task-types';
import { earnedAwardsByAct, TASK_INFO } from './tracks-content';
import { PROMPTS, REFLECTION_COPY } from './tasks/portfolio-reflection/content';

export function actNumeral(title: string): string {
  return title.match(/^Act ([IVX]+)/)?.[1] ?? title;
}

/** Shared by clipboard and UTF-8 download; never infer task credit from a badge alone. */
export function formatPortfolioSummary(input: {
  certificateTrackKeys: readonly string[];
  completedTaskKeys: readonly TaskKey[];
  answers: readonly string[];
  lang: Lang;
}): string {
  const { lang, answers } = input;
  const c = REFLECTION_COPY[lang];
  const done = new Set(input.completedTaskKeys);
  const lines = [c.summaryTitle, lang === 'en' ? 'Simulated workplace practice — not employment history.' : 'Práctica laboral simulada — no es historial de empleo.', ''];
  for (const { act, tracks } of earnedAwardsByAct(input.certificateTrackKeys)) {
    const tasks = tracks.flatMap((track) => track.taskKeys).filter((key) => done.has(key));
    if (!tasks.length) continue;
    lines.push(`${lang === 'en' ? 'Act' : 'Acto'} ${actNumeral(act.title)}`);
    for (const key of tasks) lines.push(`- ${TASK_INFO[key].label[lang]}`);
    lines.push('');
  }
  lines.push(c.reflectionHeading, '');
  PROMPTS.forEach((prompt, i) => lines.push(prompt[lang], answers[i] ?? '', ''));
  return lines.join('\n').trim();
}
