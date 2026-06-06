import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoButtonProps {
  variant?: "full" | "short";
  className?: string;
}

export function LogoButton({ variant = "full", className }: LogoButtonProps) {
  const isFull = variant === "full";

  return (
    <Link href="/" aria-label="Home" className={cn("h-9", isFull ? "w-40" : "w-8", "relative", className)}>
      <Image fill src={isFull ? "/full-logo.svg" : "/logo.svg"} alt="PlanWise Logo" loading="eager" />
    </Link>
  );
}
