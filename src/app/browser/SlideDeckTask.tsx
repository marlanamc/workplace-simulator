"use client";

import { EXPENSE_ROWS } from "@/lib/tasks/expense-report/content";
import { mentionsAmount } from "@/lib/text-facts";
import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  SLIDES_COPY,
  LESSONS,
  RIGHT_NOW_LABEL,
  RIGHT_NOW_STEPS,
  PLANTED_TOTAL,
  COWORKER_QUESTION,
  COWORKER_ANSWERS,
  slideDeckPasses,
  describeSubmission,
} from "@/lib/tasks/slide-deck/content";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import { TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";

export default function SlideDeckTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [done, setDone] = useState(completedTaskKeys.includes("slide-deck"));
  const [index, setIndex] = useState(0);
  const [title, setTitle] = useState("");
  const [takeaway, setTakeaway] = useState("");
  const [figure, setFigure] = useState("");
  const confirmed = mentionsAmount(figure, PLANTED_TOTAL);
  const [coworkerAnswer, setCoworkerAnswer] = useState("");
  const [presenting, setPresenting] = useState(false);
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = SLIDES_COPY[lang];

  const goNext = () => {
    if (index === 0 && title.trim().length < 2) return say(c.needTitle);
    if (index === 1 && !confirmed) return say(c.needConfirm);
    if (index < 2) setIndex((n) => n + 1);
  };

  const goToSlide = (n: number) => {
    // Free to look at any slide, but can't skip past a gate without passing it.
    if (n > 0 && title.trim().length < 2) return say(c.needTitle);
    if (n > 1 && !confirmed) return say(c.needConfirm);
    setIndex(n);
  };

  const tryPresent = () => {
    if (!slideDeckPasses({ title, takeaway, confirmedTotal: confirmed, presented: true, coworkerAnswer: presenting ? coworkerAnswer : "receipt" })) {
      if (title.trim().length < 2) return say(c.needTitle);
      if (!confirmed) return say(c.needConfirm);
      return say(presenting ? (lang === "en" ? "Check the report: what is missing for dinner?" : "Revisa el informe: ¿qué falta para la cena?") : c.needTakeaway);
    }
    if (!presenting) { setPresenting(true); return; }
    setDone(true);
    markComplete("slide-deck", "present_three_slides", describeSubmission({ title, takeaway, coworkerAnswer: COWORKER_ANSWERS.find((a) => a.key === coworkerAnswer)?.label[lang] }, lang));
  };

  const restart = () => {
    setDone(false);
    setIndex(0);
    setTitle("");
    setTakeaway("");
    setFigure("");
    setCoworkerAnswer("");
    setPresenting(false);
  };

  const stepIndex = index === 0 ? 0 : index === 1 ? 1 : 2;

  if (done) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-white" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard kicker={c.sentKicker} />
            <TaskDoneActions kicker={c.sentKicker} tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
          </div>
        </div>
      </div>
    );
  }

  /** What each slide shows in a thumbnail — a tiny echo of the real slide. */
  const thumbBody = (i: number): string => {
    if (i === 0) return title.trim() || c.slideLabels[0];
    if (i === 1) return figure.trim() || c.slideLabels[1];
    return takeaway.trim() ? takeaway.trim().slice(0, 40) : c.slideLabels[2];
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-[#f8f9fa] text-[14px] text-[#202124]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="flex items-center gap-3 border-b border-[#e0e0e0] bg-white px-4 py-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded bg-[#f9ab00] text-white">
          {(() => {
            const Icon = TASK_ICONS["slide-deck"];
            return <Icon size={18} strokeWidth={2.25} />;
          })()}
        </span>
        <span className="text-[18px] text-[#3c4043]">{c.appName}</span>
        <span className="ml-3 text-[13px] text-[#5f6368]">{c.slideOf(index + 1)}</span>
        <div className="flex-1" />
        {!presenting && (
          <button
            type="button"
            onClick={tryPresent}
            className="inline-flex min-h-[36px] items-center gap-2 rounded-lg bg-[#c5221f] px-4 text-[14px] font-medium text-white cursor-pointer"
          >
            ▶ {c.present}
          </button>
        )}
      </div>

      <RightNowBar
        icon={TASK_ICONS["slide-deck"]}
        stepIndex={stepIndex}
        steps={RIGHT_NOW_STEPS}
        lang={lang}
        rightNowLabel={RIGHT_NOW_LABEL}
        onHelp={() => setHelp(true)}
      />

      <div className="flex min-h-0 flex-1">
        {/* thumbnail rail */}
        {!presenting && (
          <div className="flex w-[132px] shrink-0 flex-col gap-2 overflow-y-auto border-r border-[#e0e0e0] bg-white p-3">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToSlide(i)}
                className="flex items-start gap-1.5 text-left"
              >
                <span className="mt-1 text-[11px] text-[#5f6368]">{i + 1}</span>
                <span
                  className={`flex aspect-[16/9] flex-1 items-center justify-center overflow-hidden rounded-sm border-2 px-1 text-center text-[9px] leading-tight ${
                    index === i ? "border-[#1a73e8] bg-white" : "border-[#dadce0] bg-[#f8f9fa]"
                  }`}
                >
                  {thumbBody(i)}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* canvas */}
        <div className="flex min-h-0 flex-1 overflow-auto items-start justify-center p-6">
          <div
            className="flex aspect-[16/9] w-full max-w-[680px] flex-col justify-center rounded-sm px-12 py-10 shadow-[0_1px_3px_rgba(60,64,67,.3)]"
            style={{ background: presenting ? "#202124" : "#fff", color: presenting ? "#fff" : "#202124" }}
          >
            {presenting ? (
              <div className="space-y-3">
                <h2 className="text-xl">{title}</h2><p>${figure}</p><p>{takeaway}</p>
                <p>{COWORKER_QUESTION[lang]}</p>
                <select aria-label={COWORKER_QUESTION[lang]} value={coworkerAnswer} onChange={(e) => setCoworkerAnswer(e.target.value)} className="min-h-11 w-full rounded border bg-white p-2 text-[#202124]">
                  <option value="">{lang === "en" ? "Choose a response" : "Elige una respuesta"}</option>
                  {COWORKER_ANSWERS.map((a) => <option key={a.key} value={a.key}>{a.label[lang]}</option>)}
                </select>
                <button onClick={tryPresent} className="min-h-11 rounded bg-[#1a73e8] px-4">{lang === "en" ? "Answer Chris" : "Responder a Chris"}</button>
              </div>
            ) : index === 0 ? (
              <>
                <label className="mb-2 text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{c.titleLabel}</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={c.titlePlaceholder}
                  className="w-full border-0 border-b border-[#dadce0] bg-transparent pb-2 text-[28px] font-medium outline-none focus:border-[#1a73e8]"
                />
              </>
            ) : index === 1 ? (
              <>
                <p className="text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{c.numberKicker}</p>
                <table className="mt-3 text-[13px]"><caption>{lang === "en" ? "Expense report — reference" : "Informe de gastos — referencia"}</caption><tbody>
                  {EXPENSE_ROWS.map((r) => <tr key={r.key}><th className="pr-3 text-left font-normal">{r.merchant[lang]}</th><td>${r.amount}</td><td className="pl-3">{r.receipt ?? (lang === "en" ? "No receipt" : "Sin recibo")}</td></tr>)}
                </tbody></table>
                <label className="mt-3 block">{lang === "en" ? "Total with receipts" : "Total con recibos"}
                  <input inputMode="decimal" value={figure} onChange={(e) => setFigure(e.target.value)} className="mt-1 min-h-11 w-full rounded border px-3 text-lg" />
                </label>

              </>
            ) : (
              <>
                <label className="mb-2 text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{c.takeawayLabel}</label>
                <textarea
                  value={takeaway}
                  onChange={(e) => setTakeaway(e.target.value)}
                  placeholder={c.takeawayPlaceholder}
                  rows={4}
                  className="w-full resize-none rounded border border-[#dadce0] px-3 py-2 text-[16px] outline-none focus:border-[#1a73e8]"
                />
              </>
            )}
          </div>
        </div>
      </div>

      {!presenting && (
        <div className="flex items-center justify-between border-t border-[#e0e0e0] bg-white px-4 py-3">
          <button
            type="button"
            onClick={() => setIndex((n) => Math.max(0, n - 1))}
            disabled={index === 0}
            className="min-h-[40px] rounded-lg px-4 text-[14px] font-medium text-[#1a73e8] disabled:text-[#9aa0a6] cursor-pointer disabled:cursor-default"
          >
            {c.back}
          </button>
          {index < 2 ? (
            <button
              type="button"
              onClick={goNext}
              className="min-h-[40px] rounded-lg bg-[#1a73e8] px-5 text-[14px] font-medium text-white cursor-pointer"
            >
              {c.next}
            </button>
          ) : (
            <button
              type="button"
              onClick={tryPresent}
              className="min-h-[40px] rounded-lg bg-[#c5221f] px-5 text-[14px] font-medium text-white cursor-pointer"
            >
              {c.present}
            </button>
          )}
        </div>
      )}

      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={c.lessonKicker}
        lesson={LESSONS[lang][0]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
      />
      <NudgeToast text={nudge} onDismiss={dismiss} />
    </div>
  );
}
