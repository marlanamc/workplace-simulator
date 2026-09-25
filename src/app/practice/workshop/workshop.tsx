"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  blank,
  errors,
  goal,
  instructions,
  parseDraft,
  type Draft,
  type Mode,
} from "@/lib/practice/content";
import { speakText } from "@/lib/read-aloud";
import type { Lang } from "@/lib/task-types";
const GUEST = "digital-practice:workshop:v1:guest";
const TRANSFER = "digital-practice:workshop:transfer";
type SaveStatus =
  | "loading"
  | "ready"
  | "saving"
  | "saved"
  | "local"
  | "error"
  | "load-error"
  | "preview";
export default function Workshop({
  initialLang,
  initialMode,
  preview,
  transfer,
}: {
  initialLang: Lang;
  initialMode: Mode;
  preview: boolean;
  transfer: boolean;
}) {
  const router = useRouter();
  const [lang, setLang] = useState(initialLang);
  const [draft, setDraft] = useState<Draft>(() => blank(initialMode));
  const [status, setStatus] = useState<SaveStatus>(
    preview ? "preview" : "loading",
  );
  const [owner, setOwner] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [speech, setSpeech] = useState(false);
  const [share, setShare] = useState("");
  const [copied, setCopied] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [loadTick, setLoadTick] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const serial = useRef(0);
  const t = (en: string, es: string) => (lang === "es" ? es : en);
  const key = owner ? `digital-practice:workshop:v1:${owner}` : GUEST;
  useEffect(() => {
    let active = true;
    async function load() {
      setSpeech("speechSynthesis" in window);
      if (preview) return;
      try {
        const r = await fetch("/api/practice", { cache: "no-store" });
        if (!r.ok) throw new Error();
        const data = await r.json();
        if (!active) return;
        const id = data.signedIn ? data.owner : null;
        setOwner(id);
        let restored = parseDraft(data.state);
        let pending: Draft | null = null;
        try {
          if (transfer && id)
            pending = parseDraft(
              JSON.parse(sessionStorage.getItem(TRANSFER) || "null"),
            );
          const cached = parseDraft(
            JSON.parse(
              localStorage.getItem(
                id ? `digital-practice:workshop:v1:${id}` : GUEST,
              ) || "null",
            ),
          );
          // Account cache is only retained when a save failed or is pending.
          restored = pending ?? cached ?? restored;
        } catch {
          /* Storage unavailable: the activity still works. */
        }
        if (restored) setDraft(restored);
        if (!id) setStatus(restored ? "local" : "ready");
        if (id && restored) {
          const saved = await fetch("/api/practice", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(restored),
          });
          if (!saved.ok) throw new Error();
          if (active) setStatus("saved");
          try {
            localStorage.removeItem(`digital-practice:workshop:v1:${id}`);
            if (pending) {
              sessionStorage.removeItem(TRANSFER);
              localStorage.removeItem(GUEST);
            }
          } catch {
            /* Already saved to account. */
          }
        } else if (id) setStatus("ready");
      } catch {
        if (active) setStatus("load-error");
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [preview, transfer, loadTick]);
  const blocked = status === "loading" || status === "load-error";
  useEffect(() => {
    if (!blocked) heading.current?.focus({ preventScroll: true });
  }, [draft.stage, blocked]); // focus follows the task, not each autosave
  useEffect(
    () => () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    },
    [],
  );
  function persist(next: Draft) {
    if (preview) return;
    const n = ++serial.current;
    let local = false;
    try {
      localStorage.setItem(key, JSON.stringify(next));
      local = true;
    } catch {
      /* Report below. */
    }
    if (!owner) {
      setStatus(local ? "local" : "error");
      return;
    }
    setStatus("saving");
    queue.current = queue.current
      .catch(() => {})
      .then(async () => {
        try {
          const r = await fetch("/api/practice", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(next),
          });
          if (!r.ok) throw new Error();
          if (n === serial.current) {
            setStatus("saved");
            try {
              localStorage.removeItem(key);
              sessionStorage.removeItem(TRANSFER);
            } catch {
              /* Account save succeeded. */
            }
          }
        } catch {
          if (n === serial.current) setStatus("error");
        }
      });
  }
  function update(next: Draft) {
    setDraft(next);
    persist(next);
  }
  function stage(next: Draft["stage"]) {
    setHelp(false);
    setInvalid(false);
    update({ ...draft, stage: next });
  }
  function review() {
    setInvalid(true);
    if (Object.keys(errors(draft)).length) {
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      );
      return;
    }
    stage("review");
  }
  function reset() {
    setConfirmClear(false);
    setInvalid(false);
    setHelp(false);
    const fresh = blank(draft.mode);
    setDraft(fresh);
    if (preview) return;
    if (owner) persist(fresh);
    else {
      try {
        localStorage.removeItem(GUEST);
        sessionStorage.removeItem(TRANSFER);
        setStatus(preview ? "preview" : "ready");
      } catch {
        setStatus("error");
      }
    }
  }
  async function copyLink() {
    const url = new URL("/practice/workshop", window.location.origin);
    url.searchParams.set("mode", draft.mode);
    url.searchParams.set("lang", lang);
    setShare(url.href);
    try {
      await navigator.clipboard.writeText(url.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }
  function signIn() {
    try {
      sessionStorage.setItem(TRANSFER, JSON.stringify(draft));
      const q = new URLSearchParams({ mode: draft.mode, lang, transfer: "1" });
      router.push(
        "/login?next=" + encodeURIComponent("/practice/workshop?" + q),
      );
    } catch {
      setStatus("error");
    }
  }
  const issues = invalid ? errors(draft) : {};
  const instruction =
    draft.stage === "complete"
      ? instructions.complete[lang]
      : draft.mode === "guided" || help
        ? instructions[draft.stage][lang]
        : goal[lang];
  return (
    <main className="practice-workspace" lang={lang}>
      <header className="practice-header">
        <Link href={`/practice?lang=${lang}`}>Digital Practice</Link>
        <label>
          {t("Help language", "Idioma de ayuda")}{" "}
          <select
            value={lang}
            onChange={(e) => {
              setLang(e.target.value as Lang);
              setCopied(false);
              setShare("");
            }}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </label>
      </header>
      {preview ? (
        <section className="preview-bar">
          <strong>
            {t(
              "Teacher preview · progress is not saved",
              "Vista docente · no se guarda el progreso",
            )}
          </strong>
          <button onClick={copyLink}>
            {t("Copy activity link", "Copiar enlace")}
          </button>
          {share ? (
            <label>
              {copied
                ? t("Link copied", "Enlace copiado")
                : t("Copy this link", "Copia este enlace")}
              <input
                readOnly
                value={share}
                onFocus={(e) => e.target.select()}
              />
            </label>
          ) : null}
        </section>
      ) : null}
      <div className="practice-title">
        <p className="eyebrow">
          {t("EMAIL + ONLINE FORMS", "CORREO + FORMULARIOS")}
        </p>
        <h1>{t("Register for a workshop", "Inscribirse en un taller")}</h1>
      </div>
      {status === "loading" || status === "load-error" ? (
        <section role="status">
          <p>
            {status === "loading"
              ? t("Opening your practice…", "Abriendo tu práctica…")
              : t(
                  "We could not open your saved practice. Your work has not been replaced.",
                  "No pudimos abrir tu práctica guardada. No se reemplazó tu trabajo.",
                )}
          </p>
          {status === "load-error" ? (
            <button
              onClick={() => {
                setStatus("loading");
                setLoadTick((n) => n + 1);
              }}
            >
              {t("Try again", "Intentar de nuevo")}
            </button>
          ) : null}
        </section>
      ) : (
        <>
          <div className="practice-columns">
            <aside
              className="practice-card"
              aria-label={t(
                "Practice instructions",
                "Instrucciones de práctica",
              )}
            >
              <p className="eyebrow">{t("YOUR PRACTICE", "TU PRÁCTICA")}</p>
              <label htmlFor="support">{t("Support", "Apoyo")}</label>
              <select
                id="support"
                value={draft.mode}
                onChange={(e) => {
                  update({ ...draft, mode: e.target.value as Mode });
                  setCopied(false);
                  setShare("");
                }}
              >
                <option value="guided">
                  {t("Guided — step by step", "Con guía — paso a paso")}
                </option>
                <option value="independent">
                  {t("Independent — goal only", "Independiente — solo la meta")}
                </option>
              </select>
              <p className="instruction" aria-live="polite">
                {instruction}
              </p>
              <div className="inline-actions">
                <button onClick={() => setHelp(!help)} aria-expanded={help}>
                  {t("Help", "Ayuda")}
                </button>
                {speech ? (
                  <>
                    <button onClick={() => speakText(instruction, lang)}>
                      {t("Read aloud", "Leer en voz alta")}
                    </button>
                    <button onClick={() => window.speechSynthesis.cancel()}>
                      {t("Stop audio", "Detener audio")}
                    </button>
                  </>
                ) : (
                  <span>
                    {t(
                      "Read-aloud unavailable in this browser",
                      "Lectura en voz alta no disponible",
                    )}
                  </span>
                )}
              </div>
              {help ? (
                <p>
                  {t(
                    "The underlined registration link opens the form. Type the details below into the matching fields. You can go back and edit before submitting.",
                    "El enlace subrayado abre el formulario. Escribe los datos de abajo en los campos correspondientes. Puedes volver y corregir antes de enviar.",
                  )}
                </p>
              ) : null}
              <section className="practice-details">
                <h2>
                  {t(
                    "Fictional practice details",
                    "Datos ficticios de práctica",
                  )}
                </h2>
                <dl>
                  <dt>{t("First name", "Nombre")}</dt>
                  <dd>Maya</dd>
                  <dt>{t("Last name", "Apellido")}</dt>
                  <dd>Torres</dd>
                  <dt>{t("Email", "Correo")}</dt>
                  <dd>maya.torres@example.com</dd>
                  <dt>{t("Requested session", "Sesión solicitada")}</dt>
                  <dd>{t("Tuesday · 6:00 PM", "Martes · 6:00 PM")}</dd>
                </dl>
              </section>
              <p className="small">
                {t(
                  "The email and form stay in English. Use only these fictional details.",
                  "El correo y el formulario permanecen en inglés. Usa solo estos datos ficticios.",
                )}
              </p>
            </aside>
            <section
              className="simulation"
              lang="en"
              aria-label="Workshop registration practice"
            >
              <div className="simulation-top">
                <span>
                  {draft.stage === "email"
                    ? "Mail"
                    : "Community Learning Center"}
                </span>
                <span>{t("Practice only", "Solo práctica")}</span>
              </div>
              <div className="simulation-body">
                {draft.stage === "email" ? (
                  <>
                    <p className="eyebrow">INBOX / INVITATION</p>
                    <h2 ref={heading} tabIndex={-1}>
                      You’re invited: computer workshop
                    </h2>
                    <p className="sender">
                      From: Community Learning Center
                      <br />
                      To: Maya Torres
                    </p>
                    <hr />
                    <p>Hello Maya,</p>
                    <p>
                      Join our free computer workshop on{" "}
                      <strong>Tuesday at 6:00 PM</strong>.
                    </p>
                    <p>
                      Please register using the link below. Choose the Tuesday
                      evening session.
                    </p>
                    <a
                      href="#registration"
                      onClick={(e) => {
                        e.preventDefault();
                        stage("form");
                      }}
                    >
                      Register for the computer workshop →
                    </a>
                    <p>
                      Thank you,
                      <br />
                      Community Learning Center
                    </p>
                    {speech ? (
                      <button
                        onClick={() =>
                          speakText(
                            "Hello Maya. Join our free computer workshop on Tuesday at 6:00 PM. Please register using the link below. Choose the Tuesday evening session.",
                            "en",
                          )
                        }
                      >
                        {t("Read email aloud", "Leer el correo en voz alta")}
                      </button>
                    ) : null}
                  </>
                ) : null}
                {draft.stage === "form" ? (
                  <>
                    <h2 ref={heading} tabIndex={-1}>
                      Workshop registration
                    </h2>
                    <p>Computer basics · Free workshop</p>
                    <form
                      noValidate
                      onSubmit={(e) => {
                        e.preventDefault();
                        review();
                      }}
                    >
                      {(["firstName", "lastName", "email"] as const).map(
                        (field) => (
                          <div className="field" key={field}>
                            <label htmlFor={field}>
                              {
                                {
                                  firstName: "First name",
                                  lastName: "Last name",
                                  email: "Email address",
                                }[field]
                              }
                            </label>
                            <input
                              id={field}
                              type={field === "email" ? "email" : "text"}
                              autoComplete="off"
                              spellCheck={false}
                              maxLength={200}
                              value={draft[field]}
                              aria-invalid={!!issues[field]}
                              aria-describedby={
                                issues[field] ? field + "-error" : undefined
                              }
                              onChange={(e) =>
                                update({ ...draft, [field]: e.target.value })
                              }
                            />
                            {issues[field] ? (
                              <p
                                className="field-error"
                                id={field + "-error"}
                                lang={lang}
                              >
                                {issues[field]?.[lang]}
                              </p>
                            ) : null}
                          </div>
                        ),
                      )}
                      <div className="field">
                        <label htmlFor="session">Workshop session</label>
                        <select
                          id="session"
                          value={draft.session}
                          aria-invalid={!!issues.session}
                          aria-describedby={
                            issues.session ? "session-error" : undefined
                          }
                          onChange={(e) =>
                            update({ ...draft, session: e.target.value })
                          }
                        >
                          <option value="">Choose a session</option>
                          <option value="tuesday">Tuesday · 6:00 PM</option>
                          <option value="saturday">Saturday · 10:00 AM</option>
                        </select>
                        {issues.session ? (
                          <p
                            className="field-error"
                            id="session-error"
                            lang={lang}
                          >
                            {issues.session[lang]}
                          </p>
                        ) : null}
                      </div>
                      <div className="inline-actions">
                        <button className="primary" type="submit">
                          Review registration
                        </button>
                        <button type="button" onClick={() => stage("email")}>
                          Back to invitation
                        </button>
                      </div>
                    </form>
                  </>
                ) : null}
                {draft.stage === "review" ? (
                  <>
                    <h2 ref={heading} tabIndex={-1}>
                      Review your registration
                    </h2>
                    <dl className="review-details">
                      <dt>Name</dt>
                      <dd>
                        {draft.firstName} {draft.lastName}
                      </dd>
                      <dt>Email</dt>
                      <dd>{draft.email}</dd>
                      <dt>Workshop</dt>
                      <dd>Computer basics</dd>
                      <dt>Session</dt>
                      <dd>Tuesday · 6:00 PM</dd>
                    </dl>
                    <div className="inline-actions">
                      <button
                        className="primary"
                        onClick={() => {
                          if (!Object.keys(errors(draft)).length)
                            stage("complete");
                        }}
                      >
                        Submit registration
                      </button>
                      <button onClick={() => stage("form")}>
                        Edit answers
                      </button>
                    </div>
                  </>
                ) : null}
                {draft.stage === "complete" ? (
                  <>
                    <span className="confirmation-mark" aria-hidden="true">
                      ✓
                    </span>
                    <h2 ref={heading} tabIndex={-1}>
                      Registration confirmed
                    </h2>
                    <p>
                      Thank you, Maya. Your practice registration is complete.
                    </p>
                    <dl className="review-details">
                      <dt>Workshop</dt>
                      <dd>Computer basics</dd>
                      <dt>Session</dt>
                      <dd>Tuesday · 6:00 PM</dd>
                    </dl>
                    <p>
                      This is a practice confirmation. No real booking was made.
                    </p>
                    <button onClick={reset} lang={lang}>
                      {t("Practice again", "Practicar de nuevo")}
                    </button>
                  </>
                ) : null}
              </div>
            </section>
          </div>
          <footer className="practice-footer">
            <div>
              <p role="status">
                {
                  {
                    loading: "",
                    ready: t("Ready", "Listo"),
                    saving: t(
                      "Saving to your account…",
                      "Guardando en tu cuenta…",
                    ),
                    saved: t("Saved to your account", "Guardado en tu cuenta"),
                    local: t(
                      "Saved in this browser only",
                      "Guardado solo en este navegador",
                    ),
                    error: t(
                      "Could not save. Keep this page open and retry.",
                      "No se pudo guardar. Mantén esta página abierta e intenta de nuevo.",
                    ),
                    "load-error": "",
                    preview: t(
                      "Preview — nothing is saved",
                      "Vista previa — no se guarda nada",
                    ),
                  }[status]
                }
              </p>
              {!owner && !preview ? (
                <p className="small">
                  {t(
                    "On a shared computer, clear your practice before leaving.",
                    "En una computadora compartida, borra tu práctica antes de salir.",
                  )}
                </p>
              ) : null}
              {status === "error" ? (
                <button onClick={() => persist(draft)}>
                  {t("Retry saving", "Reintentar guardar")}
                </button>
              ) : null}
            </div>
            <div className="inline-actions">
              {!owner && !preview ? (
                <button onClick={signIn}>
                  {t(
                    "Sign in to save this practice",
                    "Iniciar sesión para guardar esta práctica",
                  )}
                </button>
              ) : null}
              <button onClick={() => setConfirmClear(true)}>
                {t("Clear my practice", "Borrar mi práctica")}
              </button>
            </div>
          </footer>
          {confirmClear ? (
            <section
              className="clear-confirm"
              aria-label={t("Confirm clearing", "Confirmar borrado")}
            >
              <p>
                {t(
                  "Clear this activity and start again?",
                  "¿Borrar esta actividad y empezar de nuevo?",
                )}
              </p>
              <button onClick={reset}>
                {t("Yes, clear practice", "Sí, borrar práctica")}
              </button>
              <button onClick={() => setConfirmClear(false)}>
                {t("Keep my work", "Conservar mi trabajo")}
              </button>
            </section>
          ) : null}
        </>
      )}
    </main>
  );
}
