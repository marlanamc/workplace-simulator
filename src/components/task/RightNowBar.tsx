import type { LucideIcon } from "lucide-react";
import { MapPin, HelpCircle } from "lucide-react";
import type { Lang, Localized } from "@/lib/task-types";

/**
 * Persistent "what to do right now" instruction, replacing TaskDispatchStrip
 * with per-step progress dots plus optional Show-me/Help affordances. The
 * step count/index are the task's own state; this component only renders it.
 */
export default function RightNowBar({
  icon: Icon,
  stepIndex,
  stepCount,
  instruction,
  lang,
  rightNowLabel,
  onShowMe,
  showMeActive,
  showMeLabel,
  onHelp,
}: {
  icon: LucideIcon;
  stepIndex: number;
  stepCount: number;
  instruction: Localized<string>;
  lang: Lang;
  rightNowLabel: Localized<string>;
  onShowMe?: () => void;
  showMeActive?: boolean;
  showMeLabel?: Localized<string>;
  onHelp?: () => void;
}) {
  const otherLang: Lang = lang === "en" ? "es" : "en";

  return (
    <div className="flex items-center gap-4 border-t border-[#f3d9ae] border-b-2 border-b-[#e37400] bg-[#fff8ec] px-5 py-3">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0b57d0] text-white">
        <Icon size={24} strokeWidth={2.25} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2.5">
          <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#b06000]">
            {rightNowLabel[lang]} · {stepIndex + 1} / {stepCount}
          </span>
          <span className="flex gap-1">
            {Array.from({ length: stepCount }, (_, i) => (
              <span
                key={i}
                className="h-2 w-6 rounded-full"
                style={{ background: i < stepIndex ? "var(--success)" : i === stepIndex ? "#e37400" : "#f3d9ae" }}
              />
            ))}
          </span>
        </div>
        <p className="mt-1 text-[18px] font-medium leading-tight tracking-[-0.01em] text-[#202124]">
          {instruction[lang]}
        </p>
        <p className="mt-0.5 text-[13px] text-[#8a6d3b]">{instruction[otherLang]}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {onShowMe && (
          <button
            type="button"
            onClick={onShowMe}
            className={`inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 text-[15px] font-medium cursor-pointer ${
              showMeActive
                ? "bg-[#e37400] text-white"
                : "border border-[#e0cba6] text-[#b06000] hover:bg-[#f3e6d0]"
            }`}
          >
            <MapPin size={18} strokeWidth={2.25} aria-hidden />
            {(showMeLabel ?? DEFAULT_SHOW_ME)[lang]}
          </button>
        )}
        {onHelp && (
          <button
            type="button"
            onClick={onHelp}
            aria-label="Help"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e0cba6] text-[#b06000] hover:bg-[#f3e6d0] cursor-pointer"
          >
            <HelpCircle size={20} strokeWidth={2.25} aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}

const DEFAULT_SHOW_ME: Localized<string> = { en: "Show me", es: "Muéstrame" };
