"use client";

import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";

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
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
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

      <DndContext
        sensors={sensors}
        modifiers={[restrictToParentElement]}
        onDragEnd={(event) => {
          const id = event.active.id as string;
          const deltaY = event.delta.y;
          const deltaMinutes = Math.round(deltaY / 5) * 5; // round to nearest 5 minutes
          if (deltaMinutes === 0) return;

          moveEvent(id, deltaMinutes);
        }}
      >
        <CalendarHourGrid events={events} />
      </DndContext>
    </div>
  );
}
