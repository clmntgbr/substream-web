"use client";

import { apiClient } from "@/lib/api-client";
import * as React from "react";
import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { toast } from "sonner";
import { initialState, notificationReducer } from "./reducer";
import { Notification, NotificationState } from "./types";

export interface NotificationSearchParams {
  page?: number;
  itemsPerPage?: number;
}

export interface NotificationContextType {
  state: NotificationState;
  searchNotifications: (params?: NotificationSearchParams) => Promise<void>;
  markReadNotification: (id: string) => Promise<void>;
  clearError: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const searchNotifications = useCallback(async (params?: NotificationSearchParams) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", params.page.toString());
      if (params?.itemsPerPage) searchParams.set("limit", params.itemsPerPage.toString());

      const response = await apiClient.get(`/api/search/notifications?${searchParams.toString()}`);

      if (response) {
        dispatch({ type: "SEARCH_NOTIFICATIONS", payload: response as unknown as Notification[] });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch notifications";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      toast.error(errorMessage);
    }
  }, []);

  const markReadNotification = useCallback(async (id: string) => {
    try {
      await apiClient.put(`/notifications/${id}/read`, { isRead: true });
      dispatch({ type: "MARK_READ_NOTIFICATION", payload: id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to mark notification as read";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      toast.error(errorMessage);
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: null });
  }, []);

  // Auto-fetch notifications on mount
  useEffect(() => {
    searchNotifications();
  }, [searchNotifications]);

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      searchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [searchNotifications]);

  const value: NotificationContextType = {
    state,
    searchNotifications,
    markReadNotification,
    clearError,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
