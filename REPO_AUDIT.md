# Repository audit — 24 October 2026

Ten fixes across two batches of five commits. This follow-up fixes ranks 6–10 only; ranks 11–40 remain open.

## Scope and evidence

The starting tree was clean (`b8125f0` is the first fix). The starting inventory contained 3,822 tracked files, including 3,216 historical audit artifacts. The review covered application routes, authentication/actions, database queries and migrations, progress and lesson persistence, task handlers and grading functions, shared UI infrastructure, the exportable workspace, configuration, CI, tests, and documentation. A source-import traversal found no orphaned application source modules. All tracked files were inventoried; text was scanned programmatically, with detailed inspection concentrated on executable logic and persistence boundaries. Historical screenshots were inventoried, not individually visually audited. This is a repository-wide static review plus targeted execution, not a claim that every UI state or possible defect has been exhausted.

Ranking is by expected likelihood of causing trouble in normal teaching, development, or operation; impact breaks ties. “Confirmed” means the code path or a focused reproduction establishes the defect. “Risk” identifies a concrete exposure whose occurrence depends on deployment, concurrency, or unusual input. Missing regression coverage is identified with each finding; it does not mean the surrounding feature has no tests.

## Fixed: ranks 1–5

| Rank | Finding and trigger | Fix and evidence | Commit |
| --- | --- | --- | --- |
| 1 | **Status-sheet grading rejects Spanish formulas and accepts circular totals.** `isValidSumFormula` accepted only `SUM`, and accepted any range starting before row 3 and ending after row 5, including `B2:B7` where B7 is the total. High likelihood when a learner uses Spanish syntax or selects one extra row. | Accept `SUM`/`SUMA`, case/spacing, reversed and absolute references. Permit the text header but exclude row 0, incomplete data and the total cell. Ten regression cases in `status-total.test.ts`. | `b8125f0` |
| 2 | **Lesson retry saves can duplicate transferred finishes or erase newer recovery data.** A failed transfer was merged into the buffer, then added again on reload. Overlapping PUTs could finish out of order; an earlier success removed the newer local retry copy. | Serialize PUTs within a mounted lesson, acknowledge only the latest snapshot, retain transfer identity in the buffer, and clear transferred data on successful retry. Preserve old bare-buffer compatibility and library done badges. Deferred-promise unit tests plus a mocked-API browser test reproduce failure → reload → retry. Cross-tab conflicts were addressed in follow-up rank 9 below. | `0333dbe` |
| 3 | **Edited teacher notes disappear from the learner's unread queue.** `setSubmissionNote` retained `seenAt` from the old note. The form also let rejected promises escape and Cancel restored the original prop rather than the latest saved edit. | Reset the read receipt when updating a note; catch failed saves and keep the draft; retain the confirmed note for Cancel and disable editing while saving. Query regressions cover renewed unread status and database failure. Authenticated browser delivery was not exercised here. | `4937108` |
| 4 | **The migration runner skips a configured local database.** `npm run build` ran plain Node before Next loaded `.env.local`, so migrations silently skipped while the application subsequently connected to that database. The documented manual migration command had the same problem. | Load Next's production-build environment before resolving `DATABASE_URL`, using the same variable as the application. Tests run the real environment loader in isolated child processes with a fake SQL client: production-file precedence, shell override, filename ordering and failure termination. No real migrations were applied. | `b472704` |
| 5 | **Calendar grading pairs a proposed day with the old invitation's time.** “Wednesday at 7 AM does not work. Thursday at 11 AM works.” failed; reversing those same sentences passed. The grader used the first time anywhere in the message. | Associate the time with the selected day, bounded by other day mentions and sentences. Also accept time-before-day phrasing and dotted AM/PM. Nine EN/ES regression cases preserve rejection of out-of-shift and missing proposed times. | Fifth commit: `fix: associate calendar reply times with their proposed day` |

## Follow-up fixes: ranks 6–10

### 6. Formula-check can freeze the learner's tab on a large range — FIXED (follow-up 1/5)

`src/lib/tasks/formula-check/content.ts`, `rowsOf`, builds an array by looping over every row between the typed endpoints. A pasted or mistyped `=SUM(H2:H999999999)` allocates/loops before deciding the range is wrong. Bound the supported row interval before expansion. Missing test: very large endpoints must return promptly without allocation proportional to the input number.

The same function deduplicates explicit additions with `new Set`. `=H2+H3+H4+H5+H6+H6` is accepted as the correct sum even though it counts H6 twice in a real sheet. Missing test: repeated cell terms must not be treated as one term.

**Follow-up fix:** Validate safe, worksheet-bounded endpoints before expansion and reject repeated terms instead of deduplicating them. `formula-range-bounds.test.ts` covers huge/reversed ranges, unsafe integers, repeated additions and existing adjacent-row diagnostics.

### 7. A failed lesson-session read is reported as a guest session — FIXED (follow-up 2/5)

`src/app/lessons/useLessonSave.ts` maps non-OK GET responses and network failures to `who = null` and status `guest`. A signed-in learner who encounters a 503 then finishes writes to the guest key, and normal account reloads do not merge it without an explicit transfer. `retry()` cannot recover because it requires an owner. Missing test: authenticated GET 503 → finish → service restored → retry/reload, without signing in again.

Session failures now surface as errors. Retry rechecks identity, and finishes made during the outage stay in a per-tab pending buffer until a confirmed session can receive them. Regression coverage mocks failed lookup and retry without database writes.

### 8. Finishing a lesson before the initial GET resolves loses the finish from current account state — FIXED (follow-up 3/5)

In `useLessonSave.ts`, `finish()` can record while `owner.current` is still null. When the GET resolves, initialization replaces `current.current` with the server/buffer snapshot. The in-flight guest finish is not included in that snapshot. Missing test: hold the initial GET, finish a short lesson, then release the GET and verify one account finish.

Finishes now wait in the unresolved buffer while identity is loading, then merge into the confirmed guest or account state. Browser regressions hold the GET until after completion and verify the merged count in both cases.

### 9. Concurrent lesson tabs overwrite each other's counts — FIXED (follow-up 4/5)

`src/app/api/lessons/route.ts` replaces the entire attempt JSON on conflict. Two tabs reading count 2 and each finishing once can both PUT count 3; an old tab can also reduce a newer count. The new per-instance queue does not solve concurrency across tabs/devices. Use server-side attempt events or versioned writes with explicit conflict handling. Missing test: two clients start at the same revision and both finish.

Finish events now carry durable IDs. One atomic PostgreSQL statement inserts unseen receipts and increments the aggregate, preserving existing counts. Per-event local buffers survive simultaneous tab writes; replayed IDs are no-ops. The additive `20261024-lesson-save-events.sql` migration is required before deployment. Unit, mocked-browser and isolated real-PostgreSQL regressions cover concurrent tabs, stale batches, lost acknowledgements and transfer replay.

### 10. Repeated writing-save retries create duplicate teacher submissions — FIXED (follow-up 5/5)

`src/lib/progress-context.tsx`, `markComplete`, saves writing before completion/award. If the writing succeeds but completion or its acknowledgement fails, Retry inserts the writing again through `src/lib/db/queries.ts`, `recordSubmission`. Each row appears independently in the teacher review queue. A stable submission-attempt identifier is needed; content equality alone would collapse intentional revisions. Missing test: writing succeeds → completion fails → retry creates exactly one submission for that attempt.

Pending writing saves now persist a stable attempt UUID before the first request. Retries reuse it, including after reload; a fresh submission after success receives a new ID even with identical text. A unique learner/task/attempt index makes repeated inserts no-ops without touching teacher notes or revision history. The additive `20261024-submission-attempts.sql` migration preserves existing rows. Unit and isolated PostgreSQL tests cover failed completion after writing, concurrent retries and deliberate revisions.

## Remaining findings, ranked

### 11. Studio resets can resurrect old failed saves — FIXED (batch 3, 1/5)

`src/app/studio/jump-to-preset.ts` clears drafts, story flags and arrival state but leaves `workplace:pending-saves:<learnerId>`. The new desktop restores that queue; Retry can re-add a task outside the chosen preset. Missing test: seed a failed completion/writing payload, jump to Fresh account, and verify it cannot be replayed.

The successful Studio jump now removes the current learner’s pending completion/writing queue before navigation. Behavioral tests verify successful cleanup, owner isolation and preservation when the server rejects the reset.

### 12. Studio/replay database changes are not atomic — FIXED (batch 3, 2/5)

`src/lib/db/queries.ts`, `replaceProgress`, clears opening replies, completions and badges in separate requests, then inserts replacements. A failed later request leaves a partially reset account. `deleteCompletions` clears opening replies separately, and `restartLevelProgress` deletes completion and badge state separately. Missing tests: inject failure after each mutation and assert the old complete state survives. Use one transaction/batch for each logical reset.

Studio replacement, completion deletion and level replay now each execute one transactional Neon batch. Replay includes its track-badge deletion in the same batch. Failure-injection regressions verify rollback after every mutation, with owner and level isolation.

### 13. Studio does not reset server skill rungs — FIXED (batch 3, 3/5)

The Studio client removes local rung state, but `replaceProgress` does not clear `skill_rungs`. The next desktop load restores the old server values. “Fresh account” can therefore have mature guidance levels, concealing first-run problems. Missing test: a high-rung account reset to Fresh should have the intended fresh support state. Decide explicitly whether submissions also belong in a preset reset; currently they survive too.

All Studio presets now clear server skill rungs inside the reset transaction, matching the existing device cleanup. Seeded completions do not imply mastery. Writing submissions and teacher feedback explicitly remain review history; this policy is documented in `TESTING.md`. PostgreSQL tests cover Fresh and later presets, rollback and owner isolation.

### 14. Enrollment writing disappears on reload before submission — FIXED (batch 3, 4/5)

`src/app/browser/CollegePortalTask.tsx` keeps the enrollment statement in plain `useState("")`, unlike tasks using `useTaskDraft`. Reloading an unfinished application discards the statement. Missing test: type enrollment text, reload, and restore it, scoped to the learner. Other transient task state needs a documented persistence contract; not every UI selection needs saving.

Enrollment now uses `useTaskDraft` for its statement, preserving the existing restart behavior and in-memory lesson isolation. The persistence contract is documented in `TESTING.md`. Browser component regressions exercise the real task and storage in English and Spanish across reloads and account changes.

### 15. A missed skill run does not break a clean-run streak — confirmed, medium

`src/lib/release-ladder.ts`, `recordMissedRun`, preserves `cleanRunStreak` on the first miss. Reproduction: rung 2 with one clean run → miss → clean advances to rung 3. That contradicts the streak model implied by the field and clean-run threshold. Missing test: clean/miss/clean must not count as consecutive clean runs. Clarify the intended rule if non-consecutive runs are actually desired.

### 16. Gap decay can apply repeatedly without any new elapsed time — confirmed, medium when only the local cache exists

`applyGapDecay` lowers the rung but keeps the same old `lastPracticedAt`. Applying it twice for the same date turns rung 4 → 3 → 2. Provider initialization saves the decayed local copy, so repeated reloads can repeatedly decay a locally cached skill if no server value replaces it. Missing test: decay is idempotent for the same gap/date; record a decay checkpoint separately from actual practice time.

### 17. The guidance ladder treats unobserved performance as clean performance — confirmed design risk, medium

`ProgressProvider.markComplete` automatically calls `applySkillRun(taskKey, true)` for tasks that did not explicitly report a skill run. Most task handlers use `useNudge` rather than reporting misses/help use. A completion after many corrections can therefore increase a clean-run rung. Missing tests: help use and wrong attempts in representative automatically tracked tasks must produce the intended rung transition. This should not be presented as assessed mastery.

### 18. Runtime submission validation is missing — confirmed exposure, medium under malformed input; high impact

`src/app/actions.ts`, `recordWritingSubmission`, trusts its TypeScript `SubmissionContent` argument at runtime and accepts any task string. An authenticated malformed action request can persist `{lang:"en", fields:{}}`. `src/app/teacher/SubmissionCard.tsx` then calls `content.fields.map`, breaking the class dashboard; desktop restoration similarly trusts stored shapes. Missing tests: malformed action payloads are rejected and malformed legacy rows cannot crash a whole page.

Other action inputs also remain insufficiently checked: `completeTask` accepts arbitrary task/badge/confidence values; `awardCertificate` accepts arbitrary tracks; `syncSkillRun` accepts arbitrary rung/streak/date values. Missing tests: invalid keys, numbers, dates and badge setting prefixes. TypeScript is not a server security boundary.

### 19. Open tabs can save against a different account after sign-out/sign-in elsewhere — confirmed exposure, medium on shared devices

The lesson hook remembers owner A, but its PUT carries only attempt state. The API resolves the current cookie, which may now belong to B. The old tab can write A's attempt count under B, then remove A's retry buffer on success. Story actions similarly derive ownership from the current cookie while old UI can still hold the previous learner's work. Missing test: open A in one tab, switch to B in another, attempt a save in the old tab, and reject/reload instead of attributing it to B. Keep server authentication authoritative while checking the UI's expected session identity.

### 20. Retry/draft storage is not deeply validated — confirmed exposure, medium after stale/corrupt storage

`src/lib/storage.ts`, `getJSON`, accepts any object as any generic type; a pending-save queue containing `{}` later fails on `.filter` or iteration. `src/lib/task-draft.ts`, `readDraft`, checks only top-level type/array shape, so `{value:[null]}` is accepted for résumé string bullets and crashes string-based grading. Missing tests: malformed pending arrays, array element types, nested message/commitment records, and enum-like nullable drafts. Validate at each storage boundary with the expected shape.

### 21. Local persistence failures are silently discarded — confirmed risk, medium in storage-restricted browsers

`storage.setJSON`/`setString` return no success signal, even though they now store important pending submissions and unsaved writing. If storage is unavailable or full, the in-memory retry works only until reload. The wrapper's comment still describes all callers as non-load-bearing. Missing test: force storage writes to throw, fail the server save, then verify the user receives an accurate recovery state through the Job Card.

### 22. Skill synchronization can lose newer state — confirmed race/failure mode, medium

`applySkillRun` fires `syncSkillRun` without serializing or catching transport rejections. The database upsert blindly replaces state; older requests can arrive last. On load, every server rung overrides the corresponding local rung even if the local practice timestamp is newer. Query-level failures are also swallowed by `upsertSkillRung`, so callers cannot tell that persistence failed. Missing tests: reordered writes, failed sync followed by reload, and newer local versus older server state.

### 23. Account creation and badge awards use check-then-insert without uniqueness — confirmed race, medium-low

`loginOrSignup`/`findLearner`/`createLearner` can create duplicate normalized name/class accounts concurrently; the schema has no unique constraint for that identity. `awardBadge` has the same pattern for learner/badge. Later sign-in chooses the earliest duplicate, potentially making progress on another row inaccessible. Missing tests: concurrent creation and concurrent badge award. Existing duplicate data needs a migration plan before adding constraints.

Two different learners sharing the same first name and class code also compete for one login identity regardless of PIN; this is a product identity limitation, not solved by uniqueness alone.

### 24. Four-digit PIN authentication has no repository-level attempt throttling — confirmed exposure, occurrence depends on abuse

`src/app/login/actions.ts` checks unlimited PIN guesses and returns a distinct wrong-PIN error for an existing account. This applies to teacher accounts too. No application-level throttling/backoff is present in this repo; deployment-level controls were not inspected. Missing tests: repeated failed attempts, recovery after a cooldown, and enumeration resistance. Keep the low-friction classroom flow while limiting automated guessing.

### 25. Signed session tokens never expire on the server — confirmed exposure, occurrence depends on token capture

`src/lib/auth.ts` signs only the learner ID. Browser cookie `maxAge` is six months, but `decodeSession` validates no issued/expiry timestamp, and logout only deletes the browser copy. A copied valid token remains reusable until the secret changes or the account disappears. Missing tests: server-enforced expiry and revocation policy. This is separate from the otherwise tested HMAC tamper protection.

### 26. Migration history cannot bootstrap a fresh database — confirmed, medium-low during provisioning

The SQL directory contains additions for opening replies, practice attempts and learner language, but no baseline creating learners, completions, badges, submissions or skill rungs. The first migration references `learners`; migrations alone fail on an empty database. CI currently relies on schema push to supply the base. Missing test: run the checked-in migrations from an empty disposable database and compare all tables/columns/constraints to `schema.ts`.

The runner still treats missing `DATABASE_URL` as a successful skip, including a misconfigured deployment. This is a deliberate local-build allowance with no production-specific guard; add a deploy-environment test if production builds must fail closed.

### 27. Concurrent CI runs share and truncate the same test database — confirmed risk, medium-low when PRs overlap

`.github/workflows/e2e.yml` empties every table in the configured test database. There is no shared concurrency group or per-run database allocation. One PR run can erase another run's accounts midway through its browser tests. Missing test/operational check: overlapping workflows must be serialized or isolated. Cancelling a job without waiting for database operations is not full isolation.

### 28. The local Playwright port override does not configure the dev server — confirmed, medium-low

`playwright.config.ts` uses `E2E_PORT` for `baseURL`, but the development command remains `npm run dev` with its default port 3000. On a cold run with `E2E_PORT=3100`, Playwright waits for the wrong port. This audit explicitly started its own server on 3100. Missing test: cold-start configuration with a non-default port. `reuseExistingServer: true` also risks testing a stale local server/build with different environment settings.

### 29. Replay and route changes can race with saves — risk, medium-low

`ProgressProvider` has a per-task in-flight guard but no shared generation/transaction boundary with `restartLevel` or route selection. A completion resolving after a reset can restore removed progress. `chooseCourseRoute` also has no internal serialization/stale-response guard; correctness depends on every caller disabling repeat actions. Missing tests: delayed completion plus replay, and reversed route-save completion order.

### 30. Studio and several background actions leave transport errors unhandled — confirmed, medium-low

`ProgressPresets.apply` and `DemoTour.go` await a jump without `try/finally`; a rejected server action can leave controls permanently busy and a blank demo tab open. `dismissFeedback`, bridge-path persistence and some skill sync calls fire promises without handling rejection. Missing tests: injected action rejection restores controls and retains retryable state. Route/writing save recovery already provides a better pattern.

### 31. Health probing can report a false positive across schemas — confirmed query limitation, low unless search_path is customized

`src/app/api/health/route.ts` unions columns for all schemas in `current_schemas(false)` by table name. If the first resolved `learners` lacks a column but a later schema's table has it, the merged shape looks complete even though ordinary app queries resolve to the incomplete first table. The probe also checks presence, not types or uniqueness constraints. Missing tests: duplicate names across schemas with different column sets, and constraint drift.

### 32. Lesson attempt limits are inconsistent — confirmed boundary defect, low in normal use

`parseAttempt` rejects counts over 10,000, while `recordFinish` and `mergeAttempts` can generate larger counts. The app can create an attempt it cannot save or read back. `completedAt` comparisons in merge use string order even though the parser accepts non-canonical parseable timestamps, so offsets can also select the wrong latest mode. Missing tests: count boundary, merged overflow, and equivalent instants with different timezone offsets.

### 33. Several grading rules remain keyword checks rather than factual checks — confirmed bounded-design risk

Examples: `tasks/research/content.ts`, `whyHoldsUp`, accepts the substring “library” even in “This is not a library source”; `tasks/shift-review/content.ts` can accept unrelated three-word text containing 11 unless it explicitly denies busy; `tasks/team-schedule/content.ts`, `emailMentionsShift`, accepts “Saturday at 4 AM” although the taught shift is the afternoon close. These should be treated as bounded practice checks. Missing tests: negated-source claims, unrelated numeric sentences, and explicit AM/PM contradictions. More regex rules alone do not establish unrestricted language understanding.

### 34. Summary language can ignore the account preference — confirmed, medium-low for direct links

`src/app/summary/page.tsx` fetches the learner but does not pass their saved language. Without `?lang`, `SummaryView` falls back to device storage, then English. A Spanish-account learner opening `/summary` directly on a new device can get English even though the desktop honors the account preference. Missing test: direct summary navigation with account Spanish and empty or English device storage.

### 35. Teacher review does not refresh its parent queue after saving a note — confirmed, low-medium

The note form now preserves its own confirmed value, but the server-rendered “Needs your review” section and count remain from page load until navigation/reload. It does not refresh/revalidate the dashboard. Missing test: after note save, the item moves to Reviewed and both counts update. This is left separate from the fixed unread-delivery bug.

### 36. All task screens are eagerly imported into the browser bundle — confirmed performance risk, device impact unmeasured

`src/app/browser/tab-components.tsx` statically imports the full task catalogue, reached from `BrowserClient` and the lesson desktop. A single beginner lesson pulls the task module graph into the client build. On low-powered classroom devices this may affect startup and parse time. Missing measurement: production bundle report and cold-start timing on a representative Chromebook; evaluate dynamic imports against navigation needs before changing them.

### 37. Exportable workspace has tab identity and updater-purity defects — confirmed, low exposure

`src/exportable-workspace/BrowserShell.tsx` gives a blank new tab `key: "mail"`. After closing the real Mail tab, `openApp(mail)` can match the blank tab and activate it without opening Mail. `closeTab` also calls `setActiveKey` inside a `setTabs` updater, contrary to the purity pattern enforced elsewhere in the repo. Missing tests: Mail closed → blank tab → open Mail, closing the final tab, and StrictMode behavior. The kit is reachable through `/exportable-workspace`, so it is not dead source.

### 38. Five default starter SVGs are unused — confirmed dead assets, low

No source, public metadata or curriculum references were found for:

- `public/file.svg`
- `public/globe.svg`
- `public/next.svg`
- `public/vercel.svg`
- `public/window.svg`

They are cleanup candidates, not runtime defects. They were not deleted because cleanup falls below the five selected fixes. Redirect routes, report-only components such as `NudgeToast`/`TaskDoneActions`, and the exportable workspace are intentionally reachable and should not be deleted merely because they look obsolete.

### 39. The checked-in historical audit archive adds about 942 MB — confirmed maintenance risk

`Story Audit Progress (1)/` contains 3,216 files: 3,154 PNGs, 22 JPGs, and scripts/logs/reports. Its working-tree file bytes total 941,755,459 (about 898 MiB). These are historical evidence rather than application dependencies. They increase checkout/clone/indexing cost; the broad TypeScript include also brings archived `.ts` probes into typechecking even though the main Playwright config does not run them. Consider artifact storage and explicit build exclusions, preserving evidence and links. No history rewrite or archive deletion was performed.

### 40. Tests and docs sometimes promise broader guarantees than they verify — confirmed coverage/documentation risk

Many integrity tests inspect source strings or structural wiring; they can pass without exercising the handler/provider/database interaction. The initial 2,880 passing tests missed all five fixed defects. Keep these cheap checks, but add behavioral tests for persistence and concurrency boundaries above.

Specific stale statements: `TESTING.md` and the health-route comment say there are no migration artifacts despite the SQL directory; `storage.ts` says no caller is load-bearing despite saved-writing retries; Studio's demo copy describes only three directions while the route chooser includes College and Pause. The README's before-deploy manual opening migration guidance overlaps the automated migration section. Missing validation: documentation examples and provisioning instructions tested against current scripts. Manual Chromebook zoom, keyboard/screen-reader, printed-material and learner-transfer pilots remain explicitly open in the existing curriculum docs; smoke tests do not close them.

## Initial audit verification and limits

- Baseline: `npm run check` passed — 87 files, 2,880 unit tests.
- Each of the five fix commits was preceded by a passing `npm run check` (lint, TypeScript, unit tests).
- Final code checks: 90 test files, **2,907 unit tests passed**.
- Browser command: `E2E_PORT=3100 npx playwright test e2e/lessons.spec.ts e2e/lesson-library.spec.ts e2e/lessons-smoke.spec.ts e2e/lesson-save-retry.spec.ts --grep-invert saving --workers=2` — **134 passed**. The new mocked retry test also passed independently.
- The browser run covers guest lesson/library behavior and all reachable task startups in English and Spanish. It ran before the final pure calendar-grader change; that change passed the full unit suite with nine additional regressions.
- The configured local database was not identified as a dedicated test database. The account-creating/full authenticated browser suite was not run against it. No schema push, migration, reset or other database mutation was performed in that initial batch.
- Migration tests use isolated fixture directories and an injected SQL client; they do not prove live Neon transaction or schema behavior. A production build/deploy and real learner pilot were not performed.
- The initial batch made exactly five fix commits; the follow-up below adds exactly five more.


## Follow-up verification and limits

This batch fixes only ranks 6–10, in order, one commit per issue:

| Rank | Commit | Result |
| --- | --- | --- |
| 6 | `0cbbe33` | Bound formula ranges and reject duplicate references. |
| 7 | `5e38799` | Recover lesson saves after session lookup failures. |
| 8 | `6c3a50d` | Retain lesson finishes while identity is loading. |
| 9 | `c1fe561` | Count concurrent lesson finish events atomically. |
| 10 | Fifth follow-up commit, containing this report | Deduplicate retries of one writing submission while retaining intentional revisions. |

- `npm run check` passed before each commit. Final run: `SAVE_TEST_PG_PORT=55439 npm run check` — lint and TypeScript passed; **94 test files, 2,924 tests passed**, including all four optional PostgreSQL cases (see `TESTING.md`).
- Guest/mocked browser regressions: **139 passed**, including all lesson startups in both languages, session errors, delayed lookup, lost acknowledgements and two concurrent tabs. These ran after the lesson-persistence changes; the final writing fix is covered by unit/action tests and the real database regression.
- Real PostgreSQL: **4 integration tests passed** against an isolated temporary local cluster and `workplace_save_test`, including both new migrations applied twice. Tests cover concurrent increments, duplicate/out-of-order events, transferred aggregates, writing saved before completion fails, concurrent submission retries, teacher-note preservation and intentional identical revisions.
- Both additive migrations must run before deployment: `20261024-lesson-save-events.sql` and `20261024-submission-attempts.sql`. The existing build migration runner includes them. They were tested only in the isolated cluster; the configured learner database was not modified.
- Full authenticated browser flows against Neon, a production deployment and learner pilots were not run. Old legacy lesson snapshots have no event IDs; migration conservatively sends only their excess over the current server count. Previously lost concurrent increments or already duplicated submissions cannot be reconstructed automatically.
- Ranks 11–40 remain deliberately open. No sixth follow-up fix was made.
