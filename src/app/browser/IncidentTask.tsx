"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  INCIDENT_COPY,
  DEFAULTS,
  STARTERS,
  LESSONS,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
} from "@/lib/tasks/incident/content";
import { useNudge } from "@/lib/use-nudge";
import { TASK_ICONS } from "@/lib/icons";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";
import NeedAStart from "@/components/task/NeedAStart";
import {
  FormsShell,
  FormTitleCard,
  QuestionCard,
  FormInput,
  FormTextarea,
  FormSubmitButton,
} from "@/components/task/FormsShell";

type View = "form" | "done";

export default function IncidentTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("incident") ? "done" : "form");
  const [when, setWhen] = useState(DEFAULTS.en.when);
  const [where, setWhere] = useState(DEFAULTS.en.where);
  const [what, setWhat] = useState("");
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();

  const c = INCIDENT_COPY[lang];

  const trySubmit = () => {
    if (!when.trim() || !where.trim()) {
      return say(
        lang === "en"
          ? "Fill in when and where it happened before you submit."
          : "Completa cuándo y dónde pasó antes de enviar."
      );
    }
    if (what.trim().length < 15) {
      return say(
        lang === "en"
          ? "Write a sentence or two about what happened, in order."
          : "Escribe una o dos oraciones sobre qué pasó, en orden."
      );
    }
    setView("done");
    markComplete("incident", "write_incident_report");
  };

  const restart = () => {
    setView("form");
    setWhen(DEFAULTS[lang].when);
    setWhere(DEFAULTS[lang].where);
    setWhat("");
  };

  return (
    <FormsShell>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {view !== "done" && (
          <RightNowBar
            icon={TASK_ICONS.incident}
            stepIndex={0}
            stepCount={RIGHT_NOW_STEPS.length}
            instruction={RIGHT_NOW_STEPS[0]}
            lang={lang}
            rightNowLabel={RIGHT_NOW_LABEL}
            onHelp={() => setHelp(true)}
          />
        )}

        {view === "form" && (
          <div className="mx-auto flex w-full max-w-[640px] flex-col gap-3 px-4 py-6">
            <FormTitleCard
              title={c.heading}
              description={c.scenario}
              requiredLabel={lang === "en" ? "Required" : "Obligatorio"}
            />

            <QuestionCard label={c.whenLabel} required>
              <FormInput value={when} onChange={(e) => setWhen(e.target.value)} />
            </QuestionCard>

            <QuestionCard label={c.whereLabel} required>
              <FormInput value={where} onChange={(e) => setWhere(e.target.value)} />
            </QuestionCard>

            <QuestionCard label={c.whatLabel} required>
              <FormTextarea
                value={what}
                onChange={(e) => setWhat(e.target.value)}
                placeholder={c.writeHere}
              />
              <div className="mt-3">
                <NeedAStart
                  lang={lang}
                  starters={STARTERS[lang]}
                  onPick={(s) => setWhat((w) => (w ? w + " " : "") + s)}
                  chipClassName="min-h-[32px] rounded-full border border-[#dadce0] px-3 text-[12px] text-[#673ab7] hover:bg-[#f0ebf8] cursor-pointer"
                />
              </div>
            </QuestionCard>

            <div className="flex items-center justify-between pt-1">
              <FormSubmitButton onClick={trySubmit}>{c.submit}</FormSubmitButton>
              <p className="text-[12px] text-[#5f6368]">
                {c.submitTo} Maria Delgado
              </p>
            </div>
            <p className="text-[12px] text-[#5f6368]">
              {lang === "en"
                ? "Never submit passwords through this form."
                : "Nunca envíes contraseñas en este formulario."}
            </p>
          </div>
        )}

        {view === "done" && (
          <div className="mx-auto flex max-w-[640px] flex-col gap-5 p-6">
            <TaskDoneCard
              kicker={c.sentKicker}
              title={c.doneTitle}
              body={c.doneBody}
              badgeNumber="05"
              badgeName={c.badgeName}
              badgeWhere={c.badgeWhere}
            />
            <TaskDoneActions
              kicker={c.sentKicker}
              tryAgainLabel={c.tryAgain}
              backToDeskLabel={c.backToDesk}
              onTryAgain={restart}
            />
          </div>
        )}
      </div>

      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={c.lessonKicker}
        lesson={LESSONS[lang][0]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
      />

      <NudgeToast text={nudge} onDismiss={dismiss} />
    </FormsShell>
  );
}
