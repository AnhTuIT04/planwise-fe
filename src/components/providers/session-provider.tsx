"use client";

import { createContext, useContext, useEffect } from "react";

import { ISession } from "@/types/session.type";
import { deleteCookieClient } from "@/lib/utils";

const SessionContext = createContext<ISession | null>(null);

interface SessionProviderProps {
  session: ISession;
  children: React.ReactNode;
}

export default function SessionProvider({ session, children }: SessionProviderProps) {
  // useEffect(() => {
  //   if (!session.user) {
  //     deleteCookieClient("accessToken");
  //   }
  // }, [session]);

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used within an SessionProvider");

  return context;
}
