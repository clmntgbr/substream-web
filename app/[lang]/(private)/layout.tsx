import { Header } from "@/components/layout/Header";
import { NavFooter } from "@/components/layout/NavFooter";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";
import { NotificationProvider } from "@/lib/notification";
import { OptionProvider } from "@/lib/option";
import { PlanProvider } from "@/lib/plan";
import { StreamProvider } from "@/lib/stream";
import { SubscriptionProvider } from "@/lib/subscription/context";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <NotificationProvider>
          <StreamProvider>
            <OptionProvider>
              <PlanProvider>
                <SubscriptionProvider>
                  <Header />
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-16">
                    {children}
                  </div>
                  <NavFooter />
                  <Toaster
                    richColors
                    expand={false}
                    position="top-right"
                    closeButton
                  />
                </SubscriptionProvider>
              </PlanProvider>
            </OptionProvider>
          </StreamProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
