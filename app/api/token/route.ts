import { setSessionCookie } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://localhost/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Call the external backend API to authenticate
    const backendResponse = await fetch(`${BACKEND_API_URL}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json({ error: errorData.error || "Invalid credentials" }, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    const { token, user } = data;

    if (!token) {
      return NextResponse.json({ error: "No token received from backend" }, { status: 500 });
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
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed. Please check your backend connection." }, { status: 500 });
  }
}
