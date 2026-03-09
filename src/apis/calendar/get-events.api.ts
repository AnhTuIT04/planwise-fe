import api from "@/lib/api";
import { IEvent, IntegrationProvider } from "@/types/event.type";

interface GetEventsParams {
  provider: IntegrationProvider;
  timeMin?: string;
  timeMax?: string;
}

function toEvents(data: IEvent[]): IEvent[] {
  return data;
}

export function getEventsApi(params: GetEventsParams) {
  return api.safeExec<IEvent[]>({
    method: "GET",
    url: "/integrations/events",
    params,
  }, toEvents);
}