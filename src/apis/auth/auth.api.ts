import api from "@/lib/api";
import { ISession } from "@/types/session.type";

interface IResponse {
  "user": {
    "id": string,
    "email": string,
    "name": string | null,
    "avatarUrl": string | null,
    "verified": boolean,
    "createdAt": string,
    "updatedAt": string
  },
  "message": string,
  toSession: () => ISession;
}

function toSession(data: IResponse): ISession {
  console.log("data",data);
  return {
    user: {
      id: data.user.id,
      email: data.user.email,
    },
  };
}

export async function authApi(): Promise<IResponse> {
  try {
    const res = await api.get<IResponse>("auth/me");
    return {
      ...res.data,
      toSession: () => toSession(res.data),
    };
  } catch (error: any) {
    console.log("babababbababababab", { error });
    throw error;
  }
}
