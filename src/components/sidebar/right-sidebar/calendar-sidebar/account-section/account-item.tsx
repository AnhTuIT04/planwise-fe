"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

type Props = {
  email: string;
  active: boolean;
  onToggle: () => void;
  onDisconnect: () => void;
};

export function AccountItem({
  email,
  active,
  onToggle,
  onDisconnect,
}: Props) {
  return (
    <div className="flex items-center justify-between px-3 py-2 hover:bg-muted rounded-md">
      <div className="flex items-center gap-2 min-w-0">
        <Checkbox checked={active} onCheckedChange={onToggle} />

        <span className="text-sm truncate">
          {email}
        </span>
      </div>

      <button
        onClick={onDisconnect}
        className="text-muted-foreground hover:text-red-500 shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}