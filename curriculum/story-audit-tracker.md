# Story Mode Audit: fix tracker

Source: the Story Mode Audit (27 Sep 2026), 42 sittings on 4 routes.
Baseline: **0 clean · 30 friction · 9 block beginners · 3 broken.**
**Scope: Story mode only.** Shared task controls may also appear in standalone lessons; lesson checks are incidental regression coverage, not evidence that a Story sitting has been audited. Review realism in the story context: why this person needs the work, which app they would use, the actual app controls, the decision, and the handoff.

## Narrative direction confirmed by the owner · 28 September

There are no prescribed dates or maximum story duration. The story may span months or years. Audit the logical progression of work and learning, not adherence to the existing August–October 2026 fixtures. Numbered sittings indicate learning sequence, not consecutive employment days.

- Allow credible time to gain experience before added responsibility, promotions or a job change. Explain time jumps in bilingual chapter/arrival copy.
- Establish why each task matters now, what prior work it uses, and who receives the result. Use ordinary workplace tools and workflows.
- Keep dates internally consistent where they affect a decision: availability, deadlines, payroll periods, offers, forms and reports. Historical records may predate the current scene; that alone is not a continuity error.
- Retiming must update the scene and its related documents together. Do not add “months later” while the visible calendar still advances one week.
- Preserve the original audit calendar as historical evidence, clearly labeled, rather than as the desired schedule.

**Open pacing follow-up:** PR #44 fixed contradictory/backward dates. It did not establish credible elapsed career time. The current fixtures run from August 17 to October 16, 2026, including a first HQ day on October 6 and a Team Lead chapter on October 12. Review the café experience, hiring transition and especially the HQ-to-lead transition before closing narrative continuity. Choose elapsed time from the story needs; no exact replacement dates have been requested or approved as a requirement.

**Routing (28 Sep):** Dev: #1–4, #7, #16, #19. Content: #10, #11, #15. Dev leads with content: #5, #6, #8, #9, #14, #17, #18. Content leads with dev: #12, #13. Friction type: #12 and #13 are mainly intentional (pedagogical) friction that needs refining; #18 is mixed; the rest are unintended UI/UX friction.

The finding numbers below are the audit's own. This file is the one place that says what is left.

**How it runs**
- **Wave 1:** small fixes that reach many learners, done one PR at a time.
- **Wave 1 (done):** #36–#40. **Wave 2 (done):** #41, #44, #45, #46.
- **Waves 2–3:** parallel streams. Each stream owns its files, so streams do not edit each other's files.
- **Wave 4:** new content for the gaps in real-world practice.
- **Tests:** sentence-level evidence lives in `src/lib/__tests__/fixtures/story-audit-sentences.ts`. `e2e/job-card-overlap.spec.ts` guards finding #2.

Status: `todo` · `in progress` · `PR #n` · `done` · `won't fix (why)`

## Numbered findings

| # | Finding | Severity | Wave · stream | Status |
|---|---|---|---|---|
| 1 | Story emails never arrive on College, Front desk, and Office (`activeMailTaskFor` ignores the route) | High | 1 · PR 2 | done · PR #37 |
| 2 | Job Card covers the button to press at 100% zoom in 20+ tasks | High | 2 · A | done · PR #45 |
| 3 | No Job Card after "Start Act IV" or "Start Act VII" | High | 1 · PR 3 | done · PR #38 |
| 4 | Both clinic privacy tasks pass a leak | High | 1 · PR 4 | done · PR #39 |
| 5 | Writing checks reject honest beginner English and accept wrong answers | High | 2 · B | done · PR #41 |
| 6 | Three of four route endings give nothing to keep; the README still describes the certificate | High | 2 · D | done · PR #46 |
| 7 | Day 12 Job Card button loops back to the finished task; typing 61 shows `#ERROR?` | High | 1 · PR 5 | done · PR #40 |
| 8 | Story time runs backwards after payday; shift times disagree | Medium | 2 · C | done · PR #44 |
| 9 | Route chooser under-explains the choice; "Change direction" is always one tap away | Medium | 3 · E | local: every audit fix bullet verified or fixed (28 Sep close-out); browser check at 100%/150% pending |
| 10 | Route copy assumes Stay-and-lead; no reason given for leaving the café | Medium | 3 · E | local: every audit fix bullet verified or fixed (28 Sep close-out); browser check at 100%/150% pending |
| 11 | Who "you" are keeps slipping ("your shift lead", Jordan, "Simulator", Robin, name slips) | Medium | 3 · F | local: all 9 audit fix bullets verified or fixed (28 Sep close-out); browser check pending |
| 12 | Supervisor judgment tasks contradict their data or state the answer (Days 13, 16, 17, 32) | Medium | 3 · F | local: all 5 audit fix bullets verified or fixed (28 Sep close-out); browser check pending |
| 13 | Help fades by giving answers; instructions leak out of the Job Card | Medium | 3 · G | local: all 13 fix bullets verified or fixed, full in-page instruction sweep done (28 Sep close-out); owner decision on "name each requirement" test; browser check pending |
| 14 | Reload loses the arrival card and drafts; "Clock out for today" means sign out | Medium | 2 · A (rename, focus) + 3 · G (persistence) | part done · PR #45 (button renamed); local: all 5 bullets verified or fixed (backdrop click no longer dismisses; Escape continues; Spanish button says work is saved); browser check pending |
| 15 | Spanish: the card names bookmarks that aren't on screen; the learner's gender changes; calques | Medium | 3 · I (last) | local: all 8 fix bullets verified or fixed; `spanish-pass.test.ts` guards bookmarks, gender and calques; Spanish-first browser replay pending |
| 16 | Learners are pointed at Studio (which can wipe progress); staff notice shown at sign-in | Medium | 1 · PR 1 | done · PR #36 |
| 17 | Act I on-ramp makes skipping the loudest choice and overclaims | Low | 3 · H | local: fix list verified or fixed except the practice-link prominence (pending); browser check pending |
| 18 | Smaller tool mismatches (no link to copy, Drive search, camera step, hiring outside Mail) | Low–Med | 3 · H | local: all 9 fix bullets verified or fixed ($$188, HQ card names the file, camera step on card, Jobs posting reachable, no confetti on problem days); browser check pending |
| 19 | Arrival card doesn't take focus; keyboard friction | Low | 2 · A (card focus) + 3 · H (the rest) | part done · PR #45 (card focus); local: all 7 bullets verified or fixed (arrow-key line in Help; one Tab stop for read-only, budget and billing grids); browser check pending |

## "What the app says it proved" (claims vs. checks)

Two fixes apply to each row:
- **B:** tighten the check.
- **B, praise:** make the praise describe only what the task actually checked.

| Claim | Fix | Status |
|---|---|---|
| "You know how this computer works" (tour) | H: "You found your way around" | local implementation · Story first-session verified |
| "You left Maria a clear note" (Day 3) | B: require the times | done · PR #41 |
| "Net pay and hours look right" (Day 6) | G: remove the circles · H: compare hours with the time clock | local implementation |
| "Counts toward Office Ready…" (Day 7) | B: incident check | done · PR #41 |
| "Create a meeting with an agenda" · "Handle three asks at once" | F: real choices | local implementation · triage Story check passed |
| "Core course complete" (Stop here) | D: summary at Stop here | done · PR #46 |
| "You found the deadline" (Day 21 A, skipped in code) | B: check the deadline step | done · PR #41 |
| "Tell a credible source…" (blurbs label themselves) | G: neutral blurbs | local implementation |
| Thuy: "You did not share the visit" | PR 4 | done · PR #39 |
| "Four honest answers…" (interview) | B | done · PR #41 |
| "Run the meeting…" · "who owes what by when" | B: wire up `followupHasOwnersAndDates` | done · PR #41 |
| "Write a fair review" | B: light check on the growth line | done · PR #41 |
| "Send the weekly report packet" | B + H: no empty email; the calendar event must be opened | PR #41 plus local event-detail/amount checks · Story capstone verified |

## Per-act notes not covered above

Assign each note to the stream that owns its file during the Wave 3 sweep. Copy each one here as a row when it is picked up.

| Where | Note | Stream | Status |
|---|---|---|---|
| Server | `recordCompletion` can insert the same task twice when a save is retried under a slow server; historically only `mail-reply` was guarded | 3b · follow-ups | local fix extends transaction guard to all tasks; concurrent retry test added |
| Day 3, Day 6 | Level-up body text still says "Clock out for today." above the renamed "Stop for today" button | 3 · G | local: fixed, none left in either language |
| College, Front desk ends | Final note says "Monday, Anita needs you at HQ" on routes that never go to HQ | 3 · E | local: fixed; ending emails now close each path calmly |
| Any task | A main "way forward" button with neither `data-showme` nor `data-card-avoid` can end up under the Job Card after it moves; mark them as tasks are touched | all streams | ongoing |
| Billing, intake, research | Sentence starters include a chip in the other language | 3 · H / I | local: verified, all chips in the page language |
| `src/exportable-workspace/fixtures.tsx` | Demo still shows August dates | 3b · follow-ups | done locally: August dates match Act I (kept); corrected the same $8 Social Security/Medicare error to $55.08, net $571.32; pay-stub list shows only the Aug 28 first paycheck |

## Wave 4: transfer gaps (new content)

Design doc first; build one PR per gap family. Owner decision (28 Sep): each family is a required step inside an existing level, not an optional round.

| Gap family | Status |
|---|---|
| File confidence: download, find, upload, rename or move, print or save as PDF | merged, [PR #51](https://github.com/marlanamc/workplace-simulator/pull/51): Day 10 gets `upload-schedule` (download from Mail, upload into Schedules). Rename is already in `files`. Open: a `lesson` block, Print/Save as PDF, keyboard and 150% passes, and the Job Card over the picker preview at 911×512 |
| Recovering from everyday problems: closed window, no Wi-Fi, Undo, reload, permission pop-up | merged, [PR #52](https://github.com/marlanamc/workplace-simulator/pull/52): Day 7 Wi-Fi off → reload, Day 12 Delete → Undo, Day 13 close the browser → reopen. Permission pop-ups are out of scope until a task needs one |
| Work communication beyond email: manager text, voicemail, invite reply, doc comment, chat | in progress on `feat/wave-4-communication` |

## Closing checks

- [x] `e2e/job-card-overlap.spec.ts` is un-`fixme`'d and passes at both sizes (PR #45).
- [x] An act-boundary play-through e2e passes (VI→VII in `e2e/act-boundary-card.spec.ts`; III→IV is a unit invariant in `act-boundary-handoff.test.ts`).
- [x] Every sentence in `story-audit-sentences.ts` is graded the way it says (`clinic-privacy.test.ts`, `story-audit-grading.test.ts`).
- [ ] Re-run the audit's segment method and compare the tallies with the **unified** baseline (0 clean · 23 friction · 16 block · 3 broken), using the grading standard in `story-replay-2026-09-28.md`: one severity rule for non-obvious UI obstacles, separate UI/UX and learning-challenge verdicts, and the Clean Pass criteria.
- [ ] Real-learner pilot sessions (`launch-pilot.md`).

## 28 Sep follow-through (local working tree)

- Baseline: lint, TypeScript and 2,212 unit tests passed. Merged fixes #1–8 and #16 are present; browser results are recorded below.
- #9–10: route previews and confirmation; correct 7/4/13/4 story-day lengths; completed options disabled; separate College/clinic orientation and arrival copy; route-neutral office experience and optional HQ ending bridge.
- #11–12: implementation in progress; do not count as closed yet.
- New overlooked issue: `public/sw.js` cached signed-in HTML as the offline fallback and cached mutable development chunks. Replaced with a public bilingual offline fallback, stopped script caching, restricted cache cleanup to this app, and disabled its worker in development. `offline-cache.test.ts` verifies private HTML and scripts are not served from that cache.
- Original audit HTML is being updated alongside this tracker; historical tallies stay unchanged until a comparable rerun.

### Implementation details and remaining work

- #11: Renata/handbook/intake name corrections, distinct patient Morgan, applicant badge, fictional Robin paperwork bridge, earned story roles for résumé, and personalized award letter.
- #12: Thursday meeting moved to 4:15 PM with crew shifts visible; cover-person availability shown; triage now compares both calendars; expense matching uses actual receipt selections and a receipted total.
- #13: removed always-on paystub circles, copy-task strip, new-tab directives and confidentiality script; reduced hub coaching; bookmark onboarding appears once. Source metadata replaces the research blurb's “No sources” verdict. Continue the full instruction sweep, including repeated handoff feedback.
- #14: arrival and targeted drafts (meeting notes, résumé, interview notes, slides, huddle, triage) persist on the same device under learner-specific keys. Lessons stay in memory. Replay and Studio clear the affected drafts. This does not promise cross-device draft sync.
- #15: localized missing bookmark names, neutralized selected gendered copy/calques, incident defaults follow language, removed mixed-language starter chips, and added a language switch inside arrival cards. A full Spanish-first replay is still needed.
- #17: the notice is the blue practice action, Skip is secondary, and wording consistently says notice; reduced tour completion claim. Native scrollbar behavior still needs device observation.
- #18: copyable simulated schedule URL required in the email; normalized HQ search and empty state; corrected Chris's initials; explicit camera instruction; award-letter return button; weekly amount entry and event-detail confirmation; practice password enforced; paid hours compared with the corrected time record. Interview preparation, the offer and paperwork now arrive as actionable Mail messages. Arrival opens Mail; the message opens the document. Reading alone does not award completion. English and Spanish browser checks pass.
- #19: bookmark skip link, shared compose focus and I-9 input names are implemented locally.
- Wave 4: [teaching design and release gates](design/story-transfer-practice.md), not new shipped Story activities.

Validation is recorded in the audit HTML's current working pass. Merged status and the original 42-sitting tallies are not changed by local implementation. Remaining closure requires the complete regression run, comparable segment replay, and real-learner pilot.

### Workplace realism follow-through

- Budget IF now says **within budget** for spending at or below the budget; equality is no longer mislabeled “under.” Both languages and formula examples agree.
- Story Sheets tasks (tips, corrected formula, budget, billing comparison, status report) use **File → Email → Email collaborators** instead of invented task-specific email buttons. Source: [Google Sheets collaboration help](https://support.google.com/docs/answer/9331169?hl=en). The menu is a simplified simulation of that actual path.
- New task regressions now enter Story through isolated TEST-E2E accounts and Studio day starts, including arrival and Job Card. The report now shows a Story Day 32 screenshot; the earlier lesson image is retained only as a historical shared-control check.
- A prepared tracking sheet with editable numeric cells and a SUM is reasonable beginner work. No claim that entering numbers proves formula authoring. Receipts use a prepared reconciliation template; its custom submission remains a transfer limitation to review.

### Validation checkpoint · 28 September

- `npm run check`: lint, TypeScript, **55 test files / 2,224 tests passed**.
- `npm run build -- --webpack`: passed. Default Turbopack failed to start its local CSS worker; no application compiler error remained with webpack.
- `E2E_PROD=1 npm run test:e2e -- 'e2e/(?!lesson).*spec.ts' --workers=2`: **57 passed / 1 failed**. Failure was the new budget test looking for an unused headline; the report had sent and the next Story arrival was visible.
- After correcting that assertion, `E2E_PROD=1 npm run test:e2e -- e2e/audit-followthrough.spec.ts --workers=1 --output=/tmp/story-realism-final`: **4/4 passed**. No source changes after the tested production build. All 58 Story checks have passing results across these runs; a single all-green full run was not repeated.
- Story expense and budget screenshots are in the audit HTML. The expense test now operates without manually moving the Job Card; its table and total are protected from overlap.
- The audit is still open: complete the instruction/Spanish replay, then run the comparable 42-sitting audit and learner pilot. Wave 4 remains a Story design proposal. Exportable-workspace fixtures are not imported by the Story tasks and remain outside this pass.

### Hiring follow-through · 28 September

- Days 27–29 start in Mail with Anita’s invitation, offer and practice-paperwork messages. They arrive only at the matching Story task and remain in earned history. Standalone lessons do not receive these messages.
- Typed interview answers are now explicitly **preparation notes**. The offer arrival explains that the interview happened between story days; saving written notes no longer claims a spoken interview was completed. Interview answers and the learner’s question persist locally.
- `npm run check`: **56 files / 2,228 tests**, lint and TypeScript passed. Webpack production build passed.
- `e2e/story-hiring-mail.spec.ts`: **2/2 passed**, covering all three handoffs in both languages plus interview draft reload. The first attempt exposed a test omission: the Studio arrival query reappears after reload, so the test must dismiss that arrival before using bookmarks. No product source change was needed for that test correction.
- Full Story regression on the hiring build: **60/60 passed** in 2.9 minutes, including the 100% and 150% overlap checks. Command: `E2E_PROD=1 npm run test:e2e -- 'e2e/(?!lesson).*spec.ts' --workers=2 --output=/tmp/story-audit-hiring-regression`.
- Interview coaching now lives in Job Card Help, with individually labeled answer fields and a named custom-question field. Duplicate résumé and shift-swap directions were removed. Factual schedule timezone text stays visible. The bilingual hiring test checks that coaching is hidden until Help, Help returns without losing notes, and reload preserves the draft.

### Pay-stub realism correction

The original screenshot also showed an overlooked payroll error: $8 for Social Security/Medicare on $720. Corrected the sample to **$55.08** using employee rates of 6.2% and 1.45%, and corrected net pay from $618.40 to **$571.32** after the existing illustrative federal/state withholdings. Portal and EN/ES answer choices agree. Source: [IRS Publication 15 (2026)](https://www.irs.gov/publications/p15). This is a fictional pay-stub reading exercise; its income-tax withholdings are sample amounts, not a withholding calculator. An arithmetic regression now checks deductions, net pay, portal value and both language answer choices together.

Validation after the pay-stub correction: lint, TypeScript and **2,229 tests / 56 files passed**; webpack production build passed. The 60/60 Story suite was on the immediately preceding hiring build. The only subsequent runtime change was pay-stub numbers; its PDF, portal, answer choice and accepted net-pay answer were inspected through Story Day 6.

### Instruction cleanup checkpoint

Lint, TypeScript, 2,229 unit tests and the webpack build passed after interview/résumé/swap cleanup. Focused Story browser coverage passed **10/10**, checking hiring Help/draft recovery in EN/ES and the first-session/swap flow. Follow-up cleanup removed duplicate directions from the pay-stub list, financial-aid letter tile, Drive rename/Make a copy dialogs, and portfolio reflection intro. Required filename instructions are explicitly reported to the Job Card during each dialog; the copy-name, rename and reflection fields now have accessible names. Authentic source documents, portal status, schedule timezone text and award history descriptions remain visible.

The follow-up dialog cleanup passed lint, TypeScript, all 2,229 unit tests, and the webpack build. Targeted Story browser checks passed **9/9**: the copy-to-status-report handoff (including the required filename in the Job Card), decision practice, portfolio download and route endings in EN/ES. This is source-level cleanup plus targeted flow verification, not a replacement for the comparable 42-sitting replay.

### Continuous hiring replay

Added and passed two Story progression tests (EN/ES): prepare all four interview answers and a question, save, continue into the offer through Mail, choose the wrong start date, recover using the Job Card correction, accept with a short reply, then continue into Robin’s paperwork through Mail. No Studio jump occurs after the initial Day 27 start. First test attempt used an inaccurate expected correction phrase; after matching the actual bilingual correction both passed. Product source was unchanged.

The [42-sitting replay register](story-replay-2026-09-28.md) preserves every original sitting and verdict, with comparable-replay status still pending rather than inventing new clean tallies from targeted tests. It records which continuous transitions already have technical evidence.

### W-4 realism follow-through

During the hiring replay, the simplified W-4 still taught Step 3 as a head count. The actual [2026 IRS W-4](https://www.irs.gov/pub/irs-pdf/fw4.pdf) uses a dollar amount for dependent and other credits. Updated the practice document, labels, Job Card steps, Help and corrections in EN/ES. Robin’s fictional facts explicitly say no dependent or other credits, total $0. Accepted inputs include $0.00 and 0,00; the internal legacy field key is preserved for compatibility. This remains a simplified fictional form, not a tax calculator.

Lint, TypeScript and **2,231 unit tests / 56 files** passed; production webpack build passed. Continuous Story verification now passes **2/2 (EN/ES)** from interview preparation through offer acceptance, W-4 ($0.00), I-9 and direct deposit into the HQ file task. No additional Studio jumps occur after Day 27.

### HQ scheduling overlap · 28 September follow-through

The continuous hiring replay reached HQ and completed file search, wrong-version recovery and view-only sharing. It then exposed the Job Card covering the 10 AM scheduling choice. Calendar availability and slot/invite controls now participate in the existing card-avoidance mechanism. Lint, TypeScript, all 2,231 unit tests and the production webpack build passed; the continuous bilingual browser rerun passed (2/2), including wrong-time recovery and the correct invitation, without another Studio jump or manually moving the Job Card.

### Wave 3 close-out · Stream F (28 Sep)

Each audit fix bullet for #11–12 was checked against the working tree: 5 were already done and 9 are fixed now.
- **#11:** the handbook question now asks "you"; application and résumé history read Harborside Cafe with story dates; HR's mail explains Robin's example forms; the billing manager's address no longer shares the patient's surname; before the offer the desk badge shows the learner's café role.
- **#12:** the Day 16 time is graded against `CREW` (`slotIsFree`); the Day 17 prompt is now A2 with visible Thursday availability and three meeting-time choices, and Jordan stays at 30 hours; the Day 32 receipts have neutral file names, amounts live only in Drive, and the on-sheet list that gave the answer is removed.
- **Open decisions:** (a) no receipt amount disagrees with its row yet, because a mismatch would change the $188 used by Slides; (b) MyJobPanel still says "Applicant" before hire; (c) the Day 32 Sheets↔Drive switch needs a Chromebook check.

### Wave 3 close-out · Stream E (28 Sep)

Every audit fix bullet for #9–10 is verified or fixed. `npm run check`: 2,250 tests pass.
- **#9:**
  - Each route button shows days, place and manager, and the full A2 sentence appears on the confirm step.
  - The chooser has three modes (first / change / another), so a first choice no longer says "another".
  - In the middle of a route, "Change direction" lives in the card's Help (?), four taps away. After a route ends, it sits under the main button.
  - A new Act II finale level-up card appears before the choice.
  - The options sit in two columns, so Stop here stays visible at 150%.
  - The base Act V intro no longer says "skip this act".
- **#10:**
  - The job posting asks for someone "who has helped lead a shift or a team".
  - College and clinic intros explain why (Harborside pays for one class; the clinic is a separate neighbor and the learner gives no medical advice).
  - Anita's email and the Act VII intro explain the Team Lead role.
  - Spanish uses "líder de equipo".
- **Open, owner decision:** the HQ → Team Lead gap is still one story week (HQ Oct 6 → Team Lead Oct 12). Retiming means moving levels 24–27 in `story-dates.ts` together with the report week, meeting, review profile, mail dates and "Starting Monday". Acts VI–VII still use the café wallpaper, which would need a free HQ image, and a `harborsidecafe.com` mail host.
- **e2e edited but not yet run:** `act-v-picker`, `route-resume`.

### Wave 3 close-out · Stream H (28 Sep)

- **#17:**
  - Until the first task is finished, the practice offer comes back after a reload.
  - The notice box has an always-visible scrollbar with an edge shadow, and no words.
  - The Spanish tour finish no longer overclaims.
  - No close-window beat was added: that belongs to Wave 4's "closed window" design.
- **#18:**
  - The slide figure no longer doubles the "$".
  - The HQ card names the Q3 notes and says Chris asked. Drive search is a pure function with a localized "No files match".
  - The video-call card line includes Start video, and the unused `lateHint` is removed.
  - The Jobs bookmark stays through levels 19h1–h5, with a read-only copy of the posting.
  - The Story sign-in step shows the practice password, and the check lives in content.
  - A `problem` flag turns off confetti on "You're locked out" and "You woke up sick".
  - The Day 6 hours question is now A2.
- **#19:**
  - The Job Card Help has a keyboard line about moving the card.
  - The read-only (Day 36), budget and billing grids have one Tab stop and move by arrow keys (`sheet-grid-keys.ts`). FormulaCheck is not done because of hidden columns at small widths.
- **e2e edited but not yet run:** `act-vi-hq`, `pointer-practice`.
- **Left for I:** gendered Spanish on levels 20 and 3b and in the direct-deposit done line.

### Wave 3 close-out · Stream G (28 Sep)

- **#13, question first:**
  - Day 2 no longer states the swap rule.
  - Day 4 tells the learner where to look, not the answer. "Storage room" appears only after a wrong reply, since the fact is already in the scene.
  - Day 12 says "add them up with a formula", and `=SUM` appears only after a wrong try or in Help.
  - Hub and calendar notes on college-offer, priority-call, team-schedule, triage and meeting-minutes no longer give the answer.
  - The confidentiality call is now one neutral step, and the callback rule comes only after a miss.
  - Arrival and level-up cards on calendar, formula-check, reply-all, team-meeting and status-report no longer give answers. The level4 body no longer says the meeting is on your shift.
  - 11 duplicate done lines are removed.
  - A second press of "Open X from the bookmarks" flashes the bookmark (`bookmark-pulse.ts`).
- **#14:**
  - Clicking the arrival-card backdrop does nothing, and Escape continues into the task.
  - Drafts are verified for the meeting, résumé, slides, huddle, interview, triage and expense tasks (`task-draft.ts`).
  - No "Clock out for today" remains in either language.
- **Cleanup by the coordinator after H and G:**
  - The level20 and level23 bodies and the Day 36 sheet line no longer give the answer. "Already on the slide" was false, and "do not retype it" contradicted the typed total.
  - The mail-send-link dispatch is trimmed.
  - The practice offer has an outline instead of grey text (#17).
- **Owner decisions:**
  1. `completion-directions.test.ts` requires the card to name each requirement before the check runs. That conflicts with "question first". Research keeps its reason step for now.
  2. college-offer still pre-fills the "Tuesday class overlaps close" reply.
  3. On the finish screen, the kicker appears twice: in the page strip and in the Job Card header.
- **e2e edited:** `coworker-location`, `audit-followthrough`.

### Wave 3 close-out · Stream I (28 Sep)

Every audit fix bullet for #15 is verified or fixed. `npm run check`: 60 files / 2,324 tests pass.
- **Bookmarks:** a new test (`spanish-pass.test.ts`) checks that each task's Spanish "Abre X" names the Spanish bookmark on screen. It found three mismatches, now fixed: the Day 7 Forms bookmark (the card said "Formularios"), the college Offer bookmark (it said "Offer" while the card said "Oferta"), and Floor, which is now "Salón" in both places. The report hub and its card line now say Correo, not Mail. The Spanish handbook card names the English article "Calling out sick" that is actually on screen.
- **Gender:** "supervisor de turno" is now "supervisas los turnos" or "Supervisión de turno". "Administrador de Oficina" is now "administración de oficina". Welcome lines use "Te damos la bienvenida". "Estás listo" is now "Ya tienes todo". "Estás enfermo" is now "Te sientes mal". Other fixed forms: "ocupado/a", "tú mismo", "grosero", "estar seguro" and "ser perfecto". The test fails on these patterns anywhere in src/.
- **Calques:** "aplicar" is now "postularte" (jobs) or "enviar la solicitud" (college). Also fixed: "Este día está hecho", "en el piso" (the shop floor), "Me dieron regular", "reportarte conmigo", "Estás en el horario para…" and "Estimado solicitante". "Cubrió dos turnos de cierre con poca anticipación" was already correct.
- **Verified already done:** "líder de equipo" (the last "Team Lead" was the Act VII label on the welcome home, now fixed), the starter chips, and the ES switch inside arrival cards. The incident When/Where defaults now also follow a language switch made mid-form.
- **e2e edited but not yet run:** `act-boundary-card`, `opening-mail`.

### Wave 3 validation · 28 Sep

- `npm run check`: lint, TypeScript and **2,375 unit tests** pass. `npm run build -- --webpack` passes.
- Full e2e against the production build: **164/164 passed** (`LESSON_SMOKE=1 E2E_PROD=1 npx playwright test --workers=2`).
- An earlier run caught a regression: the W-4, interview and offer lessons opened on Mail, because hiring now starts from Mail in Story, and lessons get no hiring mail. `lessonTabFor` now opens hiring lessons on their own tab, and `lessons.test.ts` guards every lesson.
- Wave 3 fix lists are complete. Still open: browser observation at 100%/150%, the Spanish-first replay, the owner decisions listed in each stream note, the comparable 42-sitting replay, and the pilot.

## Owner decisions · 28 Sep (after PR #48)

1. **Pacing:** new dates are fine and may be in the future. Act VII moves to about six months after the first HQ day (from Mon Apr 12, 2027), with bilingual time-jump copy and every dependent document moved together.
2. **Question first vs. naming requirements: option C.** What a good answer must *contain* stays visible before the check, like a manager's instructions (who, when, a request, cc Jordan, a full sentence). The *answer to the judgment* (which source, which time, what is missing, the formula) is never stated before the first try; the card asks the question instead. `completion-directions.test.ts` checks both: requirements present, and answer words absent before the try.
3. **College-offer rebuilt.** HR's conditions; a Spring 2027 BHCC schedule with three sections (01 overlaps morning opens, 02 overlaps Tuesday close, 03 is full); nothing points out the clash. The learner picks 02, asks Renata for a shift change in their own words, calendars the class weekly, and replies to HR with the section.
4. **Realistic college dates.** Registration happens before the term, not mid-semester. The Act IV offer (October) is for a Spring 2027 class: register by Dec 11, 2026, first class Tue Jan 19, 2027. The College route is retimed the same way: apply and aid in the fall, then coursework and research during the spring term.
5. **Day 32:** one row has swapped digits (Harbor Deli typed $84, receipt $48). The learner corrects it to match the receipt; the receipted total stays $188, so Day 33 is unchanged.
6. **Job titles stay in English** as names ("Office Administrator", "Shift Lead", "Team Lead"), with a Spanish gloss at first mention. Running Spanish sentences stay neutral ("trabajas en administración de oficina").

### Owner decisions: implemented (28 Sep, branch `fix/wave-3-decisions`)

- **Act VII in April 2027:** Mon Apr 12 – Fri Apr 16.
  - The date helpers now know the year, and older mail shows as "10/9/26".
  - Anita's October slides email only hints at the spring role. Her Apr 12 email explains the six months.
  - The Act VII intro and first card open with "It is April now."
  - A test keeps Act VII at least five months after the first HQ day.
- **Option C:** `completion-directions.test.ts` enforces both halves: requirements present, and an answer list absent from all pre-try text (steps, dispatch, jobCardLine, arrival, lesson summary and scene).
  - Rewritten: shift-review, research, ops-report-packet and the calendar lesson summary.
  - The research grader now accepts author or journal reasons.
  - budget-sheet keeps "Subtract: Actual minus Budget" as reading support (owner-confirmed 28 Sep): it shows how to work it out, not which category is over.
- **College-offer rebuilt:**
  - HR's rules; a BHCC Spring 2027 schedule (01 clashes twice a week, 02 has seats and clashes with Tuesday close, 03 is full); spring shifts on the calendar with no conflict note.
  - The learner requests a change from Renata, who approves it; the class goes on the calendar weekly from Jan 19; the HR reply names Section 02 or CRN 20327.
  - Every step is graded by pure functions (`college-offer.test.ts`, 36 tests).
- **Day 32:** Harbor Deli is typed $84 and its receipt shows $48.
  - An uncorrected total of $224 gets "One row does not match its receipt"; a second try names the deli.
  - The total stays $188. Anita's praise email mentions the fix.
- **English job titles:** Shift Lead, Shift Supervisor, Assistant Manager, Office Administrator and Team Lead stay English in Spanish mode, with a gloss at first mention. Other characters' titles (Cafe Manager, Academic Advisor…) stay translated as descriptions.
- **College route dates:** apply Mon Sep 28, 2026 (application deadline Fri Nov 6); award letter Wed Nov 18 (accept by Fri Dec 4); register by Dec 11; first class Tue Jan 19, 2027; coursework Thu Feb 11 (week 4); research Fri Mar 5. Path-specific dates via `COLLEGE_STORY_DAY_BY_LEVEL` and `storyDayOf(level, path)`; Front desk keeps Sep 28 – Oct 2. Act IV and the College route share one spring term (`SPRING_TERM_*`).
- **Validation (decisions branch):** `npm run check` passes with 2,439 unit tests, and the webpack build passes.
  - Full e2e: 161/164. The two failures besides the lesson layout test were one stale Act II intro expectation (Spanish heading), now updated and passing.
  - **Known flaky test (follow-up):** `lesson-audit-regressions.spec.ts` "lesson work area stays separate from instructions", **en 390px**. The account-recovery code field is left 70% in view in about 1 of 4 runs.
    - Nothing on this branch touches that lesson.
    - It passed in the Wave 3 164/164 run.
    - Needs its own look at the phone-width scroll after choosing the text message.

### Flaky lesson test fixed (28 Sep)

This was a real layout bug, not only a flaky test.
- **Cause:** at phone width the Job Card sits below the app window. After the learner taps the Google text, the code box is focused, then the card moves to its next step, grows, and shortens the window, leaving the focused box partly cut off (70% in view). Spanish wraps the label to two lines, which makes it likelier.
- **Fix:** `AppWindow` in `Desktop.tsx` watches its own size. When it resizes, any focused text field inside is scrolled back into view.
- **Result:** under 6-worker load it failed 1 in 48 before and passed 96 of 96 after. The full e2e suite passes 164/164.
