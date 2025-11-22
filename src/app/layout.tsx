import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import "@/styles/globals.css";
import TanstackProvider from "@/components/providers/tanstack-provider";
import AppInitializer from "@/components/providers/app-initializer";
import AuthProvider from "@/components/providers/auth-provider";
import RootModal from "@/components/modals/root-modal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlanWise",
  icons: {
    icon: "/logo.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TanstackProvider>
          <AppInitializer>
            <AuthProvider>{children}</AuthProvider>
            <Toaster richColors position="top-center" duration={2000} />
            <RootModal />
          </AppInitializer>
        </TanstackProvider>
      </body>
    </html>
  );
}
