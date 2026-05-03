import api from "@/lib/api";

export function deleteConnectionApi(provider: string, connectionId: string) {
  return api.safeExec<void>({
    method: "DELETE",
    url: `/integrations/connections/${provider}/${connectionId}`,
  });
}