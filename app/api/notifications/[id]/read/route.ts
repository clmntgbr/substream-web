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
          error: "Unauthorized",
          message: "Unauthorized",
          key: "error.auth.token_missing",
        },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing notification ID",
          message: "Missing notification ID",
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to mark notification as read",
        message: "Failed to mark notification as read",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: AuthenticatedRequest, context: { params: Promise<{ id: string }> }) {
  return authMiddleware((authenticatedReq) => markNotificationAsReadHandler(authenticatedReq, context))(req);
}
