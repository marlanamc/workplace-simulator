"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  VIDEO_CALL_COPY,
  MEETING_ID,
  PARTICIPANTS,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
  LESSONS,
  videoCallPasses,
} from "@/lib/tasks/video-call/content";
import ZoomMeeting from "@/components/zoom/ZoomMeeting";
import RightNowBar from "@/components/task/RightNowBar";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import { Video } from "lucide-react";
import { useNudge } from "@/lib/use-nudge";

export default function VideoCallTask() {
  const { lang, displayName, markComplete, completedTaskKeys } = useProgress();
  const c = VIDEO_CALL_COPY[lang];
  const [phase, setPhase] = useState<"join" | "room">("join");
  const [muted, setMuted] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatDraft, setChatDraft] = useState("");
  const [chatLines, setChatLines] = useState<string[]>([]);
  const [joinedMuted, setJoinedMuted] = useState(true);
  const [toggledCamera, setToggledCamera] = useState(false);
  const [sentChat, setSentChat] = useState(false);
  const [unmuted, setUnmuted] = useState(false);
  const [done, setDone] = useState(completedTaskKeys.includes("video-call"));
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();

  const finishIfReady = (next: { joinedMuted: boolean; toggledCamera: boolean; sentChat: boolean; unmuted: boolean }) => {
    if (!videoCallPasses(next)) return;
    setDone(true);
    markComplete("video-call", "join_muted_ask_in_chat");
  };

  const sendChat = () => {
    const line = chatDraft.trim();
    if (!line) return;
    setChatLines((rows) => [...rows, line]);
    setChatDraft("");
    const next = { joinedMuted, toggledCamera, sentChat: true, unmuted };
    setSentChat(true);
    finishIfReady(next);
  };

  const restart = () => {
    setPhase("join");
    setMuted(true);
    setCameraOn(false);
    setChatOpen(false);
    setChatDraft("");
    setChatLines([]);
    setJoinedMuted(true);
    setToggledCamera(false);
    setSentChat(false);
    setUnmuted(false);
    setDone(false);
  };

  if (done) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-[#1a1a1a]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard kicker={c.sentKicker} />
            <TaskDoneActions kicker={c.sentKicker} tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
          </div>
        </div>
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
        onHelp={() => setHelp(true)}
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
          onJoin={() => {
            setJoinedMuted(muted);
            if (!muted) {
              setUnmuted(true);
              say(c.unmuteHint);
            }
            setPhase("room");
          }}
          onToggleMute={() => {
            setMuted((v) => {
              const nextMuted = !v;
              if (!nextMuted) {
                setUnmuted(true);
                say(c.unmuteHint);
              }
              return nextMuted;
            });
          }}
          onToggleCamera={() => {
            setCameraOn((v) => !v);
            const next = { joinedMuted, toggledCamera: true, sentChat, unmuted };
            setToggledCamera(true);
            finishIfReady(next);
          }}
          onToggleChat={() => setChatOpen((v) => !v)}
          onChatDraft={setChatDraft}
          onSendChat={sendChat}
          onLeave={() => {
            setPhase("join");
            setMuted(true);
            setCameraOn(false);
            setChatOpen(false);
            setUnmuted(false);
            setJoinedMuted(true);
            setToggledCamera(false);
            setSentChat(false);
            setChatLines([]);
          }}
        />
      </div>
      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={c.lessonKicker}
        lesson={LESSONS[lang][0]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
      />
      <NudgeToast text={nudge} onDismiss={dismiss} />
    </div>
  );
}
