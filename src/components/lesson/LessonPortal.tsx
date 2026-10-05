"use client";

import { useState, type ReactNode } from "react";
import { TAB_ICONS, CircleGlyph } from "@/lib/icons";
import PhoneFrame from "@/components/task/PhoneFrame";
import type { ConfidenceScenario } from "@/lib/tasks/confidence/content";
import type { Lang } from "@/lib/task-types";

/** The portal's Story chrome, without mounting unrelated Story tasks. */
export function LessonPortal({ scenario: s, lang, children, onRequest }: {scenario: ConfidenceScenario; lang: Lang; children: ReactNode; onRequest: () => void}) {
  const [tab, setTab] = useState('schedule');
  const t = (en: string, es: string) => lang === 'es' ? es : en;
  return <div className="flex min-h-full flex-col bg-surface-muted text-[15px] text-text-primary" data-testid="lesson-portal-workspace">
    <header className="flex items-center gap-3 border-b border-border bg-white px-4 py-3"><CircleGlyph icon={TAB_ICONS.portal} color="#8430ce" size={28}/><h1 className="font-medium">{t('Employee Portal','Portal del empleado')}</h1></header>
    <nav aria-label={t('Portal','Portal')} className="flex flex-wrap gap-1 border-b border-border bg-white px-4 pt-2">
      {[['schedule',t('Schedule','Horario')],['swap',t('Shift Swap','Cambio de turno')]].map(([id,label]) => <button key={id} aria-current={tab === id ? 'page' : undefined} onClick={() => setTab(id)} className={`min-h-11 rounded-t-lg px-4 py-2.5 text-sm font-medium ${tab === id ? 'border-b-2 border-[#8430ce] text-[#8430ce]' : 'text-text-secondary hover:bg-gray-100'}`}>{label}</button>)}
    </nav>
    <div className="space-y-5 p-4 sm:p-6">
      <h2 className="text-[19px] font-semibold">{s.title[lang]}</h2>
      <div className="flex flex-col items-start gap-6 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-5">
          <section className="overflow-hidden rounded-xl border border-border bg-white"><h3 className="border-b border-border bg-[#f8f9fa] px-4 py-3 font-semibold">{s.sources[0]?.title[lang]}</h3><div className="px-4 py-4"><p className="mb-3 text-sm text-text-secondary">{s.scheduleDisplay?.date[lang]}</p>{s.scheduleDisplay ? s.scheduleDisplay.slots.map((slot,i) => <div key={i} className="flex flex-wrap items-center justify-between gap-3 border-t border-border py-4"><span className="font-medium">{slot.label[lang]}</span><span className="tabular-nums">{slot.time[lang]}</span></div>) : <p className="whitespace-pre-line leading-loose">{s.sources[0]?.text[lang]}</p>}</div></section>
          <div hidden={tab !== 'swap'}>{children}</div>
          {tab === 'schedule' && <button data-showme="practice-schedule" className="min-h-11 rounded-lg border border-[#8430ce] bg-white px-5 py-2 font-medium text-[#8430ce]" onClick={() => {setTab('swap'); onRequest();}}>{t('Request change','Solicitar cambio')}</button>}
        </div>
        <aside className="w-full shrink-0 lg:w-[260px]">
          <PhoneFrame label={t('Your phone','Tu teléfono')}>
            {s.sources.slice(1).map((src,i) => <section key={i} className="px-4 pb-8 pt-3"><h3 className="mb-5 text-xl font-bold leading-tight">{src.title[lang]}</h3><p className="whitespace-pre-line border-l-[3px] border-[#ff3b30] pl-3 text-sm leading-relaxed">{src.text[lang]}</p></section>)}
          </PhoneFrame>
        </aside>
      </div>
    </div>
  </div>;
}

export function LessonClassroom({scenario: s, lang, children}: {scenario: ConfidenceScenario; lang: Lang; children: ReactNode}) {
  const t = (en: string, es: string) => lang === 'es' ? es : en;
  const Icon = TAB_ICONS.coursework;
  return <div className="min-h-full bg-white text-sm text-[#3c4043]" data-testid="lesson-classroom-workspace">
    <header className="flex items-center gap-3 border-b border-[#dadce0] px-4 py-3"><span aria-hidden className="text-xl text-[#5f6368]">☰</span><span className="rounded bg-[#1e8e3e] p-2 text-white"><Icon size={24}/></span><h1 className="text-xl text-[#5f6368]">Classroom</h1><span aria-hidden className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#1e8e3e] text-white">Y</span></header>
    <nav aria-label="Classroom" className="flex flex-wrap justify-center border-b border-[#dadce0] font-medium">{[t('Stream','Tablón'),t('Classwork','Trabajo en clase'),t('People','Personas')].map((label,i) => <span key={label} aria-current={i === 1 ? 'page' : undefined} className={`px-5 py-4 ${i === 1 ? 'border-b-4 border-[#1967d2] text-[#1967d2]' : 'text-[#5f6368]'}`}>{label}</span>)}</nav>
    <div className="mx-auto flex max-w-[1100px] flex-col items-start gap-6 p-4 xl:flex-row sm:p-6">
      <article className="min-w-0 flex-1 space-y-5"><header className="flex items-center gap-3 border-b border-[#1967d2] pb-5"><span className="rounded-full bg-[#1967d2] p-3 text-white"><Icon size={22}/></span><h2 className="text-[28px] leading-tight text-[#1967d2]">{s.title[lang]}</h2></header>
        {s.sources.map((src,i) => <section key={i} className="border-b border-[#dadce0] pb-5"><h3 className="mb-3 font-medium">{src.title[lang]}</h3><p className="whitespace-pre-line leading-relaxed">{src.text[lang]}</p></section>)}
      </article>
      <aside className="w-full shrink-0 rounded-xl shadow-sm xl:w-[340px]">{children}</aside>
    </div>
  </div>;
}
