import api from "@/lib/api";
import { IAuth } from "@/types/session.type";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    isVerified: boolean;
    verificationCode: string | null;
    verificationCodeExpiry: string | null;
    createdAt: string;
    updatedAt: string;
  };

  toAuth(): IAuth;
}

function toAuth(data: IResponse): IAuth {
  return {
    id: data.user.id,
    email: data.user.email,
    accessToken: data.accessToken,
    refreshToken: "",
  };
}

export async function signInApi(payload: IRequest): Promise<IResponse> {
  const res = await api.post("auth/sign-in", payload);
  return {
    ...res.data,
    toAuth: () => toAuth(res.data),
  };
}
