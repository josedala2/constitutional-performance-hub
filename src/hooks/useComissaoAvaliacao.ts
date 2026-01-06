import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface MembroComissao {
  id: string;
  ciclo_id: string;
  user_id: string;
  tipo_membro: "efectivo" | "suplente";
  cargo_comissao: "presidente" | "vogal";
  ordem: number;
  data_nomeacao: string;
  data_cessacao: string | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
  profile?: {
    id: string;
    full_name: string;
    email: string;
    job_title: string | null;
    org_unit_id: string | null;
  };
}

export interface CicloAvaliacao {
  id: string;
  ano: number;
  tipo: "anual" | "semestral";
  semestre: number | null;
  data_inicio: string;
  data_fim: string;
  estado: "aberto" | "em_acompanhamento" | "fechado" | "homologado";
  created_at: string;
  updated_at: string;
}

export interface MembroFormData {
  ciclo_id: string;
  user_id: string;
  tipo_membro: "efectivo" | "suplente";
  cargo_comissao: "presidente" | "vogal";
  ordem: number;
  data_nomeacao?: string;
  observacoes?: string;
}

// Hook para buscar ciclos de avaliação
export function useCiclosAvaliacao() {
  return useQuery({
    queryKey: ["ciclos-avaliacao"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ciclos_avaliacao")
        .select("*")
        .order("ano", { ascending: false });

      if (error) throw error;
      return data as CicloAvaliacao[];
    },
  });
}

// Hook para buscar membros da comissão por ciclo
export function useMembrosComissao(cicloId: string | null) {
  return useQuery({
    queryKey: ["comissao-avaliacao", cicloId],
    queryFn: async () => {
      if (!cicloId) return [];
      
      const { data, error } = await supabase
        .from("comissao_avaliacao")
        .select(`
          *,
          profile:profiles(id, full_name, email, job_title, org_unit_id)
        `)
        .eq("ciclo_id", cicloId)
        .order("tipo_membro")
        .order("ordem");

      if (error) throw error;
      return data as MembroComissao[];
    },
    enabled: !!cicloId,
  });
}

// Hook para adicionar membro
export function useAddMembro() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MembroFormData) => {
      const { data: result, error } = await supabase
        .from("comissao_avaliacao")
        .insert({
          ciclo_id: data.ciclo_id,
          user_id: data.user_id,
          tipo_membro: data.tipo_membro,
          cargo_comissao: data.cargo_comissao,
          ordem: data.ordem,
          data_nomeacao: data.data_nomeacao || new Date().toISOString().split("T")[0],
          observacoes: data.observacoes || null,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comissao-avaliacao", variables.ciclo_id] });
      toast({
        title: "Membro adicionado",
        description: "O membro foi adicionado à comissão com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar membro",
        description: error.message || "Ocorreu um erro ao adicionar o membro.",
        variant: "destructive",
      });
    },
  });
}

// Hook para atualizar membro
export function useUpdateMembro() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, cicloId, data }: { id: string; cicloId: string; data: Partial<MembroFormData> }) => {
      const { data: result, error } = await supabase
        .from("comissao_avaliacao")
        .update({
          cargo_comissao: data.cargo_comissao,
          ordem: data.ordem,
          observacoes: data.observacoes,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { result, cicloId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comissao-avaliacao", data.cicloId] });
      toast({
        title: "Membro atualizado",
        description: "Os dados do membro foram atualizados com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar membro",
        description: error.message || "Ocorreu um erro ao atualizar o membro.",
        variant: "destructive",
      });
    },
  });
}

// Hook para remover membro
export function useRemoveMembro() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, cicloId }: { id: string; cicloId: string }) => {
      const { error } = await supabase
        .from("comissao_avaliacao")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return cicloId;
    },
    onSuccess: (cicloId) => {
      queryClient.invalidateQueries({ queryKey: ["comissao-avaliacao", cicloId] });
      toast({
        title: "Membro removido",
        description: "O membro foi removido da comissão com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover membro",
        description: error.message || "Ocorreu um erro ao remover o membro.",
        variant: "destructive",
      });
    },
  });
}

// Hook para criar ciclo de avaliação
export function useCreateCiclo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<CicloAvaliacao, "id" | "created_at" | "updated_at">) => {
      const { data: result, error } = await supabase
        .from("ciclos_avaliacao")
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ciclos-avaliacao"] });
      toast({
        title: "Ciclo criado",
        description: "O ciclo de avaliação foi criado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar ciclo",
        description: error.message || "Ocorreu um erro ao criar o ciclo.",
        variant: "destructive",
      });
    },
  });
}
