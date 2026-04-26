"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export default function SearchSidebar() {
  return (
    <div className="flex h-full w-80 flex-col bg-[#f8f8f9] shadow-[-5px_0px_15px_rgba(0,0,0,0.05)]">
      <div className="flex h-12 items-center justify-between border-b p-4">
        <h2 className="text-[14px] font-semibold text-[#787878]">Search</h2>
      </div>

      <div className="mx-5 flex items-center gap-2 border-b py-3">
        <Search className="size-5 text-[#9b9ba1]" />
        <Input
          placeholder="Search..."
          className="h-auto border-0 bg-transparent px-0 text-[14px] text-[#2f2f33] placeholder:text-[#b0b0b5] focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </div>
  );
}
