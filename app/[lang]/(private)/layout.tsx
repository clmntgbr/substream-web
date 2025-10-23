import { Header } from "@/components/header/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Footer } from "@/components/ui/footer";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";
import { OptionProvider } from "@/lib/option";
import { StreamProvider } from "@/lib/stream";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <StreamProvider>
          <OptionProvider>
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">{children}</div>
            <Footer logoSrc="/images/logo.svg" />
            <Toaster richColors expand={false} position="top-right" closeButton />
          </OptionProvider>
        </StreamProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
