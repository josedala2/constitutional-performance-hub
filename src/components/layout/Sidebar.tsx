import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Target,
  ClipboardCheck,
  BarChart3,
  Settings,
  Calendar,
  FileText,
  Award,
  ChevronDown,
  ChevronRight,
  FileCheck,
  UserCheck,
  UsersRound,
  Building2,
  Globe,
  ClipboardList,
} from "lucide-react";
import tribunalLogo from "@/assets/tribunal-logo.png";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const avaliacoesSubmenu = [
  { 
    name: "Pessoal Técnico e Não Técnico", 
    href: "/avaliacoes/pessoal-tecnico", 
    icon: UserCheck,
    description: "Anexo I"
  },
  { 
    name: "Entre Pares", 
    href: "/avaliacoes/entre-pares", 
    icon: UsersRound,
    description: "Anexo III"
  },
  { 
    name: "Utentes Internos", 
    href: "/avaliacoes/utentes-internos", 
    icon: Building2,
    description: "Anexo IV"
  },
  { 
    name: "Utentes Externos", 
    href: "/avaliacoes/utentes-externos", 
    icon: Globe,
    description: "Anexo V"
  },
  { 
    name: "Acompanhamento", 
    href: "/avaliacoes/acompanhamento", 
    icon: ClipboardList,
    description: "Anexo X"
  },
];

const navigation = [
  { name: "Painel Principal", href: "/", icon: LayoutDashboard },
  { name: "Ciclos de Avaliação", href: "/ciclos", icon: Calendar },
  { name: "Colaboradores", href: "/colaboradores", icon: Users },
  { name: "Objectivos", href: "/objectivos", icon: Target },
  { name: "Competências", href: "/competencias", icon: Award },
];

const navigationAfterAvaliacoes = [
  { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
  { name: "Documentos", href: "/documentos", icon: FileText },
];

const bottomNavigation = [
  { name: "Configurações", href: "/configuracoes", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const [avaliacoesOpen, setAvaliacoesOpen] = useState(
    location.pathname.startsWith("/avaliacoes")
  );

  const isAvaliacoesActive = location.pathname.startsWith("/avaliacoes");

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <img src={tribunalLogo} alt="Tribunal de Contas" className="h-10 w-auto" />
        <div className="flex flex-col">
          <span className="text-sm font-serif font-semibold text-sidebar-foreground">
            Tribunal de Contas
          </span>
          <span className="text-[10px] text-sidebar-foreground/70 uppercase tracking-wider">
            SGAD
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}

        {/* Avaliações with Submenu */}
        <Collapsible open={avaliacoesOpen} onOpenChange={setAvaliacoesOpen}>
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isAvaliacoesActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <ClipboardCheck className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1 text-left">Avaliações</span>
              {avaliacoesOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 pl-4 pt-1">
            {avaliacoesSubmenu.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {navigationAfterAvaliacoes.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-sidebar-border px-3 py-4">
        {bottomNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-6 py-4">
        <p className="text-[10px] text-sidebar-foreground/50 text-center">
          © 2025 Tribunal de Contas
          <br />
          Sistema de Gestão de Avaliação de Desempenho
        </p>
      </div>
    </aside>
  );
}
