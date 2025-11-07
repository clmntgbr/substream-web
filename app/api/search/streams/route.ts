import { AuthenticatedRequest, authMiddleware } from "@/lib/middleware";
import { Stream } from "@/lib/stream";
import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface BackendApiResponse {
  total_items: number;
  items_per_page: number;
  current_page: number;
  total_pages: number;
  results: Stream[];
  next_page: number | null;
  aggregations: unknown[];
}

async function searchStreamsHandler(req: AuthenticatedRequest) {
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

    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();

    const backendResponse = await fetch(`${BACKEND_API_URL}/search/streams?${queryString}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/ld+json",
      },
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

    const data = (await backendResponse.json()) as BackendApiResponse;

    return NextResponse.json({
      streams: data.results || [],
      totalItems: data.total_items || 0,
      page: data.current_page || 1,
      pageCount: data.total_pages || 1,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search streams",
        message: "Failed to search streams",
      },
      { status: 500 }
    );
  }
}

export const GET = authMiddleware(searchStreamsHandler);
