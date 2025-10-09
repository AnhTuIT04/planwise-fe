import api from "@/lib/api";
import { ISession } from "@/types/session.type";

interface IResponse {
  id: number,
  email: string,
  isVerified: boolean,
  verificationCodeExpiry: string,
  createdAt: string,
  updatedAt: string,

  toSession(): ISession;
}

function toSession(data: IResponse): ISession {
  return {
    user: {
      id: data.id,
      email: data.email,
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
