import { AuthenticatedRequest, authMiddleware } from "@/lib/middleware";
import { NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://localhost/api";

async function uploadVideoHandler(req: AuthenticatedRequest) {
  try {
    const sessionToken = req.sessionToken;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    // Forward the FormData to the backend with the authorization header
    const backendResponse = await fetch(`${BACKEND_API_URL}/streams/video`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
      body: formData,
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "Failed to upload video" },
        { status: backendResponse.status },
      );
    }

    const data = await backendResponse.json();

    const streamData = data.stream || data;
    delete streamData["@context"];
    delete streamData["@id"];
    delete streamData["@type"];

    return NextResponse.json({
      stream: streamData,
    });
  } catch (error) {
    console.error("Upload video error:", error);
    return NextResponse.json(
      { error: "Failed to upload video" },
      { status: 500 },
    );
  }
}

export const POST = authMiddleware(uploadVideoHandler);
