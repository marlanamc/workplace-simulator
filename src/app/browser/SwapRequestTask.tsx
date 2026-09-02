"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import { useSkillGuidance } from "@/lib/use-skill-guidance";
import { SCHEDULE, SWAP_OPTIONS } from "@/lib/tasks/schedule/content";
import { SWAP_COPY, RIGHT_NOW_STEPS, RIGHT_NOW_LABEL } from "@/lib/tasks/swap-request/content";
import { TASK_ICONS } from "@/lib/icons";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";
import ShowMeHighlight from "@/components/task/ShowMeHighlight";
import { useShowMe, SHOW_ME_POINTER } from "@/lib/use-show-me";
import { firstPersonSkill } from "@/lib/skills";

type View = "form" | "done";

const SHIFTS = SCHEDULE.filter((d) => d.shift);

export default function SwapRequestTask({ initialShift }: { initialShift?: string | null }) {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("schedule") ? "done" : "form");
  const [shift, setShift] = useState(initialShift ?? "");
  const [cover, setCover] = useState("");
  const [reason, setReason] = useState("");
  const [help, setHelp] = useState(false);
  const { nudge, dismiss, recordWrong, recordClean, recordMissed, wrongCount } = useSkillGuidance("schedule");
  const showMe = useShowMe();
  // One step, one control: the button that files the form.
  const showMeId = "submit-button";

  const c = SWAP_COPY[lang];

  const submit = () => {
    if (!shift) {
      recordWrong({
        title: lang === "en" ? "Not yet." : "Todavía no.",
        body: lang === "en" ? "Choose which shift you need to swap." : "Elige qué turno necesitas cambiar.",
      });
      return;
    }
    // The swap is only real if it is the shift that actually clashes. Asking
    // to move a shift that was never a problem leaves Thursday untouched.
    const clashing = SCHEDULE.find((d) => d.conflict);
    if (shift !== clashing?.day) {
      recordWrong({
        title: lang === "en" ? "That shift is fine." : "Ese turno está bien.",
        body:
          lang === "en"
            ? "Thursday is the one that lands on your doctor's appointment. Swap that one."
            : "El jueves es el que cae en tu cita con el doctor. Cambia ese.",
      });
      return;
    }
    if (!cover) {
      recordWrong({
        title: lang === "en" ? "Almost." : "Casi.",
        body:
          lang === "en"
            ? "Pick the shift you could work instead."
            : "Elige el turno que sí podrías trabajar.",
      });
      return;
    }
    // Any Thursday shift starting after the 11 AM appointment works; an
    // earlier one or a different day does not, and each says why.
    const picked = SWAP_OPTIONS.find((o) => o.key === cover);
    if (!picked?.works) {
      recordWrong({
        title: lang === "en" ? "Not that one." : "Ese no.",
        body: picked?.wrongHint?.[lang] ?? "",
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
    markComplete("schedule", "request_shift_swap");
  };

  const restart = () => {
    setView("form");
    setShift("");
    setCover("");
    setReason("");
  };

  return (
    <div className="relative">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h2 className="text-[19px] font-medium">{c.heading}</h2>
      </div>
      <p className="mb-4 text-[14px] text-text-secondary">{c.subhead}</p>

      {view !== "done" && (
        <RightNowBar
          icon={TASK_ICONS["swap-request"]}
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

      {view === "form" && (
        <div className="max-w-[440px] rounded-xl border border-border bg-white p-5">
          <div className="mb-4 overflow-hidden rounded-lg border border-border">
            {SCHEDULE.map((d, i) => (
              <div
                key={d.day}
                className={`flex items-center justify-between px-3 py-2 text-[13px] ${i !== 0 ? "border-t border-border" : ""} ${
                  d.conflict ? "bg-warning-tint" : ""
                }`}
              >
                <span className="font-medium">{d.day} {d.date}</span>
                <span className={d.shift ? "text-text-primary" : "text-text-tertiary"}>{d.shift ?? "Off"}</span>
              </div>
            ))}
          </div>

          <label className="mb-3 block text-[14px] font-medium text-text-primary">
            {c.shiftLabel}
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              disabled={Boolean(initialShift)}
              className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2.5 text-[14px] outline-none focus:border-accent disabled:bg-surface-muted disabled:text-text-secondary"
            >
              <option value="">{c.shiftPlaceholder}</option>
              {SHIFTS.map((d) => (
                <option key={d.day} value={d.day}>
                  {d.day} {d.date} · {d.shift}
                </option>
              ))}
            </select>
            {initialShift && (
              <span className="mt-1 block text-[12px] text-text-tertiary">{c.shiftPickedNote}</span>
            )}
          </label>

          <label className="mb-3 block text-[14px] font-medium text-text-primary">
            {c.coverLabel}
            <select
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2.5 text-[14px] outline-none focus:border-accent"
            >
              <option value="">{c.coverPlaceholder}</option>
              {SWAP_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label[lang]}
                </option>
              ))}
            </select>
          </label>

          <label className="mb-4 block text-[14px] font-medium text-text-primary">
            {c.reasonLabel}
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={c.reasonPlaceholder}
              className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2.5 text-[14px] outline-none placeholder:text-text-tertiary focus:border-accent"
            />
          </label>

          <button
            data-showme="submit-button"
            onClick={submit}
            className="inline-flex min-h-[46px] items-center rounded-full bg-accent px-6 text-[15px] font-medium text-white hover:bg-accent-hover cursor-pointer"
          >
            {c.submit}
          </button>
        </div>
      )}

      {view === "done" && (
        <div className="flex flex-col gap-5">
          <TaskDoneCard
            kicker={c.sentKicker}
            title={firstPersonSkill("schedule")}
            body={c.doneBody}
            badgeNumber="02"
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
          t: lang === "en" ? "Asking for a shift swap" : "Pedir un cambio de turno",
          s: lang === "en"
            ? ["Pick the shift that overlaps with something you already have.", "Choose a date you can actually work instead.", "A reason helps, but it isn't required."]
            : ["Elige el turno que se cruza con algo que ya tienes.", "Elige una fecha en la que sí puedas trabajar.", "Un motivo ayuda, pero no es obligatorio."],
          tip: lang === "en" ? "Submitting the form is enough - you don't have to also email anyone." : "Con enviar el formulario basta, no hace falta enviar un correo también.",
        }}
        tipLabel={lang === "en" ? "Tip" : "Consejo"}
        gotItLabel={lang === "en" ? "Got it. Back to my task" : "Entendido. Volver a mi tarea"}
      />

      <NudgeToast text={nudge} onDismiss={dismiss} />
      <ShowMeHighlight targetId={showMe.targetId} label={SHOW_ME_POINTER[lang]} onDismiss={showMe.clear} />
    </div>
  );
}
