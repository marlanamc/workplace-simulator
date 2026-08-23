"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import { useSkillGuidance } from "@/lib/use-skill-guidance";
import { SCHEDULE } from "@/lib/tasks/schedule/content";
import { EVENT_INTRO, SWAP_COPY, CONFIDENCE_OPTIONS } from "@/lib/tasks/swap-request/content";
import ConfidenceCheck from "@/components/task/ConfidenceCheck";
import EventIntroCard from "@/components/task/EventIntroCard";
import { TASK_ICONS } from "@/lib/icons";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import AppHeaderTools from "@/components/task/AppHeaderTools";
import { firstPersonSkill } from "@/lib/skills";

type View = "intro" | "form" | "done";

const SHIFTS = SCHEDULE.filter((d) => d.shift);

export default function SwapRequestTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("swap-request") ? "done" : "intro");
  const [shift, setShift] = useState("");
  const [newDate, setNewDate] = useState("");
  const [reason, setReason] = useState("");
  const [confidence, setConfidence] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const [noHelp, setNoHelp] = useState(false);
  const { nudge, recordWrong, recordClean, recordMissed, wrongCount } = useSkillGuidance("swap-request");

  const c = SWAP_COPY[lang];

  const submit = () => {
    if (!shift) {
      recordWrong({
        title: lang === "en" ? "Not yet." : "Todavía no.",
        body: lang === "en" ? "Choose which shift you need to swap." : "Elige qué turno necesitas cambiar.",
      });
      return;
    }
    if (!newDate) {
      recordWrong({
        title: lang === "en" ? "Almost." : "Casi.",
        body: lang === "en" ? "Pick a date you can work instead." : "Elige una fecha en la que sí puedas trabajar.",
      });
      return;
    }
    const cleanRun = wrongCount === 0;
    setNoHelp(cleanRun);
    if (cleanRun) {
      recordClean();
    } else {
      recordMissed();
    }
    setView("done");
    markComplete("swap-request", "request_shift_swap");
  };

  const restart = () => {
    setView("form");
    setShift("");
    setNewDate("");
    setReason("");
    setConfidence(null);
    setNoHelp(false);
  };

  return (
    <div className="relative">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h2 className="text-[19px] font-medium">{c.heading}</h2>
        <AppHeaderTools helpLabel={c.helpBtn} onHelp={() => setHelp(true)} />
      </div>
      <p className="mb-4 text-[14px] text-[var(--text-secondary)]">{c.subhead}</p>

      {view === "intro" && (
        <EventIntroCard {...EVENT_INTRO[lang]} icon={TASK_ICONS["swap-request"]} onContinue={() => setView("form")} />
      )}

      {view === "form" && (
        <div className="max-w-[440px] rounded-xl border border-[var(--border)] bg-white p-5">
          <div className="mb-4 overflow-hidden rounded-lg border border-[var(--border)]">
            {SCHEDULE.map((d, i) => (
              <div
                key={d.day}
                className={`flex items-center justify-between px-3 py-2 text-[13px] ${i !== 0 ? "border-t border-[var(--border)]" : ""} ${
                  d.conflict ? "bg-[var(--warning-tint)]" : ""
                }`}
              >
                <span className="font-medium">{d.day} {d.date}</span>
                <span className={d.shift ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"}>{d.shift ?? "Off"}</span>
              </div>
            ))}
          </div>

          <label className="mb-3 block text-[14px] font-medium text-[var(--text-primary)]">
            {c.shiftLabel}
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-[14px] outline-none focus:border-[var(--accent)]"
            >
              <option value="">{c.shiftPlaceholder}</option>
              {SHIFTS.map((d) => (
                <option key={d.day} value={d.day}>
                  {d.day} {d.date} · {d.shift}
                </option>
              ))}
            </select>
          </label>

          <label className="mb-3 block text-[14px] font-medium text-[var(--text-primary)]">
            {c.dateLabel}
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-[14px] outline-none focus:border-[var(--accent)]"
            />
          </label>

          <label className="mb-4 block text-[14px] font-medium text-[var(--text-primary)]">
            {c.reasonLabel}
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={c.reasonPlaceholder}
              className="mt-1.5 block w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-[14px] outline-none placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent)]"
            />
          </label>

          <button
            onClick={submit}
            className="inline-flex min-h-[46px] items-center rounded-full bg-[var(--accent)] px-6 text-[15px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
          >
            {c.submit}
          </button>
        </div>
      )}

      {view === "done" && (
        <div className="flex flex-col gap-5">
          <TaskDoneCard
            kicker={c.sentKicker}
            title={firstPersonSkill("swap-request")}
            body={c.doneBody}
            badgeNumber="05"
            badgeName={c.badgeName}
            badgeWhere={c.badgeWhere}
            noHelp={noHelp}
            noHelpLabel={lang === "en" ? "You did this with no help" : "Lo hiciste sin ayuda"}
          />
          <ConfidenceCheck
            question={c.confidenceQ}
            options={CONFIDENCE_OPTIONS[lang]}
            selected={confidence}
            onSelect={setConfidence}
          />
          <TaskDoneActions tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
        </div>
      )}

      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={lang === "en" ? "2-minute lesson" : "Lección de 2 minutos"}
        lesson={{
          t: lang === "en" ? "Asking for a shift swap" : "Pedir un cambio de turno",
          s: lang === "en"
            ? ["Pick the shift that overlaps with something you already have.", "Choose a date you can actually work instead.", "A reason helps, but it isn't required."]
            : ["Elige el turno que se cruza con algo que ya tienes.", "Elige una fecha en la que sí puedas trabajar.", "Un motivo ayuda, pero no es obligatorio."],
          tip: lang === "en" ? "Submitting the form is enough - you don't have to also email anyone." : "Con enviar el formulario basta, no hace falta enviar un correo también.",
        }}
        tipLabel={lang === "en" ? "Tip" : "Consejo"}
        gotItLabel={lang === "en" ? "Got it. Back to my task" : "Entendido. Volver a mi tarea"}
      />

      <NudgeToast text={nudge} bottom={32} />
    </div>
  );
}
