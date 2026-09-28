# Workplace practice packs

Seven published lessons have bilingual teacher-led extensions: mail-reply,
mail-attach, calendar, files, spreadsheet, formula-check, and
appointment-scheduling. Open
`/lessons?teacher=1`, choose a topic, then **Workplace materials**, or open the
teacher guide inside a lesson preview. Each pack has its own public
`/lessons/<taskKey>/materials?lang=en|es` page.

## Classroom use

Complete the computer lesson first. Open a pack for a new situation that uses
the same skill in another workplace. The source documents are fictional but
contain the kinds of details a worker must compare: dates, deadlines, availability,
versions, paid receipts, and unfinished records. The teacher leads the discussion;
these are not new simulator tasks or automatically assessed attempts.

Print the learner handout for pairs or a small group. It has the documents and
a short **Your task** section: two to four plain questions with lines to write
on (or blank grid cells to fill). The print view excludes teacher prompts and
answer notes. Let learners point, speak, or write in either language.
Ask what evidence supports a choice before introducing the changed situation.
Accept reasonable wording rather than requiring the sample language. Record any
help needed separately from whether the learner reaches a supported decision.

## Authoring pattern

- Start with a role, a request, and a concrete reason the result matters.
- Provide at least two short documents that must be compared. Use plausible
  distractors, not trick questions or additional reading without a purpose.
- Include discussion prompts, observable evidence, and one changed constraint.
  A valid response may be asking for clarification when no option fits.
- Practice the same skill as the lesson, at the lesson's reading level: short
  sentences and everyday words ("I have to leave at 11:00", not "time window").
- Give the learner something to do on paper (`learnerTask`). The evidence stays
  in the teacher notes, and the printed task must not name the catch.
- Keep every visible phrase in English and Spanish. Match dates, arithmetic,
  durations, and answer notes in both languages. Workplace file and folder names
  stay in English in both, as they do in the lessons; the Spanish copy glosses
  the key words (DRAFT = borrador).
- Clearly separate the new situation from the simulator's existing facts and
  answer keys. Do not put new instructions on the learner desktop: the Job Card
  remains its only instruction voice.

Packets live in `src/lib/lessons/materials.ts`; the lightweight key list and link
helper live in `materials-links.ts`. The server renders packets only on their own
route, so their document text does not enter the learner desktop client bundle.
Adding a packet requires a published lesson, an entry in both files, and checking
its evidence against its documents. Unsupported packet URLs return 404.

## Verification and limits

Run `npm run check` and
`npx playwright test e2e/lesson-materials.spec.ts e2e/lessons-smoke.spec.ts`.
Coverage checks published-lesson wiring, bilingual content, table shape, teacher
links, language changes, print-note exclusion, phone overflow, and lesson startup.

Before classroom release, review printed English and Spanish copies with teachers
and observe a few learners using them. Automated checks do not establish reading
accessibility, independent skill transfer, or workplace readiness. These packs do
not collect responses or award completion credit, and require no migration.
