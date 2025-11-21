import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session_token")?.value;

    if (!sessionToken) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const { planId } = await request.json();

    const response = await fetch(`${BACKEND_API_URL}/subscription/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({ planId }),
    });

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: response.status });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
