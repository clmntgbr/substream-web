import { AuthenticatedRequest, authMiddleware } from "@/lib/middleware";
import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://localhost/api";

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
        "Content-Type": "application/json",
      },
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json({ error: errorData.error || "Failed to fetch streams" }, { status: backendResponse.status });
    }

    const data = await backendResponse.json();

    const streams = data.member || data.streams || data;

    return NextResponse.json({
      streams: streams,
      totalItems: data.totalItems,
    });
  } catch (error) {
    console.error("Get streams error:", error);
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json({ error: errorData.error || "Failed to create stream" }, { status: backendResponse.status });
    }

    const data = await backendResponse.json();

    const streamData = data.stream || data;
    delete streamData["@context"];
    delete streamData["@id"];
    delete streamData["@type"];

    return NextResponse.json({
      stream: streamData,
    });
  } catch (error) {
    console.error("Create stream error:", error);
    return NextResponse.json({ error: "Failed to create stream" }, { status: 500 });
  }
}

export const GET = authMiddleware(getStreamsHandler);
export const POST = authMiddleware(createStreamHandler);
