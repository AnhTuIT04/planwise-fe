import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import ResetPasswordForm from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md space-y-6 text-[#0a0a0a]">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <Link href="/forgot-password" className="flex items-center gap-1 text-gray-600 hover:text-black">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>

        <div className="space-y-2 text-left">
          <h1 className="text-[28px] font-bold tracking-tight">Reset password</h1>
        </div>

        <ResetPasswordForm />
      </div>
    </div>
  );
}
