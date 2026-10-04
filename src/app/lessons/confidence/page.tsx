import Link from "next/link";
import { notFound } from "next/navigation";
import { lessonByKey } from "@/lib/lessons/catalog";
import { CONFIDENCE_KEYS, CONFIDENCE_SEQUENCES, CONFIDENCE_TITLE, SCENARIOS, SCENARIO_LABELS, isConfidenceKey, scenarioHref } from "@/lib/lessons/confidence";
import { CONFIDENCE_SCENARIOS } from "@/lib/tasks/confidence/content";
import PrintConfidence from "./PrintConfidence";

export const metadata = { title: "Everyday digital confidence · Lessons" };
const first = (v: string | string[] | undefined) => Array.isArray(v) ? v[0] : v;
export default async function ConfidencePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const q = await searchParams;
  const lang = first(q.lang) === "es" ? "es" : "en";
  const teacher = first(q.teacher) === "1";
  const observation = first(q.sheet) === "observation";
  const rawKey = first(q.lesson);
  if (rawKey && !isConfidenceKey(rawKey)) notFound();
  const keys = rawKey && isConfidenceKey(rawKey) ? [rawKey] : CONFIDENCE_KEYS;
  const t = (en: string, es: string) => lang === "es" ? es : en;
  const mode = first(q.mode) === "independent" ? "independent" : "guided";
  const link = "inline-flex min-h-11 items-center py-2 text-[#0b57d0] underline";
  const pageLink = (extra: Record<string, string> = {}) => `?${new URLSearchParams({ lang, mode, ...(teacher ? { teacher: "1" } : {}), ...(rawKey ? { lesson: rawKey } : {}), ...(observation ? { sheet: "observation" } : {}), ...extra })}`;
  return <main lang={lang} className="mx-auto min-h-screen w-full max-w-4xl space-y-7 bg-white px-5 py-8 text-[#202124] print:max-w-none print:p-0">
    <nav className="flex flex-wrap gap-5 print:hidden"><Link className={link} href={`/lessons?lang=${lang}${teacher ? "&teacher=1" : ""}`}>{t("Back to lessons", "Volver a lecciones")}</Link><Link className={link} href={pageLink({ lang: lang === "en" ? "es" : "en" })}>{lang === "en" ? "Español" : "English"}</Link><PrintConfidence lang={lang} /></nav>
    <header><h1 className="text-3xl font-semibold">{CONFIDENCE_TITLE[lang]}</h1><p className="mt-3">{observation ? t("Teacher observation sheet · participant codes only", "Hoja de observación docente · solo códigos de participantes") : t("Eight short lessons for class and home. Choose any lesson; there is no required order. Your teacher can help you choose a starting point.", "Ocho lecciones cortas para clase y casa. Elige cualquier lección; no hay un orden obligatorio. Tu docente puede ayudarte a elegir dónde empezar.")}</p></header>
    {observation ? <section data-testid="confidence-observation" className="space-y-5">
      <p>{t("Participant code: __________  Date: __________  Lesson / scenario: __________", "Código: __________  Fecha: __________  Lección / situación: __________")}</p>
      <p>{t("Language used: __________  Computer familiarity: __________", "Idioma usado: __________  Experiencia digital: __________")}</p>
      <p>{t("Record language or reading support separately from help operating the computer. Do not score speed. Completion counts are practice records, not mastery.", "Registre el apoyo lingüístico o de lectura por separado de la ayuda digital. No evalúe velocidad. Las finalizaciones registran práctica, no dominio.")}</p>
      {[
        t("Starting: independently / after a prompt / step-by-step help / not observed", "Inicio: sin ayuda / con una indicación / con ayuda paso a paso / no observado"),
        t("Accurate action: observed / with help / not yet / not observed. Evidence:", "Acción correcta: observada / con ayuda / todavía no / no observada. Evidencia:"),
        t("Checked the result: independently / with help / not yet / not observed. What was checked?", "Revisó el resultado: sin ayuda / con ayuda / todavía no / no observado. ¿Qué revisó?"),
        t("Recovery: independently / with help / not yet / no recovery opportunity. What happened?", "Recuperación: sin ayuda / con ayuda / todavía no / sin oportunidad. ¿Qué pasó?"),
        t("Fresh facts: independently / with help / not yet / not observed. Example:", "Otros datos: sin ayuda / con ayuda / todavía no / no observado. Ejemplo:"),
        t("Student confidence BEFORE: I want someone beside me / I can try with help available / I feel ready to try on my own / prefer not to answer", "Confianza ANTES: quiero a alguien a mi lado / puedo intentar con ayuda disponible / quiero intentar por mi cuenta / prefiero no responder"),
        t("Student confidence AFTER: I want someone beside me / I can try with help available / I feel ready to try on my own / prefer not to answer", "Confianza DESPUÉS: quiero a alguien a mi lado / puedo intentar con ayuda disponible / quiero intentar por mi cuenta / prefiero no responder"),
        t("Blocker, assistance given, and recheck date:", "Dificultad, ayuda proporcionada y fecha para volver a revisar:"),
      ].map(line => <div key={line} className="break-inside-avoid"><p>{line}</p><div className="mt-8 border-b border-gray-500" /></div>)}
      <p>{t("Home readiness: pending / teacher-supported only / observed ready. Record the observation and unresolved blockers; never infer readiness from the finish count.", "Preparación para casa: pendiente / solo con apoyo docente / observada. Registre la observación y dificultades pendientes; no deduzca preparación por el número de finalizaciones.")}</p>
    </section> : <>
      <div className="flex flex-wrap gap-5 print:hidden"><Link className={link} href={pageLink({ mode: mode === "guided" ? "independent" : "guided" })}>{mode === "guided" ? t("Support: Guided · switch to On my own", "Apoyo: Guiado · cambiar a Por mi cuenta") : t("Support: On my own · switch to Guided", "Apoyo: Por mi cuenta · cambiar a Guiado")}</Link>{teacher && <Link className={link} href={pageLink({ sheet: "observation" })}>{t("Printable observation sheet", "Hoja de observación para imprimir")}</Link>}</div>
      {teacher && <aside data-testid="confidence-teacher-intro" className="space-y-3 border-y py-5 print:hidden"><h2 className="text-xl font-semibold">{t("Teacher preparation", "Preparación docente")}</h2><p>{t("Pilot first: try email reply and attachments with 4–6 adults, revise, then sample all eight. Observe English and Spanish. Home readiness is pending until learners can start, access help, recover, and finish without recurring blockers.", "Primero haga una prueba: correos y adjuntos con 4–6 adultos, revise y luego pruebe las ocho. Observe inglés y español. La preparación para casa está pendiente hasta que puedan empezar, pedir ayuda, recuperarse y terminar sin dificultades recurrentes.")}</p><p>{t("Choose support by computer experience, separately from English proficiency. Students may speak, point, or write. Use school-approved Google accounts and designated practice recipients. Use only fictional information; no account connection is made by this site.", "Elija apoyo según la experiencia digital, por separado del nivel de inglés. Se puede hablar, señalar o escribir. Use cuentas de Google aprobadas por la escuela y destinatarios de práctica. Use datos ficticios; este sitio no conecta cuentas.")}</p></aside>}
      {keys.map((key, i) => {
        const lesson = lessonByKey(key)!;
        const seq = CONFIDENCE_SEQUENCES[key];
        return <article key={key} className="space-y-4 border-t border-gray-300 pt-6 print:break-before-page print:first:break-before-auto" data-testid={`confidence-pack-${key}`}>
          <h2 className="text-2xl font-semibold">{rawKey ? "" : `${i + 1}. `}{lesson.title[lang]}</h2>
          <p>{seq.objective[lang]}</p>
          <div className="flex flex-wrap gap-x-5 print:hidden">{SCENARIOS.map(s => <Link key={s} className={link} href={scenarioHref(key, s, lang, mode)}>{SCENARIO_LABELS[s][lang]}</Link>)}{teacher && <Link className={link} href={scenarioHref(key, "classroom", lang, mode, true)}>{t("Teacher preview", "Vista del docente")}</Link>}{!rawKey && <Link className={link} href={pageLink({ lesson: key })}>{t("Printable lesson sheet", "Hoja de la lección")}</Link>}</div>
          {rawKey && <>
            <p>{seq.homePractice[lang]}</p>
            <p className="break-all text-sm">{scenarioHref(key, "home", lang, mode)}</p>
            <h3 className="font-semibold">{t("Home example · fictional documents", "Ejemplo para casa · documentos ficticios")}</h3>
            <p>{CONFIDENCE_SCENARIOS[key].home.request[lang]}</p>
            {CONFIDENCE_SCENARIOS[key].home.sources.map((src, j) => <section key={j} className="break-inside-avoid border p-4"><h4 className="font-semibold">{src.title[lang]}</h4><p>{src.text[lang]}</p></section>)}
            {CONFIDENCE_SCENARIOS[key].home.files?.map(f => <section key={f.key} className="break-inside-avoid border p-4"><h4 className="font-semibold">{f.name}</h4><p>{f.detail[lang]}</p></section>)}
            {CONFIDENCE_SCENARIOS[key].home.expected.password && <p>{t("Fictional practice password", "Contraseña ficticia de práctica")}: {CONFIDENCE_SCENARIOS[key].home.expected.password}</p>}
            <p>{seq.reflection[lang]}</p><div className="h-12 border-b border-gray-400" />
            <h3 className="font-semibold">{t("Optional Google activity · with your teacher", "Actividad opcional de Google · con tu docente")}</h3><p>{seq.google[lang]}</p>
          </>}
          {teacher && <section data-testid="confidence-teacher-notes" className="space-y-3 rounded bg-[#f0f4f9] p-4 print:hidden"><h3 className="font-semibold">{t("Teacher notes", "Notas docentes")}</h3><p>{seq.timing[lang]}</p><p>{seq.model[lang]}</p><p>{seq.evidence[lang]}</p><p>{seq.reflection[lang]}</p><p>{seq.homePractice[lang]}</p><p>{seq.google[lang]}</p><p>{t("Use optional mouse and scrolling practice from the Job Card before beginning. Some classroom lessons include additional existing rounds; split them across sessions when needed.", "Use la práctica opcional de ratón y desplazamiento de la Tarjeta de trabajo antes de empezar. Algunas lecciones incluyen rondas adicionales; divídalas entre sesiones si hace falta.")}</p></section>}
        </article>;
      })}
    </>}
  </main>;
}
