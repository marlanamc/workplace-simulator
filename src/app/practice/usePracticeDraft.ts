"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { BaseDraft, Mode, PracticeActivity } from "@/lib/practice/types";
import type { Lang } from "@/lib/task-types";
export type SaveStatus =
  | "loading"
  | "ready"
  | "saving"
  | "saved"
  | "local"
  | "error"
  | "load-error"
  | "preview";
export type PracticeOptions = {
  initialLang: Lang;
  initialMode: Mode;
  preview: boolean;
  transfer: boolean;
};
/** Guest drafts stay in this browser; signed-in drafts save to the account, with a local retry buffer. */
export function usePracticeDraft<D extends BaseDraft>(
  activity: PracticeActivity<D>,
  { initialLang, initialMode, preview, transfer }: PracticeOptions,
) {
  const router = useRouter();
  const { id, version, parseDraft } = activity;
  const guestKey = `digital-practice:${id}:v${version}:guest`;
  const transferKey = `digital-practice:${id}:transfer`;
  const ownerKey = (o: string) => `digital-practice:${id}:v${version}:${o}`;
  const api = `/api/practice?activity=${id}`;
  const [lang, setLang] = useState(initialLang);
  const [draft, setDraft] = useState<D>(() => activity.blank(initialMode));
  const [status, setStatus] = useState<SaveStatus>(
    preview ? "preview" : "loading",
  );
  const [owner, setOwner] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [speech, setSpeech] = useState(false);
  const [loadTick, setLoadTick] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const serial = useRef(0);
  const key = owner ? ownerKey(owner) : guestKey;
  useEffect(() => {
    let active = true;
    async function load() {
      setSpeech("speechSynthesis" in window);
      if (preview) return;
      try {
        const r = await fetch(api, { cache: "no-store" });
        if (!r.ok) throw new Error();
        const data = await r.json();
        if (!active) return;
        const who: string | null = data.signedIn ? data.owner : null;
        setOwner(who);
        let restored = parseDraft(data.state);
        let pending: D | null = null;
        try {
          if (transfer && who)
            pending = parseDraft(
              JSON.parse(sessionStorage.getItem(transferKey) || "null"),
            );
          const cached = parseDraft(
            JSON.parse(
              localStorage.getItem(who ? ownerKey(who) : guestKey) || "null",
            ),
          );
          // Account cache is only retained when a save failed or is pending.
          restored = pending ?? cached ?? restored;
        } catch {
          /* Storage unavailable: the activity still works. */
        }
        if (restored) setDraft(restored);
        if (!who) setStatus(restored ? "local" : "ready");
        if (who && restored) {
          const saved = await fetch(api, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(restored),
          });
          if (!saved.ok) throw new Error();
          if (active) setStatus("saved");
          try {
            localStorage.removeItem(ownerKey(who));
            if (pending) {
              sessionStorage.removeItem(transferKey);
              localStorage.removeItem(guestKey);
            }
          } catch {
            /* Already saved to account. */
          }
        } else if (who) setStatus("ready");
      } catch {
        if (active) setStatus("load-error");
      }
    }
    void load();
    return () => {
      active = false;
    };
    // The activity is fixed per page; reloads come from loadTick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview, transfer, loadTick]);
  const blocked = status === "loading" || status === "load-error";
  useEffect(() => {
    if (!blocked) heading.current?.focus({ preventScroll: true });
  }, [draft.stage, blocked]); // focus follows the task, not each autosave
  useEffect(
    () => () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    },
    [],
  );
  function persist(next: D) {
    if (preview) return;
    const n = ++serial.current;
    let local = false;
    try {
      localStorage.setItem(key, JSON.stringify(next));
      local = true;
    } catch {
      /* Report below. */
    }
    if (!owner) {
      setStatus(local ? "local" : "error");
      return;
    }
    setStatus("saving");
    queue.current = queue.current
      .catch(() => {})
      .then(async () => {
        try {
          const r = await fetch(api, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(next),
          });
          if (!r.ok) throw new Error();
          if (n === serial.current) {
            setStatus("saved");
            try {
              localStorage.removeItem(key);
              sessionStorage.removeItem(transferKey);
            } catch {
              /* Account save succeeded. */
            }
          }
        } catch {
          if (n === serial.current) setStatus("error");
        }
      });
  }
  function update(next: D) {
    setDraft(next);
    persist(next);
  }
  function go(stage: D["stage"], changes: Partial<D> = {}) {
    setHelp(false);
    setInvalid(false);
    update({ ...draft, ...changes, stage });
  }
  function reset() {
    setInvalid(false);
    setHelp(false);
    const fresh = activity.blank(draft.mode);
    setDraft(fresh);
    if (preview) return;
    if (owner) persist(fresh);
    else {
      try {
        localStorage.removeItem(guestKey);
        sessionStorage.removeItem(transferKey);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    }
  }
  function signIn() {
    try {
      sessionStorage.setItem(transferKey, JSON.stringify(draft));
      const q = new URLSearchParams({ mode: draft.mode, lang, transfer: "1" });
      router.push("/login?next=" + encodeURIComponent(`/practice/${id}?` + q));
    } catch {
      setStatus("error");
    }
  }
  function retryLoad() {
    setStatus("loading");
    setLoadTick((n) => n + 1);
  }
  return {
    activity,
    preview,
    lang,
    setLang,
    draft,
    update,
    go,
    persist,
    reset,
    signIn,
    retryLoad,
    status,
    blocked,
    owner,
    help,
    setHelp,
    invalid,
    setInvalid,
    speech,
    heading,
  };
}
export type Practice<D extends BaseDraft> = ReturnType<
  typeof usePracticeDraft<D>
>;
