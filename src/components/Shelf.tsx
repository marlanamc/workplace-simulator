"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import {
  APP_DEFS,
  APP_COPY,
  DESKTOP_COPY,
  RECENT_ITEMS,
  type AppKey,
  type AppState,
} from "@/lib/desktop-content";
import { useWindowManager } from "@/lib/window-manager";
import { useProgress } from "@/lib/progress-context";
import { useNudge } from "@/lib/use-nudge";
import { QuickSettingsClock, ShelfClock } from "@/components/LiveClock";
import { useClickOutside } from "@/lib/use-click-outside";
import NudgeToast from "@/components/task/NudgeToast";
import { APP_ICONS, TAB_ICONS, Briefcase, ChromeIcon, Languages, Lock, PdfIcon } from "@/lib/icons";
import Link from "next/link";
import { logout } from "@/app/actions";
import { levelForTrack } from "@/lib/tracks-content";
import { dayTitle, remainingTasksInLevel } from "@/lib/shift-spine";

/** Height of the taskbar. */
export const SHELF_HEIGHT = 48;
/** Inset used by app windows and side panels - the taskbar itself is full-width. */
export const SHELF_INSET = 8;
/** Space reserved at the bottom of the screen for the taskbar. */
export const SHELF_RESERVE = SHELF_HEIGHT;

function StartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <rect x="0.5" y="0.5" width="7.6" height="7.6" rx="1.4" fill="currentColor" />
      <rect x="9.9" y="0.5" width="7.6" height="7.6" rx="1.4" fill="currentColor" />
      <rect x="0.5" y="9.9" width="7.6" height="7.6" rx="1.4" fill="currentColor" />
      <rect x="9.9" y="9.9" width="7.6" height="7.6" rx="1.4" fill="currentColor" />
    </svg>
  );
}

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

export function AppIcon({ icon, color, size = 44 }: { icon: ReactNode; color: string; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center text-white"
      style={{
        background: color,
        width: size,
        height: size,
        fontSize: Math.round(size * 0.5),
        borderRadius: Math.round(size * 0.26),
      }}
    >
      {icon}
    </span>
  );
}

/** Both apps get their real-world logo, so this covers every `AppKey`. */
function LucideAppIcon({ appKey, size }: { appKey: AppKey; size: number }) {
  if (appKey === "browser") {
    return <ChromeIcon size={size} />;
  }
  return <PdfIcon size={size} />;
}

function ShelfPin({
  label,
  active = false,
  badge,
  onClick,
  testId,
  children,
}: {
  label: string;
  active?: boolean;
  badge?: string;
  onClick: () => void;
  /** Lets the walkthrough spotlight this pin. */
  testId?: string;
  children: ReactNode;
}) {
  return (
    <button
      data-testid={testId}
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className="relative flex h-12 w-10 items-center justify-center rounded-md text-white cursor-pointer hover:bg-white/10"
      style={active ? { background: "rgba(255,255,255,0.12)" } : undefined}
    >
      {children}
      {badge ? (
        <span
          className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e37400] px-1 text-[9px] font-semibold leading-none text-white"
          aria-hidden
        >
          {badge}
        </span>
      ) : null}
      {active && (
        <span
          className="absolute bottom-[3px] left-1/2 h-[3px] w-4 -translate-x-1/2 rounded-full bg-white"
          aria-hidden
        />
      )}
    </button>
  );
}

export default function Shelf({
  displayName,
  myJobOpen,
  onMyJobOpenChange,
}: {
  displayName: string;
  myJobOpen: boolean;
  onMyJobOpenChange: (open: boolean) => void;
}) {
  const { completedTaskKeys, currentTrack, lang, setLang } = useProgress();
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [infoApp, setInfoApp] = useState<AppKey | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [brightness, setBrightness] = useState(80);
  const { nudge, say, dismiss } = useNudge();
  const { openApp, toggleFromShelf, isOpen } = useWindowManager();
  const currentLevel = levelForTrack(currentTrack.key);
  const leftover = remainingTasksInLevel(currentLevel, completedTaskKeys);
  // Level 0's walkthrough is the one thing on screen for a brand-new learner -
  // the My Job panel would just repeat what the walkthrough already says.
  const myJobLocked = currentLevel.key === "level0" && !completedTaskKeys.includes("tour");

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

  const closeOverlays = () => {
    closeLauncher();
    setAccountOpen(false);
    onMyJobOpenChange(false);
  };

  return (
    <>
      {/* taskbar - Windows-style: icons centered, tray on the right */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 backdrop-blur-2xl"
        style={{
          height: SHELF_HEIGHT,
          background: "rgba(32, 32, 32, 0.88)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <div className="absolute left-3 top-1/2 hidden max-w-[240px] -translate-y-1/2 min-[920px]:block">
          <p className="truncate text-[13px] font-medium leading-tight tracking-[-0.01em] text-white/85">
            {dayTitle(currentLevel, lang)}
          </p>
          {leftover === 0 && (
            // "Day", not "shift" — the Job Card calls this same moment a day
            // ("That's today done"), and two names for one thing is the
            // confusion this pass exists to remove.
            <p className="mt-0.5 truncate text-[11px] leading-tight text-white/55">
              {lang === "en" ? "This day is done" : "Este día está hecho"}
            </p>
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="pointer-events-auto flex items-center gap-0.5">
            <button
              onClick={() => {
                setAccountOpen(false);
                onMyJobOpenChange(false);
                if (launcherOpen) closeLauncher();
                else setLauncherOpen(true);
              }}
              aria-label={c.appsBtn}
              aria-expanded={launcherOpen}
              title={c.appsBtn}
              className="flex h-12 w-10 shrink-0 items-center justify-center rounded-md text-white cursor-pointer hover:bg-white/10"
              style={launcherOpen ? { background: "rgba(255,255,255,0.12)" } : undefined}
            >
              <StartIcon />
            </button>

        {APP_DEFS.map((a) => (
          <ShelfPin
            key={a.key}
            label={appCopy[a.key].name}
            active={isOpen(a.key)}
            onClick={() => {
              closeOverlays();
              toggleFromShelf(a.key);
            }}
          >
            <LucideAppIcon appKey={a.key} size={32} />
          </ShelfPin>
        ))}

        <ShelfPin
          label={
            myJobLocked
              ? lang === "en"
                ? "My tasks · finish the walkthrough first"
                : "Mis tareas · termina la guía primero"
              : leftover > 0
                ? `${lang === "en" ? "My tasks" : "Mis tareas"} · ${
                    leftover === 1 ? c.leftoverOne : c.leftoverMany.replace("{n}", String(leftover))
                  }`
                : lang === "en"
                  ? "My tasks"
                  : "Mis tareas"
          }
          active={myJobOpen}
          testId="shelf-my-job"
          badge={!myJobLocked && leftover > 0 ? String(leftover) : undefined}
          onClick={() => {
            if (myJobLocked) {
              say(
                lang === "en"
                  ? "That list is part of this practice. It opens after you finish looking around."
                  : "Esa lista es parte de esta práctica. Se abre cuando termines de mirar alrededor.",
              );
              return;
            }
            closeLauncher();
            setAccountOpen(false);
            onMyJobOpenChange(!myJobOpen);
          }}
        >
          <span className="relative">
            <AppIcon icon={<Briefcase size={16} strokeWidth={2.25} />} color="#e37400" size={32} />
            {myJobLocked && (
              <span
                className="absolute -right-0.5 -bottom-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#202124] text-white"
                aria-hidden
              >
                <Lock size={9} strokeWidth={2.75} />
              </span>
            )}
          </span>
        </ShelfPin>
          </div>
        </div>

        {/* system tray - stays on the right, like Windows */}
        <div className="absolute right-1.5 top-0 bottom-0 flex items-center" ref={accountBoxRef}>
          <button
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            title={lang === "en" ? "Cambiar a español" : "Switch to English"}
            className="mr-1 flex h-7 items-center rounded-md px-2 text-[12px] font-semibold text-white/85 cursor-pointer hover:bg-white/10"
          >
            {lang === "en" ? "ES" : "EN"}
          </button>
          <button
            onClick={() => {
              closeLauncher();
              onMyJobOpenChange(false);
              setAccountOpen((v) => !v);
            }}
            aria-label={lang === "en" ? "Me" : "Yo"}
            aria-expanded={accountOpen}
            className="flex items-center gap-2.5 rounded-md px-3 py-1 text-white/90 cursor-pointer hover:bg-white/10"
            style={accountOpen ? { background: "rgba(255,255,255,0.14)" } : undefined}
          >
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-[12px] font-semibold text-white"
              aria-hidden
            >
              {displayName.slice(0, 1).toUpperCase()}
            </span>
            <span title={lang === "en" ? "Wi-Fi connected" : "Wi-Fi conectado"}><WifiIcon /></span>
            <span title={lang === "en" ? "Battery" : "Batería"}><BatteryIcon /></span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--danger)] px-1 text-[10px] font-semibold text-white">
              1
            </span>
            <ShelfClock lang={lang} />
          </button>

          {accountOpen && (
              <div
                className="absolute right-0 bottom-[calc(100%+8px)] z-40 w-[336px] rounded-2xl bg-[#202124] p-3 text-white shadow-[0_20px_50px_rgba(0,0,0,0.45)] animate-fade-up"
              >
                <div className="mb-3 rounded-xl bg-white/8 px-3 py-2.5 text-[12px] leading-snug text-white/70">
                  {c.practiceBanner}
                </div>

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
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                      <Languages size={16} strokeWidth={2.25} />
                    </span>
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

                {/* brightness slider - the one real control here */}
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
                  <span><QuickSettingsClock lang={lang} /></span>
                  <Link
                    href="/studio"
                    className="rounded-full px-2 py-0.5 text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    Studio
                  </Link>
                </div>
              </div>
          )}
        </div>
      </div>

      {/* screen dimming tied to the brightness slider - a genuine control, not a decoration */}
      <div
        className="pointer-events-none fixed inset-0 z-[35] bg-black transition-opacity"
        style={{ opacity: (100 - brightness) / 220 }}
      />

      {/* launcher panel */}
      {launcherOpen && (
          <div
            ref={launcherPanelRef}
            className="fixed z-40 flex w-[560px] max-w-[calc(100vw-24px)] max-h-[calc(100vh-90px)] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(10,15,40,0.35)] animate-fade-up"
            style={{ bottom: SHELF_HEIGHT + 12, left: "50%", transform: "translateX(-50%)" }}
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
                    {RECENT_ITEMS.map((r, i) => {
                      const Icon = (r.tab && TAB_ICONS[r.tab]) || APP_ICONS[r.appKey];
                      return (
                      <button
                        key={i}
                        onClick={() => {
                          openApp(r.appKey, { tab: r.tab });
                          closeLauncher();
                        }}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[var(--surface-muted)] cursor-pointer"
                      >
                        <AppIcon icon={<Icon size={17} strokeWidth={2.25} />} color={r.color} size={34} />
                        <div className="min-w-0">
                          <div className="truncate text-[13px] font-medium text-[var(--text-primary)]">
                            {r.title[lang]}
                          </div>
                          <div className="truncate text-[12px] text-[var(--text-tertiary)]">
                            {r.subtitle[lang]}
                          </div>
                        </div>
                      </button>
                      );
                    })}
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
                        <LucideAppIcon appKey={a.key} size={48} />
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
              <LucideAppIcon appKey={activeApp.key} size={44} />
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
                    say(lang === "en" ? "Coming soon." : "Próximamente.");
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

      <NudgeToast text={nudge} bottom={SHELF_RESERVE + 16} onDismiss={dismiss} />
    </>
  );
}
