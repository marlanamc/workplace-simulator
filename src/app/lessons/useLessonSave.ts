"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { TaskKey } from "@/lib/desktop-content";
import type { Lang } from "@/lib/task-types";
import type { LessonMode } from "@/lib/lessons/types";
import { libraryReturn } from "@/lib/lessons/library";
import { mergeAttempts, parseAttempt, recordFinish, type LessonAttempt } from "@/lib/lessons/attempts";

import { legacySaveEvents, parseSaveEvents, type LessonSaveEvent } from "@/lib/lessons/save-events";
import { createLessonSaveQueue, parsePendingLessonSave, prepareLessonSave, type PendingLessonSave } from "@/lib/lessons/save-queue";

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
function writeJSON(store: "local" | "session", key: string, value: LessonAttempt | PendingLessonSave | null) {
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
  { preview, transfer, mode, returnTo, scenario }: { preview: boolean; transfer: boolean; mode: LessonMode; returnTo?: string; scenario?: import("@/lib/lessons/confidence").LessonScenario },
): LessonSave {
  const router = useRouter();
  const api = `/api/lessons?lesson=${taskKey}`;
  const guestKey = `lesson-attempt:${taskKey}:guest`;
  const transferKey = `lesson-attempt:${taskKey}:transfer`;
  const unresolvedKey = `lesson-attempt:${taskKey}:unresolved`;
  const ownerKey = (o: string) => `lesson-attempt:${taskKey}:${o}`;

  const [status, setStatus] = useState<LessonSaveStatus>(preview ? "preview" : "loading");
  const [lookup, setLookup] = useState(0);
  const sessionFailed = useRef(false);
  const sessionReady = useRef(false);
  const owner = useRef<string | null>(null);
  const current = useRef<LessonAttempt | null>(null);

  const pendingEvents = useRef<LessonSaveEvent[]>([]);
  const eventPrefix = (who: string) => `${ownerKey(who)}:event:`;
  const transferToken = useRef<string | undefined>(undefined);
  const push = useMemo(() => createLessonSaveQueue({
    write: (who, next) => {
      // One storage key per event prevents tabs from overwriting each other.
      for (const event of next.events ?? []) {
        try { localStorage.setItem(eventPrefix(who) + event.id, JSON.stringify(event)); } catch { /* retain in memory */ }
      }
      writeJSON("local", ownerKey(who), next);
    },
    send: async (_who, next) => {
      const r = await fetch(api, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
      if (!r.ok) throw new Error("not saved");
    },
    clear: (who, next) => {
      const carried = readJSON("session", transferKey);
      // Clear the transfer first, while the retry snapshot is still durable.
      if (carried && JSON.stringify(carried) === next.transferToken) {
        writeJSON("session", transferKey, null);
        writeJSON("local", guestKey, null);
      }
      const ids = new Set((next.events ?? []).map(event => event.id));
      for (const id of ids) { try { localStorage.removeItem(eventPrefix(who) + id); } catch { /* replay is idempotent */ } }
      try {
        if (localStorage.getItem(ownerKey(who)) === JSON.stringify(next)) writeJSON("local", ownerKey(who), null);
      } catch { /* replay is idempotent */ }
    },
    status: setStatus,
    // The lesson keys are fixed for the page's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [api]);

  // Syncs with the server session, an external system.
  useEffect(() => {
    if (preview) return;
    let live = true;
    (async () => {
      let who: string | null = null;
      let server: LessonAttempt | null = null;
      try {
        const r = await fetch(api, { cache: "no-store" });
        if (!r.ok) throw new Error("Session lookup failed");
        const data = await r.json();
        if (data.error || (data.signedIn !== false && !(data.signedIn === true && typeof data.owner === "string"))) throw new Error("Invalid session");
        who = data.signedIn && !data.error ? data.owner : null;
        server = parseAttempt(data.state);
      } catch {
        if (live) { sessionFailed.current = true; setStatus("error"); }
        return;
      }
      if (!live) return;
      sessionFailed.current = false;
      sessionReady.current = true;
      const unresolved = readJSON("session", unresolvedKey);
      owner.current = who;
      if (!who) {
        current.current = mergeAttempts(readJSON("local", guestKey), unresolved);
        if (unresolved && writeJSON("local", guestKey, current.current)) writeJSON("session", unresolvedKey, null);
        setStatus("guest");
        return;
      }
      let buffered: PendingLessonSave | null = null;
      try { buffered = parsePendingLessonSave(JSON.parse(localStorage.getItem(ownerKey(who)) || "null")); } catch { /* unavailable storage */ }
      const carried = transfer ? readJSON("session", transferKey) : null;
      const prepared = prepareLessonSave(server, buffered, carried);
      const events = new Map<string, LessonSaveEvent>();
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)!;
          if (key.startsWith(eventPrefix(who))) {
            const parsed = parseSaveEvents([JSON.parse(localStorage.getItem(key) || "null")]);
            if (parsed) events.set(parsed[0].id, parsed[0]);
          }
        }
      } catch { /* unavailable storage */ }
      for (const event of buffered?.events ?? legacySaveEvents(server, buffered?.attempt ?? server ?? { version: 1, attempts: 0, modes: [], mode: "guided" })) {
        events.set(event.id, event);
      }
      if (carried && !(buffered && !buffered.events && buffered.transferToken === JSON.stringify(carried))) {
        // The transfer receipt survives another tab replacing the summary buffer.
        const token = JSON.stringify(carried);
        let id = crypto.randomUUID() as string;
        try {
          const saved = JSON.parse(sessionStorage.getItem(`${transferKey}:receipt`) || "null");
          if (saved?.token === token && parseSaveEvents([{ id: saved.id, attempt: carried }])) id = saved.id;
          sessionStorage.setItem(`${transferKey}:receipt`, JSON.stringify({ token, id }));
        } catch { /* the owner event buffer also retains this receipt */ }
        events.set(id, { id, attempt: carried });
      }
      if (unresolved) {
        const event = { id: crypto.randomUUID(), attempt: unresolved };
        events.set(event.id, event);
      }
      pendingEvents.current = [...events.values()];
      const recovered = mergeAttempts(prepared?.attempt ?? null, unresolved) ?? [...events.values()].reduce<LessonAttempt | null>((total, event) => mergeAttempts(total, event.attempt), null);

      current.current = recovered;
      transferToken.current = prepared?.transferToken;
      if (pendingEvents.current.length && recovered) {
        const saving = push(who, { attempt: recovered, transferToken: prepared?.transferToken, events: pendingEvents.current });
        writeJSON("session", unresolvedKey, null);
        await saving;
      } else if (live) {
        setStatus(server ? "saved" : "account");
      }
    })();
    return () => {
      live = false;
    };
    // The lesson is fixed for the page's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview, lookup]);

  const finish = useCallback(
    (m: LessonMode) => {
      if (preview) return;
      if (!sessionReady.current) {
        const pending = recordFinish(readJSON("session", unresolvedKey), m, new Date().toISOString());
        writeJSON("session", unresolvedKey, pending);
        if (sessionFailed.current) setStatus("error");
        return;
      }
      const next = recordFinish(current.current, m, new Date().toISOString());
      current.current = next;
      if (owner.current) {
        pendingEvents.current = [...pendingEvents.current, { id: crypto.randomUUID(), attempt: recordFinish(null, m, next.completedAt!) }];
        void push(owner.current, { attempt: next, transferToken: transferToken.current, events: pendingEvents.current });
      }
      else setStatus(writeJSON("local", guestKey, next) ? "guest" : "error");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [preview, push],
  );

  const retry = useCallback(() => {
    if (sessionFailed.current) { setLookup(value => value + 1); return; }
    if (owner.current && current.current) void push(owner.current, { attempt: current.current, transferToken: transferToken.current, events: pendingEvents.current });
  }, [push]);

  const signIn = useCallback((lang: Lang) => {
    writeJSON("session", transferKey, current.current);
    const q = new URLSearchParams({ mode, transfer: "1" });
    if (scenario) q.set("scenario", scenario);
    if (returnTo) q.set("returnTo", libraryReturn(returnTo, lang));
    if (lang === "es") q.set("lang", "es");
    router.push(`/login?next=${encodeURIComponent(`/lessons/${taskKey}?${q}`)}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, router, taskKey, returnTo, scenario]);

  return { status, recordFinish: finish, retry, signIn };
}
