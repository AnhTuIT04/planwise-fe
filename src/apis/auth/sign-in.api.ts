import api from "@/lib/api";
import { IUser } from "@/types/user.type";

interface IRequest {
  email: string;
  password: string;
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

export function signInApi(payload: IRequest) {
  return api.safeExec<IUser>({ method: "POST", url: "auth/signin", data: payload }, toUser);
}
