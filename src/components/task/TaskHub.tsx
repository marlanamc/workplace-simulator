import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

export interface HubItem {
  key: string;
  color: string;
  icon: LucideIcon;
  title: string;
  body: string;
  done: boolean;
  cta: string;
  onOpen: () => void;
}

/** A short board of waiting items. Used when one sitting has two or three open jobs. */
export default function TaskHub({ heading, items }: { heading: string; items: HubItem[] }) {
  const remaining = items.filter((i) => !i.done).length;
  return (
    <div className="mx-auto flex w-full max-w-[640px] flex-col gap-3 p-6">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-[20px] font-medium leading-tight text-[#202124]">{heading}</h2>
        <span className="shrink-0 text-[12px] font-medium text-[#5f6368]">
          {remaining === 0 ? "✓" : remaining}
        </span>
      </div>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.key}
            onClick={item.onOpen}
            className="flex w-full items-start gap-3 rounded-xl border border-[#dadce0] bg-white p-4 text-left hover:bg-[#f8f9fa] cursor-pointer"
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white"
              style={{ background: item.color }}
            >
              {item.done ? <Check size={18} strokeWidth={2.5} /> : <Icon size={18} strokeWidth={2.25} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="text-[15px] font-medium text-[#202124]">{item.title}</span>
                {!item.done && (
                  <span className="flex h-2 w-2 rounded-full bg-[#d93025]" aria-hidden />
                )}
              </span>
              <span className="mt-0.5 block text-[13px] leading-relaxed text-[#5f6368]">{item.body}</span>
              <span className="mt-2 inline-block text-[13px] font-medium text-[#0b57d0]">{item.cta}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
