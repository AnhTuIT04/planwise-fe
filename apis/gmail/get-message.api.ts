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
  nextPageToken?: string;
}

function toMessages(payload: any): IGetMessagesResponse {
  // Backend returns ConnectionMessageDetailsResponseDto[] (one entry per connection).
  return payload[0];
}

export async function getEmail(connectionId: string, pageToken?: string): Promise<IGetMessagesResponse> {
  const res = await api.get<IGetMessagesResponse[]>(`integrations/messages`, {
    params: {
      provider: "GOOGLE_GMAIL",
      connectionId,
      maxResults: 20,
      ...(pageToken ? { pageToken } : {}),
    },
  });

  return toMessages(res.data);
}
