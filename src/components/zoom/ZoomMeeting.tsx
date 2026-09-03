"use client";

import type { ReactNode } from "react";
import { Mic, MicOff, Video, VideoOff, MessageSquare, PhoneOff } from "lucide-react";

export interface ZoomParticipant {
  key: string;
  name: string;
  initials: string;
  color: string;
}

export default function ZoomMeeting({
  phase,
  title,
  meetingId,
  participants,
  displayName,
  muted,
  cameraOn,
  chatOpen,
  chatDraft,
  chatLines,
  joinLabel,
  nameLabel,
  meetingIdLabel,
  joinKicker,
  mutedHint,
  muteLabel,
  unmuteLabel,
  cameraOnLabel,
  cameraOffLabel,
  chatLabel,
  leaveLabel,
  youLabel,
  chatPlaceholder,
  sendLabel,
  scenario,
  onJoin,
  onToggleMute,
  onToggleCamera,
  onToggleChat,
  onChatDraft,
  onSendChat,
  onLeave,
}: {
  phase: "join" | "room";
  title: string;
  meetingId: string;
  participants: ZoomParticipant[];
  displayName: string;
  muted: boolean;
  cameraOn: boolean;
  chatOpen: boolean;
  chatDraft: string;
  chatLines: string[];
  joinLabel: string;
  nameLabel: string;
  meetingIdLabel: string;
  joinKicker: string;
  mutedHint: string;
  muteLabel: string;
  unmuteLabel: string;
  cameraOnLabel: string;
  cameraOffLabel: string;
  chatLabel: string;
  leaveLabel: string;
  youLabel: string;
  chatPlaceholder: string;
  sendLabel: string;
  scenario?: ReactNode;
  onJoin: () => void;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onToggleChat: () => void;
  onChatDraft: (value: string) => void;
  onSendChat: () => void;
  onLeave: () => void;
}) {
  if (phase === "join") {
    return (
      <div className="flex h-full min-h-0 flex-col items-center justify-center bg-[#1a1a1a] px-6 text-white" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
        <p className="mb-2 text-[13px] text-[#bdbdbd]">{joinKicker}</p>
        <h1 className="mb-8 text-[22px] font-medium">{title}</h1>
        <div className="mb-6 flex h-[160px] w-[240px] items-center justify-center rounded-xl bg-[#2d2d2d] text-[36px] font-medium text-[#9e9e9e]">
          {displayName.trim().slice(0, 1).toUpperCase() || "Y"}
        </div>
        <label className="mb-3 w-full max-w-[280px] text-[13px] text-[#bdbdbd]">
          {nameLabel}
          <input
            readOnly
            value={displayName}
            className="mt-1 w-full rounded-lg border border-[#3d3d3d] bg-[#2d2d2d] px-3 py-2 text-[15px] text-white"
          />
        </label>
        <p className="mb-6 text-[13px] text-[#9e9e9e]">
          {meetingIdLabel}: {meetingId}
        </p>
        <button
          onClick={onJoin}
          className="inline-flex min-h-[44px] items-center rounded-lg bg-[#2D8CFF] px-8 text-[15px] font-medium text-white cursor-pointer"
        >
          {joinLabel}
        </button>
        <p className="mt-4 max-w-[280px] text-center text-[12px] text-[#9e9e9e]">{mutedHint}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#1a1a1a] text-white" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="flex items-center justify-between px-4 py-2 text-[13px] text-[#bdbdbd]">
        <span>{title}</span>
        <span>{meetingId}</span>
      </div>
      {scenario}
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 p-3">
        <div className="flex flex-col items-center justify-center rounded-xl bg-[#2d2d2d]">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2D8CFF] text-[22px] font-medium">
            {displayName.trim().slice(0, 1).toUpperCase() || "Y"}
          </span>
          <span className="mt-2 text-[13px]">{youLabel}{muted ? " · 🔇" : ""}</span>
        </div>
        {participants.map((p) => (
          <div key={p.key} className="flex flex-col items-center justify-center rounded-xl bg-[#2d2d2d]">
            <span className="flex h-16 w-16 items-center justify-center rounded-full text-[18px] font-medium text-white" style={{ background: p.color }}>
              {p.initials}
            </span>
            <span className="mt-2 text-[13px]">{p.name}</span>
          </div>
        ))}
      </div>
      {chatOpen && (
        <div className="border-t border-[#3d3d3d] bg-[#242424] px-3 py-2">
          <div className="mb-2 max-h-[88px] overflow-auto text-[13px] text-[#e0e0e0]">
            {chatLines.map((line) => (
              <p key={line} className="m-0 py-0.5">{youLabel}: {line}</p>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={chatDraft}
              onChange={(e) => onChatDraft(e.target.value)}
              placeholder={chatPlaceholder}
              className="min-h-[36px] flex-1 rounded-lg border border-[#3d3d3d] bg-[#1a1a1a] px-3 text-[13px] text-white outline-none"
            />
            <button onClick={onSendChat} className="rounded-lg bg-[#2D8CFF] px-3 text-[13px] font-medium cursor-pointer">
              {sendLabel}
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center justify-center gap-3 border-t border-[#2d2d2d] bg-[#111] px-4 py-3">
        <ToolbarButton active={!muted} label={muted ? unmuteLabel : muteLabel} onClick={onToggleMute}>
          {muted ? <MicOff size={18} /> : <Mic size={18} />}
        </ToolbarButton>
        <ToolbarButton active={cameraOn} label={cameraOn ? cameraOffLabel : cameraOnLabel} onClick={onToggleCamera}>
          {cameraOn ? <Video size={18} /> : <VideoOff size={18} />}
        </ToolbarButton>
        <ToolbarButton active={chatOpen} label={chatLabel} onClick={onToggleChat}>
          <MessageSquare size={18} />
        </ToolbarButton>
        <button
          onClick={onLeave}
          aria-label={leaveLabel}
          className="flex h-11 min-w-[72px] flex-col items-center justify-center rounded-lg bg-[#DE382C] px-3 text-[11px] cursor-pointer"
        >
          <PhoneOff size={18} />
          {leaveLabel}
        </button>
      </div>
    </div>
  );
}

function ToolbarButton({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`flex h-11 min-w-[64px] flex-col items-center justify-center rounded-lg px-3 text-[11px] cursor-pointer ${
        active ? "bg-[#2d2d2d] text-white" : "bg-[#3d3d3d] text-[#e0e0e0]"
      }`}
    >
      {children}
      <span className="mt-0.5">{label}</span>
    </button>
  );
}
