import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { SidebarProvider, useSidebarContext } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import { OnboardingTour, useOnboarding } from "@/components/onboarding/OnboardingTour";
import { HelpPanel } from "@/components/help/HelpPanel";
import { TooltipProvider } from "@/components/ui/tooltip";

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayoutContent({ children }: AppLayoutProps) {
  const { collapsed, isMobile } = useSidebarContext();
  const { isOpen, startTour, closeTour, completeTour } = useOnboarding();
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={cn(
        "transition-all duration-300",
        isMobile ? "pl-0" : (collapsed ? "pl-16" : "pl-64")
      )}>
        <Header onStartOnboarding={startTour} />
        <main className="p-3 md:p-6">{children}</main>
      </div>
      
      {/* Onboarding Tour */}
      <OnboardingTour
        isOpen={isOpen}
        onClose={closeTour}
        onComplete={completeTour}
      />
      
      {/* Contextual Help Panel */}
      <HelpPanel />
    </div>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <AppLayoutContent>{children}</AppLayoutContent>
      </TooltipProvider>
    </SidebarProvider>
  );
}
