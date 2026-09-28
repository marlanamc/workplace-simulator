# Story Mode Audit: fix tracker

Source: the Story Mode Audit (27 Sep 2026), 42 sittings on 4 routes.
Baseline: **0 clean · 30 friction · 9 block beginners · 3 broken.**
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
| 9 | Route chooser under-explains the choice; "Change direction" is always one tap away | Medium | 3 · E | todo |
| 10 | Route copy assumes Stay-and-lead; no reason given for leaving the café | Medium | 3 · E | todo |
| 11 | Who "you" are keeps slipping ("your shift lead", Jordan, "Simulator", Robin, name slips) | Medium | 3 · F | todo |
| 12 | Supervisor judgment tasks contradict their data or state the answer (Days 13, 16, 17, 32) | Medium | 3 · F | todo |
| 13 | Help fades by giving answers; instructions leak out of the Job Card | Medium | 3 · G | todo |
| 14 | Reload loses the arrival card and drafts; "Clock out for today" means sign out | Medium | 2 · A (rename, focus) + 3 · G (persistence) | part done · PR #45 (button renamed); 3 · G: arrival and drafts, Day 3/6 level-up text |
| 15 | Spanish: the card names bookmarks that aren't on screen; the learner's gender changes; calques | Medium | 3 · I (last) | todo |
| 16 | Learners are pointed at Studio (which can wipe progress); staff notice shown at sign-in | Medium | 1 · PR 1 | done · PR #36 |
| 17 | Act I on-ramp makes skipping the loudest choice and overclaims | Low | 3 · H | todo |
| 18 | Smaller tool mismatches (no link to copy, Drive search, camera step, hiring outside Mail) | Low–Med | 3 · H | todo |
| 19 | Arrival card doesn't take focus; keyboard friction | Low | 2 · A (card focus) + 3 · H (the rest) | part done · PR #45 (card focus); 3 · H: skip link, compose focus, I-9 labels |

## "What the app says it proved" (claims vs. checks)

Two fixes apply to each row:
- **B:** tighten the check.
- **B, praise:** make the praise describe only what the task actually checked.

| Claim | Fix | Status |
|---|---|---|
| "You know how this computer works" (tour) | H: "You found your way around" | todo |
| "You left Maria a clear note" (Day 3) | B: require the times | done · PR #41 |
| "Net pay and hours look right" (Day 6) | G: remove the circles · H: compare hours with the time clock | todo |
| "Counts toward Office Ready…" (Day 7) | B: incident check | done · PR #41 |
| "Create a meeting with an agenda" · "Handle three asks at once" | F: real choices | todo |
| "Core course complete" (Stop here) | D: summary at Stop here | done · PR #46 |
| "You found the deadline" (Day 21 A, skipped in code) | B: check the deadline step | done · PR #41 |
| "Tell a credible source…" (blurbs label themselves) | G: neutral blurbs | todo |
| Thuy: "You did not share the visit" | PR 4 | done · PR #39 |
| "Four honest answers…" (interview) | B | done · PR #41 |
| "Run the meeting…" · "who owes what by when" | B: wire up `followupHasOwnersAndDates` | done · PR #41 |
| "Write a fair review" | B: light check on the growth line | done · PR #41 |
| "Send the weekly report packet" | B + H: no empty email; the calendar event must be opened | part done · PR #41 (no empty email); H: open the event |

## Per-act notes not covered above

Assign each note to the stream that owns its file during the Wave 3 sweep. Copy each one here as a row when it is picked up.

| Where | Note | Stream | Status |
|---|---|---|---|
| Server | `recordCompletion` can insert the same task twice when a save is retried under a slow server; only `mail-reply` is guarded (seen as a flaky `opening-mail.spec.ts:42`) | 3b · follow-ups | todo |
| Day 3, Day 6 | Level-up body text still says "Clock out for today." above the renamed "Stop for today" button | 3 · G | todo |
| College, Front desk ends | Final note says "Monday, Anita needs you at HQ" on routes that never go to HQ | 3 · E | todo |
| Any task | A main "way forward" button with neither `data-showme` nor `data-card-avoid` can end up under the Job Card after it moves; mark them as tasks are touched | all streams | ongoing |
| Billing, intake, research | Sentence starters include a chip in the other language | 3 · H / I | todo |
| `src/exportable-workspace/fixtures.tsx` | Demo still shows August dates | 3b · follow-ups | todo |

## Wave 4: transfer gaps (new content)

Design doc first; build one PR per gap family.

| Gap family | Status |
|---|---|
| File confidence: download, find, upload, rename or move, print or save as PDF | todo |
| Recovering from everyday problems: closed window, no Wi-Fi, Undo, reload, permission pop-up | todo |
| Work communication beyond email: manager text, voicemail, invite reply, doc comment, chat | todo |

## Closing checks

- [x] `e2e/job-card-overlap.spec.ts` is un-`fixme`'d and passes at both sizes (PR #45).
- [x] An act-boundary play-through e2e passes (VI→VII in `e2e/act-boundary-card.spec.ts`; III→IV is a unit invariant in `act-boundary-handoff.test.ts`).
- [x] Every sentence in `story-audit-sentences.ts` is graded the way it says (`clinic-privacy.test.ts`, `story-audit-grading.test.ts`).
- [ ] Re-run the audit's segment method and compare the tallies with the baseline above.
- [ ] Real-learner pilot sessions (`launch-pilot.md`).
