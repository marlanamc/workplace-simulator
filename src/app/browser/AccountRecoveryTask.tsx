"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@/lib/progress-context";
import { useLesson } from "@/lib/lesson-context";
import { useJobCard } from "@/lib/job-card-context";
import { useLiveClock } from "@/components/LiveClock";
import { useSkillGuidance } from "@/lib/use-skill-guidance";
import { SHOW_ME_POINTER, useShowMe } from "@/lib/use-show-me";
import {
  RECOVERY_COPY,
  TEXTS,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
  LESSON_FIRST_STEP,
  LESSON_PASSWORD,
  HELP_LESSON,
  checkCode,
} from "@/lib/tasks/account-recovery/content";
import { TASK_ICONS } from "@/lib/icons";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import PhoneTexts from "@/components/task/PhoneTexts";
import ShowMeHighlight from "@/components/task/ShowMeHighlight";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";
import { firstPersonSkill } from "@/lib/skills";

type View = "signin" | "code" | "done";

/** The Google wordmark, as on the sign-in page students meet on a school Chromebook. */
function GoogleWord() {
  return (
    <div aria-label="Google" className="select-none text-[30px] font-medium leading-none tracking-[-1px]">
      <span className="text-[#4285f4]">G</span>
      <span className="text-[#ea4335]">o</span>
      <span className="text-[#fbbc05]">o</span>
      <span className="text-[#4285f4]">g</span>
      <span className="text-[#34a853]">l</span>
      <span className="text-[#ea4335]">e</span>
    </div>
  );
}

/**
 * Which control each step's Show me points at. The choice step points at the
 * whole phone, the evidence, never at the right text.
 */
const SHOW_ME_IDS = ["password-field", "phone", "code-field"] as const;

export default function AccountRecoveryTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  // A lesson gives the password on the info card, so it can check it. Story
  // mode has no card, so any password gets through there.
  const lesson = useLesson();
  const [view, setView] = useState<View>(completedTaskKeys.includes("account-recovery") ? "done" : "signin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [chosenText, setChosenText] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState("");
  const [help, setHelp] = useState(false);
  const { nudge, dismiss, recordWrong, recordClean, recordMissed, wrongCount } = useSkillGuidance("account-recovery");
  const showMe = useShowMe();
  const { clearCorrection } = useJobCard();
  // The phone's status bar shows the same time as the taskbar clock.
  const phoneTime = useLiveClock(lang).time.split(" ")[0];
  const passwordRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  // Keyboard users land in the box they need, not ten Tabs away behind the
  // window buttons. A DOM sync with the page that just opened.
  useEffect(() => {
    if (view === "signin") passwordRef.current?.focus();
    else if (view === "code") codeRef.current?.focus();
  }, [view]);

  const c = RECOVERY_COPY[lang];
  // The code text stays on the phone once it has arrived, so the learner can
  // read it again while typing. Choosing it is step 2; typing it is step 3.
  const stepIndex = view === "signin" ? 0 : chosenText ? 2 : 1;
  const steps = lesson ? [LESSON_FIRST_STEP, ...RIGHT_NOW_STEPS.slice(1)] : RIGHT_NOW_STEPS;

  const trySignIn = () => {
    showMe.clear();
    if (!password.trim()) {
      recordWrong({ title: lang === "en" ? "Almost." : "Casi.", body: c.emptyPassword });
      return;
    }
    if (lesson && password.trim() !== LESSON_PASSWORD) {
      recordWrong({ title: lang === "en" ? "Not quite." : "No es así.", body: c.wrongPassword });
      return;
    }
    setView("code");
  };

  const tapText = (key: string) => {
    showMe.clear();
    const text = TEXTS.find((t) => t.key === key);
    if (!text) return;
    if (text.isTarget) {
      setChosenText(key);
      dismiss();
      requestAnimationFrame(() => codeRef.current?.focus());
    } else if (text.wrongHint) {
      recordWrong({ title: lang === "en" ? "Not that one." : "Ese no es.", body: text.wrongHint[lang] });
    }
  };

  const trySubmitCode = () => {
    showMe.clear();
    const result = checkCode(codeInput);
    if (result === "empty") {
      recordWrong({ title: lang === "en" ? "Almost." : "Casi.", body: c.emptyCode });
      return;
    }
    if (result === "fake") {
      recordWrong({ title: lang === "en" ? "Careful." : "Cuidado.", body: c.fakeCode });
      return;
    }
    if (result === "wrong") {
      recordWrong({ title: lang === "en" ? "Not quite." : "No es así.", body: c.wrongCode });
      return;
    }
    if (wrongCount === 0) recordClean();
    else recordMissed();
    setView("done");
    markComplete("account-recovery", "account_recovery");
  };

  const restart = () => {
    setView("signin");
    setPassword("");
    setShowPassword(false);
    setChosenText(null);
    setCodeInput("");
  };

  const selectedText = TEXTS.find((text) => text.key === chosenText);

  const phoneTexts =
    view === "signin"
      ? []
      : TEXTS.map((t) => ({ key: t.key, from: t.from, body: t.body[lang], when: t.when[lang] }));

  return (
    <div className="relative h-full overflow-y-auto">
      {/* The page is the sign-in screen itself; its title is the page's heading. */}
      <h2 className="sr-only">{c.heading}</h2>

      {view !== "done" && (
        <RightNowBar
          icon={TASK_ICONS["account-recovery"]}
          stepIndex={stepIndex}
          steps={steps}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onShowMe={() => showMe.toggleFor(SHOW_ME_IDS[stepIndex])}
          showMeActive={showMe.targetId === SHOW_ME_IDS[stepIndex]}
          onHelp={() => setHelp(true)}
        />
      )}

      {/* Container queries on the window's own width: browser zoom keeps the
          viewport breakpoints wide, so at 150% text the phone must still sit
          beside the form, where the code stays in view while it is typed. */}
      {view !== "done" && (
        <div className="@container">
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-[#f0f4f9] px-3 py-4 @min-[520px]:flex-row @min-[520px]:items-start @min-[520px]:justify-center @min-[640px]:gap-6 @min-[640px]:px-4 @min-[900px]:py-8">
          <div className="w-full min-w-0 max-w-[460px] rounded-[28px] bg-white px-6 pt-6 pb-6 @min-[520px]:flex-1 @min-[900px]:px-10 @min-[900px]:pt-9 @min-[900px]:pb-8">
            <GoogleWord />
            {view === "signin" ? (
              <>
                <h3 className="m-0 mt-3 text-[32px] font-normal leading-tight text-[#1f1f1f]">{c.signInTitle}</h3>
                <p className="mt-2 mb-5 text-[16px] text-[#1f1f1f]">{c.continueTo}</p>
                <div
                  aria-label={c.usernameLabel}
                  className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-[#747775] py-0.5 pr-3 pl-0.5 text-[14px] font-medium text-[#1f1f1f]"
                >
                  <span aria-hidden className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1e8e3e] text-[13px] text-white">Y</span>
                  <span className="truncate">you@harborsidecafe.com</span>
                </div>
                <label className="block text-[14px] font-medium text-[#444746]">
                  {c.passwordLabel}
                  <input
                    type={showPassword ? "text" : "password"}
                    ref={passwordRef}
                    data-showme="password-field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") trySignIn(); }}
                    placeholder={c.passwordPlaceholder}
                    autoComplete="off"
                    className="mt-1.5 block min-h-14 w-full rounded-[4px] border border-[#747775] px-3.5 text-[17px] font-normal text-[#1f1f1f] outline-none placeholder:text-[#747775] focus:border-2 focus:border-[#0b57d0]"
                  />
                </label>
                <label className="mt-3 flex min-h-11 cursor-pointer items-center gap-3 text-[15px] text-[#1f1f1f]">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="h-5 w-5 accent-[#0b57d0]"
                  />
                  {c.showPassword}
                </label>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={trySignIn}
                    className="inline-flex min-h-10 cursor-pointer items-center rounded-full bg-[#0b57d0] px-6 text-[14px] font-medium text-white hover:bg-[#0842a0]"
                  >
                    {c.signIn}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="m-0 mt-3 text-[32px] font-normal leading-tight text-[#1f1f1f]">{c.verifyTitle}</h3>
                <p className="mt-2 mb-1 text-[16px] font-medium text-[#1f1f1f]">{c.codeSentTitle}</p>
                <p className="mt-0 mb-5 text-[15px] leading-relaxed text-[#444746]">{c.codeSentBody}</p>
                <div className={selectedText ? "grid grid-cols-2 items-start gap-3 @min-[520px]:block" : undefined}>
                {selectedText && (
                  <blockquote data-testid="selected-phone-message" className="m-0 rounded-lg border border-[#dadce0] bg-[#e8f0fe] p-2 text-[13px] leading-snug @min-[520px]:hidden">
                    <strong className="block">{selectedText.from}</strong>
                    {selectedText.body[lang]}
                  </blockquote>
                )}
                <label className="block text-[14px] font-medium text-[#444746]">
                  {c.codeLabel}
                  <input
                    type="text"
                    inputMode="numeric"
                    ref={codeRef}
                    data-showme="code-field"
                    value={codeInput}
                    // A correction about a text ("That text is fake") is done
                    // once the learner starts on the code, keyboard or not.
                    onFocus={clearCorrection}
                    onChange={(e) => {
                      setCodeInput(e.target.value);
                      clearCorrection();
                    }}
                    onKeyDown={(e) => { if (e.key === "Enter") trySubmitCode(); }}
                    placeholder={c.codePlaceholder}
                    autoComplete="one-time-code"
                    className="mt-1.5 block min-h-14 w-full rounded-[4px] border border-[#747775] px-3.5 text-[18px] font-normal tracking-[0.2em] text-[#1f1f1f] outline-none placeholder:tracking-normal placeholder:text-[#747775] focus:border-2 focus:border-[#0b57d0]"
                  />
                </label>
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={trySubmitCode}
                    className="inline-flex min-h-10 cursor-pointer items-center rounded-full bg-[#0b57d0] px-6 text-[14px] font-medium text-white hover:bg-[#0842a0]"
                  >
                    {c.submitCode}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Stacked (a narrow window), the phone comes first once the code
              has arrived, so the texts are read before the code box. */}
          <aside
            data-showme="phone"
            className={`w-full shrink-0 @min-[520px]:order-none @min-[520px]:w-[240px] ${view === "code" ? "order-first" : ""}`}
          >
            <PhoneTexts
              heading={c.phoneHeading}
              emptyLabel={c.phoneEmpty}
              label={c.phoneLabel}
              texts={phoneTexts}
              chosenKey={chosenText}
              onTap={tapText}
              time={phoneTime}
            />
          </aside>
        </div>
        </div>
      )}

      {view === "done" && (
        <div className="flex flex-col gap-5">
          <TaskDoneCard
            kicker={c.sentKicker}
            title={firstPersonSkill("account-recovery", lang)}
            body={c.doneBody}
            badgeNumber="10"
            badgeName={c.badgeName}
            badgeWhere={c.badgeWhere}
          />
          <TaskDoneActions kicker={c.sentKicker} tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
        </div>
      )}

      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={lang === "en" ? "2-minute lesson" : "Lección de 2 minutos"}
        lesson={HELP_LESSON[lang]}
        tipLabel={lang === "en" ? "Tip" : "Consejo"}
        gotItLabel={lang === "en" ? "Got it. Back to my task" : "Entendido. Volver a mi tarea"}
      />

      <NudgeToast text={nudge} onDismiss={dismiss} />
      <ShowMeHighlight targetId={showMe.targetId} label={SHOW_ME_POINTER[lang]} onDismiss={showMe.clear} />
    </div>
  );
}
