import { CalendarEventType } from "@/types/calendar.type";
import { parseISO } from "date-fns";

export type CalendarEventLayout = {
  event: CalendarEventType;
  column: number;
  totalColumns: number;
};

export function computeEventLayout(events: CalendarEventType[]): CalendarEventLayout[] {
  if (events.length === 0) return [];

  const sorted = [...events].sort(
    (a, b) => parseISO(a.start.dateTime).getTime() - parseISO(b.start.dateTime).getTime(),
  );

  // 1) Greedy column assignment: each event goes into the first column whose last event ends
  //    before this event starts; otherwise spawn a new column.
  const columns: CalendarEventType[][] = [];
  const eventColumn = new Map<string, number>();
  for (const event of sorted) {
    let placed = false;
    for (let i = 0; i < columns.length; i++) {
      const last = columns[i][columns[i].length - 1];
      if (parseISO(last.end.dateTime) <= parseISO(event.start.dateTime)) {
        columns[i].push(event);
        eventColumn.set(event.id, i);
        placed = true;
        break;
      }
    }
    if (!placed) {
      eventColumn.set(event.id, columns.length);
      columns.push([event]);
    }
  }

  // 2) Group sorted events into clusters (transitive overlap chains). totalColumns is computed
  //    per cluster so isolated events fill the full width even when other clusters split.
  const clusters: CalendarEventType[][] = [];
  let cluster: CalendarEventType[] = [];
  let clusterEnd = -Infinity;
  for (const event of sorted) {
    const start = parseISO(event.start.dateTime).getTime();
    const end = parseISO(event.end.dateTime).getTime();
    if (start < clusterEnd) {
      cluster.push(event);
      clusterEnd = Math.max(clusterEnd, end);
    } else {
      if (cluster.length > 0) clusters.push(cluster);
      cluster = [event];
      clusterEnd = end;
    }
  }
  if (cluster.length > 0) clusters.push(cluster);

  const totalByEvent = new Map<string, number>();
  for (const c of clusters) {
    let max = 0;
    for (const ev of c) max = Math.max(max, (eventColumn.get(ev.id) ?? 0) + 1);
    for (const ev of c) totalByEvent.set(ev.id, max);
  }

  return sorted.map((event) => ({
    event,
    column: eventColumn.get(event.id) ?? 0,
    totalColumns: totalByEvent.get(event.id) ?? 1,
  }));
}
