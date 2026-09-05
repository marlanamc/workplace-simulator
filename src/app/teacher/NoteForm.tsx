"use client";

import { useState, useTransition } from "react";
import { saveSubmissionNote } from "@/app/actions";

/** The teacher's "suggest changes" box for one submission. */
export default function NoteForm({
  submissionId,
  existingNote,
}: {
  submissionId: string;
  existingNote: string | null;
}) {
  const [note, setNote] = useState(existingNote ?? "");
  const [editing, setEditing] = useState(!existingNote);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();

  const save = () => {
    setError(false);
    setSaved(false);
    startTransition(async () => {
      const res = await saveSubmissionNote(submissionId, note);
      if (res.ok) {
        setSaved(true);
        if (existingNote) setEditing(false);
      } else {
        setError(true);
      }
    });
  };

  if (!editing) {
    return (
      <div className="mt-3">
        <div className="rounded-lg border border-[#8ab4f8]/30 bg-[#8ab4f8]/10 px-3 py-2.5 text-[13px] leading-relaxed text-[#d3e3fd]">
          {note}
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(true);
            setSaved(false);
          }}
          className="mt-2 text-[12px] font-medium text-[#8ab4f8] hover:underline"
        >
          Edit note
        </button>
        {saved && <span className="ml-3 text-[12px] text-[#81c995]">Saved.</span>}
      </div>
    );
  }

  return (
    <div className="mt-3">
      <textarea
        value={note}
        onChange={(e) => {
          setNote(e.target.value);
          setSaved(false);
        }}
        placeholder="What would you change? The student sees this the next time they open the simulator."
        rows={3}
        className="w-full resize-y rounded-lg border border-white/15 bg-[#0f1012] px-3 py-2 text-[14px] leading-relaxed text-[#e8eaed] outline-none focus:border-[#8ab4f8]"
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={pending || !note.trim()}
          className="inline-flex h-9 items-center rounded-full bg-[#1a73e8] px-4 text-[13px] font-medium text-white hover:bg-[#1b66c9] disabled:opacity-40"
        >
          {existingNote ? "Update note" : "Save note"}
        </button>
        {existingNote && (
          <button
            type="button"
            onClick={() => {
              setNote(existingNote);
              setEditing(false);
              setError(false);
            }}
            className="text-[12px] font-medium text-[#9aa0a6] hover:underline"
          >
            Cancel
          </button>
        )}
        {saved && <span className="text-[12px] text-[#81c995]">Saved. The student will see it on next login.</span>}
        {error && <span className="text-[12px] text-[#f28b82]">Could not save. Try again.</span>}
      </div>
    </div>
  );
}
