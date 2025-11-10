import api from "@/lib/api";

interface IForgotPasswordRequest {
  email: string;
}

interface IForgotPasswordResponse {
  message: string;
}

export function forgotPasswordApi(payload: IForgotPasswordRequest) {
  return api.safeExec<IForgotPasswordResponse>({ method: "POST", url: "auth/forgot-password", data: payload });
}

interface IForgotPasswordVerifyRequest {
  email: string;
  otp: string;
}

interface IForgotPasswordVerifyResponse {
  message: string;
}

export function forgotPasswordVerifyApi(payload: IForgotPasswordVerifyRequest) {
  return api.safeExec<IForgotPasswordVerifyResponse>({
    method: "POST",
    url: "auth/verify-forgot-password",
    data: payload,
  });
}

interface IForgotPasswordResetRequest {
  email: string;
  otp: string;
  newPassword: string;
}

interface IForgotPasswordResetResponse {
  message: string;
}

export async function forgotPasswordResetApi(payload: IForgotPasswordResetRequest) {
  return api.safeExec<IForgotPasswordResetResponse>({ method: "POST", url: "auth/reset-password", data: payload });
}
