import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
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
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <div className="flex flex-1 flex-col gap-4 p-4 container max-w-6xl mx-auto">{children}</div>
              </main>
            </div>
            <Toaster richColors expand={false} position="top-right" closeButton />
          </OptionProvider>
        </StreamProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
