import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const maxDuration = 600;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const backendToken = request.cookies.get("session_token")?.value;

    if (!backendToken) {
      return NextResponse.json(
        {
          success: false,
          key: "error.auth.token_missing",
        },
        { status: 401 },
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 minutes timeout

    const response = await fetch(
      `${BACKEND_API_URL}/streams/${id}/download/subtitle`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${backendToken}`,
        },
        signal: controller.signal,
      },
    ).finally(() => clearTimeout(timeoutId));

    if (!response.ok) {
      const errorText = await response.text();

      try {
        const error = JSON.parse(errorText) as {
          key?: string;
          params?: Record<string, unknown>;
        };
        return NextResponse.json(
          {
            success: false,
            key: typeof error.key === "string" ? error.key : "error.server.internal",
            params:
              error.params && typeof error.params === "object"
                ? (error.params as Record<string, unknown>)
                : undefined,
          },
          { status: response.status },
        );
      } catch {
        return NextResponse.json(
          {
            success: false,
            key: "error.server.internal",
          },
          { status: response.status },
        );
      }
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get("Content-Disposition");
    const contentType =
      response.headers.get("Content-Type") || "application/octet-stream";

    const downloadResponse = new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition":
          contentDisposition || `attachment; filename="subtitle-${id}.srt"`,
      },
    });

    return downloadResponse;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return NextResponse.json(
          {
            success: false,
            key: "error.stream.not_downloadable",
          },
          { status: 504 },
        );
      }
      return NextResponse.json(
        {
          success: false,
          key: "error.server.internal",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        key: "error.server.internal",
      },
      { status: 500 },
    );
  }
}
