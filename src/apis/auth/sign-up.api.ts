import api from "@/lib/api";
import { IAuth } from "@/types/session.type";

interface ISignUpRequest {
  email: string;
  password: string;
}

interface ISignUpResponse {
  message: string;
  user: {
    id: string;
    email: string;
    createdAt: string;
  };
  accessToken: string;
  refreshToken: string;

  toAuth(): IAuth;
}

function toAuth(data: ISignUpResponse): IAuth {
  return {
    id: data.user.id,
    email: data.user.email,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
}

export async function signUpApi(payload: ISignUpRequest): Promise<ISignUpResponse> {
  const res = await api.post("auth/sign-up", payload);
  return {
    ...res.data,
    toAuth: () => toAuth(res.data),
  };
}

// OAuth APIs
interface IOAuthRequest {
  code: string;
  state?: string;
}

export async function googleOAuthApi(payload: IOAuthRequest): Promise<ISignUpResponse> {
  const res = await api.post("auth/google", payload);
  return {
    ...res.data,
    toAuth: () => toAuth(res.data),
  };
}

export async function githubOAuthApi(payload: IOAuthRequest): Promise<ISignUpResponse> {
  const res = await api.post("auth/github", payload);
  return {
    ...res.data,
    toAuth: () => toAuth(res.data),
  };
}

// Get OAuth URLs from backend
export async function getGoogleOAuthUrl(): Promise<{ url: string }> {
  const res = await api.get("auth/google/url");
  return res.data;
}

export async function getGithubOAuthUrl(): Promise<{ url: string }> {
  const res = await api.get("auth/github/url");
  return res.data;
}
