"use client";

import { GitHubSVG } from "@/components/misc/GitHubSVG";
import { GoogleSVG } from "@/components/misc/GoogleSVG";
import { LinkedInSVG } from "@/components/misc/LinkedInSVG";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/lib/auth-context";
import { initiateGitHubOAuth } from "@/lib/oauth/github";
import { initiateGoogleOAuth } from "@/lib/oauth/google";
import { initiateLinkedInOAuth } from "@/lib/oauth/linkedin";
import { useTranslations } from "@/lib/use-translations";
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
    setIsLoading(true);
    try {
      await initiateGoogleOAuth();
    } catch {
      setIsLoading(false);
      setFieldErrors({ general: ["Failed to initiate Google login"] });
    }
  };

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    try {
      await initiateGitHubOAuth();
    } catch {
      setIsLoading(false);
      setFieldErrors({ general: ["Failed to initiate GitHub login"] });
    }
  };

  const handleLinkedInLogin = async () => {
    setIsLoading(true);
    try {
      await initiateLinkedInOAuth();
    } catch {
      setIsLoading(false);
      setFieldErrors({ general: ["Failed to initiate LinkedIn login"] });
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col">
        <div className="flex flex-col">
          <Card className="shadow-none gap-0">
            <CardHeader className="text-center gap-0">
              <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t.login.welcome}
              </CardTitle>
            </CardHeader>
            <CardContent className="shadow-none mt-5">
              <form onSubmit={handleLogin} className="space-y-4">
                <FieldGroup>
                  <Field>
                    <div className="flex flex-row justify-center gap-2">
                      <Button
                        size="icon-lg"
                        aria-label="Submit"
                        disabled={isLoading}
                        onClick={handleGoogleLogin}
                        variant="outline"
                        className="rounded-full cursor-pointer"
                      >
                        <GoogleSVG />
                      </Button>
                      <Button
                        size="icon-lg"
                        aria-label="Submit"
                        disabled={isLoading}
                        onClick={handleGitHubLogin}
                        variant="outline"
                        className="rounded-full cursor-pointer"
                      >
                        <GitHubSVG />
                      </Button>
                      <Button
                        size="icon-lg"
                        aria-label="Submit"
                        disabled={isLoading}
                        onClick={handleLinkedInLogin}
                        variant="outline"
                        className="rounded-full cursor-pointer"
                      >
                        <LinkedInSVG />
                      </Button>
                    </div>
                  </Field>
                  <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">{t.login.orContinueWith}</FieldSeparator>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" type="email" placeholder={t.login.email} value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <FieldError errors={fieldErrors.email?.map((msg) => ({ message: msg }))} />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder={t.login.password}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
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
                  <Field>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? <Spinner className="size-4" /> : t.login.submit}
                    </Button>
                    <FieldDescription className="text-center">
                      Don&apos;t have an account? <Link href="/register">{t.login.signup}</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
          <FieldDescription className="px-6 text-center pt-5">
            By clicking login, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}
