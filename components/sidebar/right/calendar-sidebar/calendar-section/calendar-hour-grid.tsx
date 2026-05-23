import { CalendarEvent } from "@/components/sidebar/right/calendar-sidebar/calendar-section/calendar-event";
import { CalendarEventType } from "@/types/calendar.type";
import { CurrentTimeIndicator } from "./current-time-indicator";
import { useEffect, useRef, MouseEvent } from "react";
import { computeEventLayout } from "../utils/calendar-overlap";
import useModal from "@/hooks/use-modal";
import { CreateEventRequest } from "@/types/event.type";
import { useCalendarIntegration } from "@/hooks/use-calendar-integration";
import { useRouter } from "next/navigation";
import { apiURL } from "@/lib/consts";
import {
  DndContext,
  PointerSensor,
  useDndMonitor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

const HOUR_DROP_ID_PREFIX = "calendar-hour-";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

// Each hour row is its own droppable so @dnd-kit's collision detection picks
// the exact hour the user dropped on — no coordinate math, no cursor-tracking
// quirks. The over.id encodes the hour.
function HourDropZone({ hour }: { hour: number }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${HOUR_DROP_ID_PREFIX}${hour}`,
    data: { type: "calendar-hour", hour },
  });
  return (
    <div
      ref={setNodeRef}
      className={`h-[60px] border-b border-dashed ${isOver ? "bg-blue-50" : ""}`}
    />
  );
}

// Task titles can come from a rich-text source (e.g. wrapped in <p>); strip tags
// before they land in a calendar event title.
function stripHtml(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
}

export function CalendarHourGrid({
  events,
  onMoveEvent,
}: {
  events: CalendarEventType[];
  onMoveEvent: (id: string, deltaMinutes: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layout = computeEventLayout(events);
  const { openModal } = useModal<"CREATE_UPDATE_EVENT">();
  const { openModal: openConfirmModal } = useModal<"CONFIRM">();
  const { integrated } = useCalendarIntegration("GOOGLE_CALENDAR");

  const router = useRouter(); // used in the modal (client component)

  const eventSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

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
          router.push(`${apiURL}/integrations/connect/GOOGLE_CALENDAR`);
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

  // Catches task drags from the outer DndContext (project area) released over
  // a calendar hour row; turns them into "create new calendar event at this
  // hour". The over.id encodes which hour was dropped on.
  useDndMonitor({
    onDragEnd: (event) => {
      const overData = event.over?.data.current;
      if (overData?.type !== "calendar-hour") return;
      if (event.active.data.current?.type !== "task") return;

      const hour = overData.hour as number;
      const date = new Date();
      date.setHours(hour, 0, 0, 0);

      const task = event.active.data.current.data;
      handleCreateUpdateEvent("CREATE", {
        provider: "GOOGLE_CALENDAR",
        title: stripHtml(task.title),
        description: task.description ?? "",
        startTime: date.toISOString(),
        endTime: new Date(date.getTime() + 60 * 60 * 1000).toISOString(),
        location: "",
        attendees: [],
      });
    },
  });

  useEffect(() => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();

    containerRef.current?.scrollTo({
      top: minutes - 200,
    });
  }, []);
  return (
    <div ref={containerRef} className="flex flex-1 overflow-x-hidden overflow-y-auto">
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
          <HourDropZone key={h} hour={h} />
        ))}

        <CurrentTimeIndicator />

        {/* Inner DndContext: in-place event move/resize. Scoped to the events
            only so the calendar column above remains a drop target of the
            outer DndContext (where kanban task drags live). */}
        <DndContext
          sensors={eventSensors}
          onDragEnd={(e) => {
            const id = e.active.id as string;
            const deltaMinutes = Math.round(e.delta.y / 5) * 5;
            if (deltaMinutes === 0) return;
            onMoveEvent(id, deltaMinutes);
          }}
        >
          {layout.map(({ event, column, totalColumns }) => (
            <CalendarEvent
              onClick={(e: MouseEvent) => {
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
              column={column}
              totalColumns={totalColumns}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
}
