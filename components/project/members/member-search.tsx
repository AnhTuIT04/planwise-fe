"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MembersSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function MembersSearch({ searchQuery, onSearchChange }: MembersSearchProps) {
  return (
    <div className="bg-card border-b px-6 py-3">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
}