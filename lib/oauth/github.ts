export async function initiateGitHubOAuth() {
  try {
    const response = await fetch("/api/oauth/github/connect", {
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
      };
      message: string;
    };

    if (!result.success || !result.data.url || !result.data.code_verifier) {
      throw new Error("Invalid response from backend");
    }

    localStorage.setItem(
      "github_oauth_code_verifier",
      result.data.code_verifier,
    );

    window.location.href = result.data.url;
  } catch (error) {
    console.log("Error initiating GitHub OAuth:", error);
    throw error;
  }
}
