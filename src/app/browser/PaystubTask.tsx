"use client";

import { useEffect, useRef, useState } from "react";
import { useTaskDraft } from "@/lib/use-task-draft";
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
import { PDF_DOCUMENTS } from "@/lib/pdf-content";
import { PdfSheet } from "@/components/task/PdfSheet";
import { fitZoom, stepZoom } from "@/lib/pdf-zoom";
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
  // The stub reads inline now (no app switch, no "Back to the Browser"): the
  // Show me id is just which figure this step is asking about.
  const showMeId =
    view === "list" ? "target-stub" : view === "check2" ? "stub-hours" : view === "check1" ? "stub-net-pay" : "paystub-choices";
  const stepIndex = view === "list" ? 0 : view === "check1" ? 1 : view === "check2" ? 2 : 3;

  const c = PAYSTUB_COPY[lang];
  const myName = displayName.trim() || (lang === "en" ? "You" : "Tú");

  const stub = PAY_STUBS.find((p) => p.id === TARGET_STUB_ID);
  const stubDoc = stub?.pdfDocId ? PDF_DOCUMENTS.find((d) => d.id === stub.pdfDocId) : undefined;
  const openStub = (p: (typeof PAY_STUBS)[number]) => {
    if (p.pdfDocId) setView("check1");
  };

  // The document's own zoom, independent of the PDF Reader app: the pane
  // opens at whatever width fits beside the questions (or above them, when
  // stacked), same fit-to-width rule the standalone Reader uses.
  const [zoom, setZoom] = useState<number | null>(null);
  const [fit, setFit] = useState(100);
  const paneRef = useRef<HTMLDivElement>(null);
  const sheetRoomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = paneRef.current;
    const room = sheetRoomRef.current;
    if (!el || !room) return;
    const measure = () => {
      const pad = parseFloat(getComputedStyle(room).paddingLeft) + parseFloat(getComputedStyle(room).paddingRight);
      if (el.clientWidth > 0) setFit(fitZoom(el.clientWidth, pad));
    };
    const size = new ResizeObserver(measure);
    size.observe(el);
    return () => size.disconnect();
  }, []);
  const shownZoom = zoom ?? fit;

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

      {/* The real figures live inside `PdfSheet` (a shared component, marked
          there with the same ids) — these are a fallback so a Show me press
          always resolves to something inside this task even before that
          import is followed. */}
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
          // The stub reads inline now, beside or above the questions — Show
          // me rings the figure this step is asking about right where it
          // already is; there is no other app to switch back from any more.
          onShowMe={() => showMe.toggleFor(showMeId)}
          showMeActive={showMe.targetId === showMeId}
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
        // @container so the 900px split is measured against this task's own
        // pane, not the viewport — it can be narrower (docked Job Card,
        // Chromebook) or wider than the window.
        <div className="@container">
          <div className="flex flex-col gap-5 @[900px]:flex-row @[900px]:items-start">
            {stubDoc && (
              <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-border bg-[#525659] @[900px]:max-w-[58%]">
                <div className="flex items-center justify-end gap-1 border-b border-[#3a3d40] bg-[#323639] px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setZoom(stepZoom(shownZoom, -1))}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-[15px] text-white/85 hover:bg-white/10"
                    aria-label={c.zoomOut}
                  >
                    −
                  </button>
                  <span className="w-11 text-center text-[12px] text-white/85">{shownZoom}%</span>
                  <button
                    type="button"
                    onClick={() => setZoom(stepZoom(shownZoom, 1))}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-[15px] text-white/85 hover:bg-white/10"
                    aria-label={c.zoomIn}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoom(null)}
                    className="ml-1 min-h-7 cursor-pointer rounded px-2 text-[12px] font-medium text-white/85 hover:bg-white/10"
                  >
                    {c.fitToWidth}
                  </button>
                </div>
                <div ref={paneRef} className="max-h-[70vh] overflow-auto">
                  <div ref={sheetRoomRef} className="flex justify-center p-4">
                    <PdfSheet doc={stubDoc} scale={shownZoom / 100} employeeName={displayName} />
                  </div>
                </div>
              </div>
            )}
            <div className="min-w-0 flex-1 rounded-xl border border-border bg-white p-5">
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
            </div>
          </div>
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
