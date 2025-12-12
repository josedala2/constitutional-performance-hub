import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ClipboardCheck, Eye, FileText, CheckCircle } from "lucide-react";
import { mockEvaluations, mockUsers, mockCycles } from "@/data/mockData";
import { Evaluation, getGradeVariant } from "@/types/sgad";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { AvaliacaoModal } from "@/components/modals/AvaliacaoModal";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Avaliacoes = () => {
  const [evaluations, setEvaluations] = useState(mockEvaluations);
  const [modalOpen, setModalOpen] = useState(false);
  const [homologarDialogOpen, setHomologarDialogOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);

  const getUser = (id: string) => mockUsers.find((u) => u.id === id);
  const getCycle = (id: string) => mockCycles.find((c) => c.id === id);

  const getTypeLabel = (tipo: string) => {
    switch (tipo) {
      case "superior": return "Superior Hierárquico";
      case "pares": return "Entre Pares";
      case "utente_interno": return "Utente Interno";
      case "utente_externo": return "Utente Externo";
      default: return tipo;
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "rascunho": return <Badge variant="secondary">Rascunho</Badge>;
      case "submetida": return <Badge variant="info">Submetida</Badge>;
      case "homologada": return <Badge variant="success">Homologada</Badge>;
      default: return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const handleView = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setModalOpen(true);
  };

  const handleHomologar = () => {
    setModalOpen(false);
    setHomologarDialogOpen(true);
  };

  const confirmHomologar = () => {
    if (selectedEvaluation) {
      setEvaluations(evaluations.map((e) => 
        e.id === selectedEvaluation.id ? { ...e, estado: "homologada" as const } : e
      ));
      toast.success("Avaliação homologada com sucesso");
    }
    setHomologarDialogOpen(false);
  };

  // Stats
  const totalAvaliacoes = evaluations.length;
  const homologadas = evaluations.filter((e) => e.estado === "homologada").length;
  const submetidas = evaluations.filter((e) => e.estado === "submetida").length;
  const progressPercent = ((homologadas + submetidas) / totalAvaliacoes) * 100;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Avaliações
            </h1>
            <p className="mt-1 text-muted-foreground">
              Gestão das avaliações de desempenho
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/avaliacoes/pessoal-tecnico">
              <Button variant="institutional" size="lg">
                <ClipboardCheck className="h-5 w-5 mr-2" />
                Nova Avaliação
              </Button>
            </Link>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="gradient-institutional text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h3 className="text-lg font-serif font-semibold">
                  Progresso do Ciclo Actual
                </h3>
                <p className="text-sm opacity-90 mt-1">
                  2025 - 1º Semestre
                </p>
              </div>
              <div className="flex-1 max-w-xl">
                <div className="flex justify-between text-sm mb-2">
                  <span>Avaliações concluídas</span>
                  <span>{homologadas + submetidas} de {totalAvaliacoes}</span>
                </div>
                <Progress value={progressPercent} className="h-3 bg-white/20" />
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold font-serif">{homologadas}</p>
                  <p className="text-xs opacity-80">Homologadas</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold font-serif">{submetidas}</p>
                  <p className="text-xs opacity-80">Submetidas</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold font-serif">{totalAvaliacoes - homologadas - submetidas}</p>
                  <p className="text-xs opacity-80">Pendentes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Pesquisar avaliações..." className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Tipo de Avaliação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="superior">Superior Hierárquico</SelectItem>
                  <SelectItem value="pares">Entre Pares</SelectItem>
                  <SelectItem value="utente_interno">Utente Interno</SelectItem>
                  <SelectItem value="utente_externo">Utente Externo</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="rascunho">Rascunho</SelectItem>
                  <SelectItem value="submetida">Submetida</SelectItem>
                  <SelectItem value="homologada">Homologada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Evaluations Table */}
        <Card className="shadow-institutional">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-accent" />
              Lista de Avaliações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Avaliado</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Ciclo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>NAF</TableHead>
                  <TableHead>Classificação</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluations.map((evaluation) => {
                  const avaliado = getUser(evaluation.avaliado_id);
                  const cycle = getCycle(evaluation.ciclo_id);
                  return (
                    <TableRow key={evaluation.id} className="hover:bg-secondary/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                              {avaliado?.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{avaliado?.nome || "N/A"}</p>
                            <p className="text-xs text-muted-foreground">{avaliado?.cargo}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getTypeLabel(evaluation.tipo)}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {cycle ? `${cycle.ano}/${cycle.semestre}º Sem` : "N/A"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(evaluation.data_avaliacao), "d MMM yyyy", { locale: pt })}
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-lg">{evaluation.nota_final.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getGradeVariant(evaluation.classificacao)}>
                          {evaluation.classificacao}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(evaluation.estado)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" title="Ver detalhes" onClick={() => handleView(evaluation)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Gerar relatório">
                            <FileText className="h-4 w-4" />
                          </Button>
                          {evaluation.estado === "submetida" && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              title="Homologar"
                              onClick={() => {
                                setSelectedEvaluation(evaluation);
                                setHomologarDialogOpen(true);
                              }}
                            >
                              <CheckCircle className="h-4 w-4 text-success" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <AvaliacaoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        evaluation={selectedEvaluation}
        onHomologar={handleHomologar}
      />

      {/* Homologar Confirmation */}
      <ConfirmDialog
        open={homologarDialogOpen}
        onOpenChange={setHomologarDialogOpen}
        title="Homologar Avaliação"
        description="Tem a certeza que deseja homologar esta avaliação? Após homologação, a avaliação não poderá ser alterada."
        confirmText="Homologar"
        variant="default"
        onConfirm={confirmHomologar}
      />
    </AppLayout>
  );
};

export default Avaliacoes;
