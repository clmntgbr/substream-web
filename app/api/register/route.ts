import { NextRequest, NextResponse } from "next/server";

// This endpoint would call an external API to register a user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstname, lastname } = body;

    if (!email || !password || !firstname || !lastname) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // TODO: Call your external API to register a user
    // const apiResponse = await fetch('YOUR_EXTERNAL_API/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password, firstname, lastname }),
    // });

    // if (!apiResponse.ok) {
    //   const error = await apiResponse.json();
    //   return NextResponse.json(error, { status: apiResponse.status });
    // }

    return NextResponse.json(
      {
        error:
          "Registration not yet configured. Please configure your external API endpoint.",
      },
      { status: 501 },
    );
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
