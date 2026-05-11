import api from "@/lib/api";

export async function markGmailMessageAsReadApi(connectionId: string, externalId: string) {
  return api.safeExec({
    method: "PATCH",
    url: `integrations/messages/GOOGLE_GMAIL/${connectionId}/${externalId}/read`,
  });
}
