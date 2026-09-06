"use client";

import { practicedHistory } from "@/lib/tasks/job-application/content";
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
  LESSONS,
  RIGHT_NOW_LABEL,
  RIGHT_NOW_STEPS,
  summaryLooksReal,
  bulletLooksReal,
  describeSubmission,
} from "@/lib/tasks/resume-build/content";

export default function ResumeBuildTask() {
  const { markComplete, completedTaskKeys, lang, displayName, writing } = useProgress();
  const { browserTabToken } = useWindowManager();

  const [done, setDone] = useState(completedTaskKeys.includes("resume-build"));
  const [lastToken, setLastToken] = useState(browserTabToken);
  if (browserTabToken !== lastToken) {
    setLastToken(browserTabToken);
    setDone(completedTaskKeys.includes("resume-build"));
  }

  const WORK_HISTORY = practicedHistory(completedTaskKeys);
  const BULLET_ROLES = WORK_HISTORY.slice(0, 2);
  const SKILL_CHOICES = ALL_SKILL_CHOICES.filter((skill) => {
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

  const c = RESUME_COPY[lang];

  const setBullet = (i: number, value: string) =>
    setBullets((prev) => prev.map((b, j) => (j === i ? value : b)));

  const toggleSkill = (key: string) =>
    setSkills((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const bulletsReady = bullets.every(bulletLooksReal);

  const trySave = () => {
    if (!summaryLooksReal(summary)) return say(c.needSummary);
    if (!bulletsReady) return say(c.needBullets);
    if (skills.length < 3) return say(c.needSkills);
    setDone(true);
    markComplete("resume-build", "build_resume", describeSubmission({ summary, bullets, skills }, lang, BULLET_ROLES));
  };

  const restart = () => {
    setDone(false);
    setSummary("");
    setBullets(BULLET_ROLES.map(() => ""));
    setSkills([]);
  };

  const stepIndex = summaryLooksReal(summary) && bulletsReady ? 1 : 0;

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
          steps={RIGHT_NOW_STEPS}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onHelp={() => setHelp(true)}
        />
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto w-full max-w-[760px]">
          {done ? (
            <div className="flex flex-col gap-5">
              <TaskDoneCard kicker={c.sentKicker} />
              <p className="text-[14px] leading-relaxed text-[#3c4043]">{c.doneBody}</p>
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

                <section className="rounded-xl border border-[#dadce0] bg-white p-4">
                  <label className="text-[13px] font-medium text-[#202124]">{c.summaryLabel}</label>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder={c.summaryHint}
                    className="mt-2 min-h-[64px] w-full resize-y rounded-lg border border-[#dadce0] bg-white px-3 py-2 text-[15px] leading-relaxed outline-none focus:border-[#4285f4]"
                  />
                  <div className="mt-2">
                    <NeedAStart lang={lang} starters={SUMMARY_STARTERS[lang]} onPick={(s) => setSummary((b) => (b ? `${b} ` : "") + s)} />
                  </div>
                </section>

                <section className="rounded-xl border border-[#dadce0] bg-white p-4">
                  <div className="text-[13px] font-medium text-[#202124]">{c.experienceLabel}</div>
                  <div className="mt-3 flex flex-col gap-4">
                    {BULLET_ROLES.map((role, i) => (
                      <div key={i}>
                        <div className="text-[14px] font-medium text-[#202124]">{role.title[lang]}</div>
                        <div className="text-[12px] text-[#5f6368]">{role.org} · {role.span[lang]}</div>
                        <textarea
                          value={bullets[i]}
                          onChange={(e) => setBullet(i, e.target.value)}
                          placeholder={c.bulletHint}
                          className="mt-2 min-h-[52px] w-full resize-y rounded-lg border border-[#dadce0] bg-white px-3 py-2 text-[14px] leading-relaxed outline-none focus:border-[#4285f4]"
                        />
                        <div className="mt-1.5">
                          <NeedAStart lang={lang} starters={BULLET_STARTERS[lang]} onPick={(s) => setBullet(i, (bullets[i] ? `${bullets[i]} ` : "") + s)} />
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
                  <div className="mt-3 flex flex-wrap gap-2">
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
                <div className="sticky top-2 rounded-xl border border-[#dadce0] bg-white p-4 text-[12px] leading-relaxed">
                  <div className="text-[10px] font-medium uppercase tracking-wide text-[#80868b]">{c.previewLabel}</div>
                  <div className="mt-2 text-[15px] font-semibold text-[#202124]">{displayName}</div>
                  <p className="mt-1 whitespace-pre-wrap text-[#3c4043]">{summary || "…"}</p>
                  <div className="mt-3 border-t border-[#e0e0e0] pt-2 text-[10px] font-medium uppercase tracking-wide text-[#80868b]">
                    {c.experienceLabel}
                  </div>
                  {WORK_HISTORY.map((role, i) => (
                    <div key={i} className="mt-2">
                      <div className="font-medium text-[#202124]">{role.title[lang]}</div>
                      <div className="text-[#5f6368]">{role.org} · {role.span[lang]}</div>
                      {i < BULLET_ROLES.length && bullets[i] ? (
                        <div className="mt-0.5 text-[#3c4043]">• {bullets[i]}</div>
                      ) : null}
                    </div>
                  ))}
                  {skills.length > 0 && (
                    <>
                      <div className="mt-3 border-t border-[#e0e0e0] pt-2 text-[10px] font-medium uppercase tracking-wide text-[#80868b]">
                        {c.skillsLabel}
                      </div>
                      <div className="mt-1 text-[#3c4043]">
                        {SKILL_CHOICES.filter((s) => skills.includes(s.key)).map((s) => s.label[lang]).join(" · ")}
                      </div>
                    </>
                  )}
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
    </div>
  );
}
