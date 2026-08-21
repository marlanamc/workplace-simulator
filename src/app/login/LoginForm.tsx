"use client";

import { useActionState } from "react";
import { loginOrSignup, type LoginResult } from "./actions";

const initialState: LoginResult = { error: null };

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(loginOrSignup, initialState);

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
        <div className="mb-1 text-[12px] font-medium uppercase tracking-wide text-[var(--accent)]">
          Practice space. Nothing here is real.
        </div>
        <h1 className="mb-1 text-[22px] font-medium leading-tight text-[var(--text-primary)]">
          Sign in to save your progress
        </h1>
        <p className="mb-6 text-[14px] leading-relaxed text-[var(--text-secondary)]">
          No email needed. Use your first name, make up a 4-number PIN, and enter the class
          code your teacher gave you.
        </p>

        <label className="mb-4 block">
          <span className="mb-1.5 block text-[13px] font-medium text-[var(--text-secondary)]">
            Your first name
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
            Your PIN (4 numbers)
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
            Class code
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
          {pending ? "One moment…" : "Continue"}
        </button>

        <p className="mt-4 text-[13px] leading-relaxed text-[var(--text-tertiary)]">
          First time here? This makes your practice profile. Just remember your name, PIN,
          and class code to come back to your progress.
        </p>
      </form>
    </div>
  );
}
