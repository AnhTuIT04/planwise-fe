import Image from "next/image";
import Link from "next/link";

import fullLogoSvg from "@/assets/images/full-logo.svg";
import logoSvg from "@/assets/images/logo.svg";

interface LogoButtonProps {
  variant?: "full" | "short";
  className?: string;
}

export function LogoButton({ variant = "full", className }: LogoButtonProps) {
  const isFull = variant === "full";

  return (
    <Link href="/" aria-label="Home">
      <Image
        src={isFull ? fullLogoSvg : logoSvg}
        alt="PlanWise Logo"
        width={isFull ? 160 : 28}
        // height={isFull ? 36 : 36}
        className={className}
        loading="eager"
      />
    </Link>
  );
}
