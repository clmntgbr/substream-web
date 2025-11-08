import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET() {
  try {
    const backendResponse = await fetch(
      `${BACKEND_API_URL}/oauth/google/connect`,
      {
        method: "GET",
      },
    );

    if (!backendResponse.ok) {
      const payload = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          key:
            typeof payload.key === "string"
              ? payload.key
              : "error.server.internal",
          params:
            payload.params && typeof payload.params === "object"
              ? (payload.params as Record<string, unknown>)
              : undefined,
        },
        { status: backendResponse.status },
      );
    }

    const data = await backendResponse.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        success: false,
        key: "error.server.internal",
      },
      { status: 500 },
    );
  }
}
