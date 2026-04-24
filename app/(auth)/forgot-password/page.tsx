import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import ForgotPasswordForm from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md space-y-8 text-[#0a0a0a]">
      <div>
        <Link href="/sign-in" className="flex items-center gap-1 text-gray-600 hover:text-black">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      <div className="space-y-2 text-left">
        <h1 className="text-[28px] font-bold tracking-tight">Forgot password</h1>
      </div>

      <ForgotPasswordForm />
    </div>
  );
}
