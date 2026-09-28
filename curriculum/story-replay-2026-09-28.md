# Story replay register · 28 September 2026

This register tracks the comparable replay separately from fixes and automated regression coverage. The original 42-sitting baseline stays unchanged. A passing targeted test does not grade an entire sitting as clean.

Replay method: enter once at the start of a segment (fresh signup for the opening), play forward without further Studio jumps, try plausible mistakes and short beginner responses, exercise Help, reload and return, and observe keyboard/Spanish/150% behavior. Record actual findings and evidence before assigning a new verdict. Real-learner transfer remains a separate pilot gate.

| Sitting | Task / level | Original verdict | Comparable replay |
|---|---|---|---|
| How this works | level0 · tour + pointer practice | Friction | Pending |
| The Night Before | level1 · mail-reply | Friction | Pending |
| Day 2: The First Week | level2 · schedule, mail-attach | Blocks beginners | Pending |
| Day 3: Clock-In Fix | level3 · timeclock, shift-review | Blocks beginners | Pending |
| Day 4: Write to a Coworker | level3a · mail-etiquette | Friction | Pending |
| Day 5: The Sick Call | level3a2 · call-out-sick | Blocks beginners | Pending |
| Day 6: First Paycheck | level3a3 · paystub | Friction | Pending |
| Day 7: When Something Happens | level3b · incident, handbook | Friction | Pending |
| Day 8: Locked Out | level3c · account-recovery | Friction | Pending |
| Day 9: The Calendar | level4 · calendar | Friction | Pending |
| Day 10: Shared Files | level5 · files, mail-send-link | Friction | Pending |
| Day 11: The Numbers | level6 · spreadsheet | Friction | Pending |
| Day 12: Reporting In | level7 · make-a-copy, status-report | Blocks beginners | Pending |
| Day 13: Covering More Ground | level8 · triage | Friction | Pending |
| Day 14: Scheduling the Team | level9 · team-schedule | Friction | Pending |
| Day 15: Weekly Numbers | level10 · formula-check | Friction | Pending |
| Day 16: First Team Meeting | level11 · team-meeting | Blocks beginners | Pending |
| Day 17: Under Pressure | level12 · priority-call | Blocks beginners | Pending |
| Day 18: An Offer | level13 · college-offer | Broken on entry | Pending |
| Day 19: The Budget | level14 · budget-sheet | Friction | Pending |
| Day 20: Reply-All | level15 · reply-all | Friction | Pending |
| Day 21: Getting Ready | level16 · enrollment | Friction | Pending |
| Day 22: The Paperwork | level17 · financial-aid | Friction | Pending |
| Day 23: Staying On Top of It | level18 · coursework | Friction | Pending |
| Day 24: Finding a Real Answer | level19 · research | Blocks beginners | Pending |
| Day 21: Getting Ready | level16 · appointment-scheduling | Friction | Pending |
| Day 22: The Paperwork | level17 · patient-intake | Broken grading | Pending |
| Day 23: Staying On Top of It | level18 · billing-sheet | Blocks beginners | Pending |
| Day 24: Finding a Real Answer | level19 · confidentiality-call | Broken grading | Pending |
| Day 25: Applying | level19h1 · job-posting, job-application | Friction | Pending |
| Day 26: Your Résumé | level19h2 · resume-build | Friction | Pending |
| Day 27: The Interview | level19h3 · interview-practice | Friction | Pending |
| Day 28: The Offer | level19h4 · job-offer | Friction | Pending |
| Day 29: New-Hire Paperwork | level19h5 · w4, i9, direct deposit | Friction | Pending |
| Day 30: Welcome to HQ | level20 · office-drive | Friction | Pending |
| Day 31: Get Everyone in the Room | level21 · scheduling, video call | Friction | Pending |
| Day 32: The Expense Report | level22 · expense-report | Friction | Pending |
| Day 33: Presenting to the Team | level23 · slide-deck | Friction | Pending |
| Day 34: Run the Meeting | level24 · meeting-minutes | Friction | Pending |
| Day 35: The Review | level25 · performance-review | Friction | Pending |
| Day 36: Put It All Together | level26 · ops-report-packet | Blocks beginners | Pending |
| Day 37: Where You've Been | level27 · portfolio-reflection | Friction | Pending |

## Technical replay evidence

- `e2e/act-vii-team-lead.spec.ts` plays Days 34–37 continuously. Passed in the 60-test Story run. This does not by itself close Spanish-first, Help/recovery, or manual visual observations for every sitting.
- `e2e/act-boundary-card.spec.ts` verifies Day 33 → Act VII arrival and Job Card in EN/ES.
- `e2e/day12-handoff.spec.ts` completes the copy and continues into status-report, including numeric-total rejection and SUM recovery. Latest targeted run passed.
- `e2e/story-hiring-mail.spec.ts` now adds continuous Day 27 → Day 28 → Day 29 entry, with a wrong date and correction. Both EN and ES passed (2/2); no additional Studio jumps between these days. Extended replay also passed all three paperwork forms and reached the HQ file task (2/2 EN/ES). W-4 Step 3 was corrected to a dollar amount after this review. The extended continuous replay now also completes HQ file sharing and scheduling (2/2 EN/ES), including wrong-version, wrong-permission and wrong-time recovery. It exposed and verified a fix for the Job Card covering scheduling controls. Video call and the remaining Office segment are still open.

Additional targeted tests and screenshots are listed in `story-audit-tracker.md` and the HTML working-pass panel. They support individual fixes, not a new blanket tally.

## Segment order still to replay

1. Opening through payday (fresh signup).
2. Shift Lead through route choice.
3. Stay-and-lead through its ending and route choice.
4. College through its ending.
5. Front desk through its ending.
6. Office hiring, HQ and Team Lead through its ending.

For each segment record EN/ES, wrong-action recovery, Help return, reload/return, keyboard and 150% observations. Do not mark a row complete from first-task entry alone.

## Grading standard for the comparable replay (agreed 28 September)

The audit HTML's "Standards for the re-run" section is the full text. In short:

- **One severity standard.** If the only way past an obstacle is something the screen does not tell the learner (drag or collapse the Job Card, zoom, scroll with no cue, reload, a shortcut), it **blocks beginners**, whether or not the auditor found the workaround. Grade at 1366×768 at 100% and 150%; keep the worse result.
- **Compare against the unified baseline**: 0 clean · 23 friction · 16 block · 3 broken. Seven card-covered friction rows became blocks: Days 8, 11, 19, Front desk 21, 26, 31 and 33. Four more are to be confirmed on the replay: Day 1 at 150%, Day 14, Day 15, and Day 32 at 150%.
- **Two verdicts per sitting.** UI/UX: clean / friction / blocks / broken, target clean. Learning challenge: fair / given away / too thin / unfair / unsupported / none, target fair. See "Two kinds of friction" in the audit HTML.
- **Clean Pass** needs all of the following:
  - 0 broken, 0 blocking and 0 unintended UI/UX friction.
  - Replay conditions: continuous play, EN and ES, 100% and 150%, keyboard, a wrong try, Help, and a reload.
  - A fair learning challenge, or none. *Too thin* passes only with a recorded design decision.
  - Claims that match what was checked.
  Polish (costs no time or understanding) is logged but does not fail a sitting. A wrong number, name, date, instruction or label is never polish. A failed sitting gets a fix-up, then its segment is replayed from the start.
- **Predicted items** are not counted in Clean Pass tallies. They get a separate *Learner evidence* column (confirmed / not seen / contradicted / not yet observed) filled from `launch-pilot.md` sessions. One learner blocked is enough to act. Friction is fixed when it recurs in two or more participants, or in both languages.
