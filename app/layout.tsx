import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";

import "@/styles/globals.css";
import AuthProvider from "@/components/providers/auth-provider";
import TanstackProvider from "@/components/providers/tanstack-provider";
import { AppModalRoot } from "@/components/ui/app-modal-root";
import { getAuthServerApi } from "@/services/apis/auth/auth-server.api";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlanWise",
  icons: { icon: "/logo.svg" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAuthServerApi()
    .then((res) => res.toUser())
    .catch(() => null);

  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TanstackProvider>
            <AuthProvider initUser={user}>{children}</AuthProvider>

            <AppModalRoot />
          </TanstackProvider>
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
