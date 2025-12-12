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
} from "lucide-react";
import tribunalEmblem from "@/assets/tribunal-emblem.png";

const navigation = [
  { name: "Painel Principal", href: "/", icon: LayoutDashboard },
  { name: "Ciclos de Avaliação", href: "/ciclos", icon: Calendar },
  { name: "Colaboradores", href: "/colaboradores", icon: Users },
  { name: "Objectivos", href: "/objectivos", icon: Target },
  { name: "Competências", href: "/competencias", icon: Award },
  { name: "Avaliações", href: "/avaliacoes", icon: ClipboardCheck },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
  { name: "Documentos", href: "/documentos", icon: FileText },
];

const bottomNavigation = [
  { name: "Configurações", href: "/configuracoes", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <img src={tribunalEmblem} alt="Tribunal Constitucional" className="h-10 w-10" />
        <div className="flex flex-col">
          <span className="text-sm font-serif font-semibold text-sidebar-foreground">
            Tribunal Constitucional
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
          © 2025 Tribunal Constitucional
          <br />
          Sistema de Gestão de Avaliação de Desempenho
        </p>
      </div>
    </aside>
  );
}
