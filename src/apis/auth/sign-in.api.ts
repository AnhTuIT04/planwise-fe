import api from "@/lib/api";
import { IUser } from "@/types/user.type";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  data: {
    user: {
      id: string;
      email: string;
      fullname: string;
      avatarUrl: string | null;
      verified: boolean;
      createdAt: string;
      updatedAt: string;
    };
    accessToken: string;
  };
  message: string;
}

function toUser(data: IResponse): IUser {
  return {
    id: data.data.user.id,
    email: data.data.user.email,
    fullname: data.data.user.fullname,
    avatarUrl: data.data.user.avatarUrl,
    verified: data.data.user.verified,
    createdAt: data.data.user.createdAt,
  };
}

export async function signInApi(payload: IRequest) {
  const res = await api.post<IResponse>("auth/signin", payload);

  return {
    ...res.data,
    toUser: () => toUser(res.data),
  };
}
