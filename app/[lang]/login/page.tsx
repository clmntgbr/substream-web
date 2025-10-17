"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
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
                <FieldError errors={fieldErrors.password?.map((msg) => ({ message: msg }))} />
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
