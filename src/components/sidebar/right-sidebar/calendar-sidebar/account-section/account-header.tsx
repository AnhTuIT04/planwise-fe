"use client";

import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { AccountManager } from "./account-manager";
import { Connection } from "@/apis/calendar/get-connections.api";

export function AccountHeader({ integrated, connections, activeConnectionIds, setActiveConnectionIds }: { integrated: boolean; connections: Connection[]; activeConnectionIds: string[]; setActiveConnectionIds: React.Dispatch<React.SetStateAction<string[]>> }) {
  return (
    <div className="flex h-12 items-center justify-between border-b px-4">
      <div className="flex flex-col">
        <span className="text-[16px] font-semibold text-[#787878]">
          Google Calendar
        </span>

        {!integrated && (
          <span className="text-xs text-muted-foreground">
            Not connected
          </span>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <MoreVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <AccountManager connections={connections} activeConnectionIds={activeConnectionIds} setActiveConnectionIds={setActiveConnectionIds} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}