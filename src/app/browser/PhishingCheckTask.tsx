"use client";

import { useRef, useState } from "react";
import { useProgress } from "@/lib/progress-context";
import { useJobCard } from "@/lib/job-card-context";
import { useSkillGuidance } from "@/lib/use-skill-guidance";
import { SHOW_ME_POINTER, useShowMe } from "@/lib/use-show-me";
import {
  EMAILS,
  INBOX_COPY,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
  PHISHING_REPLY_HINT,
  HELP_LESSON,
  emailByKey,
} from "@/lib/tasks/phishing-check/content";
import { TASK_ICONS } from "@/lib/icons";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import ShowMeHighlight from "@/components/task/ShowMeHighlight";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";
import { firstPersonSkill } from "@/lib/skills";

type View = "inbox" | "message" | "done";

/** The Show-me target: the whole list while choosing, the action button once
 *  a message is open. Never the correct message itself. */
const SHOW_ME_IDS = ["inbox-list", "report-phishing-button"] as const;

export default function PhishingCheckTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("phishing-check") ? "done" : "inbox");
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyDraft, setReplyDraft] = useState("");
  const [sentNote, setSentNote] = useState(false);
  const [help, setHelp] = useState(false);
  const { nudge, dismiss, recordWrong, recordClean, recordMissed, wrongCount } = useSkillGuidance("phishing-check");
  const showMe = useShowMe();
  const { clearCorrection } = useJobCard();
  const replyRef = useRef<HTMLTextAreaElement>(null);

  const c = INBOX_COPY[lang];
  const open = openKey ? emailByKey(openKey) : undefined;
  const showMeId = view === "inbox" ? SHOW_ME_IDS[0] : SHOW_ME_IDS[1];

  const openEmail = (key: string) => {
    showMe.clear();
    setOpenKey(key);
    setView("message");
    setReplyOpen(false);
    setReplyDraft("");
    setSentNote(false);
  };

  const backToInbox = () => {
    showMe.clear();
    setView("inbox");
    setOpenKey(null);
  };

  const clickReply = () => {
    showMe.clear();
    clearCorrection();
    if (!open) return;
    setReplyOpen(true);
    setSentNote(false);
    if (open.isTarget) {
      recordWrong({ title: lang === "en" ? "Careful." : "Cuidado.", body: PHISHING_REPLY_HINT[lang] });
    }
    requestAnimationFrame(() => replyRef.current?.focus());
  };

  const clickVerifyNow = () => {
    showMe.clear();
    recordWrong({ title: lang === "en" ? "Careful." : "Cuidado.", body: PHISHING_REPLY_HINT[lang] });
  };

  const clickSend = () => {
    if (!open) return;
    setReplyDraft("");
    setReplyOpen(false);
    if (open.isTarget) {
      recordWrong({ title: lang === "en" ? "Careful." : "Cuidado.", body: PHISHING_REPLY_HINT[lang] });
    } else {
      setSentNote(true);
    }
  };

  const clickReport = () => {
    showMe.clear();
    if (!open) return;
    if (open.isTarget) {
      if (wrongCount === 0) recordClean();
      else recordMissed();
      setView("done");
      markComplete("phishing-check", "report_phishing");
      return;
    }
    if (open.wrongHint) {
      recordWrong({ title: lang === "en" ? "Not quite." : "No es así.", body: open.wrongHint[lang] });
    }
  };

  const restart = () => {
    setView("inbox");
    setOpenKey(null);
    setReplyOpen(false);
    setReplyDraft("");
    setSentNote(false);
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-white text-[14px] text-[#202124]" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
      {view !== "done" && (
        <RightNowBar
          icon={TASK_ICONS["phishing-check"]}
          stepIndex={0}
          steps={RIGHT_NOW_STEPS}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onShowMe={() => showMe.toggleFor(showMeId)}
          showMeActive={showMe.targetId === showMeId}
          onHelp={() => setHelp(true)}
        />
      )}

      {view !== "done" && (
        <div className="flex items-center gap-2 border-b border-[#e8eaed] px-4 py-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ea4335] text-[12px] font-medium text-white">Y</span>
          <h2 className="m-0 text-[16px] font-medium text-[#202124]">{c.heading}</h2>
        </div>
      )}

      {view === "inbox" && (
        <ul data-showme="inbox-list" className="min-h-0 flex-1 overflow-y-auto" data-testid="phishing-inbox-list">
          {EMAILS.map((email) => (
            <li key={email.key} className="border-b border-[#e8eaed] first:border-t-0">
              <button
                type="button"
                data-testid={`phishing-email-${email.key}`}
                onClick={() => openEmail(email.key)}
                className="flex w-full min-h-[56px] items-start gap-3 px-4 py-2.5 text-left hover:bg-[#f8f9fa] cursor-pointer"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1a73e8] text-[12px] font-medium text-white">
                  {email.fromName.charAt(0)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[14px] font-semibold text-[#202124]">{email.fromName}</span>
                    <span className="shrink-0 text-[12px] text-[#5f6368]">{email.when[lang]}</span>
                  </span>
                  <span className="block truncate text-[13px] font-medium text-[#202124]">{email.subject[lang]}</span>
                  <span className="block truncate text-[13px] text-[#5f6368]">{email.preview[lang]}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {view === "message" && open && (
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          <button
            type="button"
            onClick={backToInbox}
            className="mb-3 inline-flex min-h-[32px] items-center gap-1.5 rounded-full px-2 text-[13px] font-medium text-[#1a73e8] hover:bg-[#f1f3f4] cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z" /></svg>
            {c.backToInbox}
          </button>

          <h3 className="m-0 mb-2 text-[18px] font-medium leading-snug text-[#202124]">{open.subject[lang]}</h3>

          <div className="mb-3 flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1a73e8] text-[13px] font-medium text-white">
              {open.fromName.charAt(0)}
            </span>
            <span className="min-w-0 flex-1 text-[13px] leading-snug">
              <span className="block font-medium text-[#202124]">{open.fromName}</span>
              <span className="block truncate text-[#5f6368]">{`<${open.fromAddress}>`}</span>
            </span>
            <span className="shrink-0 text-[12px] text-[#5f6368]">{open.when[lang]}</span>
          </div>

          <div className="max-w-[560px] rounded-xl border border-[#e8eaed] p-4 text-[14px] leading-relaxed text-[#202124]">
            {open.body[lang].map((p, i) => (
              <p key={i} className="m-0 mb-3 last:mb-0">{p}</p>
            ))}
            {open.hasVerifyLink && (
              <button
                type="button"
                onClick={clickVerifyNow}
                className="my-1 inline-flex min-h-[40px] items-center rounded bg-[#d93025] px-5 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,.3)] hover:bg-[#b1271b] cursor-pointer"
              >
                {c.verifyLabel}
              </button>
            )}
            {open.signature && <p className="m-0 mt-3 text-[#5f6368]">{open.signature[lang]}</p>}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={clickReply}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-[#747775] px-4 text-[14px] font-medium text-[#1a73e8] hover:bg-[#e8f0fe] cursor-pointer"
            >
              {c.replyLabel}
            </button>
            <button
              type="button"
              data-showme="report-phishing-button"
              onClick={clickReport}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-[#0b57d0] px-4 text-[14px] font-medium text-white hover:bg-[#0842a0] cursor-pointer"
            >
              {c.reportLabel}
            </button>
          </div>

          {sentNote && !replyOpen && (
            <p className="mt-3 max-w-[560px] rounded-lg bg-[#f0f4f9] px-3 py-2 text-[13px] text-[#444746]">{c.sentNote}</p>
          )}

          {replyOpen && (
            <div className="mt-3 max-w-[560px] rounded-xl border border-[#e8eaed] p-3">
              <textarea
                ref={replyRef}
                value={replyDraft}
                onChange={(e) => setReplyDraft(e.target.value)}
                placeholder={c.replyPlaceholder}
                rows={3}
                className="block w-full resize-none rounded border border-[#747775] p-2 text-[14px] outline-none focus:border-2 focus:border-[#0b57d0]"
              />
              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setReplyOpen(false); setReplyDraft(""); }}
                  className="inline-flex min-h-[36px] items-center rounded-full px-4 text-[13px] font-medium text-[#444746] hover:bg-[#f1f3f4] cursor-pointer"
                >
                  {c.cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={clickSend}
                  className="inline-flex min-h-[36px] items-center rounded-full bg-[#0b57d0] px-4 text-[13px] font-medium text-white hover:bg-[#0842a0] cursor-pointer"
                >
                  {c.sendLabel}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {view === "done" && (
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard
              kicker={c.doneKicker}
              title={firstPersonSkill("phishing-check", lang)}
              body={c.doneBody}
              badgeNumber="11"
              badgeName={c.badgeName}
              badgeWhere={c.badgeWhere}
            />
            <TaskDoneActions taskKey="phishing-check" kicker={c.doneKicker} tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
          </div>
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
