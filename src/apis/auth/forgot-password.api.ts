import api from "@/lib/api";

interface IForgotPasswordRequest {
  email: string;
}

interface IForgotPasswordResponse {
  message: string;
}


export async function forgotPasswordApi(payload: IForgotPasswordRequest): Promise<IForgotPasswordResponse> {
  const res = await api.post("auth/forgot-password", payload);
  console.log(res.data);
  return res.data;
}

interface IForgotPasswordVerifyRequest {
  email: string;
  otp: string;
}

interface IForgotPasswordVerifyResponse {
  message: string;
}


export async function forgotPasswordVerifyApi(payload: IForgotPasswordVerifyRequest): Promise<IForgotPasswordVerifyResponse> {
  const res = await api.post("auth/verify-otp", payload);
  console.log(res.data);
  return res.data;
}

interface IForgotPasswordResetRequest {
  email: string;
  otp: string;
  newPassword: string;
}

interface IForgotPasswordResetResponse {
  message: string;
}


export async function forgotPasswordResetApi(payload: IForgotPasswordResetRequest): Promise<IForgotPasswordResetResponse> {
  const res = await api.post("auth/reset-password", payload);
  console.log(res.data);
  return res.data;
}
