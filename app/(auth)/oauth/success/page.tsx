"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";
import { exchangeTokenApi } from "@/services/apis/auth/exchange-token.api";
import LoadingScreen from "@/components/ui/loading-screen";

export default function OauthSuccessPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const searchParams = useSearchParams();

  const otc = searchParams.get("otc");

  useEffect(() => {
    if (!otc) {
      router.replace("/sign-in");
      return;
    }

    exchangeTokenApi({ otc })
      .then((res) => {
        setUser(res.toUser());
        router.replace("/my-tasks");
      })
      .catch(() => {
        router.replace("/sign-in");
      });
  }, [otc, router, setUser]);

  return (
    <div className="fixed top-0 left-0 h-screen w-screen">
      <LoadingScreen />
    </div>
  );
}
