import { User } from "@/lib/auth-context";
import { setSessionCookie } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, confirmPassword, firstname, lastname } = body;

    if (!email || !password || !confirmPassword || !firstname || !lastname) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    const data = (await backendResponse.json()) as {
      token: string;
      user: User;
    };
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
  } catch {
    return NextResponse.json({ error: "Registration failed. Please check your backend connection." }, { status: 500 });
  }
}
