export function AdminPageTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#16181d]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-[#9095a1]">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
