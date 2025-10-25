import { AuthenticatedRequest, authMiddleware } from "@/lib/middleware";
import { Stream } from "@/lib/stream";
import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

async function uploadVideoHandler(req: AuthenticatedRequest) {
  try {
    const sessionToken = req.sessionToken;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    // The formData now includes the thumbnail if provided from the frontend
    const backendResponse = await fetch(`${BACKEND_API_URL}/streams/video`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
      body: formData,
    });

    if (!backendResponse.ok) {
      const errorData = (await backendResponse.json().catch(() => ({}))) as {
        error?: string;
      };
      return NextResponse.json({ error: errorData.error || "Failed to upload video" }, { status: backendResponse.status });
    }

    const data = (await backendResponse.json()) as Stream;

    const streamData = data;

    return NextResponse.json({
      stream: streamData,
    });
  } catch {
    return NextResponse.json({ error: "Failed to upload video" }, { status: 500 });
  }
}

export const POST = authMiddleware(uploadVideoHandler);
