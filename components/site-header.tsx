"use client";

import { SidebarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";
import { NavUser } from "./nav-user";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const { user } = useAuth();

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 pl-4 pr-1">
        <Button className="h-8 w-8" variant="ghost" size="icon" onClick={toggleSidebar}>
          <SidebarIcon />
        </Button>
        <NavUser user={user} />
      </div>
    </header>
  );
}
