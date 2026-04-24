"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const outsideCloseRef = React.useRef<HTMLButtonElement>(null);

  const handlePointerDownOutsidePanel = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;

    if (!target) return;
    if (panelRef.current?.contains(target)) return;

    // Ignore interactions inside portaled Radix floating layers (popover/select/tooltip)
    // They are rendered outside the dialog panel in the DOM but still belong to the dialog flow.
    if (target.closest('[data-slot="popover-content"], [data-slot="select-content"], [data-slot="tooltip-content"]'))
      return;

    outsideCloseRef.current?.click();
  };

  return (
    <DialogPortal>
      <DialogOverlay />

      <DialogPrimitive.Content data-slot="dialog-content" className="fixed inset-0 z-50 outline-none" {...props}>
        <DialogPrimitive.Close asChild>
          <button ref={outsideCloseRef} type="button" className="sr-only" aria-label="Close dialog" />
        </DialogPrimitive.Close>

        <div className="h-full overflow-y-auto overscroll-y-contain" onPointerDown={handlePointerDownOutsidePanel}>
          <div className="flex min-h-full flex-col items-center justify-center">
            <div
              ref={panelRef}
              className={cn(
                "bg-popover text-popover-foreground ring-foreground/10",
                "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
                "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
                "relative z-50 w-full max-w-[calc(100%-2rem)] sm:max-w-sm",
                "gap-4 rounded-xl p-4 text-sm ring-1 duration-100",
                "pointer-events-auto",
                className,
              )}
            >
              {children}

              {showCloseButton && (
                <DialogPrimitive.Close asChild>
                  <Button variant="ghost" className="absolute top-2 right-2" size="icon-sm">
                    <XIcon />
                  </Button>
                </DialogPrimitive.Close>
              )}
            </div>
          </div>
        </div>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-2", className)} {...props} />;
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "bg-muted/50 -mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t p-4 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("font-heading text-base leading-none font-medium", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-muted-foreground *:[a]:hover:text-foreground text-sm *:[a]:underline *:[a]:underline-offset-3",
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
