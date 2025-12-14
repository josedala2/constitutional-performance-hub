import { supabase } from '@/integrations/supabase/client';
import { AUDIT_ACTIONS, ENTITY_TYPES, AuditAction, EntityType } from '@/types/auth';

export async function logAudit(
  action: AuditAction,
  entityType: EntityType,
  entityId: string | null = null,
  metadata: object = {}
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('Tentativa de log de auditoria sem utilizador autenticado');
      return;
    }

    const { error } = await supabase.rpc('log_audit', {
      _actor_user_id: user.id,
      _action: action,
      _entity_type: entityType,
      _entity_id: entityId,
      _metadata: JSON.parse(JSON.stringify(metadata)),
    });

    if (error) {
      console.error('Erro ao registar auditoria:', error);
    }
  } catch (error) {
    console.error('Erro ao registar auditoria:', error);
  }
}

// Funções de conveniência para ações específicas
export const auditUserCreate = (userId: string, userData: object) =>
  logAudit(AUDIT_ACTIONS.USER_CREATE, ENTITY_TYPES.USER, userId, { user_data: userData });

export const auditUserUpdate = (userId: string, changes: object) =>
  logAudit(AUDIT_ACTIONS.USER_UPDATE, ENTITY_TYPES.USER, userId, { changes });

export const auditUserStatusChange = (userId: string, oldStatus: string, newStatus: string) =>
  logAudit(AUDIT_ACTIONS.USER_STATUS_CHANGE, ENTITY_TYPES.USER, userId, { old_status: oldStatus, new_status: newStatus });

export const auditRoleCreate = (roleId: string, roleName: string) =>
  logAudit(AUDIT_ACTIONS.ROLE_CREATE, ENTITY_TYPES.ROLE, roleId, { role_name: roleName });

export const auditRoleUpdate = (roleId: string, changes: object) =>
  logAudit(AUDIT_ACTIONS.ROLE_UPDATE, ENTITY_TYPES.ROLE, roleId, { changes });

export const auditPermissionAssign = (roleId: string, permissionCodes: string[]) =>
  logAudit(AUDIT_ACTIONS.PERMISSION_ASSIGN, ENTITY_TYPES.ROLE, roleId, { permissions: permissionCodes });

export const auditUserRoleAssign = (userId: string, roleId: string, roleName: string) =>
  logAudit(AUDIT_ACTIONS.USER_ROLE_ASSIGN, ENTITY_TYPES.USER_ROLE, userId, { role_id: roleId, role_name: roleName });

export const auditUserRoleRemove = (userId: string, roleId: string, roleName: string) =>
  logAudit(AUDIT_ACTIONS.USER_ROLE_REMOVE, ENTITY_TYPES.USER_ROLE, userId, { role_id: roleId, role_name: roleName });

export const auditOrgUnitCreate = (orgUnitId: string, name: string) =>
  logAudit(AUDIT_ACTIONS.ORG_UNIT_CREATE, ENTITY_TYPES.ORG_UNIT, orgUnitId, { name });

export const auditOrgUnitUpdate = (orgUnitId: string, changes: object) =>
  logAudit(AUDIT_ACTIONS.ORG_UNIT_UPDATE, ENTITY_TYPES.ORG_UNIT, orgUnitId, { changes });
