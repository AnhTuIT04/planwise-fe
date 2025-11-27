import LeftSidebar from "@/components/sidebar/left-sidebar";
import RightSidebar from "@/components/sidebar/right-sidebar";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#ecedee]">
      <LeftSidebar />
      {children}
      <RightSidebar />
    </div>
  );
}
