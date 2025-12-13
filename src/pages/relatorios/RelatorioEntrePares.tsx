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
  Users,
  Calendar,
  Star,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import tribunalLogo from "@/assets/tribunal-logo.png";

interface AvaliacaoPar {
  avaliador: string;
  data: string;
  criterios: { nome: string; pontuacao: number }[];
  comentario: string;
}

interface RelatorioPares {
  id: string;
  nomeCompleto: string;
  orgaoServico: string;
  categoriaFuncao: string;
  ciclo: string;
  numAvaliadores: number;
  avaliacoes: AvaliacaoPar[];
  mediaGeral: number;
}

const mockRelatoriosPares: RelatorioPares[] = [
  {
    id: "1",
    nomeCompleto: "Dr. Carlos Mendes",
    orgaoServico: "Departamento de Auditoria I",
    categoriaFuncao: "Técnico Superior",
    ciclo: "2024/2º Semestre",
    numAvaliadores: 5,
    avaliacoes: [
      {
        avaliador: "Par 1 (Anónimo)",
        data: "2025-01-03",
        criterios: [
          { nome: "Colaboração e espírito de equipa", pontuacao: 5 },
          { nome: "Comunicação interpessoal", pontuacao: 4 },
          { nome: "Partilha de conhecimentos", pontuacao: 5 },
          { nome: "Disponibilidade para ajudar", pontuacao: 5 },
          { nome: "Profissionalismo", pontuacao: 4 },
        ],
        comentario: "Excelente colega, sempre disponível para ajudar e partilhar conhecimentos.",
      },
      {
        avaliador: "Par 2 (Anónimo)",
        data: "2025-01-02",
        criterios: [
          { nome: "Colaboração e espírito de equipa", pontuacao: 4 },
          { nome: "Comunicação interpessoal", pontuacao: 4 },
          { nome: "Partilha de conhecimentos", pontuacao: 4 },
          { nome: "Disponibilidade para ajudar", pontuacao: 5 },
          { nome: "Profissionalismo", pontuacao: 5 },
        ],
        comentario: "Colaborador muito profissional, contribui positivamente para o ambiente de trabalho.",
      },
      {
        avaliador: "Par 3 (Anónimo)",
        data: "2025-01-02",
        criterios: [
          { nome: "Colaboração e espírito de equipa", pontuacao: 5 },
          { nome: "Comunicação interpessoal", pontuacao: 5 },
          { nome: "Partilha de conhecimentos", pontuacao: 4 },
          { nome: "Disponibilidade para ajudar", pontuacao: 4 },
          { nome: "Profissionalismo", pontuacao: 5 },
        ],
        comentario: "Um dos melhores colegas com quem já trabalhei. Grande capacidade de comunicação.",
      },
    ],
    mediaGeral: 4.53,
  },
  {
    id: "2",
    nomeCompleto: "Dra. Maria Santos",
    orgaoServico: "Departamento de Auditoria II",
    categoriaFuncao: "Técnica Superior",
    ciclo: "2024/2º Semestre",
    numAvaliadores: 4,
    avaliacoes: [
      {
        avaliador: "Par 1 (Anónimo)",
        data: "2025-01-04",
        criterios: [
          { nome: "Colaboração e espírito de equipa", pontuacao: 5 },
          { nome: "Comunicação interpessoal", pontuacao: 5 },
          { nome: "Partilha de conhecimentos", pontuacao: 5 },
          { nome: "Disponibilidade para ajudar", pontuacao: 5 },
          { nome: "Profissionalismo", pontuacao: 5 },
        ],
        comentario: "Colega exemplar em todos os aspectos. Referência no departamento.",
      },
      {
        avaliador: "Par 2 (Anónimo)",
        data: "2025-01-03",
        criterios: [
          { nome: "Colaboração e espírito de equipa", pontuacao: 5 },
          { nome: "Comunicação interpessoal", pontuacao: 4 },
          { nome: "Partilha de conhecimentos", pontuacao: 5 },
          { nome: "Disponibilidade para ajudar", pontuacao: 5 },
          { nome: "Profissionalismo", pontuacao: 5 },
        ],
        comentario: "Sempre disposta a ensinar e ajudar os colegas mais novos.",
      },
    ],
    mediaGeral: 4.9,
  },
  {
    id: "3",
    nomeCompleto: "Dr. Pedro Oliveira",
    orgaoServico: "Departamento Jurídico",
    categoriaFuncao: "Técnico Superior",
    ciclo: "2024/2º Semestre",
    numAvaliadores: 3,
    avaliacoes: [
      {
        avaliador: "Par 1 (Anónimo)",
        data: "2025-01-02",
        criterios: [
          { nome: "Colaboração e espírito de equipa", pontuacao: 3 },
          { nome: "Comunicação interpessoal", pontuacao: 3 },
          { nome: "Partilha de conhecimentos", pontuacao: 4 },
          { nome: "Disponibilidade para ajudar", pontuacao: 3 },
          { nome: "Profissionalismo", pontuacao: 4 },
        ],
        comentario: "Bom profissional, mas poderia ser mais colaborativo em projectos de equipa.",
      },
      {
        avaliador: "Par 2 (Anónimo)",
        data: "2025-01-01",
        criterios: [
          { nome: "Colaboração e espírito de equipa", pontuacao: 3 },
          { nome: "Comunicação interpessoal", pontuacao: 4 },
          { nome: "Partilha de conhecimentos", pontuacao: 3 },
          { nome: "Disponibilidade para ajudar", pontuacao: 3 },
          { nome: "Profissionalismo", pontuacao: 4 },
        ],
        comentario: "Tecnicamente competente, com margem de melhoria na colaboração.",
      },
    ],
    mediaGeral: 3.4,
  },
];

const getMediaColor = (media: number) => {
  if (media >= 4.5) return "text-success";
  if (media >= 4.0) return "text-info";
  if (media >= 3.0) return "text-warning";
  return "text-destructive";
};

const calcularMediaCriterio = (avaliacoes: AvaliacaoPar[], criterioNome: string) => {
  const valores = avaliacoes.map(a => a.criterios.find(c => c.nome === criterioNome)?.pontuacao || 0);
  return (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(2);
};

const criteriosBase = [
  "Colaboração e espírito de equipa",
  "Comunicação interpessoal",
  "Partilha de conhecimentos",
  "Disponibilidade para ajudar",
  "Profissionalismo"
];

const RelatorioEntrePares = () => {
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
                Relatórios de Avaliação entre Pares
              </h1>
              <p className="mt-1 text-muted-foreground">
                Avaliações de desempenho realizadas por colegas de trabalho
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
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockRelatoriosPares.length}</p>
                  <p className="text-sm text-muted-foreground">Colaboradores Avaliados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-institutional">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-success/10 p-2">
                  <Star className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {(mockRelatoriosPares.reduce((acc, r) => acc + r.mediaGeral, 0) / mockRelatoriosPares.length).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">Média Geral</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-institutional">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-info/10 p-2">
                  <MessageSquare className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {mockRelatoriosPares.reduce((acc, r) => acc + r.avaliacoes.length, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Avaliações</p>
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
          {mockRelatoriosPares.map((relatorio, index) => (
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
                      {relatorio.numAvaliadores} Avaliadores
                    </Badge>
                    <div className={`text-2xl font-bold ${getMediaColor(relatorio.mediaGeral)}`}>
                      {relatorio.mediaGeral.toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Média por Critério */}
                <div>
                  <h4 className="font-semibold mb-4">Média por Critério</h4>
                  <div className="space-y-4">
                    {criteriosBase.map((criterio) => {
                      const media = parseFloat(calcularMediaCriterio(relatorio.avaliacoes, criterio));
                      return (
                        <div key={criterio} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{criterio}</span>
                            <span className="font-medium">{media.toFixed(2)}</span>
                          </div>
                          <Progress value={media * 20} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Comentários Anónimos */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-accent" />
                    Comentários dos Pares (Anónimos)
                  </h4>
                  <div className="space-y-3">
                    {relatorio.avaliacoes.map((avaliacao, i) => (
                      <div key={i} className="p-4 bg-muted/20 rounded-lg border-l-4 border-accent">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium">{avaliacao.avaliador}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(avaliacao.data).toLocaleDateString('pt-PT')}
                          </span>
                        </div>
                        <p className="text-muted-foreground italic">"{avaliacao.comentario}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Print View - Official Format */}
        {mockRelatoriosPares.map((relatorio, index) => (
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
                RELATÓRIO DE AVALIAÇÃO ENTRE PARES
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

            {/* 2. Resumo da Avaliação */}
            <section className="mb-6">
              <h2 className="text-sm font-bold bg-gray-100 p-2 mb-3 border-l-4 border-gray-800">
                2. Resumo da Avaliação entre Pares
              </h2>
              <Table className="border">
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="border text-xs font-semibold text-gray-900">Critério</TableHead>
                    <TableHead className="border text-xs font-semibold text-gray-900 w-24 text-center">Pontuação Média (1-5)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {criteriosBase.map((criterio, i) => (
                    <TableRow key={i}>
                      <TableCell className="border text-xs">{criterio}</TableCell>
                      <TableCell className="border text-xs text-center font-medium">
                        {calcularMediaCriterio(relatorio.avaliacoes, criterio)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-100 font-bold">
                    <TableCell className="border text-xs">Média Geral</TableCell>
                    <TableCell className="border text-xs text-center text-lg">{relatorio.mediaGeral.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>

            {/* 3. Comentários */}
            <section className="mb-6">
              <h2 className="text-sm font-bold bg-gray-100 p-2 mb-3 border-l-4 border-gray-800">
                3. Comentários dos Avaliadores (Anónimos)
              </h2>
              <div className="space-y-2">
                {relatorio.avaliacoes.map((av, i) => (
                  <div key={i} className="border rounded p-3 text-xs">
                    <p className="font-medium mb-1">{av.avaliador} - {new Date(av.data).toLocaleDateString('pt-PT')}</p>
                    <p className="italic text-gray-700">"{av.comentario}"</p>
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

export default RelatorioEntrePares;
