import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  FileText, 
  Users, 
  Download, 
  TrendingUp,
  PieChart,
  Calendar,
  Building
} from "lucide-react";

const reportTypes = [
  {
    title: "Relatório Individual de Desempenho",
    description: "Relatório detalhado por colaborador com objectivos, competências e NAF",
    icon: FileText,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Relatório Agregado por Unidade",
    description: "Visão consolidada do desempenho por unidade orgânica",
    icon: Building,
    color: "bg-accent/10 text-accent",
  },
  {
    title: "Estatísticas do Ciclo",
    description: "Análise estatística completa do ciclo de avaliação",
    icon: BarChart3,
    color: "bg-info/10 text-info",
  },
  {
    title: "Distribuição de Classificações",
    description: "Distribuição das classificações finais por categoria",
    icon: PieChart,
    color: "bg-success/10 text-success",
  },
  {
    title: "Evolução de Desempenho",
    description: "Comparativo de desempenho entre ciclos anteriores",
    icon: TrendingUp,
    color: "bg-warning/10 text-warning",
  },
  {
    title: "Lista de Colaboradores Avaliados",
    description: "Listagem completa com estado das avaliações",
    icon: Users,
    color: "bg-secondary text-secondary-foreground",
  },
];

const Relatorios = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Relatórios
            </h1>
            <p className="mt-1 text-muted-foreground">
              Geração de relatórios e exportação de dados
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="gradient-institutional text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-serif font-semibold">
                  Relatório Institucional Completo
                </h3>
                <p className="text-sm opacity-90 mt-1">
                  Gerar relatório consolidado de todas as avaliações do ciclo actual
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="gold" size="lg">
                  <Download className="h-5 w-5 mr-2" />
                  Exportar PDF
                </Button>
                <Button variant="secondary" size="lg">
                  <Calendar className="h-5 w-5 mr-2" />
                  Agendar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Types Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reportTypes.map((report, index) => (
            <Card 
              key={report.title} 
              className="shadow-institutional hover:shadow-lg transition-all duration-300 cursor-pointer group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg p-3 ${report.color}`}>
                    <report.icon className="h-6 w-6" />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-base mt-4">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Reports */}
        <Card className="shadow-institutional">
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              Relatórios Recentes
            </CardTitle>
            <CardDescription>
              Últimos relatórios gerados pelo sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { nome: "Relatório Institucional - 2024/2º Semestre", data: "05 Jan 2025", tipo: "PDF", tamanho: "2.4 MB" },
                { nome: "Estatísticas do Ciclo 2024/2º Semestre", data: "05 Jan 2025", tipo: "PDF", tamanho: "856 KB" },
                { nome: "Lista de Colaboradores - Dezembro 2024", data: "20 Dez 2024", tipo: "Excel", tamanho: "124 KB" },
              ].map((report, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-secondary p-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{report.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {report.data} • {report.tipo} • {report.tamanho}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Relatorios;
