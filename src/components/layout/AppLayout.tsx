import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { SidebarProvider, useSidebarContext } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import { OnboardingTour, useOnboarding } from "@/components/onboarding/OnboardingTour";

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayoutContent({ children }: AppLayoutProps) {
  const { collapsed } = useSidebarContext();
  const { isOpen, startTour, closeTour, completeTour } = useOnboarding();
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={cn(
        "transition-all duration-300",
        collapsed ? "pl-16" : "pl-64"
      )}>
        <Header onStartOnboarding={startTour} />
        <main className="p-6">{children}</main>
      </div>
      
      {/* Onboarding Tour */}
      <OnboardingTour
        isOpen={isOpen}
        onClose={closeTour}
        onComplete={completeTour}
      />
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
