"use client";
import { useEffect, useRef, useState } from "react";
import {
  FILES,
  assignment,
  attachmentErrors,
  commentError,
  fileName,
  type FileId,
} from "@/lib/practice/assignment";
import PracticeShell from "../PracticeShell";
import { usePracticeDraft, type PracticeOptions } from "../usePracticeDraft";
const OTHERS = [
  {
    title: "Vocabulary: At work",
    due: "Due Sep 26",
    status: "Turned in",
    body: "Match each word to its picture.",
  },
  {
    title: "Reading: At the clinic",
    due: "Due Oct 3",
    status: "Assigned",
    body: "We will read this together next week.",
  },
];
export default function Assignment(options: PracticeOptions) {
  const p = usePracticeDraft(assignment, options);
  const { draft, update, lang, heading } = p;
  const t = (en: string, es: string) => (lang === "es" ? es : en);
  // Transient UI: a reload returns to the saved stage, never a half-open menu.
  const [expanded, setExpanded] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const [picker, setPicker] = useState<null | "drive" | "computer">(null);
  const [confirm, setConfirm] = useState(false);
  const [commentTried, setCommentTried] = useState(false);
  const turnIn = useRef<HTMLButtonElement>(null);
  const issues = p.invalid ? attachmentErrors(draft) : [];
  const commentIssue = commentTried ? commentError(draft) : null;
  const done = draft.stage === "turnedIn" || draft.stage === "complete";
  function attach(id: FileId) {
    setPicker(null);
    p.setInvalid(false);
    if (!draft.attached.includes(id))
      update({ ...draft, attached: [...draft.attached, id] });
    requestAnimationFrame(() => turnIn.current?.focus());
  }
  function remove(id: FileId) {
    update({ ...draft, attached: draft.attached.filter((a) => a !== id) });
  }
  function tryTurnIn() {
    p.setInvalid(true);
    if (!attachmentErrors(draft).length) setConfirm(true);
  }
  function post() {
    setCommentTried(true);
    if (!commentError(draft)) {
      setCommentTried(false);
      p.go("complete");
    }
  }
  return (
    <PracticeShell practice={p}>
      <section
        className="simulation"
        lang="en"
        aria-label="Classroom homework practice"
      >
        <div className="simulation-top">
          <span>Classroom · English 3</span>
          <span lang={lang}>{t("Practice only", "Solo práctica")}</span>
        </div>
        <div className="simulation-body">
          {draft.stage === "classwork" ? (
            <>
              <h2 ref={heading} tabIndex={-1}>
                Classwork
              </h2>
              <ul className="classwork-list">
                {[
                  {
                    title: "My weekly schedule",
                    due: "Due Friday, 11:59 PM",
                    status: "Assigned",
                    body: "Write your schedule for this week. Attach your file and turn it in.",
                  },
                  ...OTHERS,
                ].map((a) => (
                  <li key={a.title}>
                    <button
                      className="classwork-item"
                      aria-expanded={expanded === a.title}
                      onClick={() =>
                        setExpanded(expanded === a.title ? null : a.title)
                      }
                    >
                      <strong>{a.title}</strong>
                      <span>{a.due}</span>
                    </button>
                    {expanded === a.title ? (
                      <div className="classwork-detail">
                        <p>
                          <span className="status-tag">{a.status}</span>
                        </p>
                        <p>{a.body}</p>
                        {a.title === "My weekly schedule" ? (
                          <a
                            href="#assignment"
                            onClick={(e) => {
                              e.preventDefault();
                              p.go("assignment");
                            }}
                          >
                            View assignment
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              {done ? null : (
                <button className="back-link" onClick={() => p.go("classwork")}>
                  ← Classwork
                </button>
              )}
              <h2 ref={heading} tabIndex={-1}>
                My weekly schedule
              </h2>
              <p className="sender">Ms. Rivera · Due Friday, 11:59 PM</p>
              <p>
                Write your schedule for this week in a document. Attach the file
                and turn it in.
              </p>
              <section className="your-work" aria-label="Your work">
                <div className="your-work-head">
                  <h3>Your work</h3>
                  <span className={done ? "status-tag done" : "status-tag"}>
                    {done ? "Turned in" : "Assigned"}
                  </span>
                </div>
                {draft.attached.length ? (
                  <ul className="attachments">
                    {draft.attached.map((id) => (
                      <li key={id}>
                        <span>{fileName(id)}</span>
                        {done ? null : (
                          <button
                            aria-label={`Remove ${fileName(id)}`}
                            onClick={() => remove(id)}
                          >
                            ✕
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {draft.stage === "complete" ? null : done ? (
                  <button
                    onClick={() => {
                      setCommentTried(false);
                      p.go("assignment");
                    }}
                  >
                    Unsubmit
                  </button>
                ) : (
                  <>
                    <div className="add-menu">
                      <button
                        aria-expanded={menu}
                        aria-haspopup="menu"
                        onClick={() => setMenu(!menu)}
                      >
                        + Add or create
                      </button>
                      {menu ? (
                        <div role="menu">
                          <button
                            role="menuitem"
                            onClick={() => {
                              setMenu(false);
                              setPicker("drive");
                            }}
                          >
                            Google Drive
                          </button>
                          <button
                            role="menuitem"
                            onClick={() => {
                              setMenu(false);
                              setPicker("computer");
                            }}
                          >
                            File from this computer
                          </button>
                        </div>
                      ) : null}
                    </div>
                    {issues.map((m) => (
                      <p className="field-error" key={m.en} lang={lang}>
                        {m[lang]}
                      </p>
                    ))}
                    <button
                      ref={turnIn}
                      className="primary"
                      onClick={tryTurnIn}
                    >
                      Turn in
                    </button>
                  </>
                )}
              </section>
              <section className="comments" aria-label="Class comments">
                <h3>Class comments</h3>
                <p>
                  <strong>Ms. Rivera</strong> · What is your busiest day this
                  week? Why?
                </p>
                <p>
                  <strong>Sam Okafor</strong> · My busiest day is Monday. I work
                  in the morning and I have class at night.
                </p>
                {draft.stage === "complete" ? (
                  <p>
                    <strong>Maya Torres</strong> · {draft.comment.trim()}
                  </p>
                ) : null}
                {draft.stage === "turnedIn" ? (
                  <form
                    noValidate
                    onSubmit={(e) => {
                      e.preventDefault();
                      post();
                    }}
                  >
                    <div className="field">
                      <label htmlFor="comment">Add class comment</label>
                      <textarea
                        id="comment"
                        rows={3}
                        maxLength={500}
                        value={draft.comment}
                        aria-invalid={!!commentIssue}
                        aria-describedby={
                          commentIssue ? "comment-error" : undefined
                        }
                        onChange={(e) =>
                          update({ ...draft, comment: e.target.value })
                        }
                      />
                      {commentIssue ? (
                        <p
                          className="field-error"
                          id="comment-error"
                          lang={lang}
                        >
                          {commentIssue[lang]}
                        </p>
                      ) : null}
                    </div>
                    <button className="primary" type="submit">
                      Post
                    </button>
                  </form>
                ) : null}
              </section>
              {draft.stage === "complete" ? (
                <div lang={lang}>
                  <p>
                    {t(
                      "This is practice. Nothing went to a real class.",
                      "Esto es práctica. No se envió nada a una clase real.",
                    )}
                  </p>
                  <button onClick={p.reset}>
                    {t("Practice again", "Practicar de nuevo")}
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
        {picker ? (
          <FilePicker
            title={picker === "drive" ? "Google Drive" : "Open a file"}
            place={picker === "drive" ? "My Drive" : "Documents"}
            attached={draft.attached}
            onPick={attach}
            onCancel={() => setPicker(null)}
          />
        ) : null}
        {confirm ? (
          <ConfirmTurnIn
            count={draft.attached.length}
            onCancel={() => setConfirm(false)}
            onConfirm={() => {
              setConfirm(false);
              p.go("turnedIn");
            }}
          />
        ) : null}
      </section>
    </PracticeShell>
  );
}
/** Native <dialog> gives focus trapping and Escape; opening it is DOM sync, so it lives in an effect. */
function Modal({
  labelledBy,
  onCancel,
  children,
}: {
  labelledBy: string;
  onCancel: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      className="practice-dialog"
      aria-labelledby={labelledBy}
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
    >
      {children}
    </dialog>
  );
}
function FilePicker({
  title,
  place,
  attached,
  onPick,
  onCancel,
}: {
  title: string;
  place: string;
  attached: FileId[];
  onPick: (id: FileId) => void;
  onCancel: () => void;
}) {
  const [choice, setChoice] = useState<FileId | null>(null);
  return (
    <Modal labelledBy="picker-title" onCancel={onCancel}>
      <h2 id="picker-title">{title}</h2>
      <p className="sender">{place}</p>
      <form
        method="dialog"
        onSubmit={(e) => {
          e.preventDefault();
          if (choice) onPick(choice);
        }}
      >
        <fieldset>
          <legend>Choose a file</legend>
          {FILES.map((f) => (
            <label key={f.id} className="file-choice">
              <input
                type="radio"
                name="file"
                value={f.id}
                checked={choice === f.id}
                disabled={attached.includes(f.id)}
                onChange={() => setChoice(f.id)}
              />
              <span>{f.name}</span>
              <span className="file-date">
                {attached.includes(f.id) ? "Attached" : f.modified}
              </span>
            </label>
          ))}
        </fieldset>
        <div className="inline-actions">
          <button className="primary" type="submit" disabled={!choice}>
            Add
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
function ConfirmTurnIn({
  count,
  onCancel,
  onConfirm,
}: {
  count: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal labelledBy="confirm-title" onCancel={onCancel}>
      <h2 id="confirm-title">Turn in your work?</h2>
      <p>
        {count} attachment{count === 1 ? "" : "s"} will be submitted for “My
        weekly schedule.”
      </p>
      <div className="inline-actions">
        <button className="primary" onClick={onConfirm}>
          Turn in
        </button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </Modal>
  );
}
