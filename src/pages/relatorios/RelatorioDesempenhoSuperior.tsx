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
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockRelatorios = [
  {
    id: "1",
    avaliado: "Dr. Carlos Mendes",
    cargo: "Técnico Superior",
    unidade: "Departamento de Auditoria I",
    avaliador: "Dr. António Silva",
    cargoAvaliador: "Director de Departamento",
    ciclo: "2024/2º Semestre",
    dataAvaliacao: "2025-01-05",
    objectivos: [
      { nome: "Realizar 15 auditorias completas", peso: 30, pontuacao: 4.5, ponderado: 1.35 },
      { nome: "Reduzir tempo médio de auditoria em 10%", peso: 25, pontuacao: 4.0, ponderado: 1.0 },
      { nome: "Elaborar relatórios sem erros materiais", peso: 25, pontuacao: 5.0, ponderado: 1.25 },
      { nome: "Participar em 3 formações técnicas", peso: 20, pontuacao: 4.0, ponderado: 0.8 },
    ],
    competencias: [
      { nome: "Conhecimento Técnico", pontuacao: 4.5 },
      { nome: "Responsabilidade e Compromisso", pontuacao: 5.0 },
      { nome: "Comunicação", pontuacao: 4.0 },
      { nome: "Trabalho em Equipa", pontuacao: 4.5 },
      { nome: "Orientação para Resultados", pontuacao: 4.5 },
    ],
    naf: 4.4,
    classificacao: "Muito Bom",
    observacoes: "Colaborador exemplar com excelente desempenho técnico. Demonstra grande capacidade de liderança e compromisso com os objectivos institucionais.",
  },
  {
    id: "2",
    avaliado: "Dra. Maria Santos",
    cargo: "Técnica Superior",
    unidade: "Departamento de Auditoria II",
    avaliador: "Dr. João Ferreira",
    cargoAvaliador: "Director de Departamento",
    ciclo: "2024/2º Semestre",
    dataAvaliacao: "2025-01-04",
    objectivos: [
      { nome: "Analisar 50 processos de contratação pública", peso: 35, pontuacao: 5.0, ponderado: 1.75 },
      { nome: "Elaborar 10 pareceres técnicos", peso: 30, pontuacao: 4.5, ponderado: 1.35 },
      { nome: "Apoiar formação de novos colaboradores", peso: 20, pontuacao: 4.0, ponderado: 0.8 },
      { nome: "Participar em grupos de trabalho", peso: 15, pontuacao: 4.5, ponderado: 0.675 },
    ],
    competencias: [
      { nome: "Conhecimento Técnico", pontuacao: 5.0 },
      { nome: "Responsabilidade e Compromisso", pontuacao: 4.5 },
      { nome: "Comunicação", pontuacao: 4.5 },
      { nome: "Trabalho em Equipa", pontuacao: 4.0 },
      { nome: "Orientação para Resultados", pontuacao: 5.0 },
    ],
    naf: 4.58,
    classificacao: "Excelente",
    observacoes: "Desempenho excepcional. A colaboradora superou todas as expectativas e contribuiu significativamente para os resultados do departamento.",
  },
  {
    id: "3",
    avaliado: "Dr. Pedro Oliveira",
    cargo: "Técnico Superior",
    unidade: "Departamento Jurídico",
    avaliador: "Dra. Ana Costa",
    cargoAvaliador: "Directora de Departamento",
    ciclo: "2024/2º Semestre",
    dataAvaliacao: "2025-01-03",
    objectivos: [
      { nome: "Emitir 30 pareceres jurídicos", peso: 40, pontuacao: 3.5, ponderado: 1.4 },
      { nome: "Acompanhar processos contenciosos", peso: 30, pontuacao: 4.0, ponderado: 1.2 },
      { nome: "Actualizar base de dados jurídica", peso: 20, pontuacao: 3.0, ponderado: 0.6 },
      { nome: "Formação contínua em direito público", peso: 10, pontuacao: 4.0, ponderado: 0.4 },
    ],
    competencias: [
      { nome: "Conhecimento Técnico", pontuacao: 4.0 },
      { nome: "Responsabilidade e Compromisso", pontuacao: 3.5 },
      { nome: "Comunicação", pontuacao: 3.5 },
      { nome: "Trabalho em Equipa", pontuacao: 3.0 },
      { nome: "Orientação para Resultados", pontuacao: 3.5 },
    ],
    naf: 3.6,
    classificacao: "Bom",
    observacoes: "Desempenho satisfatório com margem para melhoria na área de trabalho colaborativo e cumprimento de prazos.",
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

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
            <Button variant="outline">
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
        <div className="grid gap-4 md:grid-cols-4">
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
                  <p className="text-2xl font-bold">4.19</p>
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
                  <p className="text-2xl font-bold">1</p>
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

        {/* Individual Reports */}
        {mockRelatorios.map((relatorio, index) => (
          <Card key={relatorio.id} className="shadow-institutional animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="border-b bg-muted/30">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-serif">{relatorio.avaliado}</CardTitle>
                  <CardDescription className="mt-1">
                    {relatorio.cargo} • {relatorio.unidade}
                  </CardDescription>
                </div>
                <Badge className={getClassificacaoColor(relatorio.classificacao)}>
                  {relatorio.classificacao} ({relatorio.naf.toFixed(2)})
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Avaliador Info */}
              <div className="grid gap-4 md:grid-cols-3 p-4 bg-muted/20 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Avaliador</p>
                  <p className="font-medium">{relatorio.avaliador}</p>
                  <p className="text-sm text-muted-foreground">{relatorio.cargoAvaliador}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ciclo de Avaliação</p>
                  <p className="font-medium">{relatorio.ciclo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data da Avaliação</p>
                  <p className="font-medium">{new Date(relatorio.dataAvaliacao).toLocaleDateString('pt-PT')}</p>
                </div>
              </div>

              {/* Objectivos */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-accent" />
                  Avaliação de Objectivos
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Objectivo</TableHead>
                      <TableHead className="text-center w-20">Peso (%)</TableHead>
                      <TableHead className="text-center w-24">Pontuação</TableHead>
                      <TableHead className="text-center w-24">Ponderado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatorio.objectivos.map((obj, i) => (
                      <TableRow key={i}>
                        <TableCell>{obj.nome}</TableCell>
                        <TableCell className="text-center">{obj.peso}%</TableCell>
                        <TableCell className="text-center font-medium">{obj.pontuacao.toFixed(1)}</TableCell>
                        <TableCell className="text-center font-medium">{obj.ponderado.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/30 font-semibold">
                      <TableCell colSpan={2}>Total Objectivos</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">
                        {relatorio.objectivos.reduce((acc, obj) => acc + obj.ponderado, 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Competências */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4 text-accent" />
                  Avaliação de Competências
                </h4>
                <div className="grid gap-3 md:grid-cols-5">
                  {relatorio.competencias.map((comp, i) => (
                    <div key={i} className="p-3 border rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">{comp.nome}</p>
                      <p className="text-xl font-bold text-primary">{comp.pontuacao.toFixed(1)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Observações */}
              <div className="p-4 bg-muted/20 rounded-lg">
                <h4 className="font-semibold mb-2">Observações do Avaliador</h4>
                <p className="text-muted-foreground">{relatorio.observacoes}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
};

export default RelatorioDesempenhoSuperior;
