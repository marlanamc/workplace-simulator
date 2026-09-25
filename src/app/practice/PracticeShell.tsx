"use client";
import Link from "next/link";
import { Fragment, useState } from "react";
import type { BaseDraft, Mode, TeacherGuide } from "@/lib/practice/types";
import { speakText } from "@/lib/read-aloud";
import type { Lang, Localized } from "@/lib/task-types";
import type { Practice } from "./usePracticeDraft";
/**
 * The chrome every activity shares. The Practice Card on the left is the only
 * place that tells the learner what to do; activities render just the simulated app.
 */
export default function PracticeShell<D extends BaseDraft>({
  practice: p,
  children,
}: {
  practice: Practice<D>;
  children: React.ReactNode;
}) {
  const { activity, draft, lang } = p;
  const [share, setShare] = useState("");
  const [copied, setCopied] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const t = (en: string, es: string) => (lang === "es" ? es : en);
  const last = activity.stages[activity.stages.length - 1];
  const instruction =
    draft.stage === last
      ? activity.instructions[last][lang]
      : draft.mode === "guided" || p.help
        ? activity.instructions[draft.stage as D["stage"]][lang]
        : activity.goal[lang];
  async function copyLink() {
    const url = new URL(`/practice/${activity.id}`, window.location.origin);
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
  return (
    <main className="practice-workspace" lang={lang}>
      <header className="practice-header">
        <Link href={`/practice?lang=${lang}`}>Digital Practice</Link>
        <label>
          {t("Help language", "Idioma de ayuda")}{" "}
          <select
            value={lang}
            onChange={(e) => {
              p.setLang(e.target.value as Lang);
              setCopied(false);
              setShare("");
            }}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </label>
      </header>
      {p.preview ? (
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
          <Guide guide={activity.guide} lang={lang} />
        </section>
      ) : null}
      <div className="practice-title">
        <p className="eyebrow">{activity.eyebrow[lang]}</p>
        <h1>{activity.title[lang]}</h1>
      </div>
      {p.blocked ? (
        <section role="status">
          <p>
            {p.status === "loading"
              ? t("Opening your practice…", "Abriendo tu práctica…")
              : t(
                  "We could not open your saved practice. Your work has not been replaced.",
                  "No pudimos abrir tu práctica guardada. No se reemplazó tu trabajo.",
                )}
          </p>
          {p.status === "load-error" ? (
            <button onClick={p.retryLoad}>
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
                  p.update({ ...draft, mode: e.target.value as Mode });
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
                <button
                  onClick={() => p.setHelp(!p.help)}
                  aria-expanded={p.help}
                >
                  {t("Help", "Ayuda")}
                </button>
                {p.speech ? (
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
              {p.help ? (
                <p>{activity.help[draft.stage as D["stage"]][lang]}</p>
              ) : null}
              <section className="practice-details">
                <h2>
                  {t(
                    "Fictional practice details",
                    "Datos ficticios de práctica",
                  )}
                </h2>
                <dl>
                  {activity.details.map((d) => (
                    <Fragment key={d.label.en}>
                      <dt>{d.label[lang]}</dt>
                      <dd>
                        {typeof d.value === "string" ? d.value : d.value[lang]}
                      </dd>
                    </Fragment>
                  ))}
                </dl>
              </section>
              <p className="small">
                {t(
                  "The practice app stays in English. Use only these fictional details.",
                  "La aplicación de práctica permanece en inglés. Usa solo estos datos ficticios.",
                )}
              </p>
            </aside>
            {children}
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
                  }[p.status]
                }
              </p>
              {!p.owner && !p.preview ? (
                <p className="small">
                  {t(
                    "On a shared computer, clear your practice before leaving.",
                    "En una computadora compartida, borra tu práctica antes de salir.",
                  )}
                </p>
              ) : null}
              {p.status === "error" ? (
                <button onClick={() => p.persist(draft)}>
                  {t("Retry saving", "Reintentar guardar")}
                </button>
              ) : null}
            </div>
            <div className="inline-actions">
              {!p.owner && !p.preview ? (
                <button onClick={p.signIn}>
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
              <button
                onClick={() => {
                  setConfirmClear(false);
                  p.reset();
                }}
              >
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
function Guide({ guide, lang }: { guide: TeacherGuide; lang: Lang }) {
  const t = (en: string, es: string) => (lang === "es" ? es : en);
  const list = (title: string, items: Localized[]) => (
    <section>
      <h3>{title}</h3>
      <ul>
        {items.map((i) => (
          <li key={i.en}>{i[lang]}</li>
        ))}
      </ul>
    </section>
  );
  return (
    <details className="teacher-guide">
      <summary>{t("Teacher guide", "Guía docente")}</summary>
      <div className="guide-grid">
        {list(t("Skills practiced", "Habilidades"), guide.skills)}
        {list(t("Before class", "Antes de la clase"), guide.prepare)}
        {list(
          t("Common sticking points", "Dónde se atascan"),
          guide.stickingPoints,
        )}
        {list(
          t("Follow-up questions", "Preguntas para después"),
          guide.followUp,
        )}
      </div>
      <p>
        <strong>{t("Finished early?", "¿Terminaron antes?")}</strong>{" "}
        {guide.peerHelp[lang]}
      </p>
    </details>
  );
}
