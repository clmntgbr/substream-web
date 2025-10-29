"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Logo } from "../features/shared/logo";

interface NavFooterProps extends React.HTMLAttributes<HTMLElement> {
  description?: string;
  usefulLinks?: { label: string; href: string }[];
  socialLinks?: { label: string; href: string; icon: React.ReactNode }[];
  newsletterTitle?: string;
  onSubscribe?: (email: string) => Promise<boolean>;
}

export function NavFooter({
  description = "Empowering businesses with intelligent financial solutions, designed for the future of finance.",
  usefulLinks = [
    { label: "Products", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ],
  socialLinks = [
    { label: "Facebook", href: "#", icon: <DummyIcon /> },
    { label: "Instagram", href: "#", icon: <DummyIcon /> },
    { label: "Twitter (X)", href: "#", icon: <DummyIcon /> },
  ],
  newsletterTitle = "Subscribe our newsletter",
  onSubscribe,
  className,
  ...props
}: NavFooterProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !onSubscribe || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onSubscribe(email);

    setSubscriptionStatus(success ? "success" : "error");
    setIsSubmitting(false);

    if (success) {
      setEmail("");
    }

    // Reset the status message after 3 seconds
    setTimeout(() => {
      setSubscriptionStatus("idle");
    }, 3000);
  };

  return (
    <footer className={cn("border-t bg-background ", className)} {...props}>
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
        {/* Company Info */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <Logo width={90} height={90} />
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Useful Links */}
        <div className="md:justify-self-center">
          <h3 className="mb-4 text-base font-semibold">Useful Link</h3>
          <ul className="space-y-2">
            {usefulLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Follow Us */}
        <div className="md:justify-self-center">
          <h3 className="mb-4 text-base font-semibold">Follow Us</h3>
          <ul className="space-y-2">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  aria-label={link.label}
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="mb-4 text-base font-semibold">{newsletterTitle}</h3>
          <form onSubmit={handleSubscribe} className="relative w-full max-w-sm">
            <div className="relative">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting || subscriptionStatus !== "idle"}
                required
                aria-label="Email for newsletter"
                className="pr-28"
              />
              <Button
                type="submit"
                disabled={isSubmitting || subscriptionStatus !== "idle"}
                className="absolute right-0 top-0 h-full rounded-l-none px-4"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
            {/* Advanced Animation Overlay */}
            {(subscriptionStatus === "success" ||
              subscriptionStatus === "error") && (
              <div
                key={subscriptionStatus} // Re-trigger animation on status change
                className="animate-in fade-in absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 text-center backdrop-blur-sm"
              >
                {subscriptionStatus === "success" ? (
                  <span className="font-semibold text-green-500">
                    Subscribed! 🎉
                  </span>
                ) : (
                  <span className="font-semibold text-destructive">
                    Failed. Try again.
                  </span>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </footer>
  );
}

function DummyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 text-muted-foreground"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}
