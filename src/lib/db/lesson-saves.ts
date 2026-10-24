import { sql } from 'drizzle-orm';
import type { LessonSaveEvent } from '../lessons/save-events';

/** Receipt insertion and summary update are one atomic PostgreSQL statement. */
export function lessonSaveStatement(owner: string, activity: string, events: LessonSaveEvent[]) {
  return sql`
    WITH accepted AS (
      INSERT INTO lesson_save_events (learner_id, activity_id, event_id, state)
      SELECT ${owner}::uuid, ${activity}, item.id::uuid, item.attempt
      FROM jsonb_to_recordset(${JSON.stringify(events)}::jsonb) AS item(id text, attempt jsonb) ORDER BY item.id
      ON CONFLICT (learner_id, activity_id, event_id) DO NOTHING
      RETURNING state, event_id
    ), contribution AS (
      SELECT jsonb_build_object(
        'version', 1,
        'attempts', sum((state->>'attempts')::integer),
        'mode', (array_agg(state->>'mode' ORDER BY (state->>'completedAt')::timestamptz DESC NULLS LAST, event_id))[1],
        'completedAt', max((state->>'completedAt')::timestamptz),
        'modes', coalesce((SELECT jsonb_agg(mode ORDER BY finished, event_id, ord) FROM (
          SELECT mode, (state->>'completedAt')::timestamptz AS finished, event_id, ord
          FROM accepted CROSS JOIN LATERAL jsonb_array_elements(state->'modes') WITH ORDINALITY AS m(mode, ord)
          ORDER BY finished DESC NULLS LAST, event_id DESC, ord DESC LIMIT 20
        ) recent), '[]'::jsonb)
      ) AS state FROM accepted HAVING count(*) > 0
    )
    INSERT INTO practice_attempts (learner_id, activity_id, version, state)
    SELECT ${owner}::uuid, ${activity}, 1, jsonb_strip_nulls(state) FROM contribution
    ON CONFLICT (learner_id, activity_id, version) DO UPDATE SET
      state = jsonb_strip_nulls(jsonb_build_object(
        'version', 1,
        'attempts', (practice_attempts.state->>'attempts')::integer + (EXCLUDED.state->>'attempts')::integer,
        'mode', CASE WHEN coalesce((EXCLUDED.state->>'completedAt')::timestamptz, '-infinity') >= coalesce((practice_attempts.state->>'completedAt')::timestamptz, '-infinity')
          THEN EXCLUDED.state->>'mode' ELSE practice_attempts.state->>'mode' END,
        'completedAt', greatest((practice_attempts.state->>'completedAt')::timestamptz, (EXCLUDED.state->>'completedAt')::timestamptz),
        'modes', (SELECT coalesce(jsonb_agg(mode ORDER BY ord), '[]'::jsonb) FROM (
          SELECT mode, ord FROM jsonb_array_elements((practice_attempts.state->'modes') || (EXCLUDED.state->'modes')) WITH ORDINALITY AS m(mode, ord)
          ORDER BY ord DESC LIMIT 20
        ) recent)
      )), updated_at = now()
  `;
}
