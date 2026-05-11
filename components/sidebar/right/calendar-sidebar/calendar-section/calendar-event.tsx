"use client";

import { GripVertical } from "lucide-react";
import { CalendarEventType } from "@/types/calendar.type";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { getEventHeight, getEventTop } from "../utils/calendar-position";

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
  onClick,
}: {
  event: CalendarEventType;
  column?: number;
  totalColumns?: number;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
  });

  // RESIZE START
  const { listeners: startResizeListeners, setNodeRef: startResizeRef } = useDraggable({
    id: `${event.id}-resize-start`,
  });

  // RESIZE END
  const { listeners: endResizeListeners, setNodeRef: endResizeRef } = useDraggable({
    id: `${event.id}-resize-end`,
  });

  const top = getEventTop(event.start.dateTime);
  const height = getEventHeight(event.start.dateTime, event.end.dateTime);

  const width = 100 / totalColumns;
  const left = column * width;

  return (
    <div
      ref={setNodeRef}
      draggable
      onDragStart={(e) => {
        const payload = {
          id: event.id,
          title: event.summary,
          description: event.description || "",
          start: event.start.dateTime,
          end: event.end.dateTime,
          location: event.location,
          attendees: event.attendees,
        };
        e.dataTransfer.setData("application/x-planwise-calendar-event", JSON.stringify(payload));
        e.dataTransfer.effectAllowed = "copy";
      }}
      onClick={onClick}
      className="group absolute cursor-pointer rounded-md p-2 text-xs text-white shadow transition-opacity"
      style={{
        top,
        height,
        left: `${left}%`,
        width: `${width}%`,
        transform: CSS.Translate.toString(transform),
        background: EVENT_COLORS[event.colorId || "1"],
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div className="flex items-start gap-1">
        <div
          {...listeners}
          {...attributes}
          className="cursor-grab opacity-0 transition-opacity group-hover:opacity-100"
        >
          <GripVertical className="h-3 w-3" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold">{event.summary}</div>
        </div>
      </div>

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
