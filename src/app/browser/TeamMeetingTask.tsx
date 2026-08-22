"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  TEAM_MEETING_COPY,
  EVENT_INTRO,
  SLOTS,
  GUESTS,
  AGENDA_STARTERS,
  HINTS,
  LESSONS,
  CONFIDENCE_OPTIONS,
  titleIsAboutSchedule,
  agendaBulletCount,
} from "@/lib/tasks/team-meeting/content";
import { useNudge } from "@/lib/use-nudge";
import ConfidenceCheck from "@/components/task/ConfidenceCheck";
import EventIntroCard from "@/components/task/EventIntroCard";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskHub from "@/components/task/TaskHub";
import NeedAStart from "@/components/task/NeedAStart";
import { TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import AppHeaderTools from "@/components/task/AppHeaderTools";
import { Calendar, FileText } from "lucide-react";

type View = "intro" | "hub" | "calendar" | "docs" | "done";

export default function TeamMeetingTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("team-meeting") ? "done" : "intro");
  const [title, setTitle] = useState("");
  const [slot, setSlot] = useState<string | null>(null);
  const [eventSaved, setEventSaved] = useState(false);
  const [agenda, setAgenda] = useState("");
  const [confidence, setConfidence] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const { nudge, say } = useNudge();
  const c = TEAM_MEETING_COPY[lang];
  const h = HINTS[lang];
  const agendaOk = agendaBulletCount(agenda) >= 2;

  const saveEvent = () => {
    if (!titleIsAboutSchedule(title)) return say(h.title);
    const picked = SLOTS.find((s) => s.key === slot);
    if (!picked) return say(h.time);
    if (!picked.ok) return say(picked.hint[lang]);
    setEventSaved(true);
    setView("hub");
  };

  const saveAgenda = () => {
    if (!agendaOk) return say(h.agenda);
    setView("hub");
  };

  const sendInvite = () => {
    if (!eventSaved || !agendaOk) return say(c.sendNeed);
    setView("done");
    markComplete("team-meeting", "create_meeting_with_agenda");
  };

  const restart = () => {
    setView("hub");
    setTitle("");
    setSlot(null);
    setEventSaved(false);
    setAgenda("");
    setConfidence(null);
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-white text-[14px] text-[#202124]" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
      <div className="flex items-center gap-3 border-b border-[#e0e0e0] px-4 py-2.5">
        <span className="text-[18px] text-[#3c4043]">
          {view === "docs" ? "Docs" : view === "calendar" ? "Calendar" : lang === "en" ? "Huddle" : "Reunión"}
        </span>
        <div className="flex-1" />
        <AppHeaderTools helpLabel={c.helpBtn} onHelp={() => setHelp(true)} />
      </div>

      {view === "intro" && (
        <div className="min-h-0 flex-1 overflow-auto px-6">
          <EventIntroCard {...EVENT_INTRO[lang]} icon={TASK_ICONS["team-meeting"]} onContinue={() => setView("hub")} />
        </div>
      )}

      {view === "hub" && (
        <div className="min-h-0 flex-1 overflow-auto">
          <TaskHub
            heading={c.hubHeading}
            items={[
              {
                key: "cal",
                color: "#34a853",
                icon: Calendar,
                title: c.calTitle,
                body: c.calBody,
                done: eventSaved,
                cta: c.calCta,
                onOpen: () => setView("calendar"),
              },
              {
                key: "doc",
                color: "#4285f4",
                icon: FileText,
                title: c.docTitle,
                body: c.docBody,
                done: agendaOk,
                cta: c.docCta,
                onOpen: () => setView("docs"),
              },
            ]}
          />
          <div className="mx-auto max-w-[640px] px-6 pb-6">
            <button
              onClick={sendInvite}
              className="inline-flex min-h-[44px] items-center rounded-full bg-[var(--accent)] px-5 text-[15px] font-medium text-white cursor-pointer"
            >
              {c.sendCta}
            </button>
          </div>
        </div>
      )}

      {view === "calendar" && (
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-[480px] rounded-3xl border border-[#dadce0] bg-white p-6 shadow-sm">
            <label className="mb-1 block text-[12px] text-[#5f6368]">{c.eventTitleLabel}</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={c.eventTitlePh}
              className="mb-4 w-full rounded border border-[#747775] px-3 py-2 text-[15px] outline-none focus:border-2 focus:border-[#0b57d0]"
            />
            <div className="mb-1 text-[12px] text-[#5f6368]">{c.whenLabel}</div>
            <div className="mb-4 flex flex-col gap-1.5">
              {SLOTS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => {
                    setSlot(s.key);
                    if (!s.ok) say(s.hint[lang]);
                  }}
                  className={`min-h-[40px] rounded-lg border px-3 text-left text-[14px] cursor-pointer ${
                    slot === s.key ? "border-[#0b57d0] bg-[#e8f0fe]" : "border-[#dadce0]"
                  }`}
                >
                  {s.label[lang]}
                </button>
              ))}
            </div>
            <div className="mb-1 text-[12px] text-[#5f6368]">{c.guestsLabel}</div>
            <p className="mb-4 text-[13px] text-[#3c4043]">{GUESTS.join(" · ")}</p>
            <div className="flex gap-2">
              <button onClick={saveEvent} className="inline-flex h-10 items-center rounded-full bg-[#0b57d0] px-6 text-[14px] font-medium text-white cursor-pointer">
                {c.saveEvent}
              </button>
              <button onClick={() => setView("hub")} className="text-[13px] text-[#5f6368] cursor-pointer">
                ←
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "docs" && (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-[#e0e0e0] px-3 py-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#1a73e8] text-white">
              <FileText size={16} />
            </span>
            <span className="text-[16px]">{c.agendaName}</span>
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-6">
            <div className="mx-auto max-w-[640px]">
              <textarea
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                placeholder={c.agendaPh}
                className="min-h-[220px] w-full resize-y rounded border border-[#dadce0] p-4 text-[16px] leading-relaxed outline-none focus:border-[#1a73e8]"
              />
              <div className="mt-3">
                <NeedAStart lang={lang} starters={AGENDA_STARTERS[lang]} onPick={(s) => setAgenda((a) => (a ? `${a}\n${s}` : s))} />
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={saveAgenda} className="inline-flex h-10 items-center rounded-full bg-[#0b57d0] px-6 text-[14px] font-medium text-white cursor-pointer">
                  {c.saveEvent}
                </button>
                <button onClick={() => setView("hub")} className="text-[13px] text-[#5f6368] cursor-pointer">
                  ←
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "done" && (
        <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--surface-muted)] p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard
              kicker={c.sentKicker}
              title={c.doneTitle}
              body={c.doneBody}
              badgeNumber="15"
              badgeName={c.badgeName}
              badgeWhere={c.badgeWhere}
            />
            <ConfidenceCheck question={c.confidenceQ} options={CONFIDENCE_OPTIONS[lang]} selected={confidence} onSelect={setConfidence} />
            <TaskDoneActions tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
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
