import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  Target,
  Play,
  Calculator,
  FileCheck,
  MessageSquare,
  CheckCircle2,
  ClipboardList,
  FileText,
  Award,
  Users,
  Calendar,
  Settings,
  UserCheck,
  UsersRound,
  Building2,
  Globe,
  Pencil,
  Send,
  Archive,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Atividade {
  nome: string;
  icon?: React.ElementType;
}

interface Subprocesso {
  codigo: string;
  nome: string;
  atividades?: Atividade[];
}

interface ProcessoPrincipal {
  codigo: string;
  nome: string;
  descricao: string;
  icon: React.ElementType;
  color: string;
  subprocessos: Subprocesso[];
}

const instrumentosOutputs = [
  { nome: "Fichas de avaliação", icon: ClipboardList },
  { nome: "Relatórios de desempenho", icon: FileText },
  { nome: "Nota de Avaliação Final (NAF)", icon: Calculator },
  { nome: "Classificação qualitativa", icon: Award },
  { nome: "Plano de desenvolvimento individual", icon: Target },
  { nome: "Registo administrativo oficial", icon: Archive },
];

const processosPrincipais: ProcessoPrincipal[] = [
  {
    codigo: "2.1",
    nome: "Planeamento da Avaliação",
    descricao: "Define as regras, objetivos e critérios do ciclo avaliativo.",
    icon: Target,
    color: "bg-blue-500",
    subprocessos: [
      { codigo: "2.1.1", nome: "Definição do ciclo avaliativo" },
      { codigo: "2.1.2", nome: "Definição de objetivos individuais" },
      { codigo: "2.1.3", nome: "Definição de objetivos de equipa" },
      { codigo: "2.1.4", nome: "Definição de competências e níveis de proficiência" },
      { codigo: "2.1.5", nome: "Comunicação das regras do processo" },
    ],
  },
  {
    codigo: "2.2",
    nome: "Execução da Avaliação",
    descricao: "Recolhe dados, aplica instrumentos e realiza as avaliações.",
    icon: Play,
    color: "bg-green-500",
    subprocessos: [
      { codigo: "2.2.1", nome: "Acompanhamento contínuo do desempenho" },
      { codigo: "2.2.2", nome: "Registo de evidências" },
      {
        codigo: "2.2.3",
        nome: "Avaliação pelo superior hierárquico",
        atividades: [
          { nome: "Preencher ficha de avaliação", icon: Pencil },
          { nome: "Avaliar objetivos (planeado vs realizado)", icon: Target },
          { nome: "Avaliar competências", icon: Award },
          { nome: "Justificar pontuações", icon: FileText },
          { nome: "Submeter para consolidação", icon: Send },
        ],
      },
      { codigo: "2.2.4", nome: "Avaliação entre pares" },
      { codigo: "2.2.5", nome: "Avaliação por utentes internos" },
      { codigo: "2.2.6", nome: "Avaliação por utentes externos" },
    ],
  },
  {
    codigo: "2.3",
    nome: "Consolidação e Cálculo",
    descricao: "Agrega resultados e calcula a Nota de Avaliação Final (NAF).",
    icon: Calculator,
    color: "bg-amber-500",
    subprocessos: [
      { codigo: "2.3.1", nome: "Consolidação das pontuações" },
      { codigo: "2.3.2", nome: "Aplicação dos coeficientes de ponderação" },
      { codigo: "2.3.3", nome: "Cálculo da Nota de Avaliação Final (NAF)" },
      { codigo: "2.3.4", nome: "Conversão da nota em menção qualitativa" },
    ],
  },
  {
    codigo: "2.4",
    nome: "Relato e Validação",
    descricao: "Produz relatórios, valida resultados e formaliza decisões.",
    icon: FileCheck,
    color: "bg-purple-500",
    subprocessos: [
      { codigo: "2.4.1", nome: "Elaboração dos relatórios de avaliação" },
      { codigo: "2.4.2", nome: "Revisão técnica e administrativa" },
      {
        codigo: "2.4.3",
        nome: "Assinatura do avaliador e avaliado",
        atividades: [
          { nome: "Recolher assinatura do avaliador", icon: UserCheck },
          { nome: "Recolher assinatura do avaliado", icon: UserCheck },
          { nome: "Encaminhar para homologação", icon: Send },
        ],
      },
      { codigo: "2.4.4", nome: "Homologação pela entidade competente" },
      { codigo: "2.4.5", nome: "Arquivo e registo oficial" },
    ],
  },
  {
    codigo: "2.5",
    nome: "Feedback e Desenvolvimento",
    descricao: "Comunica resultados e orienta a melhoria do desempenho.",
    icon: MessageSquare,
    color: "bg-rose-500",
    subprocessos: [
      { codigo: "2.5.1", nome: "Comunicação dos resultados ao avaliado" },
      { codigo: "2.5.2", nome: "Reunião de feedback" },
      { codigo: "2.5.3", nome: "Identificação de necessidades de desenvolvimento" },
      { codigo: "2.5.4", nome: "Definição de plano de melhoria / formação" },
      { codigo: "2.5.5", nome: "Monitorização pós-avaliação" },
    ],
  },
];

function SubprocessoItem({ subprocesso }: { subprocesso: Subprocesso }) {
  const [open, setOpen] = useState(false);
  const hasAtividades = subprocesso.atividades && subprocesso.atividades.length > 0;

  if (!hasAtividades) {
    return (
      <div className="flex items-center gap-3 py-2 px-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
        <Badge variant="outline" className="font-mono text-xs">
          {subprocesso.codigo}
        </Badge>
        <span className="text-sm">{subprocesso.nome}</span>
      </div>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center gap-3 py-2 px-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
          {open ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <Badge variant="outline" className="font-mono text-xs">
            {subprocesso.codigo}
          </Badge>
          <span className="text-sm">{subprocesso.nome}</span>
          <Badge className="ml-auto text-xs bg-primary/10 text-primary hover:bg-primary/20">
            {subprocesso.atividades?.length} atividades
          </Badge>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-8 mt-2 space-y-1 border-l-2 border-primary/20 pl-4">
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            Nível 4 — Atividades Operacionais
          </p>
          {subprocesso.atividades?.map((atividade, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 py-1.5 px-2 rounded text-sm bg-background hover:bg-muted/30 transition-colors"
            >
              {atividade.icon && (
                <atividade.icon className="h-4 w-4 text-muted-foreground" />
              )}
              <span>{atividade.nome}</span>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function ProcessoCard({ processo }: { processo: ProcessoPrincipal }) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="overflow-hidden">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="w-full text-left">
          <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className={cn("p-3 rounded-lg", processo.color)}>
                <processo.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="font-mono">
                    {processo.codigo}
                  </Badge>
                  <CardTitle className="text-lg">{processo.nome}</CardTitle>
                  {open ? (
                    <ChevronDown className="h-5 w-5 ml-auto text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{processo.descricao}</p>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="border-t pt-4">
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                Nível 3 — Subprocessos
              </p>
              <div className="space-y-2">
                {processo.subprocessos.map((sub) => (
                  <SubprocessoItem key={sub.codigo} subprocesso={sub} />
                ))}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export default function ProcessoAvaliacao() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Hierarquia do Processo de Avaliação
          </h1>
          <p className="text-muted-foreground mt-1">
            Estrutura completa do macroprocesso de gestão de avaliação de desempenho
          </p>
        </div>

        {/* Nível 1 - Macroprocesso */}
        <Card className="border-2 border-primary/30 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-primary">
                <Settings className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <Badge className="mb-2 bg-primary/20 text-primary hover:bg-primary/30">
                  Nível 1 — Macroprocesso
                </Badge>
                <CardTitle className="text-2xl font-serif">
                  Gestão da Avaliação de Desempenho
                </CardTitle>
                <p className="text-muted-foreground mt-1">
                  Processo global que assegura o planeamento, execução, controlo e melhoria
                  contínua do desempenho dos colaboradores.
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Nível 2 - Processos Principais */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="text-sm py-1">
              Nível 2 — Processos Principais
            </Badge>
          </div>
          <div className="grid gap-4">
            {processosPrincipais.map((processo) => (
              <ProcessoCard key={processo.codigo} processo={processo} />
            ))}
          </div>
        </div>

        {/* Nível 5 - Instrumentos / Outputs */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-sm py-1">
                Nível 5 — Instrumentos / Outputs
              </Badge>
            </div>
            <CardTitle className="text-lg">Resultados e Documentos do Processo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {instrumentosOutputs.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-center"
                >
                  <div className="p-3 rounded-full bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium">{item.nome}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Legenda Visual */}
        <Card className="bg-muted/20">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary/20 border-2 border-primary/30" />
                <span>Nível 1 - Macroprocesso</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500" />
                <span>Nível 2 - Processos</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">2.1.1</Badge>
                <span>Nível 3 - Subprocessos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <span>Nível 4 - Atividades</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span>Nível 5 - Outputs</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
