"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  MAIL_COPY,
  BODY,
  STARTERS,
  LESSONS,
  FILES,
  EMAILS,
  EVENT_INTRO,
  CONFIDENCE_OPTIONS,
} from "@/lib/tasks/mail/content";
import { useNudge } from "@/lib/use-nudge";
import ConfidenceCheck from "@/components/task/ConfidenceCheck";
import EventIntroCard from "@/components/task/EventIntroCard";
import { TASK_ICONS } from "@/lib/icons";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import PickerModal from "@/components/task/PickerModal";
import SettingsPopover from "@/components/task/SettingsPopover";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import AppHeaderTools from "@/components/task/AppHeaderTools";
import { Paperclip, Star, Inbox, Send, FileText } from "lucide-react";
import NeedAStart from "@/components/task/NeedAStart";
import { sortInboxByTime, storyMailsFor, type InboxRow } from "@/lib/story-beats";

type View = "intro" | "empty" | "read" | "compose" | "done" | "story";

function isStoryMail(m: { key: string }): m is InboxRow {
  return "story" in m && Boolean((m as InboxRow).story) && Array.isArray((m as InboxRow).body?.en);
}

export default function MailClient() {
  const { markComplete, completedTaskKeys, lang, storyFlags } = useProgress();
  const [plain, setPlain] = useState(true);
  const [speak, setSpeak] = useState(false);
  const [step, setStep] = useState(0);
  const [view, setView] = useState<View>(completedTaskKeys.includes("mail") ? "done" : "intro");
  const [body, setBody] = useState("");
  const [attached, setAttached] = useState(false);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const [picker, setPicker] = useState(false);
  const [openStory, setOpenStory] = useState<InboxRow | null>(null);
  const [readStoryKeys, setReadStoryKeys] = useState<string[]>([]);
  const { nudge, say } = useNudge();

  const c = MAIL_COPY[lang];
  const T = (en: string, es: string) => (lang === "en" ? en : es);
  const inbox = sortInboxByTime([...storyMailsFor(completedTaskKeys, storyFlags), ...EMAILS]);
  const mailDone = completedTaskKeys.includes("mail");
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
    say(hint?.[lang] ?? T("That one isn't from your manager. Look for the email from Maria Delgado.", "Ese no es de tu gerente. Busca el correo de Maria Delgado."));

  const startReply = () => {
    setView("compose");
    advance(2);
  };
  const wrongForward = () =>
    say(T("Forward sends Maria's email to someone else. To answer her, click Reply.", "Reenviar manda el correo de Maria a otra persona. Para contestarle, haz clic en Responder."));

  const wrongCompose = () =>
    say(T("Compose starts a brand-new email. To answer Maria, open her email and click Reply.", "Redactar empieza un correo nuevo. Para contestarle a Maria, abre su correo y haz clic en Responder."));

  const trySend = () => {
    if (!body.trim()) return say(T("Write a short message first. Even one sentence is fine.", "Primero escribe un mensaje corto. Una oración está bien."));
    if (!attached) return say(T("Maria asked for the file. Click Attach file before you send.", "Maria pidió el archivo. Haz clic en Adjuntar archivo antes de enviar."));
    setView("done");
    setStep(5);
    markComplete("mail", "reply_with_attachment");
  };

  const restart = () => {
    setStep(0);
    setView("empty");
    setBody("");
    setAttached(false);
    setConfidence(null);
    setHelp(false);
    setPicker(false);
    setOpenStory(null);
  };

  const notThisFolder = () =>
    say(T("Today's mail is in Inbox. Open that instead.", "El correo de hoy está en Recibidos. Ábrelo ahí."));

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f6f8fc] text-[14px] text-[#202124]" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
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
          speak={speak}
          onToggleSpeak={() => {
            setSpeak((v) => !v);
            if (!speak) say(T("Read aloud is on. Click any text to hear it.", "Lectura en voz alta activada."));
          }}
          labels={{
            simpleWords: T("Simple words", "Palabras simples"),
            readAloud: T("Read aloud", "Leer en voz alta"),
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
                const mariaOpen = view === "read" || view === "compose" || view === "done";
                const storyOpen = view === "story" && openStory?.key === m.key;
                const storyRead = Boolean("story" in m && m.story) && (storyOpen || readStoryKeys.includes(m.key));
                const unread = Boolean(m.unread) && !(m.isTarget && (mariaOpen || mailDone)) && !storyRead;
                const selected = (m.isTarget && (view === "read" || view === "compose")) || storyOpen;
                return (
                  <button
                    key={m.key}
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
                      <div className={`truncate text-[13px] ${unread ? "font-bold text-[#001d35]" : "text-[#444746]"}`}>
                        {m.subject[lang]}
                      </div>
                      <div className="truncate text-[12px] text-[#767676]">{m.preview[lang]}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="min-w-0 flex-1 overflow-y-auto">
            {view === "intro" && (
              <EventIntroCard {...EVENT_INTRO[lang]} icon={TASK_ICONS.mail} onContinue={() => setView("empty")} />
            )}

            {view === "empty" && (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-10 text-center">
                <Inbox size={40} strokeWidth={1.25} className="text-[#dadce0]" />
                <p className="max-w-[280px] text-[14px] text-[#5f6368]">{c.emptyPane}</p>
              </div>
            )}

            {(view === "read" || view === "compose") && (
              <div className="px-6 py-4 sm:px-8">
                <h2 className="mb-5 text-[22px] font-normal leading-tight text-[#1f1f1f]">{c.emailSubject}</h2>
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
                      <div className="text-[12px] text-[#5f6368]">8:14 AM</div>
                    </div>
                    <div className="text-[12px] text-[#5f6368]">to me</div>
                    <div className="mt-4 flex max-w-[62ch] flex-col gap-3 text-[14px] leading-[1.6] text-[#1f1f1f]">
                      {(plain ? BODY[lang].plain : BODY[lang].full).map((p, i) => (
                        <p key={i} className="m-0">{p}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {view === "read" && (
                  <div className="mt-6 flex flex-wrap gap-2 pl-[52px]">
                    <button
                      onClick={startReply}
                      className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[#747775] px-5 text-[14px] font-medium text-[#0b57d0] hover:bg-[#f2f6fc] cursor-pointer"
                    >
                      {c.reply}
                    </button>
                    <button
                      onClick={wrongForward}
                      className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[#747775] px-5 text-[14px] font-medium text-[#444746] hover:bg-[#f2f6fc] cursor-pointer"
                    >
                      {c.forward}
                    </button>
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
                      <span>{c.reSubject}</span>
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
                        starters={STARTERS[lang]}
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
                        onClick={trySend}
                        className="inline-flex min-h-[36px] items-center rounded-full bg-[#0b57d0] px-6 text-[14px] font-medium text-white hover:bg-[#0b57d0]/90 cursor-pointer"
                      >
                        {c.send}
                      </button>
                      <button
                        onClick={() => setPicker(true)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-[#444746] hover:bg-[#f2f6fc] cursor-pointer"
                      >
                        <Paperclip size={18} strokeWidth={2} />
                        {c.attach}
                      </button>
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

            {view === "done" && (
              <div className="flex flex-col gap-5 p-6 sm:p-8">
                <TaskDoneCard
                  kicker={c.sentKicker}
                  title={c.doneTitle}
                  body={c.doneBody}
                  badgeNumber="01"
                  badgeName={c.badgeName}
                  badgeWhere={c.badgeWhere}
                />
                <ConfidenceCheck
                  question={c.confidenceQ}
                  options={CONFIDENCE_OPTIONS[lang]}
                  selected={confidence}
                  onSelect={setConfidence}
                />
                <TaskDoneActions
                  tryAgainLabel={c.tryAgain}
                  backToDeskLabel={c.backToDesk}
                  onTryAgain={restart}
                />
              </div>
            )}
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
        askPersonLabel={c.askPerson}
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
              say(item.wrongHint[lang]);
            }
          }}
        />
      )}

      <NudgeToast text={nudge} bottom={32} />
    </div>
  );
}
