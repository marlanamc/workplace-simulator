"use client";

import { useEffect, useRef, useState } from "react";
import { useJobCardOptional } from "@/lib/job-card-context";
import { useProgress } from "@/lib/progress-context";
import { useWindowManager } from "@/lib/window-manager";
import type { TaskKey } from "@/lib/desktop-content";
import { TASK_ICONS } from "@/lib/icons";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import NeedAStart from "@/components/task/NeedAStart";
import RightNowBar from "@/components/task/RightNowBar";
import ShowMeHighlight from "@/components/task/ShowMeHighlight";
import { SHOW_ME_POINTER, useShowMe } from "@/lib/use-show-me";
import { useLesson } from "@/lib/lesson-context";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import {
  JOB_POSTING_COPY,
  REQUIREMENTS,
  STARTERS as POSTING_STARTERS,
  LESSONS as POSTING_LESSONS,
  RIGHT_NOW_LABEL as POSTING_RN_LABEL,
  RIGHT_NOW_STEPS as POSTING_STEPS,
  LESSON_RIGHT_NOW_STEPS as POSTING_LESSON_STEPS,
  pickProblem,
  fitProblem,
  fitHint,
  describeSubmission as describePosting,
} from "@/lib/tasks/job-posting/content";
import {
  JOB_APPLICATION_COPY,
  historyFor,
  AVAILABILITY_OPTIONS,
  STARTERS as APP_STARTERS,
  LESSONS as APP_LESSONS,
  RIGHT_NOW_LABEL as APP_RN_LABEL,
  RIGHT_NOW_STEPS as APP_STEPS,
  LESSON_RIGHT_NOW_STEPS as APP_LESSON_STEPS,
  whyProblem,
  whyHint,
  availabilityFits,
  contactProblem,
  contactFieldMatches,
  CONTACT_FIELDS,
  CONTACT_HINT,
  type ContactField,
  type ContactValues,
  describeSubmission as describeApplication,
} from "@/lib/tasks/job-application/content";

const JOB_TASK_ORDER: TaskKey[] = ["job-posting", "job-application"];

function activeJobTaskFor(completedTaskKeys: TaskKey[]): TaskKey {
  return JOB_TASK_ORDER.find((k) => !completedTaskKeys.includes(k)) ?? JOB_TASK_ORDER[JOB_TASK_ORDER.length - 1];
}

export default function JobsTask() {
  const { markComplete, completedTaskKeys, lang, writing } = useProgress();
  const { browserTabToken } = useWindowManager();

  const [active, setActive] = useState<TaskKey>(() => activeJobTaskFor(completedTaskKeys));
  const [lastToken, setLastToken] = useState(browserTabToken);
  if (browserTabToken !== lastToken) {
    setLastToken(browserTabToken);
    setActive(activeJobTaskFor(completedTaskKeys));
  }

  const done = completedTaskKeys.includes(active);
  const { nudge, say, dismiss } = useNudge();
  const [help, setHelp] = useState(false);
  const showMe = useShowMe();
  const inLesson = useLesson() !== null;

  const card = useJobCardOptional();
  // A rejected Apply / Submit: "On my own" lessons keep the starters hidden until then.
  const [missed, setMissed] = useState(false);
  const reject = (message: string) => {
    setMissed(true);
    say(message);
  };

  // ---- job-posting state ----
  const [picked, setPicked] = useState<string[]>([]);
  const [fit, setFit] = useState("");

  // ---- job-application state ----
  const [availability, setAvailability] = useState<string | null>(null);
  // Lesson only: the character's contact boxes, checked against the info card.
  const [contact, setContact] = useState<ContactValues>({ name: "", phone: "", email: "", start: "" });
  const [contactCorrection, setContactCorrection] = useState<ContactField | null>(null);
  const [whyOverride, setWhy] = useState<string | null>(null);
  const why = whyOverride ?? (writing["job-application"]?.fields.at(-1)?.value ?? writing["job-posting"]?.fields.at(-1)?.value ?? "");

  const pc = JOB_POSTING_COPY[lang];
  const ac = JOB_APPLICATION_COPY[lang];

  const degreeNote = inLesson ? pc.lessonDegreeNote : pc.degreeNote;
  const togglePick = (key: string) => {
    setPicked((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
    if (key === "degree" && !picked.includes("degree")) say(degreeNote);
  };

  const tryApply = () => {
    const pick = pickProblem(picked);
    if (pick) return say(pick === "degree" ? degreeNote : pc.needPicks);
    const problem = fitProblem(fit);
    if (problem) return reject(fitHint(problem, lang));
    markComplete("job-posting", "match_posting", describePosting(picked, fit, lang));
  };

  const setContactField = (field: ContactField, value: string) => {
    // A correction about another box describes nothing the learner is doing now.
    if (contactCorrection && contactCorrection !== field) {
      card?.clearCorrection();
      setContactCorrection(null);
    }
    setContact((prev) => ({ ...prev, [field]: value }));
  };
  const checkContactField = (field: ContactField) => {
    if (contact[field].trim() && !contactFieldMatches(field, contact[field])) {
      setContactCorrection(field);
      say(CONTACT_HINT[field].wrong[lang]);
    }
  };
  const chooseAvailability = (key: string) => {
    setAvailability(key);
    // Corrected at the field, while the job's hours are still on screen.
    if (!availabilityFits(key, inLesson)) say(ac.needFullTime);
  };

  const trySubmit = () => {
    if (inLesson) {
      const problem = contactProblem(contact);
      if (problem) {
        setContactCorrection(problem.field);
        return say(CONTACT_HINT[problem.field][problem.kind][lang]);
      }
    }
    if (!availability) return say(ac.needAvailability);
    if (!availabilityFits(availability, inLesson)) return say(ac.needFullTime);
    const problem = whyProblem(why);
    if (problem) return reject(whyHint(problem, lang));
    markComplete(
      "job-application",
      "submit_application",
      describeApplication({ availability, why, ...(inLesson ? { contact } : {}) }, lang),
    );
  };

  const restart = () => {
    setMissed(false);
    if (active === "job-posting") {
      setPicked([]);
      setFit("");
    } else {
      setAvailability(null);
      setWhy("");
      setContact({ name: "", phone: "", email: "", start: "" });
    }
  };

  const isPosting = active === "job-posting";
  const steps = isPosting
    ? inLesson ? POSTING_LESSON_STEPS : POSTING_STEPS
    : inLesson ? APP_LESSON_STEPS : APP_STEPS;
  const contactNow = inLesson ? contactProblem(contact) : null;
  const stepIndex = isPosting
    ? pickProblem(picked) === null
      ? 1
      : 0
    : inLesson
      ? contactNow
        ? 0
        : availabilityFits(availability, true)
          ? 2
          : 1
      : availability
        ? 1
        : 0;
  const showMeIds = isPosting
    ? ["req-list", "fit-box"]
    : inLesson
      ? [`contact-${contactNow?.field ?? "name"}`, "availability", "why-box"]
      : ["availability", "why-box"];

  const sentFields = done
    ? (isPosting
        ? describePosting(picked, fit, lang)
        : describeApplication({ availability: availability ?? "", why, ...(inLesson ? { contact } : {}) }, lang)
      ).fields.filter((f) => f.value)
    : [];

  // The application is long: when a section is done, bring the next one into
  // view (the availability box and the "why" box start below the fold).
  // A DOM sync with no state, so an effect is the right tool.
  const lastStep = useRef({ active, stepIndex });
  useEffect(() => {
    const prev = lastStep.current;
    lastStep.current = { active, stepIndex };
    if (prev.active !== active || stepIndex <= prev.stepIndex || isPosting || done) return;
    const el = document.querySelector<HTMLElement>(`[data-showme="${showMeIds[stepIndex]}"]`);
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
    if (el instanceof HTMLTextAreaElement) el.focus({ preventScroll: true });
  });

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-[#f6f8fc] text-[14px] text-[#202124]">
      <div className="flex items-center gap-3 border-b border-[#dadce0] bg-white px-4 py-2.5">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[13px] font-bold text-white"
          style={{ background: "#1a73e8" }}
          aria-hidden
        >
          H
        </span>
        <span className="text-[15px] font-medium text-[#3c4043]">
          {isPosting ? pc.siteName : ac.siteName}
        </span>
      </div>

      {!done && (
        <RightNowBar
          icon={TASK_ICONS[active]}
          stepIndex={stepIndex}
          steps={steps}
          lang={lang}
          rightNowLabel={isPosting ? POSTING_RN_LABEL : APP_RN_LABEL}
          onShowMe={() => showMe.toggleFor(showMeIds[stepIndex])}
          showMeActive={showMe.targetId === showMeIds[stepIndex]}
          onHelp={() => setHelp(true)}
        />
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4">
          {done ? (
            <>
              <TaskDoneCard kicker={isPosting ? pc.sentKicker : ac.sentKicker} />
              <p className="text-[14px] leading-relaxed text-[#3c4043]">
                {isPosting ? pc.doneBody : ac.doneBody}
              </p>
              {/* What was sent, so the finish shows the work, not just a stamp. */}
              {sentFields.length > 0 && (
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-xl border border-[#dadce0] bg-white p-5 text-[14px]">
                {sentFields.map((f) => (
                    <div key={f.label} className="contents">
                      <dt className="font-medium text-[#5f6368]">{f.label}</dt>
                      <dd className="whitespace-pre-wrap text-[#202124]">{f.value}</dd>
                    </div>
                  ))}
              </dl>
              )}
              {/* The posting stays readable after it is done: the résumé,
                  interview and offer are all checked against it. */}
              <section data-testid="jobs-posting-reference" className="rounded-xl border border-[#dadce0] bg-white p-5">
                <div className="text-[11px] font-medium uppercase tracking-wide text-[#5f6368]">{pc.heading}</div>
                <h2 className="mt-1 text-[18px] font-semibold text-[#202124]">{pc.jobTitle}</h2>
                <div className="mt-1 text-[13px] text-[#5f6368]">{pc.company} · {pc.location}</div>
                <div className="mt-0.5 text-[13px] text-[#188038]">{pc.pay}</div>
                <p className="mt-3 text-[14px] leading-relaxed text-[#3c4043]">{pc.about}</p>
                <div className="mt-3 text-[14px] font-medium text-[#202124]">{pc.reqLabel}</div>
                <ul className="mt-1 list-disc pl-5 text-[14px] leading-snug text-[#3c4043]">
                  {REQUIREMENTS.map((r) => <li key={r.key} className="mt-1">{r.text[lang]}</li>)}
                </ul>
              </section>
              <TaskDoneActions
                kicker={isPosting ? pc.sentKicker : ac.sentKicker}
                tryAgainLabel={isPosting ? pc.tryAgain : ac.tryAgain}
                backToDeskLabel={isPosting ? pc.backToDesk : ac.backToDesk}
                onTryAgain={restart}
              />
            </>
          ) : isPosting ? (
            <>
              <div className="rounded-xl border border-[#dadce0] bg-white p-5">
                <div className="text-[11px] font-medium uppercase tracking-wide text-[#5f6368]">{pc.heading}</div>
                <h1 className="mt-1 text-[22px] font-semibold text-[#202124]">{pc.jobTitle}</h1>
                <div className="mt-1 text-[13px] text-[#5f6368]">{pc.company} · {pc.location}</div>
                <div className="mt-0.5 text-[13px] text-[#188038]">{pc.pay}</div>
                <div className="mt-2 text-[12px] text-[#5f6368]">{pc.postedBy}</div>
                <div className="mt-4 text-[13px] font-medium text-[#3c4043]">{pc.aboutLabel}</div>
                <p className="mt-1 text-[14px] leading-relaxed text-[#3c4043]">{pc.about}</p>
              </div>

              <div className="rounded-xl border border-[#dadce0] bg-white p-5">
                <div className="text-[14px] font-medium text-[#202124]">{pc.reqLabel}</div>
                <div className="mt-1 text-[12px] text-[#5f6368]">{pc.reqHint}</div>
                <div data-showme="req-list" className="mt-3 flex flex-col gap-2">
                  {REQUIREMENTS.map((r) => {
                    const on = picked.includes(r.key);
                    return (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => togglePick(r.key)}
                        aria-pressed={on}
                        className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left cursor-pointer ${
                          on ? "border-[#1a73e8] bg-[#e8f0fe]" : "border-[#dadce0] bg-white hover:bg-[#f8f9fa]"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                            on ? "border-[#1a73e8] bg-[#1a73e8] text-white" : "border-[#9aa0a6] bg-white"
                          }`}
                          aria-hidden
                        >
                          {on ? "✓" : ""}
                        </span>
                        <span className="text-[14px] leading-snug text-[#202124]">{r.text[lang]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-[#dadce0] bg-white p-5">
                <label htmlFor="posting-fit" className="text-[14px] font-medium text-[#202124]">{pc.fitLabel}</label>
                <textarea
                  id="posting-fit"
                  data-showme="fit-box"
                  value={fit}
                  onChange={(e) => setFit(e.target.value)}
                  placeholder={pc.fitHint}
                  className="mt-2 min-h-[72px] w-full resize-y rounded-lg border border-[#dadce0] bg-white px-3 py-2 text-[15px] outline-none focus:border-[#1a73e8]"
                />
                <div className="mt-2">
                  <NeedAStart lang={lang} starters={POSTING_STARTERS[lang]} missed={missed} onPick={(s) => setFit((b) => (b ? `${b} ` : "") + s)} />
                </div>
              </div>

              <button
                type="button"
                onClick={tryApply}
                className="inline-flex min-h-[46px] items-center justify-center self-start rounded-full bg-[#1a73e8] px-6 text-[15px] font-medium text-white cursor-pointer hover:brightness-95"
              >
                {pc.apply}
              </button>
            </>
          ) : (
            <>
              <h1 className="text-[20px] font-semibold text-[#202124]">{ac.heading}</h1>
              <p className="text-[13px] leading-relaxed text-[#5f6368]">{ac.intro}</p>

              <div className="rounded-xl border border-[#dadce0] bg-white p-5">
                <div className="text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{ac.positionLabel}</div>
                <div className="mt-1 text-[15px] text-[#202124]">{ac.position}</div>
                <div className="mt-0.5 text-[13px] font-medium text-[#188038]">{ac.positionHours}</div>
              </div>

              {inLesson && (
                <div className="rounded-xl border border-[#dadce0] bg-white p-5">
                  <div className="text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{ac.contactLabel}</div>
                  <div className="mt-0.5 text-[12px] text-[#5f6368]">{ac.contactHint}</div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {CONTACT_FIELDS.map((field) => {
                      const label = { name: ac.nameLabel, phone: ac.phoneLabel, email: ac.emailLabel, start: ac.startLabel }[field];
                      return (
                        <label key={field} className="flex flex-col gap-1 text-[13px] font-medium text-[#3c4043]">
                          {label}
                          <input
                            data-showme={`contact-${field}`}
                            value={contact[field]}
                            onChange={(e) => setContactField(field, e.target.value)}
                            onBlur={() => checkContactField(field)}
                            placeholder={field === "start" ? ac.datePlaceholder : undefined}
                            inputMode={field === "phone" ? "tel" : field === "email" ? "email" : undefined}
                            autoComplete="off"
                            spellCheck={false}
                            className="min-h-[42px] rounded-lg border border-[#dadce0] bg-white px-3 text-[15px] font-normal text-[#202124] outline-none focus:border-[#1a73e8]"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-[#dadce0] bg-white p-5">
                <div className="text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{ac.historyLabel}</div>
                <div className="mt-0.5 text-[12px] text-[#5f6368]">{ac.historyHint}</div>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {historyFor(completedTaskKeys, inLesson).map((row, i) => (
                    <li key={i} className="border-l-2 border-[#dadce0] pl-3">
                      <div className="text-[14px] font-medium text-[#202124]">{row.title[lang]}</div>
                      <div className="text-[13px] text-[#5f6368]">{row.org} · {row.span[lang]}</div>
                      {row.duties && <p className="mt-1 text-[13px] leading-snug text-[#3c4043]">{row.duties[lang]}</p>}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-[#dadce0] bg-white p-5">
                <div className="text-[14px] font-medium text-[#202124]">{ac.availabilityLabel}</div>
                {/* The job's hours again, beside the choice they decide. */}
                <div className="mt-0.5 text-[13px] text-[#188038]">{ac.positionHours}</div>
                <div data-showme="availability" className="mt-3 flex flex-col gap-2">
                  {AVAILABILITY_OPTIONS.map((o) => {
                    const on = availability === o.key;
                    return (
                      <button
                        key={o.key}
                        type="button"
                        onClick={() => chooseAvailability(o.key)}
                        className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left cursor-pointer ${
                          on ? "border-[#1a73e8] bg-[#e8f0fe]" : "border-[#dadce0] bg-white hover:bg-[#f8f9fa]"
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            on ? "border-[#1a73e8]" : "border-[#9aa0a6]"
                          }`}
                          aria-hidden
                        >
                          {on ? <span className="h-2 w-2 rounded-full bg-[#1a73e8]" /> : null}
                        </span>
                        <span className="text-[14px] text-[#202124]">{o.label[lang]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-[#dadce0] bg-white p-5">
                <label htmlFor="application-why" className="text-[14px] font-medium text-[#202124]">{ac.whyLabel}</label>
                <textarea
                  id="application-why"
                  data-showme="why-box"
                  value={why}
                  onChange={(e) => setWhy(e.target.value)}
                  placeholder={ac.whyHint}
                  className="mt-2 min-h-[96px] w-full resize-y rounded-lg border border-[#dadce0] bg-white px-3 py-2 text-[15px] leading-relaxed outline-none focus:border-[#1a73e8]"
                />
                <div className="mt-2">
                  <NeedAStart lang={lang} starters={APP_STARTERS[lang]} missed={missed} onPick={(s) => setWhy((b) => (b ? `${b} ` : "") + s)} />
                </div>
              </div>

              <button
                type="button"
                onClick={trySubmit}
                className="inline-flex min-h-[46px] items-center justify-center self-start rounded-full bg-[#1a73e8] px-6 text-[15px] font-medium text-white cursor-pointer hover:brightness-95"
              >
                {ac.submit}
              </button>
            </>
          )}
        </div>
      </div>

      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={isPosting ? pc.lessonKicker : ac.lessonKicker}
        lesson={(isPosting ? POSTING_LESSONS : APP_LESSONS)[lang][0]}
        tipLabel={isPosting ? pc.tipLabel : ac.tipLabel}
        gotItLabel={isPosting ? pc.gotIt : ac.gotIt}
      />
      <NudgeToast text={nudge} onDismiss={dismiss} />
      <ShowMeHighlight targetId={showMe.targetId} label={SHOW_ME_POINTER[lang]} onDismiss={showMe.clear} />
    </div>
  );
}
