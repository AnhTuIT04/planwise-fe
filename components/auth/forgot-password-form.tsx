"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { useForgotPasswordStore, RESEND_COOLDOWN_SECONDS } from "@/stores/forgot-password.store";
import { forgotPasswordApi } from "@/services/apis/auth/forgot-password.api";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address."),
});
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const router = useRouter();

  const { email, hasHydrated, setEmail, setResendAvailableAt } = useForgotPasswordStore();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (hasHydrated) {
      form.setValue("email", email);
    }
  }, [hasHydrated, email, form]);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordApi({ email: data.email });

      // eslint-disable-next-line react-hooks/purity
      const now = Date.now();
      const resendAt = now + RESEND_COOLDOWN_SECONDS * 1000;

      setEmail(data.email);
      setResendAvailableAt(resendAt);

      router.push("/forgot-password/verify");
    } catch (error: any) {
      console.log("Forgot password failed:", error);
      toast.error(error?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <form id="forgot-password-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="data-[invalid=true]:[&_input]:border-red-500 data-[invalid=true]:[&_input]:text-black data-[invalid=true]:[&_input]:caret-black"
            >
              <FieldLabel className="flex gap-2 text-sm font-semibold">
                <span className="text-black">Email</span>
                <span className="flex gap-0.5">
                  <span className="text-red-500">*</span>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </span>
              </FieldLabel>
              <Input
                type="email"
                placeholder="john.doe@gmail.com"
                className="py-5 shadow-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
                autoComplete="email"
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
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
