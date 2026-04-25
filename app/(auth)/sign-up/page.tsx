import Link from "next/link";

import OAuthSection from "@/components/auth/oauth-section";
import SignUpForm from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="w-full max-w-md space-y-8 text-[#0a0a0a]">
      {/* Header */}
      {/* <div className="space-y-2 text-left">
        <h1 className="text-[28px] font-bold tracking-tight">Sign up</h1>
      </div> */}

      {/* OAuth Section */}
      <OAuthSection />

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
      <SignUpForm />

      {/* Terms and Sign In Link */}
      <div className="space-y-4 text-center text-sm text-gray-600">
        <p>
          By continuing with Google, GitHub or Credentials, you agree to PlanWise&apos;s{" "}
          <Link href="#terms" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#privacy" className="text-blue-600 hover:underline">
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
