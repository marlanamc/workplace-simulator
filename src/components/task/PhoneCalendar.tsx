import { PERSONAL_CALENDAR, SCHEDULE } from "@/lib/tasks/schedule/content";
import type { Lang } from "@/lib/task-types";
import PhoneFrame from "./PhoneFrame";

export default function PhoneCalendar({
  label,
  heading,
  lang,
}: {
  label: string;
  heading: string;
  lang: Lang;
}) {
  const eventDays = new Set(PERSONAL_CALENDAR.map((event) => event.dayKey));

  return (
    <PhoneFrame label={label}>
      <h3 className="px-[16px] pt-[4px] text-[22px] font-bold leading-none tracking-tight">
        {heading}
      </h3>

      <div aria-hidden className="mt-[12px] grid grid-cols-7 px-[8px]">
        {SCHEDULE.map((d) => {
          const hasEvent = eventDays.has(d.key);
          return (
            <div key={d.key} className="flex flex-col items-center gap-[3px]">
              <span className="text-[10px] font-medium text-[#6e6e73]">
                {d.day[lang].charAt(0)}
              </span>
              <span className="text-[13px] font-semibold tabular-nums">{d.dayNum}</span>
              <span
                className={`h-[4px] w-[4px] rounded-full ${
                  hasEvent ? "bg-[#ff3b30]" : "bg-transparent"
                }`}
              />
            </div>
          );
        })}
      </div>

      <ul className="mt-[4px] pb-[2px]">
        {PERSONAL_CALENDAR.map((event) => (
          <li
            key={event.dayKey}
            className="flex items-start gap-[10px] border-t border-black/10 px-[14px] py-[10px]"
          >
            <div className="w-[36px] shrink-0 pt-[1px] text-center">
              <div className="text-[18px] font-semibold leading-none tabular-nums">
                {event.dayNum}
              </div>
              <div className="mt-[3px] text-[10px] font-medium uppercase tracking-wide text-[#6e6e73]">
                {event.day[lang]}
              </div>
            </div>
            <span
              aria-hidden
              className="mt-[3px] h-[30px] w-[3px] shrink-0 rounded-full bg-[#ff3b30]"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-semibold leading-tight">
                {event.title[lang]}
              </div>
              <div className="mt-[2px] text-[12px] tabular-nums text-[#3a3a3c]">
                {event.time}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </PhoneFrame>
  );
}
