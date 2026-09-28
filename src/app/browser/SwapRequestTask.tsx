"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import { useSkillGuidance } from "@/lib/use-skill-guidance";
import { SCHEDULE, SCHEDULE_COPY, SWAP_OPTIONS, shiftDayLabel } from "@/lib/tasks/schedule/content";
import { SWAP_COPY, RIGHT_NOW_STEPS, RIGHT_NOW_LABEL } from "@/lib/tasks/swap-request/content";
import { TASK_ICONS } from "@/lib/icons";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import PhoneCalendar from "@/components/task/PhoneCalendar";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";
import ShowMeHighlight from "@/components/task/ShowMeHighlight";
import { useShowMe, SHOW_ME_POINTER } from "@/lib/use-show-me";
import { firstPersonSkill } from "@/lib/skills";
import PhoneFrame from "@/components/task/PhoneFrame";
import { useTaskDraft } from "@/lib/use-task-draft";
import { MARIA_TEXT, MARIA_TEXT_FROM, TEXT_COPY, TEXT_CORRECTIONS, TEXT_STEPS, textReplyVerdict } from "@/lib/tasks/swap-request/manager-text";

type View = "form" | "text" | "done";

const SHIFTS = SCHEDULE.filter((d) => d.shift);

export default function SwapRequestTask({ initialShift }: { initialShift?: string | null }) {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  // Day 2's manager text (Wave 4): once the form is filed, Maria texts back.
  // Kept as a draft, so a reload lands back on her text, not the empty form.
  const [filed, setFiled] = useTaskDraft("schedule", "swap-filed", false);
  const [reply, setReply] = useTaskDraft("schedule", "text-reply", "");
  const [sentReply, setSentReply] = useState<string | null>(null);
  const [view, setView] = useState<View>(completedTaskKeys.includes("schedule") ? "done" : filed ? "text" : "form");
  const [shift, setShift] = useState(initialShift ?? "");
  const [cover, setCover] = useState("");
  const [reason, setReason] = useState("");
  const [help, setHelp] = useState(false);
  const { nudge, dismiss, recordWrong, recordClean, recordMissed, wrongCount } = useSkillGuidance("schedule");
  const showMe = useShowMe();
  // One step, one control: the button that files the form.
  const showMeId = view === "text" ? "text-reply" : "submit-button";

  const c = SWAP_COPY[lang];
  const sc = SCHEDULE_COPY[lang];

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
    if (shift !== clashing?.key) {
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
    setFiled(true);
    setView("text");
  };

  const sendText = () => {
    showMe.clear();
    const verdict = textReplyVerdict(reply);
    if (verdict !== "ok") {
      recordWrong({ title: lang === "en" ? "Not yet." : "Todavía no.", body: TEXT_CORRECTIONS[verdict][lang] });
      return;
    }
    setSentReply(reply.trim());
    setView("done");
    markComplete("schedule", "request_shift_swap");
  };

  const restart = () => {
    setView("form");
    setFiled(false);
    setReply("");
    setSentReply(null);
    setShift("");
    setCover("");
    setReason("");
  };

  return (
    <div className="relative">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h2 className="text-[19px] font-medium">{c.heading}</h2>
      </div>

      {view !== "done" && (
        <RightNowBar
          icon={TASK_ICONS["swap-request"]}
          stepIndex={view === "text" ? 1 : 0}
          stepCount={2}
          instruction={view === "text" ? (reply.trim() ? TEXT_STEPS.reply : TEXT_STEPS.read) : RIGHT_NOW_STEPS[0]}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onShowMe={() => showMe.toggleFor(showMeId)}
          showMeActive={showMe.targetId === showMeId}
          onHelp={() => setHelp(true)}
        />
      )}

      {view === "form" && (
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
          <div className="min-w-0 max-w-[440px] flex-1 rounded-xl border border-border bg-white p-5">
          <div className="mb-4 overflow-hidden rounded-lg border border-border">
            {SCHEDULE.map((d, i) => (
              <div
                key={d.key}
                className={`flex items-center justify-between px-3 py-2 text-[13px] ${i !== 0 ? "border-t border-border" : ""} ${
                  d.conflict ? "bg-warning-tint" : ""
                }`}
              >
                <span className="font-medium">{shiftDayLabel(d, lang)}</span>
                <span className={d.shift ? "text-text-primary" : "text-text-tertiary"}>{d.shift ?? sc.off}</span>
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
                <option key={d.key} value={d.key}>
                  {shiftDayLabel(d, lang)} · {d.shift}
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
          <aside className="w-full shrink-0 lg:w-[260px]">
            <PhoneCalendar label={sc.phoneLabel} heading={sc.phoneHeading} lang={lang} />
          </aside>
        </div>
      )}

      {view === "text" && (
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
          <p className="max-w-[440px] flex-1 text-[14px] text-text-secondary">{c.sentKicker}</p>
          <aside className="w-full shrink-0 lg:w-[260px]">
            <TextThread lang={lang} reply={reply} onReply={setReply} onSend={sendText} />
          </aside>
        </div>
      )}

      {view === "done" && (
        <div className="flex flex-col gap-5">
          {sentReply && (
            <div className="w-full lg:w-[260px]">
              <TextThread lang={lang} reply="" sent={sentReply} />
            </div>
          )}
          <TaskDoneCard
            kicker={c.sentKicker}
            title={firstPersonSkill("schedule", lang)}
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
            ? ["Look at the personal calendar on your phone.", "Choose a shift that starts after your appointment.", "A reason helps, but it isn't required."]
            : ["Mira el calendario personal de tu teléfono.", "Elige un turno que empiece después de tu cita.", "Un motivo ayuda, pero no es obligatorio."],
          tip: lang === "en" ? "Submitting the form is enough - you don't have to also email anyone." : "Con enviar el formulario basta, no hace falta enviar un correo también.",
        }}
        tipLabel={lang === "en" ? "Tip" : "Consejo"}
        gotItLabel={lang === "en" ? "I understand. Back to my task" : "Entendido. Volver a mi tarea"}
      />

      <NudgeToast text={nudge} onDismiss={dismiss} />
      <ShowMeHighlight targetId={showMe.targetId} label={SHOW_ME_POINTER[lang]} onDismiss={showMe.clear} />
    </div>
  );
}

/**
 * Maria's text on the learner's phone, with a reply box. Once sent, the
 * reply shows as the learner's own bubble.
 */
function TextThread({
  lang,
  reply,
  sent,
  onReply,
  onSend,
}: {
  lang: "en" | "es";
  reply: string;
  sent?: string;
  onReply?: (value: string) => void;
  onSend?: () => void;
}) {
  const t = TEXT_COPY[lang];
  return (
    <PhoneFrame label={t.label} time="4:12">
      <h3 className="px-[16px] pt-[4px] pb-[8px] text-center text-[15px] font-semibold">{MARIA_TEXT_FROM}</h3>
      <div data-testid="text-thread" className="flex min-h-[220px] flex-col gap-2 bg-white px-[10px] py-[12px]">
        <p className="max-w-[85%] self-start rounded-[16px] rounded-bl-[4px] bg-[#e9e9eb] px-[10px] py-[7px] text-[13px] leading-snug">
          {MARIA_TEXT[lang]}
        </p>
        {sent && (
          <>
            <p className="max-w-[85%] self-end rounded-[16px] rounded-br-[4px] bg-[#0b84ff] px-[10px] py-[7px] text-[13px] leading-snug text-white">
              {sent}
            </p>
            <span className="self-end text-[10px] text-[#6e6e73]">{t.delivered}</span>
          </>
        )}
      </div>
      {onReply && onSend && (
        <div className="flex items-end gap-1.5 border-t border-black/10 bg-[#f2f2f7] px-[8px] py-[8px]">
          <textarea
            data-testid="text-reply"
            data-showme="text-reply"
            aria-label={t.placeholder}
            value={reply}
            onChange={(e) => onReply(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder={t.placeholder}
            rows={2}
            className="min-h-[44px] flex-1 resize-none rounded-[16px] border border-black/15 bg-white px-[10px] py-[6px] text-[13px] outline-none focus:border-[#0b84ff]"
          />
          <button
            type="button"
            data-testid="text-send"
            data-card-avoid
            onClick={onSend}
            className="min-h-[44px] rounded-full bg-[#0b84ff] px-[12px] text-[13px] font-semibold text-white cursor-pointer"
          >
            {t.send}
          </button>
        </div>
      )}
    </PhoneFrame>
  );
}
