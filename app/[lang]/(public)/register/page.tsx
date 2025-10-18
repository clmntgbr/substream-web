"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-context";
import { initiateGoogleOAuth } from "@/lib/oauth/google";
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
          const errorMessage =
            data.detail ||
            data.description ||
            data.error ||
            "An error occurred";
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

  const handleGoogleRegister = async () => {
    try {
      await initiateGoogleOAuth();
    } catch {
      setFieldErrors({ general: ["Failed to initiate Google registration"] });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-foreground">
          {t.register.title}
        </h1>

        <form onSubmit={handleRegister} className="space-y-6">
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!fieldErrors.firstname}>
                <FieldLabel htmlFor="firstname">
                  {t.register.firstname}
                </FieldLabel>
                <Input
                  id="firstname"
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                  placeholder="Jean"
                />
                <FieldError
                  errors={fieldErrors.firstname?.map((msg) => ({
                    message: msg,
                  }))}
                />
              </Field>

              <Field data-invalid={!!fieldErrors.lastname}>
                <FieldLabel htmlFor="lastname">
                  {t.register.lastname}
                </FieldLabel>
                <Input
                  id="lastname"
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                  placeholder="Dupont"
                />
                <FieldError
                  errors={fieldErrors.lastname?.map((msg) => ({
                    message: msg,
                  }))}
                />
              </Field>
            </div>

            <Field data-invalid={!!fieldErrors.email}>
              <FieldLabel htmlFor="email">{t.register.email}</FieldLabel>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
              />
              <FieldError
                errors={fieldErrors.email?.map((msg) => ({ message: msg }))}
              />
            </Field>

            <Field data-invalid={!!fieldErrors.plainPassword}>
              <FieldLabel htmlFor="password">{t.register.password}</FieldLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
              <FieldError
                errors={fieldErrors.plainPassword?.map((msg) => ({
                  message: msg,
                }))}
              />
            </Field>

            <Field data-invalid={!!fieldErrors.confirmPassword}>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
              <FieldError
                errors={fieldErrors.confirmPassword?.map((msg) => ({
                  message: msg,
                }))}
              />
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

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? t.register.submitDisabled : t.register.submit}
            </Button>
          </FieldGroup>
        </form>

        <div className="relative my-4">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            Or continue with
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full cursor-pointer"
          onClick={handleGoogleRegister}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign up with Google
        </Button>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {t.register.alreadyHaveAccount}{" "}
            <a
              href={`/${lang}/login`}
              className="font-medium text-primary hover:underline"
            >
              {t.register.login}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
