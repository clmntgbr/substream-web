import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className, width, height }: { className?: string; width?: number; height?: number }) {
  return (
    <div className={cn("relative", className)}>
      <Image src="/logoblack.svg" alt="Logo" width={width} height={height} />
    </div>
  );
}
