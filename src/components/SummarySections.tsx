import type { SummarySection } from "@/lib/portfolio-summary";

/** The "What I can do now" list: plain headings, first-person skill lines. */
export default function SummarySections({ sections, emptyLabel }: { sections: SummarySection[]; emptyLabel: string }) {
  if (sections.length === 0) {
    return <p className="text-[14px] text-[#5f6368]">{emptyLabel}</p>;
  }
  return (
    <div className="flex flex-col gap-4">
      {sections.map((section) => (
        <section key={section.key} data-summary-section={section.key}>
          <h3 className="m-0 text-[13px] font-medium text-[#3c4043]">{section.heading}</h3>
          <ul className="mt-1.5 flex list-disc flex-col gap-1 pl-5">
            {section.items.map((item) => (
              <li key={item} className="text-[14px] leading-snug">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
