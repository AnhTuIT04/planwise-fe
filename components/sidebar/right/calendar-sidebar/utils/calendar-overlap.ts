import { CalendarEventType } from "@/types/calendar.type";
import { parseISO } from "date-fns";

export function computeEventLayout(events: CalendarEventType[]) {
  const sorted = [...events].sort(
    (a, b) =>
      parseISO(a.start.dateTime).getTime() -
      parseISO(b.start.dateTime).getTime()
  );

  const columns: CalendarEventType[][] = [];

  sorted.forEach((event) => {
    let placed = false;

    for (const col of columns) {
      const last = col[col.length - 1];

      if (
        parseISO(last.end.dateTime) <=
        parseISO(event.start.dateTime)
      ) {
        col.push(event);
        placed = true;
        break;
      }
    }

    if (!placed) {
      columns.push([event]);
    }
  });

  return { columns, total: columns.length };
}