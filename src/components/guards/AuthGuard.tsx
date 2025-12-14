import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: ReactNode;
}

// Guardião de autenticação sem bloqueio:
// - Enquanto isLoading: mostra ecrã de carregamento
// - Depois: renderiza sempre children, mesmo sem user (login deixa de ser obrigatório)
export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">A carregar...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
