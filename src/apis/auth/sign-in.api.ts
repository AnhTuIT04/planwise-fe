import api from "@/lib/api";
import { IAuth } from "@/types/session.type";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  message: string;
  user: {
    id: string;
    email: string;
    createdAt: string;
  };
  accessToken: string;
  refreshToken: string;

  toAuth(): IAuth;
}

function toAuth(data: IResponse): IAuth {
  return {
    id: data.user.id,
    email: data.user.email,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
}

export async function signInApi(payload: IRequest): Promise<IResponse> {
  const res = await api.post("auth/sign-in", payload);
  return {
    ...res.data,
    toAuth: () => toAuth(res.data),
  };
}
