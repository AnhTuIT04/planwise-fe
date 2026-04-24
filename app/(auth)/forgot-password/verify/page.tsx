"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

import { RESEND_COOLDOWN_SECONDS, useForgotPasswordStore } from "@/stores/forgot-password.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { verifyForgotPasswordApi } from "@/services/apis/auth/forgot-password.api";
import { resendOtpApi } from "@/services/apis/auth/resend-otp.api";

export default function VerifyForgotPasswordPage() {
  const router = useRouter();

  const { email, resendAvailableAt, hasHydrated, setResendAvailableAt, setOtp } = useForgotPasswordStore();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [valid, setValid] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!email) {
      router.replace("/forgot-password");
    }
  }, [router, hasHydrated, email]);

  /* ---------------- Timer resend ---------------- */
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  const timer = Math.max(Math.ceil((resendAvailableAt - now) / 1000), 0);

  /* ---------------- Auto focus first input ---------------- */
  useEffect(() => {
    document.getElementById("code-0")?.focus();
  }, []);

  /* ---------------- Handlers ---------------- */
  const handleChange = (raw: string, index: number) => {
    const value = raw.slice(-1);

    if (/^[0-9]$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      setValid(true);

      // Auto-focus next input
      if (index < 5) {
        const next = document.getElementById(`code-${index + 1}`);
        next?.focus();
      } else {
        handleSubmit(newCode);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      setValid(true);

      const newCode = [...code];
      if (newCode[index]) {
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        const prev = document.getElementById(`code-${index - 1}`);
        newCode[index - 1] = "";
        setCode(newCode);
        prev?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      setValid(true);

      const prev = document.getElementById(`code-${index - 1}`);
      prev?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      setValid(true);

      const next = document.getElementById(`code-${index + 1}`);
      next?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const digits = e.clipboardData.getData("text").replace(/\D/g, "").split("");

    if (digits.length === 0) return;

    const newCode = [...code];
    let cursor = activeIndex;

    for (const digit of digits) {
      if (cursor >= 6) break;
      newCode[cursor] = digit;
      cursor++;
    }

    setCode(newCode);

    // Set focus
    setActiveIndex(Math.min(cursor, 5));
    document.getElementById(`code-${Math.min(cursor, 5)}`)?.focus();

    // Auto-submit if all digits are filled
    if (cursor >= 6) {
      handleSubmit(newCode);
    }
  };

  const onSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    await handleSubmit(code);
  };

  const handleSubmit = async (data: string[]) => {
    const verificationCode = data.join("");
    if (verificationCode.length < 6) {
      setValid(false);
      return;
    }

    try {
      setIsVerifying(true);

      // Call verify email API
      await verifyForgotPasswordApi({ email, otp: verificationCode });

      // Save OTP to store for reset password step
      setOtp(verificationCode);

      // Navigate to reset password page
      router.push("/forgot-password/reset");
    } catch (error: any) {
      console.log("Verify forgot password failed:", error);
      setValid(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setResendAvailableAt(Date.now() + RESEND_COOLDOWN_SECONDS * 1000);
    try {
      setIsResending(true);
      await resendOtpApi({ email }, "forgot-password");
    } catch (error: any) {
      console.log("Resend OTP failed:", error);
      toast.error(error?.message || "Resend OTP failed. Please try again later.");
    } finally {
      setIsResending(false);
    }
  };

  const formattedTime = `${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-full max-w-md space-y-8 text-center">
        {/* Back Button */}
        <div>
          <Link href="/forgot-password" className="flex items-center gap-1 text-gray-600 hover:text-black">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>

        {/* Header */}
        <div className="mt-8 space-y-2 text-left">
          <h1 className="text-2xl font-bold text-gray-900">Verification Code</h1>
          <div className="text-sm text-gray-500">
            We have sent the verification code to{" "}
            {hasHydrated && email ? <b>{email}</b> : <Skeleton className="inline-block h-3.5 w-40 align-middle" />}
          </div>
        </div>

        {/* Code Input */}
        <form onSubmit={onSubmit} className="mt-6 space-y-6">
          <span className={`flex text-left font-semibold text-red-600 ${valid ? "invisible" : ""}`}>
            * Please enter an valid code.
          </span>
          <div className="flex justify-between gap-2">
            {code.map((digit, i) => (
              <Input
                key={i}
                id={`code-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={(e) => handlePaste(e)}
                onFocus={() => setActiveIndex(i)}
                autoComplete="off"
                className={`h-14 w-12 rounded-xl text-center text-xl font-semibold tracking-widest focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ${
                  i === activeIndex || !valid ? "border-2 border-red-500!" : ""
                }`}
              />
            ))}
          </div>

          {/* Resend Timer */}
          {!hasHydrated ? (
            <Skeleton className="ml-auto h-5 w-22" />
          ) : timer > 0 ? (
            <div className="text-right text-sm text-gray-500 italic">Resend - {formattedTime}</div>
          ) : (
            <div
              className={`cursor-pointer text-right text-sm font-semibold text-gray-500 italic ${isResending ? "pointer-events-none opacity-50" : "hover:text-gray-700 hover:underline"}`}
              onClick={() => {
                if (!isResending) handleResend();
              }}
            >
              Resend
            </div>
          )}

          {/* Confirm Button */}
          <Button
            type="submit"
            disabled={isVerifying}
            className="h-11 w-full cursor-pointer bg-linear-to-r from-[#D60808] to-[#700404] font-medium text-white transition-colors duration-500 hover:bg-linear-to-r hover:from-[#700404] hover:to-[#D60808]"
          >
            {isVerifying ? "Verifying..." : "Confirm"}
          </Button>
        </form>
      </div>
    </div>
  );
}
