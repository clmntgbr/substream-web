"use client";

import { GitHubSVG } from "@/components/features/auth/misc/GitHubSVG";
import { GoogleSVG } from "@/components/features/auth/misc/GoogleSVG";
import { LinkedInSVG } from "@/components/features/auth/misc/LinkedInSVG";
import { LastUsedBadge } from "@/components/features/auth/oauth/LastUsedBadge";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/lib/auth-context";
import {
  getLastUsedProvider,
  setLastUsedProvider,
  type SocialProvider,
} from "@/lib/cookies";
import { initiateGitHubOAuth } from "@/lib/oauth/github";
import { initiateGoogleOAuth } from "@/lib/oauth/google";
import { initiateLinkedInOAuth } from "@/lib/oauth/linkedin";
import { useErrorTranslator } from "@/lib/use-error-translator";
import { useTranslations } from "@/lib/use-translations";
import { loginSchema, type LoginFormData } from "@/lib/validation/auth";
import { CheckCheck, HelpCircle, InfoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [lastUsedProvider, setLastUsedProviderState] =
    useState<SocialProvider | null>(null);
  const t = useTranslations();
  const { resolveErrorMessage, parseErrorPayload, getDefaultErrorMessage } = useErrorTranslator();

  useEffect(() => {
    const provider = getLastUsedProvider();
    setLastUsedProviderState(provider);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form data with Zod
    const formData: LoginFormData = { email, password };
    const validationResult = loginSchema.safeParse(formData);

    if (!validationResult.success) {
      // Show validation errors in toasts
      validationResult.error.issues.forEach((issue) => {
        toast.error(issue.message);
      });
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      const err = error as Error & { key?: string; params?: Record<string, unknown> };
      try {
        const errorData = JSON.parse(err.message);
        if (errorData.errors && typeof errorData.errors === "object") {
          Object.entries(errorData.errors).forEach(([, messages]) => {
            (messages as string[]).forEach((message: string) => {
              const parsed = parseErrorPayload({ message });
              const resolved = resolveErrorMessage(parsed, message);
              toast.error(resolved);
            });
          });
        } else {
          const parsedError = parseErrorPayload(errorData);
          const resolved = resolveErrorMessage(
            {
              ...parsedError,
              message: parsedError.message ?? errorData.message,
              error: parsedError.error ?? errorData.error,
              params: parsedError.params ?? errorData.params,
            },
            err.message,
          );
          toast.error(resolved);
        }
      } catch {
        const resolved = resolveErrorMessage(
          {
            key: err.key,
            params: err.params,
            message: err.message,
          },
          err.message || getDefaultErrorMessage(),
        );
        toast.error(resolved);
      }
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setLastUsedProvider("google");
    try {
      await initiateGoogleOAuth();
    } catch {
      setIsLoading(false);
      toast.error("Failed to initiate Google login");
    }
  };

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setLastUsedProvider("github");
    try {
      await initiateGitHubOAuth();
    } catch {
      setIsLoading(false);
      toast.error("Failed to initiate GitHub login");
    }
  };

  const handleLinkedInLogin = async () => {
    setIsLoading(true);
    setLastUsedProvider("linkedin");
    try {
      await initiateLinkedInOAuth();
    } catch {
      setIsLoading(false);
      toast.error("Failed to initiate LinkedIn login");
    }
  };

  return (
    <div className="grid h-full min-h-screen lg:grid-cols-2">
      <div className="flex justify-center px-4 py-20">
        <div className="relative flex w-full max-w-[450px] flex-col items-start justify-center">
          <div className="min-h-[450px] w-full">
            <div className="flex flex-col gap-8">
              <div className="grid gap-4">
                <div className="relative">
                  <Button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    variant="outline"
                    className={`relative flex w-full space-x-2 h-8 hover:bg-muted/70 bg-muted/30 dark:bg-background rounded-md px-4 py-2 ${
                      lastUsedProvider === "google"
                        ? "border border-affirmative-primary "
                        : ""
                    }`}
                  >
                    <GoogleSVG />
                    <span>Continue with Google</span>
                  </Button>
                  {lastUsedProvider === "google" && <LastUsedBadge />}
                </div>

                <div className="relative">
                  <Button
                    onClick={handleGitHubLogin}
                    disabled={isLoading}
                    variant="outline"
                    className={`relative flex w-full space-x-2 h-8 hover:bg-muted/70 bg-muted/30 dark:bg-background rounded-md px-4 py-2 ${
                      lastUsedProvider === "github"
                        ? "border border-affirmative-primary "
                        : ""
                    }`}
                  >
                    <GitHubSVG />
                    <span>Continue with GitHub</span>
                  </Button>
                  {lastUsedProvider === "github" && <LastUsedBadge />}
                </div>

                <div className="relative">
                  <Button
                    onClick={handleLinkedInLogin}
                    disabled={isLoading}
                    variant="outline"
                    className={`relative flex w-full space-x-2 h-8 rounded-md px-4 py-2 hover:bg-muted/70 bg-muted/30 dark:bg-background ${
                      lastUsedProvider === "linkedin"
                        ? "border border-affirmative-primary "
                        : ""
                    }`}
                  >
                    <LinkedInSVG />
                    <span>Continue with LinkedIn</span>
                  </Button>
                  {lastUsedProvider === "linkedin" && <LastUsedBadge />}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-background px-2 text-muted-foreground">
                      {t.auth.login.orContinueWith}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleLogin}>
                  <div className="grid gap-4">
                    <Field>
                      <InputGroup>
                        <InputGroupInput
                          id="email"
                          type="email"
                          placeholder="random@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <InputGroupAddon align="block-start">
                          <Label htmlFor="email" className="text-foreground">
                            {t.auth.login.email}
                          </Label>
                          <Tooltip>
                            <TooltipTrigger
                              asChild
                              className="hover:bg-transparent"
                            >
                              <InputGroupButton
                                variant="ghost"
                                aria-label="Help"
                                className="ml-auto rounded-full"
                                size="icon-xs"
                              >
                                <HelpCircle />
                              </InputGroupButton>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                We&apos;ll use this to send you notifications
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>
                    <Field>
                      <InputGroup>
                        <InputGroupInput
                          id="password"
                          type="password"
                          placeholder="********"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <InputGroupAddon align="block-start">
                          <Label htmlFor="password" className="text-foreground">
                            {t.auth.login.password}
                          </Label>
                          <Tooltip>
                            <TooltipTrigger
                              asChild
                              className="hover:bg-transparent"
                            >
                              <InputGroupButton
                                variant="ghost"
                                aria-label="Help"
                                className="ml-auto rounded-full"
                                size="icon-xs"
                              >
                                <InfoIcon />
                              </InputGroupButton>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Password must be at least 8 characters</p>
                            </TooltipContent>
                          </Tooltip>
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>
                    <div className="flex flex-col gap-3">
                      <div className="relative flex items-center">
                        <div className="flex-grow">
                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-8 rounded-md px-4 py-2"
                          >
                            {isLoading ? (
                              <Spinner className="size-4" />
                            ) : (
                              t.auth.login.continue
                            )}{" "}
                            <CheckCheck />
                          </Button>
                        </div>
                      </div>

                      <div className="text-center text-base font-normal">
                        <span className="text-sm text-muted-foreground">
                          Don&apos;t have an account?{" "}
                          <Link
                            href="/register"
                            className="text-sm text-primary underline"
                          >
                            Create your account
                          </Link>
                        </span>
                      </div>
                      <FieldDescription className="px-6 text-center pt-5">
                        By clicking login, you agree to our{" "}
                        <a href="#">Terms of Service</a> and{" "}
                        <a href="#">Privacy Policy</a>.
                      </FieldDescription>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 hidden h-screen rounded-xl p-4 lg:block">
        <div className="h-full w-full rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 dark:from-primary/30 dark:via-primary/20 dark:to-accent/30">
          <Image
            alt="LoginBanner"
            loading="eager"
            width="1384"
            height="1824"
            decoding="async"
            data-nimg="1"
            className="pointer-events-none block h-full w-full select-none rounded-xl object-cover dark:hidden"
            style={{ color: "transparent" }}
            src="/background.webp"
          />
        </div>
      </div>
    </div>
  );
}
