"use client";

import { DndContext } from "@dnd-kit/core";

import { useState } from "react";
import { CalendarHourGrid } from "./calendar-hour-grid";
import { CalendarHeader } from "./calendar-header";
import { useCalendarEvents } from "@/hooks/useCalendar";

export function CalendarDayView() {
  const [date, setDate] = useState(new Date());
  const { events, moveEvent } = useCalendarEvents("GOOGLE_CALENDAR", date, new Date(date.getTime() -864000000).toISOString(), new Date(date.getTime() + 86400000).toISOString());

  return (
    <div className="flex h-full flex-col">
      <CalendarHeader
        date={date}
        onPrev={() => setDate((d) => new Date(d.getTime() - 86400000))}
        onNext={() => setDate((d) => new Date(d.getTime() + 86400000))}
      />

      <DndContext
        onDragEnd={(event) => {
          const id = event.active.id as string;
          const deltaY = event.delta.y;
          const deltaMinutes = Math.round(deltaY/5) * 5; // round to nearest 5 minutes

          moveEvent(id, deltaMinutes);
        }}
      >
        <CalendarHourGrid events={events} />
      </DndContext>
    </div>
  );
}
