# Story-day audit — game sitting vs cafe calendar

Written 2026-09-06 after the Day 3 mail/clock work. This is a content map, not a learner-facing doc.

The cafe is frozen in **August 2026** (the 1st is a Saturday). Hire day is **Tuesday, August 18**. Shifts before that do not exist.

## Three different “days”

The UI uses three clocks. They only line up in Act I.

| Clock | What it counts | Where you see it |
| --- | --- | --- |
| **Job Card** | Position in this job (`dayInAct`). Resets each act. Orientation is not a day. | “Day 3 of 6” |
| **Studio / shelf title** | Index in `LEVELS` (`dayTitle`). Keeps climbing across acts. | “Day 3: Clock-In Fix”, later “Day 7: When Something Happens” |
| **Cafe calendar** | August (then September) 2026 weekday + date. Only Act I sittings have a real date in `TODAY_BY_LEVEL`. Everything after First Paycheck falls back to **Fri Aug 21** for Calendar, while inbox dating uses the latest date already reached (**Aug 28**) so mail does not rewind. | Mail stamps, Calendar “today”, pay stub period |

So “Day 3” on the Job Card is Friday Aug 21. “Day 3” in Studio is the same sitting. After Act I those two numbers split.

## Act I — New Hire (the only fully dated stretch)

Same fictional Friday is used for two Job Card days (clock-in in the morning, Darnell at 6:20 PM). Thursday Aug 20 has no sitting. The first stub is “two weeks in” (Aug 18–28), which matches.

| Job Card | Studio title | Sitting | Tasks | Shift moment | Cafe date | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| — | How this works | level0 | tour | Before the shift | Tue Aug 18 | Not a workday. Same hire morning as Day 1. |
| Day 1 of 6 | Day 1: Day One | level1 | mail-reply, mail-attach | Tue 8:14 / 8:20 AM | **Tue Aug 18** | Two Maria emails, same day. |
| Day 2 of 6 | Day 2: The First Week | level2 | schedule | Wednesday morning | **Wed Aug 19** | Looking at *next* week (Aug 24–30). |
| — | — | *(no sitting)* | — | — | Thu Aug 20 | Gap. |
| Day 3 of 6 | Day 3: Clock-In Fix | level3 | timeclock, shift-review | Fri 8:15 AM, then 6 PM | **Fri Aug 21** | Arrival copy says “payday for the crew.” Learner’s own stub is not until Day 6. |
| Day 4 of 6 | Day 4: One More Thing | level3a | mail-etiquette | Fri 6:20 PM | **Fri Aug 21** | Same cafe day as Day 3, later that evening. |
| Day 5 of 6 | Day 5: The Sick Call | level3a2 | call-out-sick | Monday 6:12 AM | **Mon Aug 24** | Weekend skipped. |
| Day 6 of 6 | Day 6: First Paycheck | level3a3 | paystub | Friday 5:40 PM | **Fri Aug 28** | Stub period Aug 18–28. |

### August 2026 week view (Act I)

```
         Sun    Mon    Tue    Wed    Thu    Fri    Sat
Aug 16         17     18     19     20     21     22
               —     D1     D2     —     D3+D4   —
Aug 23         24     25     26     27     28     29
              D5      —    huddle*  —     D6     —
```

\*Weekly Lead Huddle is Aug 26 on Calendar. A new hire never sees it. The Calendar *task* (Act II) still treats that Friday-the-21st week as “today,” which is why later sittings fall back to the 21st.

## Later acts — weekday is written, date is not

`shiftMoment` names a weekday. `storyToday` is **21** (Fri Aug 21) unless we add a row to `TODAY_BY_LEVEL`. Inbox stamps after Day 6 stay on or after Aug 28 so they do not jump backward.

If we ever pin these to real dates, time should keep moving forward from **Fri Aug 28**. A clean sketch (not in code): promotion week starting Mon Aug 31 / Tue Sep 1, then one sitting per weekday as the copy already implies.

### Act II — Shift Lead (Job Card Day 1–7 of 7 · Studio Days 7–13)

| Job Card | Studio | Sitting | Tasks | Shift moment | Coded cafe date | If we continued the calendar |
| --- | --- | --- | --- | --- | --- | --- |
| Day 1 of 7 | Day 7 | When Something Happens | incident, handbook | Tuesday / Tuesday night | fallback Aug 21 | Tue Sep 1 |
| Day 2 of 7 | Day 8 | Locked Out | account-recovery | Wednesday morning | fallback Aug 21 | Wed Sep 2 |
| Day 3 of 7 | Day 9 | The Calendar | calendar | “Next week. You are a lead now.” | **forced Fri Aug 21** (huddle Wed Aug 26) | Keep this week frozen, or rebuild the huddle on a later Wednesday |
| Day 4 of 7 | Day 10 | Shared Files | files, mail-send-link | Monday / Mon 10:15 AM | fallback Aug 21 | Mon Sep 7 (Jordan starts) |
| Day 5 of 7 | Day 11 | The Numbers | spreadsheet | Friday afternoon | fallback Aug 21 | Fri Sep 11 |
| Day 6 of 7 | Day 12 | Reporting In | make-a-copy, status-report | Monday / Mon 11 AM | fallback Aug 21 | Mon Sep 14 |
| Day 7 of 7 | Day 13 | Covering More Ground | triage | Tuesday 9:04 AM | fallback Aug 21 | Tue Sep 15 |

### Act III — Shift Supervisor (Job Card Day 1–4 of 4 · Studio Days 14–17)

| Job Card | Studio | Sitting | Tasks | Shift moment | If we continued |
| --- | --- | --- | --- | --- | --- |
| Day 1 of 4 | Day 14 | Scheduling the Team | team-schedule | Monday | Mon Sep 21 |
| Day 2 of 4 | Day 15 | Weekly Numbers | formula-check | Friday | Fri Sep 25 |
| Day 3 of 4 | Day 16 | First Team Meeting | team-meeting | Tuesday | Tue Sep 29 |
| Day 4 of 4 | Day 17 | Under Pressure | priority-call | Thursday 3:40 PM | Thu Oct 1 |

### Act IV — Assistant Manager (Job Card Day 1–3 of 3 · Studio Days 18–20)

| Job Card | Studio | Sitting | Tasks | Shift moment | If we continued |
| --- | --- | --- | --- | --- | --- |
| Day 1 of 3 | Day 18 | An Offer | college-offer | Monday (class starts Sep 15) | A Monday after Sep 15, or move the class start |
| Day 2 of 3 | Day 19 | The Budget | budget-sheet | Wednesday (sheet is “week of Sep 1”) | Wed the same week |
| Day 3 of 3 | Day 20 | Reply-All | reply-all | Friday | Fri the same week |

College-offer copy already names **September 15**. Budget sheet names **week of Sep 1**. Those two artifacts are ahead of Act I’s August, and they fight each other if Act IV is still “one week.”

### Act V — Bridge (one sitting per door · Studio Days 21–24)

Both doors share the same weekday spine. Job Card is Day 1–4 of 4 on the chosen path.

| Job Card | Studio | Sitting | Path A | Path B | Shift moment |
| --- | --- | --- | --- | --- | --- |
| Day 1 of 4 | Day 21 | Getting Ready | enrollment | appointment-scheduling | Monday |
| Day 2 of 4 | Day 22 | The Paperwork | financial-aid | patient-intake | Wednesday |
| Day 3 of 4 | Day 23 | Staying On Top of It | coursework | billing-sheet | Thursday |
| Day 4 of 4 | Day 24 | Finding a Real Answer | research | confidentiality-call | Friday |

### Act VI — Office Administrator

Hiring sittings are marked `preHire` (“not a day on the job”). Studio still numbers them as Days 25–29. Job Card still counts them in the act unless we filter `preHire` out of `workdaysInAct` — the comment in `shift-spine.ts` says we should; the filter does not.

| Kind | Studio | Sitting | Tasks | Shift moment |
| --- | --- | --- | --- | --- |
| Applicant | Day 25 | Applying | job-posting, job-application | Before HQ |
| Applicant | Day 26 | Your Résumé | resume-build | Before HQ |
| Applicant | Day 27 | The Interview | interview-practice | Before HQ |
| Applicant | Day 28 | The Offer | job-offer | Before HQ (start date **October 6**) |
| Applicant | Day 29 | New-Hire Paperwork | w4-form, i9-section1, direct-deposit | Before HQ |
| On the job | Day 30 | Welcome to HQ | office-drive | Monday at HQ |
| On the job | Day 31 | Get Everyone in the Room | multi-person-scheduling, video-call | Wednesday |
| On the job | Day 32 | The Expense Report | expense-report | Thursday (sheet is “September expenses”) |
| On the job | Day 33 | Presenting to the Team | slide-deck | Friday |

### Act VII — Team Lead (Studio Days 34–37)

| Job Card | Studio | Sitting | Tasks | Shift moment |
| --- | --- | --- | --- | --- |
| Day 1 of 4 | Day 34 | Run the Meeting | meeting-minutes | Monday |
| Day 2 of 4 | Day 35 | The Review | performance-review | Tuesday |
| Day 3 of 4 | Day 36 | Put It All Together | ops-report-packet | Thursday |
| Day 4 of 4 | Day 37 | Where You've Been | portfolio-reflection | Friday (“last day of the program”) |

## Things worth deciding

1. **Two Job Card days on one cafe Friday (Act I Days 3–4).** Intentional: morning punch, then “one more thing before you go.” Keep it, but do not date Darnell’s mail as a new day.
2. **Thursday Aug 20 is empty.** Fine if Days are sittings, not calendar days. Confusing if a learner maps “Day 3” to “my third shift” (they would have worked Tue, Wed, then jumped to Friday).
3. **Crew payday (Day 3) vs first stub (Day 6).** Arrival text on Day 3 says the *crew* is paid today. The learner’s stub is Aug 28. That can stay if we keep saying “the crew.”
4. **Calendar sitting rewinds to Aug 21.** After First Paycheck (Aug 28), opening Calendar treats today as Friday the 21st so the Aug 26 huddle puzzle still works. Mail no longer rewinds. Desktop clock no longer shows a date, so the clash is only inside Calendar.
5. **Later acts have weekdays, not dates.** Inbox mail from Act II+ all inherit `storyToday` = 21, so they look like they were sent on the first Friday. If Maria/Renata mail should keep aging, each sitting needs a `TODAY_BY_LEVEL` date that never goes backward.
6. **September artifacts arrive too early.** College class **Sep 15**, budget “week of **Sep 1**,” expenses “**September**,” offer start **Oct 6**. Act I is still August. Either the later acts are weeks later (good) or those props need to move.
7. **Job Card vs Studio numbering.** After Act I, Studio “Day 7” is Job Card “Day 1 of 7.” Neither is the cafe date. Worth keeping Studio as sitting number and Job Card as “day in this job,” and never showing a live wall-clock date (already removed).
8. **`preHire` vs day count.** Comments say hiring is not a workday. `workdaysInAct` still includes those sittings, so Act VI’s “Day N of M” may count Applying as Day 1.

## Suggested rule if we date the rest

- One cafe date per sitting, except when two sittings are explicitly the same day (Days 3–4).
- Dates only move forward from the last pinned day (Aug 28 after Act I).
- Calendar may keep its own frozen week for the huddle puzzle; do not let that week become inbox “today.”
- Props that name a month (Sep 1, Sep 15, October 6) must sit on or after that cafe date.

Act I is the only stretch a learner can currently audit by opening Mail. That stretch is now: Tue / Wed / Fri (twice) / Mon / Fri.