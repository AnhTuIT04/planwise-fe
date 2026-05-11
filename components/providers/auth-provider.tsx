"use client";

import { useState, createContext, useContext } from "react";

import { IUser } from "@/types/user.type";

interface AuthContextType {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children, initUser }: { children: React.ReactNode; initUser: IUser | null }) {
  const [user, setUser] = useState<IUser | null>(initUser);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
