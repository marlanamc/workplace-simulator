"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import { CAST } from "@/lib/cast";
import {
  COLLEGE_OFFER_COPY,
  OFFER_LETTER,
  SLOTS,
  STARTERS,
  OVERLAP_STARTERS,
  HINTS,
  LESSONS,
  replyAcceptsOffer,
  overlapMentionsShift,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
} from "@/lib/tasks/college-offer/content";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskHub from "@/components/task/TaskHub";
import NeedAStart from "@/components/task/NeedAStart";
import { TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";
import { Calendar, Mail } from "lucide-react";

type View = "hub" | "mail" | "compose" | "calendar" | "overlap" | "done";

function stepFor(view: View): number {
  if (view === "hub") return 0;
  if (view === "mail" || view === "compose") return 1;
  if (view === "calendar") return 2;
  return 3;
}

export default function CollegeOfferTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("college-offer") ? "done" : "hub");
  const [reply, setReply] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [slot, setSlot] = useState<string | null>(null);
  const [repeats, setRepeats] = useState(false);
  const [eventSaved, setEventSaved] = useState(false);
  const [overlap, setOverlap] = useState("");
  const [overlapSent, setOverlapSent] = useState(false);
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = COLLEGE_OFFER_COPY[lang];
  const h = HINTS[lang];

  const tryAccept = () => {
    if (!reply.trim()) return say(h.empty);
    if (!replyAcceptsOffer(reply)) return say(h.accept);
    setAccepted(true);
    setView("hub");
  };

  const saveEvent = () => {
    const picked = SLOTS.find((s) => s.key === slot);
    if (!picked) return say(h.slot);
    if (!picked.ok) return say(picked.hint[lang]);
    if (!repeats) return say(h.repeats);
    setEventSaved(true);
    setView("overlap");
  };

  const tryOverlap = () => {
    if (!overlap.trim()) return say(h.empty);
    if (!overlapMentionsShift(overlap)) return say(h.overlap);
    setOverlapSent(true);
    setView("hub");
  };

  const finish = () => {
    if (!accepted || !eventSaved || !overlapSent) return say(c.sendNeed);
    setView("done");
    markComplete("college-offer", "accept_offer_on_full_calendar");
  };

  const restart = () => {
    setView("hub");
    setReply("");
    setAccepted(false);
    setSlot(null);
    setRepeats(false);
    setEventSaved(false);
    setOverlap("");
    setOverlapSent(false);
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-white text-[14px] text-[#202124]" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
      <div className="flex items-center gap-3 border-b border-[#e0e0e0] px-4 py-2.5">
        <span className="text-[18px] text-[#3c4043]">
          {view === "calendar" || view === "overlap" ? "Calendar" : view === "hub" ? (lang === "en" ? "Offer" : "Oferta") : "Mail"}
        </span>
        <div className="flex-1" />
      </div>

      {view !== "done" && (
        <RightNowBar
          icon={TASK_ICONS["college-offer"]}
          stepIndex={stepFor(view)}
          steps={RIGHT_NOW_STEPS}
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
                key: "mail",
                color: "#ea4335",
                icon: Mail,
                title: c.mailTitle,
                body: c.mailBody,
                done: accepted,
                cta: c.mailCta,
                onOpen: () => setView(accepted ? "mail" : "mail"),
              },
              {
                key: "cal",
                color: "#34a853",
                icon: Calendar,
                title: c.calTitle,
                body: c.calBody,
                done: eventSaved && overlapSent,
                cta: c.calCta,
                onOpen: () => setView(eventSaved && !overlapSent ? "overlap" : "calendar"),
              },
            ]}
          />
          <div className="mx-auto max-w-[640px] px-6 pb-6">
            <button
              onClick={finish}
              className="inline-flex min-h-[44px] items-center rounded-full bg-accent px-5 text-[15px] font-medium text-white cursor-pointer"
            >
              {c.sendCta}
            </button>
          </div>
        </div>
      )}

      {view === "mail" && (
        <div className="min-h-0 flex-1 overflow-auto px-6 py-4 sm:px-8">
          <h2 className="mb-5 text-[22px] font-normal leading-tight text-[#1f1f1f]">{c.subject}</h2>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#9334e6] text-[14px] font-medium text-white">
              HR
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-[14px] font-medium">{c.from}</span>
                <span className="text-[12px] text-[#5f6368]">9:04 AM</span>
              </div>
              <div className="text-[12px] text-[#5f6368]">{c.toMe}</div>
              <div className="mt-4 flex max-w-[62ch] flex-col gap-3 text-[14px] leading-[1.6] text-[#1f1f1f]">
                {OFFER_LETTER[lang].map((p) => (
                  <p key={p} className="m-0">{p}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 pl-[52px]">
            <button
              onClick={() => setView("compose")}
              className="inline-flex min-h-[40px] items-center rounded-full border border-[#747775] px-5 text-[14px] font-medium text-[#0b57d0] hover:bg-[#f2f6fc] cursor-pointer"
            >
              {c.reply}
            </button>
            <button onClick={() => setView("hub")} className="text-[13px] text-[#5f6368] cursor-pointer">
              ←
            </button>
          </div>
        </div>
      )}

      {view === "compose" && (
        <div className="min-h-0 flex-1 overflow-auto px-6 py-4 sm:px-8">
          <div className="ml-[52px] max-w-[520px] overflow-hidden rounded-2xl border border-[#e0e3e8] shadow-[0_1px_3px_rgba(60,64,67,.15)]">
            <div className="flex items-center gap-2 border-b border-[#e0e3e8] px-4 py-2 text-[13px]">
              <span className="w-10 shrink-0 text-[#5f6368]">{c.to}</span>
              <span>{CAST.hr.email}</span>
            </div>
            <div className="flex items-center gap-2 border-b border-[#e0e3e8] px-4 py-2 text-[13px]">
              <span className="w-10 shrink-0 text-[#5f6368]">Re:</span>
              <span>{c.subject}</span>
            </div>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder={c.writeHere}
              className="min-h-[120px] w-full resize-y border-none px-4 py-3 text-[14px] leading-relaxed outline-none placeholder:text-[#767676]"
            />
            <div className="px-4 pb-2">
              <NeedAStart lang={lang} starters={STARTERS[lang]} onPick={(s) => setReply((b) => (b ? `${b} ` : "") + s)} />
            </div>
            <div className="flex flex-wrap items-center gap-2 px-3 py-2">
              <button
                onClick={tryAccept}
                className="inline-flex min-h-[36px] items-center rounded-full bg-[#0b57d0] px-6 text-[14px] font-medium text-white cursor-pointer"
              >
                {c.send}
              </button>
              <button
                onClick={() => { setView("mail"); setReply(""); }}
                className="min-h-[36px] px-3 text-[13px] text-[#5f6368] cursor-pointer"
              >
                {c.discard}
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "calendar" && (
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-[480px] rounded-3xl border border-[#dadce0] bg-white p-6 shadow-sm">
            <div className="mb-1 text-[12px] text-[#5f6368]">{c.eventTitle}</div>
            <p className="mb-4 text-[16px] font-medium">{c.eventTitle}</p>
            <p className="mb-4 rounded-lg bg-[#fef7e0] px-3 py-2 text-[13px] text-[#3c4043]">{c.shiftNote}</p>
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
            <label className="mb-4 flex min-h-[40px] items-center gap-2 text-[14px] cursor-pointer">
              <input
                type="checkbox"
                checked={repeats}
                onChange={(e) => setRepeats(e.target.checked)}
                className="h-4 w-4"
              />
              {c.repeatsLabel}
            </label>
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

      {view === "overlap" && (
        <div className="min-h-0 flex-1 overflow-auto px-6 py-4 sm:px-8">
          <div className="mx-auto max-w-[520px] overflow-hidden rounded-2xl border border-[#e0e3e8] shadow-[0_1px_3px_rgba(60,64,67,.15)]">
            <div className="flex items-center gap-2 border-b border-[#e0e3e8] px-4 py-2 text-[13px]">
              <span className="w-10 shrink-0 text-[#5f6368]">{c.overlapTo}</span>
              <span>{CAST.renata.email}</span>
            </div>
            <div className="flex items-center gap-2 border-b border-[#e0e3e8] px-4 py-2 text-[13px]">
              <span className="w-10 shrink-0 text-[#5f6368]">{c.overlapSubject}</span>
            </div>
            <textarea
              value={overlap}
              onChange={(e) => setOverlap(e.target.value)}
              placeholder={c.overlapWrite}
              className="min-h-[120px] w-full resize-y border-none px-4 py-3 text-[14px] leading-relaxed outline-none placeholder:text-[#767676]"
            />
            <div className="px-4 pb-2">
              <NeedAStart lang={lang} starters={OVERLAP_STARTERS[lang]} onPick={(s) => setOverlap((b) => (b ? `${b} ` : "") + s)} />
            </div>
            <div className="flex flex-wrap items-center gap-2 px-3 py-2">
              <button
                onClick={tryOverlap}
                className="inline-flex min-h-[36px] items-center rounded-full bg-[#0b57d0] px-6 text-[14px] font-medium text-white cursor-pointer"
              >
                {c.send}
              </button>
              <button onClick={() => setView("calendar")} className="min-h-[36px] px-3 text-[13px] text-[#5f6368] cursor-pointer">
                {c.discard}
              </button>
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
              badgeNumber="16"
              badgeName={c.badgeName}
              badgeWhere={c.badgeWhere}
            />
            <TaskDoneActions kicker={c.sentKicker} tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
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
