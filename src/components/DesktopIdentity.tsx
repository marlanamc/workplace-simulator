"use client";

import { Caveat } from "next/font/google";
import { Building2, Coffee, GraduationCap, HeartPulse, type LucideIcon } from "lucide-react";
import { COLLEGE_NAME, HEALTH_NAME, HQ_NAME } from "@/lib/cast";
import type { Lang } from "@/lib/desktop-content";
import type { DeskIdentity } from "@/lib/desk-identity";

function workplaceIcon(company: string): LucideIcon {
  if (company === COLLEGE_NAME) return GraduationCap;
  if (company === HEALTH_NAME) return HeartPulse;
  if (company === HQ_NAME) return Building2;
  return Coffee;
}

/** Felt-tip name on the plaque — written, not typeset. */
const writtenName = Caveat({
  subsets: ["latin", "latin-ext"],
  weight: "600",
});

/**
 * Name, title, and company under the lock-screen clock — a quiet sticky note
 * of who they are in the story, not a second instruction voice.
 */
export default function DesktopIdentity({
  name,
  identity,
  lang,
}: {
  name: string;
  identity: DeskIdentity;
  lang: Lang;
}) {
  const display = name.trim();
  if (!display) return null;

  const Icon = workplaceIcon(identity.company);

  return (
    <aside
      data-testid="desktop-identity"
      aria-label={`${display}, ${identity.title[lang]}, ${identity.company}`}
      className="relative mt-6 w-[min(100%,220px)] -rotate-[1.25deg] rounded-[2px] px-4 pb-4 pt-5"
      style={{
        background:
          "linear-gradient(165deg, #fff8e8 0%, #f6edd4 55%, #efe4c8 100%)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.55) inset, 0 10px 22px rgba(28,16,10,0.22), 0 2px 4px rgba(28,16,10,0.12)",
      }}
    >
      {/* Soft tape strip — holds the note to the desktop */}
      <span
        aria-hidden
        className="absolute -top-2 left-1/2 h-3 w-14 -translate-x-1/2 rounded-[1px]"
        style={{
          background: "rgba(255, 248, 220, 0.55)",
          boxShadow: "0 1px 2px rgba(28,16,10,0.12)",
        }}
      />
      <p
        className={`${writtenName.className} m-0 -rotate-[0.4deg] text-[24px] leading-none text-[#2a1810]`}
      >
        {display}
      </p>
      <span
        aria-hidden
        className="mt-2 mb-2.5 block h-px w-[4.5rem] bg-[#2a1810]/20"
      />
      <p className="m-0 text-[10.5px] font-medium uppercase leading-snug tracking-[0.16em] text-[#6b5340]">
        {identity.title[lang]}
      </p>
      <p className="m-0 mt-1 flex items-center gap-1.5 text-[12px] italic leading-snug text-[#8a735c]">
        <Icon size={13} strokeWidth={1.75} aria-hidden className="shrink-0 -translate-y-px" />
        {identity.company}
      </p>
    </aside>
  );
}
