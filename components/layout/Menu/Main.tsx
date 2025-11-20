"use client";

import Link from "next/link";

export function Main() {
  return (
    <nav className="flex items-center gap-6">
      <Link
        className="text-sm font-normal text-foreground transition-colors hover:text-foreground/80"
        href="/studio/pricing"
      >
        Pricing
      </Link>
    </nav>
  );
}
