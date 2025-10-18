import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET() {
  try {
    const backendResponse = await fetch(
      `${BACKEND_API_URL}/oauth/linkedin/connect`,
      {
        method: "GET",
      },
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    const data = await backendResponse.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to get authorization URL" },
      { status: 500 },
    );
  }
}
