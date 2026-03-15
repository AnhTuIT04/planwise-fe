import { CalendarEvent } from "@/components/sidebar/right-sidebar/calendar-sidebar/calendar-section/calendar-event";
import { CalendarEventType } from "@/types/calendar.type";
import { CurrentTimeIndicator } from "./current-time-indicator";
import { useEffect, useRef } from "react";
import { computeEventLayout } from "../utils/calendar-overlap";
import useModal from "@/hooks/useModal";
import { CreateEventRequest } from "@/types/event.type";
import { useCalendarIntegration } from "@/hooks/useCalendarIntegration";
import { useRouter } from "next/navigation";
import { apiBaseURL } from "@/lib/consts";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function CalendarHourGrid({ events }: { events: CalendarEventType[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layout = computeEventLayout(events);
  const { openModal } = useModal<"CREATE_UPDATE_EVENT">();
  const { openModal: openConfirmModal } = useModal<"CONFIRM">();
  const { integrated } = useCalendarIntegration("GOOGLE_CALENDAR");

  const router = useRouter(); // used in the modal (client component)

  const handleCreateUpdateEvent = (type: "CREATE" | "UPDATE", event: CreateEventRequest, externalEventId?: string) => {
    if (type === "CREATE" && !integrated) {
      openConfirmModal({
        type: "CONFIRM",
        data: {
          title: "No Calendar Connected",
          description: "Please connect a calendar account before creating events.",
          confirmText: "Connect with GG Calendar",
          cancelText: "Cancel",
        },
        onSubmit: async () => {
          router.push(`${apiBaseURL}/integrations/connect/GOOGLE_CALENDAR`);
        },
      });
      return;
    }

    openModal({
      type: "CREATE_UPDATE_EVENT",
      data: {
        action: type,
        externalEventId: type === "UPDATE" ? externalEventId : undefined,
        event,
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
      <div
        className="relative flex-1"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const y = e.clientY - rect.top;
          const hour = Math.floor(y / 60);
          const date = new Date();
          date.setHours(hour, 0, 0, 0);
          handleCreateUpdateEvent("CREATE", {
            provider: "GOOGLE_CALENDAR",
            title: "",
            description: "",
            startTime: date.toISOString(),
            endTime: new Date(date.getTime() + 60 * 60 * 1000).toISOString(),
            location: "",
            attendees: [],
          });
        }}
      >
        {HOURS.map((h) => (
          <div key={h} className="h-[60px] border-b border-dashed" />
        ))}

        <CurrentTimeIndicator />

        {layout.columns.map((column, colIndex) =>
          column.map((event) => (
            <CalendarEvent
              onClick={(e) => {
                e.stopPropagation();
                handleCreateUpdateEvent(
                  "UPDATE",
                  {
                    provider: "GOOGLE_CALENDAR",
                    title: event.summary,
                    description: event.description,
                    startTime: event.start.dateTime,
                    endTime: event.end.dateTime,
                    location: event.location,
                    attendees: event.attendees || [],
                  },
                  event.id,
                );
              }}
              key={event.id}
              event={event}
              column={colIndex}
              totalColumns={layout.total}
            />
          )),
        )}
      </div>
    </div>
  );
}
