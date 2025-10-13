import { AuthenticatedRequest, authMiddleware } from "@/lib/middleware";
import { Option } from "@/lib/option";
import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

async function createOptionHandler(req: AuthenticatedRequest) {
  try {
    const sessionToken = req.sessionToken;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const backendResponse = await fetch(`${BACKEND_API_URL}/options`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/ld+json",
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const errorData = (await backendResponse.json().catch(() => ({}))) as { error?: string };
      return NextResponse.json({ error: errorData.error || "Failed to create option" }, { status: backendResponse.status });
    }

    const data = (await backendResponse.json()) as Option;

    const optionData = data;

    return NextResponse.json({
      option: optionData,
    });
  } catch {
    return NextResponse.json({ error: "Failed to create option" }, { status: 500 });
  }
}

export const POST = authMiddleware(createOptionHandler);
