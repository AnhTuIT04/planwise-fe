"use client";

import { useState, useEffect } from "react";
import { Video, Phone, PhoneOff, Mic, MicOff, VideoIcon, VideoOff, Settings, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLiveKit } from "@/hooks/use-live-kit";
import { VideoTrack } from "./video-track";
import { Track } from "livekit-client";
import { useAuth } from "@/hooks/use-auth";

interface VideoChannelProps {
  channelId: string;
  channelName: string;
}

export function VideoChannel({ channelId, channelName }: VideoChannelProps) {
  const { user } = useAuth();
  const [wantsToConnect, setWantsToConnect] = useState(false);

  const {
    room,
    isConnected,
    isConnecting,
    participants,
    error,
    localVideoTrack,
    disconnect,
    toggleMicrophone,
    toggleCamera,
    toggleScreenShare,
    isMicrophoneEnabled,
    isCameraEnabled,
    isScreenSharing,
    localScreenTrack,
    screenSharingUserId,
  } = useLiveKit({
    roomName: channelId,
    userName: user?.fullname || "Guest",
    enabled: wantsToConnect,
    audio: true,
    video: true,
  });

  const handleConnect = () => {
    setWantsToConnect(true);
  };

  const handleDisconnect = async () => {
    setWantsToConnect(false);
    await disconnect();
  };

  const handleToggleMic = async () => {
    await toggleMicrophone();
  };

  const handleToggleCamera = async () => {
    await toggleCamera();
  };

  const handleToggleScreenShare = async () => {
    await toggleScreenShare();
  };

  // Get remote video tracks (camera)
  const remoteVideoTracks = participants.flatMap((participant) =>
    Array.from(participant.videoTrackPublications.values())
      .filter((pub) => pub.track && pub.source !== Track.Source.ScreenShare)
      .map((pub) => ({
        track: pub.track!,
        participant,
      })),
  );

  // Get remote screen shares
  const remoteScreenShares = participants.flatMap((participant) =>
    Array.from(participant.videoTrackPublications.values())
      .filter((pub) => pub.track && pub.source === Track.Source.ScreenShare)
      .map((pub) => ({
        track: pub.track!,
        participant,
      })),
  );

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      {error && (
        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-100 p-4 text-yellow-800">
          <div className="flex items-start gap-2">
            <VideoOff className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-medium">Camera Access Issue</p>
              <p className="mt-1 text-sm">{error}</p>
              {error.includes("being used") && (
                <p className="mt-1 text-sm">
                  Please close other tabs/apps using the camera or continue with audio only.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {!isConnected && !isConnecting ? (
        <div className="text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
            <Video size={48} className="text-gray-600" />
          </div>
          <h3 className="mb-2 text-2xl font-bold">{channelName}</h3>
          <p className="mb-6 text-gray-500">Connect to video channel to start video call</p>
          <Button onClick={handleConnect} size="lg" className="gap-2">
            <Phone size={20} />
            Connect
          </Button>
        </div>
      ) : isConnecting ? (
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-gray-600">Connecting...</p>
        </div>
      ) : (
        <div className="flex w-full max-w-6xl flex-col">
          {/* Screen Share Display - Main */}
          {(remoteScreenShares.length > 0 || isScreenSharing || localScreenTrack) && (
            <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-lg bg-gray-900">
              {localScreenTrack && isScreenSharing ? (
                <VideoTrack track={localScreenTrack} participant={room?.localParticipant} isLocal={true} />
              ) : remoteScreenShares.length > 0 ? (
                <VideoTrack track={remoteScreenShares[0].track} participant={remoteScreenShares[0].participant} />
              ) : null}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white">
                <Monitor size={16} />
                Screen Share
              </div>
            </div>
          )}

          {/* Video Grid - Camera Feeds */}
          <div
            className="mb-6 grid gap-4"
            style={{
              gridTemplateColumns:
                remoteVideoTracks.length > 0
                  ? `repeat(${Math.min(remoteVideoTracks.length + (localVideoTrack ? 1 : 0), 4)}, 1fr)`
                  : "1fr",
            }}
          >
            {/* Local Video */}
            {localVideoTrack && (
              <VideoTrack track={localVideoTrack} participant={room?.localParticipant} isLocal={true} />
            )}

            {/* Remote Videos */}
            {remoteVideoTracks.map(({ track, participant }) => (
              <VideoTrack key={participant.identity} track={track} participant={participant} />
            ))}

            {/* No camera placeholder */}
            {!localVideoTrack &&
              remoteVideoTracks.length === 0 &&
              !isScreenSharing &&
              remoteScreenShares.length === 0 && (
                <div className="aspect-video w-full rounded-lg bg-gray-900">
                  <div className="flex h-full items-center justify-center text-center">
                    <div>
                      <VideoOff size={48} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-400">No active cameras</p>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={isMicrophoneEnabled ? "secondary" : "destructive"}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={handleToggleMic}
            >
              {isMicrophoneEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </Button>

            <Button
              variant={isCameraEnabled ? "secondary" : "destructive"}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={handleToggleCamera}
            >
              {isCameraEnabled ? <VideoIcon size={20} /> : <VideoOff size={20} />}
            </Button>

            <Button
              variant={isScreenSharing ? "secondary" : "outline"}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={handleToggleScreenShare}
              title={
                screenSharingUserId && screenSharingUserId !== room?.localParticipant.identity
                  ? "Another user is sharing screen"
                  : "Share screen"
              }
              disabled={!!screenSharingUserId && screenSharingUserId !== room?.localParticipant.identity}
            >
              <Monitor size={20} />
            </Button>

            <Button variant="destructive" size="icon" className="h-12 w-12 rounded-full" onClick={handleDisconnect}>
              <PhoneOff size={20} />
            </Button>

            <Button variant="secondary" size="icon" className="h-12 w-12 rounded-full">
              <Settings size={20} />
            </Button>
          </div>

          {/* Connected Users List */}
          <div className="mt-8 rounded-lg bg-gray-50 p-4">
            <h4 className="mb-3 font-semibold text-gray-700">In this channel ({participants.length + 1})</h4>
            <div className="space-y-2">
              {/* Local participant */}
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatarUrl || undefined} />
                  <AvatarFallback className="bg-blue-500 text-xs text-white">
                    {user?.fullname?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user?.fullname || "You"} (You)</p>
                  <p className="text-xs text-gray-500">Connected</p>
                </div>
              </div>

              {/* Remote participants */}
              {participants.map((participant) => (
                <div key={participant.identity} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-500 text-xs text-white">
                      {participant.identity[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{participant.identity}</p>
                    <p className="text-xs text-gray-500">Connected</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
