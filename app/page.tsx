"use client";
import { Header } from "@/components/header";
import { SidebarComponent } from "@/components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Upload from "@/components/upload/upload";
import { useAuth } from "@/lib/auth-context";

const HomePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <Header />
        <div className="flex flex-1">
          <SidebarComponent />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4 bg-secondary/30">
              <Upload />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default HomePage;
