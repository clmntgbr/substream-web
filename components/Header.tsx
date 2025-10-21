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
      <div className="md:container mx-auto px-10 flex h-16 w-full items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8 md:pl-8">
          <div className="relative">
            <span data-state="closed" data-slot="context-menu-trigger" className="flex flex-col gap-1.5">
              <Link className="transition-opacity hover:opacity-75" href="/">
                <Logo width={100} height={100} />
              </Link>
            </span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link className="text-sm font-normal text-foreground transition-colors hover:text-foreground/80" href="/pricing">
              Pricing
            </Link>
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
