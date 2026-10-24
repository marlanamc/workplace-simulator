-- Receipts make each lesson finish/guest transfer safe to retry across devices.
CREATE TABLE IF NOT EXISTS lesson_save_events (
  learner_id uuid NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  activity_id text NOT NULL,
  event_id uuid NOT NULL,
  state jsonb NOT NULL,
  UNIQUE (learner_id, activity_id, event_id)
);
