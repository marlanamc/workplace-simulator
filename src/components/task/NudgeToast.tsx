"use client";

import { useEffect } from "react";
import type { NudgeMessage } from "@/lib/use-nudge";
import { useProgress } from "@/lib/progress-context";
import { speakText } from "@/lib/read-aloud";

function isCard(msg: NudgeMessage): msg is Exclude<NudgeMessage, string> {
  return typeof msg !== "string";
}

export default function NudgeToast({ text, bottom = 32 }: { text: NudgeMessage; bottom?: number }) {
  const { speakAloud, lang } = useProgress();

  // Nudges are the app's main teaching channel — with Read aloud on they are
  // spoken, and for screen readers the live region below announces them.
  useEffect(() => {
    if (!text || !speakAloud) return;
    speakText(isCard(text) ? `${text.title} ${text.body ?? ""}` : text, lang);
  }, [text, speakAloud, lang]);

  return (
    <div role="status" aria-live="polite">
      {!text ? null : !isCard(text) ? (
        <div
          className="fixed left-1/2 z-[90] max-w-[520px] -translate-x-1/2 rounded-xl bg-[#3c4043] px-5 py-3.5 text-center text-[15px] font-medium leading-snug text-white shadow-lg animate-fade-up"
          style={{ bottom }}
        >
          {text}
        </div>
      ) : (
        <div
          className="fixed left-1/2 z-[90] flex max-w-[480px] -translate-x-1/2 items-start gap-3 rounded-xl border-l-[6px] border-[var(--accent)] bg-white px-5 py-4 text-left shadow-[0_8px_24px_rgba(0,0,0,0.18)] animate-fade-up"
          style={{ bottom }}
        >
          {text.icon && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-tint)] text-[var(--accent)]">
              <text.icon size={22} strokeWidth={2.25} aria-hidden />
            </span>
          )}
          <div>
            <p className="text-[16px] font-medium leading-snug text-[#202124]">{text.title}</p>
            {text.body && <p className="mt-1 text-[14px] leading-snug text-[#3c4043]">{text.body}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
