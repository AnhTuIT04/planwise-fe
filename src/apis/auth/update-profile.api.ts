import api from "@/lib/api";
import { IUser } from "@/types/user.type";

interface IRequest {
  fullname?: string;
  avatarUrl?: String;
}

interface IResponse {
  data: {
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
    id: data.data.id,
    email: data.data.email,
    fullname: data.data.fullname,
    avatarUrl: data.data.avatarUrl,
    verified: data.data.verified,
    createdAt: data.data.createdAt,
  };
}

export function updateProfileApi(payload: IRequest) {
  return api.safeExec<IUser>({ method: "PATCH", url: "auth/me", data: payload }, toUser);
}
