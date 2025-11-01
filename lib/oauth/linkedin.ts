export async function initiateLinkedInOAuth() {
  try {
    const response = await fetch("/api/oauth/linkedin/connect", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to initiate OAuth flow");
    }

    const result = (await response.json()) as {
      success: boolean;
      data: {
        url: string;
      };
      message: string;
    };

    if (!result.success || !result.data.url) {
      throw new Error("Invalid response from backend");
    }

    window.location.href = result.data.url;
  } catch (error) {
    console.log("Error initiating LinkedIn OAuth:", error);
    throw error;
  }
}
