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
