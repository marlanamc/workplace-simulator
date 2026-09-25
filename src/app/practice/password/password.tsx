"use client";
import { useState } from "react";
import type { Localized } from "@/lib/task-types";
import {
  ACCOUNTS,
  TEXTS,
  accountError,
  codeError,
  newPasswordErrors,
  password as activity,
  signinAgainError,
} from "@/lib/practice/password";
import PracticeShell from "../PracticeShell";
import { usePracticeDraft, type PracticeOptions } from "../usePracticeDraft";
/**
 * Looks like the Google sign-in students meet on program Chromebooks, inside a
 * Chrome window, so the practice transfers. Coaching errors stay in the help language.
 */
export default function Password(options: PracticeOptions) {
  const p = usePracticeDraft(activity, options);
  const { draft, update, lang, heading } = p;
  const t = (en: string, es: string) => (lang === "es" ? es : en);
  // Password fields are deliberately transient: never saved, cleared on each step.
  const [typed, setTyped] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [sent, setSent] = useState(false);
  const [issues, setIssues] = useState<Localized[]>([]);
  const [menu, setMenu] = useState(false);
  const account = ACCOUNTS.find((a) => a.id === draft.account);
  const codeSent = sent || draft.code !== "";
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
        document.querySelector<HTMLElement>(".g-card input")?.focus(),
      );
    return list.length > 0;
  }
  const errors = issues.map((m) => (
    <p className="g-error" key={m.en} lang={lang} role="alert">
      <span aria-hidden="true">ⓘ</span> {m[lang]}
    </p>
  ));
  const showToggle = (
    <label className="g-check">
      <input
        type="checkbox"
        checked={show}
        onChange={(e) => setShow(e.target.checked)}
      />
      Show password
    </label>
  );
  const field = (
    id: string,
    label: string,
    value: string,
    set: (v: string) => void,
    kind: "password" | "code" = "password",
  ) => (
    <div className={issues.length ? "g-field g-invalid" : "g-field"}>
      {kind === "code" ? <span className="g-prefix">G-</span> : null}
      <input
        id={id}
        placeholder=" "
        type={kind === "code" || show ? "text" : "password"}
        inputMode={kind === "code" ? "numeric" : undefined}
        autoComplete="off"
        data-1p-ignore
        data-lpignore="true"
        spellCheck={false}
        maxLength={kind === "code" ? 20 : 100}
        value={value}
        aria-invalid={issues.length > 0}
        onChange={(e) => set(e.target.value)}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
  const chip = account ? (
    <button
      className="g-chip"
      onClick={() => {
        setIssues([]);
        setTyped("");
        update({ ...draft, account: "" });
      }}
      aria-label={`${account.email} — switch account`}
    >
      <span className="g-avatar small" aria-hidden="true">
        {account.name[0]}
      </span>
      {account.email}
      <span aria-hidden="true">⌄</span>
    </button>
  ) : null;
  const url =
    draft.stage === "signedIn"
      ? "myaccount.google.com"
      : draft.stage === "signin" || draft.stage === "complete"
        ? "accounts.google.com/signin"
        : "accounts.google.com/signin/recovery";
  return (
    <PracticeShell practice={p}>
      <section
        className="simulation g-sim"
        lang="en"
        aria-label="Google sign-in practice"
      >
        <div className="g-browser" aria-hidden="true">
          <div className="g-tab">
            {draft.stage === "signedIn"
              ? "Google Account"
              : "Sign in – Google Accounts"}
          </div>
          <div className="g-address">
            <span>🔒</span> {url}
            <span className="g-practice" lang={lang}>
              {t("Practice", "Práctica")}
            </span>
          </div>
        </div>
        {draft.stage === "signedIn" ? (
          <div className="g-account-page">
            <div className="g-topbar">
              <GoogleWord />
              <span className="g-muted">Account</span>
              <button
                className="g-avatar"
                aria-label="Google Account: Maya Torres (maya.torres@example.com)"
                aria-expanded={menu}
                onClick={() => setMenu(!menu)}
              >
                M
              </button>
            </div>
            {menu ? (
              <div className="g-account-menu" aria-label="Account">
                <p className="g-muted">maya.torres@example.com</p>
                <span className="g-avatar large" aria-hidden="true">
                  M
                </span>
                <p className="g-hi">Hi, Maya!</p>
                <button className="g-outline" onClick={() => go("complete")}>
                  Sign out
                </button>
              </div>
            ) : null}
            <div className="g-welcome">
              <span className="g-avatar large" aria-hidden="true">
                M
              </span>
              <h2 ref={heading} tabIndex={-1}>
                Welcome, Maya Torres
              </h2>
              <p className="g-muted">
                Manage your info, privacy, and security to make Google work
                better for you.
              </p>
            </div>
          </div>
        ) : (
          <div className="g-page">
            <div className="g-card">
              <GoogleWord />
              {draft.stage === "signin" && !account ? (
                <>
                  <h2 ref={heading} tabIndex={-1}>
                    Choose an account
                  </h2>
                  <p className="g-sub">to continue to Classroom</p>
                  <AccountList
                    onPick={(id) => {
                      setIssues([]);
                      update({ ...draft, account: id });
                    }}
                    onOther={() =>
                      fail({
                        en: "On a real computer, this lets you type a different email. For this practice, choose Maya Torres.",
                        es: "En una computadora real, esto te deja escribir otro correo. Para esta práctica, elige a Maya Torres.",
                      })
                    }
                  />
                  {errors}
                </>
              ) : null}
              {draft.stage === "signin" && account ? (
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
                  <h2 ref={heading} tabIndex={-1}>
                    Hi {account.name.split(" ")[0]}
                  </h2>
                  {chip}
                  <p className="g-lead">To continue, first verify it’s you</p>
                  {field(
                    "signin-password",
                    "Enter your password",
                    typed,
                    setTyped,
                  )}
                  {errors}
                  {showToggle}
                  <div className="g-actions">
                    <a
                      href="#forgot"
                      onClick={(e) => {
                        e.preventDefault();
                        if (!fail(accountError(draft))) go("code");
                      }}
                    >
                      Forgot password?
                    </a>
                    <button className="g-primary" type="submit">
                      Next
                    </button>
                  </div>
                </form>
              ) : null}
              {draft.stage === "code" ? (
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!fail(codeError(draft))) go("newPassword");
                  }}
                >
                  <h2 ref={heading} tabIndex={-1}>
                    Account recovery
                  </h2>
                  {chip}
                  {codeSent ? (
                    <>
                      <p className="g-lead">
                        A text message with a 6-digit verification code was just
                        sent to •••-•••-••57
                      </p>
                      {field(
                        "code",
                        "Enter code",
                        draft.code,
                        (v) => update({ ...draft, code: v }),
                        "code",
                      )}
                      {errors}
                      <div className="g-actions">
                        <span />
                        <button className="g-primary" type="submit">
                          Next
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="g-lead">
                        Get a verification code
                        <br />
                        <span className="g-muted">
                          Google will send a verification code to •••-•••-••57.
                          Standard rates apply.
                        </span>
                      </p>
                      <div className="g-actions">
                        <span />
                        <button
                          className="g-primary"
                          type="button"
                          onClick={() => setSent(true)}
                        >
                          Send
                        </button>
                      </div>
                    </>
                  )}
                </form>
              ) : null}
              {draft.stage === "newPassword" ? (
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!fail(...newPasswordErrors(typed, confirm)))
                      go("signinAgain");
                  }}
                >
                  <h2 ref={heading} tabIndex={-1}>
                    Change password
                  </h2>
                  {chip}
                  <p className="g-lead">Create a strong password</p>
                  <p className="g-muted">
                    Create a new, strong password that you don’t use for other
                    websites
                  </p>
                  {field("new-password", "Create password", typed, setTyped)}
                  {field("confirm-password", "Confirm", confirm, setConfirm)}
                  <p className="g-muted small">
                    Use 8 or more characters with a mix of letters, numbers
                    &amp; symbols
                  </p>
                  {errors}
                  {showToggle}
                  <div className="g-actions">
                    <span />
                    <button className="g-primary" type="submit">
                      Save password
                    </button>
                  </div>
                </form>
              ) : null}
              {draft.stage === "signinAgain" ? (
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!fail(signinAgainError(typed))) go("signedIn");
                  }}
                >
                  <h2 ref={heading} tabIndex={-1}>
                    Welcome
                  </h2>
                  {chip}
                  <p className="g-lead">
                    Your password was changed. Sign in with your new password.
                  </p>
                  {field(
                    "again-password",
                    "Enter your password",
                    typed,
                    setTyped,
                  )}
                  {errors}
                  {showToggle}
                  <div className="g-actions">
                    <span />
                    <button className="g-primary" type="submit">
                      Next
                    </button>
                  </div>
                </form>
              ) : null}
              {draft.stage === "complete" ? (
                <>
                  <h2 ref={heading} tabIndex={-1}>
                    Choose an account
                  </h2>
                  <p className="g-sub">to continue to Classroom</p>
                  <AccountList />
                </>
              ) : null}
            </div>
            <p className="g-footer" aria-hidden="true">
              English (United States) <span>Help · Privacy · Terms</span>
            </p>
            {draft.stage === "code" && codeSent ? (
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
            ) : null}
            {draft.stage === "complete" ? (
              <div className="g-done" lang={lang}>
                <p>
                  {t(
                    "Maya’s account now says Signed out. The next person on this computer cannot open it.",
                    "La cuenta de Maya ahora dice Signed out. La próxima persona en esta computadora no puede abrirla.",
                  )}
                </p>
                <button onClick={p.reset}>
                  {t("Practice again", "Practicar de nuevo")}
                </button>
              </div>
            ) : null}
          </div>
        )}
      </section>
    </PracticeShell>
  );
}
function GoogleWord() {
  return (
    <p className="g-word" aria-label="Google">
      <span>G</span>
      <span>o</span>
      <span>o</span>
      <span>g</span>
      <span>l</span>
      <span>e</span>
    </p>
  );
}
function AccountList({
  onPick,
  onOther,
}: {
  onPick?: (id: (typeof ACCOUNTS)[number]["id"]) => void;
  onOther?: () => void;
}) {
  // Without onPick this is the signed-out list: plain rows, nothing to click.
  const Row = onPick ? "button" : "div";
  return (
    <ul className="g-accounts">
      {ACCOUNTS.map((a) => (
        <li key={a.id}>
          <Row
            className="g-row"
            onClick={onPick ? () => onPick(a.id) : undefined}
          >
            <span className="g-avatar" aria-hidden="true">
              {a.name[0]}
            </span>
            <span>
              <strong>{a.name}</strong>
              <br />
              <span className="g-muted">{a.email}</span>
            </span>
            {!onPick && a.id === "maya" ? (
              <span className="g-muted g-signed-out">Signed out</span>
            ) : null}
          </Row>
        </li>
      ))}
      {onOther ? (
        <li>
          <button className="g-row" onClick={onOther}>
            <span className="g-avatar ghost" aria-hidden="true">
              +
            </span>
            Use another account
          </button>
        </li>
      ) : null}
    </ul>
  );
}
