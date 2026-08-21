"use client";

import { useState } from "react";
import Link from "next/link";
import { APP_DEFS, DESKTOP_COPY, TASK_KEYS, type Lang, type TaskKey } from "@/lib/desktop-content";
import Shelf, { AppIcon, SHELF_HEIGHT } from "@/components/Shelf";

export default function DesktopClient({
  displayName,
  completedTaskKeys,
}: {
  displayName: string;
  completedTaskKeys: TaskKey[];
}) {
  const [lang] = useState<Lang>("en");

  const c = DESKTOP_COPY[lang];
  const focusApp = APP_DEFS[0];
  const mailDone = completedTaskKeys.includes("mail");
  const doneCount = TASK_KEYS.filter((k) => completedTaskKeys.includes(k)).length;

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden text-[15px]"
      style={{ color: "var(--text-primary)", paddingBottom: SHELF_HEIGHT }}
    >
      {/* wallpaper */}
      <div
        className="fixed inset-0 -z-10"
        style={{ background: "linear-gradient(155deg, #3f6fd1 0%, #6b7fe0 45%, #a679d8 78%, #c98fd6 100%)" }}
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,241,199,0.55) 0%, rgba(255,241,199,0.18) 22%, transparent 42%)",
        }}
      />

      {/* top strip: practice banner */}
      <div className="flex items-center px-5 py-4">
        <div className="flex items-center gap-2 text-[12px] font-medium tracking-wide text-white/85 uppercase">
          {c.practiceBanner}
        </div>
      </div>

      {/* single focus card — one task, one action */}
      <div className="flex-1 flex items-center justify-center px-5 pb-8">
        <div className="w-full max-w-[420px] rounded-2xl bg-white p-7 flex flex-col gap-5 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_20px_44px_rgba(20,20,50,0.28)] animate-fade-up">
          <div className="flex items-center gap-3">
            <AppIcon icon={focusApp.icon} color={focusApp.color} size={44} />
            <div>
              <div className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-wide text-[var(--accent)]">
                {c.nextLabel}
                {mailDone && (
                  <span className="rounded-full bg-[var(--success-tint)] px-2 py-0.5 text-[10px] font-semibold text-[var(--success)]">
                    {c.done}
                  </span>
                )}
              </div>
              <div className="text-[21px] font-medium leading-tight text-[var(--text-primary)]">
                {c.focusHeadline}
              </div>
            </div>
          </div>

          <p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">
            {lang === "en"
              ? "Maria needs last month's safety report. Open the Browser, read her email, and reply with the file."
              : "Maria necesita el reporte de seguridad del mes pasado. Abre el Navegador, lee su correo y responde con el archivo."}
          </p>

          <Link
            href="/browser?tab=mail"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[var(--accent)] px-6 text-[16px] font-medium text-white hover:bg-[var(--accent-hover)]"
          >
            {c.focusCta}
          </Link>

          <div className="flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-muted)]">
              <div
                className="h-full rounded-full bg-[var(--accent)]"
                style={{ width: `${Math.round((doneCount / TASK_KEYS.length) * 100)}%` }}
              />
            </div>
            <span className="whitespace-nowrap text-[13px] font-medium text-[var(--text-tertiary)]">
              {doneCount}/{TASK_KEYS.length} {c.progressWord}
            </span>
          </div>
        </div>
      </div>

      <Shelf displayName={displayName} />
    </div>
  );
}
