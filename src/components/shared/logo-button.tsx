import Image from "next/image";

import { cn } from "@/lib/utils";
import Link from "next/link";

export default function LogoButton({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="Home">
      <Image
        src="/full-logo.svg"
        alt="PlanWise Logo"
        width={172}
        height={30}
        className={cn("h-[30px] w-[172px] cursor-pointer", className)}
      />
    </Link>
  );
}
