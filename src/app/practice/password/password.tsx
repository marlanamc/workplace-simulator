"use client";
import { useState } from "react";
import type { Localized } from "@/lib/task-types";
import {
  ACCOUNTS,
  RULES,
  TEXTS,
  accountError,
  codeError,
  newPasswordErrors,
  password as activity,
  signinAgainError,
} from "@/lib/practice/password";
import PracticeShell from "../PracticeShell";
import { usePracticeDraft, type PracticeOptions } from "../usePracticeDraft";
export default function Password(options: PracticeOptions) {
  const p = usePracticeDraft(activity, options);
  const { draft, update, lang, heading } = p;
  const t = (en: string, es: string) => (lang === "es" ? es : en);
  // Password fields are deliberately transient: never saved, cleared on each step.
  const [typed, setTyped] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [issues, setIssues] = useState<Localized[]>([]);
  const [menu, setMenu] = useState(false);
  const account = ACCOUNTS.find((a) => a.id === draft.account);
  function go(stage: typeof draft.stage) {
    setTyped("");
    setConfirm("");
    setShow(false);
    setIssues([]);
    setMenu(false);
    p.go(stage);
  }
  function fail(...messages: (Localized | null)[]) {
    const list = messages.filter((m): m is Localized => !!m);
    setIssues(list);
    if (list.length)
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>(".simulation input")?.focus(),
      );
    return list.length > 0;
  }
  const errors = issues.map((m) => (
    <p className="field-error" key={m.en} lang={lang} role="alert">
      {m[lang]}
    </p>
  ));
  const showToggle = (
    <label className="show-password">
      <input
        type="checkbox"
        checked={show}
        onChange={(e) => setShow(e.target.checked)}
      />
      Show password
    </label>
  );
  const passwordInput = (
    id: string,
    label: string,
    value: string,
    set: (v: string) => void,
  ) => (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={show ? "text" : "password"}
        autoComplete="off"
        data-1p-ignore
        data-lpignore="true"
        spellCheck={false}
        maxLength={100}
        value={value}
        aria-invalid={issues.length > 0}
        onChange={(e) => set(e.target.value)}
      />
    </div>
  );
  return (
    <PracticeShell practice={p}>
      <section
        className="simulation"
        lang="en"
        aria-label="Password reset practice"
      >
        <div className="simulation-top">
          <span>Riverside Learning</span>
          <span lang={lang}>{t("Practice only", "Solo práctica")}</span>
        </div>
        <div className="simulation-body">
          {draft.stage === "signin" && !account ? (
            <>
              <h2 ref={heading} tabIndex={-1}>
                Choose an account
              </h2>
              <ul className="account-list">
                {ACCOUNTS.map((a) => (
                  <li key={a.id}>
                    <button
                      onClick={() => {
                        setIssues([]);
                        update({ ...draft, account: a.id });
                      }}
                    >
                      <span className="avatar" aria-hidden="true">
                        {a.name[0]}
                      </span>
                      <span>
                        <strong>{a.name}</strong>
                        <br />
                        {a.email}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {draft.stage === "signin" && account ? (
            <>
              <h2 ref={heading} tabIndex={-1}>
                Welcome
              </h2>
              <p className="account-chip">
                <span className="avatar" aria-hidden="true">
                  {account.name[0]}
                </span>
                <span>
                  <strong>{account.name}</strong>
                  <br />
                  {account.email}
                </span>
              </p>
              <button
                className="back-link"
                onClick={() => {
                  setIssues([]);
                  setTyped("");
                  update({ ...draft, account: "" });
                }}
              >
                Use another account
              </button>
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  fail(
                    accountError(draft) ?? {
                      en: "Wrong password. Maya forgot her password — click Forgot password?",
                      es: "Contraseña incorrecta. Maya olvidó su contraseña — haz clic en Forgot password?",
                    },
                  );
                }}
              >
                {passwordInput("signin-password", "Password", typed, setTyped)}
                {showToggle}
                {errors}
                <div className="inline-actions">
                  <button className="primary" type="submit">
                    Sign in
                  </button>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!fail(accountError(draft))) go("code");
                    }}
                  >
                    Forgot password?
                  </a>
                </div>
              </form>
            </>
          ) : null}
          {draft.stage === "code" ? (
            <>
              <h2 ref={heading} tabIndex={-1}>
                Check your phone
              </h2>
              <p>
                We sent a verification code to your phone number ending in
                <strong> 57</strong>.
              </p>
              <section className="phone" aria-label="Maya’s phone: Messages">
                <p className="phone-title">Messages</p>
                <ul>
                  {TEXTS.map((m) => (
                    <li key={m.from}>
                      <strong>{m.from}</strong>
                      <span className="file-date">{m.time}</span>
                      <p>{m.body}</p>
                    </li>
                  ))}
                </ul>
              </section>
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!fail(codeError(draft))) go("newPassword");
                }}
              >
                <div className="field">
                  <label htmlFor="code">Enter the code</label>
                  <input
                    id="code"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={20}
                    value={draft.code}
                    aria-invalid={issues.length > 0}
                    onChange={(e) => update({ ...draft, code: e.target.value })}
                  />
                </div>
                {errors}
                <div className="inline-actions">
                  <button className="primary" type="submit">
                    Next
                  </button>
                </div>
              </form>
            </>
          ) : null}
          {draft.stage === "newPassword" ? (
            <>
              <h2 ref={heading} tabIndex={-1}>
                Create a new password
              </h2>
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!fail(...newPasswordErrors(typed, confirm)))
                    go("signinAgain");
                }}
              >
                {passwordInput("new-password", "New password", typed, setTyped)}
                <ul className="rules" aria-label="Password rules">
                  {RULES.map((r) => (
                    <li key={r.label} className={r.ok(typed) ? "met" : ""}>
                      <span aria-hidden="true">{r.ok(typed) ? "✓" : "○"}</span>{" "}
                      {r.label}
                      <span className="sr-only">
                        {r.ok(typed) ? " (done)" : " (not yet)"}
                      </span>
                    </li>
                  ))}
                </ul>
                {passwordInput(
                  "confirm-password",
                  "Confirm new password",
                  confirm,
                  setConfirm,
                )}
                {showToggle}
                {errors}
                <div className="inline-actions">
                  <button className="primary" type="submit">
                    Save password
                  </button>
                </div>
              </form>
            </>
          ) : null}
          {draft.stage === "signinAgain" ? (
            <>
              <h2 ref={heading} tabIndex={-1}>
                Password changed
              </h2>
              <p>Sign in with your new password.</p>
              <p className="account-chip">
                <span className="avatar" aria-hidden="true">
                  M
                </span>
                <span>
                  <strong>Maya Torres</strong>
                  <br />
                  maya.torres@example.com
                </span>
              </p>
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!fail(signinAgainError(typed))) go("signedIn");
                }}
              >
                {passwordInput("again-password", "Password", typed, setTyped)}
                {showToggle}
                {errors}
                <div className="inline-actions">
                  <button className="primary" type="submit">
                    Sign in
                  </button>
                </div>
              </form>
            </>
          ) : null}
          {draft.stage === "signedIn" ? (
            <>
              <div className="app-bar">
                <strong>Riverside Learning</strong>
                <button
                  className="avatar-button"
                  aria-label="Account: Maya Torres"
                  aria-expanded={menu}
                  onClick={() => setMenu(!menu)}
                >
                  M
                </button>
              </div>
              {menu ? (
                <div className="account-menu" aria-label="Account">
                  <p>
                    <strong>Maya Torres</strong>
                    <br />
                    maya.torres@example.com
                  </p>
                  <button onClick={() => go("complete")}>Sign out</button>
                </div>
              ) : null}
              <h2 ref={heading} tabIndex={-1}>
                Welcome back, Maya
              </h2>
              <p>You have 2 new messages and 1 assignment due Friday.</p>
            </>
          ) : null}
          {draft.stage === "complete" ? (
            <>
              <span className="confirmation-mark" aria-hidden="true">
                ✓
              </span>
              <h2 ref={heading} tabIndex={-1}>
                You’re signed out
              </h2>
              <p>
                The next person on this computer cannot open Maya’s account.
              </p>
              <button onClick={p.reset} lang={lang}>
                {t("Practice again", "Practicar de nuevo")}
              </button>
            </>
          ) : null}
        </div>
      </section>
    </PracticeShell>
  );
}
