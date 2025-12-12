// SGAD Types - Sistema de Gestão de Avaliação de Desempenho

export type UserRole = 
  | "admin" 
  | "dirigente" 
  | "avaliador" 
  | "avaliado" 
  | "utente_interno" 
  | "utente_externo";

export type EvaluationCycleStatus = 
  | "aberto" 
  | "em_acompanhamento" 
  | "fechado" 
  | "homologado";

export type EvaluationType = 
  | "superior" 
  | "pares" 
  | "utente_interno" 
  | "utente_externo";

export type ObjectiveType = "individual" | "equipa";

export type CompetencyType = "transversal" | "tecnica";

export type QualitativeGrade = 
  | "Muito Bom" 
  | "Bom" 
  | "Suficiente" 
  | "Insuficiente" 
  | "Mau";

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  cargo: string;
  carreira: string;
  unidade_organica: string;
  ativo: boolean;
  avatar_url?: string;
}

export interface EvaluationCycle {
  id: string;
  ano: number;
  tipo: "anual" | "semestral";
  semestre?: 1 | 2;
  data_inicio: string;
  data_fim: string;
  estado: EvaluationCycleStatus;
  created_at: string;
}

export interface Objective {
  id: string;
  ciclo_id: string;
  avaliado_id: string;
  tipo: ObjectiveType;
  descricao: string;
  meta_planeada: number;
  meta_realizada: number;
  grau_concretizacao: number;
  pontuacao: number;
  data_conclusao?: string;
}

export interface Competency {
  id: string;
  nome: string;
  tipo: CompetencyType;
  carreira?: string;
  comportamentos?: string[];
}

export interface CompetencyEvaluation {
  id: string;
  competencia_id: string;
  avaliado_id: string;
  avaliador_id: string;
  ciclo_id: string;
  pontuacao: number;
  comentario?: string;
}

export interface Evaluation {
  id: string;
  tipo: EvaluationType;
  ciclo_id: string;
  avaliado_id: string;
  avaliador_id: string;
  nota_final: number;
  classificacao: QualitativeGrade;
  comentarios?: string;
  anonima: boolean;
  data_avaliacao: string;
  estado: "rascunho" | "submetida" | "homologada";
}

export interface NAFCalculation {
  media_objetivos_individuais: number;
  media_objetivos_equipa: number;
  media_competencias_transversais: number;
  media_competencias_tecnicas: number;
  coef_objetivos: number;
  coef_competencias_transversais: number;
  coef_competencias_tecnicas: number;
  naf: number;
  classificacao: QualitativeGrade;
}

export interface Coefficients {
  id: string;
  tipo: "objetivos_individuais" | "objetivos_equipa" | "competencias_transversais" | "competencias_tecnicas";
  valor_percentual: number;
  ciclo_id: string;
}

// Dashboard statistics
export interface DashboardStats {
  total_colaboradores: number;
  avaliacoes_pendentes: number;
  avaliacoes_concluidas: number;
  ciclo_atual?: EvaluationCycle;
  media_geral?: number;
}

// Helper function to get qualitative grade from NAF score
export function getQualitativeGrade(naf: number): QualitativeGrade {
  if (naf >= 4.5) return "Muito Bom";
  if (naf >= 4) return "Bom";
  if (naf >= 3) return "Suficiente";
  if (naf >= 2) return "Insuficiente";
  return "Mau";
}

// Helper function to get badge variant for grade
export function getGradeVariant(grade: QualitativeGrade): "muito-bom" | "bom" | "suficiente" | "insuficiente" | "mau" {
  switch (grade) {
    case "Muito Bom": return "muito-bom";
    case "Bom": return "bom";
    case "Suficiente": return "suficiente";
    case "Insuficiente": return "insuficiente";
    case "Mau": return "mau";
  }
}

// Helper function to get status badge variant
export function getStatusVariant(status: EvaluationCycleStatus): "success" | "warning" | "info" | "secondary" {
  switch (status) {
    case "aberto": return "success";
    case "em_acompanhamento": return "warning";
    case "fechado": return "info";
    case "homologado": return "secondary";
  }
}

// Helper to translate role
export function translateRole(role: UserRole): string {
  switch (role) {
    case "admin": return "Administrador";
    case "dirigente": return "Dirigente";
    case "avaliador": return "Avaliador";
    case "avaliado": return "Avaliado";
    case "utente_interno": return "Utente Interno";
    case "utente_externo": return "Utente Externo";
  }
}

// Helper to translate status
export function translateStatus(status: EvaluationCycleStatus): string {
  switch (status) {
    case "aberto": return "Aberto";
    case "em_acompanhamento": return "Em Acompanhamento";
    case "fechado": return "Fechado";
    case "homologado": return "Homologado";
  }
}
