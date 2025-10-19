"use client";

import Loading from "@/components/oauth/Loading";
import { useTranslations } from "@/lib/use-translations";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function LinkedInOAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const lang = (params.lang as string) || "en";
  const [isLoading, setIsLoading] = useState(true);
  const hasExchangedToken = useRef(false);
  const t = useTranslations();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (hasExchangedToken.current) {
        return;
      }
      hasExchangedToken.current = true;
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      if (!code) {
        toast.error(t.oauth.authenticationFailed);
        router.push(`/${lang}/login`);
        return;
      }

      try {
        const exchangeData = {
          code,
          state,
        };

        const response = await fetch("/api/oauth/linkedin/exchange-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(exchangeData),
        });

        if (!response.ok) {
          toast.error(t.oauth.authenticationFailed);
          router.push(`/${lang}/login`);
          return;
        }

        await response.json();

        await new Promise((resolve) => setTimeout(resolve, 1000));

        router.push(`/${lang}`);
      } catch {
        toast.error(t.oauth.authenticationFailed);
        router.push(`/${lang}/login`);
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuthCallback();
  }, [searchParams, router, lang, t.oauth.authenticationFailed]);

  if (isLoading) {
    return <Loading />;
  }

  return null;
}
