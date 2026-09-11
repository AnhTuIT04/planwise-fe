import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useDndContext,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect } from "react";

interface DndProviderProps {
  onDragStart?: (event: DragStartEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  children: React.ReactNode;
}

export default function DndProvider({ onDragStart, onDragOver, onDragEnd, children }: DndProviderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
      {children}
      <PointerStyle />
    </DndContext>
  );
}

function PointerStyle() {
  const { active, over } = useDndContext();

  useEffect(() => {
    const body = document.body;

    if (!active) {
      body.classList.remove("dragging", "not-allowed");
      return;
    }

    body.classList.add("dragging");

    if (!over) {
      body.classList.add("not-allowed");
    } else {
      body.classList.remove("not-allowed");
    }

    return () => {
      body.classList.remove("dragging", "not-allowed");
    };
  }, [active, over]);

  return null;
}
