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
  UserCheck,
  UsersRound,
  Building2,
  Globe,
  ClipboardList,
  Workflow,
  PanelLeftClose,
  PanelLeft,
  Shield,
  Key,
  ScrollText,
} from "lucide-react";
import tribunalLogo from "@/assets/tribunal-logo.png";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const avaliacoesSubmenu = [
  { 
    name: "Pessoal Técnico e Não Técnico", 
    href: "/avaliacoes/pessoal-tecnico", 
    icon: UserCheck,
    shortName: "Pessoal"
  },
  { 
    name: "Entre Pares", 
    href: "/avaliacoes/entre-pares", 
    icon: UsersRound,
    shortName: "Pares"
  },
  { 
    name: "Utentes Internos", 
    href: "/avaliacoes/utentes-internos", 
    icon: Building2,
    shortName: "Internos"
  },
  { 
    name: "Utentes Externos", 
    href: "/avaliacoes/utentes-externos", 
    icon: Globe,
    shortName: "Externos"
  },
  { 
    name: "Acompanhamento", 
    href: "/avaliacoes/acompanhamento", 
    icon: ClipboardList,
    shortName: "Acomp."
  },
];

const relatoriosSubmenu = [
  { 
    name: "Superior-Subordinado", 
    href: "/relatorios/desempenho-superior", 
    icon: UserCheck,
    shortName: "Superior"
  },
  { 
    name: "Entre Pares", 
    href: "/relatorios/entre-pares", 
    icon: UsersRound,
    shortName: "Pares"
  },
  { 
    name: "Utentes Internos", 
    href: "/relatorios/utentes-internos", 
    icon: Building2,
    shortName: "Internos"
  },
  { 
    name: "Utentes Externos", 
    href: "/relatorios/utentes-externos", 
    icon: Globe,
    shortName: "Externos"
  },
];

const navigation = [
  { name: "Painel Principal", href: "/", icon: LayoutDashboard },
  { name: "Processo de Avaliação", href: "/processo", icon: Workflow },
  { name: "Ciclos de Avaliação", href: "/ciclos", icon: Calendar },
  { name: "Colaboradores", href: "/colaboradores", icon: Users },
  { name: "Objectivos", href: "/objectivos", icon: Target },
  { name: "Competências", href: "/competencias", icon: Award },
];

const navigationAfterRelatorios = [
  { name: "Documentos", href: "/documentos", icon: FileText },
];

const adminSubmenu = [
  { name: "Utilizadores", href: "/admin/utilizadores", icon: Users, shortName: "Utilizadores" },
  { name: "Perfis", href: "/admin/perfis", icon: Shield, shortName: "Perfis" },
  { name: "Permissões", href: "/admin/permissoes", icon: Key, shortName: "Permissões" },
  { name: "Auditoria", href: "/admin/auditoria", icon: ScrollText, shortName: "Auditoria" },
];

const bottomNavigation = [
  { name: "Configurações", href: "/configuracoes", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { collapsed, toggle } = useSidebarContext();
  const [avaliacoesOpen, setAvaliacoesOpen] = useState(
    location.pathname.startsWith("/avaliacoes")
  );
  const [relatoriosOpen, setRelatoriosOpen] = useState(
    location.pathname.startsWith("/relatorios")
  );
  const [adminOpen, setAdminOpen] = useState(
    location.pathname.startsWith("/admin")
  );

  const isAvaliacoesActive = location.pathname.startsWith("/avaliacoes");
  const isRelatoriosActive = location.pathname.startsWith("/relatorios");
  const isAdminActive = location.pathname.startsWith("/admin");

  const NavItem = ({ item, isActive }: { item: { name: string; href: string; icon: React.ElementType }; isActive: boolean }) => {
    const content = (
      <Link
        to={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          collapsed && "justify-center px-2"
        )}
      >
        <item.icon className="h-5 w-5 flex-shrink-0" />
        {!collapsed && item.name}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right">{item.name}</TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
          <img 
            src={tribunalLogo} 
            alt="Tribunal de Contas" 
            className={cn("h-10 w-auto transition-all duration-300", collapsed && "h-8")} 
          />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-serif font-semibold text-sidebar-foreground">
                Tribunal de Contas
              </span>
              <span className="text-[10px] text-sidebar-foreground/70 uppercase tracking-wider">
                SGAD
              </span>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <div className="flex justify-end px-2 py-2 border-b border-sidebar-border">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggle}
                className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              >
                {collapsed ? (
                  <PanelLeft className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {collapsed ? "Expandir menu" : "Recolher menu"}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return <NavItem key={item.name} item={item} isActive={isActive} />;
          })}

          {/* Avaliações with Submenu */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/avaliacoes/pessoal-tecnico"
                  className={cn(
                    "flex items-center justify-center rounded-lg px-2 py-2.5 text-sm font-medium transition-all duration-200",
                    isAvaliacoesActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <ClipboardCheck className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Avaliações</TooltipContent>
            </Tooltip>
          ) : (
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
          )}

          {/* Relatórios with Submenu */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/relatorios/desempenho-superior"
                  className={cn(
                    "flex items-center justify-center rounded-lg px-2 py-2.5 text-sm font-medium transition-all duration-200",
                    isRelatoriosActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <BarChart3 className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Relatórios</TooltipContent>
            </Tooltip>
          ) : (
            <Collapsible open={relatoriosOpen} onOpenChange={setRelatoriosOpen}>
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isRelatoriosActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <BarChart3 className="h-5 w-5 flex-shrink-0" />
                  <span className="flex-1 text-left">Relatórios</span>
                  {relatoriosOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 pl-4 pt-1">
                {relatoriosSubmenu.map((item) => {
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
          )}

          {navigationAfterRelatorios.map((item) => {
            const isActive = location.pathname === item.href;
            return <NavItem key={item.name} item={item} isActive={isActive} />;
          })}

          {/* Separator */}
          <div className="my-4 border-t border-sidebar-border" />

          {/* Administração with Submenu */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/admin/utilizadores"
                  className={cn(
                    "flex items-center justify-center rounded-lg px-2 py-2.5 text-sm font-medium transition-all duration-200",
                    isAdminActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Shield className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Administração</TooltipContent>
            </Tooltip>
          ) : (
            <Collapsible open={adminOpen} onOpenChange={setAdminOpen}>
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isAdminActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Shield className="h-5 w-5 flex-shrink-0" />
                  <span className="flex-1 text-left">Administração</span>
                  {adminOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 pl-4 pt-1">
                {adminSubmenu.map((item) => {
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
          )}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-sidebar-border px-2 py-4">
          {bottomNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return <NavItem key={item.name} item={item} isActive={isActive} />;
          })}
        </div>

        {/* Footer */}
        {!collapsed && (
          <div className="border-t border-sidebar-border px-6 py-4">
            <p className="text-[10px] text-sidebar-foreground/50 text-center">
              © 2025 Tribunal de Contas
              <br />
              Sistema de Gestão de Avaliação de Desempenho
            </p>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}
