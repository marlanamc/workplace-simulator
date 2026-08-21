"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  APP_DEFS,
  APP_COPY,
  DESKTOP_COPY,
  RECENT_ITEMS,
  type AppKey,
  type Lang,
} from "@/lib/desktop-content";
import { useNudge } from "@/lib/use-nudge";
import NudgeToast from "@/components/task/NudgeToast";

const DONE_COUNT = 1;
const TOTAL_COUNT = APP_DEFS.length;

function badgeStyle(state: "ready" | "done" | "locked") {
  if (state === "done") return "bg-[var(--success-tint)] text-[var(--success)]";
  if (state === "locked") return "bg-[var(--surface-muted)] text-[var(--text-tertiary)]";
  return "bg-[var(--warning-tint)] text-[var(--warning)]";
}

function AppIcon({ icon, color, size = 44 }: { icon: string; color: string; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-2xl text-white"
      style={{ background: color, width: size, height: size, fontSize: Math.round(size * 0.44) }}
    >
      {icon}
    </span>
  );
}

export default function DesktopPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [openApp, setOpenApp] = useState<AppKey | null>(null);
  const { nudge, say } = useNudge(4200);

  const c = DESKTOP_COPY[lang];
  const appCopy = APP_COPY[lang];

  const focusApp = APP_DEFS[0];
  const activeApp = openApp ? APP_DEFS.find((a) => a.key === openApp) : null;

  const filteredApps = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return APP_DEFS;
    return APP_DEFS.filter((a) => appCopy[a.key].name.toLowerCase().includes(q));
  }, [query, appCopy]);

  const closeLauncher = () => {
    setLauncherOpen(false);
    setQuery("");
  };

  const openFromLauncher = (key: AppKey) => {
    setOpenApp(key);
    closeLauncher();
  };

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden text-[15px]"
      style={{ color: "var(--text-primary)" }}
    >
      {/* wallpaper */}
      <div
        className="fixed inset-0 -z-10"
        style={{ background: "linear-gradient(155deg, #3f6fd1 0%, #6b7fe0 45%, #a679d8 78%, #c98fd6 100%)" }}
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,241,199,0.55) 0%, rgba(255,241,199,0.18) 22%, transparent 42%)",
        }}
      />

      {/* top strip: practice banner + language */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2 text-[12px] font-medium tracking-wide text-white/85 uppercase">
          {c.practiceBanner}
        </div>
        <button
          onClick={() => setLang(lang === "en" ? "es" : "en")}
          className="rounded-full border border-white/50 bg-white/20 px-4 py-2 text-[13px] font-medium text-white backdrop-blur-sm hover:bg-white/30 cursor-pointer"
        >
          {c.langBtn}
        </button>
      </div>

      {/* single focus card — one task, one action */}
      <div className="flex-1 flex items-center justify-center px-5 pb-24">
        <div className="w-full max-w-[420px] rounded-2xl bg-white p-7 flex flex-col gap-5 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_20px_44px_rgba(20,20,50,0.28)] animate-fade-up">
          <div className="flex items-center gap-3">
            <AppIcon icon={focusApp.icon} color={focusApp.color} size={44} />
            <div>
              <div className="text-[12px] font-medium uppercase tracking-wide text-[var(--accent)]">
                {c.nextLabel}
              </div>
              <div className="text-[21px] font-medium leading-tight text-[var(--text-primary)]">
                {c.focusHeadline}
              </div>
            </div>
          </div>

          <p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">
            {appCopy.mail.brief}
          </p>

          <Link
            href="/mail"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[var(--accent)] px-6 text-[16px] font-medium text-white hover:bg-[var(--accent-hover)]"
          >
            {c.focusCta}
          </Link>

          <div className="flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-muted)]">
              <div
                className="h-full rounded-full bg-[var(--accent)]"
                style={{ width: `${Math.round((DONE_COUNT / TOTAL_COUNT) * 100)}%` }}
              />
            </div>
            <span className="whitespace-nowrap text-[13px] font-medium text-[var(--text-tertiary)]">
              {DONE_COUNT}/{TOTAL_COUNT} {c.progressWord}
            </span>
          </div>
        </div>
      </div>

      {/* shelf */}
      <div className="relative z-30 flex h-14 items-center gap-1 border-t border-white/25 bg-[#2a2f38]/55 px-2 backdrop-blur-xl">
        <button
          onClick={() => (launcherOpen ? closeLauncher() : setLauncherOpen(true))}
          aria-label={c.appsBtn}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full cursor-pointer"
          style={{
            background: "radial-gradient(circle at 34% 32%, #fff 0%, #dbe6f4 55%, #a9c0d2 100%)",
            boxShadow: launcherOpen ? "0 0 0 2px #fff, 0 0 0 4px rgba(255,255,255,0.35)" : "inset 0 0 0 1px rgba(0,0,0,0.08)",
          }}
        />
        <div className="flex flex-1 justify-center gap-1">
          {APP_DEFS.slice(0, 6).map((a) => (
            <button
              key={a.key}
              title={appCopy[a.key].name}
              onClick={() => setOpenApp(a.key)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[16px] text-white cursor-pointer hover:bg-white/10"
            >
              <AppIcon icon={a.icon} color={a.color} size={30} />
            </button>
          ))}
        </div>
        {/* system tray */}
        <div className="flex items-center gap-2.5 pr-2 text-white/90">
          <span className="text-[13px]" title={lang === "en" ? "Wi-Fi connected" : "Wi-Fi conectado"}>▂▄▆</span>
          <span className="text-[13px]" title={lang === "en" ? "Battery" : "Batería"}>▮</span>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--danger)] px-1 text-[10px] font-semibold text-white">
            1
          </span>
          <span className="ml-1 whitespace-nowrap text-[13px] font-medium">
            Aug 19 · 9:12
          </span>
        </div>
      </div>

      {/* launcher panel */}
      {launcherOpen && (
        <div className="fixed inset-0 z-40" onClick={closeLauncher}>
          <div
            className="absolute bottom-[62px] left-2 flex w-[560px] max-w-[calc(100vw-16px)] max-h-[calc(100vh-90px)] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(10,15,40,0.35)] animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* search bar */}
            <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3.5">
              <span className="text-[17px] text-[var(--text-tertiary)]" aria-hidden>⌕</span>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={c.searchPlaceholder}
                className="flex-1 border-none text-[15px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
              />
            </div>

            <div className="overflow-y-auto">
              {!query && (
                <>
                  <div className="flex items-center justify-between px-4 pt-3.5 pb-1.5">
                    <span className="text-[13px] font-medium text-[var(--text-secondary)]">{c.continueLabel}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 px-2 pb-2">
                    {RECENT_ITEMS.map((r, i) => (
                      <button
                        key={i}
                        onClick={() => openFromLauncher(r.appKey)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[var(--surface-muted)] cursor-pointer"
                      >
                        <AppIcon icon={r.icon} color={r.color} size={34} />
                        <div className="min-w-0">
                          <div className="truncate text-[13px] font-medium text-[var(--text-primary)]">
                            {r.title[lang]}
                          </div>
                          <div className="truncate text-[12px] text-[var(--text-tertiary)]">
                            {r.subtitle[lang]}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mx-4 h-px bg-[var(--border)]" />
                </>
              )}

              <div className="px-4 pt-3 pb-1.5 text-[13px] font-medium text-[var(--text-secondary)]">
                {c.todayLabel}
              </div>
              {filteredApps.length === 0 ? (
                <div className="px-4 pb-6 text-[14px] text-[var(--text-tertiary)]">
                  {lang === "en" ? "No apps match your search." : "No hay apps que coincidan."}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-1 px-2 pb-3">
                  {filteredApps.map((a) => {
                    const cp = appCopy[a.key];
                    return (
                      <button
                        key={a.key}
                        onClick={() => openFromLauncher(a.key)}
                        className="flex flex-col items-center gap-2 rounded-xl px-2 py-3.5 hover:bg-[var(--surface-muted)] cursor-pointer"
                      >
                        <AppIcon icon={a.icon} color={a.color} size={48} />
                        <span className="text-center text-[13px] leading-tight text-[var(--text-primary)]">
                          {cp.name}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badgeStyle(a.state)}`}>
                          {a.state === "done" ? c.done : a.state === "locked" ? c.locked : c.ready}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* app detail sheet */}
      {activeApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
          onClick={() => setOpenApp(null)}
        >
          <div
            className="w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start gap-3">
              <AppIcon icon={activeApp.icon} color={activeApp.color} size={44} />
              <div className="flex-1">
                <div className="text-[12px] font-medium uppercase tracking-wide text-[var(--accent)]">
                  {appCopy[activeApp.key].kicker}
                </div>
                <h3 className="mt-1 text-[20px] font-medium leading-tight">
                  {appCopy[activeApp.key].name}
                </h3>
              </div>
              <button
                onClick={() => setOpenApp(null)}
                aria-label={c.back}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[16px] text-[var(--text-secondary)] cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="mb-4 text-[15px] leading-relaxed text-[var(--text-secondary)]">
              {appCopy[activeApp.key].brief}
            </p>
            <div className="mb-5 flex flex-col gap-2">
              {appCopy[activeApp.key].points.map((p, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg bg-[var(--surface-muted)] px-3 py-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-tint)] text-[11px] font-semibold text-[var(--accent)]">
                    {i + 1}
                  </span>
                  <span className="text-[14px] leading-snug text-[var(--text-primary)]">{p}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              {activeApp.href ? (
                <Link
                  href={activeApp.href}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--accent)] px-5 text-[15px] font-medium text-white hover:bg-[var(--accent-hover)]"
                >
                  {c.start}
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setOpenApp(null);
                    say(lang === "en" ? "Coming soon in the full build." : "Próximamente en la versión completa.");
                  }}
                  className="inline-flex min-h-[48px] cursor-not-allowed items-center justify-center rounded-full bg-[var(--surface-muted)] px-5 text-[15px] font-medium text-[var(--text-tertiary)]"
                >
                  {c.soon}
                </button>
              )}
              <button
                onClick={() => setOpenApp(null)}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--border)] px-5 text-[15px] font-medium text-[var(--text-secondary)] cursor-pointer"
              >
                {c.back}
              </button>
            </div>
          </div>
        </div>
      )}

      <NudgeToast text={nudge} bottom={76} />
    </div>
  );
}
