import { AuthenticatedRequest, authMiddleware } from "@/lib/middleware";
import { NextResponse } from "next/server";

async function handler(req: AuthenticatedRequest) {
  try {
    const user = req.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.userId || user.sub,
        email: user.email || user.username,
        roles: user.roles || [],
        ...user,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to get profile" },
      { status: 500 },
    );
  }
}

export const GET = authMiddleware(handler);
