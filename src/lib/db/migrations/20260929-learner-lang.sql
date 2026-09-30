-- The learner's language follows their account across Chromebooks (Wave 5 F-20).
-- Null for learners from before this: the simulator falls back to the device's.
ALTER TABLE learners ADD COLUMN IF NOT EXISTS lang text;
