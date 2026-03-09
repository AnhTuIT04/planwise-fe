import api from "@/lib/api";

export function deleteEventApi(provider: string, externalId: string) {
  return api.safeExec<void>({
    method: "DELETE",
    url: `/integrations/events/${provider}/${externalId}`,
  });
}