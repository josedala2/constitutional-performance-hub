import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Activity,
  Play,
  Target,
  Send,
  ClipboardCheck,
  CalendarClock,
  FileCheck,
  MessageSquare,
  CheckCircle2,
  Bell,
  AlertCircle,
  Archive,
  Search,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle,
  Circle,
  ArrowRight,
  Users,
  Building2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowEtapa {
  id: number;
  titulo: string;
  icon: React.ElementType;
  color: string;
}

interface AvaliacaoWorkflow {
  id: string;
  avaliado: string;
  avaliador: string;
  departamento: string;
  ciclo: string;
  etapaAtual: number;
  etapaStatus: "concluida" | "em_progresso" | "atrasada" | "pendente";
  dataLimite: string;
  diasRestantes: number;
  progresso: number;
}

const etapasWorkflow: WorkflowEtapa[] = [
  { id: 1, titulo: "Início", icon: Play, color: "bg-emerald-500" },
  { id: 2, titulo: "Objectivos", icon: Target, color: "bg-blue-500" },
  { id: 3, titulo: "Submissão", icon: Send, color: "bg-indigo-500" },
  { id: 4, titulo: "Verificação", icon: ClipboardCheck, color: "bg-cyan-500" },
  { id: 5, titulo: "Acompanhamento", icon: CalendarClock, color: "bg-amber-500" },
  { id: 6, titulo: "Avaliação", icon: FileCheck, color: "bg-orange-500" },
  { id: 7, titulo: "Diálogo", icon: MessageSquare, color: "bg-rose-500" },
  { id: 8, titulo: "Final", icon: Send, color: "bg-purple-500" },
  { id: 9, titulo: "Homologação", icon: CheckCircle2, color: "bg-green-600" },
  { id: 10, titulo: "Notificação", icon: Bell, color: "bg-sky-500" },
  { id: 11, titulo: "Recurso", icon: AlertCircle, color: "bg-red-500" },
  { id: 12, titulo: "Encerramento", icon: Archive, color: "bg-slate-600" },
];

// Dados mock de avaliações em progresso
const mockAvaliacoes: AvaliacaoWorkflow[] = [
  {
    id: "1",
    avaliado: "Maria Silva",
    avaliador: "João Santos",
    departamento: "Direcção de Recursos Humanos",
    ciclo: "2025 - 1º Semestre",
    etapaAtual: 5,
    etapaStatus: "em_progresso",
    dataLimite: "2025-02-15",
    diasRestantes: 40,
    progresso: 42,
  },
  {
    id: "2",
    avaliado: "Pedro Costa",
    avaliador: "Ana Fernandes",
    departamento: "Direcção Financeira",
    ciclo: "2025 - 1º Semestre",
    etapaAtual: 3,
    etapaStatus: "atrasada",
    dataLimite: "2025-01-10",
    diasRestantes: -4,
    progresso: 25,
  },
  {
    id: "3",
    avaliado: "Carla Mendes",
    avaliador: "Rui Almeida",
    departamento: "Direcção Jurídica",
    ciclo: "2025 - 1º Semestre",
    etapaAtual: 7,
    etapaStatus: "em_progresso",
    dataLimite: "2025-02-20",
    diasRestantes: 45,
    progresso: 58,
  },
  {
    id: "4",
    avaliado: "Luís Pereira",
    avaliador: "Sofia Martins",
    departamento: "Direcção de TI",
    ciclo: "2025 - 1º Semestre",
    etapaAtual: 9,
    etapaStatus: "em_progresso",
    dataLimite: "2025-03-01",
    diasRestantes: 54,
    progresso: 75,
  },
  {
    id: "5",
    avaliado: "Teresa Rodrigues",
    avaliador: "Manuel Sousa",
    departamento: "Gabinete do Presidente",
    ciclo: "2025 - 1º Semestre",
    etapaAtual: 12,
    etapaStatus: "concluida",
    dataLimite: "2025-01-05",
    diasRestantes: 0,
    progresso: 100,
  },
  {
    id: "6",
    avaliado: "António Oliveira",
    avaliador: "Isabel Gomes",
    departamento: "Direcção de Auditoria",
    ciclo: "2025 - 1º Semestre",
    etapaAtual: 2,
    etapaStatus: "pendente",
    dataLimite: "2025-01-20",
    diasRestantes: 14,
    progresso: 8,
  },
  {
    id: "7",
    avaliado: "Ricardo Ferreira",
    avaliador: "Helena Nunes",
    departamento: "Direcção de Recursos Humanos",
    ciclo: "2025 - 1º Semestre",
    etapaAtual: 6,
    etapaStatus: "em_progresso",
    dataLimite: "2025-02-10",
    diasRestantes: 35,
    progresso: 50,
  },
  {
    id: "8",
    avaliado: "Fernanda Lopes",
    avaliador: "Carlos Ribeiro",
    departamento: "Direcção Financeira",
    ciclo: "2024 - 2º Semestre",
    etapaAtual: 11,
    etapaStatus: "em_progresso",
    dataLimite: "2025-01-15",
    diasRestantes: 9,
    progresso: 92,
  },
];

const ciclos = [
  "Todos os Ciclos",
  "2025 - 1º Semestre",
  "2024 - 2º Semestre",
  "2024 - 1º Semestre",
];

const departamentos = [
  "Todos os Departamentos",
  "Direcção de Recursos Humanos",
  "Direcção Financeira",
  "Direcção Jurídica",
  "Direcção de TI",
  "Direcção de Auditoria",
  "Gabinete do Presidente",
];

const statusOptions = [
  { value: "todos", label: "Todos os Estados" },
  { value: "concluida", label: "Concluídas" },
  { value: "em_progresso", label: "Em Progresso" },
  { value: "atrasada", label: "Atrasadas" },
  { value: "pendente", label: "Pendentes" },
];

function EtapaIndicator({ 
  etapa, 
  etapaAtual, 
  status 
}: { 
  etapa: WorkflowEtapa; 
  etapaAtual: number;
  status: AvaliacaoWorkflow["etapaStatus"];
}) {
  const Icon = etapa.icon;
  const isCurrent = etapa.id === etapaAtual;
  const isCompleted = etapa.id < etapaAtual;
  const isPending = etapa.id > etapaAtual;

  let bgColor = "bg-muted";
  let textColor = "text-muted-foreground";
  let ringColor = "";

  if (isCompleted) {
    bgColor = "bg-green-500";
    textColor = "text-white";
  } else if (isCurrent) {
    bgColor = etapa.color;
    textColor = "text-white";
    ringColor = status === "atrasada" 
      ? "ring-2 ring-red-500 ring-offset-2" 
      : "ring-2 ring-primary ring-offset-2";
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center transition-all",
              bgColor,
              textColor,
              ringColor,
              isPending && "opacity-40"
            )}
          >
            {isCompleted ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <Icon className="h-3.5 w-3.5" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{etapa.id}. {etapa.titulo}</p>
          <p className="text-xs text-muted-foreground">
            {isCompleted ? "Concluída" : isCurrent ? "Em curso" : "Pendente"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function StatusBadge({ status, diasRestantes }: { status: AvaliacaoWorkflow["etapaStatus"]; diasRestantes: number }) {
  const statusConfig = {
    concluida: {
      label: "Concluída",
      variant: "default" as const,
      className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      icon: CheckCircle,
    },
    em_progresso: {
      label: "Em Progresso",
      variant: "secondary" as const,
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      icon: Clock,
    },
    atrasada: {
      label: "Atrasada",
      variant: "destructive" as const,
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      icon: AlertTriangle,
    },
    pendente: {
      label: "Pendente",
      variant: "outline" as const,
      className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
      icon: Circle,
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Badge variant={config.variant} className={cn("gap-1", config.className)}>
      <StatusIcon className="h-3 w-3" />
      {config.label}
      {status === "atrasada" && diasRestantes < 0 && (
        <span className="ml-1">({Math.abs(diasRestantes)}d)</span>
      )}
    </Badge>
  );
}

export default function EstadoWorkflow() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCiclo, setSelectedCiclo] = useState("Todos os Ciclos");
  const [selectedDepartamento, setSelectedDepartamento] = useState("Todos os Departamentos");
  const [selectedStatus, setSelectedStatus] = useState("todos");

  // Filtrar avaliações
  const avaliacoesFiltradas = mockAvaliacoes.filter((av) => {
    const matchSearch = 
      av.avaliado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      av.avaliador.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCiclo = selectedCiclo === "Todos os Ciclos" || av.ciclo === selectedCiclo;
    const matchDept = selectedDepartamento === "Todos os Departamentos" || av.departamento === selectedDepartamento;
    const matchStatus = selectedStatus === "todos" || av.etapaStatus === selectedStatus;
    
    return matchSearch && matchCiclo && matchDept && matchStatus;
  });

  // Estatísticas
  const stats = {
    total: mockAvaliacoes.length,
    concluidas: mockAvaliacoes.filter(a => a.etapaStatus === "concluida").length,
    emProgresso: mockAvaliacoes.filter(a => a.etapaStatus === "em_progresso").length,
    atrasadas: mockAvaliacoes.filter(a => a.etapaStatus === "atrasada").length,
    pendentes: mockAvaliacoes.filter(a => a.etapaStatus === "pendente").length,
  };

  const progressoMedio = Math.round(
    mockAvaliacoes.reduce((acc, av) => acc + av.progresso, 0) / mockAvaliacoes.length
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-6 w-6 text-primary" />
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                Monitorização
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
              Estado do Workflow de Avaliação
            </h1>
            <p className="mt-1 text-muted-foreground">
              Acompanhe o progresso de cada avaliação através das etapas do workflow
            </p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.concluidas}</p>
                  <p className="text-xs text-muted-foreground">Concluídas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{stats.emProgresso}</p>
                  <p className="text-xs text-muted-foreground">Em Progresso</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{stats.atrasadas}</p>
                  <p className="text-xs text-muted-foreground">Atrasadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-2 md:col-span-1">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Progresso Médio</p>
                  <p className="text-sm font-bold">{progressoMedio}%</p>
                </div>
                <Progress value={progressoMedio} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por avaliado ou avaliador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedCiclo} onValueChange={setSelectedCiclo}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ciclos.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDepartamento} onValueChange={setSelectedDepartamento}>
                <SelectTrigger className="w-full md:w-[250px]">
                  <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departamentos.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Legend */}
        <Card className="bg-muted/20">
          <CardContent className="py-3">
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
              {etapasWorkflow.map((etapa, idx) => {
                const Icon = etapa.icon;
                return (
                  <div key={etapa.id} className="flex items-center gap-1">
                    <div className={cn("p-1 rounded text-white", etapa.color)}>
                      <Icon className="h-3 w-3" />
                    </div>
                    <span className="hidden sm:inline">{etapa.id}. {etapa.titulo}</span>
                    <span className="sm:hidden">{etapa.id}</span>
                    {idx < etapasWorkflow.length - 1 && (
                      <ArrowRight className="h-3 w-3 text-muted-foreground ml-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">
              Avaliações em Curso ({avaliacoesFiltradas.length})
            </CardTitle>
            <CardDescription>
              Clique numa etapa para ver detalhes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Avaliado</TableHead>
                    <TableHead className="hidden md:table-cell">Avaliador</TableHead>
                    <TableHead className="hidden lg:table-cell">Departamento</TableHead>
                    <TableHead>Etapas do Workflow</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead className="text-right hidden md:table-cell">Progresso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {avaliacoesFiltradas.map((av) => (
                    <TableRow key={av.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div>
                          <p className="font-medium">{av.avaliado}</p>
                          <p className="text-xs text-muted-foreground md:hidden">{av.avaliador}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {av.avaliador}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="outline" className="text-xs">
                          {av.departamento}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {etapasWorkflow.map((etapa) => (
                            <EtapaIndicator 
                              key={etapa.id} 
                              etapa={etapa} 
                              etapaAtual={av.etapaAtual}
                              status={av.etapaStatus}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <StatusBadge status={av.etapaStatus} diasRestantes={av.diasRestantes} />
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell">
                        <div className="flex items-center gap-2 justify-end">
                          <Progress value={av.progresso} className="w-20 h-2" />
                          <span className="text-sm font-medium w-10">{av.progresso}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {avaliacoesFiltradas.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma avaliação encontrada com os filtros aplicados</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
