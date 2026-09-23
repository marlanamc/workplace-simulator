# Opening email practice

Day One stays in Mail. Three brief messages repeat the same action sequence
with different purposes, not progressively harder writing requirements.

1. Maria welcomes the learner: any nonempty short reply is accepted.
2. Maria asks for confirmation of Wednesday's 10 AM start: a brief affirmative
   response is enough; no copied time, salutation, or signature is required.
3. Darnell asks where clean cups are stored: the Job Card supplies the shelf
   under the counter. Accept a short location reply in English or Spanish.

The third message uses an objective instead of repeated click instructions.
Help and Show me restore explicit guidance for that message. Errors keep the
response editable. There is no timer, skip, or automatic extra repetition.
The later apron email remains a return to replying after other work.

Each reply is stored once for the authenticated learner. A save failure keeps
text on the device and permits retry; a successful save makes the next reply
available. The first two messages earn no separate points or mastery claims.
The third completes the existing mail-reply task and triggers one celebration.

Existing mail-reply completions remain valid without generating practice
records. Explicit Level 1 replay clears its reply records and completion;
Studio presets clear reply records before seeding their simulated progress.
Attachments move to Level 2 after the schedule task, keeping their original
completion key. New learners see 37 levels and 51 active scored tasks as before.

## Learner pilot — still required

Observe English and Spanish sessions. Record, for each reply, whether the
learner opens the correct message, uses Reply, writes, and sends; note requested
help, teacher prompts, and signs of frustration or boredom. Ask whether the
three messages felt useful or repetitive. At the later coworker task, observe
what they can do without a reminder. Do not interpret three adjacent completions
as independent mastery. Use observations to decide whether pacing needs revision.

## Rollout

Apply `src/lib/db/migrations/20260923-opening-replies.sql` before application
deployment. It only adds a table. Test both fresh and legacy accounts before
releasing. Existing earned task rows must not be backfilled or deleted.
