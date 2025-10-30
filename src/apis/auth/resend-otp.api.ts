import api from "@/lib/api";

interface IRequest {
  email: string;
}

interface IResponse {
  message: string;
}

export function resendOtpApi(payload: IRequest, resendFor: "verify-email" | "forgot-password") {
  return api.safeExec<IResponse>({ method: "POST", url: `auth/${resendFor}/resend-otp`, data: payload });
}
