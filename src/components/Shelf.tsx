"use client";

import { useMemo, useRef, useState } from "react";
import {
  APP_DEFS,
  APP_COPY,
  DESKTOP_COPY,
  RECENT_ITEMS,
  type AppKey,
  type AppState,
  type Lang,
} from "@/lib/desktop-content";
import { useWindowManager } from "@/lib/window-manager";
import { useNudge } from "@/lib/use-nudge";
import { useClickOutside } from "@/lib/use-click-outside";
import NudgeToast from "@/components/task/NudgeToast";
import { logout } from "@/app/actions";

export const SHELF_HEIGHT = 56;

function badgeStyle(state: AppState) {
  if (state === "done") return "bg-[var(--success-tint)] text-[var(--success)]";
  if (state === "locked") return "bg-[var(--surface-muted)] text-[var(--text-tertiary)]";
  return "bg-[var(--warning-tint)] text-[var(--warning)]";
}

function WifiIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="18" r="1.6" fill="currentColor" />
      <path d="M8.2 14.6a5.4 5.4 0 0 1 7.6 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4.8 11.2a10.2 10.2 0 0 1 14.4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
      <path d="M1.6 7.8a15 15 0 0 1 20.8 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

function BatteryIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="1.5" y="7.5" width="18" height="9" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3.5" y="9.5" width="12" height="5" rx="1" fill="currentColor" />
      <path d="M21.5 10.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function AppIcon({ icon, color, size = 44 }: { icon: string; color: string; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-2xl text-white"
      style={{ background: color, width: size, height: size, fontSize: Math.round(size * 0.44) }}
    >
      {icon}
    </span>
  );
}

export default function Shelf({ displayName }: { displayName: string }) {
  const [lang, setLang] = useState<Lang>("en");
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [infoApp, setInfoApp] = useState<AppKey | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [brightness, setBrightness] = useState(80);
  const { nudge, say } = useNudge(4200);
  const { openApp, toggleFromShelf, isOpen } = useWindowManager();

  const c = DESKTOP_COPY[lang];
  const appCopy = APP_COPY[lang];
  const activeApp = infoApp ? APP_DEFS.find((a) => a.key === infoApp) : null;

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
    setInfoApp(key);
    closeLauncher();
  };

  const accountBoxRef = useRef<HTMLDivElement>(null);
  const launcherPanelRef = useRef<HTMLDivElement>(null);
  useClickOutside(accountBoxRef, accountOpen, () => setAccountOpen(false));
  useClickOutside(launcherPanelRef, launcherOpen, closeLauncher);

  return (
    <>
      {/* shelf */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-1 border-t border-white/25 bg-[#2a2f38]/85 px-2 backdrop-blur-xl"
        style={{ height: SHELF_HEIGHT }}
      >
        <button
          onClick={() => {
            setAccountOpen(false);
            if (launcherOpen) closeLauncher();
            else setLauncherOpen(true);
          }}
          aria-label={c.appsBtn}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full cursor-pointer"
          style={{
            background: "radial-gradient(circle at 34% 32%, #fff 0%, #dbe6f4 55%, #a9c0d2 100%)",
            boxShadow: launcherOpen ? "0 0 0 2px #fff, 0 0 0 4px rgba(255,255,255,0.35)" : "inset 0 0 0 1px rgba(0,0,0,0.08)",
          }}
        />
        <div className="flex flex-1 justify-center gap-1">
          {APP_DEFS.map((a) => (
            <button
              key={a.key}
              title={appCopy[a.key].name}
              onClick={() => toggleFromShelf(a.key)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[16px] text-white cursor-pointer hover:bg-white/10"
            >
              <AppIcon icon={a.icon} color={a.color} size={30} />
              {isOpen(a.key) && (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-white" aria-hidden />
              )}
            </button>
          ))}
        </div>
        {/* system tray — click opens the account menu, like ChromeOS */}
        <div className="relative" ref={accountBoxRef}>
          <button
            onClick={() => {
              closeLauncher();
              setAccountOpen((v) => !v);
            }}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-white/90 cursor-pointer hover:bg-white/10"
            style={accountOpen ? { background: "rgba(255,255,255,0.14)" } : undefined}
          >
            <span title={lang === "en" ? "Wi-Fi connected" : "Wi-Fi conectado"}><WifiIcon /></span>
            <span title={lang === "en" ? "Battery" : "Batería"}><BatteryIcon /></span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--danger)] px-1 text-[10px] font-semibold text-white">
              1
            </span>
            <span className="ml-1 whitespace-nowrap text-[13px] font-medium">
              Aug 19 · 9:12
            </span>
          </button>

          {accountOpen && (
              <div
                className="absolute right-0 bottom-[46px] z-40 w-[336px] rounded-2xl bg-[#202124] p-3 text-white shadow-[0_20px_50px_rgba(0,0,0,0.45)] animate-fade-up"
              >
                {/* account row */}
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[13px] font-semibold text-white">
                    {displayName.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{displayName}</span>
                  <form action={logout}>
                    <button
                      type="submit"
                      className="rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] font-medium text-white hover:bg-white/20 cursor-pointer"
                    >
                      {lang === "en" ? "Sign out" : "Cerrar sesión"}
                    </button>
                  </form>
                  <button
                    title={lang === "en" ? "Settings (not available here)" : "Ajustes (no disponible aquí)"}
                    onClick={() => say(lang === "en" ? "Settings aren't part of this practice space." : "Los ajustes no son parte de este espacio de práctica.")}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[15px] hover:bg-white/10 cursor-pointer"
                  >
                    ⚙
                  </button>
                  <button
                    onClick={() => setAccountOpen(false)}
                    aria-label={lang === "en" ? "Collapse" : "Cerrar"}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] hover:bg-white/10 cursor-pointer"
                  >
                    ⌄
                  </button>
                </div>

                {/* tile row */}
                <div className="mb-3 grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => say(lang === "en" ? "Wi-Fi is always on in this practice space." : "El Wi-Fi siempre está activo en este espacio de práctica.")}
                    className="flex flex-col items-center gap-1.5 rounded-xl bg-white/8 py-2.5 hover:bg-white/12 cursor-pointer"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-white"><WifiIcon size={16} /></span>
                    <span className="text-[11px] font-medium leading-none">{lang === "en" ? "Wi-Fi" : "Wi-Fi"}</span>
                    <span className="text-[10px] leading-none text-white/60">{lang === "en" ? "Connected" : "Conectado"}</span>
                  </button>
                  <button
                    onClick={() => setLang(lang === "en" ? "es" : "en")}
                    className="flex flex-col items-center gap-1.5 rounded-xl bg-white/8 py-2.5 hover:bg-white/12 cursor-pointer"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-[13px]">🌐</span>
                    <span className="text-[11px] font-medium leading-none">{lang === "en" ? "Language" : "Idioma"}</span>
                    <span className="text-[10px] leading-none text-white/60">{c.langBtn}</span>
                  </button>
                  <button
                    onClick={() => say(lang === "en" ? "Accessibility options aren't part of this practice space." : "Las opciones de accesibilidad no son parte de este espacio de práctica.")}
                    className="flex flex-col items-center gap-1.5 rounded-xl bg-white/8 py-2.5 hover:bg-white/12 cursor-pointer"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-[13px]">♿</span>
                    <span className="text-[11px] font-medium leading-none">{lang === "en" ? "Accessibility" : "Accesibilidad"}</span>
                    <span className="text-[10px] leading-none text-white/60">{lang === "en" ? "Off" : "Inactivo"}</span>
                  </button>
                </div>

                {/* brightness slider — the one real control here */}
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-[13px]">☀</span>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="flex-1 accent-[var(--accent)]"
                    aria-label={lang === "en" ? "Screen brightness" : "Brillo de pantalla"}
                  />
                </div>

                {/* footer */}
                <div className="flex items-center justify-between border-t border-white/10 pt-2.5 text-[12px] text-white/70">
                  <span>Aug 19 · 9:12</span>
                  <span>{lang === "en" ? "Practice device" : "Dispositivo de práctica"}</span>
                </div>
              </div>
          )}
        </div>
      </div>

      {/* screen dimming tied to the brightness slider — a genuine control, not a decoration */}
      <div
        className="pointer-events-none fixed inset-0 z-[35] bg-black transition-opacity"
        style={{ opacity: (100 - brightness) / 220 }}
      />

      {/* launcher panel */}
      {launcherOpen && (
          <div
            ref={launcherPanelRef}
            className="fixed bottom-[62px] left-2 z-40 flex w-[560px] max-w-[calc(100vw-16px)] max-h-[calc(100vh-90px)] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(10,15,40,0.35)] animate-fade-up"
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
                        onClick={() => {
                          openApp(r.appKey, { tab: r.tab });
                          closeLauncher();
                        }}
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
      )}

      {/* app detail sheet */}
      {activeApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
          onClick={() => setInfoApp(null)}
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
                onClick={() => setInfoApp(null)}
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
              {activeApp.state !== "locked" ? (
                <button
                  onClick={() => {
                    openApp(activeApp.key);
                    setInfoApp(null);
                  }}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--accent)] px-5 text-[15px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
                >
                  {c.start}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setInfoApp(null);
                    say(lang === "en" ? "Coming soon in the full build." : "Próximamente en la versión completa.");
                  }}
                  className="inline-flex min-h-[48px] cursor-not-allowed items-center justify-center rounded-full bg-[var(--surface-muted)] px-5 text-[15px] font-medium text-[var(--text-tertiary)]"
                >
                  {c.soon}
                </button>
              )}
              <button
                onClick={() => setInfoApp(null)}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--border)] px-5 text-[15px] font-medium text-[var(--text-secondary)] cursor-pointer"
              >
                {c.back}
              </button>
            </div>
          </div>
        </div>
      )}

      <NudgeToast text={nudge} bottom={SHELF_HEIGHT + 20} />
    </>
  );
}
