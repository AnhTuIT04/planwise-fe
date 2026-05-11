import api from "@/lib/api";
import { IConnectionDetails, IEvent, IntegrationProvider } from "@/types/event.type";

interface GetEventsParams {
  provider: IntegrationProvider;
  timeMin?: string;
  timeMax?: string;
}

function toEvents(data: IConnectionDetails[]): IConnectionDetails[] {
  return data;
}

export function getEventsApi(params: GetEventsParams) {
  return api.safeExec<IConnectionDetails[]>({
    method: "GET",
    url: "integrations/events",
    params,
  }, toEvents);
}