"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { TaskKey } from "@/lib/desktop-content";
import type { Lang } from "@/lib/task-types";
import type { LessonMode } from "@/lib/lessons/types";
import { mergeAttempts, parseAttempt, recordFinish, type LessonAttempt } from "@/lib/lessons/attempts";

/**
 * `preview`: teacher preview, nothing saved. `guest`: saved in this browser
 * only. `account`: signed in, nothing finished yet. `saved` / `saving` /
 * `error`: the account save. An error keeps a local copy and retries on the
 * next visit.
 */
export type LessonSaveStatus = "preview" | "loading" | "guest" | "account" | "saving" | "saved" | "error";

export interface LessonSave {
  status: LessonSaveStatus;
  recordFinish: (mode: LessonMode) => void;
  retry: () => void;
  /** Carry this browser's attempts into an account, then come back here. */
  signIn: (lang: Lang) => void;
}

function readJSON(store: "local" | "session", key: string): LessonAttempt | null {
  try {
    const s = store === "local" ? localStorage : sessionStorage;
    return parseAttempt(JSON.parse(s.getItem(key) || "null"));
  } catch {
    return null;
  }
}
function writeJSON(store: "local" | "session", key: string, value: LessonAttempt | null) {
  try {
    const s = store === "local" ? localStorage : sessionStorage;
    if (value) s.setItem(key, JSON.stringify(value));
    else s.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function useLessonSave(
  taskKey: TaskKey,
  { preview, transfer, mode }: { preview: boolean; transfer: boolean; mode: LessonMode },
): LessonSave {
  const router = useRouter();
  const api = `/api/lessons?lesson=${taskKey}`;
  const guestKey = `lesson-attempt:${taskKey}:guest`;
  const transferKey = `lesson-attempt:${taskKey}:transfer`;
  const ownerKey = (o: string) => `lesson-attempt:${taskKey}:${o}`;

  const [status, setStatus] = useState<LessonSaveStatus>(preview ? "preview" : "loading");
  const owner = useRef<string | null>(null);
  const current = useRef<LessonAttempt | null>(null);

  const push = useCallback(
    async (who: string, next: LessonAttempt) => {
      writeJSON("local", ownerKey(who), next); // retry copy until the server has it
      setStatus("saving");
      try {
        const r = await fetch(api, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
        if (!r.ok) throw new Error("not saved");
        writeJSON("local", ownerKey(who), null);
        setStatus("saved");
        return true;
      } catch {
        setStatus("error");
        return false;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api],
  );

  // Syncs with the server session, an external system.
  useEffect(() => {
    if (preview) return;
    let live = true;
    (async () => {
      let who: string | null = null;
      let server: LessonAttempt | null = null;
      try {
        const r = await fetch(api, { cache: "no-store" });
        const data = r.ok ? await r.json() : { signedIn: false };
        who = data.signedIn && !data.error ? data.owner : null;
        server = parseAttempt(data.state);
      } catch {
        /* Offline: treat as a guest; nothing is lost. */
      }
      if (!live) return;
      owner.current = who;
      if (!who) {
        current.current = readJSON("local", guestKey);
        setStatus("guest");
        return;
      }
      const buffered = readJSON("local", ownerKey(who));
      const carried = transfer ? readJSON("session", transferKey) : null;
      const merged = mergeAttempts(buffered ?? server, carried);
      current.current = merged;
      if (buffered || carried) {
        const ok = await push(who, merged!);
        if (ok && carried) {
          writeJSON("session", transferKey, null);
          writeJSON("local", guestKey, null);
        }
      } else if (live) {
        setStatus(server ? "saved" : "account");
      }
    })();
    return () => {
      live = false;
    };
    // The lesson is fixed for the page's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview]);

  const finish = useCallback(
    (m: LessonMode) => {
      if (preview) return;
      const next = recordFinish(current.current, m, new Date().toISOString());
      current.current = next;
      if (owner.current) void push(owner.current, next);
      else setStatus(writeJSON("local", guestKey, next) ? "guest" : "error");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [preview, push],
  );

  const retry = useCallback(() => {
    if (owner.current && current.current) void push(owner.current, current.current);
  }, [push]);

  const signIn = useCallback((lang: Lang) => {
    writeJSON("session", transferKey, current.current);
    const q = new URLSearchParams({ mode, transfer: "1" });
    if (lang === "es") q.set("lang", "es");
    router.push(`/login?next=${encodeURIComponent(`/lessons/${taskKey}?${q}`)}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, router, taskKey]);

  return { status, recordFinish: finish, retry, signIn };
}
