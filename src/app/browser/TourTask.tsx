"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  TOUR_COPY,
  TOUR_FACTS,
  LESSONS,
  EVENT_INTRO,
  CONFIDENCE_OPTIONS,
} from "@/lib/tasks/tour/content";
import { useNudge } from "@/lib/use-nudge";
import ConfidenceCheck from "@/components/task/ConfidenceCheck";
import EventIntroCard from "@/components/task/EventIntroCard";
import { TASK_ICONS, Check } from "@/lib/icons";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import AppHeaderTools from "@/components/task/AppHeaderTools";

type View = "intro" | "facts" | "help" | "done";

export default function TourTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("tour") ? "done" : "intro");
  const [checked, setChecked] = useState([false, false, false]);
  const [openedHelp, setOpenedHelp] = useState(false);
  const [help, setHelp] = useState(false);
  const [confidence, setConfidence] = useState<string | null>(null);
  const { nudge, say } = useNudge();

  const c = TOUR_COPY[lang];
  const facts = TOUR_FACTS[lang];
  const allChecked = checked.every(Boolean);

  const openHelp = () => {
    setOpenedHelp(true);
    setHelp(true);
  };

  const finish = () => {
    setView("done");
    markComplete("tour", "how_it_works");
  };

  const tryReady = () => {
    if (!openedHelp) {
      say(c.helpNeed);
      return;
    }
    finish();
  };

  const restart = () => {
    setChecked([false, false, false]);
    setOpenedHelp(false);
    setConfidence(null);
    setView("facts");
  };

  const toggleFact = (i: number) => {
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f6f1e8] text-[15px] text-[#1c1410]">
      {view !== "intro" && (
        <div className="flex items-center gap-3 border-b border-[#e0d4c4] bg-white px-3 py-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c45c26] text-white">
            {(() => {
              const Icon = TASK_ICONS.tour;
              return <Icon size={18} strokeWidth={2.25} aria-hidden />;
            })()}
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-medium uppercase tracking-wide text-[#8a6a4a]">{c.packetKicker}</div>
            <div className="truncate text-[16px] font-medium leading-tight">{c.packetTitle}</div>
          </div>
          <AppHeaderTools helpLabel={c.helpBtn} onHelp={openHelp} />
        </div>
      )}

      {view === "intro" && (
        <div className="min-h-0 flex-1 overflow-y-auto bg-white p-6">
          <EventIntroCard {...EVENT_INTRO[lang]} icon={TASK_ICONS.tour} onContinue={() => setView("facts")} />
        </div>
      )}

      {view === "facts" && (
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex w-full max-w-[560px] flex-col gap-5">
            <p className="text-[14px] text-[#6a4e32]">{c.packetFrom}</p>
            <p className="text-[16px] leading-relaxed">{c.factsLead}</p>
            <ul className="flex flex-col gap-2">
              {facts.map((fact, i) => {
                const on = checked[i];
                return (
                  <li key={fact.title}>
                    <button
                      type="button"
                      onClick={() => toggleFact(i)}
                      className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left cursor-pointer ${
                        on
                          ? "border-[#1c1410] bg-white"
                          : "border-[#e0d4c4] bg-white/70 hover:border-[#c45c26]"
                      }`}
                    >
                      <span
                        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                        style={{
                          border: on ? "none" : "1.5px solid #1c1410",
                          background: on ? "#1c1410" : "transparent",
                          color: on ? "#f6f1e8" : "#1c1410",
                        }}
                        aria-hidden
                      >
                        {on ? <Check size={16} strokeWidth={3} /> : <span className="text-[13px] font-semibold">{i + 1}</span>}
                      </span>
                      <span>
                        <span className="block text-[16px] font-medium">{fact.title}</span>
                        <span className="mt-0.5 block text-[14px] leading-relaxed text-[#6a4e32]">{fact.body}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              disabled={!allChecked}
              onClick={() => setView("help")}
              className={`inline-flex min-h-[48px] items-center justify-center self-start rounded-full px-6 text-[16px] font-medium ${
                allChecked
                  ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] cursor-pointer"
                  : "cursor-not-allowed bg-[#e0d4c4] text-[#8a6a4a]"
              }`}
            >
              {c.factsCta}
            </button>
          </div>
        </div>
      )}

      {view === "help" && (
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex w-full max-w-[560px] flex-col gap-5">
            <p className="text-[20px] font-medium leading-tight">{c.helpLead}</p>
            <p className="max-w-[46ch] text-[16px] leading-relaxed text-[#6a4e32]">
              {openedHelp ? c.helpOpened : c.helpNeed}
            </p>
            <button
              type="button"
              onClick={tryReady}
              className="inline-flex min-h-[48px] items-center justify-center self-start rounded-full bg-[var(--accent)] px-6 text-[16px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
            >
              {c.helpReady}
            </button>
          </div>
        </div>
      )}

      {view === "done" && (
        <div className="min-h-0 flex-1 overflow-y-auto bg-white p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard
              kicker={c.sentKicker}
              title={c.doneTitle}
              body={c.doneBody}
              badgeNumber="00"
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
        </div>
      )}

      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={c.lessonKicker}
        lesson={LESSONS[lang][0]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
        askPersonLabel={c.askPerson}
      />

      <NudgeToast text={nudge} bottom={32} />
    </div>
  );
}
