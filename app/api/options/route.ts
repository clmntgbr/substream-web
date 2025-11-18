import { pick } from "lodash";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session_token")?.value;

    if (!sessionToken) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const body = await request.json();

    const response = await fetch(`${BACKEND_API_URL}/options`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: response.status });
    }

    const nextResponse = await response.json();
    const option = pick(nextResponse, ["id"]);

    return NextResponse.json(option);
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
