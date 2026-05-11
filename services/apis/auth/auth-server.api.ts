import { cookies } from "next/headers";

import { apiURL } from "@/lib/consts";
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

export async function getAuthServerApi() {
  const cookiesStore = await cookies();

  const res = await fetch(`${apiURL}/auth/me`, {
    headers: { Cookie: cookiesStore.toString() },
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user data");
  }

  const data: IResponse = await res.json();
  return {
    ...data,
    toUser: () => toUser(data),
  };
}
