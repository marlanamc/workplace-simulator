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
import "./classroom.css";
/**
 * Looks like Google Classroom on a Chromebook, so the practice transfers to the
 * real class. Coaching errors stay in the help language.
 */
const WORK = [
  {
    title: "My weekly schedule",
    due: "Due Friday",
    posted: "Posted Sep 22",
    status: "Assigned",
    body: "Write your schedule for this week. Attach your file and turn it in.",
    target: true,
  },
  {
    title: "Vocabulary: At work",
    due: "Due Sep 26",
    posted: "Posted Sep 15",
    status: "Turned in",
    body: "Match each word to its picture.",
  },
  {
    title: "Reading: At the clinic",
    due: "Due Oct 3",
    posted: "Posted Sep 22",
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
  const url =
    draft.stage === "classwork"
      ? "classroom.google.com/w/english-3"
      : "classroom.google.com/c/english-3/a/my-weekly-schedule";
  return (
    <PracticeShell practice={p}>
      <section
        className="simulation gc-sim"
        lang="en"
        aria-label="Google Classroom homework practice"
      >
        <div className="gc-browser" aria-hidden="true">
          <div className="gc-tab">
            {draft.stage === "classwork" ? "English 3" : "My weekly schedule"}
          </div>
          <div className="gc-address">
            <span>🔒</span> {url}
            <span className="gc-practice" lang={lang}>
              {t("Practice", "Práctica")}
            </span>
          </div>
        </div>
        <div className="gc-appbar">
          <span className="gc-menu" aria-hidden="true">
            ☰
          </span>
          <ClassroomLogo />
          <span className="gc-crumbs">
            <span className="gc-product">Classroom</span>
            <span aria-hidden="true">›</span>
            {draft.stage === "classwork" || done ? (
              <span>English 3</span>
            ) : (
              <button
                className="gc-crumb-link"
                onClick={() => p.go("classwork")}
              >
                English 3
              </button>
            )}
          </span>
          <span className="gc-avatar" aria-hidden="true">
            M
          </span>
        </div>
        {draft.stage === "classwork" ? (
          <>
            <nav className="gc-tabs" aria-label="Class pages">
              <span>Stream</span>
              <span aria-current="page">Classwork</span>
              <span>People</span>
            </nav>
            <div className="gc-body">
              <h2 ref={heading} tabIndex={-1} className="gc-topic">
                Week 3
              </h2>
              <ul className="gc-work">
                {WORK.map((a) => (
                  <li
                    key={a.title}
                    className={expanded === a.title ? "open" : undefined}
                  >
                    <button
                      className="gc-row"
                      aria-expanded={expanded === a.title}
                      onClick={() =>
                        setExpanded(expanded === a.title ? null : a.title)
                      }
                    >
                      <AssignmentIcon muted={a.status === "Turned in"} />
                      <span className="gc-row-title">{a.title}</span>
                      <span className="gc-row-due">{a.due}</span>
                    </button>
                    {expanded === a.title ? (
                      <div className="gc-expand">
                        <p className="gc-expand-head">
                          <span>{a.posted}</span>
                          <span
                            className={
                              a.status === "Turned in"
                                ? "gc-status done"
                                : "gc-status"
                            }
                          >
                            {a.status}
                          </span>
                        </p>
                        <p>{a.body}</p>
                        {a.target ? (
                          <a
                            href="#instructions"
                            onClick={(e) => {
                              e.preventDefault();
                              p.go("assignment");
                            }}
                          >
                            View instructions
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="gc-body gc-detail">
            <div className="gc-main">
              <div className="gc-title-row">
                <AssignmentIcon muted={done} large />
                <div>
                  <h2 ref={heading} tabIndex={-1}>
                    My weekly schedule
                  </h2>
                  <p className="gc-muted">Ms. Rivera • Sep 22</p>
                  <p className="gc-meta">
                    <span>100 points</span>
                    <span>Due Friday, 11:59 PM</span>
                  </p>
                </div>
              </div>
              <p className="gc-instructions">
                Write your schedule for this week in a document. Attach the file
                and turn it in.
              </p>
              <section className="gc-comments" aria-label="Class comments">
                <h3>
                  <span aria-hidden="true">👥</span> Class comments
                </h3>
                <Comment
                  who="Ms. Rivera"
                  when="Sep 22"
                  text="What is your busiest day this week? Why?"
                  color="#e37400"
                />
                <Comment
                  who="Sam Okafor"
                  when="Sep 23"
                  text="My busiest day is Monday. I work in the morning and I have class at night."
                  color="#1e8e3e"
                />
                {draft.stage === "complete" ? (
                  <Comment
                    who="Maya Torres"
                    when="Just now"
                    text={draft.comment.trim()}
                    color="#1967d2"
                  />
                ) : null}
                {draft.stage === "turnedIn" ? (
                  <form
                    noValidate
                    className="gc-comment-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      post();
                    }}
                  >
                    <span className="gc-avatar" aria-hidden="true">
                      M
                    </span>
                    <textarea
                      id="comment"
                      rows={1}
                      maxLength={500}
                      placeholder="Add class comment…"
                      aria-label="Add class comment"
                      value={draft.comment}
                      aria-invalid={!!commentIssue}
                      aria-describedby={
                        commentIssue ? "comment-error" : undefined
                      }
                      onChange={(e) =>
                        update({ ...draft, comment: e.target.value })
                      }
                    />
                    <button className="gc-send" type="submit" aria-label="Post">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                    </button>
                  </form>
                ) : null}
                {commentIssue ? (
                  <p className="gc-error" id="comment-error" lang={lang}>
                    {commentIssue[lang]}
                  </p>
                ) : null}
              </section>
            </div>
            <aside className="gc-side">
              <section className="gc-card" aria-label="Your work">
                <div className="gc-card-head">
                  <h3>Your work</h3>
                  <span className={done ? "gc-status done" : "gc-status"}>
                    {done ? "Turned in" : "Assigned"}
                  </span>
                </div>
                {draft.attached.length ? (
                  <ul className="gc-attachments">
                    {draft.attached.map((id) => (
                      <li key={id}>
                        <FileIcon id={id} />
                        <span className="gc-file-name">
                          {fileName(id)}
                          <br />
                          <span className="gc-muted">
                            {id === "photo" ? "Image" : "Word"}
                          </span>
                        </span>
                        {done ? null : (
                          <button
                            className="gc-remove"
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
                    className="gc-outline"
                    onClick={() => {
                      setCommentTried(false);
                      p.go("assignment");
                    }}
                  >
                    Unsubmit
                  </button>
                ) : (
                  <>
                    <div className="gc-add">
                      <button
                        className="gc-outline"
                        aria-expanded={menu}
                        aria-haspopup="menu"
                        onClick={() => setMenu(!menu)}
                      >
                        + Add or create
                      </button>
                      {menu ? (
                        <div role="menu" className="gc-popup">
                          <button
                            role="menuitem"
                            onClick={() => {
                              setMenu(false);
                              setPicker("drive");
                            }}
                          >
                            <span aria-hidden="true" className="gc-drive-dot" />
                            Google Drive
                          </button>
                          <button
                            role="menuitem"
                            onClick={() => {
                              setMenu(false);
                              setPicker("computer");
                            }}
                          >
                            <span aria-hidden="true">📎</span>
                            File
                          </button>
                        </div>
                      ) : null}
                    </div>
                    {issues.map((m) => (
                      <p className="gc-error" key={m.en} lang={lang}>
                        {m[lang]}
                      </p>
                    ))}
                    <button
                      ref={turnIn}
                      className="gc-filled"
                      onClick={tryTurnIn}
                    >
                      Turn in
                    </button>
                  </>
                )}
              </section>
              <section className="gc-card gc-private" aria-hidden="true">
                <h3>
                  <span>👤</span> Private comments
                </h3>
                <p className="gc-muted">Add comment to Ms. Rivera</p>
              </section>
            </aside>
            {draft.stage === "complete" ? (
              <div className="gc-done" lang={lang}>
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
          </div>
        )}
        {picker === "drive" ? (
          <DrivePicker
            attached={draft.attached}
            onPick={attach}
            onCancel={() => setPicker(null)}
          />
        ) : null}
        {picker === "computer" ? (
          <FilesDialog
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
function ClassroomLogo() {
  return (
    <svg className="gc-logo" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1" y="3" width="22" height="18" rx="2" fill="#0f9d58" />
      <rect x="3" y="5" width="18" height="12" fill="#57bb8a" />
      <circle cx="12" cy="10" r="2" fill="#fff" />
      <path d="M8 15c0-2 1.8-3 4-3s4 1 4 3" fill="#fff" />
      <rect x="14" y="18" width="5" height="1.5" fill="#fff" />
    </svg>
  );
}
function AssignmentIcon({
  muted,
  large,
}: {
  muted?: boolean;
  large?: boolean;
}) {
  return (
    <span
      className={`gc-icon${muted ? " muted" : ""}${large ? " large" : ""}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24">
        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
      </svg>
    </span>
  );
}
function FileIcon({ id }: { id: FileId }) {
  const photo = id === "photo";
  return (
    <span
      className={photo ? "gc-file-icon photo" : "gc-file-icon"}
      aria-hidden="true"
    >
      {photo ? "▲" : "W"}
    </span>
  );
}
function Comment({
  who,
  when,
  text,
  color,
}: {
  who: string;
  when: string;
  text: string;
  color: string;
}) {
  return (
    <div className="gc-comment">
      <span
        className="gc-avatar"
        style={{ background: color }}
        aria-hidden="true"
      >
        {who[0]}
      </span>
      <p>
        <strong>{who}</strong> <span className="gc-muted">{when}</span>
        <br />
        {text}
      </p>
    </div>
  );
}
/** Native <dialog> gives focus trapping and Escape; opening it is DOM sync, so it lives in an effect. */
function Modal({
  labelledBy,
  className,
  onCancel,
  children,
}: {
  labelledBy: string;
  className: string;
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
      className={`practice-dialog ${className}`}
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
type PickerProps = {
  attached: FileId[];
  onPick: (id: FileId) => void;
  onCancel: () => void;
};
function FileChoices({
  attached,
  choice,
  setChoice,
}: {
  attached: FileId[];
  choice: FileId | null;
  setChoice: (id: FileId) => void;
}) {
  return (
    <fieldset>
      <legend className="sr-only">Choose a file</legend>
      <div className="gc-file-head" aria-hidden="true">
        <span>Name</span>
        <span>Last modified</span>
      </div>
      {FILES.map((f) => (
        <label
          key={f.id}
          className={choice === f.id ? "file-choice chosen" : "file-choice"}
        >
          <input
            type="radio"
            name="file"
            value={f.id}
            checked={choice === f.id}
            disabled={attached.includes(f.id)}
            onChange={() => setChoice(f.id)}
          />
          <FileIcon id={f.id} />
          <span>{f.name}</span>
          <span className="file-date">
            {attached.includes(f.id) ? "Attached" : f.modified}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
function DrivePicker({ attached, onPick, onCancel }: PickerProps) {
  const [choice, setChoice] = useState<FileId | null>(null);
  return (
    <Modal labelledBy="drive-title" className="gc-drive" onCancel={onCancel}>
      <form
        method="dialog"
        onSubmit={(e) => {
          e.preventDefault();
          if (choice) onPick(choice);
        }}
      >
        <div className="gc-dialog-head">
          <h2 id="drive-title">Insert files using Google Drive</h2>
          <button type="button" aria-label="Close" onClick={onCancel}>
            ✕
          </button>
        </div>
        <div className="gc-drive-tabs" aria-hidden="true">
          <span>Recent</span>
          <span className="on">My Drive</span>
          <span>Shared with me</span>
          <span>Starred</span>
        </div>
        <FileChoices
          attached={attached}
          choice={choice}
          setChoice={setChoice}
        />
        <div className="gc-dialog-actions">
          <button className="gc-filled" type="submit" disabled={!choice}>
            Insert
          </button>
          <button className="gc-text" type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
/** The ChromeOS Files "open" window that the File option brings up on a Chromebook. */
function FilesDialog({ attached, onPick, onCancel }: PickerProps) {
  const [choice, setChoice] = useState<FileId | null>(null);
  return (
    <Modal labelledBy="files-title" className="gc-files" onCancel={onCancel}>
      <form
        method="dialog"
        onSubmit={(e) => {
          e.preventDefault();
          if (choice) onPick(choice);
        }}
      >
        <div className="gc-dialog-head">
          <h2 id="files-title">Select a file to open</h2>
        </div>
        <div className="gc-files-body">
          <ul className="gc-files-side" aria-hidden="true">
            <li>🕘 Recent</li>
            <li className="on">📁 My files</li>
            <li>⬇ Downloads</li>
            <li>△ Google Drive</li>
          </ul>
          <div>
            <p className="gc-muted gc-path">My files › Documents</p>
            <FileChoices
              attached={attached}
              choice={choice}
              setChoice={setChoice}
            />
          </div>
        </div>
        <div className="gc-dialog-actions">
          <button className="gc-text" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className="gc-filled" type="submit" disabled={!choice}>
            Open
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
    <Modal
      labelledBy="confirm-title"
      className="gc-confirm"
      onCancel={onCancel}
    >
      <h2 id="confirm-title">Turn in your work?</h2>
      <p>
        {count} attachment{count === 1 ? "" : "s"} will be submitted for “My
        weekly schedule.”
      </p>
      <div className="gc-dialog-actions">
        <button className="gc-text" onClick={onCancel}>
          Cancel
        </button>
        <button className="gc-text strong" onClick={onConfirm}>
          Turn in
        </button>
      </div>
    </Modal>
  );
}
