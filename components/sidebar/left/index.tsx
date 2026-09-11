"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Bell, Star, ClipboardList, FolderKanban } from "lucide-react";

import { useSidebarStore, LeftSidebarItem } from "@/stores/sidebar.store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LogoButton } from "@/components/ui/logo-button";
import { ChevronIcon } from "@/components/ui/chevron-icon";
import { UserProfileButton } from "@/components/ui/user-profile-button";

const sideBarItems: Array<{
  icon: any;
  label: string;
  itemKey: LeftSidebarItem;
}> = [
  {
    icon: ClipboardList,
    label: "My task",
    itemKey: "my-tasks",
  },
  {
    icon: Bell,
    label: "Notification",
    itemKey: "notifications",
  },
  {
    icon: Star,
    label: "Review",
    itemKey: "reviews",
  },
];

export default function LeftSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const {
    leftSidebarExpanded,
    leftSidebarActiveItem,
    toggleLeftSidebar,
    setLeftSidebarExpanded,
    setLeftSidebarActiveItem,
  } = useSidebarStore();

  useEffect(() => {
    if (pathname.startsWith("/my-tasks")) {
      setLeftSidebarActiveItem("my-tasks");
    } else if (pathname.startsWith("/notifications")) {
      setLeftSidebarActiveItem("notifications");
    } else if (pathname.startsWith("/reviews")) {
      setLeftSidebarActiveItem("reviews");
    } else if (pathname.startsWith("/projects/")) {
      setLeftSidebarExpanded(false);
    } else if (pathname.startsWith("/projects")) {
      setLeftSidebarActiveItem("projects");
    } else {
      setLeftSidebarActiveItem(null);
    }
  }, [pathname, setLeftSidebarActiveItem, setLeftSidebarExpanded]);

  const handleSidebarItemClick = (itemKey: LeftSidebarItem) => {
    setLeftSidebarActiveItem(itemKey);
    router.push(`/${itemKey}`);
  };

  return (
    <TooltipProvider delayDuration={500}>
      <aside
        className={`flex h-full flex-col py-2 text-[#787878] transition-all duration-300 ease-in-out ${leftSidebarExpanded ? "w-56 min-w-56 px-4" : "w-12 min-w-12 items-center px-1"} `}
      >
        {/* Logo + Toggle */}
        <div className={`flex w-full items-center ${leftSidebarExpanded ? "justify-between" : "flex-col"}`}>
          <LogoButton
            variant={leftSidebarExpanded ? "full" : "short"}
            className={cn(!leftSidebarExpanded && "-ml-px")}
          />

          {!leftSidebarExpanded && <Separator className="mt-2 mb-1 w-[90%] bg-[#dcdcdc]" />}

          <Button
            variant="ghost"
            size="icon"
            disabled={pathname.startsWith("/projects/")}
            onClick={toggleLeftSidebar}
            className={`hover:cursor-pointer hover:bg-transparent ${leftSidebarExpanded ? "w-5" : "w-full"} `}
          >
            <span className="relative inline-flex size-5 items-center transition-transform duration-300">
              <ChevronIcon state={leftSidebarExpanded ? "left" : "right"} />
            </span>
          </Button>
        </div>

        <Separator className={cn("bg-[#dcdcdc]", leftSidebarExpanded ? "my-2" : "mt-1 mb-4 w-[90%]")} />

        {/* Nav */}
        <nav className="w-full space-y-1">
          {sideBarItems.map((item) => (
            <SidebarItem
              key={item.itemKey}
              icon={item.icon}
              label={item.label}
              active={leftSidebarActiveItem === item.itemKey}
              expanded={leftSidebarExpanded}
              onClick={() => handleSidebarItemClick(item.itemKey)}
            />
          ))}
        </nav>

        <Separator className={cn("my-4 bg-[#dcdcdc]", !leftSidebarExpanded && "w-[90%]")} />

        {leftSidebarExpanded && <div className="mb-1 px-3 text-xs font-semibold text-[#787878]">WORKSPACE</div>}

        <SidebarItem
          icon={FolderKanban}
          label="Your projects"
          active={leftSidebarActiveItem === "projects"}
          expanded={leftSidebarExpanded}
          onClick={() => handleSidebarItemClick("projects")}
        />

        {/* Spacer to push user profile to bottom */}
        <div className="flex-1" />

        {/* User Profile Section */}
        <UserProfileButton expanded={leftSidebarExpanded} />
      </aside>
    </TooltipProvider>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  active = false,
  expanded,
  onClick,
}: {
  icon: any;
  label: string;
  active?: boolean;
  expanded: boolean;
  onClick?: () => void;
}) {
  const content = (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "w-full cursor-pointer gap-2 rounded-[6px] py-4.75! text-sm font-semibold text-[#787878]! transition hover:bg-[#dcdcdc]",
        active && "bg-[#dcdcdc]",
        expanded ? "justify-start" : "justify-center",
      )}
    >
      <Icon size={18} />
      {expanded && <span>{label}</span>}
    </Button>
  );

  return expanded ? (
    content
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
