"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Zod validation schema
const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ForgotPasswordPage() {
  const { push } = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    const savedData = sessionStorage.getItem("resetPasswordData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      form.setValue("email", parsed.email);
    }
  }, []);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsSubmitting(true);
      console.log("Reset password email:", data.email);
      // TODO: Implement actual reset password logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      sessionStorage.setItem("resetPasswordData", JSON.stringify({ email: data.email }));
      push("/forgot-password/verify");
    } catch (error) {
      console.error("Reset password error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
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

          <Button
            type="submit"
            className="h-11 w-full cursor-pointer bg-gradient-to-r from-[#D60808] to-[#700404] font-medium text-white transition-colors duration-500 hover:bg-gradient-to-r hover:from-[#700404] hover:to-[#D60808]"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
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
  );
}
