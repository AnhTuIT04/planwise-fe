"use client";

import { use } from "react";
import { ChannelContent } from "@/components/channels/channel-content";

export default function ChannelPage({ params }: { params: Promise<{ projectId: string; channelId: string }> }) {
  const { projectId, channelId } = use(params);

  return (
    <div className="my-1 ml-1 flex flex-1 flex-col overflow-hidden rounded-l-[6px] border-y border-l border-[#dcdcdc] bg-white shadow-sm">
      <ChannelContent projectId={projectId} channelId={channelId} />
    </div>
  );
}
