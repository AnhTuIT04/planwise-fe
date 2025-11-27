import api from "@/lib/api";

interface IResponse {
  message: string;
}

export async function signOutApi() {
  const res = await api.post<IResponse>("auth/signout");

  return res.data;
}
