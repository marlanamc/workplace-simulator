"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  APPOINTMENT_COPY,
  SLOTS,
  OPEN_SLOT,
  STARTERS as APPT_STARTERS,
  LESSONS as APPT_LESSONS,
  confirmationOffersOpenSlot,
  RIGHT_NOW_STEPS as APPT_STEPS,
  RIGHT_NOW_LABEL as APPT_LABEL,
} from "@/lib/tasks/appointment-scheduling/content";
import {
  INTAKE_COPY,
  PATIENT,
  STARTERS as INTAKE_STARTERS,
  LESSONS as INTAKE_LESSONS,
  declineIsSafe,
  RIGHT_NOW_STEPS as INTAKE_STEPS,
  RIGHT_NOW_LABEL as INTAKE_LABEL,
} from "@/lib/tasks/patient-intake/content";
import {
  CALL_COPY,
  CALL_CHOICES,
  LESSONS as CALL_LESSONS,
  choiceIsSafe,
  RIGHT_NOW_STEPS as CALL_STEPS,
  RIGHT_NOW_LABEL as CALL_LABEL,
  type CallChoice,
} from "@/lib/tasks/confidentiality-call/content";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import NeedAStart from "@/components/task/NeedAStart";
import { TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";

function DeskChrome({ clinic, children }: { clinic: string; children: React.ReactNode }) {
  return (
    <div className="relative flex h-full min-h-0 flex-col bg-[#f3f6f6] text-[14px] text-[#202124]">
      <div className="flex items-center gap-3 bg-[#00695c] px-4 py-2.5 text-white">
        <span className="text-[15px] font-semibold">{clinic}</span>
      </div>
      {children}
    </div>
  );
}

function DoneBlock({
  kicker,
  tryAgain,
  back,
  onRestart,
}: {
  kicker: string;
  tryAgain: string;
  back: string;
  onRestart: () => void;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-6">
      <div className="mx-auto flex max-w-[640px] flex-col gap-5">
        <TaskDoneCard kicker={kicker} />
        <TaskDoneActions kicker={kicker} tryAgainLabel={tryAgain} backToDeskLabel={back} onTryAgain={onRestart} />
      </div>
    </div>
  );
}

export default function FrontDeskTask() {
  const { currentTrack, completedTaskKeys } = useProgress();
  if (currentTrack.key === "patient-intake") return <IntakeDesk />;
  if (currentTrack.key === "confidentiality-call") return <PhoneDesk />;
  if (currentTrack.key === "appointment-scheduling") return <ScheduleDesk />;
  if (completedTaskKeys.includes("confidentiality-call")) return <PhoneDesk />;
  if (completedTaskKeys.includes("patient-intake")) return <IntakeDesk />;
  return <ScheduleDesk />;
}

function ScheduleDesk() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [done, setDone] = useState(completedTaskKeys.includes("appointment-scheduling"));
  const [slot, setSlot] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [compose, setCompose] = useState(false);
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = APPOINTMENT_COPY[lang];

  const pick = (time: string, taken: boolean) => {
    if (taken) return say(c.taken);
    setSlot(time);
  };

  const tryOffer = () => {
    if (slot !== OPEN_SLOT) return say(c.needSlot);
    setCompose(true);
  };

  const trySend = () => {
    if (!body.trim()) return say(c.empty);
    if (!confirmationOffersOpenSlot(body)) return say(c.weak);
    setDone(true);
    markComplete("appointment-scheduling", "book_without_a_clash");
  };

  const restart = () => {
    setDone(false);
    setSlot(null);
    setBody("");
    setCompose(false);
  };

  return (
    <DeskChrome clinic={c.clinic}>
      {!done && (
        <RightNowBar
          icon={TASK_ICONS["appointment-scheduling"]}
          stepIndex={compose ? 2 : slot === OPEN_SLOT ? 1 : 0}
          stepCount={APPT_STEPS.length}
          instruction={APPT_STEPS[compose ? 2 : slot === OPEN_SLOT ? 1 : 0]}
          lang={lang}
          rightNowLabel={APPT_LABEL}
          onHelp={() => setHelp(true)}
        />
      )}
      {done ? (
        <DoneBlock kicker={c.sentKicker} tryAgain={c.tryAgain} back={c.backToDesk} onRestart={restart} />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="mx-auto flex max-w-[640px] flex-col gap-4">
            <h2 className="text-[20px] font-medium">{c.heading}</h2>
            <p className="rounded-xl border border-[#dadce0] bg-white px-4 py-3 text-[15px] leading-relaxed">{c.request}</p>
            <div className="overflow-hidden rounded-xl border border-[#dadce0] bg-white">
              {SLOTS.map((s) => {
                const selected = slot === s.time;
                return (
                  <button
                    key={s.time}
                    type="button"
                    onClick={() => pick(s.time, s.taken)}
                    className={`flex w-full items-center justify-between border-b border-[#eee] px-4 py-2.5 text-left cursor-pointer last:border-b-0 ${
                      selected ? "bg-[#e0f2f1]" : "hover:bg-[#f8f9fa]"
                    }`}
                  >
                    <span className="font-medium tabular-nums">{s.time}</span>
                    <span className={s.taken ? "text-[#5f6368]" : "font-medium text-[#00695c]"}>
                      {s.taken ? `${c.booked} · ${s.name}` : c.open}
                    </span>
                  </button>
                );
              })}
            </div>
            {!compose ? (
              <button
                type="button"
                onClick={tryOffer}
                className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#00695c] px-6 text-[15px] font-medium text-white cursor-pointer"
              >
                {c.offerCta}
              </button>
            ) : (
              <div className="rounded-xl border border-[#dadce0] bg-white p-4">
                <div className="text-[13px] font-medium text-[#5f6368]">{c.confirmHeading}</div>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder={c.writeHere}
                  className="mt-2 min-h-[110px] w-full resize-y rounded-lg border border-[#dadce0] px-3 py-2 text-[15px] outline-none"
                />
                <NeedAStart lang={lang} starters={APPT_STARTERS[lang]} onPick={(s) => setBody((b) => (b ? `${b} ` : "") + s)} />
                <button
                  type="button"
                  onClick={trySend}
                  className="mt-3 inline-flex min-h-[46px] items-center rounded-full bg-[#00695c] px-5 text-[15px] font-medium text-white cursor-pointer"
                >
                  {c.send}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <HelpDrawer open={help} onClose={() => setHelp(false)} kicker={c.lessonKicker} lesson={APPT_LESSONS[lang][0]} tipLabel={c.tipLabel} gotItLabel={c.gotIt} />
      <NudgeToast text={nudge} onDismiss={dismiss} />
    </DeskChrome>
  );
}

function IntakeDesk() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [done, setDone] = useState(completedTaskKeys.includes("patient-intake"));
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [reason, setReason] = useState("");
  const [filed, setFiled] = useState(false);
  const [reply, setReply] = useState("");
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = INTAKE_COPY[lang];

  const tryFile = () => {
    if (!name.trim() || !dob.trim() || !reason.trim()) return say(c.needFields);
    setFiled(true);
  };

  const trySend = () => {
    if (!reply.trim()) return say(c.empty);
    if (/follow-?up|seguimiento/i.test(reply)) return say(c.shared);
    if (!declineIsSafe(reply)) return say(c.weak);
    setDone(true);
    markComplete("patient-intake", "file_intake_do_not_overshare");
  };

  const restart = () => {
    setDone(false);
    setName("");
    setDob("");
    setReason("");
    setFiled(false);
    setReply("");
  };

  return (
    <DeskChrome clinic={c.clinic}>
      {!done && (
        <RightNowBar
          icon={TASK_ICONS["patient-intake"]}
          stepIndex={filed ? 2 : 0}
          stepCount={INTAKE_STEPS.length}
          instruction={INTAKE_STEPS[filed ? 2 : 0]}
          lang={lang}
          rightNowLabel={INTAKE_LABEL}
          onHelp={() => setHelp(true)}
        />
      )}
      {done ? (
        <DoneBlock kicker={c.sentKicker} tryAgain={c.tryAgain} back={c.backToDesk} onRestart={restart} />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="mx-auto flex max-w-[640px] flex-col gap-4">
            <h2 className="text-[20px] font-medium">{c.heading}</h2>
            <div className="rounded-xl border border-[#dadce0] bg-white p-4">
              <label className="block text-[13px] text-[#5f6368]">{c.nameLabel}</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={PATIENT.name} className="mt-1 mb-3 w-full rounded-lg border border-[#dadce0] px-3 py-2 text-[15px]" />
              <label className="block text-[13px] text-[#5f6368]">{c.dobLabel}</label>
              <input value={dob} onChange={(e) => setDob(e.target.value)} placeholder={PATIENT.dob} className="mt-1 mb-3 w-full rounded-lg border border-[#dadce0] px-3 py-2 text-[15px]" />
              <label className="block text-[13px] text-[#5f6368]">{c.reasonLabel}</label>
              <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder={PATIENT.reason[lang]} className="mt-1 w-full rounded-lg border border-[#dadce0] px-3 py-2 text-[15px]" />
              {!filed && (
                <button type="button" onClick={tryFile} className="mt-4 inline-flex min-h-[46px] items-center rounded-full bg-[#00695c] px-5 text-[15px] font-medium text-white cursor-pointer">
                  {c.file}
                </button>
              )}
            </div>
            {filed && (
              <>
                <div className="rounded-xl border border-[#c8e6c9] bg-[#e8f5e9] px-4 py-3">
                  <div className="text-[12px] font-medium text-[#2e7d32]">{c.careTeamName}</div>
                  <p className="mt-1 text-[15px]">{c.careTeamAsk}</p>
                </div>
                <div className="rounded-xl border border-[#dadce0] bg-white p-4">
                  <div className="text-[12px] font-medium text-[#5f6368]">{c.coworkerName}</div>
                  <p className="mt-1 text-[15px]">{c.coworkerAsk}</p>
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder={c.writeHere}
                    className="mt-3 min-h-[110px] w-full resize-y rounded-lg border border-[#dadce0] px-3 py-2 text-[15px] outline-none"
                  />
                  <NeedAStart lang={lang} starters={INTAKE_STARTERS[lang]} onPick={(s) => setReply((b) => (b ? `${b} ` : "") + s)} />
                  <button type="button" onClick={trySend} className="mt-3 inline-flex min-h-[46px] items-center rounded-full bg-[#00695c] px-5 text-[15px] font-medium text-white cursor-pointer">
                    {c.send}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <HelpDrawer open={help} onClose={() => setHelp(false)} kicker={c.lessonKicker} lesson={INTAKE_LESSONS[lang][0]} tipLabel={c.tipLabel} gotItLabel={c.gotIt} />
      <NudgeToast text={nudge} onDismiss={dismiss} />
    </DeskChrome>
  );
}

function PhoneDesk() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [done, setDone] = useState(completedTaskKeys.includes("confidentiality-call"));
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = CALL_COPY[lang];

  const pick = (key: CallChoice) => {
    if (key === "share") return say(c.shareHint);
    if (key === "rude") return say(c.rudeHint);
    if (!choiceIsSafe(key)) return;
    setDone(true);
    markComplete("confidentiality-call", "do_not_confirm_over_the_phone");
  };

  return (
    <DeskChrome clinic={c.clinic}>
      {!done && (
        <RightNowBar
          icon={TASK_ICONS["confidentiality-call"]}
          stepIndex={0}
          stepCount={CALL_STEPS.length}
          instruction={CALL_STEPS[2]}
          lang={lang}
          rightNowLabel={CALL_LABEL}
          onHelp={() => setHelp(true)}
        />
      )}
      {done ? (
        <DoneBlock kicker={c.sentKicker} tryAgain={c.tryAgain} back={c.backToDesk} onRestart={() => setDone(false)} />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="mx-auto flex max-w-[520px] flex-col gap-4">
            <div className="rounded-2xl bg-[#263238] px-5 py-6 text-white">
              <div className="text-[12px] uppercase tracking-wide text-white/60">{c.ringing}</div>
              <h2 className="mt-1 text-[22px] font-medium">{c.heading}</h2>
              <p className="mt-4 text-[16px] leading-relaxed text-white/90">{c.caller}</p>
            </div>
            <p className="text-[14px] text-[#5f6368]">{c.script}</p>
            <div className="text-[13px] font-medium text-[#5f6368]">{c.pick}</div>
            {CALL_CHOICES.map((choice) => (
              <button
                key={choice.key}
                type="button"
                onClick={() => pick(choice.key)}
                className="min-h-[56px] rounded-xl border border-[#dadce0] bg-white px-4 text-left text-[15px] hover:bg-[#e0f2f1] cursor-pointer"
              >
                {choice.label[lang]}
              </button>
            ))}
          </div>
        </div>
      )}
      <HelpDrawer open={help} onClose={() => setHelp(false)} kicker={c.lessonKicker} lesson={CALL_LESSONS[lang][0]} tipLabel={c.tipLabel} gotItLabel={c.gotIt} />
      <NudgeToast text={nudge} onDismiss={dismiss} />
    </DeskChrome>
  );
}
