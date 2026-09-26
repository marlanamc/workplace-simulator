import type { ReactNode } from "react";
import type { Lang } from "@/lib/task-types";
import { PAPERWORK_SHELL, PRACTICE_PROFILE, W4_COPY, W4_STATUS_OPTIONS } from "@/lib/tasks/onboarding-paperwork/content";

const COPY = {
  en: {
    viewer: "Payroll documents", practice: "SIMPLIFIED PRACTICE COPY", page: "Page 1 of 1",
    personal: "Personal information", dependents: "Dependents", sign: "Signature",
    step: "Step", address: "Address", reference: "Robin's facts: copy these",
    details: "Name: Robin Avery · Single · Dependents: 0 · Form date: 10/01/2026",
    omitted: "Steps 2 and 4 · Multiple jobs and other adjustments are not included in this practice copy.",
    note: "Practice version • Fictional information • Not for filing",
    simplified: "Dependent count only; tax-credit calculations are omitted in this practice version.",
  },
  es: {
    viewer: "Documentos de nómina", practice: "COPIA SIMPLIFICADA DE PRÁCTICA", page: "Página 1 de 1",
    personal: "Información personal", dependents: "Dependientes", sign: "Firma",
    step: "Paso", address: "Dirección", reference: "Datos de Robin: cópialos",
    details: "Nombre: Robin Avery · Soltero/a · Dependientes: 0 · Fecha del formulario: 10/01/2026",
    omitted: "Pasos 2 y 4 · Los empleos múltiples y otros ajustes no se incluyen en esta copia de práctica.",
    note: "Versión de práctica • Datos ficticios • No válida para trámites",
    simplified: "Solo el número de dependientes; esta versión de práctica omite el cálculo de créditos fiscales.",
  },
};

export function W4DocumentShell({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#e5e7e9] text-[#202124]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#c7cace] bg-[#f8f9fa] px-5 py-3 text-[13px]">
        <span className="font-medium">{COPY[lang].viewer} / W-4</span>
        <span className="text-[#5f6368]">{COPY[lang].page}</span>
      </div>
      {children}
    </div>
  );
}

const fieldClass = "mt-2 min-h-11 w-full min-w-0 border-0 border-b border-[#555] bg-[#edf4fc] px-2 py-2 font-mono text-[16px] text-[#162d4a] outline-none transition-colors focus:bg-[#e0edfc] focus:ring-2 focus:ring-inset focus:ring-[#245b94]";

function Section({ number, title, lang, children }: { number: number; title: string; lang: Lang; children: ReactNode }) {
  return (
    <section className="grid border-t-2 border-[#222] sm:grid-cols-[128px_1fr]">
      <h2 className="px-4 py-4 text-[14px] font-bold sm:border-r sm:border-[#222]">
        <span className="block text-[12px] font-normal">{COPY[lang].step} {number}</span>
        {title}
      </h2>
      <div className="min-w-0 px-4 pb-5 sm:pt-4">{children}</div>
    </section>
  );
}

export default function W4Document({ lang, status, onStatus, dependents, onDependents, signature, onSignature, date, onDate, onSubmit }: {
  lang: Lang; status: string | null; onStatus: (value: string) => void;
  dependents: string; onDependents: (value: string) => void;
  signature: string; onSignature: (value: string) => void;
  date: string; onDate: (value: string) => void; onSubmit: () => void;
}) {
  const c = COPY[lang];
  const w = W4_COPY[lang];
  const s = PAPERWORK_SHELL[lang];
  return (
    <>
      {/* Stays in view while the learner scrolls to the signature and date,
          the two boxes that have to match it. */}
      <aside className="sticky top-0 z-10 border-l-4 border-[#245b94] bg-[#eef3fa] px-4 py-2 text-[14px] leading-relaxed shadow-sm">
        <h2 className="font-semibold">{c.reference}</h2>
        <p>{c.details}</p>
      </aside>
      <form noValidate autoComplete="off" onSubmit={(event) => { event.preventDefault(); onSubmit(); }} className="mt-2">
        <article className="border border-[#b8bcc1] bg-white p-4 text-[13px] text-[#171717] shadow-[0_3px_12px_#00000012] sm:p-7" aria-label={w.formName}>
          <div className="mb-3 flex flex-wrap justify-between gap-2 text-[10px] font-semibold tracking-[0.12em]">
            <span>{c.practice}</span><span>2026</span>
          </div>
          <header className="grid gap-3 border-t-4 border-[#222] py-4 sm:grid-cols-[128px_1fr]">
            <div className="text-[34px] font-bold leading-none tracking-tight">W-4</div>
            <div><h1 className="text-[21px] font-bold leading-tight">{w.title}</h1><p className="mt-2 text-[12px] leading-relaxed">{w.blurb}</p></div>
          </header>
          <Section number={1} title={c.personal} lang={lang}>
            <label className="block">{w.nameLabel}<input className={`${fieldClass} bg-[#f5f5f3]`} value={PRACTICE_PROFILE.name} readOnly /></label>
            <div className="mt-3 border-b border-[#777] pb-2"><span className="text-[12px]">{c.address}</span><p className="mt-1 font-mono text-[15px]">{PRACTICE_PROFILE.address}</p></div>
            <fieldset className="mt-4">
              <legend className="mb-1 font-semibold">{w.statusLabel} <span className="text-[11px] font-normal">({s.requiredLabel})</span></legend>
              {W4_STATUS_OPTIONS.map((option) => (
                <label key={option.key} className="flex min-h-11 cursor-pointer items-center gap-3 py-2 leading-snug">
                  <input type="radio" name="w4-status" value={option.key} checked={status === option.key} onChange={() => onStatus(option.key)} required className="h-4 w-4 shrink-0 accent-[#245b94]" />
                  {option.label[lang]}
                </label>
              ))}
            </fieldset>
          </Section>
          <Section number={3} title={c.dependents} lang={lang}>
            <label className="flex flex-wrap items-end justify-between gap-3"> <span className="max-w-[320px]">{w.dependentsLabel} <span className="text-[11px]">({s.requiredLabel})</span></span>
              <input aria-label={w.dependentsLabel} inputMode="numeric" required value={dependents} onChange={(e) => onDependents(e.target.value.replace(/\D/g, ""))} className={`${fieldClass} max-w-24 text-right`} />
            </label>
            <p className="mt-3 text-[11px] leading-relaxed text-[#555]">{c.simplified}</p>
          </Section>
          <p className="border-t border-[#777] px-4 py-3 text-[11px] leading-relaxed text-[#555]">{c.omitted}</p>
          <Section number={5} title={c.sign} lang={lang}>
            <div className="grid gap-4 sm:grid-cols-[1fr_150px]">
              <label>{s.signLabel} <span className="text-[11px]">({s.requiredLabel})</span><input required value={signature} onChange={(e) => onSignature(e.target.value)} placeholder={PRACTICE_PROFILE.name} className={`${fieldClass} font-serif italic`} /></label>
              <label>{s.dateLabel} <span className="text-[11px]">({s.requiredLabel})</span><input required value={date} onChange={(e) => onDate(e.target.value)} placeholder={s.datePlaceholder} className={fieldClass} /></label>
            </div>
          </Section>
          <footer className="flex flex-wrap justify-between gap-2 border-t-2 border-[#222] pt-3 text-[10px]"><span>{c.note}</span><span>{w.formName} (2026)</span></footer>
        </article>
        <div className="mt-4 flex justify-end"><button type="submit" className="min-h-11 rounded bg-[#245b94] px-6 py-2 text-[14px] font-medium text-white transition-colors hover:bg-[#194675] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#245b94]">{w.submit}</button></div>
      </form>
    </>
  );
}
