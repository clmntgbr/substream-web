import { setSessionCookie } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, code_verifier, state } = body;

    if (!code || !code_verifier) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // Call the external backend API to exchange the code for a token
    // No authorization token needed for this public endpoint
    const backendResponse = await fetch(
      `${BACKEND_API_URL}/oauth/twitter/exchange-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          code_verifier,
          state,
        }),
      },
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    const response = (await backendResponse.json()) as {
      success: boolean;
      data: {
        access_token: string;
        refresh_token?: string;
        expires_in?: number;
        user: {
          id: string | null;
          username: string | null;
          name: string;
          note?: string;
        };
      };
      message: string;
    };

    if (!response.success || !response.data.access_token) {
      return NextResponse.json(
        { error: "No token received from backend" },
        { status: 500 },
      );
    }

    const { access_token, user } = response.data;

    // Create response with user data
    // Map Twitter user data to our User format
    const userResponse = NextResponse.json({
      user: {
        id: user.id || user.username || "unknown",
        email: user.username ? `${user.username}@twitter.com` : undefined,
        username: user.username,
        firstname: user.name || "Twitter User",
        lastname: "",
        roles: ["ROLE_USER"],
      },
    });

    // Set the session cookie with access_token
    setSessionCookie(userResponse, access_token);

    return userResponse;
  } catch {
    return NextResponse.json(
      { error: "Token exchange failed. Please check your backend connection." },
      { status: 500 },
    );
  }
}
