import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, UserRoleAssignment } from '@/types/auth';
import { auditUserRoleAssign, auditUserRoleRemove } from '@/services/auditService';
import { useToast } from '@/hooks/use-toast';

export function useUserRoles(userId: string) {
  return useQuery({
    queryKey: ['user-roles', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          role:roles(id, name, description, is_system),
          org_unit:org_units(id, name)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data as UserRole[];
    },
    enabled: !!userId,
  });
}

export function useAssignUserRole() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, assignment }: { userId: string; assignment: UserRoleAssignment }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role_id: assignment.role_id,
          scope_type: assignment.scope_type,
          scope_id: assignment.scope_id || null,
        })
        .select(`
          *,
          role:roles(id, name)
        `)
        .single();

      if (error) throw error;
      
      await auditUserRoleAssign(userId, assignment.role_id, data.role?.name || '');
      
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-roles', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: 'Sucesso',
        description: 'Perfil atribuído com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.message?.includes('duplicate')
        ? 'Este perfil já está atribuído ao utilizador.'
        : 'Não foi possível atribuir o perfil.';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      console.error('Erro ao atribuir role:', error);
    },
  });
}

export function useRemoveUserRole() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userRoleId, userId, roleId, roleName }: { 
      userRoleId: string; 
      userId: string; 
      roleId: string;
      roleName: string;
    }) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', userRoleId);

      if (error) throw error;
      
      await auditUserRoleRemove(userId, roleId, roleName);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-roles', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: 'Sucesso',
        description: 'Perfil removido com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o perfil.',
        variant: 'destructive',
      });
      console.error('Erro ao remover role:', error);
    },
  });
}
