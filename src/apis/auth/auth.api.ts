import api from "@/lib/api";
import { IUser } from "@/types/user.type";

interface IResponse {
  data: {
    id: string;
    email: string;
    fullname: string;
    avatarUrl: string | null;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
    workspaceId: string;
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

export async function authApi() {
  const res = await api.get<IResponse>("auth/me");

  return {
    ...res.data,
    toUser: () => toUser(res.data),
  };
}
