import api from "@/lib/api";
import { ISession } from "@/types/session.type";

interface IResponse {
  message: string;
  user: {
    id: string;
    email: string;
    createdAt: string;
  };

  toSession(): ISession;
}

function toSession(data: IResponse): ISession {
  return {
    user: {
      id: data.user.id,
      email: data.user.email,
    },
  };
}

export async function authApi(): Promise<IResponse> {
  const res = await api.get<IResponse>("auth/me");
  return {
    ...res.data,
    toSession: () => toSession(res.data),
  };
}
