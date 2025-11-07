import { AuthenticatedRequest, authMiddleware } from "@/lib/middleware";
import { NextResponse } from "next/server";

async function handler(req: AuthenticatedRequest) {
  try {
    const user = req.user;

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          key: "error.auth.token_missing",
        },
        { status: 401 },
      );
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
      {
        success: false,
        key: "error.server.internal",
      },
      { status: 500 },
    );
  }
}

export const GET = authMiddleware(handler);
