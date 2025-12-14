import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { OrgUnit } from '@/types/auth';
import { auditOrgUnitCreate, auditOrgUnitUpdate } from '@/services/auditService';
import { useToast } from '@/hooks/use-toast';

export function useOrgUnits() {
  return useQuery({
    queryKey: ['org-units'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('org_units')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as OrgUnit[];
    },
  });
}

export function useOrgUnit(id: string) {
  return useQuery({
    queryKey: ['org-unit', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('org_units')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as OrgUnit | null;
    },
    enabled: !!id,
  });
}

export function useCreateOrgUnit() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { name: string; parent_id?: string | null }) => {
      const { data: result, error } = await supabase
        .from('org_units')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      
      await auditOrgUnitCreate(result.id, result.name);
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-units'] });
      toast({
        title: 'Sucesso',
        description: 'Unidade orgânica criada com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.message?.includes('duplicate')
        ? 'Já existe uma unidade orgânica com este nome.'
        : 'Não foi possível criar a unidade orgânica.';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      console.error('Erro ao criar unidade orgânica:', error);
    },
  });
}

export function useUpdateOrgUnit() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string; parent_id?: string | null } }) => {
      const { data: result, error } = await supabase
        .from('org_units')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await auditOrgUnitUpdate(id, data);
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-units'] });
      queryClient.invalidateQueries({ queryKey: ['org-unit'] });
      toast({
        title: 'Sucesso',
        description: 'Unidade orgânica atualizada com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a unidade orgânica.',
        variant: 'destructive',
      });
      console.error('Erro ao atualizar unidade orgânica:', error);
    },
  });
}

export function useDeleteOrgUnit() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('org_units')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-units'] });
      toast({
        title: 'Sucesso',
        description: 'Unidade orgânica eliminada com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Não foi possível eliminar a unidade orgânica. Verifique se existem utilizadores ou sub-unidades associadas.',
        variant: 'destructive',
      });
      console.error('Erro ao eliminar unidade orgânica:', error);
    },
  });
}
