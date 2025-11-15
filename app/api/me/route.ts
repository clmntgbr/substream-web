import { pick } from "lodash";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session_token")?.value;

    if (!sessionToken) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const backendResponse = await fetch(`${BACKEND_API_URL}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!backendResponse.ok) {
      return NextResponse.json({ success: false }, { status: backendResponse.status });
    }

    const response = await backendResponse.json();
    const user = pick(response, ["id", "email", "firstname", "lastname", "picture", "roles"]);

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
