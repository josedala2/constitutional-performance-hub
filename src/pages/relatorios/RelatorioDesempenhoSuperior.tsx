import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ArrowLeft, 
  Download, 
  Printer,
  User,
  Calendar,
  Target,
  Award,
  TrendingUp,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RelatorioOficial, RelatorioOficialData } from "@/components/print/RelatorioOficial";

const mockRelatorios: RelatorioOficialData[] = [
  {
    nomeCompleto: "Dr. Carlos Mendes",
    orgaoServico: "Departamento de Auditoria I",
    categoriaFuncao: "Técnico Superior",
    superiorHierarquico: "Dr. António Silva",
    objectivosIndividuais: [
      { descricao: "Realizar 15 auditorias completas", meta: "15", metaRealizada: "14", pontuacao: 4.5, dataConclusao: "31/12/2024" },
      { descricao: "Reduzir tempo médio de auditoria em 10%", meta: "10%", metaRealizada: "8%", pontuacao: 4.0, dataConclusao: "31/12/2024" },
      { descricao: "Elaborar relatórios sem erros materiais", meta: "100%", metaRealizada: "100%", pontuacao: 5.0, dataConclusao: "31/12/2024" },
      { descricao: "Participar em 3 formações técnicas", meta: "3", metaRealizada: "3", pontuacao: 5.0, dataConclusao: "15/11/2024" },
    ],
    objectivosEquipa: [
      { descricao: "Melhorar índice de satisfação interna", meta: "85%", metaRealizada: "88%", pontuacao: 4.5, dataConclusao: "31/12/2024" },
      { descricao: "Reduzir processos pendentes", meta: "20%", metaRealizada: "22%", pontuacao: 4.5, dataConclusao: "31/12/2024" },
    ],
    competenciasTransversais: [
      { nome: "Responsabilidade e Compromisso", pontuacao: 5.0, observacoes: "Excelente" },
      { nome: "Comunicação", pontuacao: 4.0, observacoes: "Muito bom" },
      { nome: "Trabalho em Equipa", pontuacao: 4.5, observacoes: "Colaborador exemplar" },
      { nome: "Orientação para Resultados", pontuacao: 4.5, observacoes: "-" },
    ],
    competenciasTecnicas: [
      { nome: "Conhecimento Técnico de Auditoria", pontuacao: 4.5, observacoes: "Domínio elevado" },
      { nome: "Análise Crítica", pontuacao: 4.0, observacoes: "-" },
      { nome: "Elaboração de Relatórios", pontuacao: 5.0, observacoes: "Qualidade excepcional" },
    ],
    componentesNAF: [
      { nome: "Objectivos Individuais", peso: 40, valor: 4.63 },
      { nome: "Objectivos de Equipa", peso: 20, valor: 4.50 },
      { nome: "Competências Transversais", peso: 20, valor: 4.50 },
      { nome: "Competências Técnicas", peso: 20, valor: 4.50 },
    ],
    naf: 4.53,
    classificacaoFinal: "Muito Bom",
    conclusao: "Colaborador exemplar com excelente desempenho técnico. Demonstra grande capacidade de liderança e compromisso com os objectivos institucionais. Recomenda-se promoção a cargo de coordenação.",
    dataAvaliador: "05/01/2025",
    dataAvaliado: "05/01/2025",
  },
  {
    nomeCompleto: "Dra. Maria Santos",
    orgaoServico: "Departamento de Auditoria II",
    categoriaFuncao: "Técnica Superior",
    superiorHierarquico: "Dr. João Ferreira",
    objectivosIndividuais: [
      { descricao: "Analisar 50 processos de contratação pública", meta: "50", metaRealizada: "52", pontuacao: 5.0, dataConclusao: "31/12/2024" },
      { descricao: "Elaborar 10 pareceres técnicos", meta: "10", metaRealizada: "12", pontuacao: 5.0, dataConclusao: "30/11/2024" },
      { descricao: "Apoiar formação de novos colaboradores", meta: "5", metaRealizada: "5", pontuacao: 4.5, dataConclusao: "31/12/2024" },
      { descricao: "Participar em grupos de trabalho", meta: "3", metaRealizada: "4", pontuacao: 5.0, dataConclusao: "15/12/2024" },
    ],
    objectivosEquipa: [
      { descricao: "Atingir meta de processos do departamento", meta: "100%", metaRealizada: "105%", pontuacao: 5.0, dataConclusao: "31/12/2024" },
      { descricao: "Implementar novos procedimentos", meta: "3", metaRealizada: "3", pontuacao: 4.5, dataConclusao: "30/11/2024" },
    ],
    competenciasTransversais: [
      { nome: "Responsabilidade e Compromisso", pontuacao: 5.0, observacoes: "Excepcional" },
      { nome: "Comunicação", pontuacao: 4.5, observacoes: "Muito clara" },
      { nome: "Trabalho em Equipa", pontuacao: 5.0, observacoes: "Referência" },
      { nome: "Orientação para Resultados", pontuacao: 5.0, observacoes: "Supera expectativas" },
    ],
    competenciasTecnicas: [
      { nome: "Conhecimento Técnico", pontuacao: 5.0, observacoes: "Especialista" },
      { nome: "Análise Crítica", pontuacao: 5.0, observacoes: "-" },
      { nome: "Elaboração de Relatórios", pontuacao: 4.5, observacoes: "-" },
    ],
    componentesNAF: [
      { nome: "Objectivos Individuais", peso: 40, valor: 4.88 },
      { nome: "Objectivos de Equipa", peso: 20, valor: 4.75 },
      { nome: "Competências Transversais", peso: 20, valor: 4.88 },
      { nome: "Competências Técnicas", peso: 20, valor: 4.83 },
    ],
    naf: 4.84,
    classificacaoFinal: "Excelente",
    conclusao: "Desempenho excepcional. A colaboradora superou todas as expectativas e contribuiu significativamente para os resultados do departamento. Forte candidata a cargos de direcção.",
    dataAvaliador: "04/01/2025",
    dataAvaliado: "04/01/2025",
  },
  {
    nomeCompleto: "Dr. Pedro Oliveira",
    orgaoServico: "Departamento Jurídico",
    categoriaFuncao: "Técnico Superior",
    superiorHierarquico: "Dra. Ana Costa",
    objectivosIndividuais: [
      { descricao: "Emitir 30 pareceres jurídicos", meta: "30", metaRealizada: "25", pontuacao: 3.5, dataConclusao: "31/12/2024" },
      { descricao: "Acompanhar processos contenciosos", meta: "15", metaRealizada: "15", pontuacao: 4.0, dataConclusao: "31/12/2024" },
      { descricao: "Actualizar base de dados jurídica", meta: "100%", metaRealizada: "70%", pontuacao: 3.0, dataConclusao: "31/12/2024" },
      { descricao: "Formação contínua em direito público", meta: "2", metaRealizada: "2", pontuacao: 4.0, dataConclusao: "30/09/2024" },
    ],
    objectivosEquipa: [
      { descricao: "Reduzir tempo de resposta a consultas", meta: "20%", metaRealizada: "15%", pontuacao: 3.5, dataConclusao: "31/12/2024" },
      { descricao: "Uniformizar modelos de pareceres", meta: "100%", metaRealizada: "80%", pontuacao: 3.5, dataConclusao: "31/12/2024" },
    ],
    competenciasTransversais: [
      { nome: "Responsabilidade e Compromisso", pontuacao: 3.5, observacoes: "A melhorar" },
      { nome: "Comunicação", pontuacao: 3.5, observacoes: "-" },
      { nome: "Trabalho em Equipa", pontuacao: 3.0, observacoes: "Necessita maior integração" },
      { nome: "Orientação para Resultados", pontuacao: 3.5, observacoes: "-" },
    ],
    competenciasTecnicas: [
      { nome: "Conhecimento Técnico Jurídico", pontuacao: 4.0, observacoes: "Bom domínio" },
      { nome: "Análise Crítica", pontuacao: 3.5, observacoes: "-" },
      { nome: "Elaboração de Pareceres", pontuacao: 4.0, observacoes: "-" },
    ],
    componentesNAF: [
      { nome: "Objectivos Individuais", peso: 40, valor: 3.63 },
      { nome: "Objectivos de Equipa", peso: 20, valor: 3.50 },
      { nome: "Competências Transversais", peso: 20, valor: 3.38 },
      { nome: "Competências Técnicas", peso: 20, valor: 3.83 },
    ],
    naf: 3.58,
    classificacaoFinal: "Bom",
    conclusao: "Desempenho satisfatório com margem para melhoria na área de trabalho colaborativo e cumprimento de prazos. Recomenda-se acompanhamento mais próximo e definição de plano de desenvolvimento.",
    dataAvaliador: "03/01/2025",
    dataAvaliado: "03/01/2025",
  },
];

const getClassificacaoColor = (classificacao: string) => {
  switch (classificacao) {
    case "Excelente":
      return "bg-success/10 text-success border-success/20";
    case "Muito Bom":
      return "bg-info/10 text-info border-info/20";
    case "Bom":
      return "bg-warning/10 text-warning border-warning/20";
    case "Necessita Melhoria":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const RelatorioDesempenhoSuperior = () => {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/relatorios")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Relatórios de Avaliação Superior-Subordinado
              </h1>
              <p className="mt-1 text-muted-foreground">
                Avaliações de desempenho realizadas por superiores hierárquicos
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="gold">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4 print:hidden">
          <Card className="shadow-institutional">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockRelatorios.length}</p>
                  <p className="text-sm text-muted-foreground">Total Avaliações</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-institutional">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-success/10 p-2">
                  <Award className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {(mockRelatorios.reduce((acc, r) => acc + r.naf, 0) / mockRelatorios.length).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">Média NAF</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-institutional">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-info/10 p-2">
                  <TrendingUp className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {mockRelatorios.filter(r => r.classificacaoFinal === "Excelente").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Excelentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-institutional">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-accent/10 p-2">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2024/2º</p>
                  <p className="text-sm text-muted-foreground">Ciclo Actual</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Individual Reports - Screen View */}
        <div className="print:hidden">
          {mockRelatorios.map((relatorio, index) => (
            <Card key={index} className="shadow-institutional animate-fade-in-up mb-6" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="border-b bg-muted/30">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-serif">{relatorio.nomeCompleto}</CardTitle>
                    <CardDescription className="mt-1">
                      {relatorio.categoriaFuncao} • {relatorio.orgaoServico}
                    </CardDescription>
                  </div>
                  <Badge className={getClassificacaoColor(relatorio.classificacaoFinal)}>
                    {relatorio.classificacaoFinal} ({relatorio.naf.toFixed(2)})
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Avaliador Info */}
                <div className="grid gap-4 md:grid-cols-3 p-4 bg-muted/20 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Avaliador</p>
                    <p className="font-medium">{relatorio.superiorHierarquico}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ciclo de Avaliação</p>
                    <p className="font-medium">2024/2º Semestre</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data da Avaliação</p>
                    <p className="font-medium">{relatorio.dataAvaliador}</p>
                  </div>
                </div>

                {/* Objectivos Individuais */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4 text-accent" />
                    Objectivos Individuais (40%)
                  </h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-center w-20">Meta</TableHead>
                        <TableHead className="text-center w-24">Realizado</TableHead>
                        <TableHead className="text-center w-24">Pontuação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {relatorio.objectivosIndividuais.map((obj, i) => (
                        <TableRow key={i}>
                          <TableCell>{obj.descricao}</TableCell>
                          <TableCell className="text-center">{obj.meta}</TableCell>
                          <TableCell className="text-center">{obj.metaRealizada}</TableCell>
                          <TableCell className="text-center font-medium">{obj.pontuacao.toFixed(1)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Objectivos de Equipa */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4 text-info" />
                    Objectivos de Equipa (20%)
                  </h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-center w-20">Meta</TableHead>
                        <TableHead className="text-center w-24">Realizado</TableHead>
                        <TableHead className="text-center w-24">Pontuação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {relatorio.objectivosEquipa.map((obj, i) => (
                        <TableRow key={i}>
                          <TableCell>{obj.descricao}</TableCell>
                          <TableCell className="text-center">{obj.meta}</TableCell>
                          <TableCell className="text-center">{obj.metaRealizada}</TableCell>
                          <TableCell className="text-center font-medium">{obj.pontuacao.toFixed(1)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Competências */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4 text-accent" />
                      Competências Transversais (20%)
                    </h4>
                    <div className="space-y-2">
                      {relatorio.competenciasTransversais.map((comp, i) => (
                        <div key={i} className="flex justify-between items-center p-2 border rounded">
                          <span className="text-sm">{comp.nome}</span>
                          <span className="font-bold text-primary">{comp.pontuacao.toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-accent" />
                      Competências Técnicas (20%)
                    </h4>
                    <div className="space-y-2">
                      {relatorio.competenciasTecnicas.map((comp, i) => (
                        <div key={i} className="flex justify-between items-center p-2 border rounded">
                          <span className="text-sm">{comp.nome}</span>
                          <span className="font-bold text-primary">{comp.pontuacao.toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* NAF Summary */}
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h4 className="font-semibold mb-3">Cálculo da NAF</h4>
                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    {relatorio.componentesNAF.map((comp, i) => (
                      <div key={i} className="text-center p-3 bg-background rounded-lg">
                        <p className="text-xs text-muted-foreground">{comp.nome}</p>
                        <p className="text-sm font-medium">{comp.valor.toFixed(2)} × {comp.peso}%</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="font-semibold">Nota de Avaliação Final (NAF)</span>
                    <span className="text-2xl font-bold text-primary">{relatorio.naf.toFixed(2)}</span>
                  </div>
                </div>

                {/* Conclusão */}
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-semibold mb-2">Conclusão e Recomendações</h4>
                  <p className="text-muted-foreground">{relatorio.conclusao}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Print View - Official Format */}
        {mockRelatorios.map((relatorio, index) => (
          <RelatorioOficial key={index} data={relatorio} />
        ))}
      </div>
    </AppLayout>
  );
};

export default RelatorioDesempenhoSuperior;
