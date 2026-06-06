"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="flex min-h-screen items-center justify-center bg-[#ecedee] px-4">
      <Card className="w-full max-w-md border-[#dcdcdc] bg-white shadow-[0_14px_36px_-30px_rgba(0,0,0,0.55)]">
        <CardHeader className="space-y-3 text-center">
          <div className="flex items-center justify-center gap-3">
            <Image src="/logo.svg" alt="PlanWise" width={32} height={32} className="size-8" />
            <p className="text-[11px] font-semibold tracking-[0.24em] text-[#787878] uppercase">PlanWise</p>
          </div>
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#2d2b27] text-white">
            <ShieldCheck className="size-6" />
          </div>
          <CardTitle className="text-xl text-[#2d2b27]">Admin console</CardTitle>
          <CardDescription className="text-sm text-[#787878]">
            Sign in with your administrator credentials to manage the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#2d2b27] text-white hover:bg-[#403d38]"
              disabled={signInMutation.isPending}
            >
              {signInMutation.isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
