import { useAuth } from "@/lib/auth-context";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { DarkModeToggle } from "./DarkModeToggle";
import { Logo } from "./Logo";
import { Menu } from "./Menu";
import { NavUser } from "./navigation/NavUser";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export function Header() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const menuItems = [
    { href: "#features", label: "Features" },
    { href: "#docs", label: "Documentation" },
    { href: "#community", label: "Community" },
    { href: "#pricing", label: "Pricing" },
  ];

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-16 items-center justify-between px-4">
        <Logo />

        {/* Desktop Navigation - Center */}
        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          <Menu />
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <NavUser />

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                {menuItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
                  >
                    {item.label}
                  </a>
                ))}
                <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-border">
                  <Button variant="ghost" className="w-full justify-start">
                    Sign In
                  </Button>
                  <Button className="w-full">Get Started</Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
