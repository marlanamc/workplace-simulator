# Act I onboarding & pacing plan (draft, not started)

Scope: the welcome-to-Day-1 sequence, the Job Card's header/reference-facts shape, reading pauses after five Act I responses, and the pay-stub task's layout. Source: the owner's Act 0–1 spec (pasted 30 Sep 2026).

**Working rule (owner, 29 Sep, carried over from `act-1-fixup-plan.md`):** one act at a time, slowly. This is **Phase 4 of the Act I fix-up track** — it starts only after the owner signs off on `act-1-fixup-plan.md` Phase 3 (the PR #57 replay currently under review). Nothing here is coded before that sign-off.

## What's already true, from reading the code (30 Sep)

- There is no existing full-page "New Hire" screen for Act I. `SimulatorWelcome` (game welcome) is the only full-page gate; the Maria/Darnell introduction currently happens as a Job Card beat inside the `tour` task (`src/lib/tasks/tour/content.ts`), and again, separately, inside `mail-reply`'s lesson `scene.people`. Nothing shows Day-1 task instructions before `SimulatorWelcome` is dismissed today — `JobCardHost` doesn't mount until the `simulator-welcome-seen` flag is set — so that half of the "don't show Day 1 before New Hire" ask is already satisfied; what's missing is the New Hire screen itself.
- The task-list spotlight (`ListIntroSpotlight`) and its gate (`shouldShowListIntro` in `job-card-content.ts`) are mandatory today, gated on `list-intro-seen`. This is the thing to remove.
- `JobCardStep` has no `facts`/reference or emphasis fields today. The closest analog is lesson mode's `LessonMeta.reference`/`LessonFact[]`, which the spec explicitly asks Story mode to share instead of building a second panel.
- The Job Card's practice-click/scroll flow (`CardPractice`, stage machine `inactive → click → scroll → complete`, in `job-card-context.tsx` + `job-card-content.ts`) is the direct template for both the new "practice moving/hiding the card" flow and the new "read this reply, then continue" pauses — nothing like the latter exists yet; it's new, modeled on this pattern.
- Pay stub today opens in a **separate app** (`openApp("pdf", { docId })`), forcing an app-switch the spec wants removed; `PaystubTask.tsx` already has a `backToBrowser` button precisely because finding the Browser pin is called out in-code as "the hardest thing the act asks for." Removing the switch removes that whole workaround.
- `PdfSheet` already marks `stub-net-pay` / `stub-hours` with `data-showme` — the embed just needs to reuse it in place, not rebuild it.
- Grading for the start-time reply (`startTimeVerdict` in `reply-grading.ts`) already covers most of the accept/reject cases Phase 1 of the fix-up plan added (accented "sí", Thursday/2 PM, decline, negation). The spec's corner-line and email wording changes look like mostly copy edits, not new grading logic — needs confirming once Phase 0 re-baselines it.

## Owner decisions needed before Phase 1 starts

1. **New Hire screen placement.** Insert as a second full-page gate after `SimulatorWelcome` and before `JobCardHost` mounts (its own flag, same pattern as `simulator-welcome-seen`), or fold into the existing `tour` task's first beat instead of a separate screen? The spec's "computer tour → New Hire → Start my first day" ordering implies a *third* screen after the tour, not a second gate before it — confirm the sequence is welcome → tour (in-card) → full-page New Hire → Day 1, not welcome → New Hire → tour.
2. **Emphasis encoding.** The spec bans HTML strings for bold. Recommend `facts?: Localized<{ text: string; bold?: boolean }[]>` per fact line (semantic `<strong>` at render time) rather than a markdown-ish string. Confirm before touching `JobCardStep`.
3. **Reading-pause data model.** Recommend a `readPause?: { messageId: string }` field on the five affected `TaskDescriptor`s (schedule, mail-attach, timeclock, call-out-sick, paystub), driving a shared Job Card stage (`unread → reading → acknowledged`) that gates the existing green "Done" handoff/celebration, rather than a bespoke flag per task. Confirm this is the right generalization before it's built once and copied five times.
4. **Header repositioning controls' new home.** The spec asks to move drag/snap-to-corner out of the header but keep keyboard movement. Options: fold into the existing Help panel, or a small overflow/kebab menu in the card body. Needs a call before Phase 2 touches `JobCard.tsx`'s header block.
5. **Pay-stub breakpoint vs. the Phase 1 card-docking breakpoint.** Phase 1 already docks the Job Card below ~1100px width. The spec's own pay-stub side-by-side threshold is 900px of *task-container* width, which is narrower than the viewport breakpoint and a different measurement (container, not viewport). Confirm these are meant to be independent and don't need reconciling.
6. **Start-time email wording.** Confirm the spec's frame ("Hi Maria, I will be there at ___ AM") is a rewrite of Maria's *email prompt* copy only, with the reply still free text (current UI), not a new fill-in-the-blank input widget.

## Phase 0: re-baseline (no fixes)

- Re-run the Phase 3 Act I replay (from `act-1-fixup-plan.md`) once more on whatever lands from PR #57, in EN and ES, to confirm current start-time grading, current New Hire/tour copy, and current pay-stub flow match what's described above — this spec assumes a lot about current behavior that should be confirmed fresh, not from this survey alone.
- Get owner answers to the six decisions above.

## Phase 1: onboarding sequence and Job Card shape

- Build the New Hire screen (Maria + Darnell introduction, per decision 1's confirmed placement), gated by a new story flag alongside `simulator-welcome-seen`; wire Studio resets (`jump-to-preset.ts`) to clear it the same way.
- Remove `ListIntroSpotlight` and `shouldShowListIntro`; leave `MyJobPanel` reachable as an optional, uncelebrated overview.
- Simplify the Job Card header: day/task orientation + collapse control only; move Help near the body instruction; relocate repositioning controls per decision 4; keep keyboard movement, read-aloud, and labels working.
- Add the optional "practice moving/hiding the card" flow, modeled directly on `CardPractice`'s stage machine; skip it entirely wherever the card is docked/fixed.
- Add `facts`/emphasis fields to `JobCardStep` and `job-card-context.tsx` per decision 2; render as semantic bold; keep plain-text read-aloud; make Story and Lesson both read from this one field so there's no second panel.

## Phase 2: task content and pacing

- Rewrite the start-time email prompt and corner-line copy (EN+ES); confirm/extend `startTimeVerdict` only if Phase 0 shows gaps against the spec's accept/reject list.
- Change the opening completion line to "You replied to your new manager and coworker." (+ ES).
- Move the shift facts (day/time) out of the summary form and into the Job Card's new `facts` field; leave the form's own controls alone.
- Keep the apron location in the Job Card throughout Darnell's task, including after a wrong answer, sourced from the same content the introduction uses.
- Bold start time / net pay / hours worked in the relevant Job Card lines via the new emphasis field.
- Build the reading-pause stage (decision 3) for the five listed tasks: save completion immediately, defer handoff/celebration (the `celebrating` boolean in `progress-context.tsx` / `JobCard.tsx`) until acknowledged, resume a pending pause after reload, and make sure it only applies going forward (no backlog replay for already-completed tasks). Lesson mode skips it (`useLesson()` branch, per AGENTS.md).

## Phase 3: pay-stub workspace

- Rework `PaystubTask.tsx` to render `PdfSheet` inline instead of `openApp("pdf", ...)`; drop the `backToBrowser` workaround entirely.
- Side-by-side above 900px container width, stacked below; keep fit-to-width/zoom/scroll.
- Keep the stub visible for both questions; keep the existing `TimeRecord` comparison for the hours question.
- Update `useShowMe()` targets to the embedded `PdfSheet`'s existing `data-showme` attributes (`stub-net-pay`, `stub-hours`) — they already exist, just need to resolve inline instead of in a separate app.
- Preserve answer/draft progress across tab changes and reopens (`useTaskDraft`, already the pattern elsewhere in Act I).
- Apply the same layout in Lesson mode.

## Phase 4: verification, then sign-off

- Unit coverage: time-detail grading, New Hire eligibility, reading-pause ordering, acknowledgment/reset, bilingual fact content.
- E2E: full welcome → New Hire → Day 1 sequence with reload at each transition; optional card practice by pointer and keyboard; reading a response without losing a draft or double-crediting; facts staying visible while writing; pay-stub reading + both answers + wrong-answer recovery + Show me, no app switch.
- `npm run check` and `npm run test:e2e`, EN/ES, at desktop/Chromebook/zoom-equivalent/phone widths, including shared Job Card and Lesson regressions.
- Manual pass: real browser zoom, keyboard-only, and a short learner playthrough for pacing/comprehension before this is called done.
- Owner sign-off before anything past Act I (Act II fix-up, already separately planned in `act-2-fixup-plan.md`, remains blocked on this).
