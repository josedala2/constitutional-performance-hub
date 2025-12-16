import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Target, 
  Award, 
  FileText, 
  TrendingUp,
  Calendar,
  Building2,
  Mail,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft,
  Printer,
  Download
} from "lucide-react";
import { mockUsers, mockCycles, mockObjectives, mockCompetencies, mockEvaluations, mockEmployeeSummaries } from "@/data/mockData";
import { RelatorioAvaliacaoOficial } from "@/components/print/RelatorioAvaliacaoOficial";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";

export default function ConsultaAvaliacoes() {
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const selectedUser = mockUsers.find(u => u.id === selectedUserId);
  
  // Filter evaluations for selected user
  const userEvaluations = mockEvaluations.filter(e => e.avaliado_id === selectedUserId);
  
  // Filter objectives for selected user
  const userObjectives = mockObjectives.filter(o => o.avaliado_id === selectedUserId);
  
  // Get employee summary
  const userSummary = mockEmployeeSummaries.find(s => s.avaliado.id === selectedUserId);

  const getQualitativeGrade = (naf: number) => {
    if (naf >= 4.5) return { label: "Muito Bom", variant: "success" as const };
    if (naf >= 3.5) return { label: "Bom", variant: "info" as const };
    if (naf >= 2.5) return { label: "Suficiente", variant: "warning" as const };
    if (naf >= 1.5) return { label: "Insuficiente", variant: "destructive" as const };
    return { label: "Mau", variant: "destructive" as const };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'homologada':
        return <Badge variant="success"><CheckCircle2 className="h-3 w-3 mr-1" />Homologada</Badge>;
      case 'submetida':
        return <Badge variant="info"><Clock className="h-3 w-3 mr-1" />Submetida</Badge>;
      case 'em_curso':
        return <Badge variant="warning"><AlertCircle className="h-3 w-3 mr-1" />Em Curso</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCycleName = (cycleId: string) => {
    const cycle = mockCycles.find(c => c.id === cycleId);
    if (!cycle) return cycleId;
    return `${cycle.ano} - ${cycle.semestre}º Semestre`;
  };

  const getEvaluatorName = (evaluatorId: string) => {
    return mockUsers.find(u => u.id === evaluatorId)?.nome || "N/A";
  };

  // Calculate average NAF
  const averageNAF = userEvaluations.length > 0 
    ? userEvaluations.reduce((acc, e) => acc + (e.nota_final || 0), 0) / userEvaluations.length 
    : 0;

  // Calculate objectives completion rate
  const completedObjectives = userObjectives.filter(o => o.grau_concretizacao >= 100).length;
  const objectivesRate = userObjectives.length > 0 
    ? (completedObjectives / userObjectives.length) * 100 
    : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    if (!reportRef.current || !selectedUser) return;
    
    setIsExporting(true);
    toast.info("A gerar PDF...");
    
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      const fileName = `Relatorio_Avaliacao_${selectedUser.nome.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast.success("PDF exportado com sucesso!");
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast.error("Erro ao exportar PDF");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Consulta de Avaliações</h1>
            <p className="text-muted-foreground">
              Selecione um colaborador para visualizar o histórico completo de avaliações
            </p>
          </div>
        </div>
        {selectedUser && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <Button onClick={handleExportPDF} disabled={isExporting} className="gap-2">
              <Download className="h-4 w-4" />
              {isExporting ? "A exportar..." : "Exportar PDF"}
            </Button>
          </div>
        )}
      </div>

      {/* Selector - hidden when printing */}
      <Card className="print:hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Selecionar Colaborador
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="Escolha um colaborador..." />
            </SelectTrigger>
            <SelectContent>
              {mockUsers.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex items-center gap-2">
                    <span>{user.nome}</span>
                    <span className="text-muted-foreground text-sm">- {user.unidade_organica}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* User Profile & Stats - Wrapped in ref for PDF export */}
      {selectedUser && (
        <div ref={reportRef} className="space-y-6 bg-background p-4 print:p-0">
          <div className="grid gap-6 md:grid-cols-4">
            {/* Profile Card */}
            <Card className="md:col-span-1">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-serif">
                      {selectedUser.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">{selectedUser.nome}</h3>
                  <p className="text-muted-foreground text-sm">{selectedUser.cargo}</p>
                  <Badge variant="outline" className="mt-2">{selectedUser.carreira}</Badge>
                  
                  <div className="mt-4 w-full space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{selectedUser.unidade_organica}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{selectedUser.email}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">NAF Médio</p>
                    <p className="text-2xl font-bold">{averageNAF.toFixed(2)}</p>
                    {averageNAF > 0 && (
                      <Badge variant={getQualitativeGrade(averageNAF).variant} className="mt-1">
                        {getQualitativeGrade(averageNAF).label}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-gold/10">
                    <FileText className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Avaliações</p>
                    <p className="text-2xl font-bold">{userEvaluations.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {userEvaluations.filter(e => e.estado === 'homologada').length} homologadas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <Target className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Objectivos</p>
                    <p className="text-2xl font-bold">{completedObjectives}/{userObjectives.length}</p>
                    <Progress value={objectivesRate} className="mt-2 h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Tabs */}
          <Tabs defaultValue="avaliacoes" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
              <TabsTrigger value="avaliacoes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Avaliações
              </TabsTrigger>
              <TabsTrigger value="objectivos" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Objectivos
              </TabsTrigger>
              <TabsTrigger value="competencias" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Competências
              </TabsTrigger>
              <TabsTrigger value="evolucao" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Evolução
              </TabsTrigger>
            </TabsList>

            {/* Avaliações Tab */}
            <TabsContent value="avaliacoes">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Avaliações</CardTitle>
                  <CardDescription>Todas as avaliações realizadas ao colaborador</CardDescription>
                </CardHeader>
                <CardContent>
                  {userEvaluations.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ciclo</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Avaliador</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead className="text-center">NAF</TableHead>
                          <TableHead className="text-center">Classificação</TableHead>
                          <TableHead className="text-center">Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userEvaluations.map((evaluation) => {
                          const grade = getQualitativeGrade(evaluation.nota_final || 0);
                          return (
                            <TableRow key={evaluation.id}>
                              <TableCell className="font-medium">{getCycleName(evaluation.ciclo_id)}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{evaluation.tipo}</Badge>
                              </TableCell>
                              <TableCell>{getEvaluatorName(evaluation.avaliador_id)}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  {new Date(evaluation.data_avaliacao).toLocaleDateString('pt-PT')}
                                </div>
                              </TableCell>
                              <TableCell className="text-center font-bold">
                                {evaluation.nota_final?.toFixed(2) || "-"}
                              </TableCell>
                              <TableCell className="text-center">
                                {evaluation.nota_final && (
                                  <Badge variant={grade.variant}>{grade.label}</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                {getStatusBadge(evaluation.estado)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma avaliação encontrada para este colaborador</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Objectivos Tab */}
            <TabsContent value="objectivos">
              <Card>
                <CardHeader>
                  <CardTitle>Objectivos Individuais</CardTitle>
                  <CardDescription>Objectivos definidos e seu progresso</CardDescription>
                </CardHeader>
                <CardContent>
                  {userObjectives.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Objectivo</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead className="text-center">Meta</TableHead>
                          <TableHead className="text-center">Realizado</TableHead>
                          <TableHead className="text-center">Concretização</TableHead>
                          <TableHead className="text-center">Pontuação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userObjectives.map((objective) => (
                          <TableRow key={objective.id}>
                            <TableCell>
                              <p className="font-medium">{objective.descricao}</p>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{objective.tipo}</Badge>
                            </TableCell>
                            <TableCell className="text-center">{objective.meta_planeada}</TableCell>
                            <TableCell className="text-center">{objective.meta_realizada}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress value={objective.grau_concretizacao} className="h-2 flex-1" />
                                <span className="text-sm font-medium w-12 text-right">{objective.grau_concretizacao}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center font-bold text-primary">
                              {objective.pontuacao?.toFixed(2) || "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum objectivo encontrado para este colaborador</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Competências Tab */}
            <TabsContent value="competencias">
              <Card>
                <CardHeader>
                  <CardTitle>Avaliação de Competências</CardTitle>
                  <CardDescription>Competências comportamentais e técnicas avaliadas</CardDescription>
                </CardHeader>
                <CardContent>
                  {userSummary ? (
                    <div className="space-y-6">
                      {/* Summary Cards */}
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="border bg-muted/30">
                          <CardContent className="pt-4 text-center">
                            <p className="text-sm text-muted-foreground">Obj. Individuais</p>
                            <p className="text-2xl font-bold text-primary">{userSummary.objetivos_individuais_media.toFixed(2)}</p>
                          </CardContent>
                        </Card>
                        <Card className="border bg-muted/30">
                          <CardContent className="pt-4 text-center">
                            <p className="text-sm text-muted-foreground">Obj. Equipa</p>
                            <p className="text-2xl font-bold text-primary">{userSummary.objetivos_equipa_media.toFixed(2)}</p>
                          </CardContent>
                        </Card>
                        <Card className="border bg-muted/30">
                          <CardContent className="pt-4 text-center">
                            <p className="text-sm text-muted-foreground">Comp. Transversais</p>
                            <p className="text-2xl font-bold text-primary">{userSummary.competencias_transversais_media.toFixed(2)}</p>
                          </CardContent>
                        </Card>
                        <Card className="border bg-muted/30">
                          <CardContent className="pt-4 text-center">
                            <p className="text-sm text-muted-foreground">Comp. Técnicas</p>
                            <p className="text-2xl font-bold text-primary">{userSummary.competencias_tecnicas_media.toFixed(2)}</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Competencies List */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Badge variant="outline">Transversais</Badge>
                          </h4>
                          <div className="space-y-2">
                            {mockCompetencies.filter(c => c.tipo === 'transversal').map((comp) => (
                              <div key={comp.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <span className="text-sm">{comp.nome}</span>
                                <span className="font-semibold text-primary">4.5</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Badge variant="outline">Técnicas</Badge>
                          </h4>
                          <div className="space-y-2">
                            {mockCompetencies.filter(c => c.tipo === 'tecnica').map((comp) => (
                              <div key={comp.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <span className="text-sm">{comp.nome}</span>
                                <span className="font-semibold text-primary">4.3</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Sem dados de competências disponíveis para este colaborador</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Evolução Tab */}
            <TabsContent value="evolucao">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução do Desempenho</CardTitle>
                  <CardDescription>Análise da progressão ao longo dos ciclos de avaliação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Timeline */}
                    <div className="relative">
                      {userEvaluations.length > 0 ? (
                        <div className="space-y-4">
                          {userEvaluations.map((evaluation, index) => {
                            const grade = getQualitativeGrade(evaluation.nota_final || 0);
                            const isLast = index === userEvaluations.length - 1;
                            return (
                              <div key={evaluation.id} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    evaluation.estado === 'homologada' ? 'bg-green-500' : 'bg-primary'
                                  } text-primary-foreground`}>
                                    {evaluation.estado === 'homologada' ? (
                                      <CheckCircle2 className="h-5 w-5" />
                                    ) : (
                                      <Clock className="h-5 w-5" />
                                    )}
                                  </div>
                                  {!isLast && <div className="w-0.5 h-full bg-border flex-1 min-h-[40px]" />}
                                </div>
                                <Card className="flex-1">
                                  <CardContent className="pt-4">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="font-medium">{getCycleName(evaluation.ciclo_id)}</h4>
                                        <p className="text-sm text-muted-foreground">
                                          {new Date(evaluation.data_avaliacao).toLocaleDateString('pt-PT', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                          })}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-2xl font-bold">{evaluation.nota_final?.toFixed(2)}</p>
                                        <Badge variant={grade.variant}>{grade.label}</Badge>
                                      </div>
                                    </div>
                                    {evaluation.comentarios && (
                                      <p className="mt-2 text-sm text-muted-foreground italic">
                                        "{evaluation.comentarios}"
                                      </p>
                                    )}
                                  </CardContent>
                                </Card>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Sem dados de evolução disponíveis</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Empty State */}
      {!selectedUser && (
        <Card className="border-dashed print:hidden">
          <CardContent className="py-16">
            <div className="text-center text-muted-foreground">
              <User className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2">Nenhum colaborador selecionado</h3>
              <p>Selecione um colaborador acima para visualizar as suas avaliações</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Official Print Report - RADFP Model */}
      {selectedUser && (
        <RelatorioAvaliacaoOficial
          ano={new Date().getFullYear().toString()}
          semestre={new Date().getMonth() < 6 ? "1º" : "2º"}
          orgaoServico="Tribunal de Contas"
          areaDepartamento={selectedUser.unidade_organica}
          categoriaCarreira={selectedUser.carreira}
          nomeAvaliado={selectedUser.nome}
          funcaoExercida={selectedUser.cargo}
          dataInicioFuncao="01/01/2020"
          email={selectedUser.email}
          avaliador={userEvaluations[0] ? getEvaluatorName(userEvaluations[0].avaliador_id) : "N/A"}
          funcaoAvaliador="Dirigente"
          tipoAvaliacao="Avaliação Ordinária"
          modeloAplicado="Modelo RADFP"
          periodoAvaliado={`01/01/${new Date().getFullYear()} a ${new Date().toLocaleDateString('pt-PT')}`}
          historicoAvaliacoes={userEvaluations.map(eval_item => ({
            id: eval_item.id,
            ciclo: getCycleName(eval_item.ciclo_id),
            tipo: eval_item.tipo,
            avaliador: getEvaluatorName(eval_item.avaliador_id),
            data: new Date(eval_item.data_avaliacao).toLocaleDateString('pt-PT'),
            naf: eval_item.nota_final || 0,
            classificacao: getQualitativeGrade(eval_item.nota_final || 0).label,
            estado: eval_item.estado
          }))}
          objectivos={userObjectives.map(obj => ({
            id: obj.id,
            descricao: obj.descricao,
            meta: obj.meta_planeada?.toString(),
            indicador: "Unidades",
            planeado: obj.meta_planeada?.toString(),
            realizado: obj.meta_realizada?.toString(),
            pontuacao: obj.pontuacao
          }))}
          competenciasTransversais={mockCompetencies.filter(c => c.tipo === 'transversal').map(c => ({
            id: c.id,
            nome: c.nome,
            pontuacao: userSummary?.competencias_transversais_media || 4.0
          }))}
          competenciasTecnicas={mockCompetencies.filter(c => c.tipo === 'tecnica').map(c => ({
            id: c.id,
            nome: c.nome,
            pontuacao: userSummary?.competencias_tecnicas_media || 4.0
          }))}
          notaObjectivos={userSummary ? (userSummary.objetivos_individuais_media * 0.4 + userSummary.objetivos_equipa_media * 0.2) : 0}
          notaCompetenciasTransversais={userSummary?.competencias_transversais_media || 0}
          notaCompetenciasTecnicas={userSummary?.competencias_tecnicas_media || 0}
          notaFinal={averageNAF}
          classificacaoQualitativa={getQualitativeGrade(averageNAF).label}
          pontosFortesAvaliador="Demonstra elevada dedicação e empenho nas tarefas atribuídas. Excelente capacidade de organização e gestão do tempo. Boa colaboração com os colegas."
          aspectosMelhorarAvaliador="Desenvolver competências de comunicação escrita. Aprofundar conhecimentos técnicos específicos da área."
          recomendacoesAvaliador="Frequentar formação em comunicação institucional. Participar em projectos transversais para ampliar experiência."
          comentarioAvaliado="Concordo com a avaliação efectuada e comprometo-me a trabalhar nas áreas identificadas para melhoria."
          conclusaoEncaminhamentos="O avaliado atingiu os objectivos propostos de forma satisfatória. Recomenda-se a progressão na carreira conforme regulamento aplicável."
          dataAssinatura={new Date().toLocaleDateString('pt-PT')}
        />
      )}
    </div>
  );
}
