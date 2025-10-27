"use client";

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
import { useTranslations } from "@/lib/use-translations";
import { CheckCheck, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ResetPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations();

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="grid h-full min-h-screen lg:grid-cols-2">
      <div className="flex justify-center px-4 py-20">
        <div className="relative flex w-full max-w-[450px] flex-col items-start justify-center">
          <div className="min-h-[450px] w-full">
            <div className="flex flex-col gap-8">
              <div className="grid gap-4">
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

                <form onSubmit={handleReset}>
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
        <div className="h-full w-full rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 dark:from-primary/30 dark:via-primary/20 dark:to-accent/30"></div>
      </div>
    </div>
  );
}
