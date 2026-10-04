import type { LessonFact } from "@/lib/lessons/types";
import type { Lang } from "@/lib/task-types";

/** Plain text of a fact's value, for read-aloud (never markup). */
export function factValueText(fact: LessonFact, lang: Lang): string {
  return typeof fact.value === "string" ? fact.value : fact.value[lang];
}

/** Every fact as one spoken sentence: "Label: value. Label: value." */
export function factsSpokenText(facts: LessonFact[] | undefined, lang: Lang): string {
  if (!facts || facts.length === 0) return "";
  return facts.map((f) => `${f.label[lang]}: ${factValueText(f, lang)}`).join(". ");
}

/**
 * Reference facts a learner needs while working a step: a shift day, where a
 * bag goes, a number to copy. Shared by the Job Card (Story mode's `facts` on
 * a reported step) and Lesson mode's info card, so there is one fact
 * representation and one look, not two competing panels.
 *
 * `emphasize` renders as semantic bold (`<strong>`), never raw HTML — the
 * value stays plain text everywhere else, including read-aloud.
 */
export function FactList({ facts, lang }: { facts: LessonFact[]; lang: Lang }) {
  if (facts.length === 0) return null;
  return (
    // Label above value: side by side, a long label squeezed the value into one
    // word per line on the 420px card.
    <dl className="m-0 flex flex-col gap-2.5">
      {facts.map((fact) => {
        const value = factValueText(fact, lang);
        const exact = !/\s/.test(value);
        return (
          <div key={fact.label.en} className="flex flex-col gap-0.5">
            <dt className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#5f6368]">{fact.label[lang]}</dt>
            <dd
              className={`m-0 leading-snug ${
                exact
                  ? `font-mono select-all ${value.length > 14 ? "break-all text-[14px]" : "text-[18px]"}`
                  : "break-words text-[15px]"
              } ${fact.emphasize ? "font-semibold" : ""}`}
            >
              {fact.emphasize ? <strong>{value}</strong> : value}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
