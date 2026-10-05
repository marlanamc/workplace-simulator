"use client";

import { useEffect, useRef, useState } from "react";
import { useLesson } from "@/lib/lesson-context";
import { useProgress } from "@/lib/progress-context";
import { useJobCard } from "@/lib/job-card-context";
import { FOLLOWUP_ROUNDS, practiceProblem } from "@/lib/tasks/lesson-followups/content";
import RightNowBar from "@/components/task/RightNowBar";
import HelpDrawer from "@/components/task/HelpDrawer";
import ShowMeHighlight from "@/components/task/ShowMeHighlight";
import { SHOW_ME_LOOK, useShowMe } from "@/lib/use-show-me";

/** Source-backed follow-ups, inside the same desktop and its single instruction voice. */
export default function LessonFollowups() {
  const lesson = useLesson()!;
  const { lang, completedTaskKeys } = useProgress();
  const done = completedTaskKeys.includes(lesson.taskKey);
  const { correct, clearCorrection } = useJobCard();
  const roundIndex = lesson.practiceRound!;
  const round = FOLLOWUP_ROUNDS[lesson.taskKey]![roundIndex];
  const [answers, setAnswers] = useState<Record<string, string>>(() => Object.fromEntries(round.fields.filter((f) => f.initial).map((f) => [f.id, f.initial!])));
  const [review, setReview] = useState(false);
  const [help, setHelp] = useState(false);
  const showMe = useShowMe();
  const heading = useRef<HTMLHeadingElement>(null);
  const attachmentControl = useRef<HTMLButtonElement>(null);
  useEffect(() => { heading.current?.focus(); }, [review]);
  const es = lang === "es";
  const select = (id: string, value: string) => {
    clearCorrection();
    setAnswers((prev) => ({ ...prev, [id]: value }));
    if (id === "attachment") requestAnimationFrame(() => attachmentControl.current?.focus());
  };
  const instruction = review
    ? { en: "Check the details against the source material. Edit if needed, then confirm.", es: "Revisa los detalles con los documentos. Corrige si hace falta y luego confirma." }
    : round.guidance;

  return (
    <div className="h-full overflow-y-auto bg-[#f8fafc] text-[#202124]" data-testid="lesson-followup" data-round={round.id}>
      {!done && <RightNowBar taskKey={lesson.taskKey} stepIndex={roundIndex * 2 + (review ? 1 : 0)} stepCount={4}
        instruction={instruction} goal={round.goal} onHelp={() => setHelp(true)} onShowMe={() => showMe.toggleFor("followup-sources")} showMeActive={showMe.targetId === "followup-sources"} />}
      <ShowMeHighlight targetId={done ? null : showMe.targetId} label={SHOW_ME_LOOK[lang]} onDismiss={showMe.clear} />
      <HelpDrawer open={help} onClose={() => setHelp(false)} kicker={es ? "Práctica" : "Practice"}
        lesson={{ t: round.title[lang], s: [round.help[lang]], tip: es ? "Puedes volver a los documentos en cualquier momento." : "You can check the source material at any time." }}
        tipLabel={es ? "Consejo" : "Tip"} gotItLabel={es ? "Volver a mi tarea" : "Back to my task"} />
      <div className="mx-auto max-w-5xl px-4 py-6 pb-80 sm:px-8">
        <p className="text-xs font-medium text-slate-500">{es ? `Situación ${roundIndex + 2} de 3` : `Situation ${roundIndex + 2} of 3`}</p>
        <h1 ref={heading} tabIndex={-1} className="mt-1 text-xl font-semibold outline-none">{round.title[lang]}</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section data-showme="followup-sources" aria-label={es ? "Documentos" : "Source material"} className="space-y-4 rounded-lg">
            {round.sources.map((source, i) => <article key={i} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="border-b border-slate-100 pb-3 font-semibold">{source.title[lang]}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed">{source.lines.map((line, j) => <p key={j}>{line[lang]}</p>)}</div>
            </article>)}
          </section>
          <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-5" aria-label={es ? "Respuesta" : "Response"}>
            <h2 className="mb-5 font-semibold">{done ? (es ? "Completado" : "Completed") : review ? (es ? "Revisión" : "Review") : (es ? "Borrador" : "Draft")}</h2>
            {done && !review ? <p>{es ? "Terminaste las tres situaciones de esta práctica." : "You completed all three situations in this practice."}</p> : review ? <>
              <dl className="space-y-5" data-testid="practice-review">
                {round.fields.map((field) => <div key={field.id}><dt className="text-sm text-slate-500">{field.label[lang]}</dt><dd className="mt-1 break-words">{field.options.find((o) => o.id === answers[field.id])?.label[lang] ?? (es ? "Sin adjunto" : "No attachment")}</dd></div>)}
              </dl>
              {!done && <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" className="min-h-11 rounded-md border px-4 py-2" onClick={() => { clearCorrection(); setReview(false); }}>{es ? "Editar" : "Edit"}</button>
                <button type="button" data-testid="practice-confirm" className="min-h-11 rounded-md bg-[#0b57d0] px-4 py-2 text-white" onClick={() => { clearCorrection(); lesson.completePracticeRound?.(roundIndex); }}>{round.action[lang]}</button>
              </div>}
            </> : <form onSubmit={(event) => {
              event.preventDefault();
              const problem = practiceProblem(round, answers);
              if (problem) return correct(problem[lang]);
              clearCorrection();
              showMe.clear();
              setReview(true);
            }}>
              <div className="space-y-6">
                {round.fields.map((field) => <fieldset key={field.id} className="min-w-0" data-testid={`practice-field-${field.id}`}>
                  <legend className="mb-2 text-sm font-medium">{field.label[lang]}</legend>
                  {field.id === "attachment" && answers[field.id] && answers[field.id] !== "none" ? <div className="mb-3 flex flex-wrap items-center gap-2 rounded-md bg-slate-100 p-3 text-sm">
                    <span className="break-all">{field.options.find((o) => o.id === answers[field.id])?.label[lang]}</span>
                    <button ref={attachmentControl} type="button" className="min-h-11 px-2 text-blue-700 underline" onClick={() => select(field.id, field.options.some((o) => o.id === "none") ? "none" : "")}>{es ? "Quitar adjunto" : "Remove attachment"}</button>
                  </div> : null}
                  {/* An attached file must be removed before choosing its replacement. */}
                  {field.id !== "attachment" || !answers[field.id] || answers[field.id] === "none" ? field.options.map((o, optionIndex) => field.id === "attachment" ? <button
                    key={o.id} ref={optionIndex === 0 ? attachmentControl : undefined} type="button" data-testid={`practice-attach-${o.id}`}
                    className="mb-2 block min-h-11 w-full break-words rounded-md border border-slate-200 p-3 text-left text-sm hover:bg-blue-50"
                    onClick={() => select(field.id, o.id)}>
                    {o.id === "none" ? o.label[lang] : `${es ? "Adjuntar" : "Attach"} ${o.label[lang]}`}
                  </button> : <label key={o.id} className={`mb-2 flex min-h-11 cursor-pointer items-start gap-3 rounded-md border p-3 text-sm leading-relaxed ${answers[field.id] === o.id ? "border-blue-600 bg-blue-50" : "border-slate-200"}`}>
                    <input type="radio" name={`${round.id}-${field.id}`} value={o.id} checked={answers[field.id] === o.id} onChange={() => select(field.id, o.id)} className="mt-1 h-4 w-4 shrink-0 accent-blue-700" />
                    <span className="break-words">{o.label[lang]}</span>
                  </label>) : null}
                </fieldset>)}
              </div>
              <button type="submit" data-testid="practice-review-button" className="mt-6 min-h-11 rounded-md bg-[#0b57d0] px-4 py-2 text-white">{es ? "Revisar" : "Review"}</button>
            </form>}
          </section>
        </div>
      </div>
    </div>
  );
}
