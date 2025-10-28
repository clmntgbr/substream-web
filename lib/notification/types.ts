export interface Notification {
  id?: string;
  title: string;
  message: string;
  context: string;
  contextMessage: string;
  contextId: string;
  createdAt: string;
  updatedAt: string;
  isRead?: boolean;
}

export interface NotificationState {
  notifications: Notification[];
  readNotifications: Notification[];
  unreadNotifications: Notification[];
  isLoading: boolean;
  error: string | null;
}

export type NotificationAction =
  | { type: "SEARCH_NOTIFICATIONS"; payload: Notification[] }
  | { type: "MARK_READ_NOTIFICATION"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET" };
