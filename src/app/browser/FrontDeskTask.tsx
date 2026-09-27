"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  APPOINTMENT_COPY,
  CONFLICT_OPTIONS,
  conflictIdentified,
  SLOTS,
  OPEN_SLOT,
  REQUESTED_SLOT,
  BOOKED_VISIT,
  PATIENT as APPT_PATIENT,
  PROVIDER,
  PHONE_MESSAGE,
  type SlotStatus,
  STARTERS as APPT_STARTERS,
  LESSONS as APPT_LESSONS,
  confirmationProblem,
  confirmationCorrection,
  RIGHT_NOW_STEPS as APPT_STEPS,
  RIGHT_NOW_LABEL as APPT_LABEL,
  SHOW_ME_LOOK as APPT_LOOK,
} from "@/lib/tasks/appointment-scheduling/content";
import {
  INTAKE_COPY,
  VERIFIED_ASSIGNMENT, RECIPIENT_LABEL, RECIPIENT_HINT, RECIPIENT_OPTIONS, recipientIsAuthorized,
  PATIENT,
  STARTERS as INTAKE_STARTERS,
  LESSONS as INTAKE_LESSONS,
  declineIsSafe,
  describeSubmission as describeIntake,
  RIGHT_NOW_STEPS as INTAKE_STEPS,
  RIGHT_NOW_LABEL as INTAKE_LABEL,
} from "@/lib/tasks/patient-intake/content";
import {
  CALL_COPY,
  STARTERS as CALL_STARTERS,
  LESSONS as CALL_LESSONS,
  replySharesInfo,
  replyIsRude,
  replyIsSafe,
  describeSubmission as describeCall,
  RIGHT_NOW_STEPS as CALL_STEPS,
  RIGHT_NOW_LABEL as CALL_LABEL,
} from "@/lib/tasks/confidentiality-call/content";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import NeedAStart from "@/components/task/NeedAStart";
import { TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";
import ShowMeHighlight from "@/components/task/ShowMeHighlight";
import { SHOW_ME_POINTER, useShowMe } from "@/lib/use-show-me";

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
  children,
}: {
  kicker: string;
  tryAgain: string;
  back: string;
  onRestart: () => void;
  /** What the learner did (the booked row, the sent text), under the check. */
  children?: React.ReactNode;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-6">
      <div className="mx-auto flex max-w-[640px] flex-col gap-5">
        <TaskDoneCard kicker={kicker} />
        {children}
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

/**
 * Which control each step's Show me points at. The two reading steps point
 * at the evidence (the 10:00 row, the Status column), not at the answer.
 */
const APPT_SHOW_ME = ["requested-slot", "status-header", "offer-button", "confirm-body"] as const;

/** One schedule row's columns, shared by the header and the rows so they line up. */
const SHEET_COLS = "grid-cols-[48px_minmax(0,1fr)_7.5rem] @md:grid-cols-[56px_minmax(0,1fr)_minmax(0,1fr)_7.5rem]";

function ScheduleDesk() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [done, setDone] = useState(completedTaskKeys.includes("appointment-scheduling"));
  const [conflict, setConflict] = useState("");
  const [slot, setSlot] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [compose, setCompose] = useState(false);
  // Set on the first rejected Send, so "On my own" keeps the starters hidden
  // until the learner has tried in their own words.
  const [missed, setMissed] = useState(false);
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const showMe = useShowMe();
  const c = APPOINTMENT_COPY[lang];
  const composeRef = useRef<HTMLTextAreaElement>(null);

  // The text box opens under the schedule, often below the window. Bring it
  // into view and put the cursor in it (a DOM sync, no state).
  useEffect(() => {
    if (!compose) return;
    const box = composeRef.current;
    box?.scrollIntoView({ block: "center", behavior: "smooth" });
    box?.focus({ preventScroll: true });
  }, [compose]);

  // The whole schedule is on screen from the start: reading it is the skill,
  // not clicking each row to uncover it.
  const reasonKnown = conflictIdentified(conflict);
  const stepIndex = compose ? 3 : !reasonKnown ? 0 : slot !== OPEN_SLOT ? 1 : 2;

  const chooseReason = (key: string) => {
    setConflict(key);
    showMe.clear();
    const option = CONFLICT_OPTIONS.find((o) => o.key === key);
    if (option && !conflictIdentified(key)) say(option.hint[lang]);
  };

  const pick = (time: string, taken: boolean, name: string | null, status: SlotStatus) => {
    showMe.clear();
    if (status === "blocked") return say(c.blocked);
    if (taken) return say(name ? c.takenBy(name) : c.taken);
    setSlot(time);
  };
  const statusLabel: Record<SlotStatus, string> = { "checked-in": c.checkedIn, confirmed: c.confirmed, open: c.open, blocked: c.blockedLabel };

  const tryOffer = () => {
    showMe.clear();
    if (!reasonKnown) return say(c.wrongReason);
    if (slot !== OPEN_SLOT) return say(c.needSlot);
    setCompose(true);
  };

  const trySend = () => {
    showMe.clear();
    const problem = confirmationProblem(body);
    if (problem) {
      setMissed(true);
      return say(confirmationCorrection(problem, lang));
    }
    setDone(true);
    markComplete("appointment-scheduling", "book_without_a_clash");
  };

  const restart = () => {
    setDone(false);
    setSlot(null);
    setConflict("");
    setBody("");
    setCompose(false);
    setMissed(false);
  };

  return (
    <DeskChrome clinic={c.clinic}>
      {!done && (
        <RightNowBar
          icon={TASK_ICONS["appointment-scheduling"]}
          stepIndex={stepIndex}
          steps={APPT_STEPS}
          lang={lang}
          rightNowLabel={APPT_LABEL}
          onShowMe={() => showMe.toggleFor(APPT_SHOW_ME[stepIndex])}
          showMeActive={showMe.targetId === APPT_SHOW_ME[stepIndex]}
          onHelp={() => setHelp(true)}
        />
      )}
      {done ? (
        <DoneBlock kicker={c.sentKicker} tryAgain={c.tryAgain} back={c.backToDesk} onRestart={restart}>
          {/* What was done: the booked row and the text that went out. */}
          <section aria-label={c.doneHeading} className="@container rounded-xl border border-[#dadce0] bg-white p-4">
            <h2 className="m-0 text-[15px] font-medium">{c.doneHeading}</h2>
            <div className={`mt-2 grid ${SHEET_COLS} items-center gap-2 rounded-lg bg-[#e0f2f1] px-3 py-2 text-[14px]`}>
              <span className="font-medium tabular-nums">{OPEN_SLOT}</span>
              <span className="truncate">{APPT_PATIENT[lang]}</span>
              <span className="hidden truncate text-[#5f6368] @md:block">{BOOKED_VISIT[lang]}</span>
              <span className="whitespace-nowrap font-medium text-[#00695c]">{c.confirmed}</span>
            </div>
            {body.trim() && (
              <>
                <p className="mt-3 mb-1 text-[13px] font-medium text-[#5f6368]">{c.doneTextLabel}</p>
                <p className="m-0 max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-[#00695c] px-3 py-2 text-[15px] text-white">{body}</p>
              </>
            )}
          </section>
        </DoneBlock>
      ) : (
        <div className="@container min-h-0 flex-1 overflow-y-auto p-5">
          {/* Stacks by the window's width, not the screen's: at 150% zoom
              the screen still reads as wide while the window is narrow. */}
          <div className="mx-auto flex max-w-[900px] flex-col-reverse gap-4 @3xl:flex-row @3xl:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <h2 className="text-[20px] font-medium">
              {c.sheetDay} · {PROVIDER}
            </h2>
            {/* The day sheet: every column a real front desk reads before
                booking. Rows are buttons, so picking a time is one click. */}
            <div className="@container overflow-hidden rounded-xl border border-[#dadce0] bg-white" role="table">
              <div role="row" className={`grid ${SHEET_COLS} gap-2 border-b border-[#dadce0] bg-[#f1f3f4] px-4 py-2 text-[12px] font-medium text-[#5f6368]`}>
                <span role="columnheader">{c.colTime}</span>
                <span role="columnheader">{c.colPatient}</span>
                <span role="columnheader" className="hidden @md:block">{c.colVisit}</span>
                <span role="columnheader" data-showme="status-header">{c.colStatus}</span>
              </div>
              {SLOTS.map((s) => {
                const selected = slot === s.time;
                const open = s.status === "open";
                return (
                  <button
                    key={s.time}
                    type="button"
                    role="row"
                    data-showme={s.time === REQUESTED_SLOT ? "requested-slot" : undefined}
                    onClick={() => pick(s.time, s.taken, s.name, s.status)}
                    className={`grid w-full ${SHEET_COLS} items-center gap-2 border-b border-[#eee] px-4 py-2 text-left text-[14px] cursor-pointer last:border-b-0 ${
                      selected ? "bg-[#e0f2f1] ring-2 ring-inset ring-[#00695c]" : s.status === "blocked" ? "bg-[repeating-linear-gradient(135deg,#f8f9fa_0_6px,#eceff1_6px_12px)]" : "hover:bg-[#f8f9fa]"
                    }`}
                  >
                    <span className="font-medium tabular-nums">{s.time}</span>
                    <span className="truncate">{s.name ?? ""}</span>
                    <span className="hidden truncate text-[#5f6368] @md:block">{s.visit?.[lang] ?? ""}</span>
                    <span className={`whitespace-nowrap ${open ? "font-medium text-[#00695c]" : s.status === "blocked" ? "text-[#b3261e]" : "text-[#5f6368]"}`}>
                      {statusLabel[s.status]}
                    </span>
                  </button>
                );
              })}
            </div>
            <label className="block text-[15px] font-medium">
              {c.reasonLabel}
              <select
                value={conflict}
                data-showme="reason-select"
                onChange={(e) => chooseReason(e.target.value)}
                className="mt-2 block min-h-11 w-full rounded border bg-white p-2 font-normal"
              >
                <option value="">{c.chooseReason}</option>
                {CONFLICT_OPTIONS.map((o) => <option key={o.key} value={o.key}>{o.label[lang]}</option>)}
              </select>
            </label>
            {!compose ? (
              <button
                type="button"
                data-showme="offer-button"
                onClick={tryOffer}
                className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#00695c] px-6 text-[15px] font-medium text-white cursor-pointer"
              >
                {c.offerCta}
              </button>
            ) : (
              <div className="rounded-xl border border-[#dadce0] bg-white p-4">
                <div className="text-[13px] font-medium text-[#5f6368]">{c.confirmHeading}</div>
                <textarea
                  ref={composeRef}
                  value={body}
                  data-showme="confirm-body"
                  onChange={(e) => setBody(e.target.value)}
                  placeholder={c.writeHere}
                  className="mt-2 min-h-[110px] w-full resize-y rounded-lg border border-[#dadce0] px-3 py-2 text-[15px] outline-none"
                />
                <NeedAStart lang={lang} starters={APPT_STARTERS[lang]} missed={missed} onPick={(s) => setBody((b) => (b ? `${b} ` : "") + s)} />
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
          <aside className="w-full shrink-0 @3xl:sticky @3xl:top-0 @3xl:w-[250px]">
            <PhoneMessageSlip lang={lang} />
          </aside>
          </div>
        </div>
      )}
      <HelpDrawer open={help} onClose={() => setHelp(false)} kicker={c.lessonKicker} lesson={APPT_LESSONS[lang][0]} tipLabel={c.tipLabel} gotItLabel={c.gotIt} />
      <NudgeToast text={nudge} onDismiss={dismiss} />
      <ShowMeHighlight
        targetId={showMe.targetId}
        label={showMe.targetId === "requested-slot" || showMe.targetId === "status-header" ? APPT_LOOK[lang] : SHOW_ME_POINTER[lang]}
        onDismiss={showMe.clear}
      />
    </DeskChrome>
  );
}

/**
 * The pink "While you were out" slip a coworker leaves at a front desk. It
 * holds the request and the number to text back, and it stays beside the day
 * sheet the whole time.
 */
function PhoneMessageSlip({ lang }: { lang: "en" | "es" }) {
  const c = APPOINTMENT_COPY[lang];
  const m = PHONE_MESSAGE;
  const line = (label: string, value: string) => (
    <div className="flex items-baseline gap-2 border-b border-dashed border-[#c98a95] py-1">
      <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-[#8a3b4a]">{label}</span>
      <span className="min-w-0 font-mono text-[14px] text-[#1f1f1f]">{value}</span>
    </div>
  );
  return (
    <div
      data-testid="phone-message-slip"
      className="rotate-[0.6deg] rounded-sm px-4 pb-4 pt-3 shadow-[0_2px_6px_rgba(0,0,0,0.18)]"
      style={{ background: "linear-gradient(180deg, #fde2e6 0%, #fbd3da 100%)" }}
    >
      <p className="m-0 mb-1 text-center text-[13px] font-bold uppercase tracking-[0.12em] text-[#8a3b4a]">{c.slipTitle}</p>
      {line(c.slipCaller, m.caller)}
      {line(c.slipDob, m.dob)}
      {line(c.slipPhone, m.phone)}
      {line(c.slipTime, m.time)}
      <p className="m-0 mt-2 text-[11px] font-bold uppercase tracking-wide text-[#8a3b4a]">{c.slipMessage}</p>
      <p className="m-0 mt-0.5 text-[15px] leading-snug text-[#1f1f1f]" style={{ fontFamily: '"Comic Sans MS", "Segoe Print", cursive' }}>
        {m.message[lang]}
      </p>
      <p className="m-0 mt-2 text-right text-[12px] text-[#5f4b4e]">
        {c.slipTakenBy}: {m.takenBy}
      </p>
    </div>
  );
}

function IntakeDesk() {
  const { markComplete, completedTaskKeys, lang, writing } = useProgress();
  const [done, setDone] = useState(completedTaskKeys.includes("patient-intake"));
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [reason, setReason] = useState("");
  const [filed, setFiled] = useState(false);
  const [reply, setReply] = useState(() => writing['patient-intake']?.fields[0]?.value ?? '');
  const [recipient, setRecipient] = useState(() => {
    const saved = writing['patient-intake'];
    return RECIPIENT_OPTIONS.find((option) => saved && option.label[saved.lang] === saved.fields[1]?.value)?.key ?? '';
  });
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = INTAKE_COPY[lang];

  const tryFile = () => {
    if (!name.trim() || !dob.trim() || !reason.trim()) return say(c.needFields);
    setFiled(true);
  };

  const trySend = () => {
    if (!filed) return say(c.needFields);
    if (!recipientIsAuthorized(recipient)) return say(RECIPIENT_HINT[lang]);
    if (!reply.trim()) return say(c.empty);
    if (/follow-?up|seguimiento/i.test(reply)) return say(c.shared);
    if (!declineIsSafe(reply)) return say(c.weak);
    setDone(true);
    markComplete("patient-intake", "file_intake_do_not_overshare", describeIntake(reply, lang, recipient));
  };

  const restart = () => {
    setDone(false);
    setName("");
    setDob("");
    setReason("");
    setFiled(false);
    setReply("");
    setRecipient("");
  };

  return (
    <DeskChrome clinic={c.clinic}>
      {!done && (
        <RightNowBar
          icon={TASK_ICONS["patient-intake"]}
          stepIndex={!filed ? 0 : recipientIsAuthorized(recipient) ? 2 : 1}
          stepCount={INTAKE_STEPS.length}
          instruction={INTAKE_STEPS[!filed ? 0 : recipientIsAuthorized(recipient) ? 2 : 1]}
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
                  <p className="mb-3 text-[14px]">{VERIFIED_ASSIGNMENT[lang]}</p>
                  <div className="text-[12px] font-medium text-[#2e7d32]">{c.careTeamName}</div>
                  <p className="mt-1 text-[15px]">{c.careTeamAsk}</p>
                </div>
                <div className="rounded-xl border border-[#dadce0] bg-white p-4">
                  <div className="text-[12px] font-medium text-[#5f6368]">{c.coworkerName}</div>
                  <p className="mt-1 text-[15px]">{c.coworkerAsk}</p>
                  <label className="mt-3 block text-[14px]">{RECIPIENT_LABEL[lang]}
                    <select data-testid="intake-recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} className="mt-1 min-h-11 w-full rounded border bg-white px-3">
                      <option value="">{lang === 'en' ? 'Select a recipient' : 'Elige un destinatario'}</option>
                      {RECIPIENT_OPTIONS.map((option) => <option key={option.key} value={option.key}>{option.label[lang]}</option>)}
                    </select>
                  </label>
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
  const [reply, setReply] = useState("");
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = CALL_COPY[lang];

  const trySend = () => {
    if (!reply.trim()) return say(c.empty);
    if (replySharesInfo(reply)) return say(c.shareHint);
    if (replyIsRude(reply)) return say(c.rudeHint);
    if (!replyIsSafe(reply)) return say(c.weak);
    setDone(true);
    markComplete("confidentiality-call", "do_not_confirm_over_the_phone", describeCall(reply, lang));
  };

  const restart = () => {
    setDone(false);
    setReply("");
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
        <DoneBlock kicker={c.sentKicker} tryAgain={c.tryAgain} back={c.backToDesk} onRestart={restart} />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="mx-auto flex max-w-[520px] flex-col gap-4">
            <div className="rounded-2xl bg-[#263238] px-5 py-6 text-white">
              <div className="text-[12px] uppercase tracking-wide text-white/60">{c.ringing}</div>
              <h2 className="mt-1 text-[22px] font-medium">{c.heading}</h2>
              <p className="mt-4 text-[16px] leading-relaxed text-white/90">{c.caller}</p>
            </div>
            <p className="text-[14px] text-[#5f6368]">{c.script}</p>
            <div className="rounded-xl border border-[#dadce0] bg-white p-4">
              <div className="text-[13px] font-medium text-[#5f6368]">{c.pick}</div>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder={c.writeHere}
                className="mt-2 min-h-[110px] w-full resize-y rounded-lg border border-[#dadce0] px-3 py-2 text-[15px] outline-none"
              />
              <NeedAStart lang={lang} starters={CALL_STARTERS[lang]} onPick={(s) => setReply((b) => (b ? `${b} ` : "") + s)} />
              <button
                type="button"
                onClick={trySend}
                className="mt-3 inline-flex min-h-[46px] items-center rounded-full bg-[#00695c] px-5 text-[15px] font-medium text-white cursor-pointer"
              >
                {c.send}
              </button>
            </div>
          </div>
        </div>
      )}
      <HelpDrawer open={help} onClose={() => setHelp(false)} kicker={c.lessonKicker} lesson={CALL_LESSONS[lang][0]} tipLabel={c.tipLabel} gotItLabel={c.gotIt} />
      <NudgeToast text={nudge} onDismiss={dismiss} />
    </DeskChrome>
  );
}
