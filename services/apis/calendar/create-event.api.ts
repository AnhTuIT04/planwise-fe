import api from "@/lib/api";
import { IEvent, CreateEventRequest } from "@/types/event.type";

function toEvent(data: IEvent): IEvent {
  return data;
}

export function createEventApi(payload: CreateEventRequest) {
  return api.safeExec<IEvent>({
    method: "POST",
    url: "/integrations/events",
    data: payload,
  }, toEvent);
}