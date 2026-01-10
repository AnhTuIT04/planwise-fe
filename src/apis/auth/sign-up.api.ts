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

export function signUpApi(payload: ISignUpRequest) {
  return api.safeExec<ISignUpResponse>({ method: "POST", url: "auth/signup", data: payload });
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
    verified: boolean;
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
    verified: data.data.verified,
    createdAt: data.data.createdAt,
    workspaceId: data.data.workspaceId,
  };
}

export function verifyEmailApi(payload: IRequest) {
  return api.safeExec<IUser>({ method: "POST", url: "auth/verify-email", data: payload }, toUser);
}
