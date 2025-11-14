import { NextResponse } from "next/server";
import { setSessionCookie } from "../../../../lib/session";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const backendResponse = await fetch(`${BACKEND_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      return NextResponse.json({ success: false }, { status: backendResponse.status });
    }

    const { user, token } = await backendResponse.json();

    if (!token || !user) {
      return NextResponse.json({ success: false }, { status: 500 });
    }

    const { id, email, firstname, lastname, picture, roles } = user;
    const response = NextResponse.json({ user: { id, email, firstname, lastname, picture, roles } });

    setSessionCookie(response, token);
    return response;
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
