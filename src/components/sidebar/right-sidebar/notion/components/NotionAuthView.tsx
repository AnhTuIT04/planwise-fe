"use client";

import { apiBaseURL } from "@/lib/consts";

export default function NotionAuthView() {
  return (
    <div className="flex flex-col items-center text-center mt-10 gap-4">
      <div className="w-16 h-16 bg-white rounded-lg shadow flex items-center justify-center">
        <span className="text-2xl">📝</span>
      </div>
      <h3 className="font-medium text-lg">Connect Notion</h3>
      <p className="text-sm text-gray-500">
        Import tasks directly from your Notion databases into Planwise projects.
      </p>
      <a 
        href={`${apiBaseURL}/integrations/connect/NOTION`}
        className="mt-4 bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
      >
        Connect to Notion
      </a>
    </div>
  );
}
