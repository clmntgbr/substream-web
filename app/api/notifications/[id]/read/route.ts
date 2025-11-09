import { AuthenticatedRequest, authMiddleware } from "@/lib/middleware";
import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

async function markNotificationAsReadHandler(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionToken = req.sessionToken;
    const { id } = await params;

    if (!sessionToken) {
      return NextResponse.json(
        {
          success: false,
          key: "error.auth.token_missing",
        },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          key: "error.validation.failed",
        },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(`${BACKEND_API_URL}/notifications/${id}/read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/merge-patch+json",
      },
      body: JSON.stringify({ isRead: true }),
    });

    if (!backendResponse.ok) {
      const payload = (await backendResponse.json().catch(() => ({}))) as {
        key?: string;
        params?: Record<string, unknown>;
      };
      return NextResponse.json(
        {
          success: false,
          key: payload.key,
          params: payload.params,
        },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        key: "error.server.internal",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: AuthenticatedRequest, context: { params: Promise<{ id: string }> }) {
  return authMiddleware((authenticatedReq) => markNotificationAsReadHandler(authenticatedReq, context))(req);
}
