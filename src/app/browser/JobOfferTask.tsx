"use client";

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
  JOB_OFFER_COPY,
  OFFER_LETTER,
  DATE_CHOICES,
  REPLY_STARTERS,
  LESSONS,
  RIGHT_NOW_LABEL,
  RIGHT_NOW_STEPS,
  replyLooksReal,
  describeSubmission,
} from "@/lib/tasks/job-offer/content";

export default function JobOfferTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const { browserTabToken } = useWindowManager();

  const [done, setDone] = useState(completedTaskKeys.includes("job-offer"));
  const [lastToken, setLastToken] = useState(browserTabToken);
  if (browserTabToken !== lastToken) {
    setLastToken(browserTabToken);
    setDone(completedTaskKeys.includes("job-offer"));
  }

  const [dateKey, setDateKey] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();

  const c = JOB_OFFER_COPY[lang];
  const datePicked = DATE_CHOICES.find((d) => d.key === dateKey)?.ok === true;

  const pickDate = (key: string) => {
    setDateKey(key);
    if (!DATE_CHOICES.find((d) => d.key === key)?.ok) say(c.wrongDate);
  };

  const trySend = () => {
    if (!datePicked) return say(c.needDate);
    if (!replyLooksReal(reply)) return say(c.needReply);
    setDone(true);
    markComplete("job-offer", "accept_offer", describeSubmission({ dateKey: dateKey!, reply }, lang));
  };

  const restart = () => {
    setDone(false);
    setDateKey(null);
    setReply("");
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-[#f6f8fc] text-[14px] text-[#202124]">
      <div className="flex items-center gap-3 border-b border-[#dadce0] bg-white px-4 py-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8430ce] text-[12px] font-bold text-white" aria-hidden>
          AR
        </span>
        <div className="leading-tight">
          <div className="text-[14px] font-medium text-[#3c4043]">{c.subject}</div>
          <div className="text-[11px] text-[#5f6368]">{c.from} · {c.fromEmail}</div>
        </div>
      </div>

      {!done && (
        <RightNowBar
          icon={TASK_ICONS["job-offer"]}
          stepIndex={datePicked ? 1 : 0}
          steps={RIGHT_NOW_STEPS}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onHelp={() => setHelp(true)}
        />
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4">
          {done ? (
            <>
              <TaskDoneCard kicker={c.sentKicker} />
              <p className="text-[14px] leading-relaxed text-[#3c4043]">{c.doneBody}</p>
              <TaskDoneActions
                kicker={c.sentKicker}
                tryAgainLabel={c.tryAgain}
                backToDeskLabel={c.backToDesk}
                onTryAgain={restart}
              />
            </>
          ) : (
            <>
              <article className="rounded-xl border border-[#dadce0] bg-white p-5">
                <div className="text-[11px] font-medium uppercase tracking-wide text-[#5f6368]">{c.letterHeading}</div>
                <div className="mt-3 flex flex-col gap-3 text-[14px] leading-relaxed text-[#202124]">
                  {OFFER_LETTER[lang].map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </article>

              <section className="rounded-xl border border-[#dadce0] bg-white p-4">
                <div className="text-[14px] font-medium text-[#202124]">{c.startDateLabel}</div>
                <div className="mt-3 flex flex-col gap-2">
                  {DATE_CHOICES.map((d) => {
                    const on = dateKey === d.key;
                    return (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => pickDate(d.key)}
                        className={`rounded-lg border px-3 py-2.5 text-left text-[14px] cursor-pointer ${
                          on
                            ? d.ok
                              ? "border-[#188038] bg-[#e6f4ea]"
                              : "border-[#d93025] bg-[#fce8e6]"
                            : "border-[#dadce0] bg-white hover:bg-[#f8f9fa]"
                        }`}
                      >
                        {d.label[lang]}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-xl border border-[#dadce0] bg-white p-4">
                <label className="text-[14px] font-medium text-[#202124]">{c.replyLabel}</label>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder={c.replyHint}
                  className="mt-2 min-h-[96px] w-full resize-y rounded-lg border border-[#dadce0] bg-white px-3 py-2 text-[15px] leading-relaxed outline-none focus:border-[#8430ce]"
                />
                <div className="mt-2">
                  <NeedAStart lang={lang} starters={REPLY_STARTERS[lang]} onPick={(s) => setReply((b) => (b ? `${b} ` : "") + s)} />
                </div>
              </section>

              <button
                type="button"
                onClick={trySend}
                className="inline-flex min-h-[46px] items-center justify-center self-start rounded-full bg-[#8430ce] px-6 text-[15px] font-medium text-white cursor-pointer hover:brightness-95"
              >
                {c.send}
              </button>
            </>
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
