import Image from "next/image";

import { cn } from "@/lib/utils";

export default function ChevronIcon({ state, className }: { state: "left" | "right"; className?: string }) {
  return (
    <Image
      src={state === "left" ? "/images/chevrons-left.svg" : "/images/chevrons-right.svg"}
      alt="Chevron"
      width={20}
      height={20}
      className={cn("h-5 w-5", className)}
    />
  );
}
