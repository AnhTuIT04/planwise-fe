"use client";

import { useEffect } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { navigate } from "@/lib/navigation";
import { REDIRECT_AFTER_AUTH } from "@/lib/router";
import LogoButton from "@/components/shared/logo-button";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate(REDIRECT_AFTER_AUTH);
    }
  }, [user]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto flex h-full w-full max-w-7xl gap-8 p-6 not-lg:items-center not-lg:justify-center">
        <LogoButton />
      </div>
      <div className="flex flex-1 items-center justify-center px-4">{children}</div>
    </div>
  );
}
