"use client";

import { Spinner } from "@/components/ui/spinner";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function TwitterOAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const lang = (params.lang as string) || "en";
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasExchangedToken = useRef(false);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Prevent multiple calls
      if (hasExchangedToken.current) {
        return;
      }
      hasExchangedToken.current = true;
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      if (!code) {
        setError("Missing authorization code");
        return;
      }

      // Retrieve code_verifier and state from localStorage
      const codeVerifier = localStorage.getItem("twitter_oauth_code_verifier");
      const storedState = localStorage.getItem("twitter_oauth_state");

      if (!codeVerifier) {
        setError("Missing code verifier");
        return;
      }

      try {
        const exchangeData = {
          code,
          code_verifier: codeVerifier,
          state: state || storedState,
        };

        const response = await fetch("/api/oauth/twitter/exchange-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(exchangeData),
        });

        if (!response.ok) {
          const errorData = await response.json();

          // Only redirect to login if it's a 400 error (invalid_grant, etc.)
          if (response.status === 400) {
            setError(
              errorData.message || errorData.error || "Authentication failed",
            );
            return;
          }

          // For other errors, show generic error
          setError("Failed to exchange token");
          return;
        }

        // Clean up stored values
        localStorage.removeItem("twitter_oauth_code_verifier");
        localStorage.removeItem("twitter_oauth_state");

        // Add a small delay to ensure everything is synchronized
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Redirect to home page directly (refreshUser will be called by the home page)
        router.replace(`/${lang}`);
      } catch (err) {
        setError("An error occurred during authentication");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuthCallback();
  }, [searchParams, router, lang]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
        <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Authentication Failed
          </h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => router.push(`/${lang}/login`)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Show loading screen while processing
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
        <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg text-center">
          <Spinner className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Authenticating...
          </h1>
          <p className="text-muted-foreground">
            Please wait while we complete your authentication
          </p>
        </div>
      </div>
    );
  }

  return null;
}
