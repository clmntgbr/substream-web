"use client";

import { useAuth } from "@/lib/auth-context";
import { useTranslations } from "@/lib/use-translations";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DarkModeToggle } from "./DarkModeToggle";
import { Logo } from "./Logo";
import { NavUser } from "./navigation/NavUser";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export function Header() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const t = useTranslations();

  return (
    <>
      <div className="md:container mx-auto px-10 flex h-16 w-full items-center justify-between">
        <div className="flex items-center gap-8 md:pl-8">
          <div className="relative">
            <span data-state="closed" data-slot="context-menu-trigger" className="flex flex-col gap-1.5">
              <Link className="transition-opacity hover:opacity-75" href="/">
                <Logo />
              </Link>
            </span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <a
              className="text-sm font-normal text-foreground transition-colors hover:text-foreground/80"
              href="https://discord.com/invite/lovable-dev"
            >
              Community
            </a>
            <Link className="text-sm font-normal text-foreground transition-colors hover:text-foreground/80" href="/pricing">
              Pricing
            </Link>
            <a className="text-sm font-normal text-foreground transition-colors hover:text-foreground/80" href="https://enterprise.lovable.dev">
              Enterprise
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4 md:pr-8">
          <div className="flex gap-2">
            <DarkModeToggle />
            {isLoading ? (
              <Skeleton className="w-10 h-10 rounded-full" />
            ) : user ? (
              <NavUser />
            ) : (
              <>
                <Button variant="outline" onClick={() => router.push(`/${lang}/login`)}>
                  {t.login.title}
                </Button>
                <Button variant="outline" onClick={() => router.push(`/${lang}/register`)}>
                  {t.register.title}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
