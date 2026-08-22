"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  PRIORITY_COPY,
  EVENT_INTRO,
  COVER,
  MAIL_STARTERS,
  HINTS,
  LESSONS,
  CONFIDENCE_OPTIONS,
  replyIsSafe,
} from "@/lib/tasks/priority-call/content";
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
import { Calendar, Mail, Table2 } from "lucide-react";

type View = "intro" | "urgency" | "hub" | "mail" | "cover" | "calendar" | "done";

export default function PriorityCallTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("priority-call") ? "done" : "intro");
  const [urgency, setUrgency] = useState("");
  const [named, setNamed] = useState(false);
  const [mailDone, setMailDone] = useState(false);
  const [coverDone, setCoverDone] = useState(false);
  const [calDone, setCalDone] = useState(false);
  const [reply, setReply] = useState("");
  const [coverKey, setCoverKey] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const { nudge, say } = useNudge();
  const c = PRIORITY_COPY[lang];
  const h = HINTS[lang];

  const finishIfReady = (mail: boolean, cover: boolean, cal: boolean) => {
    if (mail && cover && cal) {
      setView("done");
      markComplete("priority-call", "handle_three_asks");
    } else {
      setView("hub");
    }
  };

  const lockUrgency = () => {
    if (urgency.trim().length < 12) return say(h.urgency);
    setNamed(true);
    setView("hub");
  };

  const sendReply = () => {
    if (reply.trim().length < 12) return say(h.empty);
    if (!replyIsSafe(reply)) return say(h.overpromise);
    setMailDone(true);
    finishIfReady(true, coverDone, calDone);
  };

  const assignCover = (key: string) => {
    const person = COVER.find((p) => p.key === key);
    if (!person) return;
    setCoverKey(key);
    if (!person.free) return say(person.hint[lang]);
    setCoverDone(true);
    finishIfReady(mailDone, true, calDone);
  };

  const proposeTime = () => {
    setCalDone(true);
    finishIfReady(mailDone, coverDone, true);
  };

  const restart = () => {
    setView("urgency");
    setUrgency("");
    setNamed(false);
    setMailDone(false);
    setCoverDone(false);
    setCalDone(false);
    setReply("");
    setCoverKey(null);
    setConfidence(null);
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-white text-[14px] text-[#202124]" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
      <div className="flex items-center gap-3 border-b border-[#e0e0e0] px-4 py-2.5">
        <span className="text-[18px] text-[#3c4043]">
          {view === "mail" ? "Mail" : view === "cover" ? "Sheets" : view === "calendar" ? "Calendar" : lang === "en" ? "On the floor" : "En el piso"}
        </span>
        <div className="flex-1" />
        <AppHeaderTools helpLabel={c.helpBtn} onHelp={() => setHelp(true)} />
      </div>

      {view === "intro" && (
        <div className="min-h-0 flex-1 overflow-auto px-6">
          <EventIntroCard {...EVENT_INTRO[lang]} icon={TASK_ICONS["priority-call"]} onContinue={() => setView("urgency")} />
        </div>
      )}

      {view === "urgency" && (
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-[520px]">
            <div className="text-[12px] font-semibold uppercase tracking-wide text-[var(--warning)]">{c.urgencyKicker}</div>
            <h2 className="mt-2 text-[22px] font-medium leading-tight">{c.urgencyQ}</h2>
            <textarea
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              placeholder={c.urgencyPh}
              className="mt-4 min-h-[120px] w-full resize-y rounded-xl border border-[#dadce0] p-3 text-[16px] leading-relaxed outline-none focus:border-[#1a73e8]"
            />
            <button
              onClick={lockUrgency}
              className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-[var(--accent)] px-5 text-[15px] font-medium text-white cursor-pointer"
            >
              {c.urgencyCta}
            </button>
          </div>
        </div>
      )}

      {view === "hub" && named && (
        <div className="min-h-0 flex-1 overflow-auto">
          <TaskHub
            heading={c.hubHeading}
            items={[
              { key: "mail", color: "#ea4335", icon: Mail, title: c.mailTitle, body: c.mailBody, done: mailDone, cta: c.mailCta, onOpen: () => setView("mail") },
              { key: "cover", color: "#0f9d58", icon: Table2, title: c.coverTitle, body: c.coverBody, done: coverDone, cta: c.coverCta, onOpen: () => setView("cover") },
              { key: "cal", color: "#34a853", icon: Calendar, title: c.calTitle, body: c.calBody, done: calDone, cta: c.calCta, onOpen: () => setView("calendar") },
            ]}
          />
        </div>
      )}

      {view === "mail" && (
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-[560px]">
            <div className="mb-1 text-[12px] text-[#5f6368]">{c.from} Dana Cole</div>
            <h2 className="text-[18px] font-medium">{c.subject}</h2>
            <div className="mt-3 space-y-2 text-[14px] leading-relaxed text-[#3c4043]">
              {c.customerBody.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder={c.replyPh}
              className="mt-4 min-h-[130px] w-full resize-y rounded-xl border border-[#dadce0] p-3 text-[15px] leading-relaxed outline-none"
            />
            <div className="mt-2">
              <NeedAStart lang={lang} starters={MAIL_STARTERS[lang]} onPick={(s) => setReply((b) => (b ? `${b} ` : "") + s)} />
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={sendReply} className="inline-flex min-h-[44px] items-center rounded-full bg-[var(--accent)] px-5 text-[15px] font-medium text-white cursor-pointer">
                {c.send}
              </button>
              <button onClick={() => setView("hub")} className="text-[13px] text-[#5f6368] cursor-pointer">←</button>
            </div>
          </div>
        </div>
      )}

      {view === "cover" && (
        <div className="min-h-0 flex-1 overflow-auto p-4">
          <div className="mb-3 max-w-[420px] rounded-sm border border-[#f9ab00] bg-[#fef7e0] px-3 py-2 text-[13px]">{c.coverNote}</div>
          <div className="inline-block border border-[#c0c0c0] text-[13px]">
            <div className="flex bg-[#f8f9fa] font-medium">
              <div className="w-[160px] border-b border-r border-[#c0c0c0] px-2 py-1.5">{lang === "en" ? "Name" : "Nombre"}</div>
              <div className="w-[72px] border-b border-r border-[#c0c0c0] px-2 py-1.5">{c.hoursHeader}</div>
              <div className="w-[120px] border-b border-[#c0c0c0] px-2 py-1.5">Thu</div>
            </div>
            {COVER.map((p) => (
              <div key={p.key} className="flex">
                <div className="flex w-[160px] items-center border-b border-r border-[#c0c0c0] px-2 py-1.5">{p.name}</div>
                <div className={`flex w-[72px] items-center border-b border-r border-[#c0c0c0] px-2 py-1.5 ${p.hours >= 40 ? "text-[#c5221f]" : ""}`}>{p.hours}</div>
                <div className="flex w-[120px] items-center border-b border-[#c0c0c0] bg-[#fef7e0] px-1">
                  <select
                    value={coverKey === p.key ? "4–10" : ""}
                    onChange={(e) => {
                      if (e.target.value) assignCover(p.key);
                      else setCoverKey(null);
                    }}
                    className="w-full bg-transparent text-[12px] outline-none cursor-pointer"
                  >
                    <option value="">{c.pickShift}</option>
                    <option value="4–10">4–10</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setView("hub")} className="mt-4 block text-[13px] text-[#5f6368] cursor-pointer">←</button>
        </div>
      )}

      {view === "calendar" && (
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-[420px] overflow-hidden rounded-3xl border border-[#dadce0] bg-white shadow-sm">
            <div className="h-2 bg-[#1a73e8]" />
            <div className="px-6 pb-5 pt-4">
              <h2 className="text-[22px] font-normal">{c.meetingTitle}</h2>
              <p className="mt-1 text-[14px]">{c.meetingWhen}</p>
              <p className="mt-3 text-[13px] text-[#c5221f]">{c.meetingNote}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => say(h.accept)} className="min-h-[40px] rounded-full border border-[#dadce0] px-4 text-[14px] font-medium cursor-pointer">{c.accept}</button>
                <button onClick={() => say(h.no)} className="min-h-[40px] rounded-full border border-[#dadce0] px-4 text-[14px] font-medium cursor-pointer">{c.no}</button>
              </div>
              <button onClick={proposeTime} className="mt-3 inline-flex min-h-[40px] items-center text-[14px] font-medium text-[#0b57d0] cursor-pointer">
                {c.propose} · {c.slotLabel}
              </button>
              <button onClick={() => setView("hub")} className="mt-4 block text-[13px] text-[#5f6368] cursor-pointer">←</button>
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
              badgeNumber="16"
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
