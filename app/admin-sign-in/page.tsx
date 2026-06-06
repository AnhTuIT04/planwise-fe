"use client";

import { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from "@/hooks/use-admin-auth";

export default function AdminSignInPage() {
  const { signInMutation } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) return;
    signInMutation.mutate({ email, password });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0d12] px-4">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -left-24 h-80 w-80 rounded-full bg-violet-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-3xl" />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-950/50">
            <Image src="/logo.svg" alt="PlanWise" width={24} height={24} className="size-6 brightness-0 invert" />
          </span>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight text-white">Admin console</h1>
            <p className="mt-1 text-sm text-white/40">Sign in with your administrator credentials</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-xl"
        >
          <div className="space-y-2">
            <Label htmlFor="admin-email" className="text-xs font-medium text-white/60">
              Email
            </Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              className="h-10 rounded-xl border-white/10 bg-white/[0.06] text-white placeholder:text-white/25 focus-visible:border-indigo-400/60 focus-visible:ring-indigo-400/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password" className="text-xs font-medium text-white/60">
              Password
            </Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              className="h-10 rounded-xl border-white/10 bg-white/[0.06] text-white placeholder:text-white/25 focus-visible:border-indigo-400/60 focus-visible:ring-indigo-400/20"
            />
          </div>
          <Button
            type="submit"
            className="h-10 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 font-semibold text-white shadow-lg shadow-indigo-950/40 hover:from-indigo-400 hover:to-violet-500"
            disabled={signInMutation.isPending}
          >
            {signInMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-white/25">PlanWise administration · authorized staff only</p>
      </div>
    </div>
  );
}
