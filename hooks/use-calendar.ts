"use client";

import { addMinutes, isSameDay, parseISO } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getEventsApi } from "@/services/apis/calendar/get-events.api";
import { createEventApi } from "@/services/apis/calendar/create-event.api";
import { updateEventApi } from "@/services/apis/calendar/update-event.api";
import { deleteEventApi } from "@/services/apis/calendar/delete-event.api";

import { IConnectionDetails, IEvent } from "@/types/event.type";
import { CalendarEventType } from "@/types/calendar.type";

//
// ======================
// DATA LAYER
// ======================
//

export function useCalendar(provider: "GOOGLE_CALENDAR", timeMin?: string, timeMax?: string) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<IConnectionDetails[]>({
    queryKey: ["events", provider, timeMin, timeMax],
    queryFn: async () => {
      const [res, err] = await getEventsApi({ provider, timeMin, timeMax });
      if (err) throw err;
      return res;
    },
  });

  const createEvent = useMutation({
    mutationFn: createEventApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", provider] });
      toast.success("Event created");
    },
  });

  const updateEvent = useMutation({
    mutationFn: updateEventApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", provider] });
      toast.success("Event updated");
    },
  });

  const deleteEvent = useMutation({
    mutationFn: ({ provider, externalId }: { provider: string; externalId: string }) =>
      deleteEventApi(provider, externalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", provider] });
      toast.success("Event deleted");
    },
  });

  return {
    connections: data,
    isLoading,

    createEvent: createEvent.mutateAsync,
    updateEvent: updateEvent.mutateAsync,
    deleteEvent: deleteEvent.mutateAsync,
  };
}

//
// ======================
// UI INTERACTION LAYER
// ======================
//

export function useCalendarEvents(provider: "GOOGLE_CALENDAR", activeConnectionIds: string[], currentDate: Date, timeMin?: string, timeMax?: string) {
  const { connections, isLoading: isLoadingCalendar, updateEvent } = useCalendar(provider, timeMin, timeMax);

  // gather events from all active connections
  const events = connections
    ?.filter((c) => activeConnectionIds.includes(c.connectionId))
    .flatMap((c) => c.events) ?? [];

  // filter only events of this day
  const dayEvents = events?.filter((e) => isSameDay(parseISO(e.startTime), currentDate)) ?? [];

  async function moveEvent(id: string, deltaMinutes: number) {
    const eventId = id.split("-")[0];

    const event = events?.find((e) => e.externalId === eventId);
    if (!event) return;

    const start = parseISO(event.startTime);
    const end = parseISO(event.endTime);

    let newStart = start;
    let newEnd = end;

    if (id.endsWith("resize-start")) {
      newStart = addMinutes(start, deltaMinutes);
    } else if (id.endsWith("resize-end")) {
      newEnd = addMinutes(end, deltaMinutes);
    } else {
      newStart = addMinutes(start, deltaMinutes);
      newEnd = addMinutes(end, deltaMinutes);
    }

    const startUTC = fromZonedTime(newStart, "Asia/Ho_Chi_Minh");
    const endUTC = fromZonedTime(newEnd, "Asia/Ho_Chi_Minh");
    await updateEvent({
      provider: event.provider,
      externalId: event.externalId,
      data: {
        startTime: startUTC.toISOString(),
        endTime: endUTC.toISOString(),
      },
    });
  }

  //
  // Convert backend event → UI event
  //
  const mappedEvents: CalendarEventType[] =
    dayEvents?.map((e) => ({
      id: e.externalId,
      summary: e.title,
      description: e.description,
      isAllDay: e.isAllDay,
      location: e.location,
      start: { dateTime: e.startTime },
      end: { dateTime: e.endTime },
      colorId: Math.round(Math.random() * 3).toString(),
    })) ?? [];

  return {
    isLoadingCalendar,
    events: mappedEvents,
    moveEvent,
  };
}
