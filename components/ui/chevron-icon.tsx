import Image from "next/image";

import chevronsLeftSvg from "@/assets/images/chevrons-left.svg";
import chevronsRightSvg from "@/assets/images/chevrons-right.svg";

export function ChevronIcon({ state, className }: { state: "left" | "right"; className?: string }) {
  return (
    <Image
      src={state === "left" ? chevronsLeftSvg : chevronsRightSvg}
      alt="Chevron"
      width={20}
      // height={20}
      className={className}
    />
  );
}
