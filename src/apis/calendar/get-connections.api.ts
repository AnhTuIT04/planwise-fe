import api from "@/lib/api";

interface Connection {
  id: string;
  provider: string;
  email?: string;
}

function toConnections(data: Connection[]): Connection[] {
  return data;
}

export function getConnectionsApi(provider: string) {
  return api.safeExec<Connection[]>({
    method: "GET",
    url: `/integrations/connections/${provider}`,
  }, toConnections);
}