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
  user: {
    id: string;
    email: string;
    fullname: string;
    avatarUrl: string | null;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

function toUser(data: IResponse): IUser {
  return {
    id: data.user.id,
    email: data.user.email,
    fullname: data.user.fullname,
    avatarUrl: data.user.avatarUrl,
    verified: data.user.verified,
    createdAt: data.user.createdAt,
  };
}

export function verifyEmailApi(payload: IRequest) {
  return api.safeExec<IUser>({ method: "POST", url: "auth/verify-email", data: payload }, toUser);
}
