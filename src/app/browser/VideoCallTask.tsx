"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  VIDEO_CALL_COPY,
  MEETING_ID,
  PARTICIPANTS,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
} from "@/lib/tasks/video-call/content";
import ZoomMeeting from "@/components/zoom/ZoomMeeting";
import RightNowBar from "@/components/task/RightNowBar";
import { Video } from "lucide-react";

export default function VideoCallTask() {
  const { lang, displayName } = useProgress();
  const c = VIDEO_CALL_COPY[lang];
  const [phase, setPhase] = useState<"join" | "room">("join");
  const [muted, setMuted] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatDraft, setChatDraft] = useState("");
  const [chatLines, setChatLines] = useState<string[]>([]);
  const [toggledMedia, setToggledMedia] = useState(false);
  const [previewDone, setPreviewDone] = useState(false);

  const sendChat = () => {
    const line = chatDraft.trim();
    if (!line) return;
    setChatLines((rows) => [...rows, line]);
    setChatDraft("");
    if (toggledMedia) setPreviewDone(true);
  };

  if (previewDone) {
    return (
      <div className="flex h-full min-h-0 flex-col items-center justify-center bg-[#1a1a1a] px-6 text-center text-white" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
        <p className="text-[13px] text-[#2D8CFF]">{c.appName}</p>
        <h2 className="mt-2 text-[22px] font-medium">{c.previewDone}</h2>
        <p className="mt-3 max-w-[420px] text-[14px] leading-relaxed text-[#bdbdbd]">{c.previewBody}</p>
        <button
          onClick={() => {
            setPhase("join");
            setMuted(true);
            setCameraOn(false);
            setChatOpen(false);
            setChatDraft("");
            setChatLines([]);
            setToggledMedia(false);
            setPreviewDone(false);
          }}
          className="mt-6 inline-flex min-h-[40px] items-center rounded-lg bg-[#2D8CFF] px-5 text-[14px] font-medium cursor-pointer"
        >
          {c.join}
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <RightNowBar
        icon={Video}
        stepIndex={phase === "join" ? 0 : 1}
        steps={RIGHT_NOW_STEPS}
        lang={lang}
        rightNowLabel={RIGHT_NOW_LABEL}
      />
      <div className="min-h-0 flex-1">
        <ZoomMeeting
          phase={phase}
          title={c.meetingTitle}
          meetingId={MEETING_ID}
          participants={[...PARTICIPANTS]}
          displayName={displayName}
          muted={muted}
          cameraOn={cameraOn}
          chatOpen={chatOpen}
          chatDraft={chatDraft}
          chatLines={chatLines}
          joinLabel={c.join}
          nameLabel={c.nameLabel}
          meetingIdLabel={c.meetingIdLabel}
          joinKicker={c.joinKicker}
          mutedHint={c.mutedHint}
          muteLabel={c.mute}
          unmuteLabel={c.unmute}
          cameraOnLabel={c.cameraOn}
          cameraOffLabel={c.cameraOff}
          chatLabel={c.chat}
          leaveLabel={c.leave}
          youLabel={c.you}
          chatPlaceholder={c.chatPlaceholder}
          sendLabel={c.send}
          scenario={
            phase === "room" ? (
              <div className="mx-4 mt-1 rounded-lg bg-[#2D8CFF]/15 px-3 py-2 text-[13px] text-[#d6e8ff]">
                <p className="m-0 font-medium">{c.latePrompt}</p>
                <p className="m-0 mt-1 text-[#bdbdbd]">{c.lateHint}</p>
              </div>
            ) : null
          }
          onJoin={() => setPhase("room")}
          onToggleMute={() => {
            setMuted((v) => !v);
            setToggledMedia(true);
          }}
          onToggleCamera={() => {
            setCameraOn((v) => !v);
            setToggledMedia(true);
          }}
          onToggleChat={() => setChatOpen((v) => !v)}
          onChatDraft={setChatDraft}
          onSendChat={sendChat}
          onLeave={() => {
            setPhase("join");
            setMuted(true);
            setCameraOn(false);
            setChatOpen(false);
          }}
        />
      </div>
    </div>
  );
}
