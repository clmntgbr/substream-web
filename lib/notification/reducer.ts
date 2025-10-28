import { NotificationAction, NotificationState } from "./types";

// Initial state
export const initialState: NotificationState = {
  notifications: [],
  isLoading: false,
  error: null,
};

// Reducer function
export function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case "SEARCH_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload,
        error: null,
      };
    case "MARK_READ_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload ? { ...notification, isRead: true } : notification
        ),
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
