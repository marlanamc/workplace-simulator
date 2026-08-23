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
import { useNudge } from "@/lib/use-nudge";
import ConfidenceCheck from "@/components/task/ConfidenceCheck";
import EventIntroCard from "@/components/task/EventIntroCard";
import { TASK_ICONS } from "@/lib/icons";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import AppHeaderTools from "@/components/task/AppHeaderTools";

type View = "intro" | "list" | "check1" | "check2" | "done";

export default function PaystubTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("paystub") ? "done" : "intro");
  const [confidence, setConfidence] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const { nudge, say } = useNudge();
  const { openApp } = useWindowManager();

  const c = PAYSTUB_COPY[lang];

  const openStub = (p: (typeof PAY_STUBS)[number]) => {
    if (p.pdfDocId) {
      openApp("pdf", { docId: p.pdfDocId });
      setView("check1");
      return;
    }
    if (p.wrongHint) say(p.wrongHint[lang]);
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
        <AppHeaderTools
          helpLabel={c.helpBtn}
          onHelp={() => setHelp(true)}
        />
      </div>

      {view === "intro" && (
        <EventIntroCard {...EVENT_INTRO[lang]} icon={TASK_ICONS.paystub} onContinue={() => setView("list")} />
      )}

      {view === "list" && (
        <div>
          <p className="mb-3 max-w-[52ch] text-[14px] leading-relaxed text-[var(--text-secondary)]">{c.listLead}</p>
          <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
            {PAY_STUBS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => openStub(p)}
                className={`flex w-full items-center justify-between px-4 py-3.5 text-left hover:bg-[var(--surface-muted)] cursor-pointer ${i !== 0 ? "border-t border-[var(--border)]" : ""}`}
              >
                <div>
                  <div className="text-[14px] font-medium text-[var(--text-primary)]">{p.employee}</div>
                  <div className="text-[13px] text-[var(--text-tertiary)]">
                    {p.role} · {p.period}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[14px] font-medium text-[var(--text-primary)]">{p.net}</div>
                  <div className="text-[13px] text-[var(--text-tertiary)]">{c.netLabel}</div>
                </div>
              </button>
            ))}
          </div>
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

          <TaskDoneActions
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
        lesson={LESSONS[lang][view === "list" ? 0 : 1]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
      />

      <NudgeToast text={nudge} bottom={32} />
    </div>
  );
}
