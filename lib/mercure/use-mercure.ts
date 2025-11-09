"use client";

import { useEffect, useRef, useState } from "react";
import { MercureOptions } from "./types";

export function useMercure({ topics, onMessage, onError, onOpen, enabled = true }: MercureOptions) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000;

  const connect = () => {
    if (!enabled || topics.length === 0) {
      return;
    }

    if (eventSourceRef.current?.readyState === EventSource.OPEN) {
      return;
    }

    const mercureUrl = process.env.NEXT_PUBLIC_MERCURE_URL;
    if (!mercureUrl) {
      return;
    }

    try {
      const url = new URL(mercureUrl);
      topics.forEach((topic) => {
        url.searchParams.append("topic", topic);
      });

      const eventSource = new EventSource(url.toString(), {
        withCredentials: true,
      });

      eventSource.onopen = () => {
        setIsConnected(true);
        setIsReconnecting(false);
        reconnectAttemptsRef.current = 0;
        onOpen?.();
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {}
      };

      eventSource.onerror = (error) => {
        setIsConnected(false);
        onError?.(error);

        eventSource.close();
        eventSourceRef.current = null;

        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          setIsReconnecting(true);
          const delay = baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current);

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, delay);
        } else {
          setIsReconnecting(false);
        }
      };

      eventSourceRef.current = eventSource;
    } catch (error) {}
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
      setIsReconnecting(false);
      reconnectAttemptsRef.current = 0;
    }
  };

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topics.join(","), enabled]);

  return {
    isConnected,
    isReconnecting,
    disconnect,
    reconnect: () => {
      disconnect();
      reconnectAttemptsRef.current = 0;
      connect();
    },
  };
}
