"use client";

import { useState } from "react";
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
  W4_STATUS_OPTIONS,
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

  const referenceHint = lang === 'en' ? 'Compare the form with Alex’s fictional reference details.' : 'Compara el formulario con los datos ficticios de Alex.';
  const submitW4 = () => {
    if (!practiceFieldsMatch({status: w4Status ?? '', dependents, date})) return say(referenceHint);
    if (!w4Status || dependents.trim() === "") return say(s.needRequired);
    if (!signatureMatches(signature, PRACTICE_PROFILE.name)) return say(s.needSignature);
    if (!dateLooksFilled(date)) return say(s.needRequired);
    markComplete("w4-form", "submit_w4");
  };

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

  return (
    <FormsShell header="Forms">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {!done && (
          <RightNowBar
            icon={TASK_ICONS[active]}
            stepIndex={0}
            steps={RIGHT_NOW_STEPS}
            lang={lang}
            rightNowLabel={RIGHT_NOW_LABEL}
            onHelp={() => setHelp(true)}
          />
        )}

        <div className="mx-auto flex w-full max-w-[640px] flex-col gap-3 px-4 py-6">
          {!done && <article className="rounded-xl border border-[#dadce0] bg-white p-4 text-[14px] leading-relaxed">{PRACTICE_REFERENCE[lang]}</article>}
          {done ? (
            <div className="flex flex-col gap-5">
              <TaskDoneCard kicker={s.sentKicker} />
              <p className="text-[14px] leading-relaxed text-[#444746]">
                {"doneBody" in doneCopy ? doneCopy.doneBody : ""}
              </p>
              <TaskDoneActions
                kicker={s.sentKicker}
                tryAgainLabel={s.tryAgain}
                backToDeskLabel={s.backToDesk}
                onTryAgain={reset}
              />
            </div>
          ) : active === "w4-form" ? (
            <>
              <FormTitleCard title={W4_COPY[lang].formName} description={W4_COPY[lang].blurb} requiredLabel={s.requiredLabel} />
              <QuestionCard label={W4_COPY[lang].nameLabel}>
                <FormInput value={PRACTICE_PROFILE.name} readOnly className="text-[#5f6368]" />
              </QuestionCard>
              <QuestionCard label={W4_COPY[lang].statusLabel} required>
                <Radio options={W4_STATUS_OPTIONS} value={w4Status} onChange={setW4Status} lang={lang} />
              </QuestionCard>
              <QuestionCard label={W4_COPY[lang].dependentsLabel} required>
                <FormInput
                  inputMode="numeric"
                  value={dependents}
                  onChange={(e) => setDependents(e.target.value.replace(/\D/g, ""))}
                  placeholder="0"
                />
                <p className="mt-1 text-[12px] text-[#5f6368]">{W4_COPY[lang].dependentsHint}</p>
              </QuestionCard>
              <QuestionCard label={s.signLabel} required>
                <FormInput value={signature} onChange={(e) => setSignature(e.target.value)} placeholder={PRACTICE_PROFILE.name} />
              </QuestionCard>
              <QuestionCard label={s.dateLabel} required>
                <FormInput value={date} onChange={(e) => setDate(e.target.value)} placeholder={s.datePlaceholder} />
              </QuestionCard>
              <FormSubmitButton onClick={submitW4}>{W4_COPY[lang].submit}</FormSubmitButton>
            </>
          ) : active === "i9-section1" ? (
            <>
              <FormTitleCard title={I9_COPY[lang].formName} description={I9_COPY[lang].blurb} requiredLabel={s.requiredLabel} />
              <QuestionCard label={I9_COPY[lang].nameLabel}>
                <FormInput value={PRACTICE_PROFILE.name} readOnly className="text-[#5f6368]" />
              </QuestionCard>
              <QuestionCard label={I9_COPY[lang].dobLabel} required>
                <FormInput value={dob} onChange={(e) => setDob(e.target.value)} placeholder={s.datePlaceholder} />
              </QuestionCard>
              <QuestionCard label={I9_COPY[lang].addressLabel} required>
                <FormInput value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St, Boston, MA" />
              </QuestionCard>
              <QuestionCard label={I9_COPY[lang].statusLabel} required>
                <Radio options={I9_STATUS_OPTIONS} value={i9Status} onChange={setI9Status} lang={lang} />
              </QuestionCard>
              <QuestionCard label={s.signLabel} required>
                <FormInput value={signature} onChange={(e) => setSignature(e.target.value)} placeholder={PRACTICE_PROFILE.name} />
              </QuestionCard>
              <QuestionCard label={s.dateLabel} required>
                <FormInput value={date} onChange={(e) => setDate(e.target.value)} placeholder={s.datePlaceholder} />
              </QuestionCard>
              <FormSubmitButton onClick={submitI9}>{I9_COPY[lang].submit}</FormSubmitButton>
            </>
          ) : (
            <>
              <FormTitleCard title={DEPOSIT_COPY[lang].formName} description={DEPOSIT_COPY[lang].blurb} requiredLabel={s.requiredLabel} />
              <QuestionCard label={DEPOSIT_COPY[lang].bankLabel} required>
                <FormInput value={bank} onChange={(e) => setBank(e.target.value)} placeholder="Bay State Bank" />
              </QuestionCard>
              <QuestionCard label={DEPOSIT_COPY[lang].routingLabel} required>
                <FormInput
                  inputMode="numeric"
                  value={routing}
                  onChange={(e) => setRouting(e.target.value.replace(/\D/g, "").slice(0, 9))}
                  placeholder="011000015"
                />
                <p className="mt-1 text-[12px] text-[#5f6368]">{DEPOSIT_COPY[lang].routingHint}</p>
              </QuestionCard>
              <QuestionCard label={DEPOSIT_COPY[lang].accountLabel} required>
                <FormInput
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
    </FormsShell>
  );
}
