"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { useTranslations } from "@/lib/use-translations";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const lang = (params.lang as string) || "en";
  const t = useTranslations();
  const { refreshUser } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
        },
        credentials: "include", // Important for cookies
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
          firstname,
          lastname,
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as {
          detail?: string;
          description?: string;
          error?: string;
          errors?: Record<string, string[]>;
        };

        // Check if errors object exists (new format with field-specific errors)
        if (data.errors && typeof data.errors === "object") {
          setFieldErrors(data.errors);
        } else {
          // Fallback to old format (detail/description/error) - show as general error
          const errorMessage = data.detail || data.description || data.error || "An error occurred";
          setFieldErrors({ general: [errorMessage] });
        }
        return;
      }

      // Registration successful, user is now logged in
      await response.json();

      // Refresh user context
      await refreshUser();

      // Redirect to home page
      router.push(`/${lang}`);
    } catch {
      setFieldErrors({ general: ["An error occurred"] });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-foreground">{t.register.title}</h1>

        <form onSubmit={handleRegister} className="space-y-6">
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!fieldErrors.firstname}>
                <FieldLabel htmlFor="firstname">{t.register.firstname}</FieldLabel>
                <Input id="firstname" type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} required placeholder="Jean" />
                <FieldError errors={fieldErrors.firstname?.map((msg) => ({ message: msg }))} />
              </Field>

              <Field data-invalid={!!fieldErrors.lastname}>
                <FieldLabel htmlFor="lastname">{t.register.lastname}</FieldLabel>
                <Input id="lastname" type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} required placeholder="Dupont" />
                <FieldError errors={fieldErrors.lastname?.map((msg) => ({ message: msg }))} />
              </Field>
            </div>

            <Field data-invalid={!!fieldErrors.email}>
              <FieldLabel htmlFor="email">{t.register.email}</FieldLabel>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="votre@email.com" />
              <FieldError errors={fieldErrors.email?.map((msg) => ({ message: msg }))} />
            </Field>

            <Field data-invalid={!!fieldErrors.plainPassword}>
              <FieldLabel htmlFor="password">{t.register.password}</FieldLabel>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
              <FieldError errors={fieldErrors.plainPassword?.map((msg) => ({ message: msg }))} />
            </Field>

            <Field data-invalid={!!fieldErrors.confirmPassword}>
              <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
              <FieldError errors={fieldErrors.confirmPassword?.map((msg) => ({ message: msg }))} />
            </Field>

            {fieldErrors.general && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <ul className="text-sm text-red-600 dark:text-red-400 list-disc list-inside space-y-1">
                  {fieldErrors.general.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading ? t.register.submitDisabled : t.register.submit}
            </Button>
          </FieldGroup>
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
