"use client";

import { useNotifications } from "@/lib/notification";

export default function NotificationList() {
  const { state } = useNotifications();

  return (
    <div>
      <h1>Notifications</h1>
    </div>
  );
  // return (
  //   <ClientOnly
  //     fallback={
  //       <Button size="icon" variant="ghost" className="relative cursor-pointer" aria-label="Open notifications">
  //         <BellIcon size={16} aria-hidden="true" />
  //         {unreadCount > 0 && (
  //           <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1 rounded-full">{unreadCount > 99 ? "99+" : unreadCount}</Badge>
  //         )}
  //       </Button>
  //     }
  //   >
  //     <Popover modal={false}>
  //       <PopoverTrigger asChild>
  //         <Button size="icon" variant="ghost" className="relative cursor-pointer" aria-label="Open notifications">
  //           <BellIcon size={16} aria-hidden="true" />
  //           {unreadCount > 0 && (
  //             <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1 rounded-full">{unreadCount > 99 ? "99+" : unreadCount}</Badge>
  //           )}
  //         </Button>
  //       </PopoverTrigger>
  //       <PopoverContent id="notifications-content" className="w-80 p-1">
  //         <div className="flex items-baseline justify-between gap-4 px-3 py-2">
  //           <div className="text-sm font-semibold">Notifications</div>
  //           {unreadCount > 0 && <span className="text-xs text-muted-foreground">{unreadCount} unread</span>}
  //         </div>
  //         <div role="separator" aria-orientation="horizontal" className="-mx-1 my-1 h-px bg-border"></div>

  //         {isLoading ? (
  //           <div className="flex items-center justify-center py-8">
  //             <div className="text-sm text-muted-foreground">Loading notifications...</div>
  //           </div>
  //         ) : error ? (
  //           <div className="flex items-center justify-center py-8">
  //             <div className="text-sm text-destructive">Error loading notifications</div>
  //           </div>
  //         ) : notifications.length === 0 ? (
  //           <div className="flex items-center justify-center py-8">
  //             <div className="text-sm text-muted-foreground">No notifications</div>
  //           </div>
  //         ) : (
  //           notifications.map((notification, index) => (
  //             <div key={notification.id || `notification-${index}`} className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent">
  //               <div className="relative flex items-start pe-3">
  //                 <div className="flex-1 space-y-1">
  //                   <button
  //                     className="text-left text-foreground/80 after:absolute after:inset-0"
  //                     onClick={() => notification.id && handleNotificationClick(notification.id)}
  //                   >
  //                     <div className="font-medium text-foreground hover:underline">{notification.title}</div>
  //                     <div className="text-sm text-muted-foreground">{notification.message}</div>
  //                     {notification.contextMessage && <div className="text-xs text-muted-foreground mt-1">{notification.contextMessage}</div>}
  //                   </button>
  //                   <div className="text-xs text-muted-foreground">{formatNotificationTimestamp(notification.createdAt)}</div>
  //                 </div>
  //                 {!notification.isRead && (
  //                   <div className="absolute end-0 self-center">
  //                     <span className="sr-only">Unread</span>
  //                     <Dot />
  //                   </div>
  //                 )}
  //               </div>
  //             </div>
  //           ))
  //         )}
  //       </PopoverContent>
  //     </Popover>
  //   </ClientOnly>
  // );
}
