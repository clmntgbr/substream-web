import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET() {
  try {
    // Call the external backend API to get Google authorization URL and state
    // No authorization token needed for this public endpoint
    const backendResponse = await fetch(
      `${BACKEND_API_URL}/oauth/google/connect`,
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
