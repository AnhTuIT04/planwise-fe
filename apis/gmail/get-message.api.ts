import api from "@/lib/api";

export interface IMessage {
  externalId: string;
  threadId: string;
  subject: string;
  snippet?: string;
  body?: {
    html?: string;
    text?: string;
  };
  from: string;
  to: string;
  cc?: string;
  receivedAt: string;
  isUnread: boolean;
  labelIds: string[];
}

export interface IGetMessagesResponse {
  connectionId: string;
  messages: IMessage[];
}
function toMessages(messages: any): IGetMessagesResponse {
  return messages[0];
}
export async function getEmail(connectionId: string): Promise<IGetMessagesResponse> {
  const res = await api.get<IGetMessagesResponse>(`integrations/messages`, {
    params: {
      provider: "GOOGLE_GMAIL",
      connectionId,
      maxResults: 20
    },
  });

  return toMessages(res.data);
}
