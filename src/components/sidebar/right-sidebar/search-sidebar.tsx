"use client";

import { Input } from "@/components/ui/input";

export default function SearchSidebar() {
  return (
    <div className="flex h-full w-80 flex-col bg-[#f8f8f9] shadow-[-5px_0px_15px_rgba(0,0,0,0.05)]">
      <div className="flex h-12 items-center justify-between border-b p-4">
        <h2 className="text-[16px] font-semibold text-[#787878]">Search</h2>
      </div>
      <div className="p-4">
        <Input type="search" placeholder="Search tasks, projects..." className="w-full" />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-sm text-gray-500">Start typing to search...</p>
      </div>
    </div>
  );
}
