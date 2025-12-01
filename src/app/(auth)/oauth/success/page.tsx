"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";

import { REDIRECT_AFTER_AUTH } from "@/lib/router";
import { exchangeTokenApi } from "@/apis/auth/exchange-token.api";
import LoadingScreen from "@/components/shared/loading-screen";

export default function OauthSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const otc = params.get("otc");

  useEffect(() => {
    if (!otc) {
      router.replace("/sign-in");
      return;
    }

    exchangeTokenApi({ otc })
      .then((res) => {
        queryClient.setQueryData(["auth"], res.toUser());
        router.replace(REDIRECT_AFTER_AUTH);
      })
      .catch(() => {
        router.replace("/sign-in");
      });
  }, [otc, router]);

  return (
    <div className="fixed top-0 left-0 h-screen w-screen">
      <LoadingScreen />
    </div>
  );
}
