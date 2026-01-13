import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { EvaluationProgress } from "@/components/dashboard/EvaluationProgress";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { CycleOverview } from "@/components/dashboard/CycleOverview";
import { NAFDistribution } from "@/components/dashboard/NAFDistribution";
import { PerformanceTrend } from "@/components/dashboard/PerformanceTrend";
import { DepartmentComparison } from "@/components/dashboard/DepartmentComparison";
import { ObjectivesCompletion } from "@/components/dashboard/ObjectivesCompletion";
import { CompetenciesRadar } from "@/components/dashboard/CompetenciesRadar";
import { Users, ClipboardCheck, Clock, TrendingUp } from "lucide-react";
import { mockDashboardStats } from "@/data/mockData";

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Page Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Painel Principal
          </h1>
          <p className="mt-1 text-sm md:text-base text-muted-foreground">
            Bem-vindo ao Sistema de Gestão de Avaliação de Desempenho
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total de Colaboradores"
            value={mockDashboardStats.total_colaboradores}
            subtitle="Activos no ciclo actual"
            icon={<Users className="h-6 w-6" />}
            variant="primary"
            className="animate-fade-in-up stagger-1"
          />
          <StatCard
            title="Avaliações Pendentes"
            value={mockDashboardStats.avaliacoes_pendentes}
            subtitle="Aguardam conclusão"
            icon={<Clock className="h-6 w-6" />}
            trend={{ value: 15, positive: false }}
            className="animate-fade-in-up stagger-2"
          />
          <StatCard
            title="Avaliações Concluídas"
            value={mockDashboardStats.avaliacoes_concluidas}
            subtitle="Neste ciclo"
            icon={<ClipboardCheck className="h-6 w-6" />}
            trend={{ value: 23, positive: true }}
            className="animate-fade-in-up stagger-3"
          />
          <StatCard
            title="Média Institucional"
            value={mockDashboardStats.media_geral?.toFixed(2) || "N/A"}
            subtitle="NAF do ciclo actual"
            icon={<TrendingUp className="h-6 w-6" />}
            variant="accent"
            className="animate-fade-in-up stagger-4"
          />
        </div>

        {/* Performance Charts Row */}
        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
          <PerformanceTrend />
          <DepartmentComparison />
        </div>

        {/* Analysis Charts Row */}
        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
          <ObjectivesCompletion />
          <CompetenciesRadar />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
          {/* Left Column - Evaluations & Distribution */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <EvaluationProgress />
            <NAFDistribution />
          </div>

          {/* Right Column - Cycle & Activity */}
          <div className="space-y-4 md:space-y-6">
            <CycleOverview />
            <RecentActivity />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
