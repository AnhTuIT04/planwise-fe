import { Metadata } from "next";
import Image from "next/image";

import signInSvg from "@/assets/images/sign-in.svg";

export const metadata: Metadata = {
  title: "Sign In - PlanWise",
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex h-full w-full max-w-7xl gap-8">
      {/* Left side - Image */}
      <div className="hidden flex-2 items-center justify-center lg:flex">
        <div className="w-full max-w-2xl">
          <Image
            src={signInSvg}
            alt="PlanWise sign in illustration"
            width={880}
            height={612}
            className="h-auto w-full"
            priority
          />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:justify-start lg:px-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
