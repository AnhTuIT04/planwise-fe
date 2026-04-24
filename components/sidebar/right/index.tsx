"use client";

import { useSidebarStore, RightSidebarItem } from "@/stores/sidebar.store";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronIcon } from "@/components/ui/chevron-icon";

import SearchSidebar from "./search-sidebar";
import CalendarSidebar from "./calendar-sidebar";
import GmailSidebar from "./gmail-sidebar";
import NotionSidebar from "./notion-sidebar";

const sideBarItems: Array<{
  icon: any;
  label: string;
  itemKey: RightSidebarItem;
}> = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        enableBackground="new 0 0 192 192"
        height="192"
        viewBox="0 0 192 192"
        width="192"
      >
        <rect fill="none" height="192" width="192" />
        <g>
          <g>
            <polygon fill="#FFFFFF" points="136,56 100,52 56,56 52,96 56,136 96,141 136,136 140,95" />
            <path
              d="M72.41,118.06c-2.99-2.02-5.06-4.97-6.19-8.87l6.94-2.86c0.63,2.4,1.73,4.26,3.3,5.58 c1.56,1.32,3.46,1.97,5.68,1.97c2.27,0,4.22-0.69,5.85-2.07c1.63-1.38,2.45-3.14,2.45-5.27c0-2.18-0.86-3.96-2.58-5.34 s-3.88-2.07-6.46-2.07h-4.01v-6.87h3.6c2.22,0,4.09-0.6,5.61-1.8c1.52-1.2,2.28-2.84,2.28-4.93c0-1.86-0.68-3.34-2.04-4.45 c-1.36-1.11-3.08-1.67-5.17-1.67c-2.04,0-3.66,0.54-4.86,1.63s-2.07,2.43-2.62,4.01l-6.87-2.86c0.91-2.58,2.58-4.86,5.03-6.83 c2.45-1.97,5.58-2.96,9.38-2.96c2.81,0,5.34,0.54,7.58,1.63c2.24,1.09,4,2.6,5.27,4.52c1.27,1.93,1.9,4.09,1.9,6.49 c0,2.45-0.59,4.52-1.77,6.22c-1.18,1.7-2.63,3-4.35,3.91v0.41c2.27,0.95,4.12,2.4,5.58,4.35c1.45,1.95,2.18,4.28,2.18,7 c0,2.72-0.69,5.15-2.07,7.28c-1.38,2.13-3.29,3.81-5.71,5.03c-2.43,1.22-5.16,1.84-8.19,1.84 C78.64,121.09,75.4,120.08,72.41,118.06z"
              fill="#1A73E8"
            />
            <path d="M115,83.62l-7.58,5.51l-3.81-5.78l13.67-9.86h5.24V120H115V83.62z" fill="#1A73E8" />
            <polygon fill="#EA4335" points="136,172 172,136 154,128 136,136 128,154" />
            <polygon fill="#34A853" points="48,154 56,172 136,172 136,136 56,136" />
            <path d="M32,20c-6.63,0-12,5.37-12,12v104l18,8l18-8V56h80l8-18l-8-18H32z" fill="#4285F4" />
            <path d="M20,136v24c0,6.63,5.37,12,12,12h24v-36H20z" fill="#188038" />
            <polygon fill="#FBBC04" points="136,56 136,136 172,136 172,56 154,48" />
            <path d="M172,56V32c0-6.63-5.37-12-12-12h-24v36H172z" fill="#1967D2" />
          </g>
        </g>
      </svg>
    ),
    label: "Google Calendar",
    itemKey: "calendar",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="52 42 88 66">
        <path fill="#4285f4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
        <path fill="#34a853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" />
        <path fill="#fbbc04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2" />
        <path fill="#ea4335" d="M72 74V48l24 18 24-18v26L96 92" />
        <path fill="#c5221f" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2" />
      </svg>
    ),
    label: "Gmail",
    itemKey: "mail",
  },
  {
    icon: (
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.017 4.313l55.333 -4.087c6.797 -0.583 8.543 -0.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 0.193 -6.023 -0.39 -8.16 -3.113L3.3 79.94c-2.333 -3.113 -3.3 -5.443 -3.3 -8.167V11.113c0 -3.497 1.553 -6.413 6.017 -6.8z"
          fill="#fff"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M61.35 0.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723 0.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257 -3.89c5.433 -0.387 6.99 -2.917 6.99 -7.193V20.64c0 -2.21 -0.873 -2.847 -3.443 -4.733L74.167 3.143c-4.273 -3.107 -6.02 -3.5 -12.817 -2.917zM25.92 19.523c-5.247 0.353 -6.437 0.433 -9.417 -1.99L8.927 11.507c-0.77 -0.78 -0.383 -1.753 1.557 -1.947l53.193 -3.887c4.467 -0.39 6.793 1.167 8.54 2.527l9.123 6.61c0.39 0.197 1.36 1.36 0.193 1.36l-54.933 3.307 -0.68 0.047zM19.803 88.3V30.367c0 -2.53 0.777 -3.697 3.103 -3.893L86 22.78c2.14 -0.193 3.107 1.167 3.107 3.693v57.547c0 2.53 -0.39 4.67 -3.883 4.863l-60.377 3.5c-3.493 0.193 -5.043 -0.97 -5.043 -4.083zm59.6 -54.827c0.387 1.75 0 3.5 -1.75 3.7l-2.91 0.577v42.773c-2.527 1.36 -4.853 2.137 -6.797 2.137 -3.107 0 -3.883 -0.973 -6.21 -3.887l-19.03 -29.94v28.967l6.02 1.363s0 3.5 -4.857 3.5l-13.39 0.777c-0.39 -0.78 0 -2.723 1.357 -3.11l3.497 -0.97v-38.3L30.48 40.667c-0.39 -1.75 0.58 -4.277 3.3 -4.473l14.367 -0.967 19.8 30.327v-26.83l-5.047 -0.58c-0.39 -2.143 1.163 -3.7 3.103 -3.89l13.4 -0.78z"
          fill="#000"
        />
      </svg>
    ),
    label: "Notion",
    itemKey: "notion",
  },
  {
    icon: (
      <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M679.039688 749.379825a29.25665 29.25665 0 0 1 46.225506-35.927166l204.796548 263.309847a29.25665 29.25665 0 0 1-46.225507 35.927166l-204.796547-263.309847zM482.727568 789.929541C264.589988 789.929541 87.762798 613.102351 87.762798 394.964771S264.589988 0 482.727568 0 877.692339 176.827191 877.692339 394.964771 700.865148 789.929541 482.727568 789.929541z m0-58.513299C668.53655 731.416242 819.17904 580.773753 819.17904 394.964771S668.53655 58.513299 482.727568 58.513299 146.276097 209.155789 146.276097 394.964771 296.918586 731.416242 482.727568 731.416242z"
          fill="#7F7F7F"
        />
      </svg>
    ),
    label: "Search",
    itemKey: "search",
  },
];

export default function RightSidebar() {
  const { rightSidebarExpanded, rightSidebarActiveItem, toggleRightSidebar, setRightSidebarActiveItem } =
    useSidebarStore();

  const handleSidebarItemClick = (itemKey: RightSidebarItem) => {
    setRightSidebarActiveItem(itemKey);
    if (!rightSidebarExpanded) toggleRightSidebar();
  };

  const getSidebarWidth = (item: RightSidebarItem): number => {
    switch (item) {
      case "calendar":
        return 400;
      case "mail":
        return 400;
      case "notion":
        return 400;
      case "search":
        return 320;
    }
  };

  const sidebarWidth = rightSidebarExpanded ? getSidebarWidth(rightSidebarActiveItem) : 0;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="my-1 mr-1 flex rounded-r-[6px] border-y border-r border-[#dcdcdc] bg-[#f8f8f9] shadow-[-5px_0px_15px_rgba(0,0,0,0.05)]">
        <div
          className={`relative z-10 h-full overflow-hidden ${rightSidebarExpanded ? "border-x" : "border-l"} bg-[#f8f8f9] backdrop-blur-md transition-[width] duration-500 ease-in-out`}
          style={{
            width: `${sidebarWidth}px`,
          }}
        >
          <div
            className="h-full transition-transform duration-500 ease-in-out will-change-transform"
            style={{
              transform: rightSidebarExpanded ? "translateX(0)" : `translateX(${sidebarWidth}px)`,
            }}
          >
            <SidebarContent item={rightSidebarActiveItem} />
          </div>
        </div>

        <aside className="z-20 flex w-12 flex-col items-center px-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleRightSidebar}
            className="my-2 cursor-pointer hover:bg-transparent"
          >
            <ChevronIcon state={rightSidebarExpanded ? "right" : "left"} />
          </Button>

          <div className="w-full space-y-3">
            {sideBarItems.map((item) => (
              <SidebarItem
                key={item.itemKey}
                icon={item.icon}
                label={item.label}
                expanded={rightSidebarExpanded}
                active={rightSidebarActiveItem === item.itemKey}
                onClick={() => handleSidebarItemClick(item.itemKey)}
              />
            ))}
          </div>
        </aside>
      </div>
    </TooltipProvider>
  );
}

function SidebarContent({ item }: { item: RightSidebarItem }) {
  switch (item) {
    case "calendar":
      return <CalendarSidebar />;
    case "mail":
      return <GmailSidebar />;
    case "notion":
      return <NotionSidebar />;
    case "search":
      return <SearchSidebar />;
  }
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
      className={`w-full cursor-pointer justify-center gap-2 rounded-md text-sm font-semibold transition hover:bg-[#dcdcdc] ${
        active && expanded ? "bg-[#dcdcdc]" : ""
      }`}
    >
      {Icon}
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
