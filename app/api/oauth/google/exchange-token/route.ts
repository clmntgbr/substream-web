import { setSessionCookie } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, state } = body;

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          key: "error.validation.failed",
        },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(`${BACKEND_API_URL}/oauth/google/exchange-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        state,
      }),
    });

    if (!backendResponse.ok) {
      const payload = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          key: typeof payload.key === "string" ? payload.key : "error.server.internal",
          params:
            payload.params && typeof payload.params === "object"
              ? (payload.params as Record<string, unknown>)
              : undefined,
        },
        { status: backendResponse.status }
      );
    }

    const response = (await backendResponse.json()) as {
      token: string;
      user: {
        id: string;
        email: string;
        firstname: string;
        lastname: string;
        roles: string[];
        picture?: string;
        createdAt: string;
        updatedAt: string;
      };
    };

    if (!response.token) {
      return NextResponse.json(
        {
          success: false,
          key: "error.server.internal",
        },
        { status: 500 }
      );
    }

    const { token, user } = response;

    const meResponse = await fetch(`${BACKEND_API_URL}/api/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    let completeUser = user;
    if (meResponse.ok) {
      const meData = await meResponse.json();
      completeUser = meData;
    }

    const userResponse = NextResponse.json({
      user: {
        id: completeUser.id,
        email: completeUser.email,
        username: completeUser.email?.split("@")[0] || "google_user",
        firstname: completeUser.firstname,
        lastname: completeUser.lastname,
        roles: completeUser.roles,
        picture: completeUser.picture,
      },
    });

    setSessionCookie(userResponse, token);

    return userResponse;
  } catch {
    return NextResponse.json(
      {
        success: false,
        key: "error.server.internal",
      },
      { status: 500 }
    );
  }
}
