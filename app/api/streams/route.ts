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

export const GET = authMiddleware(getStreamsHandler);
