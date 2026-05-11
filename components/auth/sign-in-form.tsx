"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { useAuth } from "@/components/providers/auth-provider";
import { signInApi } from "@/services/apis/auth/sign-in.api";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password has least 6 characters.").max(100, "Password must be less than 100 characters"),
});
type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      // Call sign in API
      const res = await signInApi(data);
      setUser(res.toUser());

      // Redirect to my-tasks
      router.replace("/my-tasks");
    } catch (error: any) {
      console.log("Sign in failed:", error);
      toast.error(error?.message || "Sign in failed. Please check your credentials and try again.");
    }
  };

  return (
    <form id="sign-in-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
                autoComplete="username webauthn"
                autoCorrect="off"
                autoCapitalize="none"
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
                autoComplete="current-password"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
                {...field}
              />
            </Field>
          )}
        />
      </FieldGroup>

      {/* Remember me + Forgot password */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <label className="flex items-center gap-2">
          <Checkbox id="remember" />
          <span>Remember me</span>
        </label>

        <Link href="/forgot-password" className="text-gray-500 italic hover:underline">
          Forgot password
        </Link>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="h-11 w-full cursor-pointer bg-linear-to-r from-[#D60808] to-[#700404] font-medium text-white transition-colors duration-500 hover:bg-linear-to-r hover:from-[#700404] hover:to-[#D60808]"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
