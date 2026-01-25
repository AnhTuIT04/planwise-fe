"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Bell, Star, ClipboardList, FolderKanban, User, LogOut, Mail } from "lucide-react";

import { useSidebarStore, LeftSidebarItem } from "@/stores";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LogoButton from "@/components/shared/logo-button";
import ChevronIcon from "@/components/shared/chevron-icon";
import { useAuth } from "@/components/providers/auth-provider";

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
  {
    icon: Mail,
    label: "Invitations",
    itemKey: "invitations",
  },
];

export default function LeftSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isGettingUser, logout, isLoggingOut } = useAuth();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
    } else if (pathname.startsWith("/invitations")) {
      setLeftSidebarActiveItem("invitations");
    }

  }, [pathname, setLeftSidebarActiveItem, setLeftSidebarExpanded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const handleSidebarItemClick = (itemKey: LeftSidebarItem) => {
    setLeftSidebarActiveItem(itemKey);
    router.push(`/${itemKey}`);
  };

  const handleProfileClick = () => {
    router.push("/profile");
    setShowUserMenu(false);
    setLeftSidebarActiveItem(null);
  };

  const handleLogoutClick = async () => {
    setShowUserMenu(false);
    await logout();
  };

  return (
    <TooltipProvider delayDuration={500}>
      <aside
        className={`flex h-full flex-col py-2 text-[#787878] transition-all duration-300 ease-in-out ${leftSidebarExpanded ? "w-56 min-w-56 px-4" : "w-12 min-w-12 items-center px-1"} `}
      >
        {/* Logo + Toggle */}
        <div className={`flex w-full items-center ${leftSidebarExpanded ? "justify-between" : "flex-col"}`}>
          <LogoButton variant={leftSidebarExpanded ? "full" : "short"} />

          {!leftSidebarExpanded && <Separator className="mt-2 mb-1 h-0! border-b" />}

          <Button
            variant="ghost"
            size="icon"
            disabled={pathname.startsWith("/projects/")}
            onClick={toggleLeftSidebar}
            className={`hover:cursor-pointer hover:bg-transparent ${leftSidebarExpanded ? "w-5" : "w-full"} `}
          >
            <span className={`inline-flex items-center transition-transform duration-300`}>
              <ChevronIcon state={leftSidebarExpanded ? "left" : "right"} />
            </span>
          </Button>
        </div>

        <Separator className={cn("h-0! border-b", leftSidebarExpanded ? "my-2" : "mt-1 mb-4")} />

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

        <Separator className="my-4 h-0! border-b" />

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
        {!isGettingUser && user && (
          <div ref={menuRef} className="relative mt-4">
            <UserProfileButton
              user={user}
              expanded={leftSidebarExpanded}
              showMenu={showUserMenu}
              onToggleMenu={() => setShowUserMenu(!showUserMenu)}
              onProfileClick={handleProfileClick}
              onLogoutClick={handleLogoutClick}
            />
          </div>
        )}
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
      className={`w-full cursor-pointer gap-2 rounded-[6px] text-sm font-semibold text-[#787878]! transition hover:bg-[#dcdcdc] ${
        active ? "bg-[#dcdcdc]" : ""
      } ${expanded ? "justify-start" : "justify-center"}`}
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

function UserProfileButton({
  user,
  expanded,
  showMenu,
  onToggleMenu,
  onProfileClick,
  onLogoutClick,
}: {
  user: any;
  expanded: boolean;
  showMenu: boolean;
  onToggleMenu: () => void;
  onProfileClick: () => void;
  onLogoutClick: () => void;
}) {
  if (!user) return null;

  const userInitials = user.fullname
    ? user.fullname
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const content = (
    <Button
      variant="ghost"
      onClick={onToggleMenu}
      className={`w-full cursor-pointer gap-2 rounded-[6px] text-sm font-medium text-[#787878] transition hover:bg-[#dcdcdc] ${
        expanded ? "justify-start p-2" : "justify-center p-1"
      }`}
    >
      <Avatar className="h-6 w-6">
        <AvatarImage src={user.avatarUrl} alt={user.fullname || "User"} />
        <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
      </Avatar>
      {expanded && (
        <div className="flex flex-col items-start overflow-hidden">
          <span className="truncate text-sm font-semibold text-gray-900">{user.fullname || "User"}</span>
          <span className="truncate text-xs text-gray-500">{user.email}</span>
        </div>
      )}
    </Button>
  );

  const menuContent = showMenu && (
    <div className="absolute bottom-full left-0 mb-2 w-full rounded-md border bg-white shadow-lg">
      <div className="flex flex-col">
        <Button
          variant="ghost"
          onClick={onProfileClick}
          className="flex items-center justify-start gap-2 rounded-none px-3 py-2 text-sm hover:bg-gray-100"
        >
          <User size={16} />
          Profile
        </Button>
        <Button
          variant="ghost"
          onClick={onLogoutClick}
          className="flex items-center justify-start gap-2 rounded-none px-3 py-2 text-sm hover:bg-gray-100"
        >
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </div>
  );

  return expanded ? (
    <div className="relative">
      {content}
      {menuContent}
    </div>
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative">
          {content}
          {showMenu && (
            <div className="absolute bottom-12 left-full ml-2 w-48 rounded-md border bg-white shadow-lg">
              <div className="border-b p-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl} alt={user.fullname || "User"} />
                    <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">{user.fullname || "User"}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <Button
                  variant="ghost"
                  onClick={onProfileClick}
                  className="flex items-center justify-start gap-2 rounded-none px-3 py-2 text-sm hover:bg-gray-100"
                >
                  <User size={16} />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  onClick={onLogoutClick}
                  className="flex items-center justify-start gap-2 rounded-none px-3 py-2 text-sm hover:bg-gray-100"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="left" sideOffset={8}>
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={user.avatarUrl} alt={user.fullname || "User"} />
            <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{user.fullname || "User"}</span>
            <span className="text-xs opacity-75">{user.email}</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
