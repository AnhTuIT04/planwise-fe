import api from "@/lib/api";
import { IEvent } from "@/types/event.type";

interface UpdateEventPayload {
  provider: string;
  externalId: string;
  data: {
    title?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
  };
}

function toEvent(data: IEvent): IEvent {
  return data;
}

export function updateEventApi(payload: UpdateEventPayload) {
  return api.safeExec<IEvent>({
    method: "PATCH",
    url: `/integrations/events/${payload.provider}/${payload.externalId}`,
    data: payload.data,
  }, toEvent);
}