"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/use-translations";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const lang = (params.lang as string) || "en";
  const t = useTranslations();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
        },
        body: JSON.stringify({ email, password, firstname, lastname }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error || "Une erreur est survenue");
        return;
      }

      router.push(`/${lang}/login`);
    } catch {
      setError("Une erreur est survenue");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-foreground">{t.register.title}</h1>

        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">{t.register.notice}</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-foreground mb-2">
                {t.register.firstname}
              </label>
              <input
                id="firstname"
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
                disabled
                className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent bg-muted"
                placeholder="Jean"
              />
            </div>

            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-foreground mb-2">
                {t.register.lastname}
              </label>
              <input
                id="lastname"
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
                disabled
                className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent bg-muted"
                placeholder="Dupont"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              {t.register.email}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled
              className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent bg-muted"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              {t.register.password}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled
              className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent bg-muted"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <Button type="submit" disabled={true} className="w-full">
            {t.register.submitDisabled}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {t.register.alreadyHaveAccount}{" "}
            <a href={`/${lang}/login`} className="font-medium text-primary hover:underline">
              {t.register.login}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
