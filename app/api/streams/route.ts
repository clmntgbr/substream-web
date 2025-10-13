import { AuthenticatedRequest, authMiddleware } from "@/lib/middleware";
import { Stream } from "@/lib/stream";
import { NextResponse } from "next/server";
import { HydraResponse } from "../types/hydra";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

async function getStreamsHandler(req: AuthenticatedRequest) {
  try {
    const sessionToken = req.sessionToken;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const backendResponse = await fetch(`${BACKEND_API_URL}/streams?include_deleted=false`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/ld+json",
      },
    });

    if (!backendResponse.ok) {
      const errorData = (await backendResponse.json().catch(() => ({}))) as { error?: string };
      return NextResponse.json({ error: errorData.error || "Failed to fetch streams" }, { status: backendResponse.status });
    }

    const data = (await backendResponse.json()) as HydraResponse<Stream>;

    return NextResponse.json({
      streams: data.member,
      totalItems: data.totalItems,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch streams" }, { status: 500 });
  }
}

async function createStreamHandler(req: AuthenticatedRequest) {
  try {
    const sessionToken = req.sessionToken;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const backendResponse = await fetch(`${BACKEND_API_URL}/streams`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/ld+json",
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const errorData = (await backendResponse.json().catch(() => ({}))) as { error?: string };
      return NextResponse.json({ error: errorData.error || "Failed to create stream" }, { status: backendResponse.status });
    }

    const data = (await backendResponse.json()) as HydraResponse<Stream>;

    return NextResponse.json({
      stream: data.member,
      totalItems: data.totalItems,
    });
  } catch {
    return NextResponse.json({ error: "Failed to create stream" }, { status: 500 });
  }
}

export const GET = authMiddleware(getStreamsHandler);
export const POST = authMiddleware(createStreamHandler);
