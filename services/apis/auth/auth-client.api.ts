import api from "@/lib/api";
import { IUser } from "@/types/user.type";

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

export async function authClientApi() {
  const res = await api.get<IResponse>("auth/me");

  return {
    ...res.data,
    toUser: () => toUser(res.data),
  };
}
