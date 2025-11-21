"use client";
import { useAuth } from "@/lib/auth/context";
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { usePlans } from "../plan/context";
import { useSubscriptions } from "../subscription/context";
import { useUser } from "../user/context";

type EventType = string;
type EventCallback = (data: any) => void;

interface MercureContextType {
  on: (eventType: EventType, callback: EventCallback) => () => void;
  off: (eventType: EventType, callback: EventCallback) => void;
  emit: (eventType: EventType, data: any) => void;
}

const MercureContext = createContext<MercureContextType | null>(null);

interface MercureProviderProps {
  children: ReactNode;
}

export function MercureProvider({ children }: MercureProviderProps) {
  const { user } = useAuth();
  const [topic, setTopic] = useState<string | null>(null);
  const { useFetchMe } = useUser();
  const { useGetPlan } = usePlans();
  const { useGetSubscription } = useSubscriptions();
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const listenersRef = useRef<Map<EventType, Set<EventCallback>>>(new Map());

  const emit = (eventType: EventType, data: any) => {
    const listeners = listenersRef.current.get(eventType);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error("error in listener for", eventType, error);
        }
      });
    }
  };

  const on = (eventType: EventType, callback: EventCallback) => {
    if (!listenersRef.current.has(eventType)) {
      listenersRef.current.set(eventType, new Set());
    }
    listenersRef.current.get(eventType)!.add(callback);
    return () => off(eventType, callback);
  };

  const off = (eventType: EventType, callback: EventCallback) => {
    const listeners = listenersRef.current.get(eventType);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        listenersRef.current.delete(eventType);
      }
    }
  };

  const handleUserRefresh = () => {
    useFetchMe();
  };

  const handlePlanRefresh = () => {
    useGetPlan();
  };

  const handleSubscriptionRefresh = () => {
    useGetSubscription();
  };

  useEffect(() => {
    if (user?.id) {
      setTopic(`/users/${user.id}`);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!topic) {
      return;
    }

    const connect = () => {
      const mercureUrl = process.env.NEXT_PUBLIC_MERCURE_URL;
      if (!mercureUrl) {
        return;
      }

      try {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }

        const url = new URL(mercureUrl);
        url.searchParams.append("topic", topic);

        const eventSource = new EventSource(url.toString(), {
          withCredentials: true,
        });

        eventSource.onopen = () => {
          reconnectAttemptsRef.current = 0;
        };

        eventSource.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            if (message.type) {
              switch (message.type) {
                case "user.refresh":
                  handleUserRefresh();
                  break;
                case "plan.refresh":
                  handlePlanRefresh();
                  break;
                case "subscription.refresh":
                  handleSubscriptionRefresh();
                  break;
                default:
                  console.warn("unknown message type received:", message.type);
                  break;
              }

              emit(message.type, message.data);
            } else {
              console.warn("message without type received:", message);
            }
          } catch (error) {}
        };

        eventSource.onerror = () => {
          eventSource.close();
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        };

        eventSourceRef.current = eventSource;
      } catch (error) {}
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [topic]);

  return <MercureContext.Provider value={{ on, off, emit }}>{children}</MercureContext.Provider>;
}

export function useMercure() {
  const context = useContext(MercureContext);
  if (!context) {
    throw new Error("useMercure must be used within a MercureProvider");
  }
  return context;
}
