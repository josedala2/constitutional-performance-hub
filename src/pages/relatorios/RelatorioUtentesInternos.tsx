import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  ArrowLeft, 
  Download, 
  Printer,
  Building,
  Calendar,
  ThumbsUp,
  MessageSquare,
  BarChart3
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import tribunalLogo from "@/assets/tribunal-logo.png";

interface CriterioAvaliacao {
  nome: string;
  media: number;
  respostas: number;
}

interface ComentarioUnidade {
  unidade: string;
  texto: string;
}

interface RelatorioInterno {
  id: string;
  nomeCompleto: string;
  orgaoServico: string;
  categoriaFuncao: string;
  ciclo: string;
  numRespostas: number;
  unidadesAvaliadores: string[];
  criterios: CriterioAvaliacao[];
  comentarios: ComentarioUnidade[];
  mediaGeral: number;
  satisfacaoGlobal: number;
}

const mockRelatoriosInternos: RelatorioInterno[] = [
  {
    id: "1",
    nomeCompleto: "Dr. Carlos Mendes",
    orgaoServico: "Departamento de Auditoria I",
    categoriaFuncao: "Técnico Superior",
    ciclo: "2024/2º Semestre",
    numRespostas: 12,
    unidadesAvaliadores: ["Departamento de Auditoria II", "Departamento Jurídico", "Gabinete de Apoio"],
    criterios: [
      { nome: "Qualidade do serviço prestado", media: 4.6, respostas: 12 },
      { nome: "Cumprimento de prazos", media: 4.2, respostas: 12 },
      { nome: "Clareza na comunicação", media: 4.4, respostas: 11 },
      { nome: "Disponibilidade para esclarecer dúvidas", media: 4.8, respostas: 12 },
      { nome: "Profissionalismo no atendimento", media: 4.7, respostas: 12 },
    ],
    comentarios: [
      { unidade: "Departamento de Auditoria II", texto: "Sempre muito prestável e com respostas de qualidade." },
      { unidade: "Departamento Jurídico", texto: "Excelente colaboração nos processos conjuntos." },
      { unidade: "Gabinete de Apoio", texto: "Cumpre prazos e mantém comunicação clara." },
    ],
    mediaGeral: 4.54,
    satisfacaoGlobal: 92,
  },
  {
    id: "2",
    nomeCompleto: "Dra. Maria Santos",
    orgaoServico: "Departamento de Auditoria II",
    categoriaFuncao: "Técnica Superior",
    ciclo: "2024/2º Semestre",
    numRespostas: 15,
    unidadesAvaliadores: ["Departamento de Auditoria I", "Departamento Financeiro", "Secretaria-Geral"],
    criterios: [
      { nome: "Qualidade do serviço prestado", media: 4.9, respostas: 15 },
      { nome: "Cumprimento de prazos", media: 4.7, respostas: 15 },
      { nome: "Clareza na comunicação", media: 4.8, respostas: 14 },
      { nome: "Disponibilidade para esclarecer dúvidas", media: 5.0, respostas: 15 },
      { nome: "Profissionalismo no atendimento", media: 4.9, respostas: 15 },
    ],
    comentarios: [
      { unidade: "Departamento de Auditoria I", texto: "Referência absoluta em termos de qualidade e profissionalismo." },
      { unidade: "Departamento Financeiro", texto: "Colaboração exemplar, sempre disponível." },
      { unidade: "Secretaria-Geral", texto: "Atendimento de excelência." },
    ],
    mediaGeral: 4.86,
    satisfacaoGlobal: 98,
  },
  {
    id: "3",
    nomeCompleto: "Dr. Pedro Oliveira",
    orgaoServico: "Departamento Jurídico",
    categoriaFuncao: "Técnico Superior",
    ciclo: "2024/2º Semestre",
    numRespostas: 8,
    unidadesAvaliadores: ["Departamento de Auditoria I", "Departamento de Auditoria II"],
    criterios: [
      { nome: "Qualidade do serviço prestado", media: 3.8, respostas: 8 },
      { nome: "Cumprimento de prazos", media: 3.2, respostas: 8 },
      { nome: "Clareza na comunicação", media: 3.5, respostas: 7 },
      { nome: "Disponibilidade para esclarecer dúvidas", media: 3.4, respostas: 8 },
      { nome: "Profissionalismo no atendimento", media: 4.0, respostas: 8 },
    ],
    comentarios: [
      { unidade: "Departamento de Auditoria I", texto: "Os pareceres são de qualidade mas os prazos nem sempre são cumpridos." },
      { unidade: "Departamento de Auditoria II", texto: "Poderia melhorar a comunicação sobre o estado dos processos." },
    ],
    mediaGeral: 3.58,
    satisfacaoGlobal: 68,
  },
];

const getMediaColor = (media: number) => {
  if (media >= 4.5) return "text-success";
  if (media >= 4.0) return "text-info";
  if (media >= 3.0) return "text-warning";
  return "text-destructive";
};

const getSatisfacaoColor = (satisfacao: number) => {
  if (satisfacao >= 90) return "bg-success";
  if (satisfacao >= 75) return "bg-info";
  if (satisfacao >= 60) return "bg-warning";
  return "bg-destructive";
};

const RelatorioUtentesInternos = () => {
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
                Relatórios de Avaliação por Utentes Internos
              </h1>
              <p className="mt-1 text-muted-foreground">
                Avaliações de desempenho realizadas por outras unidades orgânicas
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
                  <Building className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockRelatoriosInternos.length}</p>
                  <p className="text-sm text-muted-foreground">Colaboradores Avaliados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-institutional">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-success/10 p-2">
                  <ThumbsUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(mockRelatoriosInternos.reduce((acc, r) => acc + r.satisfacaoGlobal, 0) / mockRelatoriosInternos.length)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Satisfação Média</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-institutional">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-info/10 p-2">
                  <BarChart3 className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {mockRelatoriosInternos.reduce((acc, r) => acc + r.numRespostas, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Respostas</p>
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
          {mockRelatoriosInternos.map((relatorio, index) => (
            <Card key={relatorio.id} className="shadow-institutional animate-fade-in-up mb-6" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="border-b bg-muted/30">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-serif">{relatorio.nomeCompleto}</CardTitle>
                    <CardDescription className="mt-1">
                      {relatorio.categoriaFuncao} • {relatorio.orgaoServico}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">
                      {relatorio.numRespostas} Respostas
                    </Badge>
                    <div className="flex items-center gap-2">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${getSatisfacaoColor(relatorio.satisfacaoGlobal)}`}>
                        {relatorio.satisfacaoGlobal}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Unidades Avaliadoras */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Building className="h-4 w-4 text-accent" />
                    Unidades Orgânicas Avaliadoras
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {relatorio.unidadesAvaliadores.map((unidade, i) => (
                      <Badge key={i} variant="secondary">{unidade}</Badge>
                    ))}
                  </div>
                </div>

                {/* Critérios */}
                <div>
                  <h4 className="font-semibold mb-4">Avaliação por Critério</h4>
                  <div className="space-y-4">
                    {relatorio.criterios.map((criterio, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{criterio.nome}</span>
                          <span className={`font-medium ${getMediaColor(criterio.media)}`}>
                            {criterio.media.toFixed(1)} ({criterio.respostas} respostas)
                          </span>
                        </div>
                        <Progress value={criterio.media * 20} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Média Geral */}
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Média Geral de Avaliação</span>
                    <span className={`text-2xl font-bold ${getMediaColor(relatorio.mediaGeral)}`}>
                      {relatorio.mediaGeral.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Comentários */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-accent" />
                    Feedback das Unidades
                  </h4>
                  <div className="space-y-3">
                    {relatorio.comentarios.map((comentario, i) => (
                      <div key={i} className="p-4 bg-muted/20 rounded-lg border-l-4 border-info">
                        <span className="text-sm font-medium text-info">{comentario.unidade}</span>
                        <p className="text-muted-foreground mt-1">"{comentario.texto}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Print View - Official Format */}
        {mockRelatoriosInternos.map((relatorio, index) => (
          <div key={index} className="hidden print:block print-content bg-white text-black p-6 page-break-after">
            {/* Cabeçalho Oficial */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <img 
                  src={tribunalLogo} 
                  alt="Tribunal de Contas" 
                  className="h-16 w-auto object-contain"
                  style={{ maxHeight: '60px' }}
                />
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-600 font-medium">
                República de Angola
              </p>
              <p className="text-sm font-semibold text-gray-800 mb-2">
                Tribunal de Contas
              </p>
              <p className="text-xs text-gray-600 mb-4">
                Sistema de Gestão de Avaliação de Desempenho (SGAD)
              </p>
              <h1 className="text-lg font-bold text-gray-900 font-serif border-b-2 border-gray-800 pb-2 inline-block">
                RELATÓRIO DE AVALIAÇÃO POR UTENTES INTERNOS
              </h1>
            </div>

            {/* 1. Identificação do Avaliado */}
            <section className="mb-6">
              <h2 className="text-sm font-bold bg-gray-100 p-2 mb-3 border-l-4 border-gray-800">
                1. Identificação do Avaliado
              </h2>
              <Table className="border">
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="border text-xs font-semibold text-gray-900">Nome Completo</TableHead>
                    <TableHead className="border text-xs font-semibold text-gray-900">Órgão/Serviço</TableHead>
                    <TableHead className="border text-xs font-semibold text-gray-900">Categoria/Função</TableHead>
                    <TableHead className="border text-xs font-semibold text-gray-900">Ciclo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="border text-xs">{relatorio.nomeCompleto}</TableCell>
                    <TableCell className="border text-xs">{relatorio.orgaoServico}</TableCell>
                    <TableCell className="border text-xs">{relatorio.categoriaFuncao}</TableCell>
                    <TableCell className="border text-xs">{relatorio.ciclo}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>

            {/* 2. Unidades Avaliadoras */}
            <section className="mb-6">
              <h2 className="text-sm font-bold bg-gray-100 p-2 mb-3 border-l-4 border-gray-800">
                2. Unidades Orgânicas Avaliadoras
              </h2>
              <div className="border rounded p-3 text-xs">
                {relatorio.unidadesAvaliadores.join(" • ")}
              </div>
            </section>

            {/* 3. Avaliação por Critério */}
            <section className="mb-6">
              <h2 className="text-sm font-bold bg-gray-100 p-2 mb-3 border-l-4 border-gray-800">
                3. Avaliação por Critério
              </h2>
              <Table className="border">
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="border text-xs font-semibold text-gray-900">Critério</TableHead>
                    <TableHead className="border text-xs font-semibold text-gray-900 w-24 text-center">Pontuação Média (1-5)</TableHead>
                    <TableHead className="border text-xs font-semibold text-gray-900 w-20 text-center">Nº Respostas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relatorio.criterios.map((criterio, i) => (
                    <TableRow key={i}>
                      <TableCell className="border text-xs">{criterio.nome}</TableCell>
                      <TableCell className="border text-xs text-center font-medium">{criterio.media.toFixed(1)}</TableCell>
                      <TableCell className="border text-xs text-center">{criterio.respostas}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-100 font-bold">
                    <TableCell className="border text-xs">Média Geral</TableCell>
                    <TableCell className="border text-xs text-center text-lg">{relatorio.mediaGeral.toFixed(2)}</TableCell>
                    <TableCell className="border text-xs text-center">{relatorio.numRespostas}</TableCell>
                  </TableRow>
                  <TableRow className="bg-primary/10">
                    <TableCell className="border text-xs" colSpan={2}>Índice de Satisfação Global</TableCell>
                    <TableCell className="border text-xs text-center font-bold">{relatorio.satisfacaoGlobal}%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>

            {/* 4. Comentários */}
            <section className="mb-6">
              <h2 className="text-sm font-bold bg-gray-100 p-2 mb-3 border-l-4 border-gray-800">
                4. Feedback das Unidades Avaliadoras
              </h2>
              <div className="space-y-2">
                {relatorio.comentarios.map((comentario, i) => (
                  <div key={i} className="border rounded p-3 text-xs">
                    <p className="font-medium mb-1">{comentario.unidade}</p>
                    <p className="italic text-gray-700">"{comentario.texto}"</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Rodapé */}
            <footer className="mt-8 pt-4 border-t text-center text-xs text-gray-500">
              <p>Sistema de Gestão de Avaliação de Desempenho (SGAD) - Tribunal de Contas de Angola</p>
              <p className="mt-1">Documento gerado automaticamente em {new Date().toLocaleDateString('pt-PT')}</p>
            </footer>
          </div>
        ))}
      </div>
    </AppLayout>
  );
};

export default RelatorioUtentesInternos;
