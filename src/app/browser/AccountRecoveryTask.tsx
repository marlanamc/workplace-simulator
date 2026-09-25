"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import { useSkillGuidance } from "@/lib/use-skill-guidance";
import {
  RECOVERY_COPY,
  TEXTS,
  CODE,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
} from "@/lib/tasks/account-recovery/content";
import { TASK_ICONS } from "@/lib/icons";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import PickerModal from "@/components/task/PickerModal";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";
import { firstPersonSkill } from "@/lib/skills";

type View = "signin" | "code-sent" | "code-entry" | "done";

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

export default function AccountRecoveryTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("account-recovery") ? "done" : "signin");
  const [password, setPassword] = useState("");
  const [picker, setPicker] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [help, setHelp] = useState(false);
  const { nudge, dismiss, recordWrong, recordClean, recordMissed, wrongCount } = useSkillGuidance("account-recovery");

  const c = RECOVERY_COPY[lang];

  const trySignIn = () => {
    if (!password.trim()) {
      recordWrong({
        title: lang === "en" ? "Almost." : "Casi.",
        body: lang === "en" ? "Type your password to sign in." : "Escribe tu contraseña para iniciar sesión.",
      });
      return;
    }
    setView("code-sent");
  };

  const trySubmitCode = () => {
    if (codeInput.trim() !== CODE) {
      recordWrong({
        title: lang === "en" ? "Not quite." : "No es así.",
        body: c.wrongCode,
      });
      return;
    }
    const cleanRun = wrongCount === 0;
    if (cleanRun) {
      recordClean();
    } else {
      recordMissed();
    }
    setView("done");
    markComplete("account-recovery", "account_recovery");
  };

  const restart = () => {
    setView("signin");
    setPassword("");
    setCodeInput("");
  };

  return (
    <div className="relative">
      {/* The page is the sign-in screen itself; its title is the page's heading. */}
      <h2 className="sr-only">{c.heading}</h2>

      {view !== "done" && (
        <RightNowBar
          icon={TASK_ICONS["account-recovery"]}
          stepIndex={view === "signin" ? 0 : view === "code-sent" ? 1 : 2}
          stepCount={RIGHT_NOW_STEPS.length}
          instruction={RIGHT_NOW_STEPS[view === "signin" ? 0 : view === "code-sent" ? 1 : 2]}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onHelp={() => setHelp(true)}
        />
      )}

      {view !== "done" && (
        <div className="flex justify-center rounded-2xl bg-[#f0f4f9] px-4 py-8">
          <div className="w-full max-w-[460px] rounded-[28px] bg-white px-8 pt-9 pb-8 sm:px-10">
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
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") trySignIn(); }}
                    placeholder={c.passwordPlaceholder}
                    className="mt-1.5 block min-h-14 w-full rounded-[4px] border border-[#747775] px-3.5 text-[17px] font-normal text-[#1f1f1f] outline-none placeholder:text-[#747775] focus:border-2 focus:border-[#0b57d0]"
                  />
                </label>
                <div className="mt-8 flex justify-end">
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
                {view === "code-sent" ? (
                  <button
                    onClick={() => setPicker(true)}
                    className="inline-flex min-h-10 cursor-pointer items-center rounded-full border border-[#747775] px-5 text-[14px] font-medium text-[#0b57d0] hover:bg-[#f0f4f9]"
                  >
                    {c.findCodeBtn}
                  </button>
                ) : (
                  <>
                    <label className="block text-[14px] font-medium text-[#444746]">
                      {c.codeLabel}
                      <input
                        type="text"
                        inputMode="numeric"
                        value={codeInput}
                        onChange={(e) => setCodeInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") trySubmitCode(); }}
                        placeholder={c.codePlaceholder}
                        className="mt-1.5 block min-h-14 w-full rounded-[4px] border border-[#747775] px-3.5 text-[18px] font-normal tracking-[0.2em] text-[#1f1f1f] outline-none placeholder:tracking-normal placeholder:text-[#747775] focus:border-2 focus:border-[#0b57d0]"
                      />
                    </label>
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
              </>
            )}
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

      {picker && (
        <PickerModal
          title={c.pickerTitle}
          categoryLabel={c.categoryLabel}
          columnLabels={[c.columnLabel]}
          items={TEXTS}
          onCancel={() => setPicker(false)}
          cancelLabel={c.cancel}
          onSelect={(item) => {
            if (item.isTarget) {
              setPicker(false);
              setView("code-entry");
            } else if (item.wrongHint) {
              recordWrong({ title: lang === "en" ? "Not that one." : "Ese no es.", body: item.wrongHint[lang] });
            }
          }}
        />
      )}

      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={lang === "en" ? "2-minute lesson" : "Lección de 2 minutos"}
        lesson={{
          t: lang === "en" ? "Getting back into a locked account" : "Volver a entrar a una cuenta bloqueada",
          s: lang === "en"
            ? ["Sign in with your password like always.", "Wait for a text with a code - it takes a few seconds.", "Find the real code in your texts. Ads and other messages are not it.", "Type the digits exactly as they appear."]
            : ["Inicia sesión con tu contraseña como siempre.", "Espera un mensaje de texto con un código - tarda unos segundos.", "Busca el código real en tus mensajes. Los anuncios y otros mensajes no lo son.", "Escribe los dígitos exactamente como aparecen."],
          tip: lang === "en" ? "This happens to everyone. It is not a mistake - it is just how work accounts keep you safe." : "Esto le pasa a cualquiera. No es un error - así es como las cuentas de trabajo te mantienen seguro.",
        }}
        tipLabel={lang === "en" ? "Tip" : "Consejo"}
        gotItLabel={lang === "en" ? "Got it. Back to my task" : "Entendido. Volver a mi tarea"}
      />

      <NudgeToast text={nudge} onDismiss={dismiss} />
    </div>
  );
}
