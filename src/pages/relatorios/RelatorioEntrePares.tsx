import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

const mockRelatoriosPares = [
  {
    id: "1",
    avaliado: "Dr. Carlos Mendes",
    cargo: "Técnico Superior",
    unidade: "Departamento de Auditoria I",
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
    avaliado: "Dra. Maria Santos",
    cargo: "Técnica Superior",
    unidade: "Departamento de Auditoria II",
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
    avaliado: "Dr. Pedro Oliveira",
    cargo: "Técnico Superior",
    unidade: "Departamento Jurídico",
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

const RelatorioEntrePares = () => {
  const navigate = useNavigate();

  const calcularMediaCriterio = (avaliacoes: typeof mockRelatoriosPares[0]['avaliacoes'], criterioNome: string) => {
    const valores = avaliacoes.map(a => a.criterios.find(c => c.nome === criterioNome)?.pontuacao || 0);
    return (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(2);
  };

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
                Relatórios de Avaliação entre Pares
              </h1>
              <p className="mt-1 text-muted-foreground">
                Avaliações de desempenho realizadas por colegas de trabalho
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
                  <p className="text-2xl font-bold">4.28</p>
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
                  <p className="text-2xl font-bold">7</p>
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

        {/* Individual Reports */}
        {mockRelatoriosPares.map((relatorio, index) => (
          <Card key={relatorio.id} className="shadow-institutional animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="border-b bg-muted/30">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-serif">{relatorio.avaliado}</CardTitle>
                  <CardDescription className="mt-1">
                    {relatorio.cargo} • {relatorio.unidade}
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
                  {["Colaboração e espírito de equipa", "Comunicação interpessoal", "Partilha de conhecimentos", "Disponibilidade para ajudar", "Profissionalismo"].map((criterio) => {
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
    </AppLayout>
  );
};

export default RelatorioEntrePares;
