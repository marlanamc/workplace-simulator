CREATE TABLE IF NOT EXISTS practice_attempts (
 learner_id uuid NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
 activity_id text NOT NULL,
 version integer NOT NULL,
 state jsonb NOT NULL,
 updated_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT practice_attempts_owner_activity_version UNIQUE (learner_id,activity_id,version)
);
