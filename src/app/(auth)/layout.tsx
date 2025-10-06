import LogoButton from "@/components/share/LogoButton";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="p-6">
        <LogoButton />
      </div>
      <div className="flex flex-1 items-center justify-center px-4">{children}</div>
    </div>
  );
}
