import { pick } from "lodash";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session_token")?.value;

    if (!sessionToken) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    const response = await fetch(`${BACKEND_API_URL}/streams?${queryString}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: response.status });
    }

    const nextResponse = await response.json();
    const streams = pick(nextResponse, [
      "member",
      "totalItems",
      "currentPage",
      "itemsPerPage",
      "totalPages",
      "view",
    ]);

    return NextResponse.json(streams);
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
