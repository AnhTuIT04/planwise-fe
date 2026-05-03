"use client";

import { useState } from "react";
import { Volume2, Phone, PhoneOff, Mic, MicOff, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLiveKit } from "@/hooks/use-live-kit";
import { useAuth } from "@/hooks/use-auth";

interface VoiceChannelProps {
  channelId: string;
  channelName: string;
}

export function VoiceChannel({ channelId, channelName }: VoiceChannelProps) {
  const { user } = useAuth();
  const [wantsToConnect, setWantsToConnect] = useState(false);

  const { isConnected, isConnecting, participants, error, disconnect, toggleMicrophone, isMicrophoneEnabled } =
    useLiveKit({
      roomName: channelId,
      userName: user?.fullname || "Guest",
      enabled: wantsToConnect,
      audio: true,
      video: false,
    });

  const handleConnect = () => {
    setWantsToConnect(true);
  };

  const handleDisconnect = async () => {
    await disconnect();
    setWantsToConnect(false);
  };

  const handleToggleMic = async () => {
    await toggleMicrophone();
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      {error && <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">Error: {error}</div>}

      {!isConnected && !isConnecting ? (
        <div className="text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
            <Volume2 size={48} className="text-gray-600" />
          </div>
          <h3 className="mb-2 text-2xl font-bold">{channelName}</h3>
          <p className="mb-6 text-gray-500">Connect to voice channel to start talking</p>
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
        <div className="flex w-full max-w-4xl flex-col">
          {/* Voice Indicator */}
          <div className="mb-6 rounded-lg bg-gray-100 p-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500">
              <Volume2 size={40} className="text-white" />
            </div>
            <p className="text-lg font-semibold">Connected to {channelName}</p>
            <p className="text-sm text-gray-500">You are now in the voice channel</p>
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
