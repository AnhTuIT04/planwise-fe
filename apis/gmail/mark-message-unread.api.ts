import api from "@/lib/api";

export async function markGmailMessageAsUnreadApi(connectionId: string, externalId: string) {
  return api.safeExec({
    method: "PATCH",
    url: `integrations/messages/GOOGLE_GMAIL/${connectionId}/${externalId}`,
    data: {
      addLabelIds: ["UNREAD"],
      removeLabelIds: [],
    },
  });
}
