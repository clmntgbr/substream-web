"use client";

import { useAuth } from "@/lib/auth-context";
import { ModeToggle } from "./mode-toggle";
import { NavigationUser } from "./navigation/user";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 pl-4 pr-1">
        {/* <Button className="h-8 w-8" variant="ghost" size="icon" onClick={toggleSidebar}>
          <SidebarIcon />
        </Button> */}
        <ModeToggle />
        <div className="ml-auto flex items-center gap-2">
          <NavigationUser user={user} />
        </div>
      </div>
    </header>
  );
}
