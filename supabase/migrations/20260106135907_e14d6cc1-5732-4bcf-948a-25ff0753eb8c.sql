-- Criar tabela para membros da Comissão de Avaliação
-- Conforme Art. 21.º-24.º do RADFP

CREATE TABLE public.comissao_avaliacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ciclo_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tipo_membro TEXT NOT NULL CHECK (tipo_membro IN ('efectivo', 'suplente')),
  cargo_comissao TEXT NOT NULL CHECK (cargo_comissao IN ('presidente', 'vogal')),
  ordem INTEGER NOT NULL, -- 1-5 para efectivos, 1-2 para suplentes
  data_nomeacao DATE NOT NULL DEFAULT CURRENT_DATE,
  data_cessacao DATE,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Garantir unicidade de membro por ciclo
  UNIQUE(ciclo_id, user_id),
  -- Garantir unicidade de ordem por tipo
  UNIQUE(ciclo_id, tipo_membro, ordem)
);

-- Comentários para documentação
COMMENT ON TABLE public.comissao_avaliacao IS 'Membros da Comissão de Avaliação conforme Art. 21.º-24.º do RADFP';
COMMENT ON COLUMN public.comissao_avaliacao.tipo_membro IS 'efectivo (5 membros) ou suplente (2 membros)';
COMMENT ON COLUMN public.comissao_avaliacao.cargo_comissao IS 'presidente (1 por ciclo) ou vogal';
COMMENT ON COLUMN public.comissao_avaliacao.ordem IS 'Ordem do membro: 1-5 para efectivos, 1-2 para suplentes';

-- Habilitar RLS
ALTER TABLE public.comissao_avaliacao ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Authenticated users can view comissao_avaliacao"
ON public.comissao_avaliacao
FOR SELECT
USING (true);

CREATE POLICY "Admins and RH can manage comissao_avaliacao"
ON public.comissao_avaliacao
FOR ALL
USING (can_manage_users(auth.uid()))
WITH CHECK (can_manage_users(auth.uid()));

-- Trigger para updated_at
CREATE TRIGGER update_comissao_avaliacao_updated_at
BEFORE UPDATE ON public.comissao_avaliacao
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Criar tabela para ciclos de avaliação (se não existir)
CREATE TABLE IF NOT EXISTS public.ciclos_avaliacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ano INTEGER NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('anual', 'semestral')),
  semestre INTEGER CHECK (semestre IN (1, 2)),
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  estado TEXT NOT NULL DEFAULT 'aberto' CHECK (estado IN ('aberto', 'em_acompanhamento', 'fechado', 'homologado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(ano, tipo, semestre)
);

-- Habilitar RLS para ciclos
ALTER TABLE public.ciclos_avaliacao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view ciclos_avaliacao"
ON public.ciclos_avaliacao
FOR SELECT
USING (true);

CREATE POLICY "Admins and RH can manage ciclos_avaliacao"
ON public.ciclos_avaliacao
FOR ALL
USING (can_manage_users(auth.uid()))
WITH CHECK (can_manage_users(auth.uid()));

-- Trigger para updated_at
CREATE TRIGGER update_ciclos_avaliacao_updated_at
BEFORE UPDATE ON public.ciclos_avaliacao
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Adicionar FK para ciclo_id na comissao_avaliacao
ALTER TABLE public.comissao_avaliacao
ADD CONSTRAINT fk_comissao_ciclo
FOREIGN KEY (ciclo_id) REFERENCES public.ciclos_avaliacao(id) ON DELETE CASCADE;