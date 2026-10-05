"use client";

import { useState, type ReactNode } from "react";
import { ArrowLeft, FileText, Inbox, Pencil, Search, Send, Star } from "lucide-react";
import { useProgress } from "@/lib/progress-context";
import { OPENING_CLUTTER } from "@/lib/tasks/mail/content";
import type { ConfidenceScenario } from "@/lib/tasks/confidence/content";
import SettingsPopover from "@/components/task/SettingsPopover";

type View = "home" | "read" | "edit" | "sent";

/** MailClient's original Mail chrome, with lesson-owned drafts and assessment. */
export default function LessonMail({ scenario, view, onView, onReply, onResume, onCompose, newMessage, compose, sources, sent, sentCount, hasDraft }: {
  scenario: ConfidenceScenario;
  view: View;
  onView: (view: View) => void;
  onReply: () => void;
  onResume: () => void;
  onCompose: () => void;
  newMessage: boolean;
  compose: ReactNode;
  sources: ReactNode;
  sent: ReactNode;
  sentCount: number;
  hasDraft: boolean;
}) {
  const { lang, bigText, setBigText } = useProgress();
  const t = (en: string, es: string) => lang === "es" ? es : en;
  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState("inbox");
  const [opened, setOpened] = useState<string | null>(null);
  const [starred, setStarred] = useState<string[]>([]);
  const [read, setRead] = useState<string[]>([]);
  const person = (scenario.recipient ?? "").split("@")[0].split(/[._-]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
  const rows = [
    { key: "request", from: person, initials: person.split(" ").map(s => s[0]).join("").slice(0, 2), color: "#1a73e8", subject: scenario.title[lang], preview: scenario.request[lang], body: [scenario.request[lang]] },
    ...OPENING_CLUTTER.map(m => ({ key: m.key, from: m.from, initials: m.initials, color: m.color, subject: m.subject[lang], preview: m.preview[lang], body: m.body?.[lang] ?? [m.preview[lang]] })),
  ];
  const message = opened ? rows.find(r => r.key === opened) : rows[0];
  const listing = view === "home";
  const visibleRows = rows.filter(r => (folder !== "starred" || starred.includes(r.key)) && `${r.from} ${r.subject} ${r.preview}`.toLowerCase().includes(query.toLowerCase()));
  const requestVisible = folder !== "drafts" && visibleRows.some(row => row.key === "request");
  const navigate = (next: string) => {
    setFolder(next); setOpened(null);
    onView(next === "sent" ? "sent" : "home");
  };
  const back = () => { setOpened(null); onView("home"); };
  return <div data-testid="lesson-mail" className="@container flex min-h-full min-w-0 flex-col bg-[#f6f8fc] text-[14px] text-[#202124]" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
    <div className="flex items-center gap-3 px-3 py-2">
      <div data-testid="mail-app-title" className="flex shrink-0 items-center gap-2 px-2 @min-[720px]:w-[180px]">
        <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#ea4335] text-[15px] font-bold text-white">M</span>
        <span className="hidden text-[22px] font-normal text-[#5f6368] @min-[440px]:inline">{t("Mail", "Correo")}</span>
      </div>
      <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full bg-[#e9eef6] px-4 text-[#444746]">
        <Search size={20} className="shrink-0" aria-hidden />
        <input data-showme={listing && !requestVisible && query ? "lesson-mail-target" : undefined} aria-label={t("Search mail", "Buscar correo")} placeholder={t("Search mail", "Buscar correo")} value={query} onChange={e => { setQuery(e.target.value); setFolder("inbox"); setOpened(null); onView("home"); }} className="min-w-0 flex-1 bg-transparent text-[16px] outline-none" />
      </label>
      <SettingsPopover bigText={bigText} onToggleBigText={() => setBigText(!bigText)} label={t("Bigger text", "Letra más grande")} />
    </div>
    <div className="flex min-h-[480px] flex-1">
      <nav aria-label={t("Mail folders", "Carpetas de correo")} className="flex w-14 shrink-0 flex-col gap-1 px-1 pt-1 @min-[720px]:w-[200px] @min-[720px]:px-3">
        <button type="button" onClick={() => { setOpened(null); setFolder("inbox"); onCompose(); }} className="mb-4 flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-white px-3 font-medium text-[#001d35] shadow-md @min-[720px]:justify-start" aria-label={t("Compose", "Redactar")}><Pencil size={20} aria-hidden /><span className="hidden @min-[720px]:inline">{t("Compose", "Redactar")}</span></button>
        {[
          { id: "inbox", label: t("Inbox", "Recibidos"), icon: Inbox, count: read.includes("request") ? 0 : 1 },
          { id: "starred", label: t("Starred", "Destacados"), icon: Star, count: starred.length },
          { id: "sent", label: t("Sent", "Enviados"), icon: Send, count: sentCount },
          { id: "drafts", label: t("Drafts", "Borradores"), icon: FileText, count: hasDraft ? 1 : 0 },
        ].map(item => <button data-showme={listing && !requestVisible && !query && item.id === "inbox" ? "lesson-mail-target" : undefined} key={item.id} type="button" aria-label={`${item.label} (${item.count})`} aria-current={(view === "sent" ? item.id === "sent" : folder === item.id) ? "page" : undefined} onClick={() => navigate(item.id)} className={`flex min-h-11 items-center justify-center gap-3 rounded-r-full px-2 @min-[720px]:justify-start ${((view === "sent" && item.id === "sent") || (view !== "sent" && folder === item.id)) ? "bg-[#d3e3fd] font-medium text-[#001d35]" : "text-[#444746] hover:bg-[#e8eaed]"}`}><item.icon size={18} className="shrink-0" aria-hidden /><span className="hidden flex-1 text-left @min-[720px]:inline">{item.label}</span><span className="hidden text-xs @min-[720px]:inline">{item.count || ""}</span></button>)}
      </nav>
      <main className="min-w-0 flex-1 overflow-hidden rounded-tl-2xl bg-white">
        {listing ? <div data-testid="mail-inbox-list">
          <div className="flex min-h-12 items-center justify-between border-b border-[#e0e3e8] px-4 font-medium"><span>{folder === "starred" ? t("Starred", "Destacados") : folder === "drafts" ? t("Drafts", "Borradores") : t("Inbox", "Recibidos")}</span><span className="text-xs font-normal text-[#444746]">{folder === "drafts" ? (hasDraft ? 1 : 0) : visibleRows.length}</span></div>
          {folder === "drafts" ? (hasDraft ? <button className="w-full border-b p-4 text-left" onClick={() => { setOpened(null); onResume(); }}><span className="mr-3 text-[#b3261e]">{t("Draft", "Borrador")}</span>{scenario.title[lang]}</button> : <p className="p-6 text-[#5f6368]">{t("No drafts", "No hay borradores")}</p>) : <>
            {visibleRows.map(row => <div key={row.key} className="flex items-center border-b border-[#f0f4f9] hover:bg-[#f2f6fc]">
              <button aria-label={`${t("Star", "Destacar")}: ${row.subject}`} aria-pressed={starred.includes(row.key)} onClick={() => setStarred(old => old.includes(row.key) ? old.filter(k => k !== row.key) : [...old, row.key])} className="min-h-11 shrink-0 px-3 text-[#5f6368]"><Star size={18} fill={starred.includes(row.key) ? "#fbbc04" : "none"} aria-hidden /></button>
              <button data-showme={row.key === "request" ? "lesson-mail-target" : undefined} onClick={() => { setOpened(row.key); setRead(old => [...old, row.key]); onView("read"); }} className="flex min-w-0 flex-1 items-start gap-3 py-4 pr-4 text-left">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white" style={{ background: row.color }}>{row.initials}</span>
                <div className="min-w-0 flex-1"><div className={`flex items-baseline justify-between gap-2 ${row.key === "request" && !read.includes(row.key) ? "font-bold" : "font-medium"}`}><span className="truncate">{row.from}</span><span className="shrink-0 text-xs font-normal text-[#444746]">{row.key === "request" ? "10:10 AM" : t("Yesterday", "Ayer")}</span></div><p className={`truncate ${row.key === "request" && !read.includes(row.key) ? "font-bold text-[#001d35]" : "text-[#444746]"}`}>{row.subject}</p><p className="truncate text-[13px] text-[#5f6368]">{row.preview}</p>{row.key === "request" && <span className="sr-only">{scenario.recipient}</span>}</div>
              </button>
            </div>)}
            {!visibleRows.length && <p className="p-6 text-[#5f6368]">{t("No messages found", "No se encontraron mensajes")}</p>}
          </>}
        </div> : view === "sent" ? <div className="p-4 sm:p-6">{sent}</div> : <>
          <button type="button" data-showme={view === "read" && message?.key !== "request" ? "lesson-mail-target" : undefined} data-testid="mail-back-inbox" onClick={back} className="flex min-h-11 items-center gap-3 border-b border-[#e0e3e8] px-5 text-[#0b57d0]"><ArrowLeft size={18} aria-hidden />{t("Back to inbox", "Volver a recibidos")}</button>
          <article className="space-y-5 px-5 py-5 sm:px-8">
            {view === "edit" && newMessage ? compose : <>
            <h2 className="text-[22px] font-normal leading-snug">{message?.subject}</h2>
            <div className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1a73e8] font-medium text-white">{message?.initials}</span><div className="min-w-0"><p className="font-semibold">{message?.from}</p>{message?.key === "request" && <p className="break-all text-xs text-[#5f6368]">{scenario.recipient}</p>}<p className="text-xs text-[#5f6368]">{t("to me", "para mí")}</p></div></div>
            <div className="space-y-4 text-[15px] leading-relaxed">{message?.body.map((line, i) => <p key={i}>{line}</p>)}</div>
            {message?.key === "request" && <>{sources}{view === "read" ? <button data-showme="lesson-mail-target" className="min-h-11 rounded-full border border-[#747775] px-6 text-[#444746] hover:bg-[#f2f6fc]" onClick={onReply}>{t("Reply", "Responder")}</button> : compose}</>}
            </>}
          </article>
        </>}
      </main>
    </div>
  </div>;
}
