import { NextRequest, NextResponse } from "next/server";
import { getSessionData } from "./session";
import { JWTPayload } from "./jwt";

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
  sessionToken?: string;
}

export function authMiddleware(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
) {
  return async (req: AuthenticatedRequest) => {
    const sessionData = getSessionData(req);

    if (!sessionData) {
      return NextResponse.json(
        { error: "Unauthorized - No valid session" },
        { status: 401 },
      );
    }

    req.user = sessionData.user;
    req.sessionToken = sessionData.token;

    return handler(req);
  };
}
