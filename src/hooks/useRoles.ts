import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Role, RoleFormData, Permission } from '@/types/auth';
import { auditRoleCreate, auditRoleUpdate, auditPermissionAssign } from '@/services/auditService';
import { useToast } from '@/hooks/use-toast';

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Role[];
    },
  });
}

export function useRole(id: string) {
  return useQuery({
    queryKey: ['role', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Role | null;
    },
    enabled: !!id,
  });
}

export function useRolePermissions(roleId: string) {
  return useQuery({
    queryKey: ['role-permissions', roleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_permissions')
        .select(`
          permission_id,
          permission:permissions(id, code, description)
        `)
        .eq('role_id', roleId);

      if (error) throw error;
      return data?.map(rp => rp.permission) as Permission[];
    },
    enabled: !!roleId,
  });
}

export function usePermissions() {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('code');

      if (error) throw error;
      return data as Permission[];
    },
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: RoleFormData) => {
      const { data: result, error } = await supabase
        .from('roles')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      
      await auditRoleCreate(result.id, result.name);
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({
        title: 'Sucesso',
        description: 'Perfil criado com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o perfil.',
        variant: 'destructive',
      });
      console.error('Erro ao criar role:', error);
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RoleFormData }) => {
      const { data: result, error } = await supabase
        .from('roles')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await auditRoleUpdate(id, { name: data.name, description: data.description });
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role'] });
      toast({
        title: 'Sucesso',
        description: 'Perfil atualizado com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o perfil.',
        variant: 'destructive',
      });
      console.error('Erro ao atualizar role:', error);
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({
        title: 'Sucesso',
        description: 'Perfil eliminado com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Não foi possível eliminar o perfil.',
        variant: 'destructive',
      });
      console.error('Erro ao eliminar role:', error);
    },
  });
}

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) => {
      // Remover todas as permissões existentes
      const { error: deleteError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', roleId);

      if (deleteError) throw deleteError;

      // Adicionar novas permissões
      if (permissionIds.length > 0) {
        const { error: insertError } = await supabase
          .from('role_permissions')
          .insert(permissionIds.map(permissionId => ({
            role_id: roleId,
            permission_id: permissionId,
          })));

        if (insertError) throw insertError;
      }

      // Buscar códigos das permissões para auditoria
      const { data: perms } = await supabase
        .from('permissions')
        .select('code')
        .in('id', permissionIds);

      const codes = perms?.map(p => p.code) || [];
      await auditPermissionAssign(roleId, codes);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['role-permissions', variables.roleId] });
      toast({
        title: 'Sucesso',
        description: 'Permissões atualizadas com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar as permissões.',
        variant: 'destructive',
      });
      console.error('Erro ao atualizar permissões:', error);
    },
  });
}

export function useRoleStats() {
  return useQuery({
    queryKey: ['role-stats'],
    queryFn: async () => {
      const { data: roles, error: rolesError } = await supabase
        .from('roles')
        .select('id');

      if (rolesError) throw rolesError;

      const { data: permissions, error: permsError } = await supabase
        .from('permissions')
        .select('id');

      if (permsError) throw permsError;

      return {
        totalRoles: roles?.length || 0,
        totalPermissions: permissions?.length || 0,
      };
    },
  });
}
