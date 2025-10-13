import { NextResponse } from "next/server";
import { authMiddleware, AuthenticatedRequest } from "@/lib/middleware";

async function handler(req: AuthenticatedRequest) {
  try {
    const user = req.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return the user data from the JWT token
    return NextResponse.json({
      user: {
        id: user.userId || user.sub,
        email: user.email || user.username,
        roles: user.roles || [],
        ...user,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get profile" },
      { status: 500 },
    );
  }
}

export const GET = authMiddleware(handler);
