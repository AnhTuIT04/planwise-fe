"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Popover({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  let container: HTMLElement | undefined;

  if (typeof document !== "undefined") {
    const openDialogContents = Array.from(
      document.querySelectorAll<HTMLElement>('[data-slot="dialog-content"][data-state="open"]'),
    );

    if (openDialogContents.length > 0) {
      // Use the top-most opened dialog when there are multiple overlays.
      container = openDialogContents[openDialogContents.length - 1];
    }
  }

  return (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

function PopoverAnchor({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="popover-header" className={cn("flex flex-col gap-0.5 text-sm", className)} {...props} />;
}

function PopoverTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <div data-slot="popover-title" className={cn("font-heading font-medium", className)} {...props} />;
}

function PopoverDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="popover-description" className={cn("text-muted-foreground", className)} {...props} />;
}

function PopoverArrow({ className, stroke, ...props }: React.ComponentProps<typeof PopoverPrimitive.Arrow>) {
  return (
    <PopoverPrimitive.Arrow asChild {...props}>
      <svg
        data-slot="popover-arrow"
        viewBox="0 0 30 10"
        width="10"
        height="5"
        preserveAspectRatio="none"
        className={cn("fill-popover stroke-border", `stroke-${stroke}`, className)}
        style={{ display: "block" }}
      >
        <path d="M0,0 L15,10 L30,0 Z" fill="var(--popover)" stroke="none" />
        <line x1="0" y1="0" x2="15" y2="10" stroke="var(--border)" strokeWidth={stroke} />
        <line x1="30" y1="0" x2="15" y2="10" stroke="var(--border)" strokeWidth={stroke} />
        <line x1="4" y1="0" x2="26" y2="0" stroke="white" strokeWidth={stroke} />
      </svg>
    </PopoverPrimitive.Arrow>
  );
}

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  PopoverArrow,
};
