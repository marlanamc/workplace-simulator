"use client";

import { historyFor, JOB_SEEKER, type HistoryRow } from "@/lib/tasks/job-application/content";
import type { Lang } from "@/lib/task-types";
import { useLesson } from "@/lib/lesson-context";
import ShowMeHighlight from "@/components/task/ShowMeHighlight";
import { SHOW_ME_POINTER, useShowMe } from "@/lib/use-show-me";
import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import { useWindowManager } from "@/lib/window-manager";
import { TASK_ICONS } from "@/lib/icons";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import NeedAStart from "@/components/task/NeedAStart";
import RightNowBar from "@/components/task/RightNowBar";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import {
  RESUME_COPY,

  SKILL_CHOICES as ALL_SKILL_CHOICES,
  SUMMARY_STARTERS,
  BULLET_STARTERS,
  LESSON_SUMMARY_STARTERS,
  LESSON_BULLET_STARTERS_BY_ROLE,
  LESSONS,
  RIGHT_NOW_LABEL,
  RIGHT_NOW_STEPS,
  LESSON_RIGHT_NOW_STEPS,
  summaryProblem,
  summaryHint,
  bulletProblem,
  bulletHint,
  bulletLooksReal,
  describeSubmission,
} from "@/lib/tasks/resume-build/content";

const RULE = "mt-3 border-t border-[#e0e0e0] pt-2 text-[10px] font-medium uppercase tracking-wide text-[#80868b]";

/**
 * The résumé as a page: the live preview beside the form, and the finished
 * page full width once it is saved, so the learner sees what they made.
 */
function ResumePage({
  lang,
  name,
  contactLine,
  education,
  summary,
  history,
  bullets,
  skills,
  large = false,
}: {
  lang: Lang;
  name: string;
  contactLine?: string;
  education?: string;
  summary: string;
  history: HistoryRow[];
  bullets: string[];
  skills: string[];
  large?: boolean;
}) {
  const c = RESUME_COPY[lang];
  return (
    <div
      data-testid={large ? "resume-final" : undefined}
      className={`rounded-xl border border-[#dadce0] bg-white leading-relaxed ${large ? "p-8 text-[15px]" : "p-4 text-[12px]"}`}
    >
      {!large && <div className="text-[10px] font-medium uppercase tracking-wide text-[#80868b]">{c.previewLabel}</div>}
      <div className={`font-semibold text-[#202124] ${large ? "text-[24px]" : "mt-2 text-[15px]"}`}>{name}</div>
      {contactLine && <div className="text-[#5f6368]">{contactLine}</div>}
      <p className="mt-1 whitespace-pre-wrap text-[#3c4043]">{summary || "…"}</p>
      <div className={RULE}>{c.experienceLabel}</div>
      {history.map((role, i) => (
        <div key={i} className="mt-2">
          <div className="font-medium text-[#202124]">{role.title[lang]}</div>
          <div className="text-[#5f6368]">{role.org} · {role.span[lang]}</div>
          {bullets[i] ? <div className="mt-0.5 text-[#3c4043]">• {bullets[i]}</div> : null}
        </div>
      ))}
      {skills.length > 0 && (
        <>
          <div className={RULE}>{c.skillsLabel}</div>
          <div className="mt-1 text-[#3c4043]">{skills.join(" · ")}</div>
        </>
      )}
      {education && (
        <>
          <div className={RULE}>{c.educationLabel}</div>
          <div className="mt-1 text-[#3c4043]">{education}</div>
        </>
      )}
    </div>
  );
}

export default function ResumeBuildTask() {
  const { markComplete, completedTaskKeys, lang, displayName, writing } = useProgress();
  const { browserTabToken } = useWindowManager();

  const [done, setDone] = useState(completedTaskKeys.includes("resume-build"));
  const [lastToken, setLastToken] = useState(browserTabToken);
  if (browserTabToken !== lastToken) {
    setLastToken(browserTabToken);
    setDone(completedTaskKeys.includes("resume-build"));
  }

  const lesson = useLesson();
  const inLesson = lesson !== null;
  const showMe = useShowMe();
  const WORK_HISTORY = historyFor(completedTaskKeys, inLesson);
  const BULLET_ROLES = WORK_HISTORY.slice(0, 2);
  const summaryStarters = inLesson ? LESSON_SUMMARY_STARTERS : SUMMARY_STARTERS;
  const bulletStarters = BULLET_STARTERS;
  // A lesson has no game history to hide skills behind: every chip is fair.
  const SKILL_CHOICES = inLesson ? ALL_SKILL_CHOICES : ALL_SKILL_CHOICES.filter((skill) => {
    if (skill.key === 'budget') return completedTaskKeys.includes('budget-sheet');
    if (skill.key === 'training') return completedTaskKeys.includes('team-meeting');
    if (skill.key === 'scheduling') return completedTaskKeys.includes('team-schedule');
    if (skill.key === 'customer') return completedTaskKeys.includes('priority-call');
    return true;
  });
  const [summary, setSummary] = useState(() => writing['resume-build']?.fields[0]?.value ?? writing['job-application']?.fields.at(-1)?.value ?? '');
  const [bullets, setBullets] = useState<string[]>(() => {
    const saved = writing['resume-build'];
    return BULLET_ROLES.map((role) => saved?.fields.find((field) => field.label === role.title[saved.lang])?.value ?? '');
  });
  const [skills, setSkills] = useState<string[]>(() => {
    const saved = writing['resume-build'];
    const labels = saved?.fields.at(-1)?.value.split(', ') ?? [];
    return ALL_SKILL_CHOICES.filter((skill) => saved && labels.includes(skill.label[saved.lang])).map((skill) => skill.key);
  });
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  // A rejected Save: "On my own" lessons keep the starters hidden until then.
  const [missed, setMissed] = useState(false);

  const c = RESUME_COPY[lang];
  // A lesson learner writes Sam's résumé: Sam's name, contact and school head
  // the page, from the same persona the info card shows.
  const name = (inLesson ? lesson?.persona ?? JOB_SEEKER.name : displayName.trim()) || c.namePlaceholder;
  const contactLine = inLesson ? `${JOB_SEEKER.phone} · ${JOB_SEEKER.email} · ${JOB_SEEKER.city}` : undefined;
  const education = inLesson ? JOB_SEEKER.school[lang] : undefined;
  const skillLabels = SKILL_CHOICES.filter((s) => skills.includes(s.key)).map((s) => s.label[lang]);

  const setBullet = (i: number, value: string) =>
    setBullets((prev) => prev.map((b, j) => (j === i ? value : b)));

  const toggleSkill = (key: string) =>
    setSkills((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const summaryNow = summaryProblem(summary);
  const bulletNow = bulletProblem(bullets);

  const trySave = () => {
    if (summaryNow) {
      setMissed(true);
      return say(summaryHint(summaryNow, lang));
    }
    if (bulletNow) {
      setMissed(true);
      return say(bulletHint(bulletNow.kind, BULLET_ROLES[bulletNow.index]?.title[lang] ?? "", lang));
    }
    if (skills.length < 3) return say(c.needSkills);
    setDone(true);
    markComplete("resume-build", "build_resume", describeSubmission({ summary, bullets, skills }, lang, BULLET_ROLES));
  };

  const restart = () => {
    setDone(false);
    setMissed(false);
    setSummary("");
    setBullets(BULLET_ROLES.map(() => ""));
    setSkills([]);
  };

  const stepIndex = summaryNow ? 0 : bulletNow ? 1 : 2;
  const showMeIds = ["summary-box", "bullet-box", "skill-chips"];

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-[#f1f3f4] text-[14px] text-[#202124]">
      <div className="flex items-center gap-3 border-b border-[#dadce0] bg-white px-4 py-2.5">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-[6px] text-white"
          style={{ background: "#4285f4" }}
          aria-hidden
        >
          <span className="text-[13px] font-bold">D</span>
        </span>
        <span className="text-[15px] font-medium text-[#3c4043]">{c.appName}</span>
      </div>

      {!done && (
        <RightNowBar
          icon={TASK_ICONS["resume-build"]}
          stepIndex={stepIndex}
          steps={inLesson ? LESSON_RIGHT_NOW_STEPS : RIGHT_NOW_STEPS}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onShowMe={() => showMe.toggleFor(showMeIds[stepIndex])}
          showMeActive={showMe.targetId === showMeIds[stepIndex]}
          onHelp={() => setHelp(true)}
        />
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto w-full max-w-[760px]">
          {done ? (
            <div className="flex flex-col gap-5">
              <TaskDoneCard kicker={c.sentKicker} />
              <p className="text-[14px] leading-relaxed text-[#3c4043]">{c.doneBody}</p>
              <ResumePage
                large
                lang={lang}
                name={name}
                contactLine={contactLine}
                education={education}
                summary={summary}
                history={WORK_HISTORY}
                bullets={bullets}
                skills={skillLabels}
              />
              <TaskDoneActions
                kicker={c.sentKicker}
                tryAgainLabel={c.tryAgain}
                backToDeskLabel={c.backToDesk}
                onTryAgain={restart}
              />
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-[1fr_300px]">
              {/* form */}
              <div className="flex flex-col gap-4">
                <p className="text-[13px] leading-relaxed text-[#5f6368]">{c.intro}</p>
                {contactLine && (
                  <section className="rounded-xl border border-[#dadce0] bg-white p-4 text-[13px] text-[#3c4043]">
                    <div className="font-medium text-[#202124]">{c.contactLabel}</div>
                    <div className="mt-1">{name} · {contactLine}</div>
                    <div className="mt-2 font-medium text-[#202124]">{c.educationLabel}</div>
                    <div className="mt-1">{education}</div>
                  </section>
                )}

                <section className="rounded-xl border border-[#dadce0] bg-white p-4">
                  <label className="text-[13px] font-medium text-[#202124]">{c.summaryLabel}</label>
                  <textarea
                    data-showme="summary-box"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder={c.summaryHint}
                    className="mt-2 min-h-[64px] w-full resize-y rounded-lg border border-[#dadce0] bg-white px-3 py-2 text-[15px] leading-relaxed outline-none focus:border-[#4285f4]"
                  />
                  <div className="mt-2">
                    <NeedAStart lang={lang} starters={summaryStarters[lang]} missed={missed} onPick={(s) => setSummary((b) => (b ? `${b} ` : "") + s)} />
                  </div>
                </section>

                <section className="rounded-xl border border-[#dadce0] bg-white p-4">
                  <div className="text-[13px] font-medium text-[#202124]">{c.experienceLabel}</div>
                  <div className="mt-3 flex flex-col gap-4">
                    {BULLET_ROLES.map((role, i) => (
                      <div key={i}>
                        <div className="text-[14px] font-medium text-[#202124]">{role.title[lang]}</div>
                        <div className="text-[12px] text-[#5f6368]">{role.org} · {role.span[lang]}</div>
                        {role.duties && <p className="mt-1 text-[13px] leading-snug text-[#3c4043]">{role.duties[lang]}</p>}
                        <textarea
                          data-showme={i === (bulletNow?.index ?? bullets.findIndex((b) => !bulletLooksReal(b))) ? "bullet-box" : undefined}
                          value={bullets[i]}
                          onChange={(e) => setBullet(i, e.target.value)}
                          placeholder={c.bulletHint}
                          className="mt-2 min-h-[52px] w-full resize-y rounded-lg border border-[#dadce0] bg-white px-3 py-2 text-[14px] leading-relaxed outline-none focus:border-[#4285f4]"
                        />
                        <div className="mt-1.5">
                          <NeedAStart
                            lang={lang}
                            starters={inLesson ? (LESSON_BULLET_STARTERS_BY_ROLE[i] ?? LESSON_BULLET_STARTERS_BY_ROLE[0])[lang] : bulletStarters[lang]}
                            missed={missed}
                            onPick={(s) => setBullet(i, (bullets[i] ? `${bullets[i]} ` : "") + s)}
                          />
                        </div>
                      </div>
                    ))}
                    {WORK_HISTORY.slice(2).map((role, i) => (
                      <div key={`ro-${i}`} className="opacity-70">
                        <div className="text-[14px] font-medium text-[#202124]">{role.title[lang]}</div>
                        <div className="text-[12px] text-[#5f6368]">{role.org} · {role.span[lang]}</div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-xl border border-[#dadce0] bg-white p-4">
                  <div className="text-[13px] font-medium text-[#202124]">{c.skillsLabel}</div>
                  <div className="mt-0.5 text-[12px] text-[#5f6368]">{c.skillsHint}</div>
                  <div data-showme="skill-chips" className="mt-3 flex flex-wrap gap-2">
                    {SKILL_CHOICES.map((s) => {
                      const on = skills.includes(s.key);
                      return (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => toggleSkill(s.key)}
                          className={`min-h-[34px] rounded-full border px-3 text-[13px] cursor-pointer ${
                            on ? "border-[#4285f4] bg-[#e8f0fe] text-[#1a56c4]" : "border-[#dadce0] bg-white text-[#3c4043] hover:bg-[#f8f9fa]"
                          }`}
                        >
                          {on ? "✓ " : ""}{s.label[lang]}
                        </button>
                      );
                    })}
                  </div>
                </section>

                <button
                  type="button"
                  onClick={trySave}
                  className="inline-flex min-h-[46px] items-center justify-center self-start rounded-full bg-[#4285f4] px-6 text-[15px] font-medium text-white cursor-pointer hover:brightness-95"
                >
                  {c.save}
                </button>
              </div>

              {/* preview */}
              <aside className="hidden md:block">
                <div className="sticky top-2">
                  <ResumePage
                    lang={lang}
                    name={name}
                    contactLine={contactLine}
                    education={education}
                    summary={summary}
                    history={WORK_HISTORY}
                    bullets={bullets.slice(0, BULLET_ROLES.length)}
                    skills={skillLabels}
                  />
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>

      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={c.lessonKicker}
        lesson={LESSONS[lang][0]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
      />
      <NudgeToast text={nudge} onDismiss={dismiss} />
      <ShowMeHighlight targetId={showMe.targetId} label={SHOW_ME_POINTER[lang]} onDismiss={showMe.clear} />
    </div>
  );
}
