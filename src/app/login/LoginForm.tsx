"use client";

import { useActionState, useState } from "react";
import { loginOrSignup, type LoginResult } from "./actions";
import type { Lang } from "@/lib/task-types";

const initialState: LoginResult = { error: null };

const COPY: Record<Lang, {
  banner: string;
  title: string;
  intro: string;
  nameLabel: string;
  pinLabel: string;
  codeLabel: string;
  submit: string;
  pending: string;
  footer: string;
  switchLabel: string;
}> = {
  en: {
    banner: "Practice space. Nothing here is real.",
    title: "Sign in to save your progress",
    intro: "No email needed. Use your first name, make up a 4-number PIN, and enter the class code your teacher gave you.",
    nameLabel: "Your first name",
    pinLabel: "Your PIN (4 numbers)",
    codeLabel: "Class code",
    submit: "Continue",
    pending: "One moment…",
    footer: "First time here? This makes your practice profile. Just remember your name, PIN, and class code to come back to your progress.",
    switchLabel: "Español",
  },
  es: {
    banner: "Espacio de práctica. Nada aquí es real.",
    title: "Entra para guardar tu progreso",
    intro: "No necesitas correo. Usa tu nombre, inventa un PIN de 4 números, y escribe el código de clase que te dio tu maestra.",
    nameLabel: "Tu nombre",
    pinLabel: "Tu PIN (4 números)",
    codeLabel: "Código de clase",
    submit: "Continuar",
    pending: "Un momento…",
    footer: "¿Primera vez aquí? Esto crea tu perfil de práctica. Solo recuerda tu nombre, PIN y código de clase para volver a tu progreso.",
    switchLabel: "English",
  },
};

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(loginOrSignup, initialState);
  // The choice made here seeds the whole app: ProgressProvider reads the
  // same key, so a learner who picks Español before signing in stays in
  // Español after. Same lazy-load pattern as ProgressProvider itself.
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    try {
      return window.localStorage.getItem("ws-lang") === "es" ? "es" : "en";
    } catch {
      return "en";
    }
  });

  const pickLang = (nextLang: Lang) => {
    setLang(nextLang);
    try {
      window.localStorage.setItem("ws-lang", nextLang);
    } catch {
      // Same fallback: the choice still applies for this page.
    }
    document.documentElement.lang = nextLang;
  };

  const c = COPY[lang];

  return (
    <div
      className="flex min-h-screen items-center justify-center px-5"
      style={{ background: "linear-gradient(155deg, #3f6fd1 0%, #6b7fe0 45%, #a679d8 78%, #c98fd6 100%)" }}
    >
      <form
        action={formAction}
        className="w-full max-w-[380px] rounded-2xl bg-white p-7 shadow-[0_20px_44px_rgba(20,20,50,0.28)]"
      >
        <input type="hidden" name="next" value={next} />
        <div className="mb-1 flex items-start justify-between gap-3">
          <div className="text-[12px] font-medium uppercase tracking-wide text-[var(--accent)]">
            {c.banner}
          </div>
          <button
            type="button"
            onClick={() => pickLang(lang === "en" ? "es" : "en")}
            className="shrink-0 rounded-full border border-[var(--border)] px-3 py-1 text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] cursor-pointer"
          >
            {c.switchLabel}
          </button>
        </div>
        <h1 className="mb-1 text-[22px] font-medium leading-tight text-[var(--text-primary)]">
          {c.title}
        </h1>
        <p className="mb-6 text-[14px] leading-relaxed text-[var(--text-secondary)]">
          {c.intro}
        </p>

        <label className="mb-4 block">
          <span className="mb-1.5 block text-[13px] font-medium text-[var(--text-secondary)]">
            {c.nameLabel}
          </span>
          <input
            name="displayName"
            autoComplete="off"
            required
            className="w-full rounded-lg border border-[var(--border)] px-3.5 py-3 text-[16px] outline-none focus:border-[var(--accent)]"
            placeholder="Jordan"
          />
        </label>

        <label className="mb-4 block">
          <span className="mb-1.5 block text-[13px] font-medium text-[var(--text-secondary)]">
            {c.pinLabel}
          </span>
          <input
            name="pin"
            inputMode="numeric"
            pattern="\d{4}"
            maxLength={4}
            autoComplete="off"
            required
            className="w-full rounded-lg border border-[var(--border)] px-3.5 py-3 text-[16px] tracking-[0.3em] outline-none focus:border-[var(--accent)]"
            placeholder="••••"
          />
        </label>

        <label className="mb-2 block">
          <span className="mb-1.5 block text-[13px] font-medium text-[var(--text-secondary)]">
            {c.codeLabel}
          </span>
          <input
            name="classCode"
            autoComplete="off"
            required
            className="w-full rounded-lg border border-[var(--border)] px-3.5 py-3 text-[16px] uppercase outline-none focus:border-[var(--accent)]"
            placeholder="HARBOR-24"
          />
        </label>

        {state.error && (
          <div className="mb-4 rounded-lg bg-[var(--warning-tint)] px-3.5 py-3 text-[14px] leading-relaxed text-[var(--warning)]">
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[var(--accent)] px-6 text-[16px] font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-60 cursor-pointer"
        >
          {pending ? c.pending : c.submit}
        </button>

        <p className="mt-4 text-[13px] leading-relaxed text-[var(--text-tertiary)]">
          {c.footer}
        </p>
      </form>
    </div>
  );
}
