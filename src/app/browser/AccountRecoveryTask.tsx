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
import { Lock } from "lucide-react";

type View = "signin" | "code-sent" | "code-entry" | "done";

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
      <div className="mb-1 flex items-center justify-between gap-3">
        <h2 className="text-[19px] font-medium">{c.heading}</h2>
      </div>
      <p className="mb-4 text-[14px] text-text-secondary">{c.subhead}</p>

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

      {view === "signin" && (
        <div className="max-w-[380px] rounded-xl border border-border bg-white p-6">
          <div className="mb-5 flex justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-text-secondary">
              <Lock size={22} strokeWidth={2} aria-hidden />
            </span>
          </div>
          <label className="mb-3 block text-[14px] font-medium text-text-primary">
            {c.usernameLabel}
            <input
              type="text"
              readOnly
              value="you@harborsidecafe.com"
              className="mt-1.5 block w-full rounded-lg border border-border bg-surface-muted px-3 py-2.5 text-[14px] text-text-secondary outline-none"
            />
          </label>
          <label className="mb-4 block text-[14px] font-medium text-text-primary">
            {c.passwordLabel}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={c.passwordPlaceholder}
              className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2.5 text-[14px] outline-none placeholder:text-text-tertiary focus:border-accent"
            />
          </label>
          <button
            onClick={trySignIn}
            className="inline-flex min-h-[46px] w-full items-center justify-center rounded-full bg-accent px-6 text-[15px] font-medium text-white hover:bg-accent-hover cursor-pointer"
          >
            {c.signIn}
          </button>
        </div>
      )}

      {(view === "code-sent" || view === "code-entry") && (
        <div className="max-w-[420px] rounded-xl border border-border bg-white p-6">
          <div className="mb-1 text-[16px] font-medium text-text-primary">{c.codeSentTitle}</div>
          <p className="mb-4 text-[14px] text-text-secondary">{c.codeSentBody}</p>

          {view === "code-sent" && (
            <button
              onClick={() => setPicker(true)}
              className="inline-flex min-h-[44px] items-center rounded-full border border-border px-5 text-[14px] font-medium text-text-primary hover:bg-surface-muted cursor-pointer"
            >
              {c.findCodeBtn}
            </button>
          )}

          {view === "code-entry" && (
            <>
              <label className="mb-4 block text-[14px] font-medium text-text-primary">
                {c.codeLabel}
                <input
                  type="text"
                  inputMode="numeric"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder={c.codePlaceholder}
                  className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2.5 text-[16px] tracking-[0.2em] outline-none placeholder:tracking-normal placeholder:text-text-tertiary focus:border-accent"
                />
              </label>
              <button
                onClick={trySubmitCode}
                className="inline-flex min-h-[46px] w-full items-center justify-center rounded-full bg-accent px-6 text-[15px] font-medium text-white hover:bg-accent-hover cursor-pointer"
              >
                {c.submitCode}
              </button>
            </>
          )}
        </div>
      )}

      {view === "done" && (
        <div className="flex flex-col gap-5">
          <TaskDoneCard
            kicker={c.sentKicker}
            title={firstPersonSkill("account-recovery")}
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
