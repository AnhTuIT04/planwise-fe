"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

import { useForgotPasswordStore } from "@/stores/forgot-password.store";
import { resetPasswordApi } from "@/services/apis/auth/forgot-password.api";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

export default function ResetPasswordForm() {
  const router = useRouter();

  const { email, otp, hasHydrated, clear } = useForgotPasswordStore();

  const preventRedirectRef = useRef(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPass = useWatch({ control: form.control, name: "newPassword" });
  const confirmPass = useWatch({ control: form.control, name: "confirmPassword" });

  useEffect(() => {
    if (!hasHydrated || preventRedirectRef.current) return;

    if (!email) {
      router.replace("/forgot-password");
      return;
    }

    if (!otp) {
      router.replace("/forgot-password/verify");
      return;
    }
  }, [router, hasHydrated, email, otp]);

  useEffect(() => {
    if (form.formState.isSubmitted && (newPass || confirmPass)) {
      form.trigger("confirmPassword");
    }
  }, [form, newPass, confirmPass, form.trigger]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      preventRedirectRef.current = true;
      const res = await resetPasswordApi({
        email,
        otp,
        newPassword: data.newPassword,
      });

      // Clear forgot password store
      clear();

      // Show success and navigate to sign-in page
      toast.success(res.message);
      router.replace("/sign-in");
    } catch (error: any) {
      console.log("Reset password error:", error);
      toast.error(error?.message || "Failed to reset password. Please try again.");
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    void form.handleSubmit(onSubmit)(e);
  };

  return (
    <form id="reset-password-form" onSubmit={handleFormSubmit} className="space-y-4" noValidate>
      <FieldGroup>
        <Controller
          name="newPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="relative data-[invalid=true]:[&_input]:border-red-500 data-[invalid=true]:[&_input]:text-black data-[invalid=true]:[&_input]:caret-black"
            >
              <FieldLabel className="flex gap-2 text-sm font-semibold">
                <span className="text-black">New password</span>
                <span className="flex gap-0.5">
                  <span className="text-red-500">*</span>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </span>
                <button
                  type="button"
                  className="absolute right-0 bottom-3 flex items-center pr-3 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  tabIndex={-1}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </FieldLabel>
              <Input
                type={showNewPassword ? "text" : "password"}
                placeholder="••••••"
                className="py-5 pr-10 shadow-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
                {...field}
              />
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="relative data-[invalid=true]:[&_input]:border-red-500 data-[invalid=true]:[&_input]:text-black data-[invalid=true]:[&_input]:caret-black"
            >
              <FieldLabel className="flex gap-2 text-sm font-semibold">
                <span className="text-black">Confirm password</span>
                <span className="flex gap-0.5">
                  <span className="text-red-500">*</span>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </span>
                <button
                  type="button"
                  className="absolute right-0 bottom-3 flex items-center pr-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </FieldLabel>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••"
                className="py-5 pr-10 shadow-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
                {...field}
              />
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        className="h-11 w-full cursor-pointer bg-linear-to-r from-[#D60808] to-[#700404] font-medium text-white transition-colors duration-500 hover:bg-linear-to-r hover:from-[#700404] hover:to-[#D60808]"
        disabled={form.formState?.isSubmitting}
      >
        {form.formState?.isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
