// Templates de permissões pré-definidos para aplicação rápida em perfis

export interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: "system" | "evaluation" | "reports" | "custom";
  permissions: string[]; // Array de códigos de permissão (ex: "users.read", "evaluations.create")
}

// Grupos de permissões por área funcional
export const PERMISSION_GROUPS = {
  // Gestão de Utilizadores
  users_full: ["users.create", "users.read", "users.update", "users.delete", "users.disable"],
  users_read: ["users.read"],
  users_manage: ["users.read", "users.update", "users.disable"],
  
  // Perfis e Permissões
  roles_full: ["roles.create", "roles.read", "roles.update", "roles.delete", "roles.assign"],
  roles_read: ["roles.read"],
  roles_assign: ["roles.read", "roles.assign"],
  
  // Permissões
  permissions_full: ["permissions.create", "permissions.read", "permissions.update", "permissions.delete"],
  permissions_read: ["permissions.read"],
  
  // Auditoria
  audit_full: ["audit.read", "audit.delete"],
  audit_read: ["audit.read"],
  
  // Avaliações
  evaluations_full: ["evaluations.create", "evaluations.read", "evaluations.update", "evaluations.delete"],
  evaluations_create: ["evaluations.create", "evaluations.read", "evaluations.update"],
  evaluations_read: ["evaluations.read"],
  
  // Objectivos
  objectives_full: ["objectives.create", "objectives.read", "objectives.update", "objectives.delete"],
  objectives_create: ["objectives.create", "objectives.read", "objectives.update"],
  objectives_read: ["objectives.read"],
  
  // Competências
  competencies_full: ["competencies.create", "competencies.read", "competencies.update", "competencies.delete"],
  competencies_read: ["competencies.read"],
  
  // Ciclos
  cycles_full: ["cycles.create", "cycles.read", "cycles.update", "cycles.delete"],
  cycles_read: ["cycles.read"],
  
  // Relatórios
  reports_full: ["reports.create", "reports.read", "reports.update", "reports.delete"],
  reports_read: ["reports.read"],
  
  // Documentos
  documents_full: ["documents.create", "documents.read", "documents.update", "documents.delete"],
  documents_read: ["documents.read"],
  
  // Unidades Orgânicas
  org_units_full: ["org_units.create", "org_units.read", "org_units.update", "org_units.delete"],
  org_units_read: ["org_units.read"],
  
  // Colaboradores
  employees_full: ["employees.create", "employees.read", "employees.update", "employees.delete"],
  employees_read: ["employees.read"],
};

// Templates pré-definidos
export const PERMISSION_TEMPLATES: PermissionTemplate[] = [
  {
    id: "admin_full",
    name: "Administrador Completo",
    description: "Acesso total a todas as funcionalidades do sistema, incluindo configurações e auditoria.",
    icon: "Shield",
    color: "bg-red-500/10 text-red-700 border-red-500/20",
    category: "system",
    permissions: [
      ...PERMISSION_GROUPS.users_full,
      ...PERMISSION_GROUPS.roles_full,
      ...PERMISSION_GROUPS.permissions_full,
      ...PERMISSION_GROUPS.audit_full,
      ...PERMISSION_GROUPS.evaluations_full,
      ...PERMISSION_GROUPS.objectives_full,
      ...PERMISSION_GROUPS.competencies_full,
      ...PERMISSION_GROUPS.cycles_full,
      ...PERMISSION_GROUPS.reports_full,
      ...PERMISSION_GROUPS.documents_full,
      ...PERMISSION_GROUPS.org_units_full,
      ...PERMISSION_GROUPS.employees_full,
    ],
  },
  {
    id: "rh_manager",
    name: "Gestor de RH",
    description: "Gestão de utilizadores, perfis e visualização de auditoria. Ideal para equipas de recursos humanos.",
    icon: "Users",
    color: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    category: "system",
    permissions: [
      ...PERMISSION_GROUPS.users_manage,
      ...PERMISSION_GROUPS.roles_assign,
      ...PERMISSION_GROUPS.audit_read,
      ...PERMISSION_GROUPS.employees_full,
      ...PERMISSION_GROUPS.org_units_read,
      ...PERMISSION_GROUPS.evaluations_read,
      ...PERMISSION_GROUPS.reports_read,
    ],
  },
  {
    id: "auditor",
    name: "Auditor",
    description: "Acesso somente leitura a logs de auditoria e relatórios para fins de conformidade.",
    icon: "Eye",
    color: "bg-purple-500/10 text-purple-700 border-purple-500/20",
    category: "system",
    permissions: [
      ...PERMISSION_GROUPS.audit_read,
      ...PERMISSION_GROUPS.users_read,
      ...PERMISSION_GROUPS.roles_read,
      ...PERMISSION_GROUPS.permissions_read,
      ...PERMISSION_GROUPS.evaluations_read,
      ...PERMISSION_GROUPS.reports_read,
    ],
  },
  {
    id: "dirigente",
    name: "Dirigente / Chefe de Unidade",
    description: "Gestão de avaliações e objectivos da sua unidade orgânica, com acesso a relatórios.",
    icon: "Briefcase",
    color: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    category: "evaluation",
    permissions: [
      ...PERMISSION_GROUPS.evaluations_create,
      ...PERMISSION_GROUPS.objectives_create,
      ...PERMISSION_GROUPS.competencies_read,
      ...PERMISSION_GROUPS.cycles_read,
      ...PERMISSION_GROUPS.reports_read,
      ...PERMISSION_GROUPS.documents_full,
      ...PERMISSION_GROUPS.employees_read,
    ],
  },
  {
    id: "avaliador",
    name: "Avaliador",
    description: "Criar e gerir avaliações dos colaboradores atribuídos, definir objectivos e submeter pareceres.",
    icon: "ClipboardCheck",
    color: "bg-green-500/10 text-green-700 border-green-500/20",
    category: "evaluation",
    permissions: [
      ...PERMISSION_GROUPS.evaluations_create,
      ...PERMISSION_GROUPS.objectives_create,
      ...PERMISSION_GROUPS.competencies_read,
      ...PERMISSION_GROUPS.cycles_read,
      ...PERMISSION_GROUPS.documents_full,
    ],
  },
  {
    id: "avaliado",
    name: "Avaliado / Colaborador",
    description: "Visualizar as suas avaliações, propor objectivos e consultar o seu histórico de desempenho.",
    icon: "User",
    color: "bg-teal-500/10 text-teal-700 border-teal-500/20",
    category: "evaluation",
    permissions: [
      "evaluations.read",
      "objectives.read",
      "objectives.create",
      "competencies.read",
      "cycles.read",
      "documents.read",
      "documents.create",
      "reports.read",
    ],
  },
  {
    id: "reports_analyst",
    name: "Analista de Relatórios",
    description: "Acesso completo a relatórios e estatísticas para análise de desempenho organizacional.",
    icon: "BarChart3",
    color: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
    category: "reports",
    permissions: [
      ...PERMISSION_GROUPS.reports_full,
      ...PERMISSION_GROUPS.evaluations_read,
      ...PERMISSION_GROUPS.objectives_read,
      ...PERMISSION_GROUPS.competencies_read,
      ...PERMISSION_GROUPS.cycles_read,
      ...PERMISSION_GROUPS.employees_read,
      ...PERMISSION_GROUPS.org_units_read,
    ],
  },
  {
    id: "read_only",
    name: "Somente Leitura",
    description: "Acesso de visualização a todas as áreas sem possibilidade de edição ou criação.",
    icon: "BookOpen",
    color: "bg-gray-500/10 text-gray-700 border-gray-500/20",
    category: "custom",
    permissions: [
      ...PERMISSION_GROUPS.users_read,
      ...PERMISSION_GROUPS.roles_read,
      ...PERMISSION_GROUPS.permissions_read,
      ...PERMISSION_GROUPS.evaluations_read,
      ...PERMISSION_GROUPS.objectives_read,
      ...PERMISSION_GROUPS.competencies_read,
      ...PERMISSION_GROUPS.cycles_read,
      ...PERMISSION_GROUPS.reports_read,
      ...PERMISSION_GROUPS.documents_read,
      ...PERMISSION_GROUPS.org_units_read,
      ...PERMISSION_GROUPS.employees_read,
    ],
  },
  {
    id: "comissao_avaliacao",
    name: "Membro da Comissão de Avaliação",
    description: "Acesso especial para membros da comissão de avaliação, incluindo recursos e reclamações.",
    icon: "Scale",
    color: "bg-orange-500/10 text-orange-700 border-orange-500/20",
    category: "evaluation",
    permissions: [
      ...PERMISSION_GROUPS.evaluations_read,
      "evaluations.update",
      ...PERMISSION_GROUPS.objectives_read,
      ...PERMISSION_GROUPS.competencies_read,
      ...PERMISSION_GROUPS.cycles_read,
      ...PERMISSION_GROUPS.reports_read,
      ...PERMISSION_GROUPS.documents_full,
      ...PERMISSION_GROUPS.employees_read,
    ],
  },
  {
    id: "utente_interno",
    name: "Utente Interno",
    description: "Acesso limitado para submissão de avaliações de satisfação como utente interno.",
    icon: "Building2",
    color: "bg-cyan-500/10 text-cyan-700 border-cyan-500/20",
    category: "custom",
    permissions: [
      "evaluations.read",
      "evaluations.create",
    ],
  },
];

// Categorias de templates
export const TEMPLATE_CATEGORIES = {
  system: {
    label: "Sistema",
    description: "Templates para administração e gestão do sistema",
    color: "bg-red-500/10 text-red-700",
  },
  evaluation: {
    label: "Avaliação",
    description: "Templates para o processo de avaliação de desempenho",
    color: "bg-green-500/10 text-green-700",
  },
  reports: {
    label: "Relatórios",
    description: "Templates focados em análise e relatórios",
    color: "bg-indigo-500/10 text-indigo-700",
  },
  custom: {
    label: "Personalizado",
    description: "Templates para casos de uso específicos",
    color: "bg-gray-500/10 text-gray-700",
  },
};

// Helper para obter template por ID
export function getTemplateById(id: string): PermissionTemplate | undefined {
  return PERMISSION_TEMPLATES.find(t => t.id === id);
}

// Helper para obter templates por categoria
export function getTemplatesByCategory(category: PermissionTemplate["category"]): PermissionTemplate[] {
  return PERMISSION_TEMPLATES.filter(t => t.category === category);
}

// Helper para obter permissões únicas de um template
export function getUniquePermissions(template: PermissionTemplate): string[] {
  return [...new Set(template.permissions)];
}

// Helper para comparar permissões entre template e lista atual
export function compareWithTemplate(template: PermissionTemplate, currentPermissions: string[]): {
  matching: string[];
  missing: string[];
  extra: string[];
  matchPercentage: number;
} {
  const templatePerms = new Set(getUniquePermissions(template));
  const currentPerms = new Set(currentPermissions);
  
  const matching = [...templatePerms].filter(p => currentPerms.has(p));
  const missing = [...templatePerms].filter(p => !currentPerms.has(p));
  const extra = [...currentPerms].filter(p => !templatePerms.has(p));
  
  const matchPercentage = templatePerms.size > 0 
    ? Math.round((matching.length / templatePerms.size) * 100) 
    : 0;
  
  return { matching, missing, extra, matchPercentage };
}
