import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const maxDuration = 3600;

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session_token")?.value;

    if (!sessionToken) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const contentType = request.headers.get("content-type");

    const headers: HeadersInit = {
      Authorization: `Bearer ${sessionToken}`,
    };

    if (contentType) {
      headers["Content-Type"] = contentType;
    }

    const response = await fetch(`${BACKEND_API_URL}/streams/video`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
      body: await request.formData(),
    });

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
