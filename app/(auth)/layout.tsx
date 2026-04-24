import { LogoButton } from "@/components/ui/logo-button";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto flex h-full w-full max-w-7xl gap-8 px-8 py-6 not-lg:items-center not-lg:justify-center">
        <LogoButton />
      </div>
      <div className="flex flex-1 items-center justify-center">{children}</div>
    </div>
  );
}
