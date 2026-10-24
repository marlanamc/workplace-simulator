-- Existing historical submissions remain distinct (NULL attempt IDs).
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS attempt_id uuid;
CREATE UNIQUE INDEX IF NOT EXISTS submissions_owner_task_attempt_uq
  ON submissions (learner_id, task_key, attempt_id);
