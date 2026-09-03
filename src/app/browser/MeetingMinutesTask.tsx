"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  MEETING_COPY,
  MEETING_SCRIPT,
  ATTENDEES,
  AGENDA_STARTERS,
  NOTE_STARTERS,
  FOLLOWUP_STARTERS,
  LESSONS,
  RIGHT_NOW_LABEL,
  RIGHT_NOW_STEPS,
  agendaLooksReady,
  notesLookReal,
  followupHasOwnersAndDates,
} from "@/lib/tasks/meeting-minutes/content";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskHub from "@/components/task/TaskHub";
import NeedAStart from "@/components/task/NeedAStart";
import GmailCompose from "@/components/task/GmailCompose";
import { TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";
import { ClipboardList, MessageSquare, Send } from "lucide-react";

type View = "hub" | "agenda" | "meeting" | "followup" | "done";

export default function MeetingMinutesTask() {
  const { markComplete, completedTaskKeys, lang, displayName } = useProgress();
  const [view, setView] = useState<View>(
    completedTaskKeys.includes("meeting-minutes") ? "done" : "hub",
  );
  const [agenda, setAgenda] = useState("");
  const [notes, setNotes] = useState("");
  const [followup, setFollowup] = useState("");
  const [agendaDone, setAgendaDone] = useState(false);
  const [notesDone, setNotesDone] = useState(false);
  const [followupDone, setFollowupDone] = useState(false);
  const [scriptStep, setScriptStep] = useState(0);
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = MEETING_COPY[lang];
  const script = MEETING_SCRIPT[lang];

  const stepIndex = view === "hub" ? 0 : view === "agenda" ? 1 : view === "meeting" ? 2 : 3;

  const finishIfReady = (a: boolean, n: boolean, f: boolean) => {
    if (a && n && f) {
      setView("done");
      markComplete("meeting-minutes", "run_the_meeting");
    } else {
      setView("hub");
    }
  };

  const saveAgenda = () => {
    if (!agendaLooksReady(agenda)) return say(c.needAgenda);
    setAgendaDone(true);
    finishIfReady(true, notesDone, followupDone);
  };

  const saveNotes = () => {
    if (!notesLookReal(notes)) return say(c.needNotes);
    setNotesDone(true);
    finishIfReady(agendaDone, true, followupDone);
  };

  const sendFollowup = () => {
    if (!followupHasOwnersAndDates(followup)) return say(c.needFollowup);
    setFollowupDone(true);
    finishIfReady(agendaDone, notesDone, true);
  };

  const restart = () => {
    setView("hub");
    setAgenda("");
    setNotes("");
    setFollowup("");
    setAgendaDone(false);
    setNotesDone(false);
    setFollowupDone(false);
    setScriptStep(0);
  };

  if (view === "done") {
    return (
      <div className="flex h-full min-h-0 flex-col bg-white" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard kicker={c.sentKicker} />
            <TaskDoneActions kicker={c.sentKicker} tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
          </div>
        </div>
        <NudgeToast text={nudge} onDismiss={dismiss} />
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-[#f8f9fa] text-[14px] text-[#202124]" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
      <div className="flex items-center gap-3 border-b border-[#e0e0e0] bg-white px-4 py-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded bg-[#34a853] text-white">
          {(() => {
            const Icon = TASK_ICONS["meeting-minutes"];
            return <Icon size={18} strokeWidth={2.25} />;
          })()}
        </span>
        <span className="text-[18px] text-[#3c4043]">{c.appName}</span>
      </div>

      <RightNowBar
        icon={TASK_ICONS["meeting-minutes"]}
        stepIndex={stepIndex}
        steps={RIGHT_NOW_STEPS}
        lang={lang}
        rightNowLabel={RIGHT_NOW_LABEL}
        onHelp={() => setHelp(true)}
      />

      {view === "hub" && (
        <div className="min-h-0 flex-1 overflow-auto">
          <TaskHub
            heading={c.hubHeading}
            items={[
              { key: "agenda", color: "#34a853", icon: ClipboardList, title: c.agendaTitle, body: c.agendaBody, done: agendaDone, cta: c.agendaCta, onOpen: () => setView("agenda") },
              { key: "notes", color: "#1a73e8", icon: MessageSquare, title: c.notesTitle, body: c.notesBody, done: notesDone, cta: c.notesCta, onOpen: () => setView("meeting") },
              { key: "followup", color: "#ea4335", icon: Send, title: c.followupTitle, body: c.followupBody, done: followupDone, cta: c.followupCta, onOpen: () => setView("followup") },
            ]}
          />
        </div>
      )}

      {view === "agenda" && (
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-[560px]">
            <label className="text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{c.agendaLabel}</label>
            <textarea
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              placeholder={c.agendaPlaceholder}
              rows={5}
              className="mt-2 w-full resize-y rounded-xl border border-[#dadce0] p-3 text-[15px] leading-relaxed outline-none focus:border-[#1a73e8]"
            />
            <div className="mt-2">
              <NeedAStart lang={lang} starters={AGENDA_STARTERS[lang]} onPick={(s) => setAgenda((b) => (b ? `${b}\n` : "") + s)} />
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={saveAgenda} className="inline-flex min-h-[44px] items-center rounded-full bg-accent px-5 text-[15px] font-medium text-white cursor-pointer">
                {c.agendaSave}
              </button>
              <button onClick={() => setView("hub")} className="text-[13px] text-[#5f6368] cursor-pointer">←</button>
            </div>
          </div>
        </div>
      )}

      {view === "meeting" && (
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-[560px]">
            <div className="text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{c.meetingKicker}</div>
            {/* Meet-style participant strip — a small row of tiles so "you ran
                the room" actually has a room. */}
            <div className="mt-2 flex flex-wrap gap-2">
              <ParticipantTile
                initials={(displayName.trim()[0] ?? "Y").toUpperCase()}
                name={lang === "en" ? "You" : "Tú"}
                color="#5f6368"
              />
              {ATTENDEES.map((p) => (
                <ParticipantTile key={p.name} initials={p.initials} name={p.name} color={p.color} />
              ))}
            </div>
            <div className="mt-3 space-y-2 rounded-xl border border-[#dadce0] bg-white p-4 text-[14px] leading-relaxed text-[#3c4043]">
              {script.slice(0, scriptStep + 1).map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            {scriptStep < script.length - 1 ? (
              <button
                onClick={() => setScriptStep((n) => n + 1)}
                className="mt-3 inline-flex min-h-[40px] items-center rounded-full border border-[#dadce0] px-4 text-[14px] font-medium cursor-pointer"
              >
                {c.nextLine}
              </button>
            ) : (
              <p className="mt-3 text-[13px] text-[#5f6368]">{c.meetingDone}</p>
            )}
            <label className="mt-5 block text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{c.notesLabel}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={c.notesPlaceholder}
              rows={4}
              className="mt-2 w-full resize-y rounded-xl border border-[#dadce0] p-3 text-[15px] leading-relaxed outline-none focus:border-[#1a73e8]"
            />
            <div className="mt-2">
              <NeedAStart lang={lang} starters={NOTE_STARTERS[lang]} onPick={(s) => setNotes((b) => (b ? `${b}\n` : "") + s)} />
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={saveNotes} className="inline-flex min-h-[44px] items-center rounded-full bg-accent px-5 text-[15px] font-medium text-white cursor-pointer">
                {c.notesSave}
              </button>
              <button onClick={() => setView("hub")} className="text-[13px] text-[#5f6368] cursor-pointer">←</button>
            </div>
          </div>
        </div>
      )}

      {view === "followup" && (
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-[560px]">
            <GmailCompose
              to={c.followupToValue}
              subject={c.followupSubjectValue}
              body={followup}
              onBody={setFollowup}
              placeholder={c.followupPlaceholder}
              toLabel={c.toLabel}
              subjectLabel={c.subjectLabel}
              sendLabel={c.send}
              onSend={sendFollowup}
            >
              <NeedAStart lang={lang} starters={FOLLOWUP_STARTERS[lang]} onPick={(s) => setFollowup((b) => (b ? `${b}\n` : "") + s)} />
            </GmailCompose>
            <div className="mt-3">
              <button
                onClick={() => setView("hub")}
                className="text-[13px] font-medium text-[#0b57d0] cursor-pointer hover:underline"
              >
                ← {c.backHub}
              </button>
            </div>
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

function ParticipantTile({ initials, name, color }: { initials: string; name: string; color: string }) {
  return (
    <div className="flex w-[76px] flex-col items-center gap-1 rounded-lg bg-[#202124] p-2 text-white">
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-medium"
        style={{ background: color }}
      >
        {initials}
      </span>
      <span className="max-w-full truncate text-[11px]">{name}</span>
    </div>
  );
}
