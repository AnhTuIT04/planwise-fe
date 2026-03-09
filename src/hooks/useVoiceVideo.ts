"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/components/providers/socket-provider";

interface User {
  id: string;
  email: string;
  fullname: string;
  avatarUrl?: string | null;
}

interface VoiceSessionPayload {
  sessionId: string;
  channelId: string;
  user: User;
  participants: string[];
}

interface VideoCallPayload {
  callId: string;
  channelId: string;
  user: User;
  participants: string[];
}

interface SessionEndedPayload {
  sessionId?: string;
  callId?: string;
  channelId: string;
}

export function useVoiceVideo({
  channelId,
  channelType,
}: {
  channelId: string;
  channelType: "VOICE" | "VIDEO" | "TEXT";
}) {
  const { socket } = useSocket();
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<User[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Join voice channel
  const joinVoice = () => {
    if (!socket || channelType !== "VOICE") return;
    socket.emit("channel:join-voice", { channelId });
    setIsConnected(true);
  };

  // Leave voice channel
  const leaveVoice = () => {
    if (!socket || channelType !== "VOICE") return;
    socket.emit("channel:leave-voice", { channelId });
    setIsConnected(false);
    setParticipants([]);
    setSessionId(null);
  };

  // Join video channel
  const joinVideo = () => {
    if (!socket || channelType !== "VIDEO") return;
    socket.emit("channel:join-video", { channelId });
    setIsConnected(true);
  };

  // Leave video channel
  const leaveVideo = () => {
    if (!socket || channelType !== "VIDEO") return;
    socket.emit("channel:leave-video", { channelId });
    setIsConnected(false);
    setParticipants([]);
    setSessionId(null);
  };

  // Listen for voice events
  useEffect(() => {
    if (!socket || channelType !== "VOICE") return;

    const handleUserJoinedVoice = (data: VoiceSessionPayload) => {
      if (data.channelId !== channelId) return;
      setSessionId(data.sessionId);
      // Add user to participants if not already in list
      setParticipants((prev) => {
        const exists = prev.some((p) => p.id === data.user.id);
        if (exists) return prev;
        return [...prev, data.user];
      });
    };

    const handleUserLeftVoice = (data: VoiceSessionPayload) => {
      if (data.channelId !== channelId) return;
      // Remove user from participants
      setParticipants((prev) => prev.filter((p) => p.id !== data.user.id));
    };

    const handleVoiceSessionEnded = (data: SessionEndedPayload) => {
      if (data.channelId !== channelId) return;
      setIsConnected(false);
      setParticipants([]);
      setSessionId(null);
    };

    socket.on("channel:user-joined-voice", handleUserJoinedVoice);
    socket.on("channel:user-left-voice", handleUserLeftVoice);
    socket.on("channel:voice-session-ended", handleVoiceSessionEnded);

    return () => {
      socket.off("channel:user-joined-voice", handleUserJoinedVoice);
      socket.off("channel:user-left-voice", handleUserLeftVoice);
      socket.off("channel:voice-session-ended", handleVoiceSessionEnded);
    };
  }, [socket, channelId, channelType]);

  // Listen for video events
  useEffect(() => {
    if (!socket || channelType !== "VIDEO") return;

    const handleUserJoinedVideo = (data: VideoCallPayload) => {
      if (data.channelId !== channelId) return;
      setSessionId(data.callId);
      // Add user to participants if not already in list
      setParticipants((prev) => {
        const exists = prev.some((p) => p.id === data.user.id);
        if (exists) return prev;
        return [...prev, data.user];
      });
    };

    const handleUserLeftVideo = (data: VideoCallPayload) => {
      if (data.channelId !== channelId) return;
      // Remove user from participants
      setParticipants((prev) => prev.filter((p) => p.id !== data.user.id));
    };

    const handleVideoCallEnded = (data: SessionEndedPayload) => {
      if (data.channelId !== channelId) return;
      setIsConnected(false);
      setParticipants([]);
      setSessionId(null);
    };

    socket.on("channel:user-joined-video", handleUserJoinedVideo);
    socket.on("channel:user-left-video", handleUserLeftVideo);
    socket.on("channel:video-call-ended", handleVideoCallEnded);

    return () => {
      socket.off("channel:user-joined-video", handleUserJoinedVideo);
      socket.off("channel:user-left-video", handleUserLeftVideo);
      socket.off("channel:video-call-ended", handleVideoCallEnded);
    };
  }, [socket, channelId, channelType]);

  // Auto-disconnect when changing channels
  useEffect(() => {
    return () => {
      if (isConnected) {
        if (channelType === "VOICE") {
          leaveVoice();
        } else if (channelType === "VIDEO") {
          leaveVideo();
        }
      }
    };
  }, [channelId]);

  return {
    isConnected,
    participants,
    sessionId,
    joinVoice,
    leaveVoice,
    joinVideo,
    leaveVideo,
  };
}
