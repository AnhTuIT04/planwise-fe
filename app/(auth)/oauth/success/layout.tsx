import { Suspense } from "react";

import LoadingScreen from "@/components/ui/loading-screen";

export default function OauthSuccessLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}
