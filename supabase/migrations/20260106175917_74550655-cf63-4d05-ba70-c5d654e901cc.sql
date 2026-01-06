
-- Tabela de reclamações (Art. 32.º)
CREATE TABLE public.reclamacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  avaliacao_id UUID NOT NULL,
  ciclo_id UUID NOT NULL REFERENCES public.ciclos_avaliacao(id) ON DELETE CASCADE,
  reclamante_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  avaliador_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Dados da reclamação
  motivo TEXT NOT NULL,
  fundamentacao TEXT NOT NULL,
  documentos_anexos TEXT[],
  
  -- Prazos (Art. 32.º - 10 dias úteis para reclamar)
  data_submissao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_limite_resposta TIMESTAMP WITH TIME ZONE,
  
  -- Resposta do avaliador
  resposta_avaliador TEXT,
  data_resposta TIMESTAMP WITH TIME ZONE,
  decisao_avaliador TEXT CHECK (decisao_avaliador IN ('deferido', 'indeferido', 'parcialmente_deferido')),
  
  -- Estado do processo
  estado TEXT NOT NULL DEFAULT 'pendente' CHECK (estado IN ('pendente', 'em_analise', 'respondida', 'arquivada')),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de recursos (Art. 33.º-34.º)
CREATE TABLE public.recursos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reclamacao_id UUID REFERENCES public.reclamacoes(id) ON DELETE CASCADE,
  ciclo_id UUID NOT NULL REFERENCES public.ciclos_avaliacao(id) ON DELETE CASCADE,
  recorrente_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Dados do recurso
  motivo TEXT NOT NULL,
  fundamentacao TEXT NOT NULL,
  documentos_anexos TEXT[],
  
  -- Prazos (Art. 33.º - 10 dias úteis após resposta da reclamação)
  data_submissao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_limite_decisao TIMESTAMP WITH TIME ZONE,
  
  -- Decisão da Comissão de Avaliação
  decisao TEXT CHECK (decisao IN ('deferido', 'indeferido', 'parcialmente_deferido')),
  fundamentacao_decisao TEXT,
  data_decisao TIMESTAMP WITH TIME ZONE,
  membro_relator_id UUID REFERENCES public.profiles(id),
  
  -- Estado do processo
  estado TEXT NOT NULL DEFAULT 'pendente' CHECK (estado IN ('pendente', 'em_analise', 'em_deliberacao', 'decidido', 'arquivado')),
  
  -- Votos da comissão (JSON com {membro_id, voto, observacao})
  votos JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_reclamacoes_ciclo ON public.reclamacoes(ciclo_id);
CREATE INDEX idx_reclamacoes_reclamante ON public.reclamacoes(reclamante_id);
CREATE INDEX idx_reclamacoes_estado ON public.reclamacoes(estado);
CREATE INDEX idx_recursos_ciclo ON public.recursos(ciclo_id);
CREATE INDEX idx_recursos_recorrente ON public.recursos(recorrente_id);
CREATE INDEX idx_recursos_estado ON public.recursos(estado);

-- Enable RLS
ALTER TABLE public.reclamacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recursos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para reclamações
CREATE POLICY "Users can view own reclamacoes"
  ON public.reclamacoes FOR SELECT
  USING (
    reclamante_id = auth.uid() 
    OR avaliador_id = auth.uid()
    OR public.can_manage_users(auth.uid())
    OR public.has_role(auth.uid(), 'AUDITOR')
  );

CREATE POLICY "Users can insert own reclamacoes"
  ON public.reclamacoes FOR INSERT
  WITH CHECK (reclamante_id = auth.uid());

CREATE POLICY "Avaliadores can update reclamacoes"
  ON public.reclamacoes FOR UPDATE
  USING (
    avaliador_id = auth.uid() 
    OR public.can_manage_users(auth.uid())
  );

CREATE POLICY "Admins can delete reclamacoes"
  ON public.reclamacoes FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Políticas RLS para recursos
CREATE POLICY "Users can view own recursos"
  ON public.recursos FOR SELECT
  USING (
    recorrente_id = auth.uid()
    OR public.can_manage_users(auth.uid())
    OR public.has_role(auth.uid(), 'AUDITOR')
    OR EXISTS (
      SELECT 1 FROM public.comissao_avaliacao ca
      WHERE ca.user_id = auth.uid() AND ca.ciclo_id = recursos.ciclo_id
    )
  );

CREATE POLICY "Users can insert own recursos"
  ON public.recursos FOR INSERT
  WITH CHECK (recorrente_id = auth.uid());

CREATE POLICY "Comissao can update recursos"
  ON public.recursos FOR UPDATE
  USING (
    public.can_manage_users(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.comissao_avaliacao ca
      WHERE ca.user_id = auth.uid() AND ca.ciclo_id = recursos.ciclo_id
    )
  );

CREATE POLICY "Admins can delete recursos"
  ON public.recursos FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Triggers para updated_at
CREATE TRIGGER update_reclamacoes_updated_at
  BEFORE UPDATE ON public.reclamacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_recursos_updated_at
  BEFORE UPDATE ON public.recursos
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
