# Implementation update — September 2026

The evaluation below is a **historical baseline**, not a description of current behavior. The accepted first-release changes have now been implemented in this working tree. Read the current [scope and sequence](../curriculum/00-scope-and-sequence.md) and [pilot protocol](../curriculum/launch-pilot.md) before using the older ratings or action list.

The main gaps addressed are route selection and switching after the core, direct-entry references and truthful simulated work history, saved writing and retry recovery, portfolio restoration and localized summaries, video-call mute recovery, and the weak enrollment, coursework, appointment, hiring, slide, meeting, report, and paperwork steps. Multi-person scheduling already had a comparison grid; it was retained and its busy labels made readable. An apology alone no longer passes the intake refusal check, although free-text checks still cannot prove confidentiality judgment.

The per-level review below covers all 37 runtime levels (some table rows split their tasks or paths). Its predictions about boredom are hypotheses for observation, not measured dropout forecasts. Automated checks establish behavior, not learning transfer. The opening walkthrough and each route still need representative learner pilots in both languages. Do not interpret “implemented” as launch approval.

---

# Full curriculum review — every level, Acts I–VII

Updated 2026-09-05. Scope: all 7 acts, all 37 levels currently in `src/lib/tracks-content.ts` (`ACTS`, `LEVELS`) — `level0` through `level27`, plus lettered levels `level3a`, `level3a2`, `level3b`, `level3c` and the `level19h1`–`level19h5` hiring sub-arc. Source of truth for level/task structure: `src/lib/tracks-content.ts` and `src/lib/tasks/registry.ts`. Source of truth for teacher-review coverage: `src/lib/curriculum-catalog.ts` (`TEACHER_CHECK_TASKS`).

This supersedes `scratchpad/act-1-review.md` as the live review document. `act-1-review.md` and `scratchpad/codex_revisions.md` (the implementation log for today's Act I changes) are kept as historical records — `codex_revisions.md` is not duplicated here, only referenced where it resolved something this review used to flag.

---


## Evidence and limits of this review

This is a source review, not a learner usability study or a certification of mastery. The runtime contains **37 levels and 51 active tasks (54 task keys including retired `mail`, `mail-read`, and `swap-request`)**; the table's `#` column numbers tasks, including both elective paths, rather than levels. One selected Act V path contains four of its eight tasks. Challenge scores are editorial estimates, not measured learner difficulty.

“Fixed today” below refers to changes described in the 2026-09-05 review and visible in the checked-out source. Historical claims about test runs and human playtesting come from the earlier review/log; they are not new verification results from this documentation pass. Teacher-review **eligibility**, a saved submission, and an actual teacher assessment are separate things. Automatic completion does not wait for teacher approval (`progress-context.tsx`).

Source checks corrected the level count, stale unresolved-fix claims, exact numeric validation, teacher-review coverage, portfolio persistence, and several overstatements about what clicks or regexes prove. Remaining proposals are recommendations, not changes implemented by this review.

## At a glance — every level

**Challenge** is how hard the level is for a learner (1 = easiest, 5 = hardest — capstones and emotionally-loaded writing sit at 5). **Student-ready** is whether the mechanic actually tests what its own lesson/copy claims:
✅ Ready for playtesting — core mechanic matches the task; this is not proof of mastery · ⚠️ Ready with a caveat — works, but has an open question or minor gap worth a playtest look · 🔧 Needs work — a real, source-confirmed gap between what it claims to check and what it actually checks.

| # | Level | Act | Task(s) | Challenge | Student-ready | Why |
|---|---|---|---|:---:|:---:|---|
| 1 | L0 | I | tour | 2 | ⚠️ | Heavily revised today (welcome screen, required drag, clearer Help); automated-verified only — your playthrough is the last step. |
| 2–3 | L1 | I | mail-reply, mail-attach | 1 | ✅ | Lowest stakes by design; copy-dedupe fixed today. |
| 4 | L2 | I | schedule | 3 | ✅ | Stuck-learner hint escalation (asked for in the old review) shipped and tested today. |
| 5–7 | L3 | I | timeclock, paystub, shift-review | 4 | ⚠️ | Day-3 opening restructured today (now starts mid-shift, forgotten clock-in); automated-verified only. |
| 8 | L3a | I | mail-etiquette | 2 | ✅ | Fixed today — now requires naming the storage room, and is in the teacher-review set. |
| 9 | L3a2 | I | call-out-sick | 2 | ✅ | Fixed today — now requires stating inability to attend today's shift, and is teacher-reviewed. |
| 10–11 | L3b | II | incident, handbook | 3 | ✅ | Fixed today — narrative now requires an injury-status fact and an action/notification; teacher-reviewed. |
| 12 | L3c | II | account-recovery | 2 | ✅ | Solid; fixed verification code risks rote memorization over transfer — watch in playtest. |
| 13 | L4 | II | calendar | 2 | ✅ | Good bridge task; reuses the "check before agreeing" skill (see cross-cutting note). |
| 14–15 | L5 | II | files, mail-send-link | 3 | ✅ | Best-designed task in Acts I–II — three real sub-skills, forgiving-but-real grading. |
| 16 | L6 | II | spreadsheet | 2 | ✅ | Fixed today — sending now requires the message to state the correct total. |
| 17–18 | L7 | II | make-a-copy, status-report | 3 | ✅ | `status-report` has real formula/Cc/content checks. |
| 19 | L8 | II | triage | 4 | ✅ | Strong capstone — genuine order-independent synthesis of L4 + L5. |
| 20 | L9 | III | team-schedule | 3 | ✅ | Model implementation — AND-based email content check others should copy. |
| 21 | L10 | III | formula-check | 4 | ⚠️ | Best-built spreadsheet task; one small gap (OR instead of AND on the reported fix). |
| 22 | L11 | III | team-meeting | 3 | ✅ | First author-an-invite task; explicitly names its skill reuse. |
| 23 | L12 | III | priority-call | 5 | ✅ | Best capstone reviewed — real overpromise-aware reply grading, order-independent. |
| 24 | L13 | IV | college-offer | 4 | ✅ | Rigorously multi-gated; only a harmless dead-code cleanup found. |
| 25 | L14 | IV | budget-sheet | 3 | ⚠️ | Deliberate read-only formula-literacy task; minor UX wrinkle (answer cell pre-selected). |
| 26 | L15 | IV | reply-all | 4 | ✅ | Most tightly validated free-text task in the game — a template for others. |
| 27 | L16 (Path A) | V | enrollment | 2 | ✅ | Solid; document-ready click is unconditional but harmless. |
| 28 | L17 (Path A) | V | financial-aid | 3 | ✅ | Best-built task in this path — real PDF-vs-summary discipline. |
| 29 | L18 (Path A) | V | coursework | 3 | ✅ | Good pairing of academic + workplace skill; due-date checkbox gives away the date it's meant to teach finding. |
| 30 | L19 (Path A) | V | research | 4 | ✅ | Clean, realistic source-credibility task. |
| 31 | L16 (Path B) | V | appointment-scheduling | 2 | ⚠️ | Fixed today — slots no longer show status until clicked; the booked-slot inspection is still optional. |
| 32 | L17 (Path B) | V | patient-intake | 4 | ⚠️ | Best-built judgment task in either path — keyword-based confidentiality check with bypass risks. |
| 33 | L18 (Path B) | V | billing-sheet | 3 | ✅ | Fixed today — the mismatch no longer highlights until the learner selects that row. |
| 34 | L19 (Path B) | V | confidentiality-call | 4 | ✅ | Fixed today — now a free-text compose step wired to the existing `replyIsSafe()` validator. |
| 35–36 | L19h1 | VI | job-posting, job-application | 2 | ✅ | Honest "you don't need every box" lesson; pre-filled history is genuinely accurate. |
| 37 | L19h2 | VI | resume-build | 3 | ✅ | Real word-count-and-structure checks; live preview is a nice touch. |
| 38 | L19h3 | VI | interview-practice | 3 | ⚠️ | Word-count-only grading — the main remaining instance of the open grading question L3a/L3a2 used to share, now honestly scoped in source comments. |
| 39 | L19h4 | VI | job-offer | 2 | ⚠️ | Clean "find the fact in the letter" pattern, consistent with paystub/financial-aid. |
| 40–42 | L19h5 | VI | w4-form, i9-section1, direct-deposit | 3 | ⚠️ | `direct-deposit`'s routing-number check is rigorous; I-9's DOB/address fields only check non-emptiness. |
| 43 | L20 | VI | office-drive | 3 | ✅ | Files-task pattern correctly leveled up for a much bigger drive. |
| 44–45 | L21 | VI | multi-person-scheduling, video-call | 4 | ✅ | `video-call`'s stuck-unmute dead end fixed today; scheduling's one open slot could use a tighter near-miss. |
| 46 | L22 | VI | expense-report | 3 | ✅ | Tightly scoped, fully gated multi-step task. |
| 47 | L23 | VI | slide-deck | 3 | ✅ | Structurally enforces its own "only 3 slides" rule; minor cross-file number-sync risk. |
| 48 | L24 | VII | meeting-minutes | 5 | ⚠️ | Real owners-and-dates content check; notes can be saved without ever engaging the huddle script. |
| 49 | L25 | VII | performance-review | 5 | ✅ | Best-reasoned tone-grading tradeoff in the game; area-to-grow field is checked less strictly than its sibling. |
| 50 | L26 | VII | ops-report-packet | 4 | ⚠️ | Deliberate no-new-skills capstone; summary check accepts any digit, not the actual total. |
| 51 | L27 | VII | portfolio-reflection | 1 | ⚠️ | Fixed today — added a real "Copy summary to share" button, but answers are lost from the learner view after reload. |

---

## Candid learning-value and disengagement review

**I would not call all 37 levels equally worth a learner's time in their current form.** The strongest tasks make learners find something, compare it, make a consequential choice, and communicate the result. The weakest substitute acknowledgment clicks or minimum-length writing for that decision. A different app skin and another completion award do not, by themselves, add a skill.

The earlier “No change” and “best-built” judgments below describe local implementation strengths; they should not override the priorities here. These are source-based design judgments, not observed dropout predictions. A beginner may benefit from repetition that an experienced learner finds tedious. The aim is to remove empty repetition while preserving practice and accessible Help.

| Priority | Level / task | Honest verdict and disengagement risk | Improvement I would make |
|---|---|---|---|
| High | L23 · slide-deck | **Too thin for a late-program presentation level.** A title, prefilled number checkbox, three-word takeaway, and Present click offer little evidence of presentation skill. The component marks completion at that click; it does not assess an explanation to an audience. | Keep three slides, but have the learner select the relevant figure from the expense report, explain what it means, and answer one coworker question. If that scope is unavailable, call it a short introduction to slides and shorten it. |
| High | L26 · ops-report-packet | **Does not yet earn its “put it all together” claim.** The multi-app wrapper is useful, but any digit in a twelve-word summary can clear its central synthesis check. Late in the program this risks feeling like four more completion buttons. | Require the actual sheet total and the calendar commitment in one useful summary. Let learners navigate freely, keep sources available, and use teacher review for whether the two facts support the proposed next action. |
| High | L16 Path A · enrollment | **Limited new skill as a full level.** Marking a missing document ready without finding or attaching it is largely a checklist acknowledgment, followed by another short writing box. | Supply a small simulated file set and require choosing the missing document, or combine this with L17 as a concise application-and-award sequence. Avoid an extra “Are you sure?” click; that adds friction without learning. |
| High | L18 Path A · coursework | **The deadline task gives away its answer.** The complaint response has value, but the date checkbox adds little and another lightly checked reply may feel repetitive. | Ask the learner to find the deadline in the syllabus and select it in a submission plan; keep the syllabus open. Give one specific teacher/scenario revision note on the response rather than treating a keyword as evidence of quality. |
| High | L19h1–h4 · hiring writing sequence | **Strong topic, repetitive interaction.** Fit statement → why-this-role → résumé summary/bullets → four typed interview answers → acceptance reply could become a long run of “type enough words, collect an award.” This is a plausible disengagement point despite the coherent story. | Carry one learner-written experience example into the résumé and interview. Make each step transform it for a different audience. Allow optional oral rehearsal with a teacher/partner; do not make speech technology a prerequisite. In the offer reply, check acceptance and the correct start date, not eight words alone. |
| High | L24 · meeting-minutes | **A worthwhile new skill weakened by bypasses.** Generic notes and a long punctuated follow-up can pass without using the huddle. | Make a huddle decision consequential: an owner or deadline changes during discussion, and the follow-up must reflect it. Offer a readable transcript. Evaluate actual owner/action/date relationships through human review rather than merely finding one name and one day anywhere. |
| Medium | L16 Path B · appointment-scheduling | **A hidden answer is not the same as a reasoning task.** Clicking slots until one is open can replace checking the caller's requested time. | Require identifying why the requested slot cannot work, then offer a compatible alternative. Reveal-on-click is fine as interface practice, but do not count it as demonstrated cross-referencing. |
| Medium | L21 · multi-person-scheduling | **Useful escalation, partially pre-solved.** Named busy people on each slot reduce four-calendar comparison to reading a prepared availability summary. | Let the learner compare compact calendars and choose among plausible near-misses. Keep the summary as optional Help instead of removing support entirely. |
| Medium | L21 · video-call | **Recovery currently teaches an artificial reset ritual.** Leaving and rejoining after testing Unmute can feel punitive and interrupt otherwise useful control practice. | Teach recovery by muting again and using chat appropriately. Preserve the “join muted” objective separately if necessary. Send recovery instructions through the Job Card; the persistent red instruction banner conflicts with the repo's single-instruction-surface rule. |
| Medium | L19h5 · paperwork | **Useful orientation, shallow completion evidence.** Three forms can become clerical busywork if the learner only fills blanks. | Use supplied fictional applicant/bank details and ask learners to locate and transfer the relevant information. Explain one meaningful distinction per form. Label these as simplified simulations; the review does not establish real-form completeness or compliance. |
| Medium | L3 · shift-review | **Useful retrieval practice, weak as an additional destination.** Three recognition questions can consolidate learning, but should not become another long instruction/celebration sequence. | Keep it brief. Use mistakes to offer targeted practice on the underlying schedule/clock/paystub action; do not add compulsory exposition for learners who already understand it. |
| Medium | L4 → L9 → L11 → L12 · scheduling reuse | **Repetition is justified only if the decision changes.** These do add different responsibilities, but adjacent L11/L12 can still feel familiar enough to solve by interface habit. | Retain the progression from personal conflict to staffing to authoring to triage. In the capstone, change the data and remove answer-revealing defaults; assess whether the learner can explain the choice. Shorten repeated navigation coaching. |
| High for final payoff | L27 · portfolio-reflection | **Worth keeping as closure, but its take-away promise is fragile.** An export missing answers after reload undermines the reward for finishing. | Restore saved reflections, localize exported skill labels, and offer a useful durable summary. Include selected authored work where feasible. Distinguish simulated role experience from real employment history in anything shared outside the app. |

**Keep and protect:** L1's low-stakes start, L5's find/rename/share sequence, L7's formula-and-Cc practice, L10's live formula repair, L15's audience-and-draft editing, and L22's receipt reconciliation have clear workplace transfer. Their value comes from the action practiced, not the badge or strictness of the validator. L25's constructive-review task and L27's reflection also have value even though nuanced writing should not be graded by narrow regexes.

**What I would do first:** strengthen L23 and L26, shorten or combine enrollment/coursework where they add acknowledgment rather than action, vary the hiring sequence, and fix the final artifact's persistence. I would do that before adding more levels or imposing more word-count gates.

For playtesting, ask learners to solve one fresh example without the starter after a suspected weak level. Watch for indiscriminate clicking, copying starters unchanged, and inability to explain a correct choice. Ask whether the task felt useful, repetitive, confusing, or too easy. Those observations can distinguish boredom from language/reading burden; completion speed alone cannot. No dropout rate or learner finding is claimed here.

---

# Act I: New Hire

Cast: Maria Delgado, Cafe Manager. Levels L0–L3a2.

## 1. L0 — How This Works

**Task:** tour — welcome screen → desktop Job Card introduction → drag/shrink practice → bookmarks → Mail → work-email explanation → Help; task-list introduction opens L1.

### What's working

- A new pre-tour welcome screen (added today) now explains the program's purpose — safe practice, five story days in the first role, self-paced progression, points/awards, five practical skill goals — before any UI walkthrough begins, in both languages with its own language switch. It's dismissed once per learner/device via a story flag; Studio's fresh-account reset clears it for replay.
- The desktop still comes first after that welcome screen, and the learner uses its button to open the browser — the same navigation loop later jobs reuse (`DesktopClient.tsx`, `job-card-content.ts`).
- The four-step browser walkthrough is intact in both languages. Step 1 now reads "These are your bookmarks. They are shortcuts to websites you use for work" (changed today from "app," which could imply an installed program) and rings the whole bookmarks row before narrowing to Mail.
- Dragging the Job Card is now a required, verified action, not an acknowledgment: the introduction advances only once the card actually changes corner (a same-corner drop or header click does not count); a keyboard-arrow move on the focused header also satisfies it. After the move, the card returns to its normal starting corner so the practice position doesn't cover the bookmarks.
- The bottom-bar task-list introduction now says "This orange button on the bottom bar opens your task list," with one steady border (replacing two competing rings), kept at least 4px inside every viewport edge.
- The final Help step now says "Tap the ? on this card to try Help" instead of the old conditional "if you get lost" wording, so the required click reads as required. After Help closes, the Job Card confirms the learner has tried Help and is ready for the first task, instead of re-issuing the same "try Help" instruction the learner just completed.
- The Help lesson now explains how to reopen a shrunken card, in both languages — recovery guidance exists without adding another onboarding step.
- English and Spanish completion copy (`TOUR_COPY.doneBody`) are now aligned; the Spanish text no longer describes an older desktop/briefcase/blue-button flow that doesn't match the current UI.
- Acknowledgment buttons now read "I understand" / "Entiendo" instead of "Got it," per your preference for literal wording for English learners. The Job Card's primary and Help buttons have clearer pressable styling (shadow, edge, hover/pressed states, visible keyboard focus), with reduced-motion support.
- `e2e/first-session.spec.ts` has been updated to match the current four-step, no-Calendar tour and the Help close-through-Job-Card-button flow; the Spanish test now covers the full tour through the first Mail handoff at 1024×768, including manual shrink/restore.

### Concerns / could be better

- The core "how many transitions before the first real email" question from the original review is *reduced* but not eliminated by today's changes: a learner now passes through welcome screen → desktop intro → drag practice → shrink practice → bookmarks/Mail/Help before reaching Maria's inbox. Each individual step is now clearer, but the total sequence is longer than it was, not shorter. Judge this by an actual first-time playthrough, not by step-counting.
- Returning from Help (opened from the Mail tab) back to the tour tab can still read as "going backward" — today's changes fixed the wording at that step, not the tab-switch itself. This remains a "check whether it's confusing" item, per your own playthrough checklist in `codex_revisions.md`.
- The new welcome screen's reading load — especially in Spanish, especially at narrow widths — hasn't been human-playtested yet; this is explicitly flagged as an open question in `codex_revisions.md` ("Is the amount of reading comfortable, especially in Spanish?").
- All of the above verification is automated (`npm run check`: lint + TypeScript + 774 unit tests; full Playwright suite passing in English and Spanish). Per `codex_revisions.md`, "Marlana's in-depth playthrough is next" — no live human playtest has confirmed these changes read well to an actual learner yet.

### Suggested change

- Treat today's L0 changes as ready for your own end-to-end playthrough rather than needing further engineering — the actual next step is the human playtest already queued in `codex_revisions.md`, not more building.
- When you do that playthrough, specifically watch: the welcome screen's reading comfort in Spanish; whether the Mail→Help→tour tab-switch reads as backward; and whether recovering a shrunk card is discoverable without hunting for it in Help.

---

## 2. L1 — Day One

**Task:** mail (reply) — read Maria's welcome, send a thank-you

### What's working

- Same strengths as before: 7 plausible decoy emails, each with a specific wrong-click hint; sentence starters give a scaffolded on-ramp.

### Concerns / could be better

- None significant — intentionally the lowest-stakes task in the game, which is correct for lesson 1.

### Suggested change

- No change.

---

## 3. L1 — Day One

**Task:** mail (attach) — confirm what Maria needs via a comprehension check, then reply and attach the right file

### What's working

- Comprehension check before the reply, three near-miss file decoys with hints naming the actual distinguishing feature — unchanged and still good.
- **Fixed today:** the "In a real job, most asks from a manager look like this" completion line, previously duplicated between the per-task copy and the `MAIL_COPY` fallback, is now shared from one place.

### Concerns / could be better

- None remaining from the original review — the only flagged issue (copy duplication) is resolved.

### Suggested change

- No change.

---

## 4. L2 — The First Week

**Task:** schedule — spot the shift that conflicts with a personal calendar event, request the correct swap

### What's working

- The conflict is still never visually flagged on the row on a learner's first attempt — that remains the intended skill, not a bug.
- **Fixed today (this directly implements last review's suggested change):** a first wrong day-pick gets the existing general comparison hint; from the *second* wrong pick onward, the Job Card names the specific conflict — "Thursday, Aug 27" and "the 11 AM appointment" — and that stronger hint persists until the learner finds the right day. Replaying the level clears the attempt count, so the escalation doesn't carry over as a permanent crutch. Verified with a new browser test covering both hint stages plus the correct pick.
- **Fixed today:** the phone graphic beside the schedule is now explicitly named as the learner's own calendar — heading "My Calendar," caption "Your personal calendar" — and the Job Card and Help now say "the personal calendar on your phone" instead of the ambiguous old "your own calendar" / "Calendar." The phone also now stays visible on the swap-selection form itself, so the 11 AM appointment is still visible while picking a replacement shift.
- Wrong swap options remain plausible near-misses (right day/wrong time, wrong day) rather than throwaway distractors.

### Concerns / could be better

- None significant remaining — the original review's one concrete ask (a stuck-learner escalation path) is implemented and tested.

### Suggested change

- No change needed from an engineering standpoint. Playtest whether the escalating hint feels like help or like giving away the answer, per the open question already logged in `codex_revisions.md`.

---

## 5. L3 — Payday

**Task:** timeclock — Day 3 now opens **not punched in**, at 8:15 AM against a 7:00 AM–3:00 PM schedule (restructured today; previously opened at end-of-shift with Clock Out). After Clock In, the card compares the 7:00 AM scheduled start against the 8:15 AM actual clock-in; the "Looks right" button routes through the existing corrected-hint path; the learner messages Maria (subject "I forgot to clock in at 7"), who replies at 8:22 AM.

### What's working

- **Changed today, addresses a real story-logic gap:** starting the day already clocked out for a shift that hasn't happened yet was backwards for the start of Day 3. Opening with a forgotten *clock-in* is the more common real mistake and now matches the story's own timeline.
- The quiet-numeracy check is preserved in the new framing: the learner still has to notice a discrepancy (7:00 scheduled vs. 8:15 actual) without a red banner doing it for them.
- Confirmed in source (not a silent wrong answer, as the original review worried it might be): the "Looks right" button calls `looksRight()`, which routes the correction hint through the same Job Card feedback path as every other wrong answer here.

### Concerns / could be better

- This is a same-day restructure of the task's core scenario (not just copy) — it has automated coverage (`npm run check`, full Playwright suite) but, like the L0 changes, has not yet had a human playtest pass.

### Suggested change

- Prioritize this task in your next playthrough alongside L0: clock in at 8:15, deliberately choose "Looks right," then message Maria that you forgot — confirm the discrepancy and its correction are both legible in one read.

---

## 6. L3 — Payday

**Task:** paystub — open Alex Chen's stub (not Sam's/Priya's), read gross vs. net, confirm hours

### What's working

- Realistic PDF-reader flow rather than an in-app table; both wrong answers target the two most common real paystub confusions (gross vs. net; regular-only vs. regular+overtime hours) directly.
- Confirmed in source: Help already explains gross pay, net pay, and deductions, and defines net pay as the amount that reaches the bank.

### Concerns / could be better

- Combines navigation (pick the right person), vocabulary (gross/net/deductions), and numeracy (two questions) in one task — still a plausible difficulty spike, unchanged from the original review.

### Suggested change

- No change. Watch during playtest whether learners can explain their net-pay answer; if they're guessing, use the existing Help content or a Job Card nudge before adding a new instruction surface.

---

## 7. L3 — Payday

**Task:** shift-review — three recall questions covering schedule, clock-out/clock-in, and paystub knowledge

### What's working

- **Fixed today:** completion copy no longer claims "no coaching needed." It now accurately describes what the task actually is — a review of schedule, clock-out, and paystub knowledge — rather than overclaiming independent performance.

### Concerns / could be better

- This remains, by design, a three-question recall/recognition task, not a repeat of the real clock-out or paystub actions. That's an inherent property of the task type, not a defect — but keep completion language proportional to it (which today's fix now does).

### Suggested change

- No change. Whether Payday overall needs a dedicated vocabulary pause before shift-review is still an open decision noted in `codex_revisions.md` — resolve it from playtest evidence, not in advance.

---

## 8. L3a — One More Thing

**Task:** mail-etiquette — read Darnell's apron question, reply with subject/greeting/purpose/close, in your own words

### What's working

- **Added today:** a dedicated bilingual Help lesson for this task (previously it reused generic mail-step Help), walking through checking Darnell's message, answering the apron question, adding the location, and closing briefly — support that now actually matches what the task asks the learner to write.
- **Fixed today:** `mailEtiquetteAnswersDarnell()` now requires the reply to actually name the storage room (in either language, lenient about exact phrasing — "storage," "back room," "supply," "almacén," "bodega" all pass), plus a 6-word minimum. A learner can no longer pass with an empty acknowledgment that never answers Darnell's actual question.
- **Fixed today:** `mail-etiquette` is now in `TEACHER_CHECK_TASKS`, so a teacher can read what a learner actually wrote here, the same as the later free-text tasks.

### Concerns / could be better

- None remaining — both gaps the original review flagged (no content check, no teacher visibility) are resolved.

### Suggested change

- No change needed. Playtest whether the new content check ever rejects a valid but differently-worded answer (e.g., a learner who says "in the back" instead of naming the storage room) — the regex is intentionally lenient, but only real attempts will confirm it's lenient enough.

---

## 9. L3a2 — The Sick Call

**Task:** call-out-sick — message Maria that you cannot attend today's shift, without over-disclosing

### What's working

- **Added today:** a dedicated bilingual Help lesson covering the essential elements — telling Maria specifically, saying you cannot attend *today's* shift, and keeping the message short without symptom detail — plus a tip distinguishing this practice scenario from any real workplace's own call-out policy or channel.
- **Fixed today:** `callOutSickSaysCannotAttend()` directly answers the open question `codex_revisions.md` left ("Should completion require explicitly saying you cannot attend the shift?") — yes. The check now requires an inability-to-attend phrase plus a reference to today/the shift, so "I'm sick" alone no longer completes the task.
- **Fixed today:** `call-out-sick` is now in `TEACHER_CHECK_TASKS`, matching mail-etiquette.

### Concerns / could be better

- None remaining — both gaps the original review flagged are resolved.

### Suggested change

- No change needed. Same playtest note as mail-etiquette: confirm the lenient regex doesn't reject a valid but unanticipated phrasing.

---

# Act II: Shift Lead

Cast: Renata Silva, General Manager (takes over from Maria at the promotion in L3b); Jordan Kim (Shift Lead peer); Darnell Washington (coworker). Levels L3b–L8.

## 10. L3b — When Something Happens

**Task:** incident — write up a customer slip in order (what/injury/action-taken/notification), submit to shift lead

### What's working

- Open-ended writing task with real scaffolding (sentence starters for each element) rather than multiple choice; framing removes perfectionism pressure ("no one right way to say it").
- **Fixed today:** `incidentNarrativeIsComplete()` replaces the old 15-character-minimum check — it now requires the narrative to state both an injury-status fact ("no one was hurt," "nadie se lastimó," etc.) and an action/notification fact (cleaned up, put out a sign, told the shift lead), in either language. A learner can no longer pass with a vague sentence that never actually says what was done about it.
- **Fixed today:** `incident` is now in `TEACHER_CHECK_TASKS`, and the submission (when/where/what) is captured via a new `describeSubmission()` export, matching the pattern every other reviewed task uses.

### Concerns / could be better

- The previous missing-check and missing-review-path issues are resolved, but chronology and factual accuracy remain unverified automatically. The completion copy's "in order" claim is still stronger than automatic validation: teacher review is available, but no completed teacher assessment is required.

### Suggested change

- No change needed. Playtest whether the new injury/action check ever rejects a valid narrative phrased in an unanticipated way.

---

## 11. L3b — When Something Happens

**Task:** handbook — look up the sick-call-out policy under a "Jordan needs an answer now" time-pressure prompt

### What's working

- Simulates scanning a reference document under mild pressure; wrong options are plausible policy-adjacent numbers (e.g., meal-break length vs. callout window), not random distractors.

### Concerns / could be better

- None significant.

### Suggested change

- No change.

---

## 12. L3c — Locked Out

**Task:** account-recovery — recover login using a classroom PIN, simulated work password, and a fixed six-digit verification code, with an ad and a coworker message as distractors

### What's working

- Realistic multi-credential recovery flow with plausible distractors.

### Concerns / could be better

- Uses a fixed verification code; check whether learners transfer the skill of *finding* a code in a message rather than memorizing this specific six digits.

### Suggested change

- No change to the mechanic. Watch for rote memorization vs. transfer during playtest.

---

## 13. L4 — The Calendar

**Task:** calendar — spot a meeting invite on a day off, propose a new time

### What's working

- Directly reuses the "cross-reference two calendars" skill from L2, then adds *acting* on it (propose, not just flag); only two time options keeps it low-friction for the reading/writing level.

### Concerns / could be better

- Reuses L2's availability comparison; L3's clock discrepancy is related comparison practice, not the same scheduling decision. Later tasks add staffing, invite authoring, and multi-person coordination. Watch whether learners notice those differences.
- The Calendar ring/spotlight here has no rendered reminder text; since L0 no longer introduces Calendar at all, this is effectively the *first* introduction to it, not a memory callback — check whether the Job Card's own goal line gives enough context on its own.

### Suggested change

- Keep this as the explicit "same skill, new tool" bridge into Act II (the lesson text already says so). Make sure a later task (L9, reviewed below) does something genuinely new with the pattern rather than only repeat the interface — see Act III notes.

---

## 14. L5 — Shared Files

**Task:** files — find the right week's schedule among near-duplicates, rename it to a stated convention, share view-only with Jordan

### What's working

- Best-designed task in Acts I–II: three sequential sub-skills (find the right file, rename to convention, set permission correctly) map to three distinct real Drive mistakes. "Messy mode" (draft/copy/next-week duplicates) is a good difficulty dial for replay. `normalizeRename()` forgives case/spacing/`.pdf` differences — grades intent, not exact keystrokes.
- Confirmed in source: `FilesTask.tsx` shows the rename-format example (`renameHint`) directly above the input while typing, resolving the original review's readability question at the code level (visual clarity still worth a playtest look).

### Concerns / could be better

- None significant remaining.

### Suggested change

- No change. Test whether learners understand *why* Jordan gets view-only rather than edit access, not just that they picked it correctly.

---

## 15. L5 — Shared Files

**Task:** mail-send-link (reused mail app) — send Jordan a link, not an attachment, to the file just shared

### What's working

- Good continuity with the Act I mail shell; `sendsLinkNotFile()` is deliberately lenient (checks for link-language plus filename, rejects "attached"), appropriate for a free-text task aimed at non-fluent writers.
- This task **is** in `TEACHER_CHECK_TASKS` — a teacher can actually read what was written here, as are the earlier mail-etiquette, call-out-sick, and incident tasks.

### Concerns / could be better

- None — good reuse of an existing app, not a new build.

### Suggested change

- No change.

---

## 16. L6 — The Numbers

**Task:** spreadsheet — enter 5 tip amounts, read the auto-summed total, email it to report

### What's working

- Clean single-skill task: data entry → trust the tool's math → report the result in one sentence. `WRONG_ENTRY_HINT` catches a mismatched entry.
- **Fixed today:** `emailMentionsTotal()` now requires the sent message to state the correct total (requires at least four words and a numeric token within 0.01 of the actual $241.50 total — `$241.50` and `241.5` match; `241` does not), following the pattern already proven in L9/L10 (Act III). A learner can no longer complete the task by sending an empty-of-content message.

### Concerns / could be better

- `curriculum-catalog.ts` still describes this task as "flag one that's wrong," but the component checks the learner's transcription against five supplied amounts — there is no deliberate bad-source-slip step in the actual flow. This is a copy/implementation mismatch, not a learner-facing bug — see the copy-drift note in the closing section.

### Suggested change

- Low priority: align the catalog description with the actual data-entry-and-report skill (don't invent a new puzzle to match stale copy). The validation gap itself is resolved.

---

## 17. L7 — Reporting In

**Task:** make-a-copy — open a view-only template, use File → Make a copy instead of trying to edit it directly

### What's working

- Teaches a genuinely load-bearing real-world Google Workspace behavior. Three parallel wrong-path hints (typing directly, sharing, downloading) each redirect to the correct action as a teaching moment rather than a bare "no."

### Concerns / could be better

- None significant.

### Suggested change

- No change.

---

## 18. L7 — Reporting In

**Task:** status-report — write `=SUM()` in your own copy, cc a co-lead, mention the total in the email body

### What's working

- First task where the learner authors a formula rather than just reading one. The app checks the SUM formula, the Cc recipient, and whether the email mentions the total (`StatusReportTask.tsx`) — more validation than the original review credited it with. Wrong Cc selections get an immediate specific hint, and sending itself re-checks the Cc address, so this is not a silent failure path.
- This task **is** in `TEACHER_CHECK_TASKS`.

### Concerns / could be better

- Passing these checks demonstrates the required mechanics (formula, Cc, mentions the total), not the quality of the entire written report. Keep completion language proportional to what's actually checked — avoid describing it as fully teacher-graded without a review actually happening on it (it is eligible for review, as are mail-etiquette, call-out-sick, and incident).

### Suggested change

- No change to the mechanic. Focus playtesting on valid SUM variants and whether learners understand the selected range, not just whether they can type the right cc address.

---

## 19. L8 — Covering More Ground

**Task:** triage — a calendar conflict and a file-share request land at once; handle both, in either order

### What's working

- Strong Act II capstone: applies the L4 calendar-conflict skill and the L5 file-share skill back-to-back rather than teaching something new. "You choose the order, the only real mistake is forgetting one" explicitly validates order-independence instead of silently expecting a specific sequence.

### Concerns / could be better

- None significant — a good place to end the act.

### Suggested change

- No change.

---

> [!note] Acts I–II cross-cutting notes (updated)
> - Today's changes resolved essentially every concrete, source-confirmed concern the original review raised for L0–L3 (tour wording, Help recovery instructions, bilingual completion copy, stale e2e expectations, the L2 stuck-learner escalation, the L3 shift-review overclaim, and the Day-3 clock-in restructure) — the residual work at those levels is now playtesting, not engineering.
> - The earlier L6 missing-total and L3a/L3a2/L3b teacher-visibility gaps are resolved in source. Incident completion still does not establish chronological accuracy: the validator checks length and keyword signals, and teacher review is available rather than required.
> - The "check X before agreeing" skill now repeats across L2 → L3 (timeclock) → L4 → L9 → L11 → L12 (see Act III). By the third or fourth repetition this needs either explicit lesson-text callbacks (which L4, L11, and L12 already do) or a genuinely new wrinkle — worth a single cross-act decision rather than re-litigating it level by level.

---

# Act III: Shift Supervisor

Cast: Renata Silva. Levels L9–L12.

## 20. L9 — Scheduling the Team

**Task:** team-schedule — find Saturday close's gap on the crew sheet, pick someone with room (not the first name), tell them by email

### What's working

- Genuine content check, not just non-emptiness: `emailMentionsShift()` requires the message to name both the day (`sat`/`sáb`) **and** the time (`4`, `16:00`, or `4-10`) before `trySend()` completes the task (`TeamScheduleTask.tsx`).
- Every wrong pick in the coverage dropdown surfaces a person-specific reason (`saturdayHint`), not a generic "no" — same pattern the Act I/II review already praised for L1/L2 decoys.
- The in-sheet "Coverage note" states the actual skill up front — "Check Hours. Do not pick the first name" — rather than leaving the anti-pattern implicit.
- `doneBody` explicitly restates what was checked ("You did not pick the first name. You checked the hours. You wrote the day and the time."), reinforcing the three-part skill instead of just celebrating completion.

### Concerns / could be better

- The Saturday-close cell itself is a `<select>` with only one real option (blank or the shift label). The actual decision already happened in the earlier person-pick step; the dropdown adds a click but not a choice. Minor — doesn't undermine the lesson, just worth knowing it isn't a second checkpoint.

### Suggested change

- No change needed. If anything, this is a model for how the earlier spreadsheet/status-report validation gaps (flagged in the Act I/II review for L6/L7) should be fixed — content-aware regex, not non-empty checks.

---

## 21. L10 — Weekly Numbers

**Task:** formula-check — open the Hours total, discover the SUM formula excludes the last crew member, fix the range, then fix AVERAGE too, then email Renata

### What's working

- This is the strongest-built spreadsheet task in the game so far: `evalHoursFormula()` actually parses the formula text and computes a real value live, showing `#ERROR?` for an unparseable range — the total on screen is a genuine function of what the learner typed, not a canned string (`FormulaCheckTask.tsx`).
- `tryEmail()` gates on **both** SUM and AVERAGE being corrected (`rangeCoversCrew()` checked twice with two different, specific hints) — a learner who fixes only SUM gets told AVERAGE still needs the same fix, rather than the task quietly accepting a half-fix.
- Selecting the total cell highlights the actual rows its formula covers on the grid (`highlight`/`inRange`), giving a visual answer to "which rows is this adding" instead of requiring the learner to compute it in their head.
- This directly answers the Act I/II review's "flag one that's wrong" concern raised for L6 (`spreadsheet`) — here the "wrong" thing is a real, checkable formula defect, not a mismatch between catalog copy and a transcription check.

### Concerns / could be better

- `emailMentionsFix()` passes on `hasTotal` **OR** `hasMiss` — a learner can satisfy the send-check with a vague message like "I fixed the range" (matches `range`) and never state the corrected total, which is looser than L9's AND-based check for the same multi-part communication pattern one level earlier (L9 checks a day and time, not a spreadsheet total).

### Suggested change

- Tighten `emailMentionsFix()` to require the corrected total **and** a word naming what was wrong (mirroring L9's AND logic), so the message actually reports the number rather than just gesturing at "I fixed it."

---

## 22. L11 — First Team Meeting

**Task:** team-meeting — create a calendar invite (not just accept one) for a time when nobody is on shift, write a 2–3 bullet agenda, send both together

### What's working

- First task where the learner **authors** the invite instead of reacting to one — a genuine step up from L4's accept/propose pattern, and the lesson text says so directly ("Create the invite yourself. Do not wait for Renata to send one.").
- Two of three time slots are wrong, each with a shift-specific reason (`SLOTS[].hint`) rather than a generic rejection.
- `sendInvite()` requires **both** a saved, valid event and a saved, valid agenda (`eventSaved && agendaOk`) before completion — a learner can't skip the agenda half of the job.
- The lesson explicitly names the skill transfer ("Check the crew's shifts before you pick a time. Same conflict skill. New side of it.") rather than silently repeating the pattern and hoping it lands as review.

### Concerns / could be better

- `agendaBulletCount()` only requires 2+ non-empty lines — two single-word lines would pass. The task teaches agenda *format* (short bullets vs. a speech), which this does check; it does not check that the bullets are actually about the schedule.
- `titleIsAboutSchedule()` matches on keyword presence (`schedule|horario|huddle|reun|cover|cobertura`); a title that happens to contain one of these words without being a coherent one-line title would still pass. Low risk given the placeholder models the expected shape.
- This is the third appearance of "pick a time that does not conflict with a shift" (schedule → calendar → now this), continuing a pattern the Act I/II review already flagged for L4. The lesson's explicit callback helps, but watch whether it reads as review or repetition in playtest.

### Suggested change

- No structural change needed — the explicit "same skill, new side" framing already does the work the earlier review asked for at L4. Worth confirming in playtest that a third repetition still feels like progress rather than a retread, given L12 immediately follows with a fourth appearance of the same underlying skill.

---

## 23. L12 — Under Pressure

**Task:** priority-call — a customer complaint, a coverage gap, and a double-booked meeting land at once (capstone); learner names what comes first, then clears all three in any order

### What's working

- Best-designed capstone reviewed yet, exceeding even L8's triage: it requires an explicit prioritization statement (`urgency.trim().length < 12` gate) *before* revealing the work queue, then genuinely validates all three resolutions:
  - Customer reply: `replyIsSafe()` checks for a real acknowledgment (`ACKNOWLEDGES`) **and** rejects any promise the learner can't authorize (`OVERPROMISE` — "free," "refund," "comp," "gratis," "reembolso"). This is real content grading, not a non-empty check, and the code comment explicitly documents the design tradeoff (favor false-accepts over penalizing a valid reply in unanticipated wording).
  - Coverage: reuses L9's exact "pick who has room" mechanic and hint style (`COVER[].hint`).
  - Meeting conflict: reuses L4/L11's exact "propose a new time" mechanic.
- `finishIfReady()` checks all three completion flags regardless of which order they were set in — genuine order-independence, matching L8's "the only real mistake is forgetting one" design.
- The lesson explicitly names the reuse ("Picking who covers the shift is the same as Level 9. Moving the meeting is the same as Level 4."), turning three prior lessons into one synthesis rather than introducing new content at the finish line — and adds a real self-advocacy note ("If it feels like too much, say so in the check-in. That helps — it is not a failure"), which is a good touch for a capstone that's deliberately stressful by design.

### Concerns / could be better

- The urgency justification only requires 12 characters of any text — a vague sentence like "the customer first because busy" would pass without demonstrating real reasoning about tradeoffs. This is the one place in the level where "wrote something" and "reasoned about priority" aren't distinguished.
- `ACKNOWLEDGES` is deliberately broad by design (documented in a code comment: prefer letting a weak reply through over over-rejecting a valid one) — a reasonable call, but means a professional reply using none of the listed words/stems (e.g., "I hear you and will make sure this doesn't happen again") could still fail the check. Worth watching in playtest specifically for false rejections, not just false accepts.

### Suggested change

- No change to the reused-skill design — it's the intended payoff of Acts II–III's mechanic reuse and should stay as-is.
- Consider whether the urgency-statement check should require referencing one of the three actual situations (customer/close/meeting) rather than just a 12-character minimum, so a copy-pasted or non-committal answer doesn't pass as "reasoning."

---

> [!note] Act III cross-cutting notes
> - L9 introduces a real new skill (assign coverage by checking hours, not first-come), and its email-content validation (day **and** time, both required) is a useful two-part content check — a good bar to hold every later free-text task to.
> - L10 is the best-built spreadsheet task reviewed: a live-evaluated formula, not a static answer key. Its one gap (OR instead of AND on the reported total) needs a carefully tested change; an AND alone can also reject valid paraphrases.
> - L11 and L12 both reuse the "time that doesn't conflict with a shift" pattern already used in L2 (schedule) and L4 (calendar) — by L12 this is the fourth appearance. The act handles this well by naming the reuse out loud in both lessons rather than pretending each is new, and L12 turns it into deliberate synthesis rather than a fifth cold repeat.
> - The act's capstone (L12) is a genuine step up in validation rigor from anything in Acts I–II (real overpromise/acknowledgment content check vs. earlier non-empty checks) — arguably the best single task in the game reviewed to date.

## Things that can go wrong — Act III

### L9 — Scheduling the Team (team-schedule)

- **Picking on hours alone:** a learner might scan only the Hours column and miss that Jordan is also free that specific day; each wrong pick has a targeted hint, so check whether the hint clarifies "free that day" vs. just "has room."
- **Under-specified email:** the check requires a day word **and** a time; a learner who writes only "You're covering Saturday" gets a specific correction (`WRONG_EMAIL_HINT` names both day and time) — confirm that correction is legible on a first read, not just on retry.
- **Treating the coverage dropdown as the real decision:** since the dropdown has only one meaningful option, a learner could believe clicking it (rather than the earlier person-pick) is the actual task step — watch for confusion about where the real choice happened.

### L10 — Weekly Numbers (formula-check)

- **Fixing SUM but not AVERAGE:** the note only flags the SUM total as "close enough for payroll"; a learner may fix SUM, feel done, and try to send before AVERAGE is corrected — confirm the second hint is not just an equally-easy skip.
- **Vague send content:** `emailMentionsFix()` accepts generic words like "range" or "sum" without the corrected total — a learner could pass this check while writing something an actual supervisor would find useless ("fixed the sum"). Verify real submissions during playtest before deciding whether to tighten it.
- **Malformed formula syntax:** typing anything outside the exact `=SUM(H#:H#)` / `=AVERAGE(H#:H#)` pattern shows `#ERROR?` with no inline correction — check that a learner unfamiliar with spreadsheet syntax can recover from this state.

### L11 — First Team Meeting (team-meeting)

- **Keyword-matching title:** `titleIsAboutSchedule()` passes on any of several keywords; a title that's grammatically odd but contains "cover" or "reun" would still pass — check whether this produces false positives for very rough English/Spanish attempts.
- **Agenda as checkbox, not communication:** two single-word lines satisfy `agendaBulletCount() >= 2`; check whether learners write an agenda a real coworker could use, or just clear the count.
- **Repetition fatigue:** this is the third "pick a non-conflicting time" task; watch for learners who solve it by pattern-matching the UI shape rather than re-doing the actual comparison.

### L12 — Under Pressure (priority-call)

- **Order effects despite order-independent code:** `finishIfReady()` doesn't care which order the three sub-tasks finish in, but the hub UI still presents them in a fixed visual order (mail, cover, calendar) — confirm learners actually feel free to work in a different order, not just that the code allows it.
- **Meeting the character minimum without real reasoning:** an urgency answer like "customer first" (14 characters) would pass; check whether learners are asked to defend the choice anywhere else, since this is the only unchecked-for-content field in the level.
- **False rejection on an unmatched but professional reply:** because `ACKNOWLEDGES` requires one of a fixed list of words/stems, a technically excellent reply that avoids all of them could be told to try again with no specific guidance beyond the generic overpromise/empty hints — capture exact wording of any rejected-but-reasonable replies during playtesting.

---

# Act IV: Assistant Manager

Cast: Renata Silva. Levels L13–L15.

## 24. L13 — An Offer

**Task:** college-offer — read a formal offer letter, reply that you accept, put the recurring class on a calendar that already has a shift conflict, then tell your manager about the conflict before the semester starts

### What's working

- Genuinely multi-step and fully gated, not a single free-text box: `tryAccept()` requires the reply to both indicate acceptance *and* name the class (`replyAcceptsOffer` — regex checks for an accept-word AND a class-name word); `saveEvent()` requires the correct Tuesday 2–4 slot (2 wrong slots each carry a specific redirect hint, e.g. "That is a free evening. The class meets Tuesday afternoon") *and* the "Repeats weekly" checkbox; `tryOverlap()` requires the follow-up message to Renata to actually name the shift conflict (`overlapMentionsShift`), not just say anything (`CollegeOfferTask.tsx`).
- The three sub-steps are sequenced realistically: accept → calendar → tell Renata about the newly-visible conflict — each gated on the previous (`finish()` refuses to close the job unless all three: `accepted`, `eventSaved`, `overlapSent`).
- The "Repeats weekly" checkbox requirement is a nice, real Google-Calendar-shaped catch: forgetting it is the single most common real mistake when adding a recurring class.
- Bilingual copy, starters, and hints are complete and specific (each wrong slot's hint names the correct day/time rather than a generic "no").

### Concerns / could be better

- The hub's Mail item's `onOpen` handler is `() => setView(accepted ? "mail" : "mail")` — both branches are identical, dead code left over from a refactor. Harmless, just a small cleanup item.
- Completion badge shows `badgeNumber="16"`, which collides with `PriorityCallTask.tsx`'s (Act III's capstone) badge number 16 — see the closing "Suggestions for all levels" section for the repo-wide badge-numbering pattern this belongs to.
- `curriculum-catalog.ts` correctly uses level keys/numbers 13–15. Its folder paths retain legacy numbers 10–12; these are directory identifiers, not evidence of a one-level runtime mismatch.

### Suggested change

- Low priority: remove the dead ternary in the Mail hub item's `onOpen`.
- No functional change needed to the task itself — this is one of the more rigorously gated tasks reviewed so far in the whole game.

---

## 25. L14 — The Budget

**Task:** budget-sheet — click the one "over" status cell, read its `=IF()` formula, cross-check the bar chart, then email Renata which category is over and by how much

### What's working

- The chart is a real inline SVG rendered directly from `BUDGET_ROWS` data, not a decorative placeholder — the bar heights and the over/under coloring are computed from the same numbers as the sheet, so "the formula and the chart should say the same thing" is literally true in the data, not just narratively true.
- The email is gated on an actual click: `tryEmail()` refuses to open compose unless `openedOver` was set, which only happens when the learner clicks the specific Labor/Status cell that evaluates to "over" — clicking any other cell does not satisfy it.
- `emailFlagsOver()` requires the message to both name the over category (labor / mano de obra / payroll) and indicate it's over (by word or by number — 450 or 2850) — a real content check, not non-emptiness.
- This is the one task in the game explicitly designed as read-only formula literacy ("In this lesson you only read the formula — you do not write one," per the Help lesson) — a deliberate, well-signposted scope limit rather than an accidental gap.

### Concerns / could be better

- The sheet's initial selected-cell state defaults to exactly the Labor/Status cell, so the formula bar already displays the correct `=IF(...)` formula the instant the learner opens the sheet, before any click happens. The `openedOver` gate still requires an explicit click on that same cell to unlock the email button, which is functionally fine, but a learner may be confused about why they need to click something that already looks selected/answered. Minor UX wrinkle, not a broken mechanic.
- `badgeNumber="17"` is part of the same repo-wide badge-numbering-collision pattern flagged for L13 above.

### Suggested change

- Consider defaulting the selected cell to a neutral cell (e.g. the header row) so the formula bar is genuinely blank until the learner clicks Labor's status cell — makes "click to read" a real first action instead of a state that happens to already match the answer.
- No other changes needed.

---

## 26. L15 — Reply-All

**Task:** reply-all — on a long HQ thread, choose Reply (not Reply All), then edit a pre-loaded casual draft into a professional-but-still-affirmative answer to Dana's yes/no delivery question

### What's working

- This is the most tightly validated free-text task reviewed in the game so far. `trySend()` in `MailClient.tsx` checks, in order: (1) `replyAudience === "dana"` — clicking the literal "Reply all" button is wired to `wrongReplyAll()` with a specific correction ("Dana asked you, not the whole thread. Click Reply"), and choosing Reply All as the audience is rejected even if the message content would otherwise pass; (2) the draft must actually be edited — `casualDraftUntouched()` rejects sending the unedited seed text verbatim, and `stillSoundsCasual()` separately rejects casual markers (lol, jaja, haha, lmao) even in an edited draft; (3) `replyAllAnswersDana()` requires the body to contain both an answer-shaped phrase (yes/no/podemos/we can) *and* delivery-specific language (Friday/6/delivery/dock) — a real content check.
- Reply vs. Forward are also separately distinguished with their own specific wrong-path hints elsewhere in the same file, so all three plausible wrong buttons (Reply All, Forward, Compose) have named, specific corrections rather than one generic "wrong" state.
- Reuses the existing Mail app shell (same pattern already praised for L5's `mail-send-link`) — good continuity, not a new build for a one-off scenario.

### Concerns / could be better

- None significant found in source — this task's validation logic is more complete than most other free-text tasks in the game (compare to `incident`/`mail-etiquette`/`call-out-sick`, which now also check task-specific content signals). Worth using this task's validation pattern (`casualDraftUntouched` + `stillSoundsCasual` + content-match) as the template when tightening those other tasks — see the closing "Suggestions for all levels" section.

### Suggested change

- No change — this is a model implementation to point to when improving similarly-shaped free-text tasks elsewhere in the game.

---

> [!note] Act IV cross-cutting notes
> - Act IV is a believable step up from Act III: L9–L12 (Shift Supervisor) are almost entirely mechanics/noticing tasks; L13–L15 add real interpersonal/tone judgment on top of the mechanics — accepting a formal offer while flagging a schedule conflict (L13), reading a manager's formula without writing one (L14, a deliberate ease-up before Act VI's expense-report), and the reply-vs-reply-all/tone-editing judgment call (L15) that has no earlier equivalent in the game. The progression reads as intentional, not just three more tasks.
> - `college-offer` and `budget-sheet` both require the learner to notice and report a *specific number or fact* rather than just complete a mechanical step — consistent with the "you have to look" pattern already praised in Acts I–II.
> - `reply-all`'s validation rigor is noticeably stronger than the free-text validation used in earlier acts' writing tasks (`incident`, `mail-etiquette`, `call-out-sick`). If a validation-tightening pass happens later, `reply-all`'s `MailClient.tsx` logic is the right reference implementation, not a from-scratch design.

## Things that can go wrong — Act IV

### L13 — An Offer (college-offer)
- **Skipping the conflict step:** a learner may accept the offer and save the calendar event, then try to finish without emailing Renata about the overlap — confirm the finish-gate hint is specific enough when what's actually missing is the third step, not the first two.
- **Picking a plausible-but-wrong slot:** Wed 10am and Thu 6pm are both named as real free/plausible times in their hints — check that a learner reads the hint rather than cycling through options by trial and error.
- **Forgetting "Repeats weekly":** verify the checkbox's purpose is clear on first encounter — this is a real Google Calendar behavior most learners will not have used before.

### L14 — The Budget (budget-sheet)
- **Clicking without reading:** because the Labor/Status cell is already the default-selected cell, a learner might click it reflexively to "unlock" the email button without actually reading the formula bar content. Ask them to explain the IF formula in their own words after finishing.
- **Naming the wrong number:** the email check requires a labor-category term AND an over/amount signal. "2850" alone fails, but "labor is over" passes without stating how much. That leaves the exact-amount reporting objective unverified.
- **Chart read as decoration:** since the chart auto-renders correctly regardless of what the learner clicks, check whether learners actually look at it or treat it as illustrative flavor.

### L15 — Reply-All (reply-all)
- **Reply All as the "safe" choice:** a learner unsure who needs to see the answer may default to Reply All as the "more thorough" option — confirm the specific correction actually redirects them rather than reading as a scold.
- **Under-editing the casual draft:** a learner might make a trivial edit that still fails `stillSoundsCasual()` — check that the resulting hint gives enough direction on *what* to change, not just *that* something's wrong.
- **Answering without the specifics:** confirm a bare "yes" or "no" with no Friday/6am/delivery language produces a clear, specific hint rather than feeling like an arbitrary rejection of a technically-correct one-word answer.

---

# Act V: Bridge (elective, two parallel paths)

Levels L16–L19. Path A (college): Marcus Bell, Academic Advisor, Bunker Hill Community College. Path B (healthcare front desk): Thuy Nguyen, Front Desk Supervisor, Harborside Health. Both paths teach parallel skills under different vocabulary.

## Path A (college) — L16–L19

### 27. L16 — Getting Ready

**Task:** enrollment — mark the one missing document ready, write a short statement of interest, submit before the deadline

#### What's working
- Realistic portal shape: a 3-item checklist with one item genuinely incomplete (immunization record), plus a clearly labeled deadline shown right under the heading — echoes the "find the date first" pattern from Act I/II payday and later enrollment tasks.
- `statementShowsInterest()` is forgiving by design: any statement ≥24 characters naming the school, a program, or a relevant keyword passes in either language. Matches the established house style of grading intent, not exact phrasing.
- Sentence starters give a low-friction on-ramp, consistent with every other free-text task in the game.

#### Concerns / could be better
- "Mark ready" succeeds unconditionally the instant it's clicked — there's no simulated step of actually finding/uploading the immunization record. Reasonable simplification, but means the "one item is still missing" framing teaches noticing a gap, not doing anything about it.
- The Job Card only ever shows two states (docs step / statement step); a learner who marks the document ready first and writes the statement second never sees an explicit "now write your statement" prompt beyond the ambient step index.

#### Suggested change
- No structural change needed. If a future pass wants more realism, "Mark ready" could gate on a trivial confirm step rather than a bare click — low priority.

---

### 28. L17 — The Paperwork

**Task:** financial-aid — open a PDF award letter, answer two multiple-choice comprehension checks (amount, then accept-by date) sourced from the letter, not the portal summary

#### What's working
- Best-built task in this path. It deliberately separates the portal card from the real PDF and repeats "open the letter, don't guess from the summary" — a genuinely useful real-world habit (Act I's paystub task does the same PDF-realism move).
- Two sequential checks test two distinct numbers (amount vs. date) rather than one, and each wrong option has a specific, targeted hint (e.g., "$4,800 — that is twice the letter") rather than a generic "try again."
- The PDF stays re-openable from inside the question screen, so a learner who forgets a detail isn't forced to restart.

#### Concerns / could be better
- None significant — tightly scoped, matches its own lesson content precisely, no additional validation gap identified in this source pass.

#### Suggested change
- No change.

---

### 29. L18 — Staying On Top of It

**Task:** coursework — read a syllabus, acknowledge the due date via checkbox, write a 3–4 sentence reply to a forwarded customer complaint

#### What's working
- Nice pairing of a workplace-transfer skill (professional reply to a complaint) with an academic-literacy skill (syllabus due-date awareness) in one task.
- `responseIsComplete()` requires both length (≥28 chars) and content signal (an acknowledgment/action-next-step word in either language) — stronger than a bare non-empty check.
- A hint fires specifically when the due-date checkbox isn't ticked yet, keeping the two required actions (ack date, then write) in order.

#### Concerns / could be better
- The due-date acknowledgment is a checkbox next to text that already states the date ("I see this is due Friday at 11:59 PM") — the learner isn't required to locate the date themselves; it's handed to them in the very label they're checking. This is weaker "find the deadline" practice than L16's or L17's version of the same skill, where the date has to be read off a separate document/portal card.

#### Suggested change
- Low priority: if this task is meant to reinforce deadline-finding (its own lesson text says "the due date is the first thing to look for"), consider moving the exact date out of the checkbox label and into the syllabus paragraph only, so ticking the box requires having actually read it.

---

### 30. L19 — Finding a Real Answer

**Task:** research — pick the one credible source among four search results (sponsored ad, outdated article, anonymous forum post, peer-reviewed library database), then write one line justifying the choice

#### What's working
- Genuinely good source-credibility task: all three distractors are realistic and distinct failure modes (a sales pitch, a stale prediction, an anonymous forum), not throwaway options.
- Picking a wrong result gives an immediate, specific inline correction (in both languages) before the learner can even reach the write-up step.
- `whyHoldsUp()` requires the justification actually reference a credibility signal (database/peer-review/author/year), not just "it looks good" — matches this task's own lesson text almost verbatim.

#### Concerns / could be better
- None significant.

#### Suggested change
- No change.

---

## Path B (healthcare front desk) — L16–L19

### 31. L16 — Getting Ready

**Task:** appointment-scheduling — a caller wants a slot that's already booked; find the one open slot and confirm it

#### What's working
- Confirmation validation (`confirmationOffersOpenSlot`) checks that the actual new time (11:30) appears in the reply, not just that something was sent.
- **Fixed today:** slots no longer show "Booked · Name" or "Open" up front. Clicking a slot now reveals its status — taken or open — matching the "check first" pattern used in Act I's schedule task and Act II's calendar task. The answer is no longer labeled on load, but inspecting the booked requested slot is not required: `tryOffer()` only checks `slot === OPEN_SLOT`. A learner can click 11:30 first and continue.

#### Concerns / could be better
- The labels no longer reveal the answer initially, but booked-slot inspection and genuine comparison remain unverified. See the learning-value review above.

#### Suggested change
- No change needed. Playtest whether "Click to check" reads clearly as an instruction to click each slot, rather than looking like a disabled button.

---

### 32. L17 — The Paperwork

**Task:** patient-intake — file a new-patient form, then decline a coworker's request to see it without disclosing the visit reason

#### What's working
- Strongest confidentiality task in the act. `declineIsSafe()` requires the reply to both (a) contain refusal/no-access language and (b) *not* contain the visit reason ("follow-up"/"seguimiento") — and `trySend()` adds a second, independent guard that catches leaks before the general check even runs. These guards catch listed phrases, not every disclosure or paraphrase. `declineIsSafe()` also accepts “sorry” alone as its refusal signal; for example, “Sorry, you can see the chart” passes the pure validator. Teacher review remains important.
- The two competing requests (an unauthorized coworker vs. an authorized care-team nurse) are placed side by side, and only the unauthorized one requires action — a realistic front-desk judgment call, not a fabricated puzzle.

#### Concerns / could be better
- The authorized request (the nurse's "I'm on Maya's care team" card) is purely decorative — it renders as a static green card with no button, no reply, no way to get it wrong or right. The task's own Help lesson explicitly contrasts "the nurse is different — she can take the chart, Sam cannot," but nothing in the mechanic asks the learner to *demonstrate* recognizing that distinction; only the refusal to the wrong person is graded. A learner could plausibly pass this task without ever consciously registering why the nurse's request was fine.

#### Suggested change
- Consider giving the care-team request a trivial acknowledgment action (even just an "OK, share when ready" click) so both halves of the judgment — who's authorized and who isn't — are actually exercised, not just one. Low-to-medium priority: the current version still teaches the core skill (safe refusal) correctly; this would sharpen it.

---

### 33. L18 — Staying On Top of It

**Task:** billing-sheet — compare visit charges against a reference list, find the one mismatch, email the office manager with the correct row and amount

#### What's working
- Structurally close to Act II's spreadsheet task but with a real reference list to check against (the earlier spreadsheet task's Act I/II review flagged a similar feature as missing).
- `emailFlagsMismatch()` is a solid two-part check: the message must name the mismatched row (EKG/93000/Okonkwo) **and** state the correct charge (85) while explicitly excluding a message that only repeats the wrong number (185) — stops a learner from passing by parroting the sheet back verbatim.
- The email compose step is gated behind actually clicking into the mismatched row first, so the task can't be completed by emailing blind.
- **Fixed today:** the mismatched cell no longer renders red until the learner has actually selected that row. Comparing against the reference list is now encouraged, though trial-and-error clicks can still reveal it — the app no longer gives the answer away on load.

#### Concerns / could be better
- None remaining — the source-confirmed gap (auto-highlighted answer) is resolved.

#### Suggested change
- No change needed. Playtest whether learners now use the reference list to find the mismatch, versus clicking rows at random until one turns red.

---

### 34. L19 — Finding a Real Answer

**Task:** confidentiality-call — a caller claiming to be a patient's aunt asks to confirm an appointment time; respond without confirming, leaking, or being rude

#### What's working
- The scenario (a caller claiming a family relationship that can't be verified) is a well-chosen, realistic test of "you can't verify who's calling," distinct from `patient-intake`'s "coworker vs. care-team" judgment — the two Path B confidentiality tasks don't just repeat each other.
- **Fixed today:** the task is now a free-text compose step, wired to the `replyIsSafe()` validator that was already built and tested but never shipped. The three previous multiple-choice buttons are gone; a learner now has to write their own safe decline, the same as `patient-intake`. The old `choiceIsSafe`/`CALL_CHOICES` button-based code was removed rather than left unused.

#### Concerns / could be better
- None remaining — the recognition-vs-production asymmetry with `patient-intake` is resolved, and the previously-unused validator is now the shipped mechanic.

#### Suggested change
- No change needed. Playtest the new starters and confirm `replyIsSafe()`'s regex doesn't reject a valid but unanticipated phrasing — the same caution that applies to every other free-text check in the game.

---

> [!note] Comparing the two paths
> Path A (college) was the more consistently finished of the two at review time: its four tasks have coherent scenarios, but enrollment and coursework still have acknowledgment-versus-demonstration gaps. Path B (healthcare) had real strengths even then — `patient-intake`'s confidentiality check was already arguably the best-built judgment task in either path — but three source-confirmed gaps meant it lagged Path A in rigor: `billing-sheet`'s auto-highlighted mismatch cell, `confidentiality-call`'s easier-than-stated multiple-choice mechanic, and `appointment-scheduling`'s pre-solved clash. **All three were fixed today** (reveal-on-click slots, gated mismatch highlighting, and a free-text compose step wired to the existing validator), but those UI fixes do not establish equal rigor or eliminate validator bypasses. Worth a playtest pass on Path B specifically, since these are same-day changes with only automated verification so far.

## Things that can go wrong — Act V

### L16 Path A — Enrollment
- **Clicking through without reading the deadline:** a learner can mark the document ready and write a passable statement without ever having located the deadline date. Ask them to state the deadline back to you.
- **Starter-only statements:** a one-click starter plus nothing else still passes `statementShowsInterest()`. Check whether the learner can explain, in their own words, why they picked this school/program.

### L16 Path B — Appointment Scheduling
- **Fixed today:** slots no longer reveal "Booked"/"Open" until clicked, but this does not enforce inspecting the requested booked slot before choosing the open slot. Confirm in playtest that learners understand they need to click each slot to check it.
- **Confirmation with the time but no context:** `confirmationOffersOpenSlot` only checks for "11:30" appearing anywhere — a message with just the number and nothing addressed to Maya still passes. Ask the learner to read their sent message aloud.

### L17 Path A — Financial Aid
- **Guessing from portal memory:** a learner might answer from the summary card rather than actually opening the PDF. Watch whether they re-open the letter for the second question or answer from memory.
- **Confusing the two dates:** the accept-by date and the original application deadline (carried over from L16) are deliberately similar in shape — a plausible mix-up the wrong-hint already targets. Confirm the hint actually helps rather than just says "wrong."

### L17 Path B — Patient Intake
- **Leaking the reason while trying to be polite:** a learner might write a warm-sounding refusal that still names "follow-up" — this is explicitly guarded against in code, but confirm in practice that the correction clearly explains *why* the message was rejected, not just that it was.
- **Never distinguishing the two requesters:** because the nurse's request requires no action, a learner could complete this task without consciously noticing there were two different people asking, one authorized and one not. Ask them directly: "why was it okay for the nurse to see it but not Sam?"

### L18 Path A — Coursework
- **Checking the box without reading anything:** the due-date checkbox states the date in its own label, so ticking it does not require having found it elsewhere. Ask the learner to point to the due date on the syllabus itself, not the checkbox.
- **Passing on keyword match alone:** `responseIsComplete()` accepts any reply with a qualifying word at 28+ characters — a technically-passing reply could still be a poor professional response. Read a few actual learner replies during playtest, not just pass/fail.

### L18 Path B — Billing Sheet
- **Fixed today:** the mismatch cell no longer highlights on load — it only reveals once the learner selects that row, though clicking rows until one highlights can still bypass comparison. Confirm in playtest that learners use the list rather than clicking rows one by one to find the color change.
- **Repeating the wrong number back:** the email check specifically guards against a message that just restates the wrong number without also giving the correct one — confirm this guard actually blocks that message in practice, not just in the regex.

### L19 Path A — Research
- **Picking a plausible-sounding wrong source:** all three distractors are designed to look reasonable at a glance. Ask the learner why they rejected each of the other three, not just why they picked the database.
- **Justification without real content:** `whyHoldsUp()` accepts a one-line justification with a qualifying keyword; a memorized starter phrase would pass without genuine understanding. Ask for the justification in the learner's own words during playtest.

### L19 Path B — Confidentiality Call
- **Fixed today:** the task is now free-text, so a learner has to produce a safe decline in their own words rather than recognize one among three buttons. Watch for valid replies that `replyIsSafe()`'s regex might not anticipate — the same caution as every other free-text check in the game.
- **Treating "family" as automatic access:** the caller's claim to be an aunt is designed to be believable — watch for learners who write something that shares information because the caller sounded legitimate, and confirm they can explain that a plausible relationship claim still isn't verification.

---

# Act VI: Office Administrator

Cast: Anita Raman, Operations Director at Harborside HQ; Chris Okafor (HQ coworker). Levels L19h1–L23. The hiring sub-arc and L20–L23 are covered here as implemented source; this pass does not establish their deployment date.

## 35. L19h1 — Applying

**Task:** job-posting — read the HQ Office Administrator posting, check off which requirements your cafe experience covers, write one line on fit

### What's working
- The requirement list is honestly designed: 4 of 5 items are met (customer-facing, scheduling, tools, budget) and one — a bachelor's degree — is deliberately unmet, with a dedicated note ("You do not have a degree — and this job does not need one") that fires the moment the learner checks it. A real, well-aimed lesson about job postings being wish lists, not gates.
- `pickingLooksReady()` requires 3+ of the *actually-met* requirements checked, not just any 3 checkboxes — a learner can't game it by checking the degree box plus two others.
- `fitLooksReal()` requires four words. Starters support accessible practice, but relevance and evidence of fit need teacher review.

### Concerns / could be better
- None significant — tightly scoped, and the "you don't need every box" lesson is exactly the kind of hidden-curriculum content ESL/workplace-readiness learners usually don't get taught explicitly.

### Suggested change
- No change.

---

## 36. L19h1 — Applying

**Task:** job-application — fill out a multi-section application (position, work history, availability, "why this role")

### What's working
- Work history is genuinely pre-filled from the learner's own trunk story (New Hire → Shift Lead → Shift Supervisor → Assistant Manager at Harborside Cafe) rather than being aspirational filler — since every learner follows the identical fixed role progression through Act IV regardless of which Act V door they took, a static work-history array is actually consistent with the normal in-game progression (not evidence of real employment), not a shortcut that happens to look right.
- `whyLooksReal()` (6+ words) plus starters mirrors the posting task's forgiving-but-real bar.
- Copy explicitly tells the learner to check the pre-filled history for correctness ("From your Harborside record. Read it over.") — treats it as something to verify, not just admire.

### Concerns / could be better
- None significant.

### Suggested change
- No change.

---

## 37. L19h2 — Your Résumé

**Task:** resume-build — turn Harborside work history into a one-page résumé (summary, one bullet per top-2 role, 3+ skills)

### What's working
- `summaryLooksReal()` (6+ words), `bulletLooksReal()` (4+ words per bullet, both of the top two roles), and a hard skills-count gate (fewer than 3 blocks completion) are all real, specific thresholds — not just non-empty checks.
- The live preview pane (using the learner's actual name and typed content) shows the artifact taking shape, not just a form — a nice touch many similar tasks in this game skip.
- Only the two most recent roles get bullet fields; the older two show "for reference, not editable" — correctly scoped so the task doesn't balloon into re-describing four jobs.

### Concerns / could be better
- None significant.

### Suggested change
- No change.

---

## 38. L19h3 — The Interview

**Task:** interview-practice — answer 4 mock-interview questions, then ask one of your own

### What's working
- This is length-checked, not semantically content-checked: `answerLooksReal()` requires 6+ words per answer for *all four* questions before finishing, and the "ask back" step is a hard separate gate — a learner can't finish by only answering the interviewer's questions.
- Each question carries its own "what she's listening for" coaching line, visible before the learner answers — this is real interview-skills content (e.g. the weakness question explicitly models an ESL-appropriate honest answer: "English is my second language, and long emails still take me time").
- The file's own header comment is transparent about scope: "the app confirms every answer is real; it does not grade them. A spoken mode is planned (Phase 4)." That's the correct claim to make — nothing here overstates what's checked.

### Concerns / could be better
- Word-count-only grading means a learner could type six words of nonsense and pass. This is an intentionally looser check than the task-specific validators now used for mail-etiquette/sick-call in Act I — worth the same "capture actual answers during playtesting before choosing grading rules" treatment rather than a fix now.

### Suggested change
- Keep the low-pressure practice framing and use the existing teacher-review path. Check relevance against the interview question through human review before proposing stricter automated grading.

---

## 39. L19h4 — The Offer

**Task:** job-offer — read an offer letter, pick the correct start date out of 3 choices, write an acceptance reply

### What's working
- Follows the same well-established "find the fact in the document" pattern as the paystub and financial-aid tasks: 3 date choices, only one correct, with immediate red/green visual feedback and a hint that names exactly where to look ("second paragraph") on a wrong pick.
- `replyLooksReal()` requires 8+ words — an appropriately higher bar than the shorter interview answers, since this is a real accept-the-job email, and starters model repeating the date back (explicitly taught as "not extra — it's how you both know you agree").
- Copy consistently reinforces the sequence, correctly foreshadowing the paperwork level that follows.

### Concerns / could be better
- The eight-word reply check does not verify acceptance or restating the start date.

### Suggested change
- Add a lenient acceptance/date check and retain teacher review for communication quality.

---

## 40. L19h5 — New-Hire Paperwork

**Task:** w4-form — filing status, dependents, signature, date

### What's working
- `signatureMatches()` normalizes case/whitespace and compares against the learner's actual display name — the same forgiving-but-real pattern as `normalizeRename()` in Act II's Files task. A learner isn't tripped up by capitalization but also can't sign as "asdf."
- The dependents hint asks for "0" if none; the submit handler only requires a nonempty value — matches the on-screen hint ("If none, enter 0") instead of silently treating blank as zero.
- The form's own blurb explains *why* it exists ("tells payroll how much tax to hold back") before asking the learner to fill it — real financial/civic literacy content, scoped as simplified practice, not a complete real W-4.

### Concerns / could be better
- None significant.

### Suggested change
- No change.

---

## 41. L19h5 — New-Hire Paperwork

**Task:** i9-section1 — date of birth, address, work-authorization status, signature, date

### What's working
- Same signature/date handling as the W-4. The simulation offers four work-status categories (citizen, non-citizen national, LPR, authorized non-citizen) without oversimplifying into a fake binary.
- Blurb sets realistic expectations for what happens next ("You'll show ID documents on your first day") rather than implying this form alone completes work authorization.

### Concerns / could be better
- Date-of-birth and address fields only check non-emptiness, with no format check at all — a learner could type "x" in the address field and pass. This is a deliberately lighter bar than the W-4's dependents field (which uses a number input but whose submit handler checks only non-emptiness), and it's a reasonable design choice, but the source comment describing this task as checking "the format" isn't quite accurate for these two fields specifically.

### Suggested change
- Low priority: either loosen the doc comment's "checks the format" claim to be accurate for this form specifically, or add a minimal date-of-birth shape check (e.g. contains digits) to match the rigor already present elsewhere in this same task.

---

## 42. L19h5 — New-Hire Paperwork

**Task:** direct-deposit — bank name, routing number, account number, account type; no signature/date required

### What's working
- `routingIsValid()` — exactly 9 digits via regex — is genuinely checked, and the hint tells the learner precisely where to find it on a real check ("first group of 9 digits along the bottom, on the left"). This verifies shape only: it does not validate a routing checksum, a real bank, or ownership of an account.
- Correctly omits the signature/date fields the other two forms require — this simulated form omits them, and the task doesn't force a pattern where it doesn't apply.
- The completion copy ("Your pay will land in your account each payday. That's all the paperwork — day one is next.") closes the entire 5-level hiring arc with a clear "you're done, here's what's next" signal.

### Concerns / could be better
- None significant.

### Suggested change
- No change.

---

## 43. L20 — Welcome to HQ

**Task:** office-drive — search a nested HQ Drive, find the current Q3 file (not a copy or last quarter's), share view-only

### What's working
- Gates on the specific correct file, and explicitly rejects both wrong files ("Share the current Q3 file, not a copy or last quarter") and edit-level sharing as two separate, separately-worded failure modes — this is Act II's Files task pattern (find the right version, then set the right permission) correctly leveled up for a "much bigger, deeply nested" HQ drive as the level-up copy promises.
- Folder browsing and search both work against the same filtered list, so a learner who doesn't yet trust search can still navigate folders — a good accessibility choice for a level whose whole point is search competency.
- A "that's not part of today's task" handler keeps a large drive from becoming an open-ended distraction.

### Concerns / could be better
- None significant.

### Suggested change
- No change.

---

## 44. L21 — Get Everyone in the Room

**Task:** multi-person-scheduling — find the one time slot open across 4 calendars

### What's working
- Genuinely a step up from L4/L9's two-calendar comparisons: 4 people, 5 slots, and the "busy" bars are per-person rather than a single flag — a slot is only valid if it has zero busy entries across all four, so a slot that works for 3 of 4 people still correctly fails. This is the "new wrinkle" the Act II review asked the calendar skill to eventually deliver, and it delivers it.
- The scenario correctly includes the learner themself among the busy people at one point — reinforcing "your own calendar counts too," a detail worth having given Act I's schedule task built the same habit.

### Concerns / could be better
- Only one slot has zero busy entries and the busy people are named directly next to each time — there's no genuinely tempting near-miss (e.g., a slot busy for only one low-profile person). This is easier than it needs to be for a "capstone-adjacent" moment 21 levels in.

### Suggested change
- Low priority: consider a slot busy for only the least-titled participant as a plausible-but-wrong pick, the way Act I's schedule task uses "right day, wrong time" as a near-miss rather than an obviously-wrong choice.

---

## 45. L21 — Get Everyone in the Room

**Task:** video-call — join the booked meeting late, muted, and ask a question in chat

### What's working
- Checks four real conditions together (joined muted, toggled camera at least once, sent a chat message, never unmuted) rather than just "did something in the call" — this is etiquette actually being graded, not merely simulated.
- The "late and everyone's already talking" framing plus the mic-off default is a well-chosen, realistic first-video-call scenario for someone new to a corporate video-call culture.

### Concerns / could be better
- **Fixed today.** The "never unmuted" flag is still sticky by design (once a learner unmutes, that attempt can't complete until they leave and rejoin — this is the intended lesson consequence, not a bug), but the UI previously never told the learner that. Fixed: the toast shown at the moment of unmuting now states the consequence and the fix directly ("Your mic just turned on — that resets this task. Leave the meeting and rejoin muted to try again."), and a persistent red banner now stays visible in the meeting room for as long as `unmuted` is true — replacing the late-arrival banner — so the instruction doesn't disappear with the toast. The Help lesson's tip line was also updated to say "leave and rejoin" instead of the vaguer "start over."
- The camera-toggle completion also fires as soon as any camera toggle happens after the mic-off + chat conditions are met — not a bug, just worth confirming during playtest that finishing "mid-action" doesn't feel abrupt.

### Suggested change
- Recovery is now explained, but the instructional banner violates the Job Card-only rule. Move coaching to the Job Card and reconsider whether re-muting can be a sufficient recovery; see the learning-value review above.

---

## 46. L22 — The Expense Report

**Task:** expense-report — match 4 of 5 rows to their Drive receipts, flag the 1 row with no receipt, submit

### What's working
- Requires *all four* receipted rows matched AND the missing row specifically flagged — a learner can't skip the matching step and just flag-and-submit. Submitting is also explicitly blocked without the flag first, with a distinct, well-worded failure message for that specific mistake.
- Receipts live in a separate read-only Drive view rather than being listed inline next to the sheet — this correctly makes "go find the receipt" part of the actual skill instead of a lookup table.
- A "that's not part of today's task" handler blocks starting a new blank spreadsheet or opening the wrong one, keeping the task bounded the same way office-drive does.

### Concerns / could be better
- None significant — this is one of the more tightly-scoped tasks in Act VI.

### Suggested change
- No change.

---

## 47. L23 — Presenting to the Team

**Task:** slide-deck — build and "present" 3 slides (title, a real number, a takeaway)

### What's working
- The planted expense total (188) is defined identically in both the expense-report and slide-deck content files, and it correctly equals the sum of the four *receipted* rows from L22 ($24+$42+$48+$74=$188) — so "use the expense total that is already on the slide" is a true claim, not a coincidence-of-copy. The slide requires the learner to *confirm* this number via checkbox rather than retype it, with an explicit warning not to change it — appropriately matched to a level that isn't teaching SUM-formula authoring (that's L7/L10's job; L14 teaches reading IF).
- Requires all four conditions together (title 2+ chars, takeaway 3+ words via a word-count check, total confirmed, actually presented) — a learner can't skip straight to presenting.
- The 3-slide constraint is enforced structurally (only 3 thumbnail slots exist, and each slide gates on completing the prior one first) rather than just being a copy instruction — matches "Do not add a fourth slide" being backed by the actual UI, not just told to the learner.

### Concerns / could be better
- **Source-confirmed:** the cross-file duplication of the planted total (once in each content file, with a comment in slide-deck's copy noting it's "planted from the expense-report receipted total") is a manual-sync risk: if L22's expense-row amounts are ever edited, this constant has to be updated by hand in a second file with no shared import or test tying them together. Low risk today since both are static, but worth a lint/test guard if either file is touched again.

### Suggested change
- Low priority: add a unit test asserting slide-deck's planted total equals the sum of expense-report's receipted rows, so a future edit to one can't silently desync from the other.

---

> [!note] Does the hiring arc read as a believable job search, and is "Applicant" handled consistently?
> As a five-level sequence (posting → application → résumé → interview → offer → paperwork), the hiring arc reads as a coherent, well-paced job search: each step's dispatch copy consistently frames it as "Before HQ," each level-up card explicitly references what just happened and what's next, and the content correctly treats the learner's own prior Harborside role history as their real qualifications rather than inventing a separate fictional résumé. This is the strongest-feeling multi-level narrative arc built so far.
>
> The `preHire` flag drives exactly one place in the UI — the Job Card, which shows "Applicant" / "Solicitante" instead of a job title during L19h1–h5 — and nothing elsewhere in the app (desktop, studio, teacher dashboard, portfolio) contradicts that during these levels.
>
> The hiring arc's task-completion path runs through the exact same generic skill-rung logic as every other task in the game — nothing about these five new levels is special-cased, which reduces the specific stale-catalog risk described in the earlier review: these tasks were added directly to the runtime task list and level map and inherit the corrected, runtime-derived progress mapping automatically.

## Things that can go wrong — Act VI

### L19h1 — Applying (job-posting, job-application)
- **Checking the degree box anyway:** a learner might check every requirement including "Bachelor's degree" out of a desire to look qualified. The pick-check still passes since it only requires 3+ *met* picks, but confirm the degree note actually registers rather than being dismissed as noise.
- **Copying the pre-filled work history verbatim into the "why" field:** the fit/why fields are graded on word count only — watch whether learners paraphrase the posting's own "About the role" text back at it instead of writing something personal.

### L19h2 — Your Résumé (resume-build)
- **Vague bullets that clear the 4-word bar:** "I did my job well" passes the bullet check. Check whether the bullet starters (which model action verbs and specificity) actually get used, or whether learners write the minimum to pass.
- **Skill-checking without evidence:** nothing stops checking a skill never actually demonstrated in-game. Low stakes here, but worth noting if this résumé is ever surfaced to a real teacher as evidence of the skill.

### L19h3 — The Interview (interview-practice)
- **Passing on word count, not content:** six words of unrelated text clears every gate. This is the task most worth watching in playtest — use its existing teacher-review path to evaluate relevance.
- **Ask-back as an afterthought:** a learner could rush through four real answers and then pick the first ask-back option without reading it. Confirm the four choices are distinct enough that picking blind is noticeably worse than reading them.

### L19h4 — The Offer (job-offer)
- **Guessing the date without rereading:** the three choices are plausible-looking (right day, close-but-wrong day, wrong month) — confirm the "second paragraph" hint actually gets learners back into the letter rather than triggering trial-and-error across three clicks.

### L19h5 — New-Hire Paperwork (w4-form, i9-section1, direct-deposit)
- **Signature mismatch confusion:** a learner who signs with a nickname or a shortened version of their display name will be told to match it exactly — check that the error message is enough for them to self-correct rather than guess repeatedly.
- **Meaningless address/DOB entries on the I-9:** since only non-emptiness is checked, a rushing learner could type filler and still pass — this won't surface as a stuck point in playtest, so it has to be caught by review instead (see the Concerns note above).
- **Routing number typos:** confirm the 9-digit requirement's error message is specific enough that a learner who's one digit short knows to recount rather than resubmit blindly.

### L20 — Welcome to HQ (office-drive)
- **Grabbing a plausible near-miss file:** confirm learners can tell "current Q3 file" apart from a copy or a prior-quarter file using only the file name/date shown in the list, without needing to open each one first.
- **Sharing edit access out of habit:** the "Editor" option is visually identical in weight to "Viewer" in the share dialog — check that the dedicated wrong-edit hint actually redirects rather than just registering as a generic wrong answer.

### L21 — Get Everyone in the Room (multi-person-scheduling, video-call)
- **Picking a 3-of-4 slot:** since busy people are named directly on each slot, this is closer to reading comprehension than real conflict-detection — watch whether any learner picks a slot without checking all four names.
- **Getting stuck unmuted (fixed today):** if a learner unmutes to "test" the control, they still cannot pass without leaving and rejoining — but now both the toast and a persistent banner in the meeting room say so explicitly. Confirm in playtest that a learner actually reads the banner rather than dismissing it as background noise.
- **Camera/chat order confusion:** confirm that finishing the task exactly when the last required action lands doesn't feel like the app finished it "for them" without warning.

### L22 — The Expense Report (expense-report)
- **Submitting without opening Drive:** a learner who never leaves the sheet has no way to know which four rows have receipts — confirm the receipts hint is visible before they attempt a blind submit, not only after.
- **Flagging the wrong row instead of the no-receipt one:** the missing-receipt row is visually distinct even before it's flagged — check whether that's a helpful signal or an inadvertent giveaway that removes the "notice it yourself" challenge.

### L23 — Presenting to the Team (slide-deck)
- **Typing a different number "to be safe":** the confirm checkbox explicitly forbids changing the total, but a learner unsure of their arithmetic might want to. Confirm the message is clear that the number is already correct and shouldn't be edited.
- **A takeaway that isn't a sentence:** the sentence check only requires 3+ words — "good team work great" would pass. Watch whether learners write an actual sentence or a word list.

---

# Act VII: Team Lead (capstone)

Cast: Anita Raman. Levels L24–L27.

## 48. L24 — Run the Meeting

**Task:** meeting-minutes — a hub of three parts (agenda, notes during a scripted huddle, follow-up email with owners/dates), completable in any order

### What's working
- Genuinely requires all three parts before completion — the task only marks complete when agenda, notes, and follow-up are all done.
- `followupHasOwnersAndDates()` is real content validation, not a nonempty check: it requires an owner-shaped token (a name, "I," "I'll") AND a day/time token (weekday, "today," "by," a date), with a lenient long-message fallback for phrasing it didn't predict — bilingual, covers both EN/ES day names.
- The scripted huddle gives real content to take notes on, with a 3-person attendee strip, rather than an abstract "take notes" prompt.
- The Help lesson is explicit about the actual point of the level: "If your follow-up email doesn't say a name and a day for each item, the meeting will drift. That one email is the whole point of this lesson."

### Concerns / could be better
- Saving notes is not gated on having advanced through the scripted huddle — a learner can open the meeting view and save notes immediately, without clicking through any of the script lines. The notes-look-real check then only checks for a couple of nonempty lines, with no check that the notes relate to what the huddle actually said.
- The hub is order-independent (matches the L8/triage design pattern), so a learner can write the follow-up email before ever opening the meeting or writing notes — which undercuts the "agenda first, notes during, follow-up after" framing in both the dispatch copy and the Help lesson.
- The owner/day regex fallback could pass a vague but long message that never actually names a person or a day.

### Suggested change
- Keep the lenient content checks — they're well-designed for non-fluent writers. Consider softly nudging (not blocking) toward doing notes after opening the meeting, since the narrative explicitly depends on that order. Watch in playtest whether learners write real huddle content or generic filler in notes.

---

## 49. L25 — The Review

**Task:** performance-review — write one specific strength and one constructive area-to-grow for a profiled team member (Sam Rivera)

### What's working
- The strength-check does real content checking: requires 4+ words AND rejects a blocklist of canned phrases ("good job," "great work," "team player," and their Spanish equivalents) — this is the only task in Act VII with an actual vague-language filter.
- The source comment is unusually candid about its own design tradeoff: it deliberately does NOT try to detect "harsh" tone, since that's unscoreable and a false reject here would be the most damaging in the program — a deliberate, well-reasoned choice given this is described as the most personally vulnerable writing task since the incident report (L3b).
- The profile gives concrete, specific facts to write from (trained two hires, caught a short delivery, chronic lateness) rather than an abstract "write a review."
- Starters model the exact tone the task wants (specific + kind), not generic sentence stems.

### Concerns / could be better
- Asymmetric validation: the strength check blocks vague canned phrases, but the area-to-grow check only checks word count (4+) with no blocklist — a generic, equally-vague answer would pass where an equivalent vague strength would not.
- Neither check requires the writing to reference the actual profile facts — a learner could invent unrelated content for both fields and still pass. Given the deliberate no-tone-grading design, this is likely intentional, but it means the task cannot catch a learner who didn't read the profile at all.

### Suggested change
- Low priority: consider adding a light vague-phrase blocklist to the area-to-grow check to match the strength check's rigor, without adding a harshness/tone judgment. Otherwise no change — the tone-detection tradeoff is already well-reasoned in the source comment.

---

## 50. L26 — Put It All Together

**Task:** ops-report-packet — a 4-app hub (Sheets → Calendar → Docs → Mail): confirm a planted weekly total, note a calendar item, write a summary naming both, send it as one packet to Anita

### What's working
- Explicitly designed (per source comment) to teach zero new mechanics — "There is no new skill here... The only new part is doing all four in a row and sending them as one thing." A deliberate, well-labeled capstone-by-composition, not a hidden new-skill task.
- Genuinely requires all four sub-steps (sheet total confirmed, calendar noted, summary pulls both, packet sent) — sending is blocked until the first three are done.
- The attachment on the final email is conditionally rendered only once the summary is saved — a small but real detail that reinforces the summary must exist before it can be "attached."
- The read-only Sheets grid renders the actual SUM formula for the total row, keeping the "trust the tool's math, don't retype it" lesson from L6 consistent here.

### Concerns / could be better
- The "synthesis" is scenario-level, not data-level: the planted total, sheet rows, and calendar event are all freshly scripted for this level, not pulled from the learner's own earlier gameplay (unlike `portfolio-reflection`, which genuinely reads the learner's earned tracks). A learner won't recognize this total or this calendar gap from their own history — the callback is to the *skills* (reading a sheet total, noticing a calendar gap, writing a number-bearing summary, sending mail), not to *their own prior work*. Worth confirming this framing distinction doesn't overpromise in the Help lesson.
- The summary-content check only requires 12+ words and any digit somewhere in the text — it doesn't check that the digit is the actual total or that the calendar item is named. A learner could write 12 words containing an unrelated number and still pass.
- The hub items aren't order-enforced beyond per-item done checkmarks, which somewhat mitigates a learner losing track of what's left.

### Suggested change
- Keep the current structure — it's a well-scoped, source-verified synthesis task. Consider tightening the summary check to require the actual total or its digits specifically, since "did they report the right number" is the one thing this task doesn't currently verify (echoes the same gap already flagged for `spreadsheet` in L6 and `status-report` in L7).

---

## 51. L27 — Where You've Been

**Task:** portfolio-reflection — review every award earned across the whole program (genuinely pulled from real progress data), answer 4 open reflection prompts

### What's working
- This is the one place in Act VII that's real, not scripted: the awards list renders the learner's actual earned tracks by act, so the "everything you've done" screen is a genuine record, not a fictional scenario.
- The source comment is explicit and honest about scope: "Teacher-check in name only... Nothing here is graded" — matches the completion check, which only requires each of the 4 answers to have 3+ words. This is correctly framed as reflection, not assessment.
- The prompts are well-chosen and non-leading ("What are you still building confidence in?", "What would you tell a friend thinking about starting this program?") — genuinely open, no wrong answers, consistent with the stated design intent.
- The completion flag and earned awards survive reload, but reflection answers do not rehydrate: `PortfolioReflectionTask.tsx` initializes them to empty strings on mount. Writing is submitted for teacher review, but the learner view does not load it back. After reload, copying the summary can therefore omit all four answers.
- **Fixed today:** a "Copy summary to share" button now assembles the awards list and reflection answers into plain text and copies it to the clipboard, with feedback through `useNudge().say()` telling the learner to paste it into an email or message. The "share it with whoever's useful" copy is now something the app can actually deliver, not just say.

### Concerns / could be better
- The end-of-program moment reuses the same "clock out vs. keep going" mechanism used for ordinary day boundaries elsewhere in the game; distinctiveness comes entirely from the copy ("The last day of the program"), not from a different completion experience. This is a minor, low-priority polish item, not a functional gap.

### Suggested change
- The copy button closes the immediate sharing gap, but restoring saved answers is still needed for a durable take-away artifact. Also check the copied skills and act names in Spanish: `copySummary()` uses the unlocalized `SKILLS` and act title values. Low priority: consider a visually distinct final-completion moment, separate from the reused day-boundary UI, given this is the only level in the game where "stopping point" means "the whole curriculum," not "today." Playtest the clipboard button on a device without clipboard permission granted, to confirm the fallback message is helpful rather than confusing.

---

> [!note] Does Act VII earn its capstone billing?
> Partially, and by explicit design rather than accident. `ops-report-packet` (L26) is the one level that mechanically synthesizes prior skills — reading a sheet total (L6), noticing a calendar item (L4/L9's "check X against Y" pattern), writing a number-bearing summary (L7), and sending a packet email — but the *data* in that synthesis is freshly scripted for the level, not literally pulled from the learner's own earlier play, so the callback is to skills, not to personal history.
>
> `meeting-minutes` (L24) is a mechanical evolution of L11's team-meeting (creating an invite + agenda) into actually *running* the room and closing the loop with an owners-and-dates follow-up — a real skill escalation, not a repeat.
>
> `performance-review` (L25) and `portfolio-reflection` (L27) are not skill-synthesis tasks at all — they're the act's emotional/narrative capstone (writing about someone else fairly; looking back at yourself), and L27 in particular is the one task in the entire act built on genuinely real learner data. That's a reasonable capstone shape: one level that stacks mechanics, one that extends a specific mechanic, and two that close the story — rather than four tasks each independently re-testing five acts of tools.

## Things that can go wrong — Act VII

### L24 — Run the Meeting (meeting-minutes)
- **Notes without listening:** a learner can save notes before advancing through any of the scripted huddle lines; the notes check doesn't verify the notes reflect what was actually said. Ask the learner what each attendee agreed to after they finish.
- **Order-skipping breaks the narrative:** the hub lets a learner write the follow-up before ever opening the meeting or agenda — check whether this confuses the "agenda → notes → follow-up" story the copy tells.
- **Regex false accept/reject:** the owners-and-dates check can accept a long-enough vague message with a colon, or reject a short-but-real answer that doesn't use a predicted day-word. Watch both directions in playtest.

### L25 — The Review (performance-review)
- **Vague area-to-grow slips through:** unlike the strength field, the area-to-grow field has no vague-phrase check — a learner can write something equally generic and pass.
- **Unrelated content passes:** neither field is checked against Sam's actual profile facts; a learner who didn't read the profile can still pass with invented content.
- **Emotional difficulty:** this is explicitly the most personally vulnerable task in the game (per source comment) — watch whether the vague-strength rejection message ever bounces a valid answer phrased unexpectedly.

### L26 — Put It All Together (ops-report-packet)
- **Wrong-number summaries pass:** the summary check only checks for any digit, not the correct total — a summary with an unrelated number still completes the task.
- **Scenario, not personal history:** the "everything together" framing is about skills, not about the learner's own remembered numbers/events — confirm the Help lesson doesn't overstate this as pulling from their own past work.
- **Losing the thread across 4 apps:** confirm the hub's done-checkmarks are enough for a learner to find which of the four remaining steps is unfinished after bouncing between apps.

### L27 — Where You've Been (portfolio-reflection)
- **Fixed today:** the copy's sharing invitation is now backed by a real "Copy summary to share" button. Confirm in playtest that learners notice the button and understand what "paste it in an email or message" means if they've never copied text on a phone before.
- **Anticlimactic ending:** the final "clock out" choice is visually identical to every mid-program day-boundary; only the copy signals this is the whole program ending. Watch whether learners register that they've finished.
- **Open-ended by design:** the completion check only requires 3+ words per answer — this is intentional (stated in source), not a bug; no action needed here.

---

# Suggestions for all levels

A single prioritized list across all 37 levels, pulled from the 51 task reviews above. Ranked within each group by how much it matters, not by level order.

## 1. Highest playtest priority

- **Fixed today:** L21's `video-call` (Act VI) could trap a learner with no visible way out — once unmuted, the "never unmuted" flag stayed true for that attempt with no on-screen explanation of the fix. Now both the immediate toast and a persistent in-room banner state the consequence and the recovery ("leave and rejoin muted") directly. Still worth confirming in your playthrough that this reads clearly to an actual learner.
- **Today's Act I changes (L0, L3) are automated-verified but not yet human-playtested.** The new pre-tour welcome screen, the required drag-to-corner practice, and the restructured Day-3 clock-in scenario are all real, substantial changes to the first hour of the game — exactly the part of the game most likely to determine whether a new learner keeps going. This is already queued as your next step per `codex_revisions.md`; nothing here changes that priority, it just confirms it's still the right next move.
- **Fixed today:** Act V Path B's two easier-than-intended tasks — `billing-sheet`'s mismatch cell no longer highlights red until the learner has actually selected that row, and `appointment-scheduling` no longer labels every slot "Booked"/"Open" up front; both now require a click to reveal status, matching the "check first" pattern used everywhere else in the game. Playtest to confirm the reveal-on-click interaction reads clearly.
- **Fixed today:** `portfolio-reflection` (L27) promised the learner could "share it with a friend, an employer, an advisor" with no way to actually do that. Added a real "Copy summary to share" button that copies the awards list and reflection answers to the clipboard as plain text, so the promise is now something the app can deliver.

## 2. Validation gaps — completion checked more loosely than the stated skill

These follow one consistent shape: a task's own lesson/dispatch copy claims a specific check ("say why it's wrong," "in order," "confirm you understood") that the code doesn't actually enforce. Two rows below were fixed today (struck through, kept for the record); the rest are still open. None of these block a learner from finishing; all of them mean a completion badge claims more than was verified.

| Level | Task | Gap |
|---|---|---|
| ~~L6~~ | ~~spreadsheet~~ | **Fixed today.** Sending now requires the message to state the correct total (`emailMentionsTotal()`), mirroring L9/L10's pattern. |
| L10 | formula-check | The send-check accepts a vague message (matches "range" or "sum") without the corrected total — looser than L9's AND-based check for the identical multi-part communication pattern one level earlier (L9 checks a day and time, not a spreadsheet total). |
| L7 | status-report | `body.includes(String(STATUS_TOTAL))` checks a substring, not a numeric token; an unrelated larger number containing the total can pass. |
| L14 | budget-sheet | Labor + “over” passes without an amount, despite the report-how-much objective. |
| L17 Path B | patient-intake | Refusal signal accepts “sorry”; finite leak keywords do not make the response leak-proof. |
| L19h4 | job-offer | Eight words do not verify acceptance or restating the selected start date. |
| L24 | meeting-minutes | No per-action owner/date check; a twenty-word message with a colon or dash bypasses owner/day matching. |
| L26 | ops-report-packet | The summary check only requires 12+ words and *any* digit — a summary with an unrelated number still passes; doesn't verify the actual total or that the calendar item is named. |
| L25 | performance-review | The strength field blocks vague canned phrases; the area-to-grow field has no equivalent blocklist, so an equally vague answer passes there but not in the sibling field. |
| L19h5 | i9-section1 | Date-of-birth and address fields only check non-emptiness, despite a source comment describing the task as checking "the format." |
| ~~L19 (Path B)~~ | ~~confidentiality-call~~ | **Fixed today.** `PhoneDesk` is now a free-text compose step wired to the existing `replyIsSafe()` validator, instead of three pre-written buttons — the harder version that was already built is now what ships. |

## 3. Free-text tasks with no teacher-review path

**Fixed today.** `mail-etiquette` (L3a), `call-out-sick` (L3a2), and `incident` (L3b) are now all in `TEACHER_CHECK_TASKS` (`src/lib/curriculum-catalog.ts`), so a teacher can actually read what a learner wrote in all three. The two mail tasks also gained real content checks — `mailEtiquetteAnswersDarnell()` requires the reply to actually name the storage room, and `callOutSickSaysCannotAttend()` requires stating inability to attend today's shift, not just "I'm sick." `incident`'s narrative check now requires stating both an injury-status fact and an action/notification, replacing the old 15-character-minimum check, and teacher visibility now supports reviewing chronology, although automatic completion still does not verify it.

The three named tasks now have content checks and teacher-review eligibility. This does not establish universal writing assessment: early low-stakes mail and some short fields intentionally use minimal checks. Submission capture and a completed human review must be verified separately.

## 4. Copy / documentation drift (not learner-facing, but worth a cleanup pass)

- `curriculum/00-scope-and-sequence.md` correctly labels Act VII 24–27, but its Act VI 20–23 outline omits the five hiring levels. Its built-status prose and README's 15-built/24-total claims are also stale relative to 37 runtime levels. Use `tracks-content.ts` for implemented structure.
- `curriculum-catalog.ts` still describes L6 (`spreadsheet`) as "flag one that's wrong" — the shipped task checks transcription against five supplied amounts, with no deliberate bad-source-slip step. Align the description rather than building a new puzzle to match stale copy.
- Two completion badges collide on the same number: `college-offer` (L13) and `priority-call` (L12) both render `badgeNumber="16"`; `budget-sheet` (L14) renders `"17"`. Worth a repo-wide check of every `badgeNumber` prop for other duplicates in one pass rather than fixing these two in isolation.

## 5. Pacing: the "check X against your own calendar/schedule before agreeing" skill

Related comparison skills recur, but they are not seven identical puzzles. L2 and L4 compare personal availability; L9 allocates coverage using availability and hours; L11 authors an invite; L12 synthesizes coverage and rescheduling; L21 compares four calendars. L3's timeclock task instead compares recorded and scheduled start times. L8's triage and L13's class commitment also reuse conflict handling. Evaluate the new decision and support level in each appearance rather than assigning inconsistent ordinal counts. L11–L12 are adjacent; other repetitions can also be close together, so the earlier claim of an act of separation was incorrect.

## 6. Strong patterns to retain, with limits

Retain the live formula evaluation in `formula-check`, the audience/draft/content gates in `reply-all`, and the multi-step file and receipt workflows in `office-drive` and `expense-report`. `team-schedule` is a staffing comparison task, not a formula-authoring task. All keyword validators, including `priority-call` and `patient-intake`, need false-accept and false-reject checks; none should be copied as a guarantee of semantic accuracy or confidentiality.

---

# Complexity roadmap

The editorial Challenge estimates suggest a pattern, not a measured difficulty curve: difficulty oscillates between 2 and 4 for almost the entire game, with three levels (L12, L24, and L25) rated 5. There is no sustained rising curve across 37 runtime levels — each act recycles the same difficulty band with an occasional capstone spike. The six ideas below add real complexity without adding stress, jargon, timers, or punitive failure states — all of which would cut against the plain-calm-bilingual, no-jargon design this game has been consistent about everywhere else. Each is tied to specific levels so it's actionable, not abstract.

### 1. Let choices carry forward instead of resetting each level

Almost every task is self-contained today — a wrong pick in L9 has no echo in L12, even though L12 explicitly reuses L9's mechanic. A later level's inbox could reference an earlier mistake lightly ("Following up on the schedule mix-up from last week…") without blocking anything — it just makes the world remember the learner. Lowest-risk place to try this first: **L21 → L26** (multi-person-scheduling → ops-report-packet), since both already sit in the same HQ/Anita storyline and L26 is explicitly designed as a synthesis capstone with no new mechanics — a factual callback would need saved state and careful replay/reset behavior.

### 2. Introduce real ambiguity — situations with more than one defensible answer

Many selection tasks have one keyed target with decoys; writing, reflection, and prioritization already allow multiple defensible responses. `priority-call` (L12) already gestures at graded reasoning with its urgency-justification field, but it's validated as a 12-character minimum — any text passes. Strengthening that one field (require it to reference one of the three actual competing situations, per the existing Suggested Change for L12) is a safer first step than inventing a new "two good answers" task from scratch. Once that pattern is proven, `performance-review` (L25) is the next-best candidate — it already documents a deliberate no-tone-grading tradeoff, and its area-to-grow field is a natural place for teacher feedback on reasoning and evidence.

### 3. Turn "order doesn't matter" into "order sometimes matters, and here's why"

L8 and L12 explicitly allow their internal work items in either order; L26 also permits flexible navigation. This does not mean every task or every action in L21 is order-independent. These flexible hubs reflect a deliberately gentle design choice, and the right default. Rather than touching any of those, a *new* moment late in Act VII (after L26, before or alongside L27) could be the one deliberate exception, explicitly framed as a lesson rather than a trap: "This time, order changes the outcome — replying before checking the schedule means promising something you can't deliver." Placing it last means every earlier level's promise ("the only real mistake is forgetting one") stays true everywhere it was made.

### 4. Let validation strength do the escalating, not new content

This is the cheapest lever, and it's already half-built — free-text checks go from pure non-emptiness (L1) → AND-based content checks (`team-schedule`, L9) → three-layer checks (`reply-all`, L15) → canned-phrase blocklists (`performance-review`, L25). That arc isn't consistent yet. The validation-gaps table in the closing section above is effectively a ready-made to-do list for this: tightening `ops-report-packet` (L26), `i9-section1` (L19h5), and `interview-practice` (L19h3) to match the rigor already proven at L9/L15/L25 could improve evidence of the target skill, but requires bilingual acceptance/rejection tests, revised hints, and playtesting. Stricter regexes alone are not a reliable measure of learning.

### 5. Add a revise-and-resubmit loop somewhere in Acts VI–VII

The app already supports teacher feedback and repeat writing submissions: `markComplete()` records writing before its already-completed guard. A mandatory, scripted in-task revision would be an extension of that existing pathway. `performance-review` (L25) is the best candidate: after the first submission, Anita (or a placeholder "reviewer" step) sends back one specific, plain-language note on the current draft, and the learner revises once before it's actually sent. Frame it explicitly as normal process — "First drafts get notes. That's normal here." — never as a failure state, and cap it at one revision round so it doesn't become a new source of stuck-ness.

### 6. Scale down scaffolding as acts progress, rather than scaling up difficulty

Sentence starters and generous hints are appropriate early (L1, L3a, L3a2) and don't currently taper by design — the same starter-and-hint density is present as late as `interview-practice` (L19h3) and `meeting-minutes` (L24). A felt difficulty increase that reads as growth rather than punishment: fewer or no starters by Act VI–VII, and hints that ask a guiding question ("What does Anita need to know to act on this?") instead of naming the answer outright. The project already has a performance-based release ladder (`release-ladder.ts`). Audit how each later task consumes it before adding act-based fading; preserve access to Help and bilingual support. Changing starter visibility may require UI work, so this is not necessarily a copy-only pass.

### What to avoid

Timers or countdown pressure, jargon-dense scenarios, and punitive failure states (locking a learner out, losing saved progress) all raise difficulty through stress rather than through understanding — none of the six ideas above use any of them, and none should be added later without weighing that tradeoff explicitly.

---

*Historical records, not duplicated here: `scratchpad/act-1-review.md` (the original Acts I–II review this document supersedes) and `scratchpad/codex_revisions.md` (the implementation log for today's Act I changes).*
