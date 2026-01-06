import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Reclamacao {
  id: string;
  avaliacao_id: string;
  ciclo_id: string;
  reclamante_id: string;
  avaliador_id: string;
  motivo: string;
  fundamentacao: string;
  documentos_anexos: string[] | null;
  data_submissao: string;
  data_limite_resposta: string | null;
  resposta_avaliador: string | null;
  data_resposta: string | null;
  decisao_avaliador: "deferido" | "indeferido" | "parcialmente_deferido" | null;
  estado: "pendente" | "em_analise" | "respondida" | "arquivada";
  created_at: string;
  updated_at: string;
  reclamante?: { id: string; full_name: string; email: string };
  avaliador?: { id: string; full_name: string; email: string };
}

export interface Recurso {
  id: string;
  reclamacao_id: string | null;
  ciclo_id: string;
  recorrente_id: string;
  motivo: string;
  fundamentacao: string;
  documentos_anexos: string[] | null;
  data_submissao: string;
  data_limite_decisao: string | null;
  decisao: "deferido" | "indeferido" | "parcialmente_deferido" | null;
  fundamentacao_decisao: string | null;
  data_decisao: string | null;
  membro_relator_id: string | null;
  estado: "pendente" | "em_analise" | "em_deliberacao" | "decidido" | "arquivado";
  votos: Array<{ membro_id: string; voto: string; observacao?: string }>;
  created_at: string;
  updated_at: string;
  recorrente?: { id: string; full_name: string; email: string };
  membro_relator?: { id: string; full_name: string };
  reclamacao?: Reclamacao;
}

// Fetch reclamações by ciclo
export function useReclamacoes(cicloId?: string) {
  return useQuery({
    queryKey: ["reclamacoes", cicloId],
    queryFn: async () => {
      let query = supabase
        .from("reclamacoes")
        .select(`
          *,
          reclamante:profiles!reclamacoes_reclamante_id_fkey(id, full_name, email),
          avaliador:profiles!reclamacoes_avaliador_id_fkey(id, full_name, email)
        `)
        .order("data_submissao", { ascending: false });

      if (cicloId) {
        query = query.eq("ciclo_id", cicloId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Reclamacao[];
    },
    enabled: true,
  });
}

// Fetch recursos by ciclo
export function useRecursos(cicloId?: string) {
  return useQuery({
    queryKey: ["recursos", cicloId],
    queryFn: async () => {
      let query = supabase
        .from("recursos")
        .select(`
          *,
          recorrente:profiles!recursos_recorrente_id_fkey(id, full_name, email),
          membro_relator:profiles!recursos_membro_relator_id_fkey(id, full_name)
        `)
        .order("data_submissao", { ascending: false });

      if (cicloId) {
        query = query.eq("ciclo_id", cicloId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Recurso[];
    },
    enabled: true,
  });
}

// Create reclamação
export function useCreateReclamacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      avaliacao_id: string;
      ciclo_id: string;
      reclamante_id: string;
      avaliador_id: string;
      motivo: string;
      fundamentacao: string;
    }) => {
      // Prazo de 15 dias úteis para resposta (Art. 32.º)
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() + 21); // ~15 dias úteis

      const { data: result, error } = await supabase
        .from("reclamacoes")
        .insert({
          ...data,
          data_limite_resposta: dataLimite.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reclamacoes"] });
      toast.success("Reclamação submetida com sucesso");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao submeter reclamação: ${error.message}`);
    },
  });
}

// Respond to reclamação (avaliador)
export function useRespondReclamacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      resposta_avaliador,
      decisao_avaliador,
    }: {
      id: string;
      resposta_avaliador: string;
      decisao_avaliador: "deferido" | "indeferido" | "parcialmente_deferido";
    }) => {
      const { data, error } = await supabase
        .from("reclamacoes")
        .update({
          resposta_avaliador,
          decisao_avaliador,
          data_resposta: new Date().toISOString(),
          estado: "respondida",
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reclamacoes"] });
      toast.success("Resposta registada com sucesso");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao responder: ${error.message}`);
    },
  });
}

// Create recurso
export function useCreateRecurso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      reclamacao_id?: string;
      ciclo_id: string;
      recorrente_id: string;
      motivo: string;
      fundamentacao: string;
    }) => {
      // Prazo de 30 dias para decisão da Comissão (Art. 34.º)
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() + 30);

      const { data: result, error } = await supabase
        .from("recursos")
        .insert({
          ...data,
          data_limite_decisao: dataLimite.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recursos"] });
      toast.success("Recurso submetido com sucesso");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao submeter recurso: ${error.message}`);
    },
  });
}

// Update recurso (Comissão)
export function useUpdateRecurso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: string;
      estado?: string;
      decisao?: "deferido" | "indeferido" | "parcialmente_deferido";
      fundamentacao_decisao?: string;
      membro_relator_id?: string;
      votos?: Array<{ membro_id: string; voto: string; observacao?: string }>;
    }) => {
      const updateData: Record<string, unknown> = { ...updates };
      
      if (updates.decisao) {
        updateData.data_decisao = new Date().toISOString();
        updateData.estado = "decidido";
      }

      const { data, error } = await supabase
        .from("recursos")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recursos"] });
      toast.success("Recurso actualizado com sucesso");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao actualizar recurso: ${error.message}`);
    },
  });
}

// Statistics
export function useReclamacoesRecursosStats(cicloId?: string) {
  const { data: reclamacoes } = useReclamacoes(cicloId);
  const { data: recursos } = useRecursos(cicloId);

  return {
    totalReclamacoes: reclamacoes?.length || 0,
    reclamacoesPendentes: reclamacoes?.filter((r) => r.estado === "pendente").length || 0,
    reclamacoesRespondidas: reclamacoes?.filter((r) => r.estado === "respondida").length || 0,
    totalRecursos: recursos?.length || 0,
    recursosPendentes: recursos?.filter((r) => r.estado === "pendente" || r.estado === "em_analise").length || 0,
    recursosDecididos: recursos?.filter((r) => r.estado === "decidido").length || 0,
  };
}
