"use client";

import { Spinner } from "@/components/ui/spinner";
import { useTranslations } from "@/lib/use-translations";

export default function Loading() {
  const translations = useTranslations();
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-md p-8 rounded-lg  text-center">
        <Spinner className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">{translations.auth.oauth.loading.title}</h1>
        <p className="text-muted-foreground">{translations.auth.oauth.loading.description}</p>
      </div>
    </div>
  );
}
