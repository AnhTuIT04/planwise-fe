"use client";

import { CalendarDayView } from "@/components/sidebar/right-sidebar/calendar-sidebar/calendar-section/calendar-day-view";
import { useCalendarIntegration } from "@/hooks/useCalendarIntegration";
import { AccountHeader } from "./account-section/account-header";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function CalendarSidebar() {
  const { integrated, connections, isLoading } = useCalendarIntegration("GOOGLE_CALENDAR");
  const queryClient = useQueryClient();

  const [activeConnectionIds, setActiveConnectionIds] = useState<string[]>([]);

  useEffect(() => {
    // if (window.location.search.includes("calendar_connected=true")) {
      queryClient.invalidateQueries({ queryKey: ["calendar-connections", "GOOGLE_CALENDAR"] });
      queryClient.invalidateQueries({ queryKey: ["events", "GOOGLE_CALENDAR"] });
    // }
  }, []);

  useEffect(() => {
  if (connections && connections.length > 0) {
    setActiveConnectionIds(connections.map((c) => c.id));
  }
}, [connections]);

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Loading...</div>;
  }


  return (
    <div className="flex h-full w-full flex-col bg-[#f8f8f9]">
      <AccountHeader integrated={integrated} connections={connections} activeConnectionIds={activeConnectionIds} setActiveConnectionIds={setActiveConnectionIds} />

      <div className="flex-1 overflow-y-auto">
        <CalendarDayView activeConnectionIds={activeConnectionIds} />
      </div>
    </div>
  );
}
