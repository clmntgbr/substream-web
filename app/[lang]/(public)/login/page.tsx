"use client";

import { GitHubSVG } from "@/components/misc/GitHubSVG";
import { GoogleSVG } from "@/components/misc/GoogleSVG";
import { LinkedInSVG } from "@/components/misc/LinkedInSVG";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { initiateGitHubOAuth } from "@/lib/oauth/github";
import { initiateGoogleOAuth } from "@/lib/oauth/google";
import { initiateLinkedInOAuth } from "@/lib/oauth/linkedin";
import { useTranslations } from "@/lib/use-translations";
import { GalleryVerticalEnd } from "lucide-react";
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
      setFieldErrors({ general: ["Failed to initiate Google login"] });
    }
    setIsLoading(false);
  };

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    try {
      await initiateGitHubOAuth();
    } catch {
      setFieldErrors({ general: ["Failed to initiate GitHub login"] });
    }
    setIsLoading(false);
  };

  const handleLinkedInLogin = async () => {
    setIsLoading(true);
    try {
      await initiateLinkedInOAuth();
    } catch {
      setFieldErrors({ general: ["Failed to initiate LinkedIn login"] });
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <div className="flex flex-col gap-6">
          <Card className="shadow-none">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t.login.welcome}
              </CardTitle>
            </CardHeader>
            <CardContent className="shadow-none">
              <form onSubmit={handleLogin} className="space-y-4">
                <FieldGroup>
                  <Field>
                    <Button type="button" variant="outline" disabled={isLoading} className="w-full cursor-pointer" onClick={handleGoogleLogin}>
                      <GoogleSVG />
                      Login with Google
                    </Button>
                    <Button type="button" variant="outline" disabled={isLoading} className="w-full cursor-pointer" onClick={handleGitHubLogin}>
                      <GitHubSVG />
                      Login with GitHub
                    </Button>
                    <Button type="button" variant="outline" disabled={isLoading} className="w-full cursor-pointer" onClick={handleLinkedInLogin}>
                      <LinkedInSVG />
                      Login with LinkedIn
                    </Button>
                  </Field>
                  <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">Or continue with</FieldSeparator>
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
                    <Button type="submit">Login</Button>
                    <FieldDescription className="text-center">
                      Don&apos;t have an account? <a href="#">Sign up</a>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}
