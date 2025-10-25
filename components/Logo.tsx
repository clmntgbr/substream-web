"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export function Logo({ className, width, height }: { className?: string; width: number; height: number }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder during SSR to avoid hydration mismatch
    return (
      <div className={cn("relative", className)}>
        <div style={{ width, height }} className="bg-transparent" />
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <Image src={theme === "dark" ? "/logo-white.svg" : "/logo-black.svg"} alt="Logo" width={width} height={height} />
    </div>
  );
}
