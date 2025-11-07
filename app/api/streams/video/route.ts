import { AuthenticatedRequest, authMiddleware } from "@/lib/middleware";
import { Stream } from "@/lib/stream";
import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

async function uploadVideoHandler(req: AuthenticatedRequest) {
  try {
    const sessionToken = req.sessionToken;

    if (!sessionToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "Unauthorized",
          key: "error.auth.token_missing",
        },
        { status: 401 }
      );
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

    if (false === backendResponse.ok) {
      const message = (await backendResponse.json().catch(() => ({}))) as {
        key?: string;
        params?: Record<string, unknown>;
      };
      return NextResponse.json(
        {
          success: false,
          key: message.key,
          params: message.params,
        },
        { status: backendResponse.status }
      );
    }

    const data = (await backendResponse.json()) as Stream;

    const streamData = data;

    return NextResponse.json({
      stream: streamData,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload video",
        message: "Failed to upload video",
      },
      { status: 500 }
    );
  }
}

export const POST = authMiddleware(uploadVideoHandler);
