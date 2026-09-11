import { cn } from "@/lib/utils";

/**
 * White content panel — the basic surface of the admin console.
 */
export function AdminPanel({
  title,
  subtitle,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-black/[0.06] bg-white shadow-sm", className)}>
      {(title || action) && (
        <header className="flex flex-wrap items-start justify-between gap-3 px-5 pt-4 pb-1">
          <div>
            {title && <h3 className="text-[15px] font-semibold tracking-tight text-[#16181d]">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-[#9095a1]">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={cn("px-5 pt-3 pb-5", bodyClassName)}>{children}</div>
    </section>
  );
}
