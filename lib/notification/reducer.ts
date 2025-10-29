import { NotificationAction, NotificationState } from "./types";

// Initial state
export const initialState: NotificationState = {
  notifications: [],
  readNotifications: [],
  unreadNotifications: [],
  isLoading: false,
  error: null,
};

// Reducer function
export function notificationReducer(
  state: NotificationState,
  action: NotificationAction,
): NotificationState {
  switch (action.type) {
    case "SET_NOTIFICATIONS":
      const notifications = Array.isArray(action.payload) ? action.payload : [];
      const readNotifications = notifications.filter((n) => n.isRead);
      const unreadNotifications = notifications.filter((n) => !n.isRead);
      return {
        ...state,
        notifications,
        readNotifications,
        unreadNotifications,
        error: null,
      };
    case "MARK_READ_NOTIFICATION":
      const updatedNotifications = state.notifications.map((notification) =>
        notification.id === action.payload
          ? { ...notification, isRead: true }
          : notification,
      );
      const updatedReadNotifications = updatedNotifications.filter(
        (n) => n.isRead,
      );
      const updatedUnreadNotifications = updatedNotifications.filter(
        (n) => !n.isRead,
      );
      return {
        ...state,
        notifications: updatedNotifications,
        readNotifications: updatedReadNotifications,
        unreadNotifications: updatedUnreadNotifications,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}
