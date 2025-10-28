"use client";

import { BellIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatNotificationTimestamp, useNotifications } from "@/lib/notification";
import { useTranslations } from "@/lib/use-translations";

function Dot({ className }: { className?: string }) {
  return (
    <svg width="6" height="6" fill="currentColor" viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

export default function NotificationList() {
  const { state, markReadNotification } = useNotifications();
  const translations = useTranslations();
  const { notifications, isLoading, error, unreadNotifications } = state;
  const unreadCount = unreadNotifications.length;

  const handleNotificationClick = (id: string) => {
    console.log(id);
    markReadNotification(id);
  };

  return (
    <>
      <Popover modal={false}>
        <PopoverTrigger asChild>
          <Button size="icon" variant="ghost" className="relative cursor-pointer" aria-label="Open notifications">
            <BellIcon size={16} aria-hidden="true" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1 rounded-full">{unreadCount > 99 ? "99+" : unreadCount}</Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent id="notifications-content" className="w-80 p-1">
          <div className="flex items-baseline justify-between gap-4 px-3 py-2">
            <div className="text-sm font-semibold">Notifications</div>
            {unreadCount > 0 && <span className="text-xs text-muted-foreground">{unreadCount} unread</span>}
          </div>
          <div role="separator" aria-orientation="horizontal" className="-mx-1 my-1 h-px bg-border"></div>

          {notifications.length === 0 && <div className="text-center text-sm text-muted-foreground p-4">No notifications found</div>}

          {notifications.map((notification, index) => (
            <div
              key={notification.id || `notification-${index}`}
              className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
              onClick={() => notification.id && handleNotificationClick(notification.id)}
            >
              <div className="relative flex items-start pe-3">
                <div className="flex-1 space-y-1">
                  <div className="text-left text-foreground/80 after:absolute after:inset-0">
                    <div className="font-medium text-foreground hover:underline">{notification.contextMessage}</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {translations.notifications[notification.message as keyof typeof translations.notifications]}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{formatNotificationTimestamp(notification.createdAt)}</div>
                </div>
                {!notification.isRead && (
                  <div className="absolute end-0 self-center">
                    <span className="sr-only">Unread</span>
                    <Dot />
                  </div>
                )}
              </div>
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </>
  );
}
