"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPasswordReset } from "@/lib/auth";
import { toast } from "sonner";

// Zod validation schema
const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters long."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password does not match.",
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const { push } = useRouter();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPass = form.watch("newPassword");
  const confirmPass = form.watch("confirmPassword");

  useEffect(() => {
    const savedData = sessionStorage.getItem("resetPasswordData");
    if (!savedData) {
      push("/forgot-password");
    } else {
      const parsed = JSON.parse(savedData);
      if (!parsed.otp) {
        push("/forgot-password/verify");
      }
    }
  }, []);

  useEffect(() => {
    if (form.formState.isSubmitted && (newPass || confirmPass)) {
      form.trigger("confirmPassword");
    }
  }, [newPass, confirmPass, form.trigger]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const savedData = sessionStorage.getItem("resetPasswordData");
      if (!savedData) {
        push("/forgot-password");
        return;
      }

      const parsed = JSON.parse(savedData);

      const response = await forgotPasswordReset({
        email: parsed.email,
        otp: parsed.otp,
        newPassword: data.newPassword,
      });
      if (response.isSuccess) {
        toast.success(response.message);
        sessionStorage.removeItem("resetPasswordData");
        push("/sign-in");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("System error. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Back Button */}
        <div>
          <Link href="/sign-in" className="flex items-center gap-1 text-gray-600 hover:text-black">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-2 text-left">
          <h1 className="text-[28px] font-bold tracking-tight">Reset password</h1>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="flex gap-2 text-sm font-medium text-gray-700">
                    <span className="text-black">New password</span>
                    <span className="flex gap-0.5">
                      <span className="text-red-500">*</span>
                      <FormMessage />
                    </span>
                    <button
                      type="button"
                      className="tab absolute right-0 bottom-2.5 flex items-center pr-3 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      tabIndex={-1}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••"
                      className="pr-10 focus:placeholder-transparent [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="flex gap-2 text-sm font-medium text-gray-700">
                    <span className="text-black">Confirm password</span>
                    <span className="flex gap-0.5">
                      <span className="text-red-500">*</span>
                      <FormMessage />
                    </span>
                    <button
                      type="button"
                      className="tab absolute right-0 bottom-2.5 flex items-center pr-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••"
                      className="pr-10 focus:placeholder-transparent [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="h-11 w-full cursor-pointer bg-gradient-to-r from-[#D60808] to-[#700404] font-medium text-white transition-colors duration-500 hover:bg-gradient-to-r hover:from-[#700404] hover:to-[#D60808]"
              disabled={form.formState?.isSubmitting}
            >
              {form.formState?.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>

        {/* Terms and Sign in Link */}
        <div className="space-y-4 text-center text-sm text-gray-600">
          <p>
            By continuing with Google, GitHub or Credentials, you agree to PlanWise's{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
          <p>
            Already signed up?{" "}
            <Link href="/sign-in" className="font-medium text-blue-600 hover:underline">
              Go to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
