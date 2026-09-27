# Expanded standalone lessons

The first expansion adds two computer-based follow-up situations to each of four
lessons. The original simulated tool task remains the first situation.

| Lesson | Situation 2 | Situation 3 | Estimated total |
| --- | --- | --- | --- |
| Appointment scheduling | Fit a 30-minute visit around a staff meeting and the patient's available hours | Cancel the old booking and ask for another day when no full slot fits | 25 minutes |
| Files | Find an approved current version and share read-only access | Resolve a named coworker's access request with authorized editing permission | 20 minutes |
| Email attachment | Remove an outdated attachment and replace it with the approved file | Ask for an approved copy when only a draft is available | 20 minutes |
| Report an absence | Apply a supplied contact rule to a new shift time | Follow up after an unanswered call without claiming approval | 20 minutes |

`call-out-sick` is now a published standalone lesson, bringing the library to 15.
These are authored estimates, not timed learner measurements.

## Learner experience

Each follow-up has two short source documents and a response workspace. Learners
compare facts, choose the response details, review the result, and confirm.
Attachment practice requires removing the attached old file before selecting its
replacement. Incorrect submissions preserve choices and report a specific
correction through the Job Card. Help and Guided mode support reading the sources;
On my own states the new situation's goal. English and Spanish share the same
facts and decision rules.

The follow-ups assess bounded choices, not unrestricted writing, telephone speech,
or independent operation of a real calendar or file-sharing service. The original
email/appointment task still includes its existing writing exercise. Nothing is
sent to a real recipient. Teacher-led printable packs remain separate extensions.

## Completion and state

`LessonProgressProvider` defers completion of an expanded lesson until both
follow-ups are confirmed. The final reviewed response remains visible. Practice
again resets the original task and both follow-ups. Story progress and Story
answer keys are unchanged. No database migration is required.

The existing lesson-attempt record stores completion count and support mode, not
individual decisions or drafts. Existing historical finishes remain valid and
may predate the expansion; they are not proof of finishing these new situations.
Like the existing lesson task state, unfinished follow-up work is in memory and
is not restored after reloading the page.

## Authoring and verification

- `src/lib/tasks/lesson-followups/content.ts`: bilingual sources, fields, options,
  corrections, and the pure decision checker.
- `src/components/lesson/LessonFollowups.tsx`: accessible response controls,
  attachment replacement, review, and Job Card reporting.
- `src/lib/tasks/registry.ts`: public metadata, teacher guides, and estimates.
- `src/lib/__tests__/lesson-followups.test.ts`: bilingual coverage, source/option
  integrity, every distractor, missing choices, and changed decision requirements.
- `e2e/lesson-followups.spec.ts`: real original task → follow-ups → finish,
  corrections, review/edit, replay, and English/Spanish coverage.

Run `npm run check` and the lesson browser suites. The full signed-in e2e suite
requires an isolated test database as described in TESTING.md.

Before classroom release, observe learners using the new cases in each language.
Check whether they refer to the documents, understand why the answer changes,
recover without being given the answer, and can explain the decision in a fresh
example. Completion alone does not establish transfer or workplace readiness.
