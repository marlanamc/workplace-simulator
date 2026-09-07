# Remaining issues — implementation and validation plan

**Status: P6, P7, P8, and the P11 download fallback are implemented in the working tree; learner observation and conditional refinements remain open.** Based on the current [full review](../scratchpad/full-curriculum-review.md), concerns P1–P12. Planning starts from the next working day; confirm the actual launch date when scheduling participants. Preserve the final pre-launch week for testing and fixes.

## Outcome

A learner can complete the shared core, choose a direction, make the intended scenario decisions, recover independently, and retain an accurate record of practice. Completion must not imply that a keyword check assessed writing quality or that simulated practice is real employment.

All 37 level identities and earned progress remain. No new levels, timers, increased word-count quotas, mandatory teacher approval, or new speech technology. Instructions and recovery stay in the bilingual Job Card. A structured decision should replace a weak gate or redundant step rather than simply lengthen the activity.

## Priority and sequence

| When | Work | Deliverable / exit condition |
|---|---|---|
| Working days 1–2 | Establish the manual EN/ES baseline for core navigation, Help, keyboard, reload, routes, and clipboard denial. Prepare the three bounded decision changes below. Schedule first learner sessions now. | Reproducible issues with task, language, steps, and expected behavior. No unsupported “all clear.” |
| Working days 3–5 | Implement and test patient requester decisions, priority reasoning choice, and evidence-linked performance review. Fix any blocked core controls or loss-of-work behavior immediately. Observe the first four opening sessions if participants are available. | Three activities demonstrate a concrete decision; automated checks pass; first observations recorded separately. |
| Working days 6–10 | Address observed opening friction, repetition, starter dependence, and false writing rejections. Validate route endings and a dependable portfolio export. Observe late activities using Studio. | Each observed blocker has a fix and recheck; changes are small enough to validate before the freeze. |
| Final pre-launch week | Freeze new features. Complete remaining bilingual core/route observations, use fresh examples, fix blockers, and rerun the release suite. | Launch checklist signed off from evidence. Unobserved items stay open. |

The first four participants should cover beginner/confident computer users in English and Spanish. This is a starting group, not enough to assume all routes and 51 tasks are covered. Split the remaining coverage across additional short sessions. If recruitment slips, continue technical QA, but do not substitute it for learner evidence.

## Batch 1 — strengthen decisions we already know are weak

Implemented in this batch. The previous completion gates did not exercise the claimed decision. Pilot evidence must now refine wording and difficulty and check whether learners use the supplied facts rather than guess.

### P6 — distinguish authorized and unauthorized requesters

**Change:** In the existing intake level, use the fictional reference to identify the verified care-team recipient. Have the learner choose who may receive the chart: the verified nurse, the unrelated coworker, both, or neither. Then write the existing refusal to the coworker. Replace the passive nurse reference’s role in the task with this decision; do not add an “I understand” acknowledgment.

**Reference design:** The scenario must explicitly establish the nurse’s verified role and assignment. A requester simply saying “I’m on the care team” is not the authorization evidence. This remains a simplified scenario, not a claim that the app teaches complete healthcare disclosure rules.

**Automatic completion:** Correct recipient decision plus the existing refusal practice. Keep nuanced wording open to optional feedback. Persist the selected decision with the writing if it is submitted for review.

**Recovery:** Job Card directs the learner back to the verified assignment and distinguishes role verification from a plausible claim. Preserve their draft after a wrong choice.

**Acceptance:** EN/ES tests reject both/neither/wrong recipient and accept the verified nurse. A learner can explain the difference in a fresh fictional requester example. Do not claim the free-text refusal is leak-proof.

### P7 — require an actual priority decision

**Change:** Keep the three competing situations visible in the existing priority-call hub. Replace the character-count-only justification gate with a choice pairing an issue and a reason. Base options on consequences already present in the scenario, not a new emergency or time pressure. Allow a short optional explanation; do not increase the existing writing load.

**Content design:** Establish the scenario’s urgency rule in the reference. If more than one issue/reason pairing is defensible under those facts, accept each defensible pairing. Do not make a subjective teacher preference the secret answer.

**Automatic completion:** A supported issue/reason pairing, plus the existing work items. This assesses recognition of a tradeoff, not the quality of an unrestricted explanation.

**Recovery:** Explain the consequence that the selected reason missed through the Job Card. Keep flexible work order; priority selection does not force an artificial click sequence.

**Acceptance:** Pure tests cover every offered pairing in both languages. In a fresh example with changed consequences, the learner can explain whether the priority should change. Record guessing separately from reasoned selection.

### P8 — tie a performance review to supplied evidence

**Change:** Let the learner select one actual win from Sam’s profile as the evidence for the strength. Keep the supplied attendance issue visible beside the growth-area draft. Save the selected evidence with the two written fields. Replace the vague-strength blocklist gate with evidence selection plus basic draft completeness; do not mirror that blocklist in the second field.

**Writing support:** Offer optional Job Card questions: “Which action are you recognizing?” and “What should happen differently next time?” Keep the draft editable and optional teacher feedback available. Avoid a mandatory self-confirmation checklist.

**Automatic completion:** A real selected profile fact and completed drafts. This still cannot prove that the prose matches the fact, is fair, or is constructive; completion wording must make that boundary clear.

**Acceptance:** Objective selection checks work in EN/ES; drafts and selected evidence survive saved retrieval; ordinary valid paraphrases are not rejected by a canned-phrase rule. Pilot review checks whether the text actually uses the evidence. If it does not, revise the support and task framing before adding more automated language gates.

## Batch 2 — resolve usability and learning risks with targeted evidence

| Concern | Check first | Concrete response if the concern appears | Closure evidence |
|---|---|---|---|
| **P1: opening transitions and Help recovery** | Observe a fresh start without a demonstration, including shrinking/recovering the card and returning from Help. Test keyboard and a narrow screen separately. | Remove repeated explanations; perform a navigation demonstration once; make Help return to the task state where it was opened. Keep beginner control practice that participants actually need. | A fresh attempt in each language reaches the first email without facilitator repair. All previously blocked controls are rechecked. Do not use a speed target. |
| **P2: Payday overload** | Separate confusion about vocabulary from confusion about controls or arithmetic. Ask for a fresh net-pay explanation. | Add brief optional gross/net/deduction definitions in Job Card Help. Shorten repeated wrap-up text or direct errors back to the relevant practice. Preserve the existing recall questions if they help. | Learner can explain net pay and correct the clock discrepancy; observed unnecessary repetition is removed and the revised sequence is tried again. |
| **P3: scheduling repetition** | After each type of scheduling task, ask what decision was different. Compare personal availability, staffing hours, invitations, and multi-person calendars. | Remove repeated tool-opening coaching; emphasize the new responsibility in the Job Card. Change a scenario default only where it gives away the answer, without adding new levels or variants wholesale. | Learner uses the changed facts in a fresh example, rather than replaying the old click pattern. Record whether both beginner and confident users benefit. |
| **P4: guessing and starter dependence** | Use a different verification code, file, source, or schedule outside the app. Observe whether answers come from sources or repeated clicking. | Replace fully answered starters with partial, editable prompts where they displace thinking; retain fuller examples in optional Help. Reduce answer-revealing highlights. Keep fixed deterministic scenario data unless memorization is demonstrably the problem. | Correct choice plus an explanation grounded in the new source. A beginner can still obtain useful Help. Do not remove support just because a confident user did not need it. |
| **P5: writing false accepts/rejections** | Build a small case set from exact pilot responses: valid rejected, wrong objective fact accepted, and unclear writing. Remove identifying details. | Correct factual checks and formatting/paraphrase bugs with paired EN/ES regression cases. For relevance/tone, improve prompts, source visibility, or structured evidence selection. Keep optional human review. | Each known valid rejection passes and each known incorrect fact fails after the fix. Unrestricted semantic correctness remains a documented limitation, not a checkbox we can close. |
| **P9: meeting sequence and notes** | Observe transcript use and whether learners understand preparation, notes, and follow-up. Check the changed assignment. | Clarify the Job Card’s recommended sequence and retain easy access to the transcript from notes/follow-up. Preserve drafts when moving between views. Do not require clicking through every transcript line. | Learner locates final assignments, records the correction, and can explain the follow-up. Notes are inspected for fidelity; a two-line count is not enough evidence. |
| **P10: route/stop/revisit confusion** | After core and each route’s end, ask what the learner thinks they have completed and what happens if they change direction. | Clarify current direction, optional choices, and resume location within the Job Card/task list. Show only earned credit. Fix mismatched route rules before changing cosmetic labels. | Pause/reload/switch-back works with unchanged earned task IDs; learners recognize that other routes are optional. Each supported route gets an observed pass. |
| **P11: portfolio usefulness and export** | Test copy/paste on target devices and deliberately deny clipboard access in technical QA. Ask whether the learner recognizes the route ending. | Add a localized UTF-8 text download of the same summary as an alternative to clipboard; route failure messages through the Job Card. Reuse one summary formatter for both actions. Clarify the completion wording before adding a decorative finale. | Copy and download contain identical saved reflections/earned labels in EN/ES, exclude unearned roles, and identify simulated practice. A learner can retrieve the artifact after reload without staff intervention. |
| **P12: incomplete coverage** | Use a task-by-language register; separate facilitator QA, actual learner attempts, and fresh-example evidence. | Schedule additional short sessions using Studio for late tasks. Investigate every blocked interaction; keep unobserved rows visibly pending. | Core has EN/ES wrong-action, Help, keyboard, and return coverage; each route and redesigned late activity has learner evidence. No blank row becomes “passed” by assumption. |

## Implementation and testing rules

For each issue, keep one short record: **task + language → observed/reproduced problem → change → automated result → learner recheck → disposition**. Codex handles implementation, technical regression checks, and documentation when execution is authorized. The facilitator recruits participants, runs observations, and supplies the evidence needed for learner-dependent decisions.

- Pass/fail rules belong in task `content.ts` as pure functions with representative EN/ES acceptance and rejection cases.
- New structured response fields reuse submission storage and authenticated learner-only retrieval. Older saved writing must remain readable; older earned task completion is not revoked because a new activity field was introduced.
- Route changes must never credit skipped tasks, and retrying a failed save must not imply success prematurely.
- Run `npm run check` for each implementation batch. Run the full `npm run test:e2e` for Job Card/walkthrough changes and on the final release candidate; extend browser coverage for changed requester, priority, review, and export flows.
- Use the observed case and a fresh example to recheck a fix. A replay of the same memorized answer is weak evidence of transfer.
- Keep README, curriculum guidance, the concern review, and pilot status synchronized with what actually shipped.

## Triage and launch decision

**Fix immediately:** lost work, invented completion credit, dead ends, essential controls inaccessible by keyboard, wrong objective facts receiving credit, or correct answers rejected with no usable recovery. One credible reproduction is enough to investigate; do not wait for multiple learners to encounter a blocker.

**Refine before launch when observed:** repeated facilitator intervention, repeated misunderstanding of a task’s purpose, copying starters without understanding, or a repeated step that adds no decision. Record disagreement between beginner and confident learners rather than averaging their needs together.

**Keep explicitly bounded:** automated assessment of tone, fairness, relevance, confidentiality nuance, and reflective insight. The fix is honest completion language plus better practice and optional feedback, not a promise of perfect grading.

**Defer:** decorative finales, a rich selected-work portfolio, mistake-dependent story branches, mandatory scripted revision rounds, new levels, and broad removal of late-task Help.

Launch only after the release checklist is supported by evidence and serious blockers are rechecked. If the final week arrives with an untested change, stop adding features and stabilize. If an essential route remains blocked, delay release or make an explicit scope decision; never award its skipped work to manufacture a completed course.

## Next batch

Run the first learner sessions and the remaining baseline checks. P6 now checks a verified recipient; P7 accepts two supported priorities and rejects unsupported reasons; P8 saves selected profile evidence with editable drafts; P11 offers identical clipboard/download text. These implementation changes do not close the fresh-example or usability gates.

Technical verification found and fixed a performance-review recovery problem: changing the step at submission cleared the missing-evidence hint. The step now derives from the draft, so the Job Card keeps that correction visible. Subsequent fixes should follow similarly concrete evidence.

Verification for this batch: `npm run check` passed lint, typecheck, and 981 unit tests; `npm run test:e2e -- --workers=2` passed all 22 browser tests. The initial run exposed a Spanish test-label mismatch and three navigation timeouts; the corrected full rerun passed. Actual learner observations and fresh-example checks remain pending.

## Future curriculum priority — file confidence and everyday sharing

**User priority recorded 2026-09-06; proposed work, not implemented.** File navigation deserves explicit practice, including for confident English speakers. Do not assume that completing the simulated Drive or attachment tasks proves understanding of a computer’s folders. Preserve the current no-new-levels launch scope; use pilot evidence to identify small improvements inside existing tasks and plan the broader sequence after launch.

The intended skill is following a file through its whole journey: receive → download or save → locate → name and organize → reopen → attach or share → verify the intended file and recipient.

Future practice should cover:

- Finding an email download using the browser’s download history and the actual save location; destinations vary with device, app, and settings.
- Distinguishing a file from a folder, a browser preview from a saved copy, and local storage from cloud storage. Explain why “Recent” or a search result may show a file without being its storage folder.
- Choosing a sensible personal folder and meaningful filename; moving, copying, renaming, and finding the file again after closing the app. Include personal versus shared-device storage and recognizing duplicate versions.
- Finding files through both folder navigation and search, using name, type, and date rather than memorizing one click path.
- Moving a photo from a phone into the location needed by an upload or attachment picker; distinguishing a photo library from a file browser and an attachment from a shared link. Adapt the supported workflow to learners’ actual devices.
- Practicing an ID-image request with an obviously fictional sample only: identify the intended recipient and appropriate sharing channel, select the correct image, check readability and unintended background information, and confirm the attachment before sending. Do not normalize sending real identity documents for any unverified request.

**Learning evidence:** After practice, give a differently named fictional file and ask the learner to save it, close the app, find it again, and select it for an attachment. Ask where it is stored and why they chose that location. Observe whether they understand the location or rely on the file staying in Recent. Do not treat speed or memorized folder names as mastery.

**Next design step:** Map gaps across existing attachment, Drive, copy, upload, and portfolio-download tasks; identify which concepts are missing versus merely unfamiliar. Build a coherent bilingual sequence with Job Card coaching and recovery, guided by the actual device mix. Broad file-system practice remains an explicit future priority, not a claim about the current course.

## Future curriculum priority — everyday computer confidence and recovery

**User-approved planning addition, 2026-09-06; not implemented.** Extend the file-confidence sequence to situations where people lose track of location, save status, account identity, or audience. These are proposed learning needs to investigate, not measured prevalence claims or nine new launch levels.

**First priorities:** file management, account awareness, save-state awareness, and recovering from mistakes. These support many existing tasks. Map current coverage before deciding whether to revise an activity or propose additional post-launch work.

| Learning need | Proposed practice | Evidence of understanding |
|---|---|---|
| **Saved versus submitted, uploaded, or sent** | Change a practice document, inspect its status, close/reopen it, and separately complete a submission. Include a recoverable failed save or upload. | Learner identifies which action succeeded, verifies persistence, and retries the failed action without assuming all work was lost or sent. |
| **Personal versus work accounts** | Identify the active account and file owner; resolve a fictional “Request access” situation by checking identity and permissions. | Learner chooses the intended account or requests appropriate access rather than making the file public to bypass the problem. |
| **Tabs, windows, and apps** | Move between a source and a form, recover a closed tab or obscured window, and return to the draft. | Learner finds the original work without restarting or creating unnecessary duplicate tabs; explains which app holds the source. |
| **Upload errors and file selection** | Encounter a clearly explained type, size, or incomplete-upload problem; choose the relevant correction and inspect the resulting preview. | Learner responds to the actual error, selects the intended version, and verifies the uploaded file. Do not require repeated guessing or unexplained conversion. |
| **Recovery from mistakes** | Undo an accidental edit, locate a moved practice file, and recover a deleted practice file where the environment supports it. | Learner chooses an appropriate recovery action and distinguishes a recoverable mistake from an action that requires help. Do not imply every system supports Undo or restoration. |
| **Printing and PDF output** | Inspect print preview, choose relevant pages and destination, and save a PDF to an intentional location. | Learner catches clipped or extra content and can find/reopen the PDF; understands that saving a PDF is different from sending pages to a printer. |
| **Sharing and recipient access** | Compare attachment versus link, select the recipient and access level, and inspect a simulated recipient view. | The intended recipient can access the correct file with appropriate permissions; learner explains why that method fits the request. |
| **Errors, status messages, and permission requests** | Read contrasting messages and decide whether to wait, correct input, retry, review an access request, or seek help. | Learner explains what the message indicates and chooses a relevant response instead of treating every prompt as something to dismiss. |
| **Asking for useful technical help** | Describe the intended action, what happened, and the exact error; capture only the relevant part of a fictional screen. | Another person can understand the problem from the report; the screenshot excludes unrelated personal information. |

**Shared habit:** pause → read → check where you are → try one relevant action → check the result. Model this through recoverable mistakes and optional Job Card Help; do not turn it into a mandatory acknowledgment checklist before every task.

**Design and validation approach:**

1. Audit the existing mail/attachment, account-recovery, Drive, copy, submission-retry, and portfolio activities for explicit concept practice. Distinguish “the learner clicked successfully” from “the learner understood where the work is and what happened.”
2. Use observed confusion and the learners’ actual devices to prioritize gaps. Select device-appropriate examples; do not teach one browser’s or operating system’s behavior as universal.
3. Integrate bounded improvements into existing tasks where they add a useful decision. Reserve broader additions for post-launch planning; retain all current level identities and earned progress.
4. Provide bilingual Job Card instructions, optional support, and recoverable fictional scenarios. Avoid real identity documents, credentials, or personal account changes during practice.
5. Recheck with a fresh file, account context, error, or sharing request. Record independent explanation and recovery separately from assistance and memorized clicks. No speed targets or new word-count quotas.

**Scope boundary:** these additions are a curriculum backlog, not shipped features or closed pilot findings. Preserve the final launch-testing week and address demonstrated blockers first.

## Batch 2 technical work — meeting recovery and coverage tracking

Implemented in the working tree: agenda and notes return buttons now have visible bilingual destination labels; both textareas have associated labels; the full transcript is available beside notes as well as follow-up. Follow-up recovery now names the owner/day selection controls instead of incorrectly asking for one written line per action. Flexible order is preserved. A bilingual browser regression checks transcript access without stepping through the script, Help return, keyboard activation of transcript/return controls, and in-session agenda/notes retention across views. This does not claim full keyboard coverage or unfinished-draft persistence across reload.

P12 now has a [task-by-language register](pilot-coverage.csv) separating technical checks, actual learner observations, and fresh-example evidence. Pending cells deliberately remain pending until evidence is recorded. README runtime counts and the meeting lesson’s unsupported listening/assessment wording were corrected.

P1–P5 and P10–P12 still require the targeted checks and observations above. P9 has a concrete accessibility/source-access improvement; whether the workflow makes sense to learners remains open.

User update: the facilitator has walked through the course and changed wording/order; no learner sessions have occurred yet. Preserve that editing work and keep facilitator QA distinct from learner evidence.

The full browser run also reproduced save recovery being hidden by a Studio arrival celebration after reload. Level/track celebration cards now yield to pending-save status and the Job Card remains available for Retry. The existing failed-save/reload regression verifies this path.

Verification: `npm run check` passed lint, typecheck, and 1,007 unit tests. The full browser run passed the 22 existing tests, including failed-save/reload/retry; the two new meeting tests initially failed because of test setup/name matching, then both passed in the corrected EN/ES targeted rerun. All 24 browser cases have passing results across those runs; this is not a claim of one clean 24-test run. Rerun the full suite on the release candidate.
