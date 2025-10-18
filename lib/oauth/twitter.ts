/**
 * Initiate Twitter OAuth flow
 * Calls backend to get authorization URL, code_verifier and state,
 * stores them in localStorage, and redirects to Twitter
 */
export async function initiateTwitterOAuth() {
  try {
    // Call backend to get authorization URL and code_verifier
    const response = await fetch("/api/oauth/twitter/connect", {
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
        code_verifier: string;
        state?: string;
      };
      message: string;
    };

    if (!result.success || !result.data.url || !result.data.code_verifier) {
      throw new Error("Invalid response from backend");
    }

    // Store code_verifier in localStorage for later use
    localStorage.setItem(
      "twitter_oauth_code_verifier",
      result.data.code_verifier,
    );

    // Store state if provided
    if (result.data.state) {
      localStorage.setItem("twitter_oauth_state", result.data.state);
    }

    // Redirect to Twitter authorization page
    window.location.href = result.data.url;
  } catch (error) {
    console.error("Error initiating Twitter OAuth:", error);
    throw error;
  }
}
