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

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const sortBy = searchParams.get("sortBy") || "";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";

    const queryParams = new URLSearchParams({ page });

    if (sortBy) {
      queryParams.append(`order[${sortBy}]`, sortOrder);
    }

    queryParams.append("search[status]", status || "!deleted");

    if (search) {
      queryParams.append("search[originalFileName]", search);
    }

    const backendResponse = await fetch(
      `${BACKEND_API_URL}/streams?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          "Content-Type": "application/ld+json",
        },
      },
    );

    if (!backendResponse.ok) {
      const errorData = (await backendResponse.json().catch(() => ({}))) as {
        error?: string;
      };
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch streams" },
        { status: backendResponse.status },
      );
    }

    const data = (await backendResponse.json()) as HydraResponse<Stream>;

    let calculatedPageCount = 1;

    if (data.view?.last) {
      const lastPageMatch = data.view.last.match(/page=(\d+)/);
      if (lastPageMatch) {
        calculatedPageCount = parseInt(lastPageMatch[1]);
      }
    } else if (data.totalItems > 0) {
      const defaultPageSize = 20;
      calculatedPageCount = Math.ceil(data.totalItems / defaultPageSize);
    }

    return NextResponse.json({
      streams: data.member,
      totalItems: data.totalItems,
      page: parseInt(page),
      pageCount: calculatedPageCount,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch streams" },
      { status: 500 },
    );
  }
}

export const GET = authMiddleware(getStreamsHandler);
