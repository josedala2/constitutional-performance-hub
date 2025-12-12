import { 
  User, 
  EvaluationCycle, 
  Objective, 
  Competency, 
  Evaluation, 
  DashboardStats,
  getQualitativeGrade 
} from "@/types/sgad";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    nome: "Dr. António Manuel Silva",
    email: "antonio.silva@tc.ao",
    role: "admin",
    cargo: "Director de Recursos Humanos",
    carreira: "Técnico Superior",
    unidade_organica: "Gabinete de Recursos Humanos",
    ativo: true,
  },
  {
    id: "2",
    nome: "Dra. Maria João Santos",
    email: "maria.santos@tc.ao",
    role: "dirigente",
    cargo: "Directora do Departamento Jurídico",
    carreira: "Técnico Superior",
    unidade_organica: "Departamento Jurídico",
    ativo: true,
  },
  {
    id: "3",
    nome: "Dr. Carlos Eduardo Pereira",
    email: "carlos.pereira@tc.ao",
    role: "avaliador",
    cargo: "Chefe de Secção",
    carreira: "Técnico Superior",
    unidade_organica: "Departamento Jurídico",
    ativo: true,
  },
  {
    id: "4",
    nome: "Ana Beatriz Fernandes",
    email: "ana.fernandes@tc.ao",
    role: "avaliado",
    cargo: "Técnica Administrativa",
    carreira: "Técnico Profissional",
    unidade_organica: "Departamento Jurídico",
    ativo: true,
  },
  {
    id: "5",
    nome: "Pedro Miguel Costa",
    email: "pedro.costa@tc.ao",
    role: "avaliado",
    cargo: "Assessor Jurídico",
    carreira: "Técnico Superior",
    unidade_organica: "Departamento Jurídico",
    ativo: true,
  },
  {
    id: "6",
    nome: "Sofia Alexandra Martins",
    email: "sofia.martins@tc.ao",
    role: "avaliado",
    cargo: "Técnica de Arquivo",
    carreira: "Técnico Profissional",
    unidade_organica: "Gabinete de Arquivo",
    ativo: true,
  },
];

// Current logged user (for demo)
export const currentUser = mockUsers[0];

// Mock Evaluation Cycles
export const mockCycles: EvaluationCycle[] = [
  {
    id: "cycle-2025-1",
    ano: 2025,
    tipo: "semestral",
    semestre: 1,
    data_inicio: "2025-01-01",
    data_fim: "2025-06-30",
    estado: "em_acompanhamento",
    created_at: "2024-12-15",
  },
  {
    id: "cycle-2024-2",
    ano: 2024,
    tipo: "semestral",
    semestre: 2,
    data_inicio: "2024-07-01",
    data_fim: "2024-12-31",
    estado: "homologado",
    created_at: "2024-06-15",
  },
  {
    id: "cycle-2024-1",
    ano: 2024,
    tipo: "semestral",
    semestre: 1,
    data_inicio: "2024-01-01",
    data_fim: "2024-06-30",
    estado: "homologado",
    created_at: "2023-12-15",
  },
];

// Mock Objectives
export const mockObjectives: Objective[] = [
  {
    id: "obj-1",
    ciclo_id: "cycle-2025-1",
    avaliado_id: "4",
    tipo: "individual",
    descricao: "Processar 150 documentos administrativos por mês",
    meta_planeada: 150,
    meta_realizada: 142,
    grau_concretizacao: 94.67,
    pontuacao: 4.7,
  },
  {
    id: "obj-2",
    ciclo_id: "cycle-2025-1",
    avaliado_id: "4",
    tipo: "individual",
    descricao: "Reduzir tempo médio de resposta em 20%",
    meta_planeada: 20,
    meta_realizada: 18,
    grau_concretizacao: 90,
    pontuacao: 4.5,
  },
  {
    id: "obj-3",
    ciclo_id: "cycle-2025-1",
    avaliado_id: "4",
    tipo: "equipa",
    descricao: "Implementar novo sistema de arquivo digital",
    meta_planeada: 100,
    meta_realizada: 85,
    grau_concretizacao: 85,
    pontuacao: 4.25,
  },
  {
    id: "obj-4",
    ciclo_id: "cycle-2025-1",
    avaliado_id: "5",
    tipo: "individual",
    descricao: "Elaborar 30 pareceres jurídicos",
    meta_planeada: 30,
    meta_realizada: 28,
    grau_concretizacao: 93.33,
    pontuacao: 4.67,
  },
  {
    id: "obj-5",
    ciclo_id: "cycle-2025-1",
    avaliado_id: "5",
    tipo: "equipa",
    descricao: "Participar em 100% das reuniões de equipa",
    meta_planeada: 100,
    meta_realizada: 100,
    grau_concretizacao: 100,
    pontuacao: 5,
  },
];

// Mock Competencies
export const mockCompetencies: Competency[] = [
  // Transversais
  { id: "comp-1", nome: "Adaptação Profissional", tipo: "transversal" },
  { id: "comp-2", nome: "Relacionamento Interpessoal", tipo: "transversal" },
  { id: "comp-3", nome: "Cooperação e Trabalho em Equipa", tipo: "transversal" },
  { id: "comp-4", nome: "Integridade e Conduta", tipo: "transversal" },
  { id: "comp-5", nome: "Assiduidade", tipo: "transversal" },
  { id: "comp-6", nome: "Pontualidade", tipo: "transversal" },
  { id: "comp-7", nome: "Utilização Adequada dos Recursos", tipo: "transversal" },
  { id: "comp-8", nome: "Apresentação", tipo: "transversal" },
  // Técnicas
  { id: "comp-9", nome: "Conhecimentos Técnicos Específicos", tipo: "tecnica", carreira: "Técnico Superior" },
  { id: "comp-10", nome: "Qualidade do Trabalho", tipo: "tecnica" },
  { id: "comp-11", nome: "Organização e Método", tipo: "tecnica" },
  { id: "comp-12", nome: "Capacidade de Análise", tipo: "tecnica", carreira: "Técnico Superior" },
];

// Mock Evaluations
export const mockEvaluations: Evaluation[] = [
  {
    id: "eval-1",
    tipo: "superior",
    ciclo_id: "cycle-2025-1",
    avaliado_id: "4",
    avaliador_id: "3",
    nota_final: 4.35,
    classificacao: "Bom",
    comentarios: "Colaboradora dedicada, com excelente desempenho nas tarefas administrativas.",
    anonima: false,
    data_avaliacao: "2025-06-15",
    estado: "submetida",
  },
  {
    id: "eval-2",
    tipo: "superior",
    ciclo_id: "cycle-2025-1",
    avaliado_id: "5",
    avaliador_id: "3",
    nota_final: 4.72,
    classificacao: "Muito Bom",
    comentarios: "Excelente assessor jurídico, com pareceres de alta qualidade técnica.",
    anonima: false,
    data_avaliacao: "2025-06-15",
    estado: "submetida",
  },
  {
    id: "eval-3",
    tipo: "pares",
    ciclo_id: "cycle-2025-1",
    avaliado_id: "4",
    avaliador_id: "5",
    nota_final: 4.5,
    classificacao: "Muito Bom",
    comentarios: "Excelente colega, sempre disponível para ajudar.",
    anonima: true,
    data_avaliacao: "2025-06-10",
    estado: "submetida",
  },
  {
    id: "eval-4",
    tipo: "superior",
    ciclo_id: "cycle-2024-2",
    avaliado_id: "4",
    avaliador_id: "3",
    nota_final: 4.2,
    classificacao: "Bom",
    comentarios: "Bom desempenho ao longo do semestre.",
    anonima: false,
    data_avaliacao: "2024-12-20",
    estado: "homologada",
  },
];

// Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  total_colaboradores: 45,
  avaliacoes_pendentes: 12,
  avaliacoes_concluidas: 33,
  ciclo_atual: mockCycles[0],
  media_geral: 4.28,
};

// Recent activity for dashboard
export interface Activity {
  id: string;
  tipo: "avaliacao_submetida" | "ciclo_criado" | "objetivo_atualizado" | "homologacao";
  descricao: string;
  data: string;
  usuario: string;
}

export const mockActivities: Activity[] = [
  {
    id: "act-1",
    tipo: "avaliacao_submetida",
    descricao: "Avaliação de Ana Beatriz Fernandes submetida",
    data: "2025-12-12T10:30:00",
    usuario: "Dr. Carlos Eduardo Pereira",
  },
  {
    id: "act-2",
    tipo: "objetivo_atualizado",
    descricao: "Objectivos do 1º semestre actualizados",
    data: "2025-12-11T14:15:00",
    usuario: "Dra. Maria João Santos",
  },
  {
    id: "act-3",
    tipo: "avaliacao_submetida",
    descricao: "Avaliação de Pedro Miguel Costa submetida",
    data: "2025-12-11T09:45:00",
    usuario: "Dr. Carlos Eduardo Pereira",
  },
  {
    id: "act-4",
    tipo: "homologacao",
    descricao: "Ciclo 2024/2º Semestre homologado",
    data: "2025-01-05T16:00:00",
    usuario: "Dr. António Manuel Silva",
  },
];

// Competency evaluations summary per employee
export interface EmployeeEvaluationSummary {
  avaliado: User;
  ciclo: EvaluationCycle;
  objetivos_individuais_media: number;
  objetivos_equipa_media: number;
  competencias_transversais_media: number;
  competencias_tecnicas_media: number;
  naf: number;
  classificacao: string;
  estado: "pendente" | "em_progresso" | "concluida" | "homologada";
}

export const mockEmployeeSummaries: EmployeeEvaluationSummary[] = [
  {
    avaliado: mockUsers[3],
    ciclo: mockCycles[0],
    objetivos_individuais_media: 4.6,
    objetivos_equipa_media: 4.25,
    competencias_transversais_media: 4.4,
    competencias_tecnicas_media: 4.3,
    naf: 4.35,
    classificacao: getQualitativeGrade(4.35),
    estado: "em_progresso",
  },
  {
    avaliado: mockUsers[4],
    ciclo: mockCycles[0],
    objetivos_individuais_media: 4.67,
    objetivos_equipa_media: 5.0,
    competencias_transversais_media: 4.8,
    competencias_tecnicas_media: 4.7,
    naf: 4.72,
    classificacao: getQualitativeGrade(4.72),
    estado: "concluida",
  },
  {
    avaliado: mockUsers[5],
    ciclo: mockCycles[0],
    objetivos_individuais_media: 3.8,
    objetivos_equipa_media: 4.0,
    competencias_transversais_media: 4.2,
    competencias_tecnicas_media: 3.9,
    naf: 3.95,
    classificacao: getQualitativeGrade(3.95),
    estado: "pendente",
  },
];
