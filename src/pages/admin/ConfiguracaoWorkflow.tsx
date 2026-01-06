import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Workflow,
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
  Settings,
  Save,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Clock,
  Users,
  Mail,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface WorkflowStep {
  id: string;
  numero: number;
  titulo: string;
  responsavel: string;
  descricao: string;
  artigos?: string;
  prazoDefault: number;
  prazoUnidade: "dias" | "horas";
  obrigatorio: boolean;
  notificacaoAtiva: boolean;
  tiposNotificacao: string[];
  acoes: string[];
  ativo: boolean;
}

const responsaveis = [
  "Área de Capital Humano (ACH)",
  "Avaliador + Avaliado",
  "Avaliador",
  "Área de Capital Humano",
  "Comissão de Avaliação",
  "Sistema Automático",
  "Avaliado",
  "Capital Humano",
];

const iconMap: Record<string, React.ElementType> = {
  "1": Play,
  "2": Target,
  "3": Send,
  "4": ClipboardCheck,
  "5": CalendarClock,
  "6": FileCheck,
  "7": MessageSquare,
  "8": Send,
  "9": CheckCircle2,
  "10": Bell,
  "11": AlertCircle,
  "12": Archive,
};

const initialSteps: WorkflowStep[] = [
  {
    id: "1",
    numero: 1,
    titulo: "Início do Ciclo de Avaliação",
    responsavel: "Área de Capital Humano (ACH)",
    descricao: "Carrega no sistema os formulários oficiais e abre o ciclo semestral.",
    artigos: "Art. 42.º/1 e 41.º/1",
    prazoDefault: 5,
    prazoUnidade: "dias",
    obrigatorio: true,
    notificacaoAtiva: true,
    tiposNotificacao: ["email", "sistema"],
    acoes: ["Carregar formulários oficiais", "Abrir ciclo semestral", "Configurar parâmetros do ciclo"],
    ativo: true,
  },
  {
    id: "2",
    numero: 2,
    titulo: "Definição de Objectivos e Competências",
    responsavel: "Avaliador + Avaliado",
    descricao: "Reunião inicial para definir objectivos e competências.",
    artigos: "Art. 41.º/1 al. a)",
    prazoDefault: 15,
    prazoUnidade: "dias",
    obrigatorio: true,
    notificacaoAtiva: true,
    tiposNotificacao: ["email", "sistema"],
    acoes: ["Objectivos específicos (SMART)", "Competências técnicas e transversais previstas no diploma", "Sistema gera e guarda registo das metas"],
    ativo: true,
  },
  {
    id: "3",
    numero: 3,
    titulo: "Submissão do Formulário ao Capital Humano",
    responsavel: "Avaliador",
    descricao: "Preenche o formulário no sistema e submete nos prazos estabelecidos.",
    artigos: "Art. 42.º/3",
    prazoDefault: 10,
    prazoUnidade: "dias",
    obrigatorio: true,
    notificacaoAtiva: true,
    tiposNotificacao: ["email", "sistema"],
    acoes: ["10 de Janeiro (1.º semestre)", "10 de Julho (2.º semestre)"],
    ativo: true,
  },
  {
    id: "4",
    numero: 4,
    titulo: "Verificação Técnica do Capital Humano",
    responsavel: "Área de Capital Humano",
    descricao: "Valida a conformidade dos objectivos e competências.",
    artigos: "Art. 26.º e 42.º/4",
    prazoDefault: 5,
    prazoUnidade: "dias",
    obrigatorio: true,
    notificacaoAtiva: true,
    tiposNotificacao: ["email", "sistema"],
    acoes: ["Validar conformidade dos objectivos", "Validar competências definidas", "Pode pedir ajustamentos ao avaliador"],
    ativo: true,
  },
  {
    id: "5",
    numero: 5,
    titulo: "Acompanhamento Intercalar",
    responsavel: "Avaliador + Avaliado",
    descricao: "Sistema agenda e regista feedback intermédio obrigatório.",
    artigos: "Art. 43.º",
    prazoDefault: 30,
    prazoUnidade: "dias",
    obrigatorio: true,
    notificacaoAtiva: true,
    tiposNotificacao: ["email", "sistema"],
    acoes: ["Monitorização dos objectivos", "Necessidade de ajustamentos", "Identificação de dificuldades"],
    ativo: true,
  },
  {
    id: "6",
    numero: 6,
    titulo: "Avaliação Semestral",
    responsavel: "Avaliador",
    descricao: "Regista no sistema as notas e observações.",
    artigos: "Art. 46.º",
    prazoDefault: 10,
    prazoUnidade: "dias",
    obrigatorio: true,
    notificacaoAtiva: true,
    tiposNotificacao: ["email", "sistema"],
    acoes: ["Nota de cada objectivo", "Nota das competências técnicas e transversais", "Observações críticas e recomendação"],
    ativo: true,
  },
  {
    id: "7",
    numero: 7,
    titulo: "Diálogo de Avaliação",
    responsavel: "Avaliador + Avaliado",
    descricao: "Reunião para discussão dos resultados da avaliação.",
    prazoDefault: 5,
    prazoUnidade: "dias",
    obrigatorio: true,
    notificacaoAtiva: true,
    tiposNotificacao: ["email", "sistema"],
    acoes: ["Apresentação dos resultados", "Discussão das pontuações", "Registo de concordância ou discordância"],
    ativo: true,
  },
  {
    id: "8",
    numero: 8,
    titulo: "Submissão da Avaliação Final",
    responsavel: "Avaliador",
    descricao: "Após o diálogo, confirma no sistema a nota final e anexa comentários.",
    artigos: "Art. 46.º/1–3",
    prazoDefault: 3,
    prazoUnidade: "dias",
    obrigatorio: true,
    notificacaoAtiva: true,
    tiposNotificacao: ["email", "sistema"],
    acoes: ["Confirmar nota final", "Anexar comentários", "Submeter para homologação"],
    ativo: true,
  },
  {
    id: "9",
    numero: 9,
    titulo: "Homologação",
    responsavel: "Comissão de Avaliação",
    descricao: "Recebe automaticamente o processo via sistema para análise e validação.",
    artigos: "Art. 21.º–23.º e 46.º",
    prazoDefault: 10,
    prazoUnidade: "dias",
    obrigatorio: true,
    notificacaoAtiva: true,
    tiposNotificacao: ["email", "sistema"],
    acoes: ["Receber processo automaticamente", "Analisar e validar", "Devolver para correções (se necessário)", "Submeter homologação e resultado"],
    ativo: true,
  },
  {
    id: "10",
    numero: 10,
    titulo: "Notificação ao Avaliado",
    responsavel: "Sistema Automático",
    descricao: "Envia notificação automática ao avaliado.",
    prazoDefault: 1,
    prazoUnidade: "dias",
    obrigatorio: true,
    notificacaoAtiva: true,
    tiposNotificacao: ["email", "sistema"],
    acoes: ["Nota final", "Homologação", "Direitos de recurso"],
    ativo: true,
  },
  {
    id: "11",
    numero: 11,
    titulo: "Eventual Recurso",
    responsavel: "Avaliado",
    descricao: "Submete recurso no sistema nos prazos legais.",
    prazoDefault: 10,
    prazoUnidade: "dias",
    obrigatorio: false,
    notificacaoAtiva: true,
    tiposNotificacao: ["email", "sistema"],
    acoes: ["Avaliado submete recurso no sistema", "Comissão de Avaliação emite parecer", "Sistema regista decisão final"],
    ativo: true,
  },
  {
    id: "12",
    numero: 12,
    titulo: "Encerramento do Ciclo",
    responsavel: "Capital Humano",
    descricao: "Arquiva automaticamente e actualiza histórico individual.",
    prazoDefault: 5,
    prazoUnidade: "dias",
    obrigatorio: true,
    notificacaoAtiva: true,
    tiposNotificacao: ["email", "sistema"],
    acoes: ["Arquivar automaticamente", "Actualizar histórico individual", "Gerar relatórios estatísticos institucionais (KPIs)"],
    ativo: true,
  },
];

export default function ConfiguracaoWorkflow() {
  const [steps, setSteps] = useState<WorkflowStep[]>(initialSteps);
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  const handleEditStep = (step: WorkflowStep) => {
    setEditingStep({ ...step });
    setIsEditModalOpen(true);
  };

  const handleSaveStep = () => {
    if (!editingStep) return;

    setSteps(prev =>
      prev.map(s => (s.id === editingStep.id ? editingStep : s))
    );
    setIsEditModalOpen(false);
    setEditingStep(null);
    toast.success("Etapa actualizada com sucesso");
  };

  const handleToggleStepActive = (stepId: string) => {
    setSteps(prev =>
      prev.map(s => (s.id === stepId ? { ...s, ativo: !s.ativo } : s))
    );
    toast.success("Estado da etapa actualizado");
  };

  const handleToggleNotification = (stepId: string) => {
    setSteps(prev =>
      prev.map(s => (s.id === stepId ? { ...s, notificacaoAtiva: !s.notificacaoAtiva } : s))
    );
  };

  const handleSaveAllConfig = () => {
    toast.success("Configuração do workflow guardada com sucesso");
  };

  const getStepColor = (numero: number): string => {
    const colors: Record<number, string> = {
      1: "bg-emerald-500",
      2: "bg-blue-500",
      3: "bg-indigo-500",
      4: "bg-cyan-500",
      5: "bg-amber-500",
      6: "bg-orange-500",
      7: "bg-rose-500",
      8: "bg-purple-500",
      9: "bg-green-600",
      10: "bg-sky-500",
      11: "bg-red-500",
      12: "bg-slate-600",
    };
    return colors[numero] || "bg-primary";
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Workflow className="h-6 w-6 text-primary" />
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                Decreto Presidencial 173/25
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
              Configuração do Workflow de Avaliação
            </h1>
            <p className="mt-1 text-muted-foreground">
              Configure as etapas, prazos e notificações do processo de avaliação
            </p>
          </div>
          <Button variant="institutional" onClick={handleSaveAllConfig}>
            <Save className="h-4 w-4 mr-2" />
            Guardar Configuração
          </Button>
        </div>

        {/* Workflow Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Settings className="h-5 w-5 text-accent" />
              Visão Geral do Workflow
            </CardTitle>
            <CardDescription>
              O workflow contém {steps.length} etapas | {steps.filter(s => s.ativo).length} activas | {steps.filter(s => s.obrigatorio).length} obrigatórias
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Visual Flow */}
            <div className="flex flex-wrap items-center gap-2 pb-4 overflow-x-auto">
              {steps.map((step, index) => {
                const Icon = iconMap[step.id] || Settings;
                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                        step.ativo 
                          ? "bg-secondary hover:bg-secondary/80" 
                          : "bg-muted/50 opacity-50",
                        selectedStep === step.id && "ring-2 ring-primary"
                      )}
                    >
                      <div className={cn("p-1.5 rounded-md text-white", getStepColor(step.numero))}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-medium whitespace-nowrap hidden sm:inline">
                        {step.numero}. {step.titulo.length > 15 ? step.titulo.substring(0, 15) + "..." : step.titulo}
                      </span>
                      <span className="text-xs font-medium sm:hidden">{step.numero}</span>
                    </button>
                    {index < steps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground mx-1 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Steps Configuration Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Etapas do Workflow</CardTitle>
            <CardDescription>
              Configure cada etapa do processo de avaliação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Etapa</TableHead>
                    <TableHead className="hidden md:table-cell">Responsável</TableHead>
                    <TableHead className="hidden lg:table-cell">Prazo</TableHead>
                    <TableHead className="text-center">Obrigatório</TableHead>
                    <TableHead className="text-center">Notificação</TableHead>
                    <TableHead className="text-center">Activo</TableHead>
                    <TableHead className="w-20">Acções</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {steps.map((step) => {
                    const Icon = iconMap[step.id] || Settings;
                    return (
                      <TableRow
                        key={step.id}
                        className={cn(
                          "transition-colors",
                          !step.ativo && "opacity-50 bg-muted/20",
                          selectedStep === step.id && "bg-primary/5"
                        )}
                      >
                        <TableCell>
                          <div className={cn("p-2 rounded-md text-white w-fit", getStepColor(step.numero))}>
                            <Icon className="h-4 w-4" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{step.titulo}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1 md:hidden">
                              {step.responsavel}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className="text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            {step.responsavel}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {step.prazoDefault} {step.prazoUnidade}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {step.obrigatorio ? (
                            <Badge variant="default" className="bg-primary/10 text-primary">Sim</Badge>
                          ) : (
                            <Badge variant="secondary">Não</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={step.notificacaoAtiva}
                            onCheckedChange={() => handleToggleNotification(step.id)}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={step.ativo}
                            onCheckedChange={() => handleToggleStepActive(step.id)}
                            disabled={step.obrigatorio}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditStep(step)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Step Configuration Accordion */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Configuração Detalhada por Etapa</CardTitle>
            <CardDescription>
              Expanda cada etapa para ver e editar detalhes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {steps.map((step) => {
                const Icon = iconMap[step.id] || Settings;
                return (
                  <AccordionItem key={step.id} value={step.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-md text-white", getStepColor(step.numero))}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">
                            {step.numero}. {step.titulo}
                          </p>
                          <p className="text-xs text-muted-foreground font-normal">
                            {step.responsavel}
                          </p>
                        </div>
                        {!step.ativo && (
                          <Badge variant="secondary" className="ml-2">Inactivo</Badge>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-12 space-y-4 pt-2">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label className="text-muted-foreground text-xs">Descrição</Label>
                            <p className="text-sm">{step.descricao}</p>
                          </div>
                          {step.artigos && (
                            <div>
                              <Label className="text-muted-foreground text-xs">Base Legal</Label>
                              <p className="text-sm text-primary">{step.artigos}</p>
                            </div>
                          )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <Label className="text-muted-foreground text-xs">Prazo Padrão</Label>
                            <p className="text-sm flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {step.prazoDefault} {step.prazoUnidade}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground text-xs">Tipo de Notificação</Label>
                            <div className="flex gap-1 mt-1">
                              {step.tiposNotificacao.map((tipo) => (
                                <Badge key={tipo} variant="outline" className="text-xs">
                                  {tipo === "email" ? <Mail className="h-3 w-3 mr-1" /> : <Bell className="h-3 w-3 mr-1" />}
                                  {tipo}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <Label className="text-muted-foreground text-xs">Estado</Label>
                            <div className="flex gap-2 mt-1">
                              {step.obrigatorio && <Badge className="bg-primary/10 text-primary">Obrigatório</Badge>}
                              {step.ativo ? (
                                <Badge className="bg-success/10 text-success">Activo</Badge>
                              ) : (
                                <Badge variant="secondary">Inactivo</Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-muted-foreground text-xs">Acções/Detalhes</Label>
                          <ul className="mt-1 space-y-1">
                            {step.acoes.map((acao, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm">
                                <div className={cn("w-1.5 h-1.5 rounded-full", getStepColor(step.numero))} />
                                {acao}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditStep(step)}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar Etapa
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>

        {/* Edit Step Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif">
                Editar Etapa: {editingStep?.titulo}
              </DialogTitle>
              <DialogDescription>
                Configure os parâmetros desta etapa do workflow
              </DialogDescription>
            </DialogHeader>

            {editingStep && (
              <div className="space-y-6 py-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título da Etapa</Label>
                    <Input
                      id="titulo"
                      value={editingStep.titulo}
                      onChange={(e) => setEditingStep({ ...editingStep, titulo: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsavel">Responsável</Label>
                    <Select
                      value={editingStep.responsavel}
                      onValueChange={(value) => setEditingStep({ ...editingStep, responsavel: value })}
                    >
                      <SelectTrigger id="responsavel">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {responsaveis.map((resp) => (
                          <SelectItem key={resp} value={resp}>
                            {resp}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={editingStep.descricao}
                    onChange={(e) => setEditingStep({ ...editingStep, descricao: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="artigos">Base Legal (Artigos)</Label>
                    <Input
                      id="artigos"
                      value={editingStep.artigos || ""}
                      onChange={(e) => setEditingStep({ ...editingStep, artigos: e.target.value })}
                      placeholder="Ex: Art. 42.º/1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Prazo Padrão</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={editingStep.prazoDefault}
                        onChange={(e) => setEditingStep({ ...editingStep, prazoDefault: parseInt(e.target.value) || 0 })}
                        className="w-24"
                      />
                      <Select
                        value={editingStep.prazoUnidade}
                        onValueChange={(value: "dias" | "horas") => setEditingStep({ ...editingStep, prazoUnidade: value })}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dias">Dias</SelectItem>
                          <SelectItem value="horas">Horas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Configurações</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <Label>Etapa Obrigatória</Label>
                        <p className="text-xs text-muted-foreground">Não pode ser desactivada</p>
                      </div>
                      <Switch
                        checked={editingStep.obrigatorio}
                        onCheckedChange={(checked) => setEditingStep({ ...editingStep, obrigatorio: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <Label>Notificações Activas</Label>
                        <p className="text-xs text-muted-foreground">Envia alertas automáticos</p>
                      </div>
                      <Switch
                        checked={editingStep.notificacaoAtiva}
                        onCheckedChange={(checked) => setEditingStep({ ...editingStep, notificacaoAtiva: checked })}
                      />
                    </div>
                  </div>
                </div>

                {editingStep.notificacaoAtiva && (
                  <div className="space-y-2">
                    <Label>Tipos de Notificação</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingStep.tiposNotificacao.includes("email")}
                          onChange={(e) => {
                            const tipos = e.target.checked
                              ? [...editingStep.tiposNotificacao, "email"]
                              : editingStep.tiposNotificacao.filter((t) => t !== "email");
                            setEditingStep({ ...editingStep, tiposNotificacao: tipos });
                          }}
                          className="rounded border-input"
                        />
                        <Mail className="h-4 w-4" />
                        Email
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingStep.tiposNotificacao.includes("sistema")}
                          onChange={(e) => {
                            const tipos = e.target.checked
                              ? [...editingStep.tiposNotificacao, "sistema"]
                              : editingStep.tiposNotificacao.filter((t) => t !== "sistema");
                            setEditingStep({ ...editingStep, tiposNotificacao: tipos });
                          }}
                          className="rounded border-input"
                        />
                        <Bell className="h-4 w-4" />
                        Sistema
                      </label>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Acções/Detalhes da Etapa</Label>
                  <Textarea
                    value={editingStep.acoes.join("\n")}
                    onChange={(e) => setEditingStep({ ...editingStep, acoes: e.target.value.split("\n").filter(Boolean) })}
                    placeholder="Uma acção por linha"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">Insira uma acção por linha</p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="institutional" onClick={handleSaveStep}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
