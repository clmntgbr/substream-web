"use client";

import { useAuth } from "@/lib/auth-context";
import { useMercure } from "@/lib/mercure";
import { useStreams } from "@/lib/stream";
import { use, useCallback, useEffect, useMemo } from "react";

export default function StreamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getStream, state } = useStreams();
  const { user } = useAuth();

  const topics = useMemo(() => {
    if (user?.id && id) return [`/users/${user.id}/streams/${id}`];
    return [];
  }, [id, user?.id]);

  const handleMessage = useCallback(() => {
    // When any Mercure event related to this stream arrives, refresh the stream details
    if (id) {
      void getStream(id);
    }
  }, [getStream, id]);

  useEffect(() => {
    getStream(id);
  }, [getStream, id]);

  useMercure({ topics, onMessage: handleMessage, enabled: topics.length > 0 });
  return (
    <div>
      {state.isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          StreamPage {id} {state.currentStream?.originalFileName}
        </div>
      )}
    </div>
  );
}
