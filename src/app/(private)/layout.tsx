"use client";

import { useEffect } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { navigate } from "@/lib/navigation";
import { REDIRECT_IF_NOT_AUTH } from "@/lib/router";
import LeftSidebar from "@/components/sidebar/left-sidebar";
import RightSidebar from "@/components/sidebar/right-sidebar";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate(REDIRECT_IF_NOT_AUTH);
    }
  }, [user]);

  return (
    <div className="flex h-screen bg-[#ecedee]">
      <LeftSidebar />
      {children}
      <RightSidebar />
    </div>
  );
}
