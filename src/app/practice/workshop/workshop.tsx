"use client";
import { errors, workshop, type Draft } from "@/lib/practice/content";
import { speakText } from "@/lib/read-aloud";
import PracticeShell from "../PracticeShell";
import { usePracticeDraft, type PracticeOptions } from "../usePracticeDraft";
export default function Workshop(options: PracticeOptions) {
  const p = usePracticeDraft(workshop, options);
  const { draft, update, lang, speech, heading } = p;
  const t = (en: string, es: string) => (lang === "es" ? es : en);
  const stage = (next: Draft["stage"]) => p.go(next);
  function review() {
    p.setInvalid(true);
    if (Object.keys(errors(draft)).length) {
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      );
      return;
    }
    stage("review");
  }
  const issues = p.invalid ? errors(draft) : {};
  return (
    <PracticeShell practice={p}>
      <section
        className="simulation"
        lang="en"
        aria-label="Workshop registration practice"
      >
        <div className="simulation-top">
          <span>
            {draft.stage === "email" ? "Mail" : "Community Learning Center"}
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
                Please register using the link below. Choose the Tuesday evening
                session.
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
                {(["firstName", "lastName", "email"] as const).map((field) => (
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
                ))}
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
                    <p className="field-error" id="session-error" lang={lang}>
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
                    if (!Object.keys(errors(draft)).length) stage("complete");
                  }}
                >
                  Submit registration
                </button>
                <button onClick={() => stage("form")}>Edit answers</button>
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
              <p>Thank you, Maya. Your practice registration is complete.</p>
              <dl className="review-details">
                <dt>Workshop</dt>
                <dd>Computer basics</dd>
                <dt>Session</dt>
                <dd>Tuesday · 6:00 PM</dd>
              </dl>
              <p>This is a practice confirmation. No real booking was made.</p>
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
