"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  MAIL_COPY,
  BODY,
  STARTERS,
  LESSONS,
  FILES,
  emailsForTask,
  SUBJECT_BY_TASK,
  CONFIRM_COPY,
  DONE_COPY,
  type PlayableMailTask,
} from "@/lib/tasks/mail/content";
import type { TaskKey } from "@/lib/desktop-content";
import { useSkillGuidance } from "@/lib/use-skill-guidance";
import { TASK_ICONS } from "@/lib/icons";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import PickerModal from "@/components/task/PickerModal";
import RightNowBar from "@/components/task/RightNowBar";
import ShowMeHighlight from "@/components/task/ShowMeHighlight";
import SettingsPopover from "@/components/task/SettingsPopover";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import AppHeaderTools from "@/components/task/AppHeaderTools";
import { Paperclip, Star, Inbox, Send, FileText } from "lucide-react";
import NeedAStart from "@/components/task/NeedAStart";
import { sortInboxByTime, storyMailsUpTo, type InboxRow } from "@/lib/story-beats";
import { speakFromClick, speakText, stopSpeaking } from "@/lib/read-aloud";
import type { Localized } from "@/lib/task-types";
import { useWindowManager } from "@/lib/window-manager";
import BridgeOutCard from "@/components/task/BridgeOutCard";
import { bridgeOutCopyFor } from "@/lib/bridge-out-content";

const RIGHT_NOW_LABEL: Localized<string> = { en: "Right now", es: "Ahora mismo" };
const SHOW_ME_LABEL: Localized<string> = { en: "This one. Click it.", es: "Este. Haz clic aquí." };

type View = "empty" | "read" | "confirm" | "compose" | "done" | "story";
type MailTask = PlayableMailTask;
const MAIL_TASK_ORDER: MailTask[] = ["mail-reply", "mail-attach"];

/**
 * One short sentence per step - the Job Card's hard rule. Anything longer is
 * a lesson, and lessons live in the Help drawer.
 */
const STEP_LINE = {
  openMail: {
    "mail-reply": { en: "Open Maria's email.", es: "Abre el correo de Maria." },
    "mail-attach": { en: "Open Maria's new email.", es: "Abre el correo nuevo de Maria." },
  } as Record<MailTask, Localized<string>>,
  reply: { en: "Click Reply.", es: "Haz clic en Responder." },
  confirm: { en: "What does she need? Pick one.", es: "¿Qué necesita? Elige una." },
  attach: { en: "Attach the July report.", es: "Adjunta el reporte de julio." },
  write: { en: "Write one short line.", es: "Escribe una línea corta." },
  send: { en: "Click Send.", es: "Haz clic en Enviar." },
} as const;

/** Steps per job, for the card's progress bars. */
const STEP_COUNT: Record<MailTask, number> = { "mail-reply": 3, "mail-attach": 4 };

function isStoryMail(m: { key: string }): m is InboxRow {
  return "story" in m && Boolean((m as InboxRow).story) && Array.isArray((m as InboxRow).body?.en);
}

/** Day One's 2 jobs share one inbox - whichever isn't done yet is the one running now. */
function activeMailTaskFor(completedTaskKeys: TaskKey[]): MailTask {
  return MAIL_TASK_ORDER.find((k) => !completedTaskKeys.includes(k)) ?? MAIL_TASK_ORDER[MAIL_TASK_ORDER.length - 1];
}

export default function MailClient({ welcomeWalkthroughActive = false }: { welcomeWalkthroughActive?: boolean }) {
  const { markComplete, completedTaskKeys, lang, storyFlags, setStoryFlag, speakAloud, setSpeakAloud, bigText, setBigText } = useProgress();
  const { browserTabToken } = useWindowManager();
  // Fixed for this mount, not recomputed every render: markComplete() updates
  // completedTaskKeys immediately, and Mail's window stays mounted (hidden,
  // not unmounted) across desktop navigation, so a reactive lookup here would
  // yank the done screen out from under whichever job just finished. The
  // learner moves to the next of Day One's 2 jobs by explicitly reopening
  // Mail (the "Next job" button on the done screen, same as any other task) -
  // that's the `browserTabToken` bump below, mirroring PortalPage's own
  // `portalSectionToken` re-open pattern.
  const [activeMailTask, setActiveMailTask] = useState<MailTask>(() => activeMailTaskFor(completedTaskKeys));
  const [plain, setPlain] = useState(true);
  const [step, setStep] = useState(0);
  const [view, setView] = useState<View>(completedTaskKeys.includes(activeMailTask) ? "done" : "empty");
  const [body, setBody] = useState("");
  const [attached, setAttached] = useState(false);
  const [confirmPick, setConfirmPick] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const [picker, setPicker] = useState(false);
  const [bridgeOutEligible, setBridgeOutEligible] = useState(false);
  const [openStory, setOpenStory] = useState<InboxRow | null>(null);
  const [readStoryKeys, setReadStoryKeys] = useState<string[]>([]);
  const { nudge, dismiss, recordWrong, recordClean, recordMissed, rung, wrongCount, showMeTargetId, setShowMeTarget } = useSkillGuidance(activeMailTask);

  const [lastTabToken, setLastTabToken] = useState(browserTabToken);
  if (browserTabToken !== lastTabToken) {
    setLastTabToken(browserTabToken);
    const next = activeMailTaskFor(completedTaskKeys);
    setActiveMailTask(next);
    setView(completedTaskKeys.includes(next) ? "done" : "empty");
    setStep(0);
    setBody("");
    setAttached(false);
    setConfirmPick(null);
    setBridgeOutEligible(false);
  }

  const c = MAIL_COPY[lang];
  const cc = CONFIRM_COPY[lang];
  const subjectMeta = SUBJECT_BY_TASK[activeMailTask][lang];
  const T = (en: string, es: string) => (lang === "en" ? en : es);
  const mailDone = completedTaskKeys.includes(activeMailTask);
  // While a Day One job is running (first time OR a replay), the inbox shows
  // the story as it stood at that moment — no future Maria mails flooding in.
  const rawInbox = sortInboxByTime([
    ...storyMailsUpTo(mailDone ? null : activeMailTask, completedTaskKeys, storyFlags),
    ...emailsForTask(activeMailTask),
  ]);
  // During the Welcome walkthrough the tour is doing the talking, so keep the
  // bold unread row from pulling focus. Otherwise finding it is the job.
  const inbox = welcomeWalkthroughActive ? rawInbox.filter((m) => !m.isTarget) : rawInbox;
  const unreadCount = inbox.filter((m) => {
    if ("story" in m && m.story) {
      return Boolean(m.unread) && !readStoryKeys.includes(m.key) && !(view === "story" && openStory?.key === m.key);
    }
    if (m.isTarget) {
      return Boolean(m.unread) && !mailDone && view !== "read" && view !== "compose" && view !== "done";
    }
    return Boolean(m.unread);
  }).length;

  const advance = (n: number) => setStep((s) => (s < n ? n : s));

  const lessonIdx = Math.min(step, 4);
  const lesson = LESSONS[lang][lessonIdx];

  const openMail = () => {
    setView("read");
    advance(1);
  };
  const wrongMail = (hint?: { en: string; es: string }) =>
    recordWrong({
      title: T("Not that one.", "Ese no es."),
      body: hint?.[lang] ?? T("That one isn't from your manager. Look for the email from Maria Delgado.", "Ese no es de tu gerente. Busca el correo de Maria Delgado."),
    });

  const startReply = () => {
    if (activeMailTask === "mail-attach") {
      setView("confirm");
      advance(2);
      return;
    }
    setView("compose");
    advance(2);
  };
  const wrongForward = () =>
    recordWrong({
      title: T("Not that one. That is Forward.", "Ese no es. Es Reenviar."),
      body: T("That is Forward. It sends her email to someone else. Click Reply.", "Eso es Reenviar. Manda su correo a otra persona. Haz clic en Responder."),
    });

  const wrongCompose = () =>
    recordWrong({
      title: T("Not that one. That is Compose.", "Ese no es. Es Redactar."),
      body: T("That is Compose. It starts a new email. Open Maria's and click Reply.", "Eso es Redactar. Empieza un correo nuevo. Abre el de Maria y haz clic en Responder."),
    });

  const finish = (badgeKey: string) => {
    const cleanRun = wrongCount === 0;
    // Rung 3 -> 4 always happens on the very next clean run (release-ladder's
    // rule is exactly one), so "currently at rung 3" IS "this completion is
    // the transition" - captured now, before recordClean() moves the rung.
    const justReachedRungFour = rung === 3;
    setView("done");
    setStep(5);
    setBridgeOutEligible(justReachedRungFour);
    if (cleanRun) {
      recordClean();
    } else {
      recordMissed();
    }
    markComplete(activeMailTask, badgeKey);
  };

  const pickConfirm = (option: { label: string; correct: boolean }) => {
    setConfirmPick(option.label);
    if (!option.correct) {
      recordWrong({ title: T("Not quite.", "No es así."), body: cc.wrongReply });
      return;
    }
    advance(3);
  };

  const startAttachReply = () => {
    setView("compose");
    advance(3);
  };

  const trySend = () => {
    if (!body.trim())
      return recordWrong({
        title: T("Almost.", "Casi."),
        body: T("Write one short line first.", "Primero escribe una línea corta."),
      });
    if (activeMailTask === "mail-attach" && !attached)
      return recordWrong({
        title: T("Not yet.", "Todavía no."),
        body: T("She asked for the file. Click Attach file.", "Ella pidió el archivo. Haz clic en Adjuntar archivo."),
      });
    finish(activeMailTask === "mail-attach" ? "reply_with_attachment" : "answer_own_words");
  };

  const restart = () => {
    setStep(0);
    setView("empty");
    setBody("");
    setAttached(false);
    setConfirmPick(null);
    setHelp(false);
    setPicker(false);
    setOpenStory(null);
    setBridgeOutEligible(false);
  };

  const notThisFolder = () =>
    recordWrong({
      title: T("Not there.", "No está ahí."),
      body: T("Today's mail is in Inbox.", "El correo de hoy está en Recibidos."),
    });

  return (
    <div
      className="flex h-full min-h-0 flex-col bg-[#f6f8fc] text-[14px] text-[#202124]"
      style={{ fontFamily: "Roboto, Arial, sans-serif", zoom: bigText ? 1.15 : undefined }}
      onClick={(e) => {
        if (speakAloud) speakFromClick(e.target, lang);
      }}
    >
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="flex w-[200px] shrink-0 items-center gap-2 px-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#ea4335] text-[15px] font-bold text-white">M</span>
          <span className="text-[22px] font-normal text-[#5f6368]">Mail</span>
        </div>
        <div className="flex h-12 flex-1 items-center gap-3 rounded-full bg-[#e9eef6] px-4 text-[#444746]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <span className="text-[16px]">{c.searchPlaceholder}</span>
        </div>
        <AppHeaderTools
          helpLabel={c.helpBtn}
          onHelp={() => setHelp(true)}
        />
        <SettingsPopover
          plain={plain}
          onTogglePlain={() => setPlain((v) => !v)}
          speak={speakAloud}
          onToggleSpeak={() => {
            if (!speakAloud) {
              speakText(T("Read aloud is on. Click any text to hear it.", "Lectura en voz alta activada. Haz clic en un texto para escucharlo."), lang);
            } else {
              stopSpeaking();
            }
            setSpeakAloud(!speakAloud);
          }}
          bigText={bigText}
          onToggleBigText={() => setBigText(!bigText)}
          labels={{
            simpleWords: T("Simple words", "Palabras simples"),
            readAloud: T("Read aloud", "Leer en voz alta"),
            biggerText: T("Bigger text", "Letra más grande"),
          }}
        />
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="flex w-[200px] shrink-0 flex-col px-3 pt-1">
          <button
            onClick={wrongCompose}
            className="mb-4 flex h-14 items-center gap-3 rounded-2xl bg-white px-4 text-[14px] font-medium text-[#001d35] shadow-[0_1px_3px_0_rgba(60,64,67,.3),0_4px_8px_3px_rgba(60,64,67,.15)] hover:shadow-[0_1px_3px_0_rgba(60,64,67,.3),0_4px_8px_3px_rgba(60,64,67,.2)] cursor-pointer"
          >
            <span className="text-[20px] leading-none text-[#0b57d0]">✎</span>
            {c.compose}
          </button>
          {[
            { id: "inbox", label: c.inbox, icon: Inbox, onClick: undefined as (() => void) | undefined, count: unreadCount },
            { id: "starred", label: c.starred, icon: Star, onClick: notThisFolder, count: 0 },
            { id: "sent", label: c.sent, icon: Send, onClick: notThisFolder, count: 0 },
            { id: "drafts", label: c.drafts, icon: FileText, onClick: notThisFolder, count: 0 },
          ].map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`flex h-8 items-center gap-4 rounded-r-full px-3 text-[14px] cursor-pointer ${
                item.id === "inbox"
                  ? "bg-[#d3e3fd] font-medium text-[#001d35]"
                  : "font-normal text-[#444746] hover:bg-[#e8eaed]"
              }`}
            >
              <item.icon size={18} strokeWidth={2} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count > 0 ? <span className="text-[12px]">{item.count}</span> : null}
            </button>
          ))}
        </div>

        <div className="flex min-w-0 flex-1 overflow-hidden rounded-tl-2xl bg-white">
          <div className="flex w-[300px] shrink-0 flex-col border-r border-[#e0e3e8] sm:w-[340px]">
            <div className="flex items-center justify-between px-4 py-3 text-[14px] font-medium text-[#1f1f1f]">
              <span>{c.inbox}</span>
              <span className="text-[12px] font-normal text-[#444746]">{inbox.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {inbox.map((m) => {
                const mariaOpen = view === "read" || view === "confirm" || view === "compose" || view === "done";
                const storyOpen = view === "story" && openStory?.key === m.key;
                const storyRead = Boolean("story" in m && m.story) && (storyOpen || readStoryKeys.includes(m.key));
                const unread = Boolean(m.unread) && !(m.isTarget && (mariaOpen || mailDone)) && !storyRead;
                const selected = (m.isTarget && (view === "read" || view === "confirm" || view === "compose")) || storyOpen;
                return (
                  <button
                    key={m.key}
                    data-showme={m.isTarget ? "maria-row" : undefined}
                    onClick={() => {
                      if (isStoryMail(m)) {
                        setOpenStory(m);
                        setReadStoryKeys((keys) => (keys.includes(m.key) ? keys : [...keys, m.key]));
                        setView("story");
                        return;
                      }
                      if (m.isTarget) {
                        setOpenStory(null);
                        openMail();
                        return;
                      }
                      wrongMail(m.wrongHint);
                    }}
                    className={`flex w-full items-start gap-3 border-b border-[#f0f4f9] px-4 py-3 text-left cursor-pointer ${
                      selected ? "bg-[#c2e7ff]/50" : unread ? "bg-white" : "bg-white hover:bg-[#f2f6fc]"
                    }`}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-medium text-white"
                      style={{ background: m.color }}
                    >
                      {m.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className={`truncate text-[14px] ${unread ? "font-bold" : "font-medium"}`}>{m.from}</span>
                        <span className="shrink-0 text-[12px] text-[#444746]">{m.time}</span>
                      </div>
                      <div className={`truncate text-[14px] ${unread ? "font-bold text-[#001d35]" : "text-[#444746]"}`}>
                        {m.subject[lang]}
                      </div>
                      <div className="truncate text-[13px] text-[#5f6368]">{m.preview[lang]}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
            {(view === "empty" || view === "read" || view === "confirm" || view === "compose") && (() => {
              const stepCount = STEP_COUNT[activeMailTask];
              const needsAttach = activeMailTask === "mail-attach";
              // The compose step is really three moments in one pane, and the
              // card names whichever one the learner is actually on.
              const composeLine = needsAttach && !attached
                ? STEP_LINE.attach
                : !body.trim()
                  ? STEP_LINE.write
                  : STEP_LINE.send;
              const instruction =
                view === "empty"
                  ? STEP_LINE.openMail[activeMailTask]
                  : view === "read"
                    ? STEP_LINE.reply
                    : view === "confirm"
                      ? STEP_LINE.confirm
                      : composeLine;
              const stepIndex =
                view === "empty" ? 0 : view === "read" ? 1 : view === "confirm" ? 2 : stepCount - 1;
              const showMeId =
                view === "empty"
                  ? "maria-row"
                  : view === "read"
                    ? "reply-button"
                    : view === "confirm"
                      ? confirmPick && cc.options.some((o) => o.correct && o.label === confirmPick)
                        ? "reply-after-confirm"
                        : "confirm-correct"
                      : needsAttach && !attached
                        ? "attach-button"
                        : "send-button";
              return (
                <RightNowBar
                  icon={TASK_ICONS.mail}
                  stepIndex={stepIndex}
                  stepCount={stepCount}
                  instruction={instruction}
                  lang={lang}
                  rightNowLabel={RIGHT_NOW_LABEL}
                  onShowMe={() => setShowMeTarget(showMeTargetId === showMeId ? null : showMeId)}
                  showMeActive={showMeTargetId === showMeId}
                />
              );
            })()}
            {view === "empty" && (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-10 text-center">
                <Inbox size={40} strokeWidth={1.25} className="text-[#dadce0]" />
                <p className="max-w-[280px] text-[14px] text-[#5f6368]">{c.emptyPane}</p>
              </div>
            )}

            {(view === "read" || view === "confirm" || view === "compose") && (
              <div className="px-6 py-4 sm:px-8">
                <h2 className="mb-5 text-[22px] font-normal leading-tight text-[#1f1f1f]">{subjectMeta.subject}</h2>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1a73e8] text-[14px] font-medium text-white">
                    MD
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <span className="text-[14px] font-medium">Maria Delgado</span>
                        <span className="ml-1 text-[12px] text-[#5f6368]">&lt;maria.delgado@harborsidecafe.com&gt;</span>
                      </div>
                      <div className="text-[12px] text-[#5f6368]">
                        {activeMailTask === "mail-attach" ? "8:20 AM" : "8:14 AM"}
                      </div>
                    </div>
                    <div className="text-[12px] text-[#5f6368]">to me</div>
                    <div className="mt-4 flex max-w-[62ch] flex-col gap-3 text-[14px] leading-[1.6] text-[#1f1f1f]">
                      {(plain ? BODY[activeMailTask][lang].plain : BODY[activeMailTask][lang].full).map((p, i) => (
                        <p key={i} className="m-0">{p}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {view === "read" && (
                  <div className="mt-6 flex flex-wrap gap-2 pl-[52px]">
                    <button
                      data-showme="reply-button"
                      onClick={startReply}
                      className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[#747775] px-5 text-[14px] font-medium text-[#0b57d0] hover:bg-[#f2f6fc] cursor-pointer"
                    >
                      {activeMailTask === "mail-attach" ? cc.continueLabel : c.reply}
                    </button>
                    {activeMailTask === "mail-reply" && (
                      <button
                        onClick={wrongForward}
                        className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[#747775] px-5 text-[14px] font-medium text-[#444746] hover:bg-[#f2f6fc] cursor-pointer"
                      >
                        {c.forward}
                      </button>
                    )}
                  </div>
                )}

                {view === "confirm" && (
                  <div className="mt-6 max-w-[62ch] pl-[52px]">
                    <p className="mb-3 text-[15px] font-medium text-[#1f1f1f]">{cc.question}</p>
                    <div className="flex flex-col gap-2">
                      {cc.options.map((opt) => (
                        <button
                          key={opt.label}
                          data-showme={opt.correct ? "confirm-correct" : undefined}
                          onClick={() => pickConfirm(opt)}
                          className={`rounded-xl border px-4 py-3 text-left text-[14px] font-medium cursor-pointer ${
                            confirmPick === opt.label
                              ? opt.correct
                                ? "border-[#1e8e3e] bg-[#e6f4ea] text-[#1e8e3e]"
                                : "border-[#c5221f] bg-[#fce8e6] text-[#c5221f]"
                              : "border-[#dadce0] hover:bg-[#f2f6fc]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {confirmPick && cc.options.some((o) => o.correct && o.label === confirmPick) && (
                      <div className="mt-4 flex flex-col gap-3">
                        <p className="text-[14px] text-[#1e8e3e]">{cc.correctReply}</p>
                        <button
                          data-showme="reply-after-confirm"
                          onClick={startAttachReply}
                          className="inline-flex min-h-[40px] w-fit items-center gap-2 rounded-full border border-[#747775] px-5 text-[14px] font-medium text-[#0b57d0] hover:bg-[#f2f6fc] cursor-pointer"
                        >
                          {cc.replyAfterLabel}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {view === "compose" && (
                  <div className="mt-6 ml-[52px] overflow-hidden rounded-2xl border border-[#e0e3e8] shadow-[0_1px_3px_rgba(60,64,67,.15)]">
                    <div className="flex items-center gap-2 border-b border-[#e0e3e8] px-4 py-2 text-[13px]">
                      <span className="w-10 shrink-0 text-[#5f6368]">{c.to}</span>
                      <span>maria.delgado@harborsidecafe.com</span>
                    </div>
                    <div className="flex items-center gap-2 border-b border-[#e0e3e8] px-4 py-2 text-[13px]">
                      <span className="w-10 shrink-0 text-[#5f6368]">{c.subjectLabel}</span>
                      <span>{subjectMeta.reSubject}</span>
                    </div>
                    <textarea
                      value={body}
                      onChange={(e) => {
                        setBody(e.target.value);
                        if (e.target.value.trim().length > 3) advance(3);
                      }}
                      placeholder={c.writeHere}
                      className="min-h-[120px] w-full resize-y border-none px-4 py-3 text-[14px] leading-relaxed outline-none placeholder:text-[#767676]"
                    />
                    <div className="flex flex-wrap items-center gap-2 px-4 pb-2">
                      <NeedAStart
                        lang={lang}
                        starters={STARTERS[activeMailTask][lang]}
                        onPick={(s) => {
                          setBody((b) => (b ? b + " " : "") + s);
                          advance(3);
                        }}
                      />
                    </div>
                    {attached && (
                      <div className="mx-4 mb-2 inline-flex items-center gap-2 rounded-lg border border-[#d3e3fd] bg-[#f8fbff] px-3 py-2">
                        <span className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ background: "#ea4335" }}>
                          PDF
                        </span>
                        <span className="text-[13px] font-medium">safety-report-july.pdf</span>
                        <span className="text-[12px] text-[#5f6368]">248 KB</span>
                        <button
                          onClick={() => setAttached(false)}
                          aria-label={T("Remove attachment", "Quitar adjunto")}
                          className="ml-1 text-[16px] text-[#5f6368] cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-1 px-3 py-2">
                      <button
                        data-showme="send-button"
                        onClick={trySend}
                        className="inline-flex min-h-[36px] items-center rounded-full bg-[#0b57d0] px-6 text-[14px] font-medium text-white hover:bg-[#0b57d0]/90 cursor-pointer"
                      >
                        {c.send}
                      </button>
                      {activeMailTask === "mail-attach" && (
                        <button
                          data-showme="attach-button"
                          onClick={() => setPicker(true)}
                          className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-[#444746] hover:bg-[#f2f6fc] cursor-pointer"
                        >
                          <Paperclip size={18} strokeWidth={2} />
                          {c.attach}
                        </button>
                      )}
                      <div className="flex-1" />
                      <button
                        onClick={() => {
                          setView("read");
                          setStep(2);
                          setBody("");
                          setAttached(false);
                        }}
                        className="min-h-[36px] px-3 text-[13px] text-[#5f6368] hover:bg-[#f2f6fc] rounded-full cursor-pointer"
                      >
                        {c.discard}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {view === "story" && openStory?.body && (
              <div className="px-6 py-4 sm:px-8">
                <h2 className="mb-5 text-[22px] font-normal leading-tight text-[#1f1f1f]">{openStory.subject[lang]}</h2>
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[14px] font-medium text-white"
                    style={{ background: openStory.color }}
                  >
                    {openStory.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <span className="text-[14px] font-medium">{openStory.from}</span>
                      </div>
                      <div className="text-[12px] text-[#5f6368]">{openStory.time}</div>
                    </div>
                    <div className="text-[12px] text-[#5f6368]">to me</div>
                    <div className="mt-4 flex max-w-[62ch] flex-col gap-3 text-[14px] leading-[1.6] text-[#1f1f1f]">
                      {openStory.body[lang].map((p, i) => (
                        <p key={i} className="m-0">{p}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {view === "done" && (() => {
              const dc = DONE_COPY[activeMailTask][lang];
              const bridgeOutFlag = `bridge-out-shown:${activeMailTask}`;
              const showBridgeOut = bridgeOutEligible && storyFlags[bridgeOutFlag] !== "true";
              const dismissBridgeOut = () => setStoryFlag(bridgeOutFlag, "true");
              return (
              <div className="flex flex-col gap-5 p-6 sm:p-8">
                <TaskDoneCard kicker={dc.kicker} compact />
                {showBridgeOut && (
                  <BridgeOutCard
                    copy={bridgeOutCopyFor(activeMailTask)}
                    lang={lang}
                    onDidItForReal={() => {
                      setStoryFlag(`bridge-out-done:${activeMailTask}`, "true");
                      dismissBridgeOut();
                    }}
                    onNotYet={dismissBridgeOut}
                  />
                )}
                <TaskDoneActions kicker={dc.kicker} onTryAgain={restart} />
              </div>
              );
            })()}
          </div>
        </div>
      </div>

      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={c.lessonKicker}
        lesson={lesson}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
      />

      {picker && (
        <PickerModal
          title={c.pickerTitle}
          categoryLabel={c.downloads}
          columnLabels={[c.colName, c.colDate]}
          items={FILES}
          onCancel={() => setPicker(false)}
          cancelLabel={c.cancel}
          onSelect={(item) => {
            if (item.isTarget) {
              setAttached(true);
              setPicker(false);
              advance(4);
            } else if (item.wrongHint) {
              recordWrong({ title: T("Not that one.", "Ese no es."), body: item.wrongHint[lang] });
            }
          }}
        />
      )}

      <NudgeToast text={nudge} onDismiss={dismiss} />
      <ShowMeHighlight
        targetId={showMeTargetId}
        label={SHOW_ME_LABEL[lang]}
        onDismiss={() => setShowMeTarget(null)}
      />
    </div>
  );
}
