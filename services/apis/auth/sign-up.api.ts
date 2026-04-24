import api from "@/lib/api";
import { IUser } from "@/types/user.type";

interface ISignUpRequest {
  email: string;
  fullname: string;
  password: string;
}

interface ISignUpResponse {
  message: string;
}

export async function signUpApi(payload: ISignUpRequest) {
  return api.post<ISignUpResponse>("auth/signup", payload);
}

interface IRequest {
  email: string;
  otp: string;
}

interface IResponse {
  data: {
    id: string;
    email: string;
    fullname: string;
    avatarUrl: string | null;
    workspaceId: string;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

function toUser(data: IResponse): IUser {
  return {
    id: data.data.id,
    email: data.data.email,
    fullname: data.data.fullname,
    avatarUrl: data.data.avatarUrl,
    workspaceId: data.data.workspaceId,
    createdAt: data.data.createdAt,
  };
}

export async function verifyEmailApi(payload: IRequest) {
  const res = await api.post<IResponse>("auth/verify-email", payload);

  return {
    ...res.data,
    toUser: () => toUser(res.data),
  };
}
