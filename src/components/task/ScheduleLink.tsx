"use client";

import type { Lang } from '@/lib/task-types';
import { SHARED_SCHEDULE_URL } from '@/lib/schedule-link';
import { useNudge } from '@/lib/use-nudge';
import NudgeToast from './NudgeToast';

export default function ScheduleLink({ lang }: { lang: Lang }) {
  const { nudge, say, dismiss } = useNudge();
  async function copy() {
    try {
      await navigator.clipboard.writeText(SHARED_SCHEDULE_URL);
      say(lang === 'en' ? 'Link copied. Paste it into your message.' : 'Enlace copiado. Pégalo en tu mensaje.');
    } catch {
      say(lang === 'en' ? 'Select the link text and copy it with Ctrl+C or Command+C.' : 'Selecciona el texto del enlace y cópialo con Ctrl+C o Command+C.');
    }
  }
  return <div className="rounded-lg border border-[#dadce0] p-3 text-[13px]">
    <label className="block">
      <span>{lang === 'en' ? 'Shared schedule link' : 'Enlace del horario compartido'}</span>
      <input readOnly value={SHARED_SCHEDULE_URL} onFocus={e => e.target.select()} className="mt-1 w-full rounded border border-[#747775] p-2" />
    </label>
    <button type="button" data-card-avoid onClick={() => void copy()} className="mt-2 min-h-11 rounded-full border border-[#dadce0] px-4 text-[#0b57d0]">{lang === 'en' ? 'Copy link' : 'Copiar enlace'}</button>
    <NudgeToast text={nudge} onDismiss={dismiss} />
  </div>;
}
