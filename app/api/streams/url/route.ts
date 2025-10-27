import { AuthenticatedRequest, authMiddleware } from "@/lib/middleware";
import { Stream } from "@/lib/stream";
import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

async function uploadUrlHandler(req: AuthenticatedRequest) {
  try {
    const sessionToken = req.sessionToken;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // The body now includes the thumbnail if provided from the frontend
    const backendResponse = await fetch(`${BACKEND_API_URL}/streams/url`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const errorData = (await backendResponse.json().catch(() => ({}))) as {
        error?: string;
      };
      return NextResponse.json(
        { error: errorData.error || "Failed to create stream from URL" },
        { status: backendResponse.status },
      );
    }

    const data = (await backendResponse.json()) as Stream;

    return NextResponse.json({
      stream: data,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create stream from URL" },
      { status: 500 },
    );
  }
}

export const POST = authMiddleware(uploadUrlHandler);
