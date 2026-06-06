"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import LoadingScreen from "@/components/ui/loading-screen";
import { useAdminAuth } from "@/hooks/use-admin-auth";

/**
 * Guards the admin section: renders children only when an admin session exists,
 * otherwise redirects to the standalone admin sign-in page.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { admin, isLoading, error } = useAdminAuth();

  useEffect(() => {
    if (!isLoading && (error || !admin)) {
      router.replace("/admin-sign-in");
    }
  }, [isLoading, error, admin, router]);

  if (isLoading || !admin) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
