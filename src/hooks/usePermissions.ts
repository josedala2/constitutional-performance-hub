import { useMemo } from "react";
import {
  AppRole,
  ModuleCode,
  PermissionAction,
  CycleState,
  ROLE_PERMISSIONS,
  GLOBAL_RULES,
  getModuleByCode,
  getModuleByRoute,
  getAccessibleModules,
  ModuleDefinition,
  Scope,
  PrivacyConfig,
} from "@/config/permissions";

interface UsePermissionsOptions {
  role: AppRole;
  cycleState?: CycleState;
}

interface PermissionsResult {
  // Verificação de permissões
  hasPermission: (moduleCode: ModuleCode, action: PermissionAction) => boolean;
  hasModuleAccess: (moduleCode: ModuleCode) => boolean;
  canPerformAction: (moduleCode: ModuleCode, action: PermissionAction) => boolean;
  
  // Verificação de escopo
  hasScope: (scope: Scope) => boolean;
  getScopes: () => Scope[];
  
  // Configurações de privacidade
  getPrivacyConfig: () => PrivacyConfig | undefined;
  shouldHidePeerReviewerIdentity: () => boolean;
  shouldHideUtenteIdentities: () => boolean;
  isAnonymousSubmissionRequired: () => boolean;
  isAnonymousSubmissionOptional: () => boolean;
  
  // Módulos acessíveis
  getAccessibleModules: () => ModuleDefinition[];
  getModulePermissions: (moduleCode: ModuleCode) => PermissionAction[];
  
  // Verificação de bloqueio por estado do ciclo
  isModuleLocked: (moduleCode: ModuleCode, action: PermissionAction) => boolean;
  
  // Utilitários
  isAdmin: () => boolean;
  canEditAfterHomologation: () => boolean;
  canHomologate: () => boolean;
}

export function usePermissions({ role, cycleState }: UsePermissionsOptions): PermissionsResult {
  const rolePermissions = useMemo(() => ROLE_PERMISSIONS[role], [role]);

  const hasPermission = useMemo(() => {
    return (moduleCode: ModuleCode, action: PermissionAction): boolean => {
      const modulePermissions = rolePermissions.modules[moduleCode];
      if (!modulePermissions) return false;
      return modulePermissions.includes(action);
    };
  }, [rolePermissions]);

  const hasModuleAccess = useMemo(() => {
    return (moduleCode: ModuleCode): boolean => {
      return !!rolePermissions.modules[moduleCode];
    };
  }, [rolePermissions]);

  const isModuleLocked = useMemo(() => {
    return (moduleCode: ModuleCode, action: PermissionAction): boolean => {
      if (!cycleState) return false;
      
      const lockedStates: CycleState[] = ["fechado", "homologado"];
      if (!lockedStates.includes(cycleState)) return false;

      // Admin tem exceção para auditoria
      if (role === "admin") return false;

      const lockRule = GLOBAL_RULES.lock_rules[0];
      const lockKey = `${moduleCode}.${action}` as const;
      return (lockRule.lock as readonly string[]).includes(lockKey);
    };
  }, [cycleState, role]);

  const canPerformAction = useMemo(() => {
    return (moduleCode: ModuleCode, action: PermissionAction): boolean => {
      if (!hasPermission(moduleCode, action)) return false;
      if (isModuleLocked(moduleCode, action)) return false;
      return true;
    };
  }, [hasPermission, isModuleLocked]);

  const hasScope = useMemo(() => {
    return (scope: Scope): boolean => {
      return rolePermissions.scopes.includes(scope);
    };
  }, [rolePermissions]);

  const getScopes = useMemo(() => {
    return (): Scope[] => rolePermissions.scopes;
  }, [rolePermissions]);

  const getPrivacyConfig = useMemo(() => {
    return (): PrivacyConfig | undefined => rolePermissions.privacy;
  }, [rolePermissions]);

  const shouldHidePeerReviewerIdentity = useMemo(() => {
    return (): boolean => {
      return rolePermissions.privacy?.hide_peer_reviewer_identity_when_anonymous ?? false;
    };
  }, [rolePermissions]);

  const shouldHideUtenteIdentities = useMemo(() => {
    return (): boolean => {
      return rolePermissions.privacy?.never_show_utente_identities ?? false;
    };
  }, [rolePermissions]);

  const isAnonymousSubmissionRequired = useMemo(() => {
    return (): boolean => {
      return rolePermissions.privacy?.anonymous_submission_required ?? false;
    };
  }, [rolePermissions]);

  const isAnonymousSubmissionOptional = useMemo(() => {
    return (): boolean => {
      return rolePermissions.privacy?.anonymous_submission_optional ?? false;
    };
  }, [rolePermissions]);

  const getAccessibleModulesForRole = useMemo(() => {
    return (): ModuleDefinition[] => getAccessibleModules(role);
  }, [role]);

  const getModulePermissions = useMemo(() => {
    return (moduleCode: ModuleCode): PermissionAction[] => {
      return rolePermissions.modules[moduleCode] || [];
    };
  }, [rolePermissions]);

  const isAdmin = useMemo(() => {
    return (): boolean => role === "admin";
  }, [role]);

  const canEditAfterHomologation = useMemo(() => {
    return (): boolean => {
      return !hasScope("cannot_edit_after_homologation");
    };
  }, [hasScope]);

  const canHomologate = useMemo(() => {
    return (): boolean => {
      return !hasScope("cannot_homologate") && hasModuleAccess("M14");
    };
  }, [hasScope, hasModuleAccess]);

  return {
    hasPermission,
    hasModuleAccess,
    canPerformAction,
    hasScope,
    getScopes,
    getPrivacyConfig,
    shouldHidePeerReviewerIdentity,
    shouldHideUtenteIdentities,
    isAnonymousSubmissionRequired,
    isAnonymousSubmissionOptional,
    getAccessibleModules: getAccessibleModulesForRole,
    getModulePermissions,
    isModuleLocked,
    isAdmin,
    canEditAfterHomologation,
    canHomologate,
  };
}

// Função utilitária para verificar permissão sem hook (para uso em guards)
export function checkPermission(
  role: AppRole,
  moduleCode: ModuleCode,
  action: PermissionAction
): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  const modulePermissions = permissions.modules[moduleCode];
  if (!modulePermissions) return false;
  return modulePermissions.includes(action);
}

// Função para verificar se rota é acessível
export function canAccessRoute(role: AppRole, route: string): boolean {
  const module = getModuleByRoute(route);
  if (!module) return true; // Rotas não mapeadas são públicas
  
  const permissions = ROLE_PERMISSIONS[role];
  return !!permissions.modules[module.code];
}
