"use client";

import { useState } from "react";
import { useTaskDraft } from "@/lib/use-task-draft";
import { useWindowManager } from "@/lib/window-manager";
import { useProgress } from "@/lib/progress-context";
import {
  PAY_STUBS,
  PAYSTUB_COPY,
  NET_PAY_CHECK,
  HOURS_CHECK,
  LESSONS,
  TIME_RECORD,
  TIME_RECORD_COPY,
  TARGET_STUB_ID,
  type CheckOption,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
} from "@/lib/tasks/paystub/content";
import { useNudge } from "@/lib/use-nudge";
import { TASK_ICONS } from "@/lib/icons";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";
import ShowMeHighlight from "@/components/task/ShowMeHighlight";
import { useShowMe, SHOW_ME_POINTER } from "@/lib/use-show-me";
import type { Lang } from "@/lib/task-types";

type View = "list" | "check1" | "check2" | "done";

export default function PaystubTask() {
  const { markComplete, completedTaskKeys, lang, displayName } = useProgress();
  // Which question they were on survives a reload (Wave 5 F-7). "done" is
  // never saved: a finished job opens finished because it is in progress.
  const [savedStep, setSavedStep] = useTaskDraft<string>("paystub", "view", "list");
  const [shown, setShown] = useState<View | null>(completedTaskKeys.includes("paystub") ? "done" : null);
  const view: View = shown ?? (savedStep === "check1" || savedStep === "check2" ? savedStep : "list");
  const setView = (next: View) => {
    setShown(next);
    if (next !== "done") setSavedStep(next);
  };
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const showMe = useShowMe();
  const { openApp, active } = useWindowManager();
  const lookingAtStub = view !== "list" && view !== "done" && active !== "browser";
  const showMeId =
    view === "list"
      ? "target-stub"
      : lookingAtStub
        ? view === "check2"
          ? "stub-hours"
          : "stub-net-pay"
        : "paystub-choices";
  const stepIndex =
    view === "list" ? 0 : view === "check1" ? (lookingAtStub ? 1 : 2) : lookingAtStub ? 3 : 4;

  const c = PAYSTUB_COPY[lang];
  const myName = displayName.trim() || (lang === "en" ? "You" : "Tú");

  const backToBrowser = () => openApp("browser", { tab: "portal", section: "paystubs" });

  const stub = PAY_STUBS.find((p) => p.id === TARGET_STUB_ID);
  const openStub = (p: (typeof PAY_STUBS)[number]) => {
    if (p.pdfDocId) {
      openApp("pdf", { docId: p.pdfDocId });
      setView("check1");
    }
  };

  const answer = (opt: CheckOption, onCorrect: () => void) => {
    if (opt.isTarget) return onCorrect();
    if (opt.wrongHint) say(opt.wrongHint[lang]);
  };

  const restart = () => {
    setView("list");
  };

  const netCheck = NET_PAY_CHECK[lang];
  const hoursCheck = HOURS_CHECK[lang];

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[19px] font-medium">{c.heading}</h2>
      </div>

      {/* Fallbacks so a Show me raised while the stub is hidden still resolves;
          the PDF Reader marks the real figures `data-showme-primary` (no circles until Show me). */}
      <span data-showme="stub-net-pay" className="sr-only" />
      <span data-showme="stub-hours" className="sr-only" />
      {view !== "done" && (
        <RightNowBar
          icon={TASK_ICONS.paystub}
          stepIndex={stepIndex}
          stepCount={RIGHT_NOW_STEPS.length}
          instruction={RIGHT_NOW_STEPS[stepIndex]}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          // While the stub is in front, Show me rings the number this step is
          // asking for; getting back to the questions is the button's job, not
          // Show me's. (The old `openApp` here was guarded by `!lookingAtStub`,
          // so it only ever fired when the Browser was already in front.)
          onShowMe={() => showMe.toggleFor(showMeId)}
          showMeActive={showMe.targetId === showMeId}
          // The only step in Act I that names a destination the card cannot
          // open for them: the PDF Reader is full-screen over the answers, and
          // finding the Browser pin on the shelf is the hardest thing the act
          // asks for. Give them the button.
          primaryLabel={lookingAtStub ? c.backToBrowser : undefined}
          onPrimary={lookingAtStub ? backToBrowser : undefined}
          onHelp={() => setHelp(true)}
        />
      )}

      {view === "list" && (
        <div>
          <div className="overflow-hidden rounded-xl border border-border bg-white">
            {PAY_STUBS.map((p, i) => (
              <button
                key={p.id}
                data-showme={p.id === TARGET_STUB_ID ? "target-stub" : undefined}
                onClick={() => openStub(p)}
                className={`flex w-full items-center justify-between px-4 py-3.5 text-left hover:bg-surface-muted cursor-pointer ${i !== 0 ? "border-t border-border" : ""}`}
              >
                <div>
                  <div className="text-[14px] font-medium text-text-primary">{myName}</div>
                  <div className="text-[13px] text-text-tertiary">
                    {p.role} · {p.period[lang]}
                  </div>
                </div>
                {/* The pay date, not the net pay: the net pay is the first
                    question's answer (Wave 5 F-8). */}
                <div className="text-right">
                  <div className="text-[13px] text-text-tertiary">{c.paidLabel}</div>
                  <div className="text-[14px] font-medium text-text-primary">{p.payDate[lang]}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {(view === "check1" || view === "check2") && (
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="mb-2.5 text-[15px] font-medium">
            {view === "check1" ? netCheck.question : hoursCheck.question}
          </div>
          {/* On the hours question the record sits beside the choices, so at
              911x512 (a ~170px tall Portal) the rows and the answers are on
              screen together. */}
          <div className={view === "check2" ? "flex flex-wrap items-start gap-x-6 gap-y-3" : undefined}>
            {view === "check2" && <TimeRecord lang={lang} />}
            <div
              className={`flex gap-2 ${view === "check2" ? "flex-col items-start" : "flex-wrap"}`}
              data-showme="paystub-choices"
            >
              {(view === "check1" ? netCheck.options : hoursCheck.options).map((opt) => (
                <button
                  key={opt.label}
                  onClick={() =>
                    answer(opt, () => {
                      if (view === "check1") {
                        setView("check2");
                      } else {
                        setView("done");
                        markComplete("paystub", "find_net_pay");
                      }
                    })
                  }
                  className="min-h-[44px] rounded-full border border-border bg-surface-muted px-4 text-[14px] font-medium text-text-primary hover:bg-white cursor-pointer"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {stub?.pdfDocId && (
            <button
              type="button"
              onClick={() => openApp("pdf", { docId: stub.pdfDocId })}
              className="mt-2 min-h-11 cursor-pointer text-[14px] font-medium text-accent underline underline-offset-4"
            >
              {c.seeStubAgain}
            </button>
          )}
        </div>
      )}

      {view === "done" && (
        <div className="flex flex-col gap-5">
          <TaskDoneCard
            kicker={c.sentKicker}
            title={c.doneTitle}
            body={c.doneBody}
            badgeNumber="04"
            badgeName={c.badgeName}
            badgeWhere={c.badgeWhere}
          />

          <TaskDoneActions taskKey="paystub"
            kicker={c.sentKicker}
            tryAgainLabel={c.tryAgain}
            backToDeskLabel={c.backToDesk}
            onTryAgain={restart}
          />
        </div>
      )}

      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={c.lessonKicker}
        lesson={LESSONS[lang][view === "list" ? 0 : view === "check2" ? 2 : 1]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
      />

      <NudgeToast text={nudge} onDismiss={dismiss} />
      <ShowMeHighlight
        targetId={showMe.targetId}
        label={
          showMe.targetId === "paystub-choices"
            ? lang === "en"
              ? "Pick one here."
              : "Elige uno aquí."
            : showMe.targetId === "stub-net-pay"
              ? lang === "en"
                ? "Net pay."
                : "Pago neto."
              : showMe.targetId === "stub-hours"
                ? lang === "en"
                  ? "Regular hours."
                  : "Horas regulares."
                : SHOW_ME_POINTER[lang]
        }
        onDismiss={showMe.clear}
      />
    </div>
  );
}

/**
 * The learner's corrected time record, one row per shift, right under the
 * hours question. They count the shifts here; no total is shown, because the
 * total is the answer (Wave 5 F-8).
 */
function TimeRecord({ lang }: { lang: Lang }) {
  const t = TIME_RECORD_COPY[lang];
  return (
    // `data-showme` so the Job Card treats the record like the step's own
    // controls and never parks on top of it (it moves only for those).
    <div className="min-w-0 max-w-[440px] flex-1 basis-[270px]" data-testid="time-record" data-showme="time-record">
      <table className="w-full border-collapse text-[13px] leading-[1.35]">
        <caption className="pb-1 text-left text-[14px] font-medium">{t.heading}</caption>
        <tbody>
          {TIME_RECORD.map((r) => (
            <tr key={r.day} className="border-t border-border" data-testid="time-record-row">
              <th scope="row" className="py-[3px] pr-3 text-left font-normal whitespace-nowrap">{r.date[lang]}</th>
              <td className="py-[3px] pr-3 tabular-nums">
                {r.block.start} – {r.block.end}
                {r.note && <span className="ml-1.5 text-text-tertiary">({r.note[lang]})</span>}
              </td>
              <td className="py-[3px] text-right whitespace-nowrap tabular-nums">{t.hours(r.hours)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-1 text-[13px] text-text-tertiary">{t.note}</p>
    </div>
  );
}
