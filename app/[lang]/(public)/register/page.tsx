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
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { initiateGitHubOAuth } from "@/lib/oauth/github";
import { initiateGoogleOAuth } from "@/lib/oauth/google";
import { initiateLinkedInOAuth } from "@/lib/oauth/linkedin";
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
      const response = await apiClient.post(
        "/api/register",
        {
          email,
          password,
          confirmPassword,
          firstname,
          lastname,
        },
        {
          headers: {
            "Content-Type": "application/ld+json",
          },
          skipAuthRedirect: true,
        },
      );

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

  const handleGitHubRegister = async () => {
    try {
      await initiateGitHubOAuth();
    } catch {
      setFieldErrors({ general: ["Failed to initiate GitHub registration"] });
    }
  };

  const handleLinkedInRegister = async () => {
    try {
      await initiateLinkedInOAuth();
    } catch {
      setFieldErrors({ general: ["Failed to initiate LinkedIn registration"] });
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

        <div className="space-y-2">
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

          <Button
            type="button"
            variant="outline"
            className="w-full cursor-pointer"
            onClick={handleGitHubRegister}
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Sign up with GitHub
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full cursor-pointer"
            onClick={handleLinkedInRegister}
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Sign up with LinkedIn
          </Button>
        </div>

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
