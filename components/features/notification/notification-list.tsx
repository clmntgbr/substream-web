"use client";

import { BellIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClientOnly } from "@/components/ui/client-only";
import { EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia } from "@/components/ui/empty";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNotifications } from "@/lib/notification";
import { useEffect } from "react";
import { NotificationCard } from "./notification-card";

export default function NotificationList() {
  const { state, searchNotifications } = useNotifications();
  const { notifications, unreadNotifications } = state;
  const unreadCount = unreadNotifications.length;

  useEffect(() => {
    const interval = setInterval(() => {
      searchNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, [searchNotifications]);

  return (
    <ClientOnly
      fallback={
        <Button size="icon" variant="ghost" className="relative cursor-pointer" aria-label="Open notifications">
          <BellIcon size={16} aria-hidden="true" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1 rounded-full">{unreadCount > 99 ? "99+" : unreadCount}</Badge>
          )}
        </Button>
      }
    >
      <Popover modal={false}>
        <PopoverTrigger asChild>
          <Button size="icon" variant="ghost" className="relative cursor-pointer" aria-label="Open notifications">
            <BellIcon size={16} aria-hidden="true" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1 rounded-full">{unreadCount > 99 ? "99+" : unreadCount}</Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent id="notifications-content" className="w-80 p-1 min-h-[165px]">
          <div className="flex items-baseline justify-between gap-4 px-3 py-2">
            <div className="text-sm font-semibold">Notifications</div>
            {unreadCount > 0 && <span className="text-xs text-muted-foreground">{unreadCount} unread</span>}
          </div>
          <div role="separator" aria-orientation="horizontal" className="-mx-1 my-1 h-px bg-border"></div>

          {unreadCount <= 0 && (
            <div className="text-center text-sm text-muted-foreground p-4">
              <EmptyContent>
                <EmptyHeader>
                  <EmptyMedia variant="icon" className="bg-popover">
                    <BellIcon size={24} />
                  </EmptyMedia>
                  <EmptyDescription>You don&apos;t have any notifications.</EmptyDescription>
                </EmptyHeader>
              </EmptyContent>
            </div>
          )}

          {unreadNotifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </PopoverContent>
      </Popover>
    </ClientOnly>
  );
}
