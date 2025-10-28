"use client";

import { useStreams } from "@/lib/stream";
import { use, useEffect } from "react";

export default function StreamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getStream, state } = useStreams();

  useEffect(() => {
    getStream(id);
  }, [getStream, id]);
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
