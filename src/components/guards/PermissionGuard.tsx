import { ReactNode } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { AppRole, ModuleCode, PermissionAction, CycleState } from "@/config/permissions";

interface PermissionGuardProps {
  children: ReactNode;
  role: AppRole;
  moduleCode: ModuleCode;
  action?: PermissionAction;
  cycleState?: CycleState;
  fallback?: ReactNode;
}

/**
 * Componente guard que renderiza children apenas se o utilizador
 * tiver permissão para o módulo/ação especificado
 */
export function PermissionGuard({
  children,
  role,
  moduleCode,
  action = "view",
  cycleState,
  fallback = null,
}: PermissionGuardProps) {
  const { canPerformAction, hasModuleAccess } = usePermissions({ role, cycleState });

  // Se apenas verificar acesso ao módulo
  if (action === "view") {
    if (!hasModuleAccess(moduleCode)) {
      return <>{fallback}</>;
    }
    return <>{children}</>;
  }

  // Verificar ação específica
  if (!canPerformAction(moduleCode, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface ModuleAccessGuardProps {
  children: ReactNode;
  role: AppRole;
  moduleCode: ModuleCode;
  fallback?: ReactNode;
}

/**
 * Componente guard simplificado que verifica apenas acesso ao módulo
 */
export function ModuleAccessGuard({
  children,
  role,
  moduleCode,
  fallback = null,
}: ModuleAccessGuardProps) {
  const { hasModuleAccess } = usePermissions({ role });

  if (!hasModuleAccess(moduleCode)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface AdminOnlyGuardProps {
  children: ReactNode;
  role: AppRole;
  fallback?: ReactNode;
}

/**
 * Componente guard que renderiza apenas para administradores
 */
export function AdminOnlyGuard({
  children,
  role,
  fallback = null,
}: AdminOnlyGuardProps) {
  const { isAdmin } = usePermissions({ role });

  if (!isAdmin()) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface ActionButtonGuardProps {
  children: ReactNode;
  role: AppRole;
  moduleCode: ModuleCode;
  action: PermissionAction;
  cycleState?: CycleState;
}

/**
 * Componente guard para botões de ação
 * Renderiza o botão apenas se permitido, caso contrário não renderiza nada
 */
export function ActionButtonGuard({
  children,
  role,
  moduleCode,
  action,
  cycleState,
}: ActionButtonGuardProps) {
  const { canPerformAction } = usePermissions({ role, cycleState });

  if (!canPerformAction(moduleCode, action)) {
    return null;
  }

  return <>{children}</>;
}
