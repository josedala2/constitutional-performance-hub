import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Download, 
  Printer,
  Globe,
  Calendar,
  Star,
  MessageSquare,
  TrendingUp,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockRelatoriosExternos = [
  {
    id: "1",
    servico: "Atendimento ao Público",
    unidade: "Secretaria-Geral",
    ciclo: "2024/2º Semestre",
    numRespostas: 156,
    periodoRecolha: "01/07/2024 - 31/12/2024",
    criterios: [
      { nome: "Tempo de espera para atendimento", media: 4.2, respostas: 156 },
      { nome: "Simpatia e cortesia no atendimento", media: 4.7, respostas: 154 },
      { nome: "Clareza das informações prestadas", media: 4.5, respostas: 152 },
      { nome: "Resolução do pedido/questão", media: 4.3, respostas: 150 },
      { nome: "Facilidade de acesso aos serviços", media: 3.9, respostas: 148 },
      { nome: "Satisfação geral com o serviço", media: 4.4, respostas: 156 },
    ],
    comentarios: [
      { tipo: "Positivo", texto: "Funcionários muito atenciosos e profissionais. Resolveram o meu problema rapidamente." },
      { tipo: "Positivo", texto: "Excelente atendimento, muito esclarecedor." },
      { tipo: "Sugestão", texto: "Seria útil ter mais informação disponível online para evitar deslocações." },
      { tipo: "Negativo", texto: "O tempo de espera poderia ser mais curto em dias de maior afluência." },
    ],
    mediaGeral: 4.33,
    nps: 72,
    recomendacao: 89,
  },
  {
    id: "2",
    servico: "Emissão de Certidões",
    unidade: "Departamento de Arquivo",
    ciclo: "2024/2º Semestre",
    numRespostas: 89,
    periodoRecolha: "01/07/2024 - 31/12/2024",
    criterios: [
      { nome: "Tempo de espera para atendimento", media: 3.8, respostas: 89 },
      { nome: "Simpatia e cortesia no atendimento", media: 4.5, respostas: 88 },
      { nome: "Clareza das informações prestadas", media: 4.3, respostas: 87 },
      { nome: "Resolução do pedido/questão", media: 4.6, respostas: 89 },
      { nome: "Facilidade de acesso aos serviços", media: 4.0, respostas: 85 },
      { nome: "Satisfação geral com o serviço", media: 4.2, respostas: 89 },
    ],
    comentarios: [
      { tipo: "Positivo", texto: "Processo muito eficiente, recebi a certidão no prazo indicado." },
      { tipo: "Sugestão", texto: "O pedido online poderia incluir mais tipos de certidões." },
      { tipo: "Positivo", texto: "Equipa muito prestável e conhecedora." },
    ],
    mediaGeral: 4.23,
    nps: 65,
    recomendacao: 84,
  },
  {
    id: "3",
    servico: "Consulta de Processos",
    unidade: "Gabinete de Apoio ao Cidadão",
    ciclo: "2024/2º Semestre",
    numRespostas: 67,
    periodoRecolha: "01/07/2024 - 31/12/2024",
    criterios: [
      { nome: "Tempo de espera para atendimento", media: 4.0, respostas: 67 },
      { nome: "Simpatia e cortesia no atendimento", media: 4.8, respostas: 66 },
      { nome: "Clareza das informações prestadas", media: 4.6, respostas: 65 },
      { nome: "Resolução do pedido/questão", media: 4.4, respostas: 67 },
      { nome: "Facilidade de acesso aos serviços", media: 4.2, respostas: 64 },
      { nome: "Satisfação geral com o serviço", media: 4.5, respostas: 67 },
    ],
    comentarios: [
      { tipo: "Positivo", texto: "Atendimento exemplar, muito profissional." },
      { tipo: "Positivo", texto: "Explicações muito claras sobre o estado do processo." },
      { tipo: "Sugestão", texto: "Portal online para acompanhamento de processos seria muito útil." },
    ],
    mediaGeral: 4.42,
    nps: 78,
    recomendacao: 92,
  },
];

const getMediaColor = (media: number) => {
  if (media >= 4.5) return "text-success";
  if (media >= 4.0) return "text-info";
  if (media >= 3.0) return "text-warning";
  return "text-destructive";
};

const getNPSColor = (nps: number) => {
  if (nps >= 70) return "bg-success text-white";
  if (nps >= 50) return "bg-info text-white";
  if (nps >= 30) return "bg-warning text-white";
  return "bg-destructive text-white";
};

const getComentarioColor = (tipo: string) => {
  switch (tipo) {
    case "Positivo":
      return "border-success bg-success/5";
    case "Sugestão":
      return "border-info bg-info/5";
    case "Negativo":
      return "border-warning bg-warning/5";
    default:
      return "border-muted";
  }
};

const RelatorioUtentesExternos = () => {
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
                Relatórios de Avaliação por Utentes Externos
              </h1>
              <p className="mt-1 text-muted-foreground">
                Avaliações de satisfação do público e entidades externas
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
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockRelatoriosExternos.length}</p>
                  <p className="text-sm text-muted-foreground">Serviços Avaliados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-institutional">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-success/10 p-2">
                  <Users className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">312</p>
                  <p className="text-sm text-muted-foreground">Total Respostas</p>
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
                  <p className="text-2xl font-bold">72</p>
                  <p className="text-sm text-muted-foreground">NPS Médio</p>
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
        {mockRelatoriosExternos.map((relatorio, index) => (
          <Card key={relatorio.id} className="shadow-institutional animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="border-b bg-muted/30">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-serif">{relatorio.servico}</CardTitle>
                  <CardDescription className="mt-1">
                    {relatorio.unidade} • {relatorio.periodoRecolha}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">
                    {relatorio.numRespostas} Respostas
                  </Badge>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${getNPSColor(relatorio.nps)}`}>
                    NPS: {relatorio.nps}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* KPIs */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-muted/20 rounded-lg text-center">
                  <Star className="h-6 w-6 text-accent mx-auto mb-2" />
                  <p className={`text-2xl font-bold ${getMediaColor(relatorio.mediaGeral)}`}>
                    {relatorio.mediaGeral.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">Média Geral</p>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg text-center">
                  <TrendingUp className="h-6 w-6 text-success mx-auto mb-2" />
                  <p className="text-2xl font-bold text-success">{relatorio.nps}</p>
                  <p className="text-sm text-muted-foreground">Net Promoter Score</p>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg text-center">
                  <Users className="h-6 w-6 text-info mx-auto mb-2" />
                  <p className="text-2xl font-bold text-info">{relatorio.recomendacao}%</p>
                  <p className="text-sm text-muted-foreground">Taxa de Recomendação</p>
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

              {/* Comentários */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-accent" />
                  Feedback dos Utentes
                </h4>
                <div className="space-y-3">
                  {relatorio.comentarios.map((comentario, i) => (
                    <div key={i} className={`p-4 rounded-lg border-l-4 ${getComentarioColor(comentario.tipo)}`}>
                      <Badge 
                        variant="outline" 
                        className={
                          comentario.tipo === "Positivo" ? "border-success text-success" :
                          comentario.tipo === "Sugestão" ? "border-info text-info" :
                          "border-warning text-warning"
                        }
                      >
                        {comentario.tipo}
                      </Badge>
                      <p className="text-muted-foreground mt-2">"{comentario.texto}"</p>
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

export default RelatorioUtentesExternos;
