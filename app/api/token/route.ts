import { User } from "@/lib/auth-context";
import { setSessionCookie } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          key: "error.validation.failed",
        },
        { status: 400 },
      );
    }

    // Call the external backend API to authenticate
    const backendResponse = await fetch(`${BACKEND_API_URL}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/ld+json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!backendResponse.ok) {
      const payload = (await backendResponse.json().catch(() => ({}))) as {
        key?: string;
        params?: Record<string, unknown>;
      };
      return NextResponse.json(
        {
          success: false,
          key: payload.key,
          params: payload.params,
        },
        { status: backendResponse.status },
      );
    }

    const data = (await backendResponse.json()) as {
      token: string;
      user: User;
    };
    const { token, user } = data;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          key: "error.server.internal",
        },
        { status: 500 },
      );
    }

    // Create response with user data
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        roles: user.roles || [],
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

    // Set the session cookie
    setSessionCookie(response, token);

    return response;
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
