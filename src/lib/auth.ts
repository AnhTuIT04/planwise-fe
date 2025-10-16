"use server";

import { cache } from "react";
import { cookies } from "next/headers";

import { ISession } from "@/types/session.type";
import { signInApi } from "@/apis/auth/sign-in.api";
import {
  signUpApi,
  googleOAuthApi,
  githubOAuthApi,
  getGoogleOAuthUrl,
  getGithubOAuthUrl,
} from "@/apis/auth/sign-up.api";
import { authApi } from "@/apis/auth/auth.api";
import { signUpVerifyApi } from "@/apis/auth/sign-up-verify.api";
import { forgotPasswordApi, forgotPasswordResetApi, forgotPasswordVerifyApi } from "@/apis/auth/forgot-password.api";

export async function signin({ email, password }: { email: string; password: string }) {
  try {
    const response = await signInApi({ email, password });
    const { accessToken, refreshToken } = response.toAuth();

    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    cookieStore.set("refreshToken", refreshToken, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  } catch (error: any) {
    console.log("Sign in error:", error);
    throw error;
  }
}

export async function signup({ email, password }: { email: string; password: string }) {
  try {
    const response = await signUpApi({ email, password });
    const { accessToken, refreshToken, ...userData } = response.toAuth();

    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
    });

    cookieStore.set("refreshToken", refreshToken, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
    });

    return userData;
  } catch (error: any) {
    console.log("Sign up error:", error);
    throw error;
  }
}

export async function signupVerify({ email, verificationCode }: { email: string; verificationCode: string }) {
  try {
    const response = await signUpVerifyApi({ email, verificationCode });
    return response;
  } catch (error: any) {
    console.log("Sign up error:", error);
    throw error;
  }
}

export async function forgotPassword({ email }: { email: string }) {
  try {
    const response = await forgotPasswordApi({ email });
    return response;
  } catch (error: any) {
    console.log("Forgot password error:", error);
    throw error;
  }
}

export async function forgotPasswordVerify({ email, otp }: { email: string; otp: string }) {
  try {
    const response = await forgotPasswordVerifyApi({ email, otp });
    return response;
  } catch (error: any) {
    console.log("Forgot password error:", error);
    throw error;
  }
}

export async function forgotPasswordReset({ email, otp, newPassword }: { email: string; otp: string; newPassword: string }) {
  try {
    const response = await forgotPasswordResetApi({ email, otp, newPassword });
    return response;
  } catch (error: any) {
    console.log("Forgot password error:", error);
    throw error;
  }
}

// OAuth functions
export async function handleGoogleOAuth(code: string, state?: string) {
  try {
    const response = await googleOAuthApi({ code, state });
    const { accessToken, refreshToken, ...userData } = response.toAuth();

    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
    });

    cookieStore.set("refreshToken", refreshToken, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
    });

    return userData;
  } catch (error: any) {
    console.log("Google OAuth error:", error);
    throw error;
  }
}

export async function handleGithubOAuth(code: string, state?: string) {
  try {
    const response = await githubOAuthApi({ code, state });
    const { accessToken, refreshToken, ...userData } = response.toAuth();

    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
    });

    cookieStore.set("refreshToken", refreshToken, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
    });

    return userData;
  } catch (error: any) {
    console.log("GitHub OAuth error:", error);
    throw error;
  }
}

export async function getOAuthUrls() {
  try {
    const [googleUrl, githubUrl] = await Promise.all([getGoogleOAuthUrl(), getGithubOAuthUrl()]);

    return {
      google: googleUrl.url,
      github: githubUrl.url,
    };
  } catch (error: any) {
    console.log("Get OAuth URLs error:", error);
    throw error;
  }
}

export async function signout() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}

export const getSession = cache(async (): Promise<ISession> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return { user: null };
    }

    const response = await authApi();
    const session = response.toSession();

    return session;
  } catch (error: any) {
    console.log("Get session error:", error?.message || "Authentication failed");
    return { user: null };
  }
});
