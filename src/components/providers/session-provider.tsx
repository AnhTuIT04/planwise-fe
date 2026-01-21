"use client";

import { createContext, useContext } from "react";

import { IUser } from "@/types/user.type";

const SessionContext = createContext<IUser | null>(null);

interface SessionProviderProps {
  session: IUser | null;
  children: React.ReactNode;
}

export default function SessionProvider({ session, children }: SessionProviderProps) {
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) throw new Error("useSession must be used within an SessionProvider");

  return context;
}
