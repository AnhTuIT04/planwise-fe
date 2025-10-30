import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "@/styles/globals.css";
import { getSession } from "@/lib/auth";
import SessionProvider from "@/components/providers/session-provider";
import TanstackProvider from "@/components/providers/tanstack-provider";

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
  const session = await getSession();

  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TanstackProvider>
          <SessionProvider session={session}>{children}</SessionProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
