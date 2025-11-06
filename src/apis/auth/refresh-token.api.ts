import api from "@/lib/api";

interface IRequest {
  refreshToken: string;
}

interface IResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export async function refreshTokenApi(data: IRequest) {
  const {
    data: { accessToken, refreshToken },
  } = await api.post<IResponse>("auth/refresh-token", data);

  return { accessToken, refreshToken };
}
