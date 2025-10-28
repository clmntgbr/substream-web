import { AuthenticatedRequest, authMiddleware } from "@/lib/middleware";
import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

async function markNotificationAsReadHandler(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionToken = req.sessionToken;
    const { id } = await params;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "Missing notification ID" }, { status: 400 });
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
      const errorData = (await backendResponse.json().catch(() => ({}))) as {
        error?: string;
      };
      return NextResponse.json({ error: errorData.error || "Failed to mark notification as read" }, { status: backendResponse.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to mark notification as read" }, { status: 500 });
  }
}

export async function PATCH(req: AuthenticatedRequest, context: { params: Promise<{ id: string }> }) {
  return authMiddleware((authenticatedReq) => markNotificationAsReadHandler(authenticatedReq, context))(req);
}
