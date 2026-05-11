import api, { SafeExecResult } from "@/lib/api";

export interface IConnection {
  id: string;
  provider: string;
  accountIdentifier: string;
  isActive: boolean;
  scopes: string[];
  createdAt: string;
}

export async function getConnectionsApi(provider: string): Promise<SafeExecResult<IConnection[]>> {
  return api.safeExec<IConnection[]>({
    method: "GET",
    url: `integrations/connections/${provider}`,
  });
}
