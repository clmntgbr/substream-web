import { AuthenticatedRequest, authMiddleware } from "@/lib/middleware";
import { NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://localhost/api";

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
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "Failed to create option" },
        { status: backendResponse.status },
      );
    }

    const data = await backendResponse.json();

    const optionData = data.option || data;
    delete optionData["@context"];
    delete optionData["@id"];
    delete optionData["@type"];

    return NextResponse.json({
      option: optionData,
    });
  } catch (error) {
    console.error("Create option error:", error);
    return NextResponse.json(
      { error: "Failed to create option" },
      { status: 500 },
    );
  }
}

export const POST = authMiddleware(createOptionHandler);
