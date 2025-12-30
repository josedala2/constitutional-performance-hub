import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDown,
  Play,
  Target,
  FileCheck,
  Users,
  ClipboardCheck,
  MessageSquare,
  Send,
  CheckCircle2,
  Bell,
  AlertCircle,
  Archive,
  CalendarClock,
  UserCheck,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FlowStep {
  numero: number;
  titulo: string;
  responsavel: string;
  descricao: string;
  artigos?: string;
  icon: React.ElementType;
  color: string;
  acoes?: string[];
}

const flowSteps: FlowStep[] = [
  {
    numero: 1,
    titulo: "Início do Ciclo de Avaliação",
    responsavel: "Área de Capital Humano (ACH)",
    descricao: "Carrega no sistema os formulários oficiais e abre o ciclo semestral.",
    artigos: "Art. 42.º/1 e 41.º/1",
    icon: Play,
    color: "bg-emerald-500",
    acoes: [
      "Carregar formulários oficiais",
      "Abrir ciclo semestral",
      "Configurar parâmetros do ciclo",
    ],
  },
  {
    numero: 2,
    titulo: "Definição de Objectivos e Competências",
    responsavel: "Avaliador + Avaliado",
    descricao: "Reunião inicial para definir objectivos e competências.",
    artigos: "Art. 41.º/1 al. a)",
    icon: Target,
    color: "bg-blue-500",
    acoes: [
      "Objectivos específicos (SMART)",
      "Competências técnicas e transversais previstas no diploma",
      "Sistema gera e guarda registo das metas",
    ],
  },
  {
    numero: 3,
    titulo: "Submissão do Formulário ao Capital Humano",
    responsavel: "Avaliador",
    descricao: "Preenche o formulário no sistema e submete nos prazos estabelecidos.",
    artigos: "Art. 42.º/3",
    icon: Send,
    color: "bg-indigo-500",
    acoes: [
      "10 de Janeiro (1.º semestre)",
      "10 de Julho (2.º semestre)",
    ],
  },
  {
    numero: 4,
    titulo: "Verificação Técnica do Capital Humano",
    responsavel: "Área de Capital Humano",
    descricao: "Valida a conformidade dos objectivos e competências.",
    artigos: "Art. 26.º e 42.º/4",
    icon: ClipboardCheck,
    color: "bg-cyan-500",
    acoes: [
      "Validar conformidade dos objectivos",
      "Validar competências definidas",
      "Pode pedir ajustamentos ao avaliador",
    ],
  },
  {
    numero: 5,
    titulo: "Acompanhamento Intercalar",
    responsavel: "Avaliador + Avaliado",
    descricao: "Sistema agenda e regista feedback intermédio obrigatório.",
    artigos: "Art. 43.º",
    icon: CalendarClock,
    color: "bg-amber-500",
    acoes: [
      "Monitorização dos objectivos",
      "Necessidade de ajustamentos",
      "Identificação de dificuldades",
    ],
  },
  {
    numero: 6,
    titulo: "Avaliação Semestral",
    responsavel: "Avaliador",
    descricao: "Regista no sistema as notas e observações.",
    artigos: "Art. 46.º",
    icon: FileCheck,
    color: "bg-orange-500",
    acoes: [
      "Nota de cada objectivo",
      "Nota das competências técnicas e transversais",
      "Observações críticas e recomendação",
    ],
  },
  {
    numero: 7,
    titulo: "Diálogo de Avaliação",
    responsavel: "Avaliador + Avaliado",
    descricao: "Reunião para discussão dos resultados da avaliação.",
    icon: MessageSquare,
    color: "bg-rose-500",
    acoes: [
      "Apresentação dos resultados",
      "Discussão das pontuações",
      "Registo de concordância ou discordância",
    ],
  },
  {
    numero: 8,
    titulo: "Submissão da Avaliação Final",
    responsavel: "Avaliador",
    descricao: "Após o diálogo, confirma no sistema a nota final e anexa comentários.",
    artigos: "Art. 46.º/1–3",
    icon: Send,
    color: "bg-purple-500",
    acoes: [
      "Confirmar nota final",
      "Anexar comentários",
      "Submeter para homologação",
    ],
  },
  {
    numero: 9,
    titulo: "Homologação",
    responsavel: "Comissão de Avaliação",
    descricao: "Recebe automaticamente o processo via sistema para análise e validação.",
    artigos: "Art. 21.º–23.º e 46.º",
    icon: CheckCircle2,
    color: "bg-green-600",
    acoes: [
      "Receber processo automaticamente",
      "Analisar e validar",
      "Devolver para correções (se necessário)",
      "Submeter homologação e resultado",
    ],
  },
  {
    numero: 10,
    titulo: "Notificação ao Avaliado",
    responsavel: "Sistema Automático",
    descricao: "Envia notificação automática ao avaliado.",
    icon: Bell,
    color: "bg-sky-500",
    acoes: [
      "Nota final",
      "Homologação",
      "Direitos de recurso",
    ],
  },
  {
    numero: 11,
    titulo: "Eventual Recurso",
    responsavel: "Avaliado / Comissão de Avaliação",
    descricao: "Submete recurso no sistema nos prazos legais.",
    icon: AlertCircle,
    color: "bg-red-500",
    acoes: [
      "Avaliado submete recurso no sistema",
      "Comissão de Avaliação emite parecer",
      "Sistema regista decisão final",
    ],
  },
  {
    numero: 12,
    titulo: "Encerramento do Ciclo",
    responsavel: "Capital Humano",
    descricao: "Arquiva automaticamente e actualiza histórico individual.",
    icon: Archive,
    color: "bg-slate-600",
    acoes: [
      "Arquivar automaticamente",
      "Actualizar histórico individual",
      "Gerar relatórios estatísticos institucionais (KPIs)",
    ],
  },
];

const responsavelColors: Record<string, string> = {
  "Área de Capital Humano (ACH)": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Avaliador + Avaliado": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "Avaliador": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  "Área de Capital Humano": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  "Comissão de Avaliação": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "Sistema Automático": "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  "Avaliado / Comissão de Avaliação": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "Capital Humano": "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
};

function FlowStepCard({ step, isLast }: { step: FlowStep; isLast: boolean }) {
  const Icon = step.icon;

  return (
    <div className="relative">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-4">
            {/* Step Number & Icon */}
            <div className="flex flex-col items-center gap-2">
              <div className={cn("p-3 rounded-xl text-white shadow-lg", step.color)}>
                <Icon className="h-6 w-6" />
              </div>
              <Badge variant="secondary" className="font-mono text-lg font-bold">
                {step.numero}
              </Badge>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <CardTitle className="text-lg font-semibold">
                {step.titulo}
              </CardTitle>
              <Badge 
                variant="outline" 
                className={cn("text-xs", responsavelColors[step.responsavel])}
              >
                {step.responsavel}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                {step.descricao}
              </p>
              {step.artigos && (
                <p className="text-xs text-primary font-medium">
                  📜 {step.artigos}
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        {step.acoes && step.acoes.length > 0 && (
          <CardContent className="pt-0">
            <div className="border-t pt-3 mt-2">
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Acções / Detalhes
              </p>
              <ul className="space-y-1">
                {step.acoes.map((acao, idx) => (
                  <li 
                    key={idx} 
                    className="flex items-center gap-2 text-sm text-foreground/80"
                  >
                    <div className={cn("w-1.5 h-1.5 rounded-full", step.color)} />
                    {acao}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Arrow connector */}
      {!isLast && (
        <div className="flex justify-center py-2">
          <ArrowDown className="h-6 w-6 text-muted-foreground animate-pulse" />
        </div>
      )}
    </div>
  );
}

export default function FluxogramaAvaliacao() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/20">
            Decreto Presidencial 173/25
          </Badge>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
            Fluxograma do Sistema de Avaliação de Desempenho
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Novo Regime de Avaliação sobre o Desempenho dos Funcionários Públicos (RADFP),
            aprovado através do Decreto Presidencial 173/25, de 24 de Setembro de 2025.
          </p>
        </div>

        {/* Legend */}
        <Card className="bg-muted/20">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-emerald-500" />
                <span>Capital Humano</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span>Avaliador + Avaliado</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-indigo-500" />
                <span>Avaliador</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Comissão de Avaliação</span>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-sky-500" />
                <span>Sistema Automático</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flowchart Steps */}
        <div className="max-w-3xl mx-auto">
          {flowSteps.map((step, index) => (
            <FlowStepCard 
              key={step.numero} 
              step={step} 
              isLast={index === flowSteps.length - 1}
            />
          ))}
        </div>

        {/* Footer Info */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-lg">
                República de Angola — Tribunal de Contas
              </h3>
              <p className="text-sm text-muted-foreground">
                Direcção dos Serviços Administrativos — Divisão de Recursos Humanos
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
