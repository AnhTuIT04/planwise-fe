import api from "@/lib/api";

interface IRequest {
  email: string;
}

interface IResponse {
  message: string;
}

export function resendOtpApi(payload: IRequest, resendFor: "verify-email" | "forgot-password") {
  return api.post<IResponse>(`auth/${resendFor}/resend-otp`, payload);
}
