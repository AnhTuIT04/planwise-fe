import LogoButton from "@/components/shared/logo-button";
import { Toaster } from "sonner";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Toaster richColors position="top-center" />
      <div className="mx-auto flex h-full w-full max-w-7xl gap-8 p-6 not-lg:items-center not-lg:justify-center">
        <LogoButton />
      </div>
      <div className="flex flex-1 items-center justify-center px-4">{children}</div>
    </div>
  );
}
