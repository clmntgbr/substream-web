import { AuthenticatedRequest, authMiddleware } from "@/lib/middleware";
import { Subscription } from "@/lib/subscription/types";
import { NextResponse } from "next/server";
import { HydraResponse } from "../types/hydra";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

async function getSubscriptionsHandler(req: AuthenticatedRequest) {
  try {
    const sessionToken = req.sessionToken;

    if (!sessionToken) {
      return NextResponse.json(
        {
          success: false,
          key: "error.auth.token_missing",
        },
        { status: 401 }
      );
    }

    const backendResponse = await fetch(`${BACKEND_API_URL}/subscriptions`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!backendResponse.ok) {
      const payload = (await backendResponse.json().catch(() => ({}))) as {
        key?: string;
        params?: Record<string, unknown>;
      };
      return NextResponse.json(
        {
          success: false,
          key: payload.key,
          params: payload.params,
        },
        { status: backendResponse.status }
      );
    }

    const data = (await backendResponse.json()) as HydraResponse<Subscription>;

    return NextResponse.json({
      subscriptions: data.member || [],
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        key: "error.server.internal",
      },
      { status: 500 }
    );
  }
}

export const GET = authMiddleware(getSubscriptionsHandler);
