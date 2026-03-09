"use client";

import { CalendarEventType } from "@/types/calendar.type";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { getEventHeight, getEventTop } from "./utils/calendar-position";

const EVENT_COLORS: Record<string, string> = {
  "0": "#2563eb",
  "1": "#4f46e5",
  "2": "#16a34a",
  "3": "#f97316",
};

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function CalendarEvent({
  event,
  column = 0,
  totalColumns = 1,
}: {
  event: CalendarEventType;
  column?: number;
  totalColumns?: number;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: event.id,
  });

  // RESIZE START
  const {
    listeners: startResizeListeners,
    setNodeRef: startResizeRef,
  } = useDraggable({
    id: `${event.id}-resize-start`,
  });

  // RESIZE END
  const {
    listeners: endResizeListeners,
    setNodeRef: endResizeRef,
  } = useDraggable({
    id: `${event.id}-resize-end`,
  });

  const top = getEventTop(event.start.dateTime);
  const height = getEventHeight(event.start.dateTime, event.end.dateTime);

  const width = 100 / totalColumns;
  const left = column * width;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="absolute cursor-move rounded-md p-2 text-xs text-white shadow"
      style={{
        top,
        height,
        left: `${left}%`,
        width: `${width}%`,
        transform: CSS.Translate.toString(transform),
        background: EVENT_COLORS[event.colorId || "1"],
      }}
    >
      {/* resize start */}
      <div
        ref={startResizeRef}
        {...startResizeListeners}
        className="absolute top-0 right-0 left-0 h-2 cursor-ns-resize"
      />
      <div className="font-semibold">{event.summary}</div>

      <div className="text-[10px] opacity-90">
        {formatTime(event.start.dateTime)} – {formatTime(event.end.dateTime)}
      </div>
      {/* resize end */}
      <div
        ref={endResizeRef}
        {...endResizeListeners}
        className="absolute right-0 bottom-0 left-0 h-2 cursor-ns-resize"
      />
    </div>
  );
}
