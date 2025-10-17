import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";
import { fontVariables } from "@/lib/fonts";
import { OptionProvider } from "@/lib/option";
import { StreamProvider } from "@/lib/stream";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Substream Web",
  description: "Application sécurisée avec authentification JWT",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={cn(
          "text-foreground group/body theme-blue overscroll-none font-sans antialiased [--footer-height:calc(var(--spacing)*14)] [--header-height:calc(var(--spacing)*14)] xl:[--footer-height:calc(var(--spacing)*24)]",
          fontVariables,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <StreamProvider>
              <OptionProvider>
                {children}
                <Toaster
                  richColors
                  expand={false}
                  position="top-right"
                  closeButton
                />
              </OptionProvider>
            </StreamProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
