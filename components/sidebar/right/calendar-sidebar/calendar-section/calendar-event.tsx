"use client";

import { GripVertical } from "lucide-react";
import { CalendarEventType } from "@/types/calendar.type";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { getEventHeight, getEventTop } from "../utils/calendar-position";

// Google Calendar event color palette (colorId 1-11). "default" applies when no colorId is present.
const EVENT_COLORS: Record<string, string> = {
  default: "#4f46e5",
  "1": "#7986cb", // Lavender
  "2": "#33b679", // Sage
  "3": "#8e24aa", // Grape
  "4": "#e67c73", // Flamingo
  "5": "#f6c026", // Banana
  "6": "#f5511d", // Tangerine
  "7": "#039be5", // Peacock
  "8": "#616161", // Graphite
  "9": "#3f51b5", // Blueberry
  "10": "#0b8043", // Basil
  "11": "#d60000", // Tomato
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
  const card = useDraggable({ id: event.id });
  const startResize = useDraggable({ id: `${event.id}-resize-start` });
  const endResize = useDraggable({ id: `${event.id}-resize-end` });

  const top = getEventTop(event.start.dateTime);
  const height = getEventHeight(event.start.dateTime, event.end.dateTime);

  // Live drag feedback. Whichever of the three is being dragged contributes its
  // delta; the others stay 0. We translate the whole card during move, and
  // stretch top/height during resize so the card visibly changes shape.
  const moveDelta = card.transform?.y ?? 0;
  const startDelta = startResize.transform?.y ?? 0;
  const endDelta = endResize.transform?.y ?? 0;

  const adjustedTop = top + startDelta;
  const adjustedHeight = Math.max(15, height - startDelta + endDelta);

  const width = 100 / totalColumns;
  const left = column * width;
  const colorKey = event.colorId && EVENT_COLORS[event.colorId] ? event.colorId : "default";
  const isDragging = card.isDragging || startResize.isDragging || endResize.isDragging;

  // Stop pointer events from bubbling so the outer card's dnd-kit listener
  // doesn't hijack pointerdowns that started on the grip or a resize strip.
  const stopPointer = (e: React.PointerEvent) => e.stopPropagation();
  const stopClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      ref={card.setNodeRef}
      {...card.listeners}
      {...card.attributes}
      onClick={onClick}
      className="group absolute cursor-grab overflow-hidden rounded-md p-2 text-xs text-white shadow transition-opacity active:cursor-grabbing"
      style={{
        top: adjustedTop,
        height: adjustedHeight,
        left: `${left}%`,
        width: `${width}%`,
        transform: card.transform ? CSS.Translate.toString(card.transform) : undefined,
        background: EVENT_COLORS[colorKey],
        opacity: isDragging ? 0.7 : 1,
        touchAction: "none",
      }}
    >
      {/* Top resize handle */}
      <div
        ref={startResize.setNodeRef}
        {...startResize.listeners}
        onPointerDown={(e) => {
          stopPointer(e);
          startResize.listeners?.onPointerDown?.(e);
        }}
        onClick={stopClick}
        className="absolute top-0 right-0 left-0 z-20 h-2 cursor-ns-resize"
        style={{ touchAction: "none" }}
      />

      <div className="flex items-start gap-1">
        {/* Grip handle — HTML5 drag source for dragging the event out to a kanban section. */}
        <div
          draggable
          onDragStart={(e) => {
            e.stopPropagation();
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
          onPointerDown={stopPointer}
          onClick={stopClick}
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

      {/* Bottom resize handle */}
      <div
        ref={endResize.setNodeRef}
        {...endResize.listeners}
        onPointerDown={(e) => {
          stopPointer(e);
          endResize.listeners?.onPointerDown?.(e);
        }}
        onClick={stopClick}
        className="absolute right-0 bottom-0 left-0 z-20 h-2 cursor-ns-resize"
        style={{ touchAction: "none" }}
      />
    </div>
  );
}
