import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const backendResponse = await fetch(`${BACKEND_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      return NextResponse.json({ success: false }, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
