"use client";

import Loading from "@/components/features/auth/oauth/Loading";
import { useTranslations } from "@/lib/use-translations";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function GitHubOAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const lang = (params.lang as string) || "en";
  const [isLoading, setIsLoading] = useState(true);
  const hasExchangedToken = useRef(false);
  const translations = useTranslations();
  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (hasExchangedToken.current) {
        return;
      }
      hasExchangedToken.current = true;
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      if (!code) {
        toast.error(
          translations.auth.oauth.authenticationFailed ||
            "Authentication failed. Please try again.",
        );
        router.push(`/${lang}/login`);
        return;
      }

      const codeVerifier = localStorage.getItem("github_oauth_code_verifier");

      if (!codeVerifier) {
        toast.error(
          translations.auth.oauth.authenticationFailed ||
            "Authentication failed. Please try again.",
        );
        router.push(`/${lang}/login`);
        return;
      }

      try {
        const exchangeData = {
          code,
          state,
          code_verifier: codeVerifier,
        };

        const response = await fetch("/api/oauth/github/exchange-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(exchangeData),
        });

        if (!response.ok) {
          toast.error(
            translations.auth.oauth.authenticationFailed ||
              "Authentication failed. Please try again.",
          );
          router.push(`/${lang}/login`);
          return;
        }

        await response.json();

        localStorage.removeItem("github_oauth_code_verifier");

        await new Promise((resolve) => setTimeout(resolve, 1000));

        router.push(`/${lang}`);
      } catch {
        toast.error(
          translations.auth.oauth.authenticationFailed ||
            "Authentication failed. Please try again.",
        );
        router.push(`/${lang}/login`);
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuthCallback();
  }, [
    searchParams,
    router,
    lang,
    translations.auth.oauth.authenticationFailed,
  ]);

  if (isLoading) {
    return <Loading />;
  }

  return null;
}
