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

export async function updateProfileApi(payload: IRequest) {
  const res = await api.patch<IResponse>("auth/me", payload);

  return {
    ...res.data,
    toUser: () => toUser(res.data),
  };
}
