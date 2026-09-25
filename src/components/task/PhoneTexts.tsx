"use client";

import PhoneFrame from "./PhoneFrame";

export interface PhoneText {
  key: string;
  from: string;
  body: string;
  when: string;
}

/**
 * A phone's Messages list, held beside the task so a code in a text stays
 * readable while the learner types it. Each text is a button: tapping the
 * right one is the "find the real code" step, and it stays marked after.
 */
export default function PhoneTexts({
  heading,
  emptyLabel,
  label,
  texts,
  chosenKey,
  onTap,
  showMeKey,
}: {
  heading: string;
  /** Shown before any text has arrived. */
  emptyLabel: string;
  label?: string;
  texts: PhoneText[];
  /** The text the learner picked, kept highlighted. */
  chosenKey?: string | null;
  onTap?: (key: string) => void;
  /** Which text carries `data-showme="phone-text"`. */
  showMeKey?: string;
}) {
  return (
    <PhoneFrame label={label}>
      <h3 className="px-[16px] pt-[4px] pb-[8px] text-[22px] font-bold leading-none tracking-tight">{heading}</h3>
      {texts.length === 0 ? (
        <p className="min-h-[220px] px-[16px] pt-[24px] text-center text-[13px] text-[#6e6e73]">{emptyLabel}</p>
      ) : (
        <ul className="min-h-[220px] bg-white" data-testid="phone-texts">
          {texts.map((t) => {
            const chosen = chosenKey === t.key;
            return (
              <li key={t.key} className="border-t border-black/10 first:border-t-0">
                <button
                  type="button"
                  onClick={() => onTap?.(t.key)}
                  data-showme={showMeKey === t.key ? "phone-text" : undefined}
                  aria-pressed={chosen}
                  className={`block w-full px-[14px] py-[10px] text-left ${
                    chosen ? "bg-[#e8f0fe] ring-2 ring-inset ring-[#0b57d0]" : "hover:bg-[#f2f2f7]"
                  }`}
                >
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[13px] font-semibold">{t.from}</span>
                    <span className="shrink-0 text-[11px] text-[#6e6e73]">{t.when}</span>
                  </span>
                  <span className="mt-[2px] block text-[14px] leading-snug text-[#1d1d1f]">{t.body}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </PhoneFrame>
  );
}
