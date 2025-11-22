"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { setRouter } from "@/lib/navigation";

export default function AppInitializer({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    setRouter(router);
  }, [router]);

  return <>{children}</>;
}
