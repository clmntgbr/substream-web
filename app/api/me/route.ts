import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session_token")?.value;

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

    const backendResponse = await fetch(`${BACKEND_API_URL}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
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

    const user = await backendResponse.json();

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user data",
        message: "Failed to fetch user data",
      },
      { status: 500 }
    );
  }
}
