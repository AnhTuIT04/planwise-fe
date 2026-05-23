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

const CALENDAR_DROP_ID = "calendar-hour-grid";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

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
  const columnRef = useRef<HTMLDivElement | null>(null);
  // Latest cursor Y in viewport coords. We track it globally so onDragEnd can
  // resolve the drop-hour from the actual cursor, not from
  // activatorEvent + delta (which drifts when the source is far from the drop
  // and the auto-scroll engages).
  const pointerYRef = useRef<number>(0);
  const layout = computeEventLayout(events);
  const { openModal } = useModal<"CREATE_UPDATE_EVENT">();
  const { openModal: openConfirmModal } = useModal<"CONFIRM">();
  const { integrated } = useCalendarIntegration("GOOGLE_CALENDAR");

  const router = useRouter(); // used in the modal (client component)

  const droppable = useDroppable({ id: CALENDAR_DROP_ID });
  const setColumnRef = (node: HTMLDivElement | null) => {
    columnRef.current = node;
    droppable.setNodeRef(node);
  };

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
  // this grid; turns them into "create new calendar event at this hour".
  useDndMonitor({
    onDragEnd: (event) => {
      if (event.over?.id !== CALENDAR_DROP_ID) return;
      if (event.active.data.current?.type !== "task") return;

      const column = columnRef.current;
      if (!column) return;

      const rect = column.getBoundingClientRect();
      const offsetMinutes = Math.max(0, Math.min(24 * 60 - 30, pointerYRef.current - rect.top));
      const hour = Math.floor(offsetMinutes / 60);
      const minute = Math.floor((offsetMinutes % 60) / 30) * 30;

      const date = new Date();
      date.setHours(hour, minute, 0, 0);

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
    const handler = (e: PointerEvent) => {
      pointerYRef.current = e.clientY;
    };
    document.addEventListener("pointermove", handler);
    return () => document.removeEventListener("pointermove", handler);
  }, []);

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
        ref={setColumnRef}
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
