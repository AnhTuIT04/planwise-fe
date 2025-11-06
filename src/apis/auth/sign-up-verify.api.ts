import api from "@/lib/api";
import { IAuth } from "@/types/session.type";

interface ISignUpVerifyRequest {
  email: string;
  otp: string;
}

interface ISignUpVerifyResponse {
  message: string;

  // toAuth(): IAuth;
}

// function toAuth(data: ISignUpResponse): IAuth {
//   return {
//     id: data.userId,
//     email: data.emailSent ? "unverified" : "unknown",
//     accessToken: "",
//     refreshToken: "",
//   };
// }

export async function signUpVerifyApi(payload: ISignUpVerifyRequest): Promise<ISignUpVerifyResponse> {
  const res = await api.post("auth/verify-email", payload);
  console.log(res.data);
  return res.data;
}
