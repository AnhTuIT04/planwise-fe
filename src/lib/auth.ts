"use server";

import { cache } from "react";

import { IUser } from "@/types/user.type";
import { authApi } from "@/apis/auth/auth.api";

export const getSession = cache(async (): Promise<IUser | null> => {
  const [user] = await authApi();
  return user;
});
