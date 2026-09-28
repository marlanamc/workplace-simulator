/**
 * A stored draft, if it still fits the field it was saved for; otherwise the
 * seed. A draft of the wrong shape (an old build, another field's value, a
 * hand-edited key) never reaches the task. A null seed accepts null or a
 * plain string, boolean or number.
 */
export function readDraft<T>(raw: string | null, seed: T): T {
  if (!raw) return seed;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !Object.hasOwn(parsed, 'value')) return seed;
    const value: unknown = parsed.value;
    const fits = seed === null
      ? value === null || ['string', 'boolean', 'number'].includes(typeof value)
      : typeof value === typeof seed && value !== null && Array.isArray(value) === Array.isArray(seed);
    return fits ? (value as T) : seed;
  } catch {
    // An unreadable draft never blocks the task.
    return seed;
  }
}
