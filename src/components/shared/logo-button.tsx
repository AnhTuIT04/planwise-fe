import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoButtonProps {
  variant?: "full" | "short";
  className?: string;
}

export default function LogoButton({ variant = "full", className }: LogoButtonProps) {
  const isFull = variant === "full";

  return (
    <Link href="/" aria-label="Home">
      <Image
        src={isFull ? "/full-logo.svg" : "/logo.svg"}
        alt="PlanWise Logo"
        width={isFull ? 160 : 28}
        height={isFull ? 36 : 36}
        className={cn("cursor-pointer", isFull ? "h-7 w-40" : "h-9 w-9", className)}
      />
    </Link>
  );
}
