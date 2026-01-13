import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Target, 
  Award, 
  ClipboardCheck, 
  BarChart3, 
  FileText, 
  Settings, 
  Scale,
  Workflow,
  GitBranch,
  Search,
  Shield,
  Building2,
  UsersRound,
  ScrollText,
  Key,
  FileStack,
  Activity,
  User,
} from "lucide-react";

export interface HelpSection {
  title: string;
  content: string;
}

export interface HelpContent {
  title: string;
  description: string;
  icon: React.ElementType;
  sections: HelpSection[];
  tips?: string[];
  relatedLinks?: { label: string; href: string }[];
  legalReference?: string;
}

export const helpContentByRoute: Record<string, HelpContent> = {
  "/": {
    title: "Painel Principal",
    description: "Visão geral do sistema de gestão de avaliação de desempenho.",
    icon: LayoutDashboard,
    sections: [
      {
        title: "O que é este painel?",
        content: "O Painel Principal apresenta uma visão consolidada das principais métricas e indicadores do sistema SGAD, incluindo estatísticas de avaliações, progresso do ciclo atual e atividades recentes."
      },
      {
        title: "Como utilizar?",
        content: "Utilize os cartões informativos para acompanhar o estado das avaliações. Os gráficos mostram tendências e distribuições. Clique nos elementos para navegar para detalhes específicos."
      }
    ],
    tips: [
      "Os dados são atualizados em tempo real",
      "Utilize o menu lateral para aceder a funcionalidades específicas",
      "O período apresentado corresponde ao ciclo de avaliação ativo"
    ]
  },
  "/ciclos": {
    title: "Ciclos de Avaliação",
    description: "Gestão dos ciclos de avaliação de desempenho.",
    icon: Calendar,
    sections: [
      {
        title: "O que são Ciclos de Avaliação?",
        content: "Os ciclos de avaliação definem os períodos durante os quais decorrem as avaliações de desempenho. Podem ser anuais ou semestrais, conforme definido no RADFP."
      },
      {
        title: "Estados do Ciclo",
        content: "• Aberto: Ciclo em curso, avaliações podem ser realizadas\n• Em Preparação: Ciclo a aguardar início\n• Fechado: Ciclo terminado, apenas consulta disponível"
      },
      {
        title: "Como criar um ciclo?",
        content: "Clique em 'Novo Ciclo', preencha as datas de início e fim, selecione o tipo (anual/semestral) e confirme a criação."
      }
    ],
    tips: [
      "Apenas um ciclo pode estar ativo de cada vez",
      "Ciclos fechados não podem ser reabertos",
      "As datas do ciclo determinam os prazos das avaliações"
    ],
    legalReference: "Art. 5.º do RADFP - Periodicidade da Avaliação"
  },
  "/colaboradores": {
    title: "Colaboradores",
    description: "Gestão dos colaboradores sujeitos a avaliação.",
    icon: Users,
    sections: [
      {
        title: "Quem são os Colaboradores?",
        content: "Lista de todos os funcionários do Tribunal de Contas que participam no processo de avaliação de desempenho, seja como avaliados, avaliadores ou ambos."
      },
      {
        title: "Informações disponíveis",
        content: "• Dados pessoais e profissionais\n• Unidade orgânica de afetação\n• Categoria e carreira\n• Histórico de avaliações"
      }
    ],
    tips: [
      "Utilize a pesquisa para encontrar colaboradores rapidamente",
      "Os filtros permitem segmentar por unidade orgânica ou categoria"
    ]
  },
  "/objectivos": {
    title: "Objectivos",
    description: "Definição e gestão de objectivos individuais e de equipa.",
    icon: Target,
    sections: [
      {
        title: "O que são Objectivos?",
        content: "Os objectivos representam as metas a atingir pelos colaboradores durante o período de avaliação. Devem ser SMART: Específicos, Mensuráveis, Atingíveis, Relevantes e Temporais."
      },
      {
        title: "Tipos de Objectivos",
        content: "• Individuais: Metas específicas para cada colaborador\n• De Equipa: Metas partilhadas por uma unidade orgânica\n• Institucionais: Alinhados com os objectivos estratégicos do Tribunal"
      },
      {
        title: "Ponderação",
        content: "Cada objectivo tem uma ponderação que define o seu peso na avaliação final. A soma das ponderações deve totalizar 100%."
      }
    ],
    tips: [
      "Defina objectivos no início do ciclo de avaliação",
      "Reveja e ajuste objectivos durante as reuniões de acompanhamento",
      "Documente sempre os indicadores de medição"
    ],
    legalReference: "Art. 8.º do RADFP - Objectivos e Indicadores"
  },
  "/competencias": {
    title: "Competências",
    description: "Catálogo de competências comportamentais e técnicas.",
    icon: Award,
    sections: [
      {
        title: "O que são Competências?",
        content: "As competências são os conhecimentos, capacidades e comportamentos que os colaboradores devem demonstrar no exercício das suas funções."
      },
      {
        title: "Tipos de Competências",
        content: "• Transversais: Aplicáveis a todos os colaboradores\n• Específicas: Relacionadas com funções ou carreiras específicas\n• De Liderança: Para colaboradores com funções de chefia"
      },
      {
        title: "Níveis de Proficiência",
        content: "Cada competência pode ser avaliada em diferentes níveis, desde o básico até ao excelente, conforme a escala definida no RADFP."
      }
    ],
    tips: [
      "As competências são pré-definidas pelo sistema",
      "Algumas competências são obrigatórias para determinadas carreiras"
    ],
    legalReference: "Art. 10.º do RADFP - Avaliação de Competências"
  },
  "/avaliacoes/pessoal-tecnico": {
    title: "Ficha de Avaliação - Pessoal Técnico",
    description: "Formulário de avaliação para pessoal técnico e não técnico.",
    icon: ClipboardCheck,
    sections: [
      {
        title: "Como preencher?",
        content: "1. Selecione o colaborador a avaliar\n2. Avalie cada objectivo definido\n3. Avalie as competências comportamentais\n4. Adicione observações e fundamentação\n5. Submeta para validação"
      },
      {
        title: "Escala de Avaliação",
        content: "• NAF 1 - Insuficiente: Desempenho muito abaixo do esperado\n• NAF 2 - Adequado: Desempenho dentro do esperado\n• NAF 3 - Relevante: Desempenho acima do esperado\n• NAF 4 - Excelente: Desempenho excecional"
      }
    ],
    tips: [
      "Fundamente sempre as classificações extremas (NAF 1 e NAF 4)",
      "Guarde rascunhos regularmente",
      "Reveja antes de submeter - a submissão é irreversível"
    ],
    legalReference: "Art. 14.º do RADFP - Avaliação pelo Superior Hierárquico"
  },
  "/avaliacoes/entre-pares": {
    title: "Ficha de Avaliação - Entre Pares",
    description: "Formulário de avaliação entre colegas do mesmo nível.",
    icon: UsersRound,
    sections: [
      {
        title: "O que é a Avaliação Entre Pares?",
        content: "É uma componente da avaliação 360º onde colegas do mesmo nível hierárquico avaliam o desempenho uns dos outros, focando em aspetos de colaboração e trabalho em equipa."
      },
      {
        title: "Confidencialidade",
        content: "As avaliações entre pares são confidenciais. O avaliado recebe apenas o resultado agregado, nunca identificando os avaliadores individuais."
      }
    ],
    tips: [
      "Seja objetivo e construtivo",
      "Baseie a avaliação em factos observáveis",
      "A sua identidade é protegida"
    ],
    legalReference: "Art. 18.º do RADFP - Avaliação pelos Pares"
  },
  "/avaliacoes/utentes-internos": {
    title: "Ficha de Avaliação - Utentes Internos",
    description: "Avaliação por utilizadores internos dos serviços.",
    icon: Building2,
    sections: [
      {
        title: "Quem são os Utentes Internos?",
        content: "São colaboradores de outras unidades orgânicas que utilizam os serviços prestados pelo avaliado ou pela sua equipa."
      },
      {
        title: "Critérios de Avaliação",
        content: "• Qualidade do serviço prestado\n• Cumprimento de prazos\n• Disponibilidade e apoio\n• Comunicação e clareza"
      }
    ],
    tips: [
      "Avalie apenas colaboradores com quem teve interação direta",
      "Considere todo o período de avaliação, não apenas eventos recentes"
    ],
    legalReference: "Art. 19.º do RADFP - Avaliação pelos Utentes"
  },
  "/avaliacoes/utentes-externos": {
    title: "Ficha de Avaliação - Utentes Externos",
    description: "Avaliação por entidades externas ao Tribunal.",
    icon: Users,
    sections: [
      {
        title: "Quem são os Utentes Externos?",
        content: "São representantes de entidades externas (organismos públicos, entidades auditadas, cidadãos) que interagem com os serviços do Tribunal."
      },
      {
        title: "Importância",
        content: "Esta avaliação contribui para medir a qualidade do serviço público prestado pelo Tribunal de Contas."
      }
    ],
    legalReference: "Art. 20.º do RADFP - Avaliação por Utentes Externos"
  },
  "/avaliacoes/acompanhamento": {
    title: "Ficha de Acompanhamento",
    description: "Registo de reuniões de acompanhamento durante o ciclo.",
    icon: ClipboardCheck,
    sections: [
      {
        title: "O que são Reuniões de Acompanhamento?",
        content: "São encontros periódicos entre avaliador e avaliado para discutir o progresso dos objectivos, identificar dificuldades e ajustar expectativas."
      },
      {
        title: "Conteúdo da Ficha",
        content: "• Data e participantes da reunião\n• Pontos discutidos\n• Acordos estabelecidos\n• Próximos passos"
      }
    ],
    tips: [
      "Realize pelo menos uma reunião de acompanhamento por semestre",
      "Documente todos os acordos para referência futura",
      "Utilize como base para a avaliação final"
    ],
    legalReference: "Art. 12.º do RADFP - Acompanhamento Contínuo"
  },
  "/consulta-avaliacoes": {
    title: "Consulta de Avaliações",
    description: "Pesquisa e consulta do histórico de avaliações.",
    icon: Search,
    sections: [
      {
        title: "O que pode consultar?",
        content: "Aceda ao histórico completo de avaliações, incluindo avaliações próprias (como avaliado) e avaliações realizadas (como avaliador)."
      },
      {
        title: "Filtros Disponíveis",
        content: "• Por ciclo de avaliação\n• Por colaborador\n• Por estado da avaliação\n• Por classificação final"
      }
    ],
    tips: [
      "Exporte relatórios em PDF para arquivo",
      "Compare avaliações entre ciclos para identificar tendências"
    ]
  },
  "/relatorios": {
    title: "Relatórios",
    description: "Geração de relatórios e análises estatísticas.",
    icon: BarChart3,
    sections: [
      {
        title: "Tipos de Relatórios",
        content: "• Relatórios Individuais: Detalhes de avaliações por colaborador\n• Relatórios Agregados: Estatísticas por unidade orgânica\n• Relatórios Comparativos: Evolução entre ciclos"
      },
      {
        title: "Formatos de Exportação",
        content: "Os relatórios podem ser exportados em formato PDF para impressão ou arquivo."
      }
    ],
    tips: [
      "Utilize os filtros para personalizar os relatórios",
      "Relatórios oficiais seguem o modelo definido pelo Tribunal"
    ]
  },
  "/reclamacoes": {
    title: "Reclamações e Recursos",
    description: "Consulta e acompanhamento de reclamações e recursos.",
    icon: Scale,
    sections: [
      {
        title: "O que é uma Reclamação?",
        content: "É o meio pelo qual o avaliado pode contestar a sua avaliação junto do avaliador, apresentando fundamentação para a sua discordância."
      },
      {
        title: "O que é um Recurso?",
        content: "É o meio de impugnação da decisão do avaliador sobre a reclamação, dirigido à Comissão de Avaliação."
      },
      {
        title: "Prazos",
        content: "• Reclamação: 5 dias úteis após notificação da avaliação\n• Resposta do Avaliador: 10 dias úteis\n• Recurso: 5 dias úteis após decisão sobre reclamação\n• Decisão da Comissão: 20 dias úteis"
      }
    ],
    tips: [
      "Fundamente sempre a sua discordância com factos concretos",
      "Anexe documentos que suportem a sua posição",
      "Respeite os prazos legais"
    ],
    legalReference: "Art. 32.º-34.º do RADFP - Reclamação e Recurso"
  },
  "/documentos": {
    title: "Documentos",
    description: "Repositório de documentos e legislação.",
    icon: FileText,
    sections: [
      {
        title: "Conteúdo Disponível",
        content: "• Legislação aplicável (RADFP e diplomas conexos)\n• Manuais e guias de utilização\n• Modelos de documentos\n• Circulares e orientações"
      }
    ],
    tips: [
      "Consulte regularmente para manter-se atualizado",
      "Os documentos podem ser descarregados para consulta offline"
    ]
  },
  "/configuracoes": {
    title: "Configurações",
    description: "Preferências pessoais e configurações do sistema.",
    icon: Settings,
    sections: [
      {
        title: "O que pode configurar?",
        content: "• Preferências de notificação\n• Tema visual (claro/escuro)\n• Idioma da interface\n• Outras preferências pessoais"
      }
    ]
  },
  "/meu-perfil": {
    title: "Meu Perfil",
    description: "Gestão dos seus dados pessoais e profissionais.",
    icon: User,
    sections: [
      {
        title: "Dados Disponíveis",
        content: "Visualize e atualize os seus dados pessoais, contactos e preferências de conta."
      },
      {
        title: "Segurança",
        content: "Altere a sua palavra-passe e configure opções de segurança adicionais."
      }
    ],
    tips: [
      "Mantenha os seus contactos atualizados para receber notificações",
      "Utilize uma palavra-passe forte e única"
    ]
  },
  "/processo": {
    title: "Processo de Avaliação",
    description: "Visão geral do processo de avaliação de desempenho.",
    icon: Workflow,
    sections: [
      {
        title: "Fases do Processo",
        content: "1. Definição de Objectivos\n2. Acompanhamento Contínuo\n3. Avaliação\n4. Validação e Homologação\n5. Reclamação e Recurso"
      },
      {
        title: "Intervenientes",
        content: "• Avaliado: Colaborador sujeito a avaliação\n• Avaliador: Superior hierárquico direto\n• Comissão de Avaliação: Órgão de validação e recursos\n• Dirigente Máximo: Homologação final"
      }
    ],
    legalReference: "Art. 6.º do RADFP - Fases do Processo de Avaliação"
  },
  "/fluxograma": {
    title: "Fluxograma RADFP",
    description: "Representação visual do fluxo de avaliação.",
    icon: GitBranch,
    sections: [
      {
        title: "Como interpretar?",
        content: "O fluxograma apresenta visualmente todas as etapas do processo de avaliação, desde a abertura do ciclo até à homologação final, incluindo os caminhos alternativos em caso de reclamação ou recurso."
      }
    ],
    tips: [
      "Clique nos elementos para ver detalhes de cada etapa",
      "As cores indicam o estado atual do seu processo"
    ]
  },
  // Admin pages
  "/admin": {
    title: "Painel de Administração",
    description: "Área de administração do sistema SGAD.",
    icon: Shield,
    sections: [
      {
        title: "Funcionalidades Administrativas",
        content: "Acesso a todas as funcionalidades de gestão do sistema, incluindo utilizadores, permissões, configurações e auditoria."
      }
    ],
    tips: [
      "Acesso restrito a administradores e RH",
      "Todas as ações são registadas para auditoria"
    ]
  },
  "/admin/utilizadores": {
    title: "Gestão de Utilizadores",
    description: "Administração de contas de utilizador.",
    icon: Users,
    sections: [
      {
        title: "Operações Disponíveis",
        content: "• Criar novos utilizadores\n• Editar dados de utilizadores\n• Ativar/Desativar contas\n• Atribuir perfis e permissões"
      }
    ],
    tips: [
      "Utilizadores desativados não podem aceder ao sistema",
      "Atribua apenas as permissões necessárias"
    ]
  },
  "/admin/perfis-permissoes": {
    title: "Perfis e Permissões",
    description: "Gestão de perfis de acesso e permissões.",
    icon: Shield,
    sections: [
      {
        title: "Modelo de Permissões",
        content: "O sistema utiliza um modelo RBAC (Role-Based Access Control) onde as permissões são atribuídas a perfis, e os perfis são atribuídos aos utilizadores."
      }
    ]
  },
  "/admin/comissao": {
    title: "Comissão de Avaliação",
    description: "Gestão dos membros da Comissão de Avaliação.",
    icon: UsersRound,
    sections: [
      {
        title: "Composição",
        content: "A Comissão de Avaliação é composta por membros efetivos e suplentes, conforme definido no RADFP."
      },
      {
        title: "Competências",
        content: "• Validação de avaliações\n• Decisão sobre recursos\n• Harmonização de critérios"
      }
    ],
    legalReference: "Art. 28.º do RADFP - Comissão de Avaliação"
  },
  "/admin/reclamacoes": {
    title: "Gestão de Reclamações e Recursos",
    description: "Administração de reclamações e recursos.",
    icon: Scale,
    sections: [
      {
        title: "Funcionalidades",
        content: "• Visualizar todas as reclamações e recursos\n• Atribuir relatores\n• Registar decisões\n• Acompanhar prazos"
      }
    ],
    legalReference: "Art. 32.º-34.º do RADFP"
  },
  "/admin/unidades": {
    title: "Unidades Orgânicas",
    description: "Gestão da estrutura organizacional.",
    icon: Building2,
    sections: [
      {
        title: "Estrutura Hierárquica",
        content: "Defina a estrutura de unidades orgânicas do Tribunal, incluindo relações hierárquicas e responsáveis."
      }
    ]
  },
  "/admin/auditoria": {
    title: "Auditoria",
    description: "Registo de atividades do sistema.",
    icon: ScrollText,
    sections: [
      {
        title: "O que é registado?",
        content: "Todas as ações relevantes no sistema são registadas, incluindo logins, alterações de dados, submissões de avaliações e decisões."
      },
      {
        title: "Consulta",
        content: "Utilize os filtros para pesquisar por utilizador, tipo de ação, data ou entidade afetada."
      }
    ],
    tips: [
      "Os registos de auditoria não podem ser alterados ou eliminados",
      "Exporte para análise externa se necessário"
    ]
  },
  "/admin/workflow": {
    title: "Configuração de Workflow",
    description: "Definição dos fluxos de trabalho.",
    icon: Workflow,
    sections: [
      {
        title: "Personalização",
        content: "Configure as etapas e transições do processo de avaliação, incluindo aprovações e notificações automáticas."
      }
    ]
  },
  "/admin/acessos-modulos": {
    title: "Acessos por Módulo",
    description: "Controlo de acesso aos módulos do sistema.",
    icon: Key,
    sections: [
      {
        title: "Gestão de Acessos",
        content: "Defina quais perfis têm acesso a cada módulo do sistema."
      }
    ]
  },
  "/admin/templates-permissoes": {
    title: "Templates de Permissões",
    description: "Modelos pré-definidos de conjuntos de permissões.",
    icon: FileStack,
    sections: [
      {
        title: "Utilização",
        content: "Utilize templates para atribuir rapidamente conjuntos de permissões a novos utilizadores ou perfis."
      }
    ]
  },
  "/admin/estado-workflow": {
    title: "Estado do Workflow",
    description: "Monitorização do estado dos processos.",
    icon: Activity,
    sections: [
      {
        title: "Acompanhamento",
        content: "Visualize o estado atual de todos os processos de avaliação em curso, identificando bloqueios ou atrasos."
      }
    ]
  }
};

export function getHelpContent(pathname: string): HelpContent | null {
  // Direct match
  if (helpContentByRoute[pathname]) {
    return helpContentByRoute[pathname];
  }
  
  // Try to find a parent route match
  const segments = pathname.split('/').filter(Boolean);
  while (segments.length > 0) {
    const testPath = '/' + segments.join('/');
    if (helpContentByRoute[testPath]) {
      return helpContentByRoute[testPath];
    }
    segments.pop();
  }
  
  return null;
}
