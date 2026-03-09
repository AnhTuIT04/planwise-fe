"use client";

import { Hash, Volume2, Video } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useChannel } from "@/hooks/useChannel";
import { TextChannel } from "./text-channel";
import { VoiceChannel } from "./voice-channel";
import { VideoChannel } from "./video-channel";

interface ChannelContentProps {
  projectId: string;
  channelId: string;
}

const channelTypeConfig = {
  TEXT: {
    icon: Hash,
    description: "This is the beginning of the channel",
  },
  VOICE: {
    icon: Volume2,
    description: "Voice channel - Connect to start talking",
  },
  VIDEO: {
    icon: Video,
    description: "Video channel - Connect to start video call",
  },
};

export function ChannelContent({ projectId, channelId }: ChannelContentProps) {
  const { channels } = useChannel({ projectId });
  const channel = channels.find((c) => c.id === channelId);

  if (!channel) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Channel not found</p>
      </div>
    );
  }

  const config = channelTypeConfig[channel.type];
  const Icon = config.icon;

  return (
    <div className="flex h-full flex-col">
      {/* Channel Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
        <Icon size={20} className="text-gray-600" />
        <h2 className="font-semibold text-gray-800">{channel.name}</h2>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <p className="text-sm text-gray-500">{config.description}</p>
      </div>

      {/* Channel Content */}
      {channel.type === "TEXT" ? (
        <TextChannel channelId={channelId} channelName={channel.name} />
      ) : channel.type === "VOICE" ? (
        <VoiceChannel channelId={channelId} channelName={channel.name} />
      ) : (
        <VideoChannel channelId={channelId} channelName={channel.name} />
      )}
    </div>
  );
}
