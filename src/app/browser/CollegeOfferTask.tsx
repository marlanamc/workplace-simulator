"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import { useTaskDraft } from "@/lib/use-task-draft";
import { CAST } from "@/lib/cast";
import {
  COLLEGE_OFFER_COPY,
  OFFER_LETTER,
  SCHEDULE_COPY,
  SECTIONS,
  RIGHT_SECTION,
  RENATA_REPLY,
  SHIFT_NAMES,
  EVENT_WEEKDAYS,
  EVENT_STARTS,
  EVENT_ENDS,
  EVENT_START_DAYS,
  EVENT_CORRECTIONS,
  HR_STARTERS,
  RENATA_STARTERS,
  HR_REPLY_CORRECTIONS,
  RENATA_CORRECTIONS,
  SHIFT_REQUEST_TO_HR,
  NO_RECIPIENT,
  GAP_CORRECTIONS,
  LESSONS,
  TERM_WEEK_MONDAY,
  classEventVerdict,
  describeSubmission,
  hrReplyVerdict,
  makesRequest,
  namesClassTime,
  offerGap,
  renataRequestVerdict,
  sectionByKey,
  sectionCorrection,
  sectionDays,
  sectionTime,
  shiftLabel,
  shiftsFor,
  stepIndexFor,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
  type OfferProgress,
} from "@/lib/tasks/college-offer/content";
import { WEEKDAY_SHORT, cardDate, storyDate, storyWeekday, storyYear } from "@/lib/story-dates";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskHub from "@/components/task/TaskHub";
import NeedAStart from "@/components/task/NeedAStart";
import { TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";
import { CalendarFrame, EventCard, WeekStrip, type CalEvent } from "@/components/task/CalendarFrame";
import { Calendar, GraduationCap, Mail } from "lucide-react";

type View = "hub" | "mail" | "offer" | "renata" | "compose" | "schedule" | "calendar" | "done";
type Recipient = "" | "renata" | "hr";

const INPUT = "w-full rounded border border-[#747775] bg-white px-3 py-2 text-[14px] outline-none focus:border-2 focus:border-[#0b57d0]";
const PRIMARY = "inline-flex min-h-[40px] items-center rounded-full bg-[#0b57d0] px-6 text-[14px] font-medium text-white cursor-pointer";

export default function CollegeOfferTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("college-offer") ? "done" : "hub");
  const [offerRead, setOfferRead] = useTaskDraft("college-offer", "offerRead", false);
  const [section, setSection] = useTaskDraft<string | null>("college-offer", "section", null);
  const [composeTo, setComposeTo] = useTaskDraft<string>("college-offer", "composeTo", "");
  const [composeSubject, setComposeSubject] = useTaskDraft("college-offer", "composeSubject", "");
  const [composeBody, setComposeBody] = useTaskDraft("college-offer", "composeBody", "");
  const [renataText, setRenataText] = useTaskDraft("college-offer", "renataText", "");
  const [hrText, setHrText] = useTaskDraft("college-offer", "hrText", "");
  const [evTitle, setEvTitle] = useTaskDraft("college-offer", "evTitle", "");
  const [evDay, setEvDay] = useTaskDraft("college-offer", "evDay", "");
  const [evStart, setEvStart] = useTaskDraft("college-offer", "evStart", "");
  const [evEnd, setEvEnd] = useTaskDraft("college-offer", "evEnd", "");
  const [evFirst, setEvFirst] = useTaskDraft("college-offer", "evFirst", "");
  const [evRepeats, setEvRepeats] = useTaskDraft("college-offer", "evRepeats", false);
  const [eventSaved, setEventSaved] = useTaskDraft("college-offer", "eventSaved", false);
  const [eventOpen, setEventOpen] = useState(false);
  const [chip, setChip] = useState<{ title: string; when: string } | null>(null);
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = COLLEGE_OFFER_COPY[lang];
  const letter = OFFER_LETTER[lang];
  const sc = SCHEDULE_COPY[lang];
  const to = composeTo as Recipient;

  const progress: OfferProgress = {
    offerRead,
    section,
    renataSent: renataText !== "",
    eventSaved,
    hrSent: hrText !== "",
  };

  /** The texts are passed in, because a send that finishes has not re-rendered yet. */
  const finish = (sent: { renata: string; reply: string } = { renata: renataText, reply: hrText }) => {
    setView("done");
    markComplete("college-offer", "choose_class_section_plan_week", describeSubmission(sent, lang));
  };

  /** Called after each success: the last of the four finishes the job. */
  const finishIfReady = (next: OfferProgress, otherwise: View, sent?: { renata: string; reply: string }) => {
    if (offerGap(next) === null) {
      finish(sent);
      return;
    }
    setView(otherwise);
  };

  const pressFinish = () => {
    const gap = offerGap(progress);
    if (gap) return say(GAP_CORRECTIONS[gap][lang]);
    finish();
  };

  const openOffer = () => {
    setOfferRead(true);
    setView("offer");
  };

  const pickSection = (key: string) => {
    const wrong = sectionCorrection(key);
    if (wrong) return say(wrong[lang]);
    setSection(key);
    setView("hub");
  };

  const startReply = () => {
    setComposeTo("hr");
    setComposeSubject(`Re: ${c.subject}`);
    setView("compose");
  };

  const startCompose = () => {
    setComposeTo("");
    setComposeSubject("");
    setView("compose");
  };

  const clearCompose = () => {
    setComposeBody("");
    setComposeSubject("");
    setComposeTo("");
  };

  const send = () => {
    if (!to) return say(NO_RECIPIENT[lang]);
    if (to === "hr") {
      const verdict = hrReplyVerdict(composeBody);
      if (verdict !== "ok") {
        // A shift question sent to HR: right words, wrong person.
        if (verdict === "no-answer" && makesRequest(composeBody) && namesClassTime(composeBody)) return say(SHIFT_REQUEST_TO_HR[lang]);
        return say(HR_REPLY_CORRECTIONS[verdict][lang]);
      }
      setHrText(composeBody);
      clearCompose();
      finishIfReady({ ...progress, hrSent: true }, "mail", { renata: renataText, reply: composeBody });
      return;
    }
    const verdict = renataRequestVerdict(composeBody);
    if (verdict !== "ok") return say(RENATA_CORRECTIONS[verdict][lang]);
    setRenataText(composeBody);
    clearCompose();
    finishIfReady({ ...progress, renataSent: true }, "mail", { renata: composeBody, reply: hrText });
  };

  const saveEvent = () => {
    const verdict = classEventVerdict({
      title: evTitle,
      weekday: evDay,
      start: evStart,
      end: evEnd,
      startsOn: evFirst,
      repeats: evRepeats,
    });
    if (verdict !== "ok") return say(EVENT_CORRECTIONS[verdict][lang]);
    setEventSaved(true);
    setEventOpen(false);
    finishIfReady({ ...progress, eventSaved: true }, "calendar");
  };

  const restart = () => {
    setView("hub");
    setOfferRead(false);
    setSection(null);
    clearCompose();
    setRenataText("");
    setHrText("");
    setEvTitle("");
    setEvDay("");
    setEvStart("");
    setEvEnd("");
    setEvFirst("");
    setEvRepeats(false);
    setEventSaved(false);
    setEventOpen(false);
  };

  // The week the calendar shows: the first week of the spring term.
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = TERM_WEEK_MONDAY + i;
    return { label: WEEKDAY_SHORT[lang][storyWeekday(day)], date: storyDate(day).getDate() };
  });
  const right = sectionByKey(RIGHT_SECTION)!;
  const calEvents: CalEvent[] = shiftsFor(renataText !== "").map((s) => {
    const title = SHIFT_NAMES[s.kind][lang];
    const time = shiftLabel(s.kind);
    return {
      key: `shift-${s.weekday}`,
      dayIndex: (s.weekday + 6) % 7,
      time,
      title,
      color: "#0b8043",
      onOpen: () => setChip({ title, when: `${WEEKDAY_SHORT[lang][s.weekday]} · ${time} · ${c.repeatsEvery}` }),
    };
  });
  if (eventSaved) {
    const title = evTitle.trim() || c.classChip;
    const time = sectionTime(right);
    calEvents.push({
      key: "class",
      dayIndex: (right.weekdays[0] + 6) % 7,
      time,
      title,
      color: "#1a73e8",
      onOpen: () => setChip({ title, when: `${sectionDays(right, lang)} · ${time} · ${c.repeatsEvery}` }),
    });
  }

  const apps: { key: View; label: string }[] = [
    { key: "hub", label: c.appHome },
    { key: "mail", label: c.appMail },
    { key: "schedule", label: c.appSchedule },
    { key: "calendar", label: c.appCalendar },
  ];
  const appOf = (v: View): View => (v === "offer" || v === "renata" || v === "compose" ? "mail" : v);

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-white text-[14px] text-[#202124]" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
      {view !== "done" && (
        <div className="flex flex-wrap items-center gap-1 border-b border-[#e0e0e0] px-3 py-2" data-card-avoid>
          {apps.map((a) => (
            <button
              key={a.key}
              onClick={() => setView(a.key)}
              className={`min-h-[36px] rounded-full px-4 text-[14px] cursor-pointer ${
                appOf(view) === a.key ? "bg-[#e8f0fe] font-medium text-[#0b57d0]" : "text-[#3c4043] hover:bg-[#f1f3f4]"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}

      {view !== "done" && (
        <RightNowBar
          icon={TASK_ICONS["college-offer"]}
          taskKey="college-offer"
          stepIndex={stepIndexFor(progress)}
          steps={RIGHT_NOW_STEPS}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onHelp={() => setHelp(true)}
        />
      )}

      {view === "hub" && (
        <div className="min-h-0 flex-1 overflow-auto">
          <TaskHub
            heading={c.hubHeading}
            items={[
              {
                key: "mail",
                color: "#ea4335",
                icon: Mail,
                title: c.mailTitle,
                body: c.mailBody,
                done: renataText !== "" && hrText !== "",
                cta: c.mailCta,
                onOpen: () => setView("mail"),
              },
              {
                key: "schedule",
                color: "#00897b",
                icon: GraduationCap,
                title: c.schedTitle,
                body: c.schedBody,
                done: section === RIGHT_SECTION,
                cta: c.schedCta,
                onOpen: () => setView("schedule"),
              },
              {
                key: "cal",
                color: "#34a853",
                icon: Calendar,
                title: c.calTitle,
                body: c.calBody,
                done: eventSaved,
                cta: c.calCta,
                onOpen: () => setView("calendar"),
              },
            ]}
          />
          <div className="mx-auto max-w-[640px] px-6 pb-6">
            <button
              onClick={pressFinish}
              data-card-avoid
              className="inline-flex min-h-[44px] items-center rounded-full bg-accent px-5 text-[15px] font-medium text-white cursor-pointer"
            >
              {c.finishCta}
            </button>
          </div>
        </div>
      )}

      {view === "mail" && (
        <div className="min-h-0 flex-1 overflow-auto px-4 py-4 sm:px-6">
          <div className="mb-3 flex items-center gap-3">
            <button onClick={startCompose} data-card-avoid className="inline-flex min-h-[44px] items-center rounded-2xl bg-[#c2e7ff] px-5 text-[14px] font-medium text-[#001d35] cursor-pointer">
              {c.compose}
            </button>
            <span className="text-[14px] font-medium text-[#5f6368]">{c.inbox}</span>
          </div>
          <ul className="flex flex-col divide-y divide-[#f1f3f4] rounded-xl border border-[#e0e3e8]">
            {renataText !== "" && (
              <li>
                <button onClick={() => setView("renata")} className="flex w-full items-baseline gap-3 px-4 py-3 text-left hover:bg-[#f2f6fc] cursor-pointer">
                  <span className="w-32 shrink-0 truncate font-medium">{CAST.renata.name}</span>
                  <span className="min-w-0 flex-1 truncate">{RENATA_REPLY[lang].subject}</span>
                </button>
              </li>
            )}
            <li>
              <button onClick={openOffer} data-card-avoid className="flex w-full items-baseline gap-3 px-4 py-3 text-left hover:bg-[#f2f6fc] cursor-pointer">
                <span className={`w-32 shrink-0 truncate ${offerRead ? "" : "font-bold"}`}>{c.from}</span>
                <span className={`min-w-0 flex-1 truncate ${offerRead ? "" : "font-bold"}`}>{c.subject}</span>
                <span className="shrink-0 text-[12px] text-[#5f6368]">9:04 AM</span>
              </button>
            </li>
          </ul>
          {(renataText !== "" || hrText !== "") && (
            <div className="mt-5">
              <div className="mb-2 text-[13px] font-medium text-[#5f6368]">{c.sentLabel}</div>
              <ul className="flex flex-col gap-2">
                {renataText !== "" && (
                  <li className="rounded-xl border border-[#e0e3e8] px-4 py-3">
                    <div className="text-[12px] text-[#5f6368]">{c.to}: {CAST.renata.name}</div>
                    <p className="m-0 mt-1 whitespace-pre-wrap">{renataText}</p>
                  </li>
                )}
                {hrText !== "" && (
                  <li className="rounded-xl border border-[#e0e3e8] px-4 py-3">
                    <div className="text-[12px] text-[#5f6368]">{c.to}: {CAST.hr.name}</div>
                    <p className="m-0 mt-1 whitespace-pre-wrap">{hrText}</p>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {view === "offer" && (
        <div className="min-h-0 flex-1 overflow-auto px-6 py-4 sm:px-8">
          <h2 className="mb-5 text-[22px] font-normal leading-tight text-[#1f1f1f]">{c.subject}</h2>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#9334e6] text-[14px] font-medium text-white">
              HR
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-[14px] font-medium">{c.from}</span>
                <span className="text-[12px] text-[#5f6368]">9:04 AM</span>
              </div>
              <div className="text-[12px] text-[#5f6368]">{c.toMe}</div>
              <div className="mt-4 flex max-w-[62ch] flex-col gap-3 text-[14px] leading-[1.6] text-[#1f1f1f]">
                <p className="m-0">{letter.intro}</p>
                <div>
                  <p className="m-0 font-medium">{letter.rulesHeading}</p>
                  <ul className="m-0 mt-1 list-disc pl-5">
                    {letter.rules.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
                <p className="m-0">{letter.linkBody}</p>
                <button
                  onClick={() => setView("schedule")}
                  data-card-avoid
                  className="self-start text-left text-[14px] font-medium text-[#0b57d0] underline underline-offset-2 cursor-pointer"
                >
                  {letter.link}
                </button>
                <p className="m-0">{letter.signoff}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 pl-[52px]">
            <button
              onClick={startReply}
              data-card-avoid
              className="inline-flex min-h-[40px] items-center rounded-full border border-[#747775] px-5 text-[14px] font-medium text-[#0b57d0] hover:bg-[#f2f6fc] cursor-pointer"
            >
              {c.reply}
            </button>
            <button onClick={() => setView("mail")} className="min-h-[40px] px-3 text-[13px] text-[#5f6368] cursor-pointer">
              {c.back}
            </button>
          </div>
        </div>
      )}

      {view === "renata" && (
        <div className="min-h-0 flex-1 overflow-auto px-6 py-4 sm:px-8">
          <h2 className="mb-5 text-[22px] font-normal leading-tight text-[#1f1f1f]">{RENATA_REPLY[lang].subject}</h2>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[14px] font-medium text-white" style={{ background: CAST.renata.color }}>
              {CAST.renata.initials}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[14px] font-medium">{CAST.renata.name}</span>
              <div className="text-[12px] text-[#5f6368]">{c.toMe}</div>
              <div className="mt-4 flex max-w-[62ch] flex-col gap-3 text-[14px] leading-[1.6]">
                {RENATA_REPLY[lang].body.map((p) => (
                  <p key={p} className="m-0">{p}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 pl-[52px]">
            <button onClick={() => setView("mail")} className="min-h-[40px] px-3 text-[13px] text-[#5f6368] cursor-pointer">
              {c.back}
            </button>
          </div>
        </div>
      )}

      {view === "compose" && (
        <div className="min-h-0 flex-1 overflow-auto px-4 py-4 sm:px-8">
          <div className="mx-auto max-w-[560px] overflow-hidden rounded-2xl border border-[#e0e3e8] shadow-[0_1px_3px_rgba(60,64,67,.15)]">
            <label className="flex items-center gap-2 border-b border-[#e0e3e8] px-4 py-2 text-[13px]">
              <span className="w-16 shrink-0 text-[#5f6368]">{c.to}</span>
              <select
                value={to}
                onChange={(e) => setComposeTo(e.target.value)}
                className="min-h-[32px] flex-1 bg-transparent text-[14px] outline-none"
              >
                <option value="">{c.chooseTo}</option>
                <option value="renata">{CAST.renata.name}{CAST.renata.title ? ` (${CAST.renata.title[lang]})` : ""}</option>
                <option value="hr">{CAST.hr.name}{CAST.hr.title ? ` (${CAST.hr.title[lang]})` : ""}</option>
              </select>
            </label>
            <label className="flex items-center gap-2 border-b border-[#e0e3e8] px-4 py-2 text-[13px]">
              <span className="w-16 shrink-0 text-[#5f6368]">{c.subjectLabel}</span>
              <input
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                placeholder={c.subjectPh}
                className="min-h-[32px] flex-1 bg-transparent text-[14px] outline-none"
              />
            </label>
            <textarea
              aria-label={c.writeHere}
              value={composeBody}
              onChange={(e) => setComposeBody(e.target.value)}
              placeholder={c.writeHere}
              className="min-h-[140px] w-full resize-y border-none px-4 py-3 text-[14px] leading-relaxed outline-none placeholder:text-[#767676]"
            />
            {to && (
              <div className="px-4 pb-2">
                <NeedAStart
                  lang={lang}
                  starters={(to === "hr" ? HR_STARTERS : RENATA_STARTERS)[lang]}
                  onPick={(s) => setComposeBody((b) => (b ? `${b} ` : "") + s)}
                />
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2 px-3 py-2">
              <button onClick={send} data-card-avoid className={PRIMARY}>
                {c.send}
              </button>
              <div className="flex-1" />
              <button
                onClick={() => { clearCompose(); setView("mail"); }}
                className="min-h-[36px] rounded-full px-3 text-[13px] text-[#5f6368] hover:bg-[#f2f6fc] cursor-pointer"
              >
                {c.discard}
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "schedule" && (
        <div className="min-h-0 flex-1 overflow-auto bg-[#f7f9f9]">
          <div className="bg-[#00695c] px-5 py-3 text-white">
            <div className="text-[13px] opacity-90">{sc.college}</div>
            <div className="text-[18px] font-medium">{sc.title}</div>
          </div>
          <div className="mx-auto max-w-[860px] px-4 py-4">
            <h2 className="m-0 text-[17px] font-medium">{sc.course}</h2>
            <ul className="m-0 mt-2 list-none p-0 text-[13px] leading-relaxed text-[#3c4043]">
              {sc.facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <div className="mt-4 overflow-x-auto rounded-lg border border-[#dadce0] bg-white">
              <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
                <thead className="bg-[#e0f2f1] text-[#004d40]">
                  <tr>
                    <th className="p-2">{sc.cols.section}</th>
                    <th className="p-2">{sc.cols.crn}</th>
                    <th className="p-2">{sc.cols.days}</th>
                    <th className="p-2">{sc.cols.time}</th>
                    <th className="p-2">{sc.cols.mode}</th>
                    <th className="p-2">{sc.cols.where}</th>
                    <th className="p-2">{sc.cols.seats}</th>
                    <th className="p-2"><span className="sr-only">{sc.pick}</span></th>
                  </tr>
                </thead>
                <tbody>
                  {SECTIONS.map((s) => (
                    <tr key={s.key} className="border-t border-[#dadce0]">
                      <th scope="row" className="p-2 font-medium">{s.key}</th>
                      <td className="p-2">{s.crn}</td>
                      <td className="p-2">{sectionDays(s, lang)}</td>
                      <td className="p-2 whitespace-nowrap">{sectionTime(s)}</td>
                      <td className="p-2">{s.mode[lang]}</td>
                      <td className="p-2">{s.where[lang]}</td>
                      <td className="p-2">
                        {sc.seatsOf(s.seatsOpen, s.capacity)}
                        {s.seatsOpen === 0 && (
                          <span className="block text-[12px] text-[#b3261e]">
                            {sc.full} · {sc.waitlist(s.waitlist)}
                          </span>
                        )}
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => pickSection(s.key)}
                          data-card-avoid
                          className={`min-h-[36px] rounded-full border px-4 text-[13px] font-medium cursor-pointer ${
                            section === s.key ? "border-[#00695c] bg-[#00695c] text-white" : "border-[#00695c] text-[#00695c] hover:bg-[#e0f2f1]"
                          }`}
                        >
                          {section === s.key ? sc.picked : sc.pick}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {view === "calendar" && (
        <div className="relative min-h-0 flex-1 overflow-auto">
          <CalendarFrame appName={c.appCalendar}>
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 pb-2">
              <div>
                <div className="text-[16px] font-medium text-[#3c4043]">{c.weekHeading}</div>
                <div className="text-[13px] text-[#5f6368]">{c.weekNote}</div>
              </div>
              {!eventSaved && (
                <button onClick={() => setEventOpen(true)} data-card-avoid className={PRIMARY}>
                  {c.addEvent}
                </button>
              )}
            </div>
            <WeekStrip days={weekDays} events={calEvents} />
            {eventOpen && !eventSaved && (
              <div className="mx-3 mb-4 max-w-[480px] rounded-2xl border border-[#dadce0] bg-white p-5 shadow-sm">
                <h3 className="m-0 mb-3 text-[16px] font-medium">{c.eventHeading}</h3>
                <label className="mb-3 block">
                  <span className="mb-1 block text-[12px] text-[#5f6368]">{c.eventTitleLabel}</span>
                  <input value={evTitle} onChange={(e) => setEvTitle(e.target.value)} placeholder={c.eventTitlePh} className={INPUT} />
                </label>
                <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <label className="block">
                    <span className="mb-1 block text-[12px] text-[#5f6368]">{c.dayLabel}</span>
                    <select value={evDay} onChange={(e) => setEvDay(e.target.value)} className={INPUT}>
                      <option value="">{c.choose}</option>
                      {EVENT_WEEKDAYS.map((d) => (
                        <option key={d} value={String(d)}>{WEEKDAY_SHORT[lang][d]}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[12px] text-[#5f6368]">{c.startLabel}</span>
                    <select value={evStart} onChange={(e) => setEvStart(e.target.value)} className={INPUT}>
                      <option value="">{c.choose}</option>
                      {EVENT_STARTS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[12px] text-[#5f6368]">{c.endLabel}</span>
                    <select value={evEnd} onChange={(e) => setEvEnd(e.target.value)} className={INPUT}>
                      <option value="">{c.choose}</option>
                      {EVENT_ENDS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="mb-3 block">
                  <span className="mb-1 block text-[12px] text-[#5f6368]">{c.firstDayLabel}</span>
                  <select value={evFirst} onChange={(e) => setEvFirst(e.target.value)} className={INPUT}>
                    <option value="">{c.choose}</option>
                    {EVENT_START_DAYS.map((d) => (
                      <option key={d} value={String(d)}>{`${cardDate(d, lang)}, ${storyYear(d)}`}</option>
                    ))}
                  </select>
                </label>
                <label className="mb-4 flex min-h-[40px] items-center gap-2 text-[14px] cursor-pointer">
                  <input type="checkbox" checked={evRepeats} onChange={(e) => setEvRepeats(e.target.checked)} className="h-4 w-4" />
                  {c.repeatsLabel}
                </label>
                <div className="flex gap-2">
                  <button onClick={saveEvent} data-card-avoid className={PRIMARY}>
                    {c.saveEvent}
                  </button>
                  <button onClick={() => setEventOpen(false)} className="min-h-[40px] px-3 text-[13px] text-[#5f6368] cursor-pointer">
                    {c.cancel}
                  </button>
                </div>
              </div>
            )}
          </CalendarFrame>
          {chip && <EventCard title={chip.title} when={chip.when} onClose={() => setChip(null)} closeLabel={c.close} />}
        </div>
      )}

      {view === "done" && (
        <div className="min-h-0 flex-1 overflow-y-auto bg-surface-muted p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard
              kicker={c.sentKicker}
              title={c.doneTitle}
              body={c.doneBody}
              badgeNumber="16"
              badgeName={c.badgeName}
              badgeWhere={c.badgeWhere}
            />
            <TaskDoneActions kicker={c.sentKicker} tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
          </div>
        </div>
      )}

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
