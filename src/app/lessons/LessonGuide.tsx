import type { Lang, Localized } from "@/lib/task-types";
import type { TeacherGuide } from "@/lib/lessons/types";
import { TEACHER_COPY } from "@/lib/lessons/copy";

/** The teacher guide for one lesson. Teacher preview and the library both show it; students never do. */
export default function LessonGuide({ guide, lang }: { guide: TeacherGuide; lang: Lang }) {
  const list = (title: Localized, items: Localized[]) =>
    items.length ? (
      <section className="min-w-0">
        <h3 className="m-0 text-[15px] font-semibold text-[#202124]">{title[lang]}</h3>
        <ul className="mt-1.5 mb-0 flex list-disc flex-col gap-1 pl-5 text-[15px] leading-snug text-[#3c4043]">
          {items.map((i) => (
            <li key={i.en}>{i[lang]}</li>
          ))}
        </ul>
      </section>
    ) : null;
  return (
    <div data-testid="teacher-guide" className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {list(TEACHER_COPY.skills, guide.skills)}
        {list(TEACHER_COPY.prepare, [...guide.prepare, TEACHER_COPY.supportTip])}
        {list(TEACHER_COPY.stickingPoints, guide.stickingPoints)}
        {list(TEACHER_COPY.followUp, guide.followUp)}
      </div>
      {guide.peerHelp[lang] && (
        <p className="m-0 text-[15px] leading-snug text-[#3c4043]">
          <strong className="text-[#202124]">{TEACHER_COPY.finishedEarly[lang]}</strong> {guide.peerHelp[lang]}
        </p>
      )}
    </div>
  );
}
