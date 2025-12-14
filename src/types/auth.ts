// Tipos para o sistema de autenticação e RBAC

export type UserStatus = 'ACTIVE' | 'INACTIVE';

export type ScopeType = 'GLOBAL' | 'ORG_UNIT';

export type SystemRole = 
  | 'ADMIN' 
  | 'RH' 
  | 'AVALIADOR' 
  | 'AVALIADO' 
  | 'PAR' 
  | 'UTENTE_INTERNO' 
  | 'UTENTE_EXTERNO' 
  | 'AUDITOR';

export interface OrgUnit {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
  parent?: Partial<OrgUnit> | null;
  children?: OrgUnit[];
}

export interface Profile {
  id: string;
  full_name: string;
  employee_code: string | null;
  email: string;
  phone: string | null;
  job_title: string | null;
  org_unit_id: string | null;
  status: UserStatus;
  created_at: string;
  updated_at: string;
  org_unit?: Partial<OrgUnit> | null;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  is_system: boolean;
  created_at?: string;
}

export interface Permission {
  id: string;
  code: string;
  description: string | null;
  created_at: string;
}

export interface RolePermission {
  role_id: string;
  permission_id: string;
  role?: Role;
  permission?: Permission;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  scope_type: ScopeType;
  scope_id: string | null;
  created_at: string;
  role?: Partial<Role> | null;
  org_unit?: Partial<OrgUnit> | null;
}

export interface AuditLog {
  id: string;
  actor_user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  actor?: Profile;
}

// Tipos para formulários
export interface ProfileFormData {
  full_name: string;
  employee_code?: string;
  email: string;
  phone?: string;
  job_title?: string;
  org_unit_id?: string;
  status: UserStatus;
}

export interface RoleFormData {
  name: string;
  description?: string;
}

export interface UserRoleAssignment {
  role_id: string;
  scope_type: ScopeType;
  scope_id?: string;
}

// Tipos para filtros
export interface UserFilters {
  search?: string;
  status?: UserStatus;
  org_unit_id?: string;
}

export interface AuditFilters {
  actor_user_id?: string;
  action?: string;
  entity_type?: string;
  date_from?: string;
  date_to?: string;
}

// Ações de auditoria
export const AUDIT_ACTIONS = {
  // Auth
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  // User
  USER_CREATE: 'USER_CREATE',
  USER_UPDATE: 'USER_UPDATE',
  USER_STATUS_CHANGE: 'USER_STATUS_CHANGE',
  USER_DELETE: 'USER_DELETE',
  // Role
  ROLE_CREATE: 'ROLE_CREATE',
  ROLE_UPDATE: 'ROLE_UPDATE',
  ROLE_DELETE: 'ROLE_DELETE',
  // Permission
  PERMISSION_ASSIGN: 'PERMISSION_ASSIGN',
  PERMISSION_REMOVE: 'PERMISSION_REMOVE',
  // User Role
  USER_ROLE_ASSIGN: 'USER_ROLE_ASSIGN',
  USER_ROLE_REMOVE: 'USER_ROLE_REMOVE',
  // Org Unit
  ORG_UNIT_CREATE: 'ORG_UNIT_CREATE',
  ORG_UNIT_UPDATE: 'ORG_UNIT_UPDATE',
  ORG_UNIT_DELETE: 'ORG_UNIT_DELETE',
} as const;

export type AuditAction = typeof AUDIT_ACTIONS[keyof typeof AUDIT_ACTIONS];

// Entity types para auditoria
export const ENTITY_TYPES = {
  USER: 'USER',
  ROLE: 'ROLE',
  PERMISSION: 'PERMISSION',
  USER_ROLE: 'USER_ROLE',
  ORG_UNIT: 'ORG_UNIT',
  SESSION: 'SESSION',
} as const;

export type EntityType = typeof ENTITY_TYPES[keyof typeof ENTITY_TYPES];

// Tradução de ações
export const translateAuditAction = (action: string): string => {
  const translations: Record<string, string> = {
    LOGIN: 'Início de sessão',
    LOGOUT: 'Fim de sessão',
    USER_CREATE: 'Utilizador criado',
    USER_UPDATE: 'Utilizador atualizado',
    USER_STATUS_CHANGE: 'Estado do utilizador alterado',
    USER_DELETE: 'Utilizador eliminado',
    ROLE_CREATE: 'Perfil criado',
    ROLE_UPDATE: 'Perfil atualizado',
    ROLE_DELETE: 'Perfil eliminado',
    PERMISSION_ASSIGN: 'Permissão atribuída',
    PERMISSION_REMOVE: 'Permissão removida',
    USER_ROLE_ASSIGN: 'Perfil atribuído a utilizador',
    USER_ROLE_REMOVE: 'Perfil removido de utilizador',
    ORG_UNIT_CREATE: 'Unidade orgânica criada',
    ORG_UNIT_UPDATE: 'Unidade orgânica atualizada',
    ORG_UNIT_DELETE: 'Unidade orgânica eliminada',
  };
  return translations[action] || action;
};

// Tradução de entity types
export const translateEntityType = (type: string): string => {
  const translations: Record<string, string> = {
    USER: 'Utilizador',
    ROLE: 'Perfil',
    PERMISSION: 'Permissão',
    USER_ROLE: 'Perfil de Utilizador',
    ORG_UNIT: 'Unidade Orgânica',
    SESSION: 'Sessão',
  };
  return translations[type] || type;
};

// Tradução de roles
export const translateRole = (role: string): string => {
  const translations: Record<string, string> = {
    ADMIN: 'Administrador',
    RH: 'Recursos Humanos',
    AVALIADOR: 'Avaliador',
    AVALIADO: 'Avaliado',
    PAR: 'Par',
    UTENTE_INTERNO: 'Utente Interno',
    UTENTE_EXTERNO: 'Utente Externo',
    AUDITOR: 'Auditor',
  };
  return translations[role] || role;
};

// Tradução de status
export const translateStatus = (status: UserStatus): string => {
  return status === 'ACTIVE' ? 'Ativo' : 'Inativo';
};

// Grupos de permissões para UI
export const PERMISSION_GROUPS = {
  'Gestão de Utilizadores': [
    'users.manage.create',
    'users.manage.read',
    'users.manage.update',
    'users.manage.disable',
    'users.manage.delete',
  ],
  'Gestão de Perfis': [
    'roles.manage.create',
    'roles.manage.read',
    'roles.manage.update',
    'roles.manage.delete',
  ],
  'Permissões': [
    'permissions.read',
    'permissions.assign',
  ],
  'Atribuição de Perfis': [
    'user_roles.assign',
    'user_roles.remove',
  ],
  'Unidades Orgânicas': [
    'org_units.manage.create',
    'org_units.manage.read',
    'org_units.manage.update',
    'org_units.manage.delete',
  ],
  'Auditoria': [
    'audit.read',
  ],
  'Avaliações': [
    'evaluations.create',
    'evaluations.read',
    'evaluations.update',
    'evaluations.delete',
    'evaluations.approve',
  ],
} as const;
