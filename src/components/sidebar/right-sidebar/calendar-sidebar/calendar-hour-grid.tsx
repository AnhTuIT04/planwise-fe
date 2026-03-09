import { CalendarEvent } from "@/components/sidebar/right-sidebar/calendar-sidebar/calendar-event";
import { CalendarEventType } from "@/types/calendar.type";
import { CurrentTimeIndicator } from "./current-time-indicator";
import { useEffect, useRef } from "react";
import { computeEventLayout } from "./utils/calendar-overlap";
import useModal from "@/hooks/useModal";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function CalendarHourGrid({ events }: { events: CalendarEventType[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layout = computeEventLayout(events);
  const { openModal } = useModal<"CREATE_EVENT">();

  const handleCreateEvent = (date: Date) => {
  openModal({
    type: "CREATE_EVENT",
    data: {
      startTime: date.toISOString(),
      endTime: new Date(date.getTime() + 60 * 60 * 1000).toISOString(), // default 1 hour
    },
  });
};

  useEffect(() => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();

    containerRef.current?.scrollTo({
      top: minutes - 200,
    });
  }, []);
  return (
    <div ref={containerRef} className="flex flex-1 overflow-y-auto">
      {/* hour labels */}
      <div className="w-14 border-r text-xs text-gray-400">
        {HOURS.map((h) => (
          <div key={h} className="h-[60px] px-1 text-right">
            {h}:00
          </div>
        ))}
      </div>

      {/* calendar column */}
      <div className="relative flex-1" onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const hour = Math.floor(y / 60);
        const date = new Date();
        date.setHours(hour, 0, 0, 0);
        console.log("Create event at", date);
        handleCreateEvent(date);
      }}>
        {HOURS.map((h) => (
          <div key={h} className="h-[60px] border-b border-dashed" />
        ))}

        <CurrentTimeIndicator />

        {layout.columns.map((column, colIndex) =>
          column.map((event) => (
            <CalendarEvent key={event.id} event={event} column={colIndex} totalColumns={layout.total} />
          )),
        )}
      </div>
    </div>
  );
}
