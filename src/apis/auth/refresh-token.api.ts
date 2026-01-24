import api from "@/lib/api";

interface IRefreshResponse {
  accessToken: string;
  message: string;
}

export async function refreshTokenApi() {
  console.log("Calling refreshTokenApi...");
  const res = await api.post<IRefreshResponse>("auth/refresh");

  return {
    ...res.data,
  };
}
