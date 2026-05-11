import api from "@/lib/api";

interface IConnectionResponse {
  id: string;
  provider: string;
  accountIdentifier: string;
  isActive: boolean;
  scopes: string[];
  createdAt: string;
}

export interface Connection {
  id: string;
  provider: string;
  email: string;
}



function toConnections(data: IConnectionResponse[]): Connection[] {
  return data.map((conn) => ({
    id: conn.id,
    provider: conn.provider,
    email: conn.accountIdentifier,
  }));
}

export function getConnectionsApi(provider: string) {
  return api.safeExec<Connection[]>(
    {
      method: "GET",
      url: `integrations/connections/${provider}`,
    },
    toConnections,
  );
}
