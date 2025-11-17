"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { forgotPasswordVerifyApi } from "@/apis/auth/forgot-password.api";
import { resendOtpApi } from "@/apis/auth/resend-otp.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function VerifyPage() {
  const router = useRouter();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [activeIndex, setActiveIndex] = useState(0);
  const [email, setEmail] = useState<string>("");
  const [isVerify, setIsVerify] = useState<boolean>(false);
  const [valid, setValid] = useState<boolean>(true);

  useEffect(() => {
    const savedData = sessionStorage.getItem("resetPasswordData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setEmail(parsed.email);
    } else {
      router.push("/forgot-password");
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  useEffect(() => {
    const first = document.getElementById(`code-0`);
    first?.focus();
  }, []);

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      setValid(true);

      // Auto-focus next input
      if (value) {
        if (index < 5) {
          const next = document.getElementById(`code-${index + 1}`);
          next?.focus();
        } else {
          handleSubmitByCode(newCode);
        }
      }
    }
  };

  const handleSubmitByCode = async (newCode: string[]) => {
    setIsVerify(true);
    const enteredCode = newCode.join("");
    const [res, err] = await forgotPasswordVerifyApi({ email, otp: enteredCode });
    if (res) {
      const savedData = sessionStorage.getItem("resetPasswordData");
      const parsed = JSON.parse(savedData || "{}");
      parsed.otp = enteredCode;
      sessionStorage.setItem("resetPasswordData", JSON.stringify(parsed));

      toast.success(res.message);
      router.push("/forgot-password/reset");
    } else {
      toast.error(err.message);
      setValid(false);
      setCode(["", "", "", "", "", ""]);
      const first = document.getElementById(`code-0`);
      first?.focus();
      setIsVerify(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prev = document.getElementById(`code-${index - 1}`);
      prev?.focus();
    }
  };

  const formattedTime = `${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, "0")}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerify(true);
    setCode(["", "", "", "", "", ""]);
    setIsVerify(false);
    setValid(false);
    const first = document.getElementById(`code-0`);
    first?.focus();
  };

  const handleResend = async () => {
    const [msg, err] = await resendOtpApi({ email }, "forgot-password");

    if (msg) {
      toast.success(msg.message);
      setTimer(20);
    } else {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Back Button */}
        <div>
          <Link href="/forgot-password" className="flex items-center gap-1 text-gray-600 hover:text-black">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>

        {/* Header */}
        <div className="mt-8 space-y-2 text-left">
          <h1 className="text-2xl font-bold text-gray-900">Verification Code</h1>
          <p className="text-sm text-gray-500">
            We have sent the verification code to <b>{email}</b>
          </p>
        </div>

        {/* Code Input */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
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
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onFocus={() => setActiveIndex(i)}
                autoComplete="off"
                className={`h-14 w-12 rounded-xl text-center text-xl font-semibold tracking-widest focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ${
                  i === activeIndex || !valid ? "border-2 border-red-500!" : ""
                }`}
              />
            ))}
          </div>

          {/* Resend Timer */}
          {timer > 0 ? (
            <div className="text-right text-sm text-gray-500">Resend - {formattedTime}</div>
          ) : (
            <div
              className="cursor-pointer text-right text-sm font-semibold text-red-700 hover:underline"
              onClick={handleResend}
            >
              Resend
            </div>
          )}

          {/* Confirm Button */}
          <Button
            type="submit"
            disabled={isVerify}
            className="h-11 w-full cursor-pointer bg-linear-to-r from-[#D60808] to-[#700404] font-medium text-white transition-colors duration-500 hover:bg-linear-to-r hover:from-[#700404] hover:to-[#D60808]"
          >
            {isVerify ? "Verifying..." : "Confirm"}
          </Button>
        </form>
      </div>
    </div>
  );
}
