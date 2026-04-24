import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { signOutApi } from "@/services/apis/auth/sign-out.api";

export function UserProfileButton({ expanded }: { expanded: boolean }) {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) {
    return null;
  }

  const fallback = user.fullname
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const onProfileClick = () => {
    setOpen(false);
    router.push("/profile");
  };

  const onLogoutClick = async () => {
    setOpen(false);
    setUser(null);
    await signOutApi();
    router.push("/sign-in");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span className="group flex cursor-pointer items-center justify-start">
          <Avatar className={cn("size-9", !expanded && "-ml-px")}>
            <AvatarImage src={user.avatarUrl || undefined} alt={user.fullname} />
            <AvatarFallback className="bg-[#d8d8d8] text-xs">{fallback}</AvatarFallback>
          </Avatar>
          {expanded && (
            <div className="ml-2 flex w-37 flex-col items-start overflow-hidden">
              <span className="truncate text-sm font-semibold text-gray-900">{user.fullname}</span>
              <span
                className={cn("group-hover:text-foreground truncate text-xs text-gray-500", open && "text-foreground")}
              >
                {user.email}
              </span>
            </div>
          )}
        </span>
      </PopoverTrigger>

      <PopoverContent
        className="relative w-40 px-0! pt-2! pb-3!"
        align="end"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <PopoverArrow stroke="2" />
        <div className="mb-2 px-4 text-xs font-normal text-[#787878]">Select an action</div>

        <div className="flex flex-col">
          <Button
            variant="ghost"
            onClick={onProfileClick}
            className="hover:bg-accent flex h-8 cursor-pointer items-center justify-start gap-2 rounded-none px-4! py-1 text-sm font-normal"
          >
            <User size={16} />
            Profile
          </Button>
          <Button
            variant="ghost"
            onClick={onLogoutClick}
            className="hover:bg-accent flex h-8 cursor-pointer items-center justify-start gap-2 rounded-none px-4! py-1 text-sm font-normal"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
