import { AuthenticatedRequest, authMiddleware } from "@/lib/middleware";
import { Stream } from "@/lib/stream";
import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

async function getStreamHandler(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionToken = req.sessionToken;
    const { id } = await params;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const backendResponse = await fetch(`${BACKEND_API_URL}/streams/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/ld+json",
      },
    });

    if (!backendResponse.ok) {
      const errorData = (await backendResponse.json().catch(() => ({}))) as { error?: string };
      return NextResponse.json({ error: errorData.error || "Failed to fetch stream" }, { status: backendResponse.status });
    }

    const data = (await backendResponse.json()) as Stream;

    const streamData = data;

    return NextResponse.json({
      stream: streamData,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stream" }, { status: 500 });
  }
}

async function updateStreamHandler(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionToken = req.sessionToken;
    const { id } = await params;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const backendResponse = await fetch(`${BACKEND_API_URL}/streams/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/ld+json",
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const errorData = (await backendResponse.json().catch(() => ({}))) as { error?: string };
      return NextResponse.json({ error: errorData.error || "Failed to update stream" }, { status: backendResponse.status });
    }

    const data = (await backendResponse.json()) as Stream;

    const streamData = data;

    return NextResponse.json({
      stream: streamData,
    });
  } catch {
    return NextResponse.json({ error: "Failed to update stream" }, { status: 500 });
  }
}

async function deleteStreamHandler(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionToken = req.sessionToken;
    const { id } = await params;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const backendResponse = await fetch(`${BACKEND_API_URL}/streams/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/ld+json",
      },
    });

    if (!backendResponse.ok) {
      const errorData = (await backendResponse.json().catch(() => ({}))) as { error?: string };
      return NextResponse.json({ error: errorData.error || "Failed to delete stream" }, { status: backendResponse.status });
    }

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json({ error: "Failed to delete stream" }, { status: 500 });
  }
}

export async function GET(req: AuthenticatedRequest, context: { params: Promise<{ id: string }> }) {
  return authMiddleware((authenticatedReq) => getStreamHandler(authenticatedReq, context))(req);
}

export async function PATCH(req: AuthenticatedRequest, context: { params: Promise<{ id: string }> }) {
  return authMiddleware((authenticatedReq) => updateStreamHandler(authenticatedReq, context))(req);
}

export async function DELETE(req: AuthenticatedRequest, context: { params: Promise<{ id: string }> }) {
  return authMiddleware((authenticatedReq) => deleteStreamHandler(authenticatedReq, context))(req);
}
