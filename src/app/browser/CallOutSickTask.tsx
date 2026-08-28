"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import { useSkillGuidance } from "@/lib/use-skill-guidance";
import {
  CALL_OUT_COPY,
  STARTERS,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
} from "@/lib/tasks/call-out-sick/content";
import { TASK_ICONS } from "@/lib/icons";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import AppHeaderTools from "@/components/task/AppHeaderTools";
import RightNowBar from "@/components/task/RightNowBar";
import ShowMeHighlight from "@/components/task/ShowMeHighlight";
import { useShowMe, SHOW_ME_POINTER } from "@/lib/use-show-me";
import NeedAStart from "@/components/task/NeedAStart";
import { firstPersonSkill } from "@/lib/skills";

type View = "compose" | "done";

export default function CallOutSickTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("call-out-sick") ? "done" : "compose");
  const [body, setBody] = useState("");
  const [help, setHelp] = useState(false);
  const { nudge, dismiss, recordWrong, recordClean, recordMissed, wrongCount } = useSkillGuidance("call-out-sick");
  const showMe = useShowMe();
  // One step, one control: the button that sends the message.
  const showMeId = "send-button";

  const c = CALL_OUT_COPY[lang];

  const trySend = () => {
    if (body.trim().length < 8) {
      recordWrong({
        title: lang === "en" ? "Almost." : "Casi.",
        body: lang === "en"
          ? "Say that you're sick and can't come in tomorrow. A sentence starter can help."
          : "Di que estás enfermo y que no puedes ir mañana. Una frase de ayuda puede servir.",
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
    markComplete("call-out-sick", "call_out_in_writing");
  };

  const restart = () => {
    setView("compose");
    setBody("");
  };

  return (
    <div className="relative">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h2 className="text-[19px] font-medium">{c.heading}</h2>
        <AppHeaderTools helpLabel={c.helpBtn} onHelp={() => setHelp(true)} />
      </div>
      <p className="mb-4 text-[14px] text-[var(--text-secondary)]">{c.subhead}</p>

      {view !== "done" && (
        <RightNowBar
          icon={TASK_ICONS["call-out-sick"]}
          stepIndex={0}
          stepCount={RIGHT_NOW_STEPS.length}
          instruction={RIGHT_NOW_STEPS[0]}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onShowMe={() => showMe.toggleFor(showMeId)}
          showMeActive={showMe.targetId === showMeId}
          onHelp={() => setHelp(true)}
        />
      )}

      {view === "compose" && (
        <div className="max-w-[560px] overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[0_1px_3px_rgba(60,64,67,.15)]">
          <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-2.5 text-[13px]">
            <span className="w-14 shrink-0 text-[var(--text-tertiary)]">{c.to}</span>
            <span>maria.delgado@harborsidecafe.com</span>
          </div>
          <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-2.5 text-[13px]">
            <span className="w-14 shrink-0 text-[var(--text-tertiary)]">{c.subjectLabel}</span>
            <span>{c.subject}</span>
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={c.writeHere}
            className="min-h-[130px] w-full resize-y border-none px-4 py-3 text-[14px] leading-relaxed outline-none placeholder:text-[var(--text-tertiary)]"
          />
          <div className="flex flex-wrap items-center gap-2 px-4 pb-3">
            <NeedAStart
              lang={lang}
              starters={STARTERS[lang]}
              onPick={(s) => setBody((b) => (b ? b + " " : "") + s)}
            />
          </div>
          <div className="flex items-center gap-1 border-t border-[var(--border)] px-3 py-2.5">
            <button
              data-showme="send-button"
              onClick={trySend}
              className="inline-flex min-h-[40px] items-center rounded-full bg-[var(--accent)] px-6 text-[14px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
            >
              {c.send}
            </button>
          </div>
        </div>
      )}

      {view === "done" && (
        <div className="flex flex-col gap-5">
          <TaskDoneCard
            kicker={c.sentKicker}
            title={firstPersonSkill("call-out-sick")}
            body={c.doneBody}
            badgeNumber="06"
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
        lesson={{
          t: lang === "en" ? "Calling out the right way" : "Avisar de la manera correcta",
          s: lang === "en"
            ? ["Say what's happening: you're sick.", "Say when: tomorrow's shift.", "Send it before your shift starts, not after."]
            : ["Di qué pasa: estás enfermo.", "Di cuándo: el turno de mañana.", "Envíalo antes de que empiece tu turno, no después."],
          tip: lang === "en" ? "Short is fine. Maria just needs to know in time to find coverage." : "Corto está bien. Maria solo necesita saber a tiempo para buscar quién te cubra.",
        }}
        tipLabel={lang === "en" ? "Tip" : "Consejo"}
        gotItLabel={lang === "en" ? "Got it. Back to my task" : "Entendido. Volver a mi tarea"}
      />

      <NudgeToast text={nudge} onDismiss={dismiss} />
      <ShowMeHighlight targetId={showMe.targetId} label={SHOW_ME_POINTER[lang]} onDismiss={showMe.clear} />
    </div>
  );
}
