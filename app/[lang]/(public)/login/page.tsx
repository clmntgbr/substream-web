"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-context";
import { initiateGoogleOAuth } from "@/lib/oauth/google";
import { useTranslations } from "@/lib/use-translations";
import { Lock, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const lang = (params.lang as string) || "en";
  const t = useTranslations();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (error) {
      const err = error as Error;
      // Try to parse as JSON error with field-specific errors
      try {
        const errorData = JSON.parse(err.message);
        if (errorData.errors && typeof errorData.errors === "object") {
          setFieldErrors(errorData.errors);
        } else {
          setFieldErrors({ general: [err.message || "Login failed"] });
        }
      } catch {
        // Not JSON, treat as general error
        setFieldErrors({ general: [err.message || "Login failed"] });
      }
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await initiateGoogleOAuth();
    } catch {
      setFieldErrors({ general: ["Failed to initiate Google login"] });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <LogIn className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">{t.login.title}</CardTitle>
        </CardHeader>
        <CardContent className="shadow-none">
          <form onSubmit={handleLogin} className="space-y-4">
            <FieldGroup>
              <Field data-invalid={!!fieldErrors.email}>
                <FieldLabel htmlFor="email">{t.login.email}</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t.login.email}
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <FieldError errors={fieldErrors.email?.map((msg) => ({ message: msg }))} />
              </Field>

              <Field data-invalid={!!fieldErrors.password}>
                <FieldLabel htmlFor="password">{t.login.password}</FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={t.login.password}
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <FieldError
                  errors={fieldErrors.password?.map((msg) => ({
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

              <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    {t.login.submit}
                  </>
                ) : (
                  t.login.submit
                )}
              </Button>
            </FieldGroup>
          </form>

          <div className="relative my-4">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              Or continue with
            </span>
          </div>

          <Button type="button" variant="outline" className="w-full cursor-pointer" onClick={handleGoogleLogin}>
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
            Sign in with Google
          </Button>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {t.login.alreadyHaveAccount}{" "}
            <Link href={`/${lang}/register`} className="font-medium text-primary hover:underline">
              {t.login.register}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
