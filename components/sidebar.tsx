"use client";

import { BookOpen, Bot, Command, Settings2, SquareTerminal } from "lucide-react";
import * as React from "react";

import { NavigationMain } from "@/components/navigation/main";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
    {
      title: "Random",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Random 1.1",
          url: "#",
        },
        {
          title: "Random 1.2",
          url: "#",
        },
        {
          title: "Random 1.3",
          url: "#",
        },
        {
          title: "Random 1.4",
          url: "#",
        },
      ],
    },
    {
      title: "Random 2",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Random 2.1",
          url: "#",
        },
        {
          title: "Random 2.2",
          url: "#",
        },
        {
          title: "Random 2.3",
          url: "#",
        },
        {
          title: "Random 2.4",
          url: "#",
        },
      ],
    },
    {
      title: "Random 3",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Random 3.1",
          url: "#",
        },
        {
          title: "Random 3.2",
          url: "#",
        },
        {
          title: "Random 3.3",
          url: "#",
        },
        {
          title: "Random 3.4",
          url: "#",
        },
      ],
    },
    {
      title: "Random 4",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Random 4.1",
          url: "#",
        },
        {
          title: "Random 4.2",
          url: "#",
        },
        {
          title: "Random 4.3",
          url: "#",
        },
        {
          title: "Random 4.4",
          url: "#",
        },
      ],
    },
    {
      title: "Random 5",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Random 5.1",
          url: "#",
        },
        {
          title: "Random 5.2",
          url: "#",
        },
        {
          title: "Random 5.3",
          url: "#",
        },
        {
          title: "Random 5.4",
          url: "#",
        },
      ],
    },
  ],
};

export function SidebarComponent({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavigationMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
