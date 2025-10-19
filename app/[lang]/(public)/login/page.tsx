"use client";

import { GitHubSVG } from "@/components/misc/GitHubSVG";
import { GoogleSVG } from "@/components/misc/GoogleSVG";
import { LinkedInSVG } from "@/components/misc/LinkedInSVG";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/lib/auth-context";
import { getLastUsedProvider, setLastUsedProvider, type SocialProvider } from "@/lib/cookies";
import { initiateGitHubOAuth } from "@/lib/oauth/github";
import { initiateGoogleOAuth } from "@/lib/oauth/google";
import { initiateLinkedInOAuth } from "@/lib/oauth/linkedin";
import { useTranslations } from "@/lib/use-translations";
import { CheckCheck, HelpCircle, InfoIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [lastUsedProvider, setLastUsedProviderState] = useState<SocialProvider | null>(null);
  const t = useTranslations();

  useEffect(() => {
    const provider = getLastUsedProvider();
    setLastUsedProviderState(provider);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (error) {
      const err = error as Error;
      try {
        const errorData = JSON.parse(err.message);
        if (errorData.errors && typeof errorData.errors === "object") {
          if (errorData.errors.general) {
            errorData.errors.general.forEach((errorMsg: string) => {
              toast.error(errorMsg);
            });
          }
        } else {
          toast.error(err.message || "Login failed");
        }
      } catch {
        toast.error(err.message || "Login failed");
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

  const LastUsedBadge = () => (
    <div className="absolute -right-2 -top-1/3">
      <span className="rounded-lg border border-affirmative-primary bg-affirmative px-1.5 py-0.5 text-xs text-affirmative-foreground shadow-none bg-background">
        {t.login.last_used}
      </span>
    </div>
  );

  return (
    <div className="grid h-full min-h-screen lg:grid-cols-2">
      <div className="flex justify-center px-4 py-20">
        <div className="relative flex w-full max-w-[350px] flex-col items-start justify-center">
          <div className="min-h-[450px] w-full">
            <div className="flex flex-col gap-8">
              <div className="grid gap-4">
                <div className="relative">
                  <Button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    variant="outline"
                    className={`relative flex w-full space-x-2 h-8 rounded-md px-4 py-2 ${
                      lastUsedProvider === "google" ? "border border-affirmative-primary shadow-none" : ""
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
                    className={`relative flex w-full space-x-2 h-8 rounded-md px-4 py-2 ${
                      lastUsedProvider === "github" ? "border border-affirmative-primary shadow-none" : ""
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
                    className={`relative flex w-full space-x-2 h-8 rounded-md px-4 py-2 ${
                      lastUsedProvider === "linkedin" ? "border border-affirmative-primary shadow-none" : ""
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
                    <span className="bg-background px-2 text-muted-foreground">{t.login.orContinueWith}</span>
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
                            {t.login.email}
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InputGroupButton variant="ghost" aria-label="Help" className="ml-auto rounded-full" size="icon-xs">
                                <HelpCircle />
                              </InputGroupButton>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>We&apos;ll use this to send you notifications</p>
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
                            {t.login.password}
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InputGroupButton variant="ghost" aria-label="Help" className="ml-auto rounded-full" size="icon-xs">
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
                          <Button type="submit" disabled={isLoading} className="w-full h-8 rounded-md px-4 py-2">
                            {isLoading ? <Spinner className="size-4" /> : "Continue"} <CheckCheck />
                          </Button>
                        </div>
                      </div>

                      <div className="text-center text-base font-normal">
                        <span className="text-sm text-muted-foreground">
                          Don&apos;t have an account?{" "}
                          <Link href="/register" className="text-sm text-primary underline">
                            Create your account
                          </Link>
                        </span>
                      </div>
                      <FieldDescription className="px-6 text-center pt-5">
                        By clicking login, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
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
        <div className="h-full w-full rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 dark:from-primary/30 dark:via-primary/20 dark:to-accent/30"></div>
      </div>
    </div>
  );
}
