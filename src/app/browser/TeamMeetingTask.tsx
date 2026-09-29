"use client";

import { useState } from "react";
import { useTaskDraft } from "@/lib/use-task-draft";
import { useProgress } from "@/lib/progress-context";
import {
  TEAM_MEETING_COPY,
  SLOTS,
  CREW_TABLE_COPY,
  slotIsFree,
  GUESTS,
  AGENDA_STARTERS,
  HINTS,
  LESSONS,
  titleIsAboutSchedule,
  agendaIsReady,
  describeSubmission,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
} from "@/lib/tasks/team-meeting/content";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskHub from "@/components/task/TaskHub";
import NeedAStart from "@/components/task/NeedAStart";
import { TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";
import { Calendar, FileText } from "lucide-react";
import { CREW, DAY_LABELS } from "@/lib/tasks/crew-week";

type View = "hub" | "calendar" | "docs" | "done";

export default function TeamMeetingTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("team-meeting") ? "done" : "hub");
  const [title, setTitle] = useTaskDraft("team-meeting", "title", "");
  const [slot, setSlot] = useTaskDraft<string | null>("team-meeting", "slot", null);
  const [eventSaved, setEventSaved] = useTaskDraft("team-meeting", "eventSaved", false);
  const [agenda, setAgenda] = useTaskDraft("team-meeting", "agenda", "");
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = TEAM_MEETING_COPY[lang];
  const h = HINTS[lang];
  const agendaOk = agendaIsReady(agenda);

  const saveEvent = () => {
    if (!titleIsAboutSchedule(title)) return say(h.title);
    const picked = SLOTS.find((s) => s.key === slot);
    if (!picked) return say(h.time);
    if (!slotIsFree(picked.key)) return say(picked.hint[lang]);
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
    markComplete("team-meeting", "create_meeting_with_agenda", describeSubmission({ title, agenda }, lang));
  };

  const restart = () => {
    setView("hub");
    setTitle("");
    setSlot(null);
    setEventSaved(false);
    setAgenda("");
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-white text-[14px] text-[#202124]" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
      <div className="flex items-center gap-3 border-b border-[#e0e0e0] px-4 py-2.5">
        <span className="text-[18px] text-[#3c4043]">
          {view === "docs" ? "Docs" : view === "calendar" ? "Calendar" : lang === "en" ? "Huddle" : "Reunión"}
        </span>
        <div className="flex-1" />
      </div>

      {view !== "done" && (
        <RightNowBar
          icon={TASK_ICONS["team-meeting"]}
          stepIndex={view === "hub" ? 0 : view === "calendar" ? 1 : 2}
          stepCount={RIGHT_NOW_STEPS.length}
          instruction={RIGHT_NOW_STEPS[view === "hub" ? 0 : view === "calendar" ? 1 : 2]}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onHelp={() => setHelp(true)}
        />
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
              className="inline-flex min-h-[44px] items-center rounded-full bg-accent px-5 text-[15px] font-medium text-white cursor-pointer"
            >
              {c.sendCta}
            </button>
          </div>
        </div>
      )}

      {view === "calendar" && (
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="mx-auto mb-4 max-w-[640px] overflow-x-auto">
            <table className="w-full border-collapse text-left text-[13px]">
              <caption className="mb-2 text-left font-semibold">{CREW_TABLE_COPY.caption[lang]}</caption>
              <thead><tr><th className="p-2">{CREW_TABLE_COPY.name[lang]}</th>{(['wed', 'thu', 'fri'] as const).map(day => <th className="p-2" key={day}>{DAY_LABELS[lang][day]}</th>)}</tr></thead>
              <tbody>{CREW.map(person => <tr key={person.key} className="border-t border-[#dadce0]">
                <th scope="row" className="p-2 font-medium">{person.name}</th>
                {(['wed', 'thu', 'fri'] as const).map(day => <td key={day} className="p-2">{person.shifts[day].label || CREW_TABLE_COPY.off[lang]}</td>)}
              </tr>)}</tbody>
            </table>
          </div>
          <div className="mx-auto max-w-[480px] rounded-3xl border border-[#dadce0] bg-white p-6 shadow-sm">
            <label htmlFor="team-meeting-title" className="mb-1 block text-[12px] text-[#5f6368]">{c.eventTitleLabel}</label>
            <input
              id="team-meeting-title"
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
                    if (!slotIsFree(s.key)) say(s.hint[lang]);
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
        <div className="min-h-0 flex-1 overflow-y-auto bg-surface-muted p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard
              kicker={c.sentKicker}
              title={c.doneTitle}
              body={c.doneBody}
              badgeNumber="15"
              badgeName={c.badgeName}
              badgeWhere={c.badgeWhere}
            />
            <TaskDoneActions taskKey="team-meeting" kicker={c.sentKicker} tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
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
      />
      <NudgeToast text={nudge} onDismiss={dismiss} />
    </div>
  );
}
