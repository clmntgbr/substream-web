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
              <main className="flex-1 relative pb-20">
                <div
                  className="pointer-events-none absolute left-1/2 top-[-100px] -z-10 min-h-[calc(100%+100px)] w-[350%] -translate-x-1/2 overflow-hidden md:w-[190%] lg:w-[190%] xl:w-[190%] 2xl:mx-auto"
                  style={{
                    backgroundImage: "url(/gradient.svg)",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center top",
                    WebkitMask: "linear-gradient(to bottom, transparent 0%, white 15%, white 100%)",
                    mask: "linear-gradient(to bottom, transparent 0%, white 15%, white 100%)",
                    WebkitBackfaceVisibility: "hidden",
                    backfaceVisibility: "hidden",
                    WebkitPerspective: "1000px",
                    perspective: "1000px",
                    willChange: "transform",
                  }}
                  aria-hidden="true"
                />
                <div className="flex flex-1 flex-col gap-4 px-4 container max-w-6xl mx-auto">{children}</div>
              </main>
            </div>
            <Toaster richColors expand={false} position="top-right" closeButton />
          </OptionProvider>
        </StreamProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
