import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AuditLog, AuditFilters } from '@/types/auth';

export function useAuditLogs(filters?: AuditFilters, page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['audit-logs', filters, page, pageSize],
    queryFn: async () => {
      let query = supabase
        .from('audit_logs')
        .select(`
          *,
          actor:profiles!audit_logs_actor_user_id_fkey(id, full_name, email)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filters?.actor_user_id) {
        query = query.eq('actor_user_id', filters.actor_user_id);
      }

      if (filters?.action) {
        query = query.eq('action', filters.action);
      }

      if (filters?.entity_type) {
        query = query.eq('entity_type', filters.entity_type);
      }

      if (filters?.date_from) {
        query = query.gte('created_at', filters.date_from);
      }

      if (filters?.date_to) {
        query = query.lte('created_at', `${filters.date_to}T23:59:59`);
      }

      // Paginação
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;
      
      return {
        data: data as AuditLog[],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    },
  });
}

export function useAuditLogsByEntity(entityType: string, entityId: string) {
  return useQuery({
    queryKey: ['audit-logs-entity', entityType, entityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          actor:profiles!audit_logs_actor_user_id_fkey(id, full_name, email)
        `)
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AuditLog[];
    },
    enabled: !!entityType && !!entityId,
  });
}

export function useRecentAuditLogs(limit = 10) {
  return useQuery({
    queryKey: ['audit-logs-recent', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          actor:profiles!audit_logs_actor_user_id_fkey(id, full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as AuditLog[];
    },
  });
}

export function useAuditActions() {
  return useQuery({
    queryKey: ['audit-actions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('action')
        .order('action');

      if (error) throw error;
      
      const uniqueActions = [...new Set(data?.map(d => d.action))];
      return uniqueActions;
    },
  });
}

export function useAuditEntityTypes() {
  return useQuery({
    queryKey: ['audit-entity-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('entity_type')
        .order('entity_type');

      if (error) throw error;
      
      const uniqueTypes = [...new Set(data?.map(d => d.entity_type))];
      return uniqueTypes;
    },
  });
}
