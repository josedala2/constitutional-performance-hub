import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Profile, ProfileFormData, UserFilters, UserStatus } from '@/types/auth';
import { auditUserCreate, auditUserUpdate, auditUserStatusChange } from '@/services/auditService';
import { useToast } from '@/hooks/use-toast';

export function useProfiles(filters?: UserFilters) {
  return useQuery({
    queryKey: ['profiles', filters],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          org_unit:org_units(id, name)
        `)
        .order('full_name');

      if (filters?.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,employee_code.ilike.%${filters.search}%`);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.org_unit_id) {
        query = query.eq('org_unit_id', filters.org_unit_id);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Profile[];
    },
  });
}

export function useProfile(id: string) {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          org_unit:org_units(id, name)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Profile | null;
    },
    enabled: !!id,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProfileFormData> }) => {
      const { data: result, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await auditUserUpdate(id, data);
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: 'Sucesso',
        description: 'Utilizador atualizado com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o utilizador.',
        variant: 'destructive',
      });
      console.error('Erro ao atualizar perfil:', error);
    },
  });
}

export function useUpdateProfileStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status, oldStatus }: { id: string; status: UserStatus; oldStatus: UserStatus }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await auditUserStatusChange(id, oldStatus, status);
      
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: ['profile', variables.id] });
      toast({
        title: 'Sucesso',
        description: `Utilizador ${variables.status === 'ACTIVE' ? 'ativado' : 'desativado'} com sucesso.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o estado do utilizador.',
        variant: 'destructive',
      });
      console.error('Erro ao alterar estado:', error);
    },
  });
}

export function useProfileStats() {
  return useQuery({
    queryKey: ['profile-stats'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('status');

      if (error) throw error;

      const total = profiles?.length || 0;
      const active = profiles?.filter(p => p.status === 'ACTIVE').length || 0;
      const inactive = profiles?.filter(p => p.status === 'INACTIVE').length || 0;

      return { total, active, inactive };
    },
  });
}
