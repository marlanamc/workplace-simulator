"use client";

import { useState } from "react";
import { useWindowManager } from "@/lib/window-manager";
import { useProgress } from "@/lib/progress-context";
import {
  PAY_STUBS,
  PAYSTUB_COPY,
  NET_PAY_CHECK,
  HOURS_CHECK,
  LESSONS,
  EVENT_INTRO,
  CONFIDENCE_OPTIONS,
  type CheckOption,
} from "@/lib/tasks/paystub/content";
import type { Lang } from "@/lib/task-types";
import { useNudge } from "@/lib/use-nudge";
import ConfidenceCheck from "@/components/task/ConfidenceCheck";
import EventIntroCard from "@/components/task/EventIntroCard";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskDoneCard from "@/components/task/TaskDoneCard";

type View = "intro" | "list" | "check1" | "check2" | "done";

export default function PaystubTask() {
  const [lang, setLang] = useState<Lang>("en");
  const { markComplete, completedTaskKeys } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("paystub") ? "done" : "intro");
  const [openStub, setOpenStub] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const { nudge, say } = useNudge();
  const { openApp, minimizeActive } = useWindowManager();

  const c = PAYSTUB_COPY[lang];

  const openTarget = (docId: string) => {
    openApp("pdf", { docId });
    setView("check1");
  };

  const answer = (opt: CheckOption, onCorrect: () => void) => {
    if (opt.isTarget) return onCorrect();
    if (opt.wrongHint) say(opt.wrongHint[lang]);
  };

  const restart = () => {
    setView("list");
    setConfidence(null);
  };

  const netCheck = NET_PAY_CHECK[lang];
  const hoursCheck = HOURS_CHECK[lang];

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[19px] font-medium">{c.heading}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHelp(true)}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-[var(--warning-tint)] px-3.5 text-[13px] font-medium text-[var(--warning)] hover:brightness-95 cursor-pointer"
          >
            ? {c.helpBtn}
          </button>
          <button
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            className="inline-flex min-h-[40px] items-center rounded-full border border-[var(--border)] px-3.5 text-[13px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] cursor-pointer"
          >
            {c.langBtn}
          </button>
        </div>
      </div>

      {view === "intro" && (
        <EventIntroCard {...EVENT_INTRO[lang]} onContinue={() => setView("list")} />
      )}

      {view === "list" && (
        <div>
          <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
            {PAY_STUBS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => (p.pdfDocId ? openTarget(p.pdfDocId) : setOpenStub(p.id))}
                className={`flex w-full items-center justify-between px-4 py-3.5 text-left hover:bg-[var(--surface-muted)] cursor-pointer ${i !== 0 ? "border-t border-[var(--border)]" : ""}`}
              >
                <div>
                  <div className="text-[14px] font-medium text-[var(--text-primary)]">{p.period}</div>
                  <div className="text-[13px] text-[var(--text-tertiary)]">
                    {c.paidLabel} {p.payDate}
                    {p.pdfDocId && <span className="ml-2 text-[var(--accent)]">· {c.openInPdfHint}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[14px] font-medium text-[var(--text-primary)]">{p.net}</div>
                  <div className="text-[13px] text-[var(--text-tertiary)]">{c.netLabel}</div>
                </div>
              </button>
            ))}
          </div>

          {openStub && (
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-6"
              onClick={() => setOpenStub(null)}
            >
              <div
                className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-2xl animate-fade-up"
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const stub = PAY_STUBS.find((p) => p.id === openStub)!;
                  return (
                    <>
                      <h3 className="mb-4 text-[18px] font-medium">{stub.period}</h3>
                      <div className="flex flex-col gap-2 text-[14px]">
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">{c.payDate}</span>
                          <span className="font-medium">{stub.payDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">{c.grossPay}</span>
                          <span className="font-medium">{stub.gross}</span>
                        </div>
                        <div className="flex justify-between border-t border-[var(--border)] pt-2">
                          <span className="text-[var(--text-secondary)]">{c.netPay}</span>
                          <span className="font-semibold">{stub.net}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setOpenStub(null)}
                        className="mt-5 inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-[var(--border)] text-[14px] font-medium text-[var(--text-primary)] cursor-pointer"
                      >
                        {c.close}
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      )}

      {(view === "check1" || view === "check2") && (
        <div className="rounded-xl border border-[var(--border)] bg-white p-5">
          <div className="mb-2.5 text-[15px] font-medium">
            {view === "check1" ? netCheck.question : hoursCheck.question}
          </div>
          <div className="flex flex-wrap gap-2">
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
                className="min-h-[44px] rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 text-[14px] font-medium text-[var(--text-primary)] hover:bg-white cursor-pointer"
              >
                {opt.label}
              </button>
            ))}
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

          <ConfidenceCheck
            question={c.confidenceQ}
            options={CONFIDENCE_OPTIONS[lang]}
            selected={confidence}
            onSelect={setConfidence}
          />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={restart}
              className="inline-flex min-h-[46px] items-center rounded-full bg-[var(--accent)] px-5 text-[15px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
            >
              {c.tryAgain}
            </button>
            <button
              onClick={minimizeActive}
              className="inline-flex min-h-[46px] items-center rounded-full border border-[var(--border)] px-5 text-[15px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] cursor-pointer"
            >
              {c.backToDesk}
            </button>
          </div>
        </div>
      )}

      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={c.lessonKicker}
        lesson={LESSONS[lang][view === "list" ? 0 : 1]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
        askPersonLabel={c.askPerson}
      />

      <NudgeToast text={nudge} bottom={32} />
    </div>
  );
}
