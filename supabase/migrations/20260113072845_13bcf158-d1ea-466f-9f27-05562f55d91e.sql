-- Create table for help content
CREATE TABLE public.help_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'HelpCircle',
  sections JSONB DEFAULT '[]'::jsonb,
  tips TEXT[] DEFAULT '{}',
  related_links JSONB DEFAULT '[]'::jsonb,
  legal_references TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.help_content ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read help content
CREATE POLICY "Authenticated users can view help content"
ON public.help_content
FOR SELECT
USING (true);

-- Only admins can manage help content
CREATE POLICY "Admins can manage help content"
ON public.help_content
FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_help_content_updated_at
BEFORE UPDATE ON public.help_content
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create full-text search index
CREATE INDEX idx_help_content_search ON public.help_content 
USING GIN (to_tsvector('portuguese', title || ' ' || description));

-- Insert initial help content
INSERT INTO public.help_content (route, title, description, icon, sections, tips, related_links, legal_references, keywords) VALUES
('/', 'Dashboard Principal', 'O Dashboard apresenta uma visão geral do sistema de avaliação de desempenho, incluindo estatísticas, gráficos e atividades recentes.', 'LayoutDashboard', 
 '[{"title": "Cartões de Estatísticas", "content": "Visualize métricas importantes como total de colaboradores, avaliações pendentes, taxa de conclusão e NAF médio."}, {"title": "Gráficos de Desempenho", "content": "Acompanhe tendências de desempenho, distribuição de notas e comparativos entre unidades orgânicas."}, {"title": "Atividade Recente", "content": "Veja as últimas ações realizadas no sistema, incluindo avaliações submetidas e alterações de estado."}]',
 ARRAY['Use os filtros de período para analisar dados de ciclos específicos', 'Clique nos gráficos para ver detalhes expandidos', 'O NAF é atualizado automaticamente com cada avaliação finalizada'],
 '[{"label": "Ciclos de Avaliação", "href": "/ciclos"}, {"label": "Minhas Avaliações", "href": "/avaliacoes"}]',
 ARRAY['Decreto Regulamentar n.º 26/2012', 'Lei n.º 66-B/2007 - SIADAP'],
 ARRAY['dashboard', 'estatísticas', 'gráficos', 'visão geral', 'métricas']),

('/colaboradores', 'Gestão de Colaboradores', 'Gerencie a lista de colaboradores da organização, incluindo informações pessoais, unidade orgânica e estado.', 'Users',
 '[{"title": "Lista de Colaboradores", "content": "Visualize todos os colaboradores registados no sistema com informações de contacto e unidade orgânica."}, {"title": "Filtros e Pesquisa", "content": "Use os filtros por unidade orgânica, estado ou pesquisa por nome para encontrar colaboradores específicos."}, {"title": "Ações Disponíveis", "content": "Adicione, edite ou desative colaboradores conforme as permissões do seu perfil."}]',
 ARRAY['Mantenha os dados dos colaboradores sempre atualizados', 'Colaboradores inativos não aparecem nas listas de avaliação', 'Use a exportação para relatórios externos'],
 '[{"label": "Unidades Orgânicas", "href": "/admin/unidades"}, {"label": "Perfis e Permissões", "href": "/admin/perfis"}]',
 ARRAY['Lei n.º 35/2014 - LTFP', 'Regulamento Interno de Avaliação'],
 ARRAY['colaboradores', 'funcionários', 'pessoal', 'recursos humanos']),

('/avaliacoes', 'Avaliações de Desempenho', 'Aceda às suas avaliações de desempenho, submeta autoavaliações e acompanhe o progresso das avaliações.', 'ClipboardCheck',
 '[{"title": "Minhas Avaliações", "content": "Visualize todas as suas avaliações, incluindo autoavaliações pendentes e resultados de ciclos anteriores."}, {"title": "Processo de Avaliação", "content": "Siga o fluxo de avaliação: definição de objetivos, acompanhamento, autoavaliação e avaliação final."}, {"title": "Resultados e NAF", "content": "Consulte a Nota de Avaliação Final (NAF) e a menção qualitativa após a conclusão do ciclo."}]',
 ARRAY['Complete a autoavaliação dentro do prazo estabelecido', 'Documente realizações e evidências ao longo do ciclo', 'Solicite reuniões de acompanhamento se necessário'],
 '[{"label": "Objetivos", "href": "/objectivos"}, {"label": "Competências", "href": "/competencias"}, {"label": "Reclamações", "href": "/reclamacoes"}]',
 ARRAY['Decreto Regulamentar n.º 26/2012 - Art. 12º a 18º', 'Portaria n.º 359/2013'],
 ARRAY['avaliações', 'desempenho', 'NAF', 'autoavaliação', 'nota']),

('/objectivos', 'Gestão de Objetivos', 'Defina e acompanhe os objetivos individuais e de equipa para o ciclo de avaliação.', 'Target',
 '[{"title": "Definição de Objetivos", "content": "Estabeleça objetivos SMART (Específicos, Mensuráveis, Alcançáveis, Relevantes e Temporais) para o ciclo."}, {"title": "Ponderação", "content": "Atribua pesos a cada objetivo de acordo com a sua importância estratégica."}, {"title": "Acompanhamento", "content": "Monitorize o progresso dos objetivos ao longo do ciclo com atualizações periódicas."}]',
 ARRAY['Os objetivos devem estar alinhados com os objetivos da unidade orgânica', 'A soma das ponderações deve totalizar 100%', 'Documente evidências de cumprimento regularmente'],
 '[{"label": "Avaliações", "href": "/avaliacoes"}, {"label": "Ciclos", "href": "/ciclos"}]',
 ARRAY['Decreto Regulamentar n.º 26/2012 - Art. 6º a 8º', 'Lei n.º 66-B/2007 - Art. 45º e 46º'],
 ARRAY['objetivos', 'metas', 'indicadores', 'resultados', 'SMART']),

('/competencias', 'Competências Comportamentais', 'Avalie e desenvolva as competências comportamentais definidas para o seu cargo e carreira.', 'Brain',
 '[{"title": "Lista de Competências", "content": "Visualize as competências aplicáveis ao seu perfil profissional e os comportamentos associados."}, {"title": "Níveis de Proficiência", "content": "Compreenda os diferentes níveis de demonstração de cada competência."}, {"title": "Autoavaliação", "content": "Avalie o seu próprio desempenho em cada competência com evidências concretas."}]',
 ARRAY['Identifique áreas de desenvolvimento prioritárias', 'Procure feedback contínuo sobre o seu desempenho', 'Relacione competências com situações concretas de trabalho'],
 '[{"label": "Avaliações", "href": "/avaliacoes"}, {"label": "Formação", "href": "/documentos"}]',
 ARRAY['Portaria n.º 1633/2007', 'Decreto Regulamentar n.º 26/2012 - Art. 9º e 10º'],
 ARRAY['competências', 'comportamentos', 'soft skills', 'desenvolvimento']),

('/ciclos', 'Ciclos de Avaliação', 'Gerencie os ciclos de avaliação, incluindo datas, fases e estado de cada período avaliativo.', 'Calendar',
 '[{"title": "Ciclos Ativos", "content": "Visualize o ciclo de avaliação atual e os próximos ciclos programados."}, {"title": "Fases do Ciclo", "content": "Acompanhe as diferentes fases: planeamento, execução, autoavaliação e avaliação."}, {"title": "Histórico", "content": "Consulte ciclos anteriores e os respetivos resultados agregados."}]',
 ARRAY['Respeite as datas limite de cada fase', 'Comunique alterações de calendário com antecedência', 'Archive documentação de ciclos encerrados'],
 '[{"label": "Avaliações", "href": "/avaliacoes"}, {"label": "Relatórios", "href": "/relatorios"}]',
 ARRAY['Lei n.º 66-B/2007 - Art. 41º e 42º', 'Decreto Regulamentar n.º 26/2012 - Art. 3º a 5º'],
 ARRAY['ciclos', 'períodos', 'calendário', 'fases', 'prazos']),

('/reclamacoes', 'Reclamações e Recursos', 'Submeta reclamações sobre a sua avaliação ou recursos para a Comissão Paritária.', 'Scale',
 '[{"title": "Reclamação ao Avaliador", "content": "Apresente reclamação fundamentada ao avaliador no prazo de 5 dias úteis após conhecimento da avaliação."}, {"title": "Recurso à Comissão", "content": "Se a reclamação for indeferida, pode interpor recurso à Comissão Paritária em 5 dias úteis."}, {"title": "Acompanhamento", "content": "Siga o estado das suas reclamações e recursos através desta página."}]',
 ARRAY['Fundamente sempre as suas reclamações com factos concretos', 'Junte documentação de suporte quando aplicável', 'Respeite rigorosamente os prazos legais'],
 '[{"label": "Avaliações", "href": "/avaliacoes"}, {"label": "Comissão Paritária", "href": "/admin/comissao"}]',
 ARRAY['Decreto Regulamentar n.º 26/2012 - Art. 19º a 21º', 'Lei n.º 66-B/2007 - Art. 72º e 73º'],
 ARRAY['reclamações', 'recursos', 'contestação', 'comissão paritária']),

('/relatorios', 'Relatórios e Análises', 'Aceda a relatórios detalhados sobre o desempenho individual e organizacional.', 'FileText',
 '[{"title": "Relatórios Individuais", "content": "Gere relatórios detalhados do seu desempenho ao longo dos ciclos de avaliação."}, {"title": "Relatórios Agregados", "content": "Visualize análises comparativas por unidade orgânica, carreira ou período."}, {"title": "Exportação", "content": "Exporte relatórios em formato PDF para arquivo ou partilha."}]',
 ARRAY['Use filtros para análises específicas', 'Compare resultados entre períodos para identificar tendências', 'Os relatórios oficiais requerem assinatura digital'],
 '[{"label": "Dashboard", "href": "/"}, {"label": "Avaliações", "href": "/avaliacoes"}]',
 ARRAY['Decreto Regulamentar n.º 26/2012 - Art. 22º', 'Lei n.º 66-B/2007 - Art. 74º'],
 ARRAY['relatórios', 'análises', 'estatísticas', 'exportação', 'PDF']),

('/admin/utilizadores', 'Gestão de Utilizadores', 'Administre os utilizadores do sistema, incluindo criação de contas, atribuição de perfis e gestão de acessos.', 'UserCog',
 '[{"title": "Lista de Utilizadores", "content": "Visualize todos os utilizadores registados com informações de perfil, estado e último acesso."}, {"title": "Criação de Utilizadores", "content": "Adicione novos utilizadores ao sistema com os dados necessários e perfis iniciais."}, {"title": "Gestão de Estado", "content": "Ative ou desative utilizadores conforme necessário, mantendo o histórico."}]',
 ARRAY['Atribua sempre o perfil mínimo necessário (princípio do menor privilégio)', 'Revise periodicamente os acessos ativos', 'Desative utilizadores em vez de eliminar para manter auditoria'],
 '[{"label": "Perfis", "href": "/admin/perfis"}, {"label": "Auditoria", "href": "/admin/auditoria"}]',
 ARRAY['RGPD - Regulamento Geral de Proteção de Dados', 'Lei n.º 58/2019 - Proteção de Dados Pessoais'],
 ARRAY['utilizadores', 'contas', 'acessos', 'administração']),

('/admin/perfis', 'Perfis e Permissões', 'Configure os perfis de acesso e as permissões associadas a cada função no sistema.', 'Shield',
 '[{"title": "Perfis do Sistema", "content": "Visualize os perfis predefinidos (Admin, RH, Avaliador, etc.) e os perfis personalizados."}, {"title": "Gestão de Permissões", "content": "Atribua permissões granulares a cada perfil para controlar o acesso às funcionalidades."}, {"title": "Atribuição de Perfis", "content": "Associe perfis aos utilizadores, definindo o âmbito (global ou por unidade orgânica)."}]',
 ARRAY['Perfis de sistema não podem ser eliminados', 'Documente as alterações de permissões', 'Teste as permissões após alterações significativas'],
 '[{"label": "Utilizadores", "href": "/admin/utilizadores"}, {"label": "Unidades", "href": "/admin/unidades"}]',
 ARRAY['ISO 27001 - Gestão de Acessos', 'Política de Segurança da Informação'],
 ARRAY['perfis', 'permissões', 'RBAC', 'segurança', 'acessos']),

('/admin/unidades', 'Unidades Orgânicas', 'Gerencie a estrutura organizacional através das unidades orgânicas e suas hierarquias.', 'Building2',
 '[{"title": "Estrutura Hierárquica", "content": "Visualize e edite a árvore de unidades orgânicas da organização."}, {"title": "Gestão de Unidades", "content": "Crie, edite ou desative unidades orgânicas conforme a estrutura oficial."}, {"title": "Associação de Colaboradores", "content": "Veja os colaboradores associados a cada unidade e faça transferências."}]',
 ARRAY['Mantenha a estrutura alinhada com o organograma oficial', 'Unidades com colaboradores não podem ser eliminadas', 'Use hierarquias para relatórios agregados'],
 '[{"label": "Colaboradores", "href": "/colaboradores"}, {"label": "Relatórios", "href": "/relatorios"}]',
 ARRAY['Estrutura Orgânica aprovada', 'Regulamento Interno'],
 ARRAY['unidades', 'departamentos', 'organograma', 'estrutura']),

('/admin/auditoria', 'Registos de Auditoria', 'Consulte o histórico de ações realizadas no sistema para fins de auditoria e conformidade.', 'ScrollText',
 '[{"title": "Logs de Atividade", "content": "Visualize todas as ações registadas no sistema com data, utilizador e detalhes."}, {"title": "Filtros Avançados", "content": "Filtre por tipo de ação, entidade, utilizador ou período para análises específicas."}, {"title": "Exportação", "content": "Exporte registos de auditoria para análise externa ou arquivo."}]',
 ARRAY['Revise regularmente os logs para detetar anomalias', 'Os registos são imutáveis e não podem ser eliminados', 'Configure alertas para ações críticas'],
 '[{"label": "Utilizadores", "href": "/admin/utilizadores"}, {"label": "Configurações", "href": "/configuracoes"}]',
 ARRAY['ISO 27001 - Registos de Auditoria', 'RGPD - Art. 30º'],
 ARRAY['auditoria', 'logs', 'histórico', 'rastreabilidade']),

('/admin/comissao', 'Comissão Paritária', 'Gerencie a composição e funcionamento da Comissão Paritária de Avaliação.', 'Users',
 '[{"title": "Composição", "content": "Visualize os membros efetivos e suplentes da Comissão para cada ciclo."}, {"title": "Nomeação de Membros", "content": "Adicione ou substitua membros da Comissão conforme as regras estabelecidas."}, {"title": "Recursos Pendentes", "content": "Acompanhe os recursos hierárquicos submetidos à apreciação da Comissão."}]',
 ARRAY['A Comissão deve ter composição paritária', 'Membros devem declarar impedimentos quando aplicável', 'Decisões requerem maioria dos membros presentes'],
 '[{"label": "Reclamações", "href": "/admin/reclamacoes"}, {"label": "Ciclos", "href": "/ciclos"}]',
 ARRAY['Decreto Regulamentar n.º 26/2012 - Art. 23º a 25º', 'Lei n.º 66-B/2007 - Art. 59º a 62º'],
 ARRAY['comissão', 'paritária', 'membros', 'recursos']);

-- Create function for full-text search
CREATE OR REPLACE FUNCTION public.search_help_content(search_query TEXT)
RETURNS SETOF public.help_content
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM public.help_content
  WHERE 
    to_tsvector('portuguese', title || ' ' || description) @@ plainto_tsquery('portuguese', search_query)
    OR title ILIKE '%' || search_query || '%'
    OR description ILIKE '%' || search_query || '%'
    OR EXISTS (
      SELECT 1 FROM unnest(keywords) k WHERE k ILIKE '%' || search_query || '%'
    )
    OR EXISTS (
      SELECT 1 FROM unnest(tips) t WHERE t ILIKE '%' || search_query || '%'
    )
    OR EXISTS (
      SELECT 1 FROM jsonb_array_elements(sections) s 
      WHERE s->>'title' ILIKE '%' || search_query || '%' 
      OR s->>'content' ILIKE '%' || search_query || '%'
    )
  ORDER BY 
    CASE WHEN title ILIKE '%' || search_query || '%' THEN 0 ELSE 1 END,
    CASE WHEN description ILIKE '%' || search_query || '%' THEN 0 ELSE 1 END,
    title;
$$;