/**
 * Initiate Google OAuth flow
 * Calls backend to get authorization URL and state,
 * stores state in localStorage, and redirects to Google
 */
export async function initiateGoogleOAuth() {
  try {
    // Call backend to get authorization URL and state
    const response = await fetch("/api/oauth/google/connect", {
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

    // Redirect to Google authorization page
    window.location.href = result.data.url;
  } catch (error) {
    console.error("Error initiating Google OAuth:", error);
    throw error;
  }
}
