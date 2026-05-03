"use client";

import { use } from "react";
import { Hash } from "lucide-react";

export default function ChannelsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);

  return (
    <div className="my-1 ml-1 flex flex-1 flex-col overflow-hidden rounded-l-[6px] border-y border-l border-[#dcdcdc] bg-[#f8f8f9] shadow-sm">
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
            <Hash size={32} className="text-gray-400" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-700">No Channel Selected</h2>
          <p className="text-sm text-gray-500">Select a channel from the sidebar to start chatting</p>
        </div>
      </div>
    </div>
  );
}
