"use client";

import { useState } from "react";
import { CalendarHourGrid } from "./calendar-hour-grid";
import { CalendarHeader } from "./calendar-header";
import { useCalendarEvents } from "@/hooks/use-calendar";

export function CalendarDayView({ activeConnectionIds }: { activeConnectionIds: string[] }) {
  const [date, setDate] = useState(new Date());
  const { events, isLoadingCalendar, moveEvent } = useCalendarEvents(
    "GOOGLE_CALENDAR",
    activeConnectionIds,
    date,
    new Date(date.getTime() - 86400000).toISOString(),
    new Date(date.getTime() + 86400000).toISOString(),
  );

  if (isLoadingCalendar) {
    return <div className="flex h-full items-center justify-center">Loading...</div>;
  }
  return (
    <div className="flex h-full flex-col">
      <CalendarHeader
        date={date}
        onPrev={() => setDate((d) => new Date(d.getTime() - 86400000))}
        onNext={() => setDate((d) => new Date(d.getTime() + 86400000))}
      />

      <CalendarHourGrid events={events} onMoveEvent={moveEvent} />
    </div>
  );
}
