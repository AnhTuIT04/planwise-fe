import api from "@/lib/api";

interface IResponse {
  message: string;
}

export function signOutApi() {
  return api.safeExec<IResponse>({ method: "POST", url: "auth/signout" });
}
