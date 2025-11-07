import { AuthenticatedRequest, authMiddleware } from "@/lib/middleware";
import { Stream } from "@/lib/stream";
import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

async function uploadUrlHandler(req: AuthenticatedRequest) {
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

    return NextResponse.json({
      stream: data,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create stream from URL",
        message: "Failed to create stream from URL",
      },
      { status: 500 }
    );
  }
}

export const POST = authMiddleware(uploadUrlHandler);
