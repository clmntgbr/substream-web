"use client";

import { formatNotificationTimestamp, Notification, useNotifications } from "@/lib/notification";
import { useTranslations } from "@/lib/use-translations";
import { Dot } from "lucide-react";

interface NotificationCardProps {
  notification: Notification;
}
export function NotificationCard({ notification }: NotificationCardProps) {
  const { markReadNotification } = useNotifications();
  const translations = useTranslations();

  const handleNotificationClick = (id: string) => {
    markReadNotification(id);
  };

  return (
    <div
      key={notification.id}
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
  );
}
