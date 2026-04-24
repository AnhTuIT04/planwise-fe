"use client";

import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { useSignUpStore, RESEND_COOLDOWN_SECONDS } from "@/stores/sign-up.store";
import { signUpApi } from "@/services/apis/auth/sign-up.api";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const signUpSchema = z.object({
  email: z.email("Please enter a valid email address"),
  fullname: z.string().min(1, "Full name is required").max(100, "Full name must be less than 100 characters"),
  password: z.string().min(6, "Password has least 6 characters.").max(100, "Password must be less than 100 characters"),
});
type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const router = useRouter();

  const { email, fullname, password, hasHydrated, setEmail, setFullname, setPassword, setResendAvailableAt } =
    useSignUpStore();

  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      fullname: "",
      password: "",
    },
  });

  useEffect(() => {
    if (hasHydrated) {
      form.setValue("email", email);
      form.setValue("fullname", fullname);
      form.setValue("password", password);
    }
  }, [hasHydrated, email, fullname, password, form]);

  const onSubmit = async (data: SignUpFormData) => {
    try {
      // Call sign up API
      await signUpApi({
        email: data.email,
        fullname: data.fullname,
        password: data.password,
      });

      // eslint-disable-next-line react-hooks/purity
      const now = Date.now();
      const resendAt = now + RESEND_COOLDOWN_SECONDS * 1000;

      // Save form data to store
      setEmail(data.email);
      setFullname(data.fullname);
      setPassword(data.password);
      setResendAvailableAt(resendAt);

      // Navigate to verify page
      router.push("/sign-up/verify");
    } catch (error: any) {
      console.log("Sign up failed:", error);
      toast.error(error?.message || "Sign up failed. Please check your credentials and try again.");
    }
  };

  return (
    <form id="sign-up-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
                autoFocus
                type="text"
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

        <Controller
          name="fullname"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="data-[invalid=true]:[&_input]:border-red-500 data-[invalid=true]:[&_input]:text-black data-[invalid=true]:[&_input]:caret-black"
            >
              <FieldLabel className="flex gap-2 text-sm font-semibold">
                <span className="text-black">Full Name</span>
                <span className="flex gap-0.5">
                  <span className="text-red-500">*</span>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </span>
              </FieldLabel>
              <Input
                type="text"
                placeholder="John Doe"
                className="py-5 shadow-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
                autoComplete="name"
                autoCorrect="off"
                autoCapitalize="words"
                spellCheck="false"
                {...field}
              />
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="relative data-[invalid=true]:[&_input]:border-red-500 data-[invalid=true]:[&_input]:text-black data-[invalid=true]:[&_input]:caret-black"
            >
              <FieldLabel className="flex gap-2 text-sm font-semibold">
                <span className="text-black">Password</span>
                <span className="flex gap-0.5">
                  <span className="text-red-500">*</span>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </span>
                <button
                  type="button"
                  className="absolute right-0 bottom-3 flex items-center pr-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </FieldLabel>
              <Input
                type={showPassword ? "text" : "password"}
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

      {/* Submit Button */}
      <Button
        type="submit"
        className="h-11 w-full cursor-pointer bg-linear-to-r from-[#D60808] to-[#700404] font-medium text-white transition-colors duration-500 hover:bg-linear-to-r hover:from-[#700404] hover:to-[#D60808]"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Signing up..." : "Sign up"}
      </Button>
    </form>
  );
}
