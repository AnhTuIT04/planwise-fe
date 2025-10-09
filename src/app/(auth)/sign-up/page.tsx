"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

import { signup, getOAuthUrls, handleGoogleOAuth, handleGithubOAuth } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Zod validation schema
const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must have at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthUrls, setOauthUrls] = useState<{ google: string; github: string } | null>(null);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    // Load OAuth URLs
    const loadOAuthUrls = async () => {
      try {
        const urls = await getOAuthUrls();
        setOauthUrls(urls);
      } catch (error) {
        console.error("Failed to load OAuth URLs:", error);
      }
    };

    loadOAuthUrls();

    // Handle OAuth callback
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const provider = searchParams.get("provider");

    if (code && provider) {
      handleOAuthCallback(code, state, provider);
    }

    // Load saved form data
    const savedData = sessionStorage.getItem("signUpData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      form.reset({
        email: parsed.email || "",
        password: "",
      });
    }
  }, [searchParams]);

  const handleOAuthCallback = async (code: string, state: string | null, provider: string) => {
    setIsLoading(true);
    try {
      if (provider === "google") {
        await handleGoogleOAuth(code, state || undefined);
      } else if (provider === "github") {
        await handleGithubOAuth(code, state || undefined);
      }
      router.push("/my-tasks"); // Redirect to dashboard after successful OAuth
    } catch (error) {
      console.error("OAuth callback error:", error);
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      await signup({
        email: data.email,
        password: data.password,
      });

      // Clear saved data
      sessionStorage.removeItem("signUpData");

      // Redirect to verification page or dashboard
      router.push("/sign-up/verify");
    } catch (error: any) {
      console.log("Sign up error:", error);
      // Handle error (show toast, set form errors, etc.)
      // You might want to show the error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    if (oauthUrls?.google) {
      // Save current form data before redirecting
      const currentData = form.getValues();
      sessionStorage.setItem("signUpData", JSON.stringify(currentData));

      // Redirect to Google OAuth
      window.location.href = oauthUrls.google;
    }
  };

  const handleGitHubSignUp = () => {
    if (oauthUrls?.github) {
      // Save current form data before redirecting
      const currentData = form.getValues();
      sessionStorage.setItem("signUpData", JSON.stringify(currentData));

      // Redirect to GitHub OAuth
      window.location.href = oauthUrls.github;
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="space-y-2 text-left">
        <h1 className="text-[28px] font-bold tracking-tight">Sign up</h1>
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="h-11 w-full text-sm font-medium"
          onClick={handleGoogleSignUp}
          type="button"
          disabled={isLoading || !oauthUrls?.google}
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        <Button
          variant="outline"
          className="h-11 w-full text-sm font-medium"
          onClick={handleGitHubSignUp}
          type="button"
          disabled={isLoading || !oauthUrls?.github}
        >
          <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          Continue with GitHub
        </Button>
      </div>

      {/* Divider */}
      <div className="relative my-4">
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
                    autoCapitalize="off"
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
                    autoCapitalize="off"
                    spellCheck="false"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="h-11 w-full cursor-pointer bg-gradient-to-r from-[#D60808] to-[#700404] font-medium text-white transition-colors duration-500 hover:bg-gradient-to-r hover:from-[#700404] hover:to-[#D60808]"
            disabled={isLoading || form.formState.isSubmitting}
          >
            {isLoading || form.formState.isSubmitting ? "Signing up..." : "Sign up"}
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
          Already signed up?{" "}
          <Link href="/sign-in" className="font-medium text-blue-600 hover:underline">
            Go to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
