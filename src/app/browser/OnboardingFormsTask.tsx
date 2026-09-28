"use client";

import { useEffect, useRef, useState } from "react";
import ShowMeHighlight from "@/components/task/ShowMeHighlight";
import { SHOW_ME_POINTER, useShowMe } from "@/lib/use-show-me";
import { useJobCardOptional } from "@/lib/job-card-context";
import { W4_STATUS_OPTIONS } from "@/lib/tasks/onboarding-paperwork/content";
import W4Document, { W4DocumentShell } from "./W4Document";
import { useProgress } from "@/lib/progress-context";
import { useWindowManager } from "@/lib/window-manager";
import type { TaskKey } from "@/lib/desktop-content";
import { TASK_ICONS } from "@/lib/icons";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import RightNowBar from "@/components/task/RightNowBar";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import {
  FormsShell,
  FormTitleCard,
  QuestionCard,
  FormInput,
  FormSubmitButton,
} from "@/components/task/FormsShell";
import {
  PAPERWORK_TASK_ORDER,
  PAPERWORK_SHELL,
  W4_COPY,
  I9_COPY,
  I9_STATUS_OPTIONS,
  DEPOSIT_COPY,
  ACCOUNT_TYPE_OPTIONS,
  LESSONS,
  RIGHT_NOW_LABEL,
  RIGHT_NOW_STEPS,
  signatureMatches,
  dateLooksFilled,
  PRACTICE_PROFILE, PRACTICE_REFERENCE, practiceFieldsMatch,
  REFERENCE_HINT, W4_STEPS,
  w4Problem, w4StepIndex, W4_STATUS_WRONG, type W4Field,
  routingIsValid,
} from "@/lib/tasks/onboarding-paperwork/content";

function activeFormFor(completedTaskKeys: TaskKey[]): TaskKey {
  return PAPERWORK_TASK_ORDER.find((k) => !completedTaskKeys.includes(k)) ?? PAPERWORK_TASK_ORDER[PAPERWORK_TASK_ORDER.length - 1];
}

function Radio({
  options,
  value,
  onChange,
  lang,
}: {
  options: { key: string; label: { en: string; es: string } }[];
  value: string | null;
  onChange: (key: string) => void;
  lang: "en" | "es";
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((o) => {
        const on = value === o.key;
        return (
          <button
            key={o.key}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.key)}
            className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-[15px] cursor-pointer ${
              on ? "border-[#673ab7] bg-[#f0ebf8]" : "border-[#dadce0] bg-white hover:bg-[#faf9fd]"
            }`}
          >
            <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${on ? "border-[#673ab7]" : "border-[#9aa0a6]"}`} aria-hidden>
              {on ? <span className="h-2 w-2 rounded-full bg-[#673ab7]" /> : null}
            </span>
            {o.label[lang]}
          </button>
        );
      })}
    </div>
  );
}

export default function OnboardingFormsTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const { browserTabToken } = useWindowManager();

  const [active, setActive] = useState<TaskKey>(() => activeFormFor(completedTaskKeys));
  const [lastToken, setLastToken] = useState(browserTabToken);
  if (browserTabToken !== lastToken) {
    setLastToken(browserTabToken);
    setActive(activeFormFor(completedTaskKeys));
  }

  const done = completedTaskKeys.includes(active);
  const { nudge, say, dismiss } = useNudge();
  const [help, setHelp] = useState(false);

  // shared
  const [signature, setSignature] = useState("");
  const [date, setDate] = useState("");

  // w4
  const [w4Status, setW4Status] = useState<string | null>(null);
  const [dependents, setDependents] = useState("");

  // i9
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [i9Status, setI9Status] = useState<string | null>(null);

  // deposit
  const [bank, setBank] = useState("");
  const [routing, setRouting] = useState("");
  const [account, setAccount] = useState("");
  const [accountType, setAccountType] = useState<string | null>(null);

  const s = PAPERWORK_SHELL[lang];

  const reset = () => {
    setSignature("");
    setDate("");
    setW4Status(null);
    setDependents("");
    setDob("");
    setAddress("");
    setI9Status(null);
    setBank("");
    setRouting("");
    setAccount("");
    setAccountType(null);
  };

  const referenceHint = REFERENCE_HINT[lang];
  const card = useJobCardOptional();
  const showMe = useShowMe();

  // ---- W-4 ----
  const w4Values = { status: w4Status, dependents, signature, date };
  const w4Step = w4StepIndex(w4Values);
  const w4Now = w4Problem(w4Values);
  // Which box the showing correction is about. Typing in a different box
  // makes it stale, and typing raises no pointer press to clear it.
  const [correctionField, setCorrectionField] = useState<W4Field | null>(null);
  const sayAbout = (field: W4Field, message: string) => {
    setCorrectionField(field);
    say(message);
  };
  const editing = (field: W4Field) => {
    if (correctionField && correctionField !== field) {
      card?.clearCorrection();
      setCorrectionField(null);
    }
  };
  // A wrong filing status is corrected right at the field, while it is on screen.
  const chooseW4Status = (key: string) => {
    setW4Status(key);
    const wrong = W4_STATUS_WRONG[key];
    if (wrong) sayAbout("status", wrong[lang]);
    else if (correctionField === "status") {
      card?.clearCorrection();
      setCorrectionField(null);
    }
  };
  const checkW4Field = (field: W4Field) => {
    const problem = w4Problem(w4Values);
    const value = field === "dependents" ? dependents : date;
    if (problem?.field === field && value.trim()) sayAbout(field, problem.hint[lang]);
  };
  // Empty boxes first, then the box that does not match Robin, each by name.
  const submitW4 = () => {
    const problem = w4Problem(w4Values);
    if (problem) return sayAbout(problem.field, problem.hint[lang]);
    markComplete("w4-form", "submit_w4");
  };
  const showMeId =
    w4Step === 0 ? "w4-status" : w4Step === 1 ? "w4-dependents" : w4Now?.field === "date" ? "w4-date" : w4Now ? "w4-sign" : "w4-submit";

  // When a step is done, bring the next box into view: the dependents box
  // and the signature start below the fold. DOM sync only, no state.
  const lastW4Step = useRef(w4Step);
  useEffect(() => {
    if (lastW4Step.current === w4Step) return;
    const forward = w4Step > lastW4Step.current;
    lastW4Step.current = w4Step;
    if (!forward || active !== "w4-form") return;
    const id = w4Step === 1 ? "w4-dependents" : "w4-sign";
    const el = document.querySelector<HTMLElement>(`[data-showme="${id}"]`);
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
    el?.focus({ preventScroll: true });
  }, [w4Step, active]);

  const submitI9 = () => {
    if (!practiceFieldsMatch({dob, address, workStatus: i9Status ?? '', date})) return say(referenceHint);
    if (!dob.trim() || !address.trim() || !i9Status) return say(s.needRequired);
    if (!signatureMatches(signature, PRACTICE_PROFILE.name)) return say(s.needSignature);
    if (!dateLooksFilled(date)) return say(s.needRequired);
    markComplete("i9-section1", "submit_i9");
  };

  const submitDeposit = () => {
    if (!practiceFieldsMatch({bank, routing, account, accountType: accountType ?? ''})) return say(referenceHint);
    if (!bank.trim() || !account.trim() || !accountType) return say(s.needRequired);
    if (!routingIsValid(routing)) return say(s.needRouting);
    markComplete("direct-deposit", "submit_direct_deposit");
  };

  const doneCopy =
    active === "w4-form" ? W4_COPY[lang] : active === "i9-section1" ? I9_COPY[lang] : DEPOSIT_COPY[lang];

  const Shell = active === "w4-form" ? W4DocumentShell : FormsShell;

  return (
    <Shell lang={lang}>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {!done && (
          <RightNowBar
            icon={TASK_ICONS[active]}
            stepIndex={active === "w4-form" ? w4Step : 0}
            steps={active === "w4-form" ? W4_STEPS : RIGHT_NOW_STEPS}
            lang={lang}
            rightNowLabel={RIGHT_NOW_LABEL}
            onShowMe={active === "w4-form" ? () => showMe.toggleFor(showMeId) : undefined}
            showMeActive={active === "w4-form" && showMe.targetId === showMeId}
            onHelp={() => setHelp(true)}
          />
        )}

        <div className={`mx-auto flex w-full flex-col gap-3 px-4 py-6 ${active === "w4-form" ? "max-w-[840px]" : "max-w-[640px]"}`}>
          {!done && active !== "w4-form" && <article className="rounded-xl border border-[#dadce0] bg-white p-4 text-[14px] leading-relaxed">{PRACTICE_REFERENCE[lang]}</article>}
          {done ? (
            <div className="flex flex-col gap-5">
              <TaskDoneCard kicker={s.sentKicker} />
              <p className="text-[14px] leading-relaxed text-[#444746]">
                {"doneBody" in doneCopy ? doneCopy.doneBody : ""}
              </p>
              {active === "w4-form" && (
                // What was sent, so the finish shows the form, not just a stamp.
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 rounded border border-[#b8bcc1] bg-white p-4 text-[14px]">
                  <dt className="font-semibold">{W4_COPY[lang].nameLabel}</dt><dd>{PRACTICE_PROFILE.name}</dd>
                  <dt className="font-semibold">{W4_COPY[lang].statusLabel}</dt>
                  <dd>{W4_STATUS_OPTIONS.find((o) => o.key === (w4Status ?? PRACTICE_PROFILE.status))?.label[lang]}</dd>
                  <dt className="font-semibold">{W4_COPY[lang].dependentsShort}</dt><dd>{dependents.trim() || PRACTICE_PROFILE.dependents}</dd>
                  <dt className="font-semibold">{s.signShort}</dt><dd className="font-serif italic">{signature || PRACTICE_PROFILE.name}</dd>
                  <dt className="font-semibold">{s.dateLabel}</dt><dd>{date || PRACTICE_PROFILE.date}</dd>
                </dl>
              )}
              <TaskDoneActions
                kicker={s.sentKicker}
                tryAgainLabel={s.tryAgain}
                backToDeskLabel={s.backToDesk}
                onTryAgain={reset}
              />
            </div>
          ) : active === "w4-form" ? (
            <W4Document
              lang={lang}
              status={w4Status} onStatus={chooseW4Status}
              dependents={dependents} onDependents={(v) => { editing("dependents"); setDependents(v); }}
              onDependentsBlur={() => checkW4Field("dependents")}
              signature={signature} onSignature={(v) => { editing("signature"); setSignature(v); }}
              date={date} onDate={(v) => { editing("date"); setDate(v); }}
              onDateBlur={() => checkW4Field("date")}
              onSubmit={submitW4}
            />
          ) : active === "i9-section1" ? (
            <>
              <FormTitleCard title={I9_COPY[lang].formName} description={I9_COPY[lang].blurb} requiredLabel={s.requiredLabel} />
              <QuestionCard label={I9_COPY[lang].nameLabel}>
                <FormInput aria-label={I9_COPY[lang].nameLabel} value={PRACTICE_PROFILE.name} readOnly className="text-[#5f6368]" />
              </QuestionCard>
              <QuestionCard label={I9_COPY[lang].dobLabel} required>
                <FormInput aria-label={I9_COPY[lang].dobLabel} value={dob} onChange={(e) => setDob(e.target.value)} placeholder={s.datePlaceholder} />
              </QuestionCard>
              <QuestionCard label={I9_COPY[lang].addressLabel} required>
                <FormInput aria-label={I9_COPY[lang].addressLabel} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St, Boston, MA" />
              </QuestionCard>
              <QuestionCard label={I9_COPY[lang].statusLabel} required>
                <Radio options={I9_STATUS_OPTIONS} value={i9Status} onChange={setI9Status} lang={lang} />
              </QuestionCard>
              <QuestionCard label={s.signLabel} required>
                <FormInput aria-label={s.signLabel} value={signature} onChange={(e) => setSignature(e.target.value)} placeholder={s.signPlaceholder} />
              </QuestionCard>
              <QuestionCard label={s.dateLabel} required>
                <FormInput aria-label={s.dateLabel} value={date} onChange={(e) => setDate(e.target.value)} placeholder={s.datePlaceholder} />
              </QuestionCard>
              <FormSubmitButton onClick={submitI9}>{I9_COPY[lang].submit}</FormSubmitButton>
            </>
          ) : (
            <>
              <FormTitleCard title={DEPOSIT_COPY[lang].formName} description={DEPOSIT_COPY[lang].blurb} requiredLabel={s.requiredLabel} />
              <QuestionCard label={DEPOSIT_COPY[lang].bankLabel} required>
                <FormInput aria-label={DEPOSIT_COPY[lang].bankLabel} value={bank} onChange={(e) => setBank(e.target.value)} placeholder="Bay State Bank" />
              </QuestionCard>
              <QuestionCard label={DEPOSIT_COPY[lang].routingLabel} required>
                <FormInput
                  aria-label={DEPOSIT_COPY[lang].routingLabel}
                  inputMode="numeric"
                  value={routing}
                  onChange={(e) => setRouting(e.target.value.replace(/\D/g, "").slice(0, 9))}
                  placeholder="011000015"
                />
                <p className="mt-1 text-[12px] text-[#5f6368]">{DEPOSIT_COPY[lang].routingHint}</p>
              </QuestionCard>
              <QuestionCard label={DEPOSIT_COPY[lang].accountLabel} required>
                <FormInput
                  aria-label={DEPOSIT_COPY[lang].accountLabel}
                  inputMode="numeric"
                  value={account}
                  onChange={(e) => setAccount(e.target.value.replace(/\D/g, ""))}
                  placeholder="000123456789"
                />
              </QuestionCard>
              <QuestionCard label={DEPOSIT_COPY[lang].accountTypeLabel} required>
                <Radio options={ACCOUNT_TYPE_OPTIONS} value={accountType} onChange={setAccountType} lang={lang} />
              </QuestionCard>
              <FormSubmitButton onClick={submitDeposit}>{DEPOSIT_COPY[lang].submit}</FormSubmitButton>
            </>
          )}
        </div>
      </div>

      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={s.lessonKicker}
        lesson={LESSONS[active][lang]}
        tipLabel={s.tipLabel}
        gotItLabel={s.gotIt}
      />
      <NudgeToast text={nudge} onDismiss={dismiss} />
      <ShowMeHighlight targetId={showMe.targetId} label={SHOW_ME_POINTER[lang]} onDismiss={showMe.clear} />
    </Shell>
  );
}
