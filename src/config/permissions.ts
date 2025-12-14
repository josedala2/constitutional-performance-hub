// SGAD - Sistema de Gestão de Avaliação de Desempenho
// Configuração de Permissões e Módulos

export const APP_CONFIG = {
  app: "SGAD - Tribunal Constitucional",
  version: "1.0.0",
} as const;

// Tipos de roles do sistema
export type AppRole = 
  | "admin" 
  | "dirigente" 
  | "avaliador" 
  | "avaliado" 
  | "utente_interno" 
  | "utente_externo";

// Tipos de ações permitidas
export type PermissionAction = "view" | "create" | "update" | "delete";

// Códigos dos módulos
export type ModuleCode = 
  | "M01" | "M02" | "M03" | "M04" | "M05" | "M06" 
  | "M07" | "M08" | "M09" | "M10" | "M11" | "M12" 
  | "M13" | "M14" | "M15" | "M16" | "M17" | "M18";

// Estados do ciclo de avaliação
export type CycleState = "aberto" | "em_acompanhamento" | "fechado" | "homologado";

// Definição dos módulos
export interface ModuleDefinition {
  code: ModuleCode;
  name: string;
  label: string;
  description: string;
  route?: string;
}

// Definição de escopo
export type Scope = 
  | "all_data"
  | "all_units"
  | "system_configuration"
  | "read_only_after_homologation_except_audit"
  | "own_unit"
  | "subordinates_only"
  | "cannot_edit_after_homologation"
  | "assigned_evaluations_only"
  | "cannot_homologate"
  | "cannot_view_other_units"
  | "self_only"
  | "cannot_edit_after_cycle_closed"
  | "cannot_view_reviewer_identity_of_users"
  | "submit_only"
  | "no_access_to_results"
  | "minimal_personal_data"
  | "no_auth_required_optional_token"
  | "no_access_to_internal_data";

// Configuração de privacidade
export interface PrivacyConfig {
  hide_peer_reviewer_identity_when_anonymous?: boolean;
  never_show_utente_identities?: boolean;
  anonymous_submission_optional?: boolean;
  anonymous_submission_required?: boolean;
}

// Permissões de um role
export interface RolePermissions {
  modules: Partial<Record<ModuleCode, PermissionAction[]>>;
  scopes: Scope[];
  privacy?: PrivacyConfig;
}

// Catálogo de módulos
export const MODULES: ModuleDefinition[] = [
  { code: "M01", name: "AutenticacaoConta", label: "Autenticação e Conta", description: "Gestão de autenticação e perfil de utilizador", route: "/auth" },
  { code: "M02", name: "AdministracaoSistema", label: "Administração do Sistema", description: "Configurações gerais do sistema", route: "/configuracoes" },
  { code: "M03", name: "EstruturaOrganizacional", label: "Estrutura Organizacional", description: "Gestão de unidades orgânicas e hierarquia", route: "/estrutura" },
  { code: "M04", name: "GestaoUtilizadores", label: "Gestão de Utilizadores", description: "Administração de utilizadores e perfis", route: "/colaboradores" },
  { code: "M05", name: "CiclosAvaliacao", label: "Ciclos de Avaliação", description: "Gestão de ciclos de avaliação de desempenho", route: "/ciclos" },
  { code: "M06", name: "CatalogoCompetencias", label: "Catálogo de Competências", description: "Definição e gestão de competências", route: "/competencias" },
  { code: "M07", name: "ObjetivosMetas", label: "Objetivos e Metas", description: "Definição de objetivos individuais e de equipa", route: "/objectivos" },
  { code: "M08", name: "AcompanhamentoIntermedio", label: "Acompanhamento Intermédio", description: "Monitorização contínua do desempenho", route: "/avaliacoes/acompanhamento" },
  { code: "M09", name: "AvaliacaoSuperior", label: "Avaliação Superior", description: "Avaliação pelo superior hierárquico", route: "/avaliacoes/pessoal-tecnico" },
  { code: "M10", name: "AvaliacaoPares", label: "Avaliação entre Pares", description: "Avaliação por colegas de trabalho", route: "/avaliacoes/entre-pares" },
  { code: "M11", name: "AvaliacaoUtenteInterno", label: "Avaliação Utente Interno", description: "Avaliação por utentes internos", route: "/avaliacoes/utentes-internos" },
  { code: "M12", name: "AvaliacaoUtenteExterno", label: "Avaliação Utente Externo", description: "Avaliação por utentes externos", route: "/avaliacoes/utentes-externos" },
  { code: "M13", name: "CalculoNAFClassificacao", label: "Cálculo NAF e Classificação", description: "Cálculo da Nota de Avaliação Final", route: "/naf" },
  { code: "M14", name: "HomologacaoFecho", label: "Homologação e Fecho", description: "Processo de homologação e fecho de ciclos", route: "/homologacao" },
  { code: "M15", name: "RelatoriosEstatisticas", label: "Relatórios e Estatísticas", description: "Geração de relatórios e análises", route: "/relatorios" },
  { code: "M16", name: "AuditoriaLogs", label: "Auditoria e Logs", description: "Registo e consulta de atividades", route: "/auditoria" },
  { code: "M17", name: "GestaoDocumental", label: "Gestão Documental", description: "Gestão de documentos e anexos", route: "/documentos" },
  { code: "M18", name: "Notificacoes", label: "Notificações", description: "Sistema de notificações e alertas", route: "/notificacoes" },
];

// Permissões por role
export const ROLE_PERMISSIONS: Record<AppRole, RolePermissions> = {
  admin: {
    modules: {
      M01: ["view", "create", "update", "delete"],
      M02: ["view", "create", "update", "delete"],
      M03: ["view", "create", "update", "delete"],
      M04: ["view", "create", "update", "delete"],
      M05: ["view", "create", "update", "delete"],
      M06: ["view", "create", "update", "delete"],
      M07: ["view", "create", "update", "delete"],
      M08: ["view", "create", "update", "delete"],
      M09: ["view", "create", "update", "delete"],
      M10: ["view", "create", "update", "delete"],
      M11: ["view", "create", "update", "delete"],
      M12: ["view", "create", "update", "delete"],
      M13: ["view", "create", "update", "delete"],
      M14: ["view", "create", "update", "delete"],
      M15: ["view", "create", "update", "delete"],
      M16: ["view", "create", "update", "delete"],
      M17: ["view", "create", "update", "delete"],
      M18: ["view", "create", "update", "delete"],
    },
    scopes: [
      "all_data",
      "all_units",
      "system_configuration",
      "read_only_after_homologation_except_audit",
    ],
  },

  dirigente: {
    modules: {
      M01: ["view", "update"],
      M03: ["view"],
      M05: ["view"],
      M07: ["view", "create", "update"],
      M08: ["view", "create", "update"],
      M09: ["view", "create", "update"],
      M10: ["view"],
      M13: ["view"],
      M14: ["view", "create", "update"],
      M15: ["view"],
      M17: ["view", "create", "update"],
      M18: ["view"],
    },
    scopes: [
      "own_unit",
      "subordinates_only",
      "cannot_edit_after_homologation",
    ],
    privacy: {
      hide_peer_reviewer_identity_when_anonymous: true,
    },
  },

  avaliador: {
    modules: {
      M01: ["view", "update"],
      M05: ["view"],
      M07: ["view", "update"],
      M08: ["view", "create", "update"],
      M09: ["view", "create", "update"],
      M10: ["view", "create", "update"],
      M13: ["view"],
      M17: ["view", "create", "update"],
      M18: ["view"],
    },
    scopes: [
      "assigned_evaluations_only",
      "cannot_homologate",
      "cannot_view_other_units",
    ],
    privacy: {
      hide_peer_reviewer_identity_when_anonymous: true,
    },
  },

  avaliado: {
    modules: {
      M01: ["view", "update"],
      M05: ["view"],
      M07: ["view", "create", "update"],
      M08: ["view", "create", "update"],
      M13: ["view"],
      M15: ["view"],
      M17: ["view", "create", "update"],
      M18: ["view"],
    },
    scopes: [
      "self_only",
      "cannot_edit_after_cycle_closed",
      "cannot_view_reviewer_identity_of_users",
    ],
    privacy: {
      never_show_utente_identities: true,
    },
  },

  utente_interno: {
    modules: {
      M01: ["view", "update"],
      M11: ["view", "create"],
      M18: ["view"],
    },
    scopes: [
      "submit_only",
      "no_access_to_results",
      "minimal_personal_data",
    ],
    privacy: {
      anonymous_submission_optional: true,
    },
  },

  utente_externo: {
    modules: {
      M12: ["view", "create"],
    },
    scopes: [
      "submit_only",
      "no_access_to_results",
      "no_access_to_internal_data",
    ],
    privacy: {
      anonymous_submission_required: true,
    },
  },
};

// Regras globais
export const GLOBAL_RULES = {
  cycle_states: ["aberto", "em_acompanhamento", "fechado", "homologado"] as CycleState[],
  
  lock_rules: [
    {
      when: "ciclo.estado in ['fechado','homologado']",
      lock: ["M07.update", "M08.update", "M09.update", "M10.update", "M11.update", "M12.update"],
      exceptions: ["admin.audit_only"],
    },
  ],

  audit: {
    enabled: true,
    log_events: [
      "auth.login",
      "user.create",
      "user.update",
      "cycle.create",
      "cycle.update",
      "objective.create",
      "objective.update",
      "evaluation.create",
      "evaluation.update",
      "report.generate",
      "report.download",
    ] as const,
  },
} as const;

// Tipos de eventos de auditoria
export type AuditEvent = typeof GLOBAL_RULES.audit.log_events[number];

// Tradução de roles para português
export const ROLE_LABELS: Record<AppRole, string> = {
  admin: "Administrador",
  dirigente: "Dirigente",
  avaliador: "Avaliador",
  avaliado: "Avaliado",
  utente_interno: "Utente Interno",
  utente_externo: "Utente Externo",
};

// Helper para obter módulo por código
export function getModuleByCode(code: ModuleCode): ModuleDefinition | undefined {
  return MODULES.find(m => m.code === code);
}

// Helper para obter módulo por rota
export function getModuleByRoute(route: string): ModuleDefinition | undefined {
  return MODULES.find(m => m.route === route);
}

// Helper para obter módulos acessíveis por role
export function getAccessibleModules(role: AppRole): ModuleDefinition[] {
  const permissions = ROLE_PERMISSIONS[role];
  const moduleCodes = Object.keys(permissions.modules) as ModuleCode[];
  return MODULES.filter(m => moduleCodes.includes(m.code));
}
