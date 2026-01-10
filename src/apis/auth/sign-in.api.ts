import api from "@/lib/api";
import { IUser } from "@/types/user.type";

interface IRequest {
  email: string;
  password: string;
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

export async function signInApi(payload: IRequest) {
  const res = await api.post<IResponse>("auth/signin", payload);

  return {
    ...res.data,
    toUser: () => toUser(res.data),
  };
}
