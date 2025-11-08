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
import { apiClient } from "@/lib/api-client";
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
import { registerSchema, type RegisterFormData } from "@/lib/validation/auth";
import { CheckCheck, HelpCircle, InfoIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { refreshUser } = useAuth();
  const [lastUsedProvider, setLastUsedProviderState] =
    useState<SocialProvider | null>(null);
  const t = useTranslations();
  const { resolveErrorMessage, parseErrorPayload, getDefaultErrorMessage } =
    useErrorTranslator();
  const router = useRouter();
  const params = useParams();
  const lang = (params.lang as string) || "en";

  useEffect(() => {
    const provider = getLastUsedProvider();
    setLastUsedProviderState(provider);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData: RegisterFormData = {
      firstname,
      lastname,
      email,
      password,
      confirmPassword,
    };
    const validationResult = registerSchema.safeParse(formData);

    if (!validationResult.success) {
      validationResult.error.issues.forEach((issue) => {
        toast.error(issue.message);
      });
      setIsLoading(false);
      return;
    }

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
        const data = (await response.json().catch(() => ({}))) as {
          detail?: string;
          description?: string;
          error?: string;
          message?: string;
          key?: string;
          params?: Record<string, unknown>;
          errors?: Record<string, string[]>;
        };

        if (data.errors && typeof data.errors === "object") {
          Object.entries(data.errors).forEach(([, messages]) => {
            messages.forEach((message) => {
              const parsed = parseErrorPayload({ message });
              const resolved = resolveErrorMessage(parsed, message);
              toast.error(resolved);
            });
          });
        } else {
          const parsedError = parseErrorPayload(data);
          const resolved = resolveErrorMessage(
            {
              ...parsedError,
              message:
                parsedError.message ??
                data.message ??
                data.detail ??
                data.description,
              error: parsedError.error ?? data.error,
              params: parsedError.params ?? data.params,
            },
            data.detail || data.description || data.error,
          );
          toast.error(resolved);
        }
        setIsLoading(false);
        return;
      }

      // Registration successful
      await refreshUser();
      router.push(`/${lang}`);
    } catch (error) {
      const err = error as Error & {
        key?: string;
        params?: Record<string, unknown>;
      };
      const resolved = resolveErrorMessage(
        {
          key: err.key,
          params: err.params,
          message: err.message,
        },
        err.message || getDefaultErrorMessage(),
      );
      toast.error(resolved);
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
      toast.error("Failed to initiate Google register");
    }
  };

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setLastUsedProvider("github");
    try {
      await initiateGitHubOAuth();
    } catch {
      setIsLoading(false);
      toast.error("Failed to initiate GitHub register");
    }
  };

  const handleLinkedInLogin = async () => {
    setIsLoading(true);
    setLastUsedProvider("linkedin");
    try {
      await initiateLinkedInOAuth();
    } catch {
      setIsLoading(false);
      toast.error("Failed to initiate LinkedIn register");
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
                    className={`relative flex w-full space-x-2 h-8 rounded-md px-4 py-2 ${
                      lastUsedProvider === "google"
                        ? "border border-affirmative-primary "
                        : ""
                    }`}
                  >
                    <GoogleSVG />
                    <span>{t.register.continueWithGoogle}</span>
                  </Button>
                  {lastUsedProvider === "google" && <LastUsedBadge />}
                </div>

                <div className="relative">
                  <Button
                    onClick={handleGitHubLogin}
                    disabled={isLoading}
                    variant="outline"
                    className={`relative flex w-full space-x-2 h-8 rounded-md px-4 py-2 ${
                      lastUsedProvider === "github"
                        ? "border border-affirmative-primary "
                        : ""
                    }`}
                  >
                    <GitHubSVG />
                    <span>{t.register.continueWithGitHub}</span>
                  </Button>
                  {lastUsedProvider === "github" && <LastUsedBadge />}
                </div>

                <div className="relative">
                  <Button
                    onClick={handleLinkedInLogin}
                    disabled={isLoading}
                    variant="outline"
                    className={`relative flex w-full space-x-2 h-8 rounded-md px-4 py-2 ${
                      lastUsedProvider === "linkedin"
                        ? "border border-affirmative-primary "
                        : ""
                    }`}
                  >
                    <LinkedInSVG />
                    <span>{t.register.continueWithLinkedIn}</span>
                  </Button>
                  {lastUsedProvider === "linkedin" && <LastUsedBadge />}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-background px-2 text-muted-foreground">
                      {t.register.orContinueWith}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid gap-4">
                    <Field>
                      <div className="flex flex-row gap-4">
                        <InputGroup className="flex-1">
                          <InputGroupInput
                            id="firstname"
                            type="text"
                            placeholder="John"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            required
                          />
                          <InputGroupAddon align="block-start">
                            <Label
                              htmlFor="firstname"
                              className="text-foreground"
                            >
                              {t.register.firstname}
                            </Label>
                          </InputGroupAddon>
                        </InputGroup>
                        <InputGroup className="flex-1">
                          <InputGroupInput
                            id="lastname"
                            type="text"
                            placeholder="Doe"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            required
                          />
                          <InputGroupAddon align="block-start">
                            <Label
                              htmlFor="lastname"
                              className="text-foreground"
                            >
                              {t.register.lastname}
                            </Label>
                          </InputGroupAddon>
                        </InputGroup>
                      </div>
                    </Field>
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
                            {t.register.email}
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
                                {t.register.weWillUseThisToSendYouNotifications}
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
                            {t.register.password}
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
                    <Field>
                      <InputGroup>
                        <InputGroupInput
                          id="confirmPassword"
                          type="password"
                          placeholder="********"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        <InputGroupAddon align="block-start">
                          <Label
                            htmlFor="confirmPassword"
                            className="text-foreground"
                          >
                            {t.register.confirmPassword}
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
                              <p>{t.register.passwordsMustMatch}</p>
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
                              t.register.continue
                            )}{" "}
                            <CheckCheck />
                          </Button>
                        </div>
                      </div>

                      <div className="text-center text-base font-normal">
                        <span className="text-sm text-muted-foreground">
                          {t.register.alreadyHaveAccount}{" "}
                          <Link
                            href="/login"
                            className="text-sm text-primary underline"
                          >
                            {t.register.login}
                          </Link>
                        </span>
                      </div>
                      <FieldDescription className="px-6 text-center pt-5">
                        {t.register.byClickingRegister}{" "}
                        <a href="#">{t.register.termsOfService}</a>{" "}
                        {t.register.and} <a href="#">{t.register.and}</a>{" "}
                        <a href="#">{t.register.privacyPolicy}</a>.
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
