"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

import { signUpApi } from "@/apis/auth/sign-up.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import OauthButtons from "@/components/shared/oauth-buttons";
import { toast } from "sonner";

// Zod validation schema
const signUpSchema = z.object({
  fullname: z.string().min(1, "Full name is required").max(100, "Full name must be less than 100 characters"),
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must have at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const savedData = sessionStorage.getItem("signUpData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      form.reset({
        fullname: parsed.fullname || "",
        email: parsed.email || "",
        password: "",
      });
    }
  }, []);

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    const [res, err] = await signUpApi({
      fullname: data.fullname,
      email: data.email,
      password: data.password,
    });

    if (res) {
      sessionStorage.setItem("signUpData", JSON.stringify({ fullname: data.fullname, email: data.email }));
      toast.success(res.message || "Signed up successfully! Please verify your email.");
      router.push("/sign-up/verify");
    } else {
      toast.error(err.message || "Sign up failed. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="space-y-2 text-left">
        <h1 className="text-[28px] font-bold tracking-tight">Sign up</h1>
      </div>

      {/* OAuth Buttons */}
      <OauthButtons />

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
                    autoCapitalize="none"
                    spellCheck="false"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Full Name Field */}
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex gap-2 text-sm font-medium text-gray-700">
                  <span className="text-black">Full Name</span>
                  <span className="flex gap-0.5">
                    <span className="text-red-500">*</span>
                    <FormMessage />
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    className="focus:placeholder-transparent"
                    autoComplete="name"
                    autoCorrect="off"
                    autoCapitalize="words"
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

          {/* Submit Button */}
          <Button
            type="submit"
            className="h-11 w-full cursor-pointer bg-linear-to-r from-[#D60808] to-[#700404] font-medium text-white transition-colors duration-500 hover:bg-linear-to-r hover:from-[#700404] hover:to-[#D60808]"
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
