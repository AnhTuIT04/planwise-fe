"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ClipboardList, Hash, Folder, Users, Settings } from "lucide-react";

import { ProjectSidebarItem, useSidebarStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useProject } from "@/hooks/useProject";

const sideBarItems: Array<{
  icon: any;
  label: string;
  itemKey: ProjectSidebarItem;
}> = [
  {
    icon: ClipboardList,
    label: "Overview",
    itemKey: "overview",
  },
  {
    icon: Folder,
    label: "Workspace",
    itemKey: "workspace",
  },
  {
    icon: Hash,
    label: "Channels",
    itemKey: "channels",
  },
  {
    icon: Users,
    label: "Members",
    itemKey: "members",
  },
  {
    icon: Settings,
    label: "Roles",
    itemKey: "roles",
  },
];

export default function ProjectSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const { projectSidebarActiveItem, setProjectSidebarActiveItem } = useSidebarStore();
  const { project } = useProject({ projectId: pathname.split("/")[2] || "" });

  useEffect(() => {
    const segment = pathname.split("/")[3];
    setProjectSidebarActiveItem(segment as any);
  }, [pathname]);

  const handleSidebarItemClick = (itemKey: ProjectSidebarItem) => {
    setProjectSidebarActiveItem(itemKey);
    router.push(itemKey);
  };

  return (
    <aside
      className={`flex h-full w-56 min-w-56 flex-col px-4 py-2 text-[#787878] transition-all duration-300 ease-in-out`}
    >
      <div className={`flex w-full items-center justify-between`}>
        <label className="truncate text-xl font-bold text-black" title={project?.name ?? "Project"}>
          {project?.name ?? "Project"}
        </label>
      </div>

      <Separator className="my-2 h-0! border-b" />

      {/* Nav */}
      <nav className="w-full space-y-1">
        {sideBarItems.map((item) => (
          <SidebarItem
            key={item.itemKey}
            icon={item.icon}
            label={item.label}
            active={projectSidebarActiveItem === item.itemKey}
            onClick={() => handleSidebarItemClick(item.itemKey)}
          />
        ))}
      </nav>
    </aside>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`w-full cursor-pointer gap-2 rounded-[6px] text-sm font-semibold text-[#787878]! transition hover:bg-[#dcdcdc] ${
        active ? "bg-[#dcdcdc]" : ""
      } justify-start`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Button>
  );

  return content;
}
