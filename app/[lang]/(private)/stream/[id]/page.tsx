"use client";

import Status from "@/components/Status";
import { useAuth } from "@/lib/auth-context";
import { useMercure } from "@/lib/mercure";
import { useStreams } from "@/lib/stream";
import { use, useCallback, useEffect, useMemo } from "react";

export default function StreamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getStream, state } = useStreams();
  const { user } = useAuth();

  const topics = useMemo(() => {
    if (user?.id && id) return [`/users/${user.id}/streams/${id}`];
    return [];
  }, [id, user?.id]);

  const handleMessage = useCallback(() => {
    if (id) {
      void getStream(id);
    }
  }, [getStream, id]);

  useEffect(() => {
    getStream(id);
  }, [getStream, id]);

  useMercure({ topics, onMessage: handleMessage, enabled: topics.length > 0 });

  if (!state.currentStream) {
    return <></>;
  }

  return (
    <div>
      <div>
        StreamPage {id} {state.currentStream?.originalFileName}
      </div>

      <Status stream={state.currentStream} />
    </div>
  );
}
