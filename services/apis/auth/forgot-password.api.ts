import api from "@/lib/api";

interface IForgotPasswordRequest {
  email: string;
}

interface IForgotPasswordResponse {
  message: string;
}

export async function forgotPasswordApi(payload: IForgotPasswordRequest) {
  const res = await api.post<IForgotPasswordResponse>("auth/forgot-password", payload);
  return res.data;
}

interface IVerifyForgotPasswordRequest {
  email: string;
  otp: string;
}

interface IVerifyForgotPasswordResponse {
  message: string;
}

export async function verifyForgotPasswordApi(payload: IVerifyForgotPasswordRequest) {
  const res = await api.post<IVerifyForgotPasswordResponse>("auth/verify-forgot-password", payload);
  return res.data;
}

interface IResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

interface IResetPasswordResponse {
  message: string;
}

export async function resetPasswordApi(payload: IResetPasswordRequest) {
  const res = await api.post<IResetPasswordResponse>("auth/reset-password", payload);
  return res.data;
}
