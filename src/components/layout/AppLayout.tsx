import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { SidebarProvider, useSidebarContext } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayoutContent({ children }: AppLayoutProps) {
  const { collapsed } = useSidebarContext();
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={cn(
        "transition-all duration-300",
        collapsed ? "pl-16" : "pl-64"
      )}>
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
