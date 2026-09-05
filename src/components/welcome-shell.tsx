"use client";

import type { ReactNode } from "react";
import { useProgress } from "@/lib/progress-context";
import type { Lang, Localized } from "@/lib/task-types";
import {
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Mail,
  Megaphone,
  MessageSquare,
  Presentation,
  Receipt,
  Table2,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * The full-page orientation shell shared by the pre-Act-I welcome
 * (`SimulatorWelcome`) and every pre-act intro (`ActIntro`): cream background,
 * a narrow centered column, the Español toggle, and the help/contact footer.
 * The three content bands are passed in as children so each screen keeps its
 * own copy while the frame stays identical.
 */

/** Icon per skill tile. `files` is the exception — the Drive mark, not a glyph. */
export type SkillIconKey =
  | "mail"
  | "schedule"
  | "files"
  | "spreadsheet"
  | "team"
  | "incident"
  | "priority"
  | "slides"
  | "expenses"
  | "college"
  | "meeting"
  | "review";

export const SKILL_ICONS: Partial<Record<SkillIconKey, LucideIcon>> = {
  mail: Mail,
  schedule: CalendarDays,
  spreadsheet: Table2,
  team: MessageSquare,
  incident: ClipboardList,
  priority: Megaphone,
  slides: Presentation,
  expenses: Receipt,
  college: GraduationCap,
  meeting: Users,
  review: ClipboardList,
};

export interface SkillTile {
  label: Localized;
  icon: SkillIconKey;
  color: string;
  tint: string;
}

/** The Google Drive mark — the folded-ribbon triangle, same app the sim's Files opens. */
export function DriveMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 87.3 78" aria-hidden>
      <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da" />
      <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47" />
      <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335" />
      <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d" />
      <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc" />
      <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00" />
    </svg>
  );
}

/** A quiet cream-on-cream cup, so the right column has warmth without a stock photo. */
export function CafeMotif() {
  return (
    <svg viewBox="0 0 240 200" role="img" aria-hidden className="h-auto w-full max-w-[320px]">
      <ellipse cx="120" cy="176" rx="92" ry="12" fill="#e7ddca" />
      <path d="M52 78h112v40a44 44 0 0 1-44 44H96a44 44 0 0 1-44-44z" fill="#fbf7ee" stroke="#c9a26b" strokeWidth="4" />
      <path d="M164 90h18a20 20 0 0 1 0 40h-18" fill="none" stroke="#c9a26b" strokeWidth="4" />
      <path d="M52 78h112" stroke="#c9a26b" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M84 44c0-10 8-12 8-22M108 44c0-10 8-12 8-22M132 44c0-10 8-12 8-22"
        fill="none"
        stroke="#c9a26b"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="108" cy="118" r="18" fill="none" stroke="#c9a26b" strokeWidth="4" opacity="0.55" />
    </svg>
  );
}

/** The scannable icon + label row: a 2-col grid on phones, a spread row from `sm`. */
export function SkillRow({ skills, lang }: { skills: SkillTile[]; lang: Lang }) {
  return (
    <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 sm:flex sm:items-start sm:justify-between sm:gap-2">
      {skills.map((skill, i) => {
        const Icon = SKILL_ICONS[skill.icon];
        return (
          <li
            key={`${skill.icon}-${i}`}
            className="flex items-center gap-3 sm:w-20 sm:flex-col sm:gap-2 sm:text-center"
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14"
              style={{ background: skill.tint, color: skill.color }}
            >
              {Icon ? <Icon size={24} strokeWidth={2.25} aria-hidden /> : <DriveMark size={28} />}
            </span>
            <span className="text-sm leading-tight font-medium">{skill.label[lang]}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function WelcomeShell({
  testId,
  dataAct,
  children,
}: {
  testId: string;
  dataAct?: string;
  children: ReactNode;
}) {
  const { lang, setLang } = useProgress();
  return (
    <main
      data-testid={testId}
      data-act={dataAct}
      lang={lang}
      className="min-h-screen bg-[#f6f1e8] px-5 py-5 text-[#202124] sm:px-10 sm:py-8"
    >
      <div className="mx-auto max-w-[680px]">
        <div className="mb-5 flex justify-end sm:mb-6">
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            lang={lang === "en" ? "es" : "en"}
            className="min-h-11 rounded-lg border border-[#747775] bg-white px-4 text-base font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0b57d0]"
          >
            {lang === "en" ? "Español" : "English"}
          </button>
        </div>

        {children}

        <p className="mt-6 text-sm leading-relaxed">
          {lang === "en" ? "Need help? Contact Marlie at" : "¿Necesitas ayuda? Contacta a Marlie en"}{" "}
          <a
            href="mailto:mcreed@ebhcs.org"
            className="rounded-sm font-medium text-[#0b57d0] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            mcreed@ebhcs.org
          </a>
          .
        </p>
      </div>
    </main>
  );
}
