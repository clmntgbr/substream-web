import { User } from "@/lib/auth-context";
import { setSessionCookie } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, confirmPassword, firstname, lastname } = body;

    if (!email || !password || !confirmPassword || !firstname || !lastname) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Call the external backend API to register
    const backendResponse = await fetch(`${BACKEND_API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/ld+json",
      },
      body: JSON.stringify({
        email,
        password,
        confirmPassword,
        firstname,
        lastname,
      }),
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

    const data = (await backendResponse.json()) as {
      token: string;
      user: User;
    };
    const { token, user } = data;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "No token received from backend",
          message: "No token received from backend",
        },
        { status: 500 }
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
        error: "Registration failed. Please check your backend connection.",
        message: "Registration failed. Please check your backend connection.",
      },
      { status: 500 }
    );
  }
}
