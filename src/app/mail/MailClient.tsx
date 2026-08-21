"use client";

import { useState } from "react";
import { useWindowManager } from "@/lib/window-manager";
import { useProgress } from "@/lib/progress-context";
import {
  MAIL_COPY,
  BODY,
  STARTERS,
  LESSONS,
  FILES,
  EMAILS,
  CONFIDENCE_OPTIONS,
} from "@/lib/tasks/mail/content";
import type { Lang } from "@/lib/task-types";
import { useNudge } from "@/lib/use-nudge";
import ConfidenceCheck from "@/components/task/ConfidenceCheck";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import PickerModal from "@/components/task/PickerModal";
import SettingsPopover from "@/components/task/SettingsPopover";

type View = "empty" | "read" | "compose" | "done";

export default function MailClient() {
  const [lang, setLang] = useState<Lang>("en");
  const [plain, setPlain] = useState(true);
  const [speak, setSpeak] = useState(false);
  const [step, setStep] = useState(0);
  const [view, setView] = useState<View>("empty");
  const [body, setBody] = useState("");
  const [attached, setAttached] = useState(false);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const [picker, setPicker] = useState(false);
  const { nudge, say } = useNudge();
  const { minimizeActive } = useWindowManager();
  const { markComplete } = useProgress();

  const c = MAIL_COPY[lang];
  const T = (en: string, es: string) => (lang === "en" ? en : es);

  const advance = (n: number) => setStep((s) => (s < n ? n : s));

  const lessonIdx = Math.min(step, 4);
  const lesson = LESSONS[lang][lessonIdx];

  const openMail = () => {
    setView("read");
    advance(1);
  };
  const wrongMail = () =>
    say(T("That one isn't from your manager. Look for the email from Maria Delgado.", "Ese no es de tu gerente. Busca el correo de Maria Delgado."));

  const startReply = () => {
    setView("compose");
    advance(2);
  };
  const wrongForward = () =>
    say(T("Forward sends Maria's email to someone else. To answer her, click Reply.", "Reenviar manda el correo de Maria a otra persona. Para contestarle, haz clic en Responder."));

  const wrongCompose = () =>
    say(T("Compose starts a brand-new email. To answer Maria, open her email and click Reply.", "Redactar empieza un correo nuevo. Para contestarle a Maria, abre su correo y haz clic en Responder."));

  const trySend = () => {
    if (!body.trim()) return say(T("Write a short message first — even one sentence is fine.", "Primero escribe un mensaje corto — una oración está bien."));
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
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--surface-muted)] text-[15px] text-[var(--text-primary)]">
      {/* task bar */}
      <div className="flex items-center gap-3 border-b border-[var(--border)] bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-[13px] text-white">
            ✉
          </span>
          <span className="text-[15px] font-medium">WorkMail</span>
        </div>

        <div className="flex-1" />

        <button
          onClick={() => setHelp(true)}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[var(--warning-tint)] px-4 text-[14px] font-medium text-[var(--warning)] hover:brightness-95 cursor-pointer"
        >
          ? {c.helpBtn}
        </button>

        <SettingsPopover
          langLabel={c.langBtn}
          onToggleLang={() => setLang(lang === "en" ? "es" : "en")}
          plain={plain}
          onTogglePlain={() => setPlain((v) => !v)}
          speak={speak}
          onToggleSpeak={() => {
            setSpeak((v) => !v);
            if (!speak) say(T("Read aloud is on. Click any text to hear it.", "Lectura en voz alta activada."));
          }}
          labels={{
            language: T("Language", "Idioma"),
            simpleWords: T("Simple words", "Palabras simples"),
            readAloud: T("Read aloud", "Leer en voz alta"),
          }}
        />
      </div>

      {/* main two-pane area */}
      <div className="flex flex-1 min-h-0">
        {/* inbox */}
        <div className="flex w-[280px] shrink-0 flex-col border-r border-[var(--border)] bg-white sm:w-[320px]">
          <div className="p-3">
            <button
              onClick={wrongCompose}
              className="flex min-h-[44px] w-full items-center gap-2 rounded-full bg-[var(--accent-tint)] px-4 text-[14px] font-medium text-[var(--accent)] hover:bg-[#d8e6fb] cursor-pointer"
            >
              ✎ {c.compose}
            </button>
          </div>
          <div className="flex items-center justify-between px-4 pb-2 text-[13px] font-medium text-[var(--text-secondary)]">
            <span>{c.inbox}</span>
            <span className="rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-[12px]">{EMAILS.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {EMAILS.map((m) => {
              const unread = m.isTarget && view === "empty";
              return (
                <button
                  key={m.key}
                  onClick={m.isTarget ? openMail : wrongMail}
                  className="flex w-full items-start gap-3 border-b border-[var(--surface-muted)] px-4 py-3 text-left hover:bg-[var(--surface-muted)] cursor-pointer"
                  style={{ background: unread ? "#f4f9fd" : undefined }}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white"
                    style={{ background: m.color }}
                  >
                    {m.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className={`truncate text-[14px] ${unread ? "font-semibold text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
                        {m.from}
                      </span>
                      <span className="shrink-0 text-[12px] text-[var(--text-tertiary)]">{m.time}</span>
                    </div>
                    <div className={`truncate text-[14px] ${unread ? "font-semibold text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
                      {m.subject[lang]}
                    </div>
                    <div className="truncate text-[13px] text-[var(--text-tertiary)]">{m.preview[lang]}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* content pane */}
        <div className="min-w-0 flex-1 overflow-y-auto">
          {view === "empty" && (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
              <div className="h-10 w-14 rounded-lg border-2 border-[var(--border-strong)]" />
              <p className="max-w-[280px] text-[16px] text-[var(--text-tertiary)]">{c.emptyPane}</p>
            </div>
          )}

          {view === "read" && (
            <div className="p-6 sm:p-8">
              <h2 className="mb-4 text-[21px] font-medium leading-tight">{c.emailSubject}</h2>
              <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-[14px] font-semibold text-white">
                  MD
                </div>
                <div>
                  <div className="text-[14px] font-medium">Maria Delgado · {c.supervisor}</div>
                  <div className="text-[13px] text-[var(--text-tertiary)]">maria.delgado@harborsidecafe.com</div>
                </div>
                <div className="flex-1" />
                <div className="text-[13px] text-[var(--text-tertiary)]">8:14 AM</div>
              </div>
              <div className="flex max-w-[60ch] flex-col gap-3.5 py-5 text-[16px] leading-relaxed">
                {(plain ? BODY[lang].plain : BODY[lang].full).map((p, i) => (
                  <p key={i} className="m-0">{p}</p>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={startReply}
                  className="inline-flex min-h-[46px] items-center rounded-full bg-[var(--accent)] px-6 text-[15px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
                >
                  {c.reply}
                </button>
                <button
                  onClick={wrongForward}
                  className="inline-flex min-h-[46px] items-center rounded-full border border-[var(--border)] px-5 text-[15px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] cursor-pointer"
                >
                  {c.forward}
                </button>
              </div>
            </div>
          )}

          {view === "compose" && (
            <div className="p-6 sm:p-8">
              <div className="mb-3 flex gap-3 border-b border-[var(--border)] pb-2.5 text-[14px]">
                <span className="w-14 shrink-0 text-[var(--text-tertiary)]">{c.to}</span>
                <span>maria.delgado@harborsidecafe.com</span>
              </div>
              <div className="mb-3 flex gap-3 border-b border-[var(--border)] pb-2.5 text-[14px]">
                <span className="w-14 shrink-0 text-[var(--text-tertiary)]">{c.subjectLabel}</span>
                <span>{c.reSubject}</span>
              </div>
              <textarea
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  if (e.target.value.trim().length > 3) advance(3);
                }}
                placeholder={c.writeHere}
                className="min-h-[130px] w-full resize-y border-none py-3 text-[16px] leading-relaxed outline-none placeholder:text-[var(--text-tertiary)]"
              />
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-[12px] font-medium text-[var(--text-tertiary)]">{c.startersLabel}:</span>
                {STARTERS[lang].map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setBody((b) => (b ? b + " " : "") + s);
                      advance(3);
                    }}
                    className="min-h-[38px] rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 text-[13px] font-medium text-[var(--accent)] hover:bg-[var(--accent-tint)] cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {attached && (
                <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-[#b9dcd1] bg-[var(--success-tint)] px-3 py-2">
                  <span className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ background: "#1e8e3e" }}>
                    PDF
                  </span>
                  <span className="text-[14px] font-medium text-[#1e5a4c]">safety-report-july.pdf</span>
                  <span className="text-[12px] text-[#497f70]">248 KB</span>
                  <button
                    onClick={() => setAttached(false)}
                    aria-label={T("Remove attachment", "Quitar adjunto")}
                    className="ml-1 text-[16px] text-[#497f70] cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4">
                <button
                  onClick={trySend}
                  className="inline-flex min-h-[46px] items-center rounded-full bg-[var(--accent)] px-6 text-[15px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
                >
                  {c.send}
                </button>
                <button
                  onClick={() => setPicker(true)}
                  className="inline-flex min-h-[46px] items-center rounded-full border border-[var(--border)] px-5 text-[15px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] cursor-pointer"
                >
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
                  className="min-h-[40px] px-2 text-[14px] text-[var(--text-tertiary)] cursor-pointer"
                >
                  {c.discard}
                </button>
              </div>
            </div>
          )}

          {view === "done" && (
            <div className="flex flex-col gap-5 p-6 sm:p-8">
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-wide text-[var(--success)]">
                  {c.sentKicker}
                </div>
                <h2 className="mt-1.5 text-[24px] font-medium leading-tight">{c.doneTitle}</h2>
                <p className="mt-2 max-w-[60ch] text-[16px] leading-relaxed text-[var(--text-secondary)]">
                  {c.doneBody}
                </p>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-[var(--warning-tint)] bg-[var(--warning-tint)] p-4">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-[#3c4043] leading-tight text-white">
                  <span className="text-[9px] tracking-wide">SKILL</span>
                  <span className="text-[19px] font-semibold">01</span>
                </div>
                <div>
                  <div className="text-[16px] font-medium">{c.badgeName}</div>
                  <div className="mt-0.5 text-[13px] text-[var(--text-secondary)]">{c.badgeWhere}</div>
                </div>
              </div>

              <ConfidenceCheck
                question={c.confidenceQ}
                options={CONFIDENCE_OPTIONS[lang]}
                selected={confidence}
                onSelect={setConfidence}
              />

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={restart}
                  className="inline-flex min-h-[46px] items-center rounded-full bg-[var(--accent)] px-5 text-[15px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
                >
                  {c.tryAgain}
                </button>
                <button
                  onClick={minimizeActive}
                  className="inline-flex min-h-[46px] items-center rounded-full border border-[var(--border)] px-5 text-[15px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] cursor-pointer"
                >
                  {c.backToDesk}
                </button>
              </div>
            </div>
          )}
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
