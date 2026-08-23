"use client";

import { useActionState, useRef, useState, useSyncExternalStore, type FormEvent, type RefObject } from "react";
import { loginOrSignup, type LoginResult } from "./actions";
import type { Lang } from "@/lib/task-types";
import { DesktopClock } from "@/components/LiveClock";
import { Languages } from "@/lib/icons";

const initialState: LoginResult = { error: null };
const RECENTS_KEY = "ws-login-recents";
const PIN_LEN = 4;
const POD_COLORS = ["#1a73e8", "#d93025", "#188038", "#9334e6", "#e37400", "#00897b"];

type RecentUser = { displayName: string; classCode: string };
type Mode = "picker" | "unlock" | "add";

const COPY: Record<
  Lang,
  {
    banner: string;
    addUser: string;
    addTitle: string;
    pickerHint: string;
    addIntro: string;
    nameLabel: string;
    pinLabel: string;
    codeLabel: string;
    enterPin: string;
    submitAdd: string;
    pending: string;
    cancel: string;
    power: string;
    wifi: string;
    battery: string;
    switchLabel: string;
  }
> = {
  en: {
    banner: "Practice Chromebook. Nothing here is real.",
    addUser: "Add user",
    addTitle: "Add user",
    pickerHint: "Add a user to sign in.",
    addIntro: "Use your first name, a 4-number PIN, and the class code your teacher gave you.",
    nameLabel: "Your first name",
    pinLabel: "PIN",
    codeLabel: "Class code",
    enterPin: "Enter PIN",
    submitAdd: "Add",
    pending: "Signing in…",
    cancel: "Cancel",
    power: "This practice computer stays on.",
    wifi: "Wi-Fi is on",
    battery: "Battery is charged",
    switchLabel: "Español",
  },
  es: {
    banner: "Chromebook de práctica. Nada aquí es real.",
    addUser: "Agregar usuario",
    addTitle: "Agregar usuario",
    pickerHint: "Agrega un usuario para entrar.",
    addIntro: "Usa tu nombre, un PIN de 4 números, y el código de clase que te dio tu maestra.",
    nameLabel: "Tu nombre",
    pinLabel: "PIN",
    codeLabel: "Código de clase",
    enterPin: "Escribe el PIN",
    submitAdd: "Agregar",
    pending: "Entrando…",
    cancel: "Cancelar",
    power: "Esta computadora de práctica se queda encendida.",
    wifi: "El Wi-Fi está activo",
    battery: "La batería está cargada",
    switchLabel: "English",
  },
};

function podColor(name: string) {
  let n = 0;
  for (let i = 0; i < name.length; i++) n = (n + name.charCodeAt(i) * 17) % POD_COLORS.length;
  return POD_COLORS[n];
}

function loadRecents(): RecentUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (u): u is RecentUser =>
        !!u && typeof u === "object" && typeof u.displayName === "string" && typeof u.classCode === "string",
    );
  } catch {
    return [];
  }
}

function rememberUser(user: RecentUser) {
  try {
    const next = [
      user,
      ...loadRecents().filter(
        (u) => !(u.displayName === user.displayName && u.classCode === user.classCode),
      ),
    ].slice(0, 4);
    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  } catch {
    // Private browsing can block localStorage.
  }
}

function LoginWallpaper({ dimmed }: { dimmed?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(1200px 700px at 50% 42%, #24344c 0%, #152033 58%, #101826 100%)",
        }}
      />
      <div
        className="absolute inset-0 flex items-center justify-center px-8 pb-24 pt-16 transition-opacity duration-200"
        style={{ opacity: dimmed ? 0.18 : 1 }}
        aria-hidden={dimmed || undefined}
      >
        <div className="text-center" style={{ textShadow: "0 8px 40px rgba(0,0,0,0.35)" }}>
          <p
            className="font-medium uppercase text-white/60"
            style={{ fontSize: 14, letterSpacing: "0.34em" }}
          >
            EBHCS
          </p>
          {dimmed ? (
            <p
              className="mt-3 font-medium text-white/90"
              style={{ fontSize: 44, lineHeight: 1.08, letterSpacing: "-0.03em", maxWidth: "11em" }}
            >
              Workplace Simulator Game
            </p>
          ) : (
            <h1
              className="mt-3 font-medium text-white/90"
              style={{ fontSize: 44, lineHeight: 1.08, letterSpacing: "-0.03em", maxWidth: "11em" }}
            >
              Workplace Simulator Game
            </h1>
          )}
        </div>
      </div>
    </div>
  );
}

function WifiIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="18" r="1.5" fill="currentColor" />
      <path d="M8.2 14.6a5.4 5.4 0 0 1 7.6 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4.8 11.2a10.2 10.2 0 0 1 14.4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
      <path d="M1.6 7.8a15 15 0 0 1 20.8 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="1.5" y="7.5" width="18" height="9" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3.5" y="9.5" width="12" height="5" rx="1" fill="currentColor" />
      <path d="M21.5 10.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PowerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7.2 6.4a8 8 0 1 0 9.6 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function Avatar({ name, size }: { name: string; size: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-medium text-white"
      style={{
        width: size,
        height: size,
        background: podColor(name),
        fontSize: Math.round(size * 0.38),
      }}
      aria-hidden
    >
      {name.slice(0, 1).toUpperCase() || "?"}
    </span>
  );
}

function PinField({
  inputRef,
  named,
  value,
  label,
  disabled,
  wide,
  onChange,
}: {
  inputRef: RefObject<HTMLInputElement | null>;
  named?: boolean;
  value: string;
  label: string;
  disabled?: boolean;
  wide?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <input
      ref={inputRef}
      name={named ? "pin" : undefined}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, PIN_LEN))}
      inputMode="numeric"
      autoComplete="off"
      maxLength={PIN_LEN}
      disabled={disabled}
      aria-label={label}
      placeholder="••••"
      className={`${wide ? "w-full" : "w-[220px]"} rounded-xl border-0 bg-white/14 px-4 py-3 text-center text-[22px] tracking-[0.45em] text-white outline-none placeholder:tracking-[0.35em] placeholder:text-white/45 focus:bg-white/20`}
    />
  );
}

function readStoredLang(): Lang {
  try {
    return window.localStorage.getItem("ws-lang") === "es" ? "es" : "en";
  } catch {
    return "en";
  }
}

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(loginOrSignup, initialState);
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const storedLang = isClient ? readStoredLang() : "en";
  const [langOverride, setLangOverride] = useState<Lang | null>(null);
  const lang = langOverride ?? storedLang;
  const recents = isClient ? loadRecents() : [];
  const [mode, setMode] = useState<Mode>("picker");
  const [selected, setSelected] = useState<RecentUser | null>(null);
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [classCode, setClassCode] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const pinRef = useRef<HTMLInputElement>(null);

  const flashStatus = (msg: string) => {
    setStatusNote(msg);
    if (statusTimer.current) clearTimeout(statusTimer.current);
    statusTimer.current = setTimeout(() => setStatusNote(""), 3500);
  };

  const pickLang = (nextLang: Lang) => {
    try {
      window.localStorage.setItem("ws-lang", nextLang);
    } catch {
      // The choice still applies for this page.
    }
    setLangOverride(nextLang);
    document.documentElement.lang = nextLang;
  };

  const c = COPY[lang];

  const setPinDigits = (nextPin: string, submitWhenFull = false) => {
    const clipped = nextPin.replace(/\D/g, "").slice(0, PIN_LEN);
    setPin(clipped);
    if (submitWhenFull && clipped.length === PIN_LEN) {
      window.setTimeout(() => formRef.current?.requestSubmit(), 40);
    }
  };

  const openUnlock = (user: RecentUser) => {
    setSelected(user);
    setPin("");
    setMode("unlock");
    window.setTimeout(() => pinRef.current?.focus(), 50);
  };

  const openAdd = () => {
    setSelected(null);
    setPin("");
    setName("");
    setClassCode("");
    setMode("add");
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const data = new FormData(event.currentTarget);
    const displayName = String(data.get("displayName") ?? "").trim();
    const code = String(data.get("classCode") ?? "").trim().toUpperCase();
    if (displayName && code) rememberUser({ displayName, classCode: code });
  };

  const unlocking = mode === "unlock" && selected;
  const adding = mode === "add";
  const displayNameValue = unlocking ? selected.displayName : name;
  const classCodeValue = unlocking ? selected.classCode : classCode;

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="fixed inset-0 -z-10">
        <LoginWallpaper dimmed={unlocking || adding} />
      </div>

      <div className="relative flex min-h-screen flex-col px-10 pt-10" style={{ paddingBottom: 132 }}>
        <div>
          <DesktopClock lang={lang} />
          <p className="mt-3 max-w-[36ch] text-[14px] text-white/80">{c.banner}</p>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-5 py-6">
          {mode === "picker" && recents.length === 0 && (
            <p className="mt-auto mb-2 max-w-[28ch] text-center text-[16px] text-white/80">
              {c.pickerHint}
            </p>
          )}
          {unlocking && (
            <form
              ref={formRef}
              action={formAction}
              onSubmit={onSubmit}
              className="flex flex-col items-center animate-fade-up"
            >
              <input type="hidden" name="next" value={next} />
              <input type="hidden" name="displayName" value={displayNameValue} />
              <input type="hidden" name="classCode" value={classCodeValue} />
              <Avatar name={selected.displayName} size={88} />
              <h1 className="mt-4 text-[28px] font-medium leading-tight tracking-[-0.02em]">
                {selected.displayName}
              </h1>
              <p className="mt-1 text-[14px] text-white/80">{pending ? c.pending : c.enterPin}</p>
              <div className="mt-5">
                <PinField
                  inputRef={pinRef}
                  named
                  value={pin}
                  label={c.enterPin}
                  disabled={pending}
                  onChange={(value) => setPinDigits(value, true)}
                />
              </div>
              {state.error && (
                <p className="mt-4 max-w-[28ch] text-center text-[14px] leading-snug text-[#ffd2d0]">
                  {state.error}
                </p>
              )}
            </form>
          )}

          {adding && (
            <form
              ref={formRef}
              action={formAction}
              onSubmit={onSubmit}
              className="w-full max-w-[360px] rounded-[28px] bg-[#202124]/88 p-7 shadow-[0_24px_60px_rgba(0,0,0,0.4)] backdrop-blur-md animate-fade-up"
            >
              <input type="hidden" name="next" value={next} />
              <h1 className="text-[22px] font-medium leading-tight">{c.addTitle}</h1>
              <p className="mt-2 text-[14px] leading-relaxed text-white/80">{c.addIntro}</p>

              <label className="mt-5 block">
                <span className="mb-1.5 block text-[13px] font-medium text-white/75">{c.nameLabel}</span>
                <input
                  name="displayName"
                  autoComplete="off"
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border-0 bg-white/12 px-3.5 py-3 text-[16px] text-white outline-none placeholder:text-white/40 focus:bg-white/16"
                  placeholder="Jordan"
                />
              </label>
              <label className="mt-3 block">
                <span className="mb-1.5 block text-[13px] font-medium text-white/75">{c.codeLabel}</span>
                <input
                  name="classCode"
                  autoComplete="off"
                  required
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border-0 bg-white/12 px-3.5 py-3 text-[16px] uppercase text-white outline-none placeholder:text-white/40 focus:bg-white/16"
                  placeholder="HARBOR-24"
                />
              </label>
              <label className="mt-3 block">
                <span className="mb-1.5 block text-[13px] font-medium text-white/75">{c.pinLabel}</span>
                <PinField
                  inputRef={pinRef}
                  named
                  wide
                  value={pin}
                  label={c.pinLabel}
                  disabled={pending}
                  onChange={(value) => setPinDigits(value)}
                />
              </label>
              {state.error && (
                <p className="mt-3 text-[14px] leading-snug text-[#ffd2d0]">{state.error}</p>
              )}
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode("picker");
                    setPin("");
                  }}
                  className="inline-flex min-h-[44px] items-center rounded-full px-4 text-[14px] font-medium text-white/80 hover:bg-white/10 cursor-pointer"
                >
                  {c.cancel}
                </button>
                <button
                  type="submit"
                  disabled={pending || pin.length !== PIN_LEN}
                  className="inline-flex min-h-[44px] items-center rounded-full bg-white px-5 text-[14px] font-medium text-[#202124] hover:bg-white/90 disabled:opacity-50 cursor-pointer"
                >
                  {pending ? c.pending : c.submitAdd}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 px-6 pb-4 pt-6"
        style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.55))" }}
        suppressHydrationWarning
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-end gap-2">
          {recents.map((user) => {
            const active =
              unlocking && selected?.displayName === user.displayName && selected.classCode === user.classCode;
            return (
              <button
                key={`${user.displayName}:${user.classCode}`}
                type="button"
                onClick={() => openUnlock(user)}
                className="flex w-[92px] flex-col items-center gap-2 rounded-2xl px-2 py-3 text-white cursor-pointer hover:bg-white/10"
                style={active ? { background: "rgba(255,255,255,0.12)" } : undefined}
              >
                <Avatar name={user.displayName} size={56} />
                <span className="w-full truncate text-center text-[13px] font-medium">{user.displayName}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={openAdd}
            className="flex w-[92px] flex-col items-center gap-2 rounded-2xl px-2 py-3 text-white cursor-pointer hover:bg-white/10"
            style={adding ? { background: "rgba(255,255,255,0.12)" } : undefined}
          >
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full text-[28px] font-medium text-white"
              style={{ background: "rgba(255,255,255,0.18)", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.35)" }}
              aria-hidden
            >
              +
            </span>
            <span className="w-full text-center text-[13px] font-medium leading-tight">{c.addUser}</span>
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 pb-3 text-white/90">
          <button
            type="button"
            title={c.wifi}
            aria-label={c.wifi}
            onClick={() => flashStatus(c.wifi)}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
          >
            <WifiIcon />
          </button>
          <button
            type="button"
            title={c.battery}
            aria-label={c.battery}
            onClick={() => flashStatus(c.battery)}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
          >
            <BatteryIcon />
          </button>
          <button
            type="button"
            onClick={() => pickLang(lang === "en" ? "es" : "en")}
            aria-label={c.switchLabel}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
          >
            <Languages size={16} strokeWidth={2.25} />
          </button>
          <button
            type="button"
            title={c.power}
            aria-label={c.power}
            onClick={() => flashStatus(c.power)}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
          >
            <PowerIcon />
          </button>
        </div>
      </div>

      {statusNote ? (
        <div
          className="fixed bottom-28 left-1/2 z-20 max-w-[420px] -translate-x-1/2 rounded-xl bg-[#3c4043] px-5 py-3 text-center text-[14px] font-medium text-white shadow-lg animate-fade-up"
          role="status"
        >
          {statusNote}
        </div>
      ) : null}
    </div>
  );
}
