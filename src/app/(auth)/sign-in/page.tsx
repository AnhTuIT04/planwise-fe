"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

import { REDIRECT_AFTER_AUTH } from "@/lib/router";
import { signInApi } from "@/apis/auth/sign-in.api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import OauthButtons from "@/components/shared/oauth-buttons";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";

// Zod validation schema
const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password has least 6 characters.").max(100, "Password must be less than 100 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const { login, isLoggingIn } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const signUpData = sessionStorage.getItem("signUpData");
    if (signUpData) {
      const parsed = JSON.parse(signUpData);
      form.setValue("email", parsed.email);
      sessionStorage.removeItem("signUpData");
      return;
    }

    const resetPasswordData = sessionStorage.getItem("resetPasswordData");
    if (resetPasswordData) {
      const parsed = JSON.parse(resetPasswordData);
      form.setValue("email", parsed.email);
      sessionStorage.removeItem("resetPasswordData");
    }
  }, []);

  const onSubmit = async (data: SignInFormData) => {
    await login(data);
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="space-y-2 text-left">
        <h1 className="text-[28px] font-bold tracking-tight">Sign in</h1>
      </div>

      {/* OAuth Buttons */}
      <OauthButtons />

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-500" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 font-semibold text-gray-500">or continue with</span>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex gap-2 text-sm font-medium text-gray-700">
                  <span className="text-black">Email</span>
                  <span className="flex gap-0.5">
                    <span className="text-red-500">*</span>
                    <FormMessage />
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john.doe@gmail.com"
                    className="focus:placeholder-transparent"
                    autoComplete="email"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck="false"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="flex gap-2 text-sm font-medium text-gray-700">
                  <span className="text-black">Password</span>
                  <span className="flex gap-0.5">
                    <span className="text-red-500">*</span>
                    <FormMessage />
                  </span>
                  <button
                    type="button"
                    className="tab absolute right-0 bottom-2.5 flex items-center pr-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </FormLabel>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••"
                    className="pr-10 focus:placeholder-transparent [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck="false"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <Checkbox id="remember" />
              <span>Remember me</span>
            </label>

            <Link href="/forgot-password" className="text-gray-500 italic hover:text-red-600 hover:underline">
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
      </Form>

      {/* Terms and Sign In Link */}
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
          Don't have an account yet?{" "}
          <Link href="/sign-up" className="font-medium text-blue-600 hover:underline">
            Go to sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
