-- Additive rollout: apply before deploying code that reads opening_replies.
-- No existing completions, learner records, or assessment results are changed.
CREATE TABLE IF NOT EXISTS opening_replies (
  learner_id uuid NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  message_id text NOT NULL,
  response text NOT NULL,
  lang text NOT NULL,
  saved_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT opening_replies_learner_message_uq UNIQUE (learner_id, message_id)
);
