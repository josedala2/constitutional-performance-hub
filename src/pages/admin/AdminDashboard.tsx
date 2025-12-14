import { useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProfileStats } from "@/hooks/useProfiles";
import { useRoleStats } from "@/hooks/useRoles";
import { useRecentAuditLogs } from "@/hooks/useAuditLogs";
import { useProfiles } from "@/hooks/useProfiles";
import { useOrgUnits } from "@/hooks/useOrgUnits";
import { format, subDays, startOfDay } from "date-fns";
import { pt } from "date-fns/locale";
import { Link } from "react-router-dom";
import { 
  Users, 
  Shield, 
  Key, 
  ScrollText, 
  UserCheck, 
  UserX,
  ArrowRight,
  Activity,
  TrendingUp
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const ACTION_LABELS: Record<string, string> = {
  LOGIN: "Login",
  LOGOUT: "Logout",
  USER_CREATE: "Criação de Utilizador",
  USER_UPDATE: "Atualização de Utilizador",
  USER_STATUS_CHANGE: "Alteração de Estado",
  ROLE_CREATE: "Criação de Perfil",
  ROLE_UPDATE: "Atualização de Perfil",
  ROLE_ASSIGN: "Atribuição de Perfil",
  ROLE_REMOVE: "Remoção de Perfil",
  PERMISSION_CHANGE: "Alteração de Permissões",
};

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function AdminDashboard() {
  const { data: profileStats, isLoading: loadingProfiles } = useProfileStats();
  const { data: roleStats, isLoading: loadingRoles } = useRoleStats();
  const { data: recentLogs, isLoading: loadingLogs } = useRecentAuditLogs(50);
  const { data: profiles } = useProfiles();
  const { data: orgUnits } = useOrgUnits();

  const getActorName = (actorId: string | null) => {
    if (!actorId) return "Sistema";
    const profile = profiles?.find((p) => p.id === actorId);
    return profile?.full_name || "Desconhecido";
  };

  // Calculate activity by day for the last 7 days
  const activityByDay = useMemo(() => {
    if (!recentLogs) return [];
    
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
      const dayStr = format(date, "yyyy-MM-dd");
      const dayLabel = format(date, "EEE", { locale: pt });
      
      const count = recentLogs.filter(log => {
        const logDate = format(startOfDay(new Date(log.created_at)), "yyyy-MM-dd");
        return logDate === dayStr;
      }).length;
      
      days.push({
        day: dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1),
        atividade: count,
      });
    }
    return days;
  }, [recentLogs]);

  // Calculate users by status
  const usersByStatus = useMemo(() => {
    return [
      { name: "Ativos", value: profileStats?.active || 0, color: CHART_COLORS[1] },
      { name: "Inativos", value: profileStats?.inactive || 0, color: CHART_COLORS[4] },
    ];
  }, [profileStats]);

  // Calculate users by org unit
  const usersByOrgUnit = useMemo(() => {
    if (!profiles || !orgUnits) return [];
    
    const counts: Record<string, number> = {};
    profiles.forEach(profile => {
      const unitName = orgUnits.find(u => u.id === profile.org_unit_id)?.name || "Sem Unidade";
      counts[unitName] = (counts[unitName] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([name, value], index) => ({
        name: name.length > 15 ? name.substring(0, 15) + "..." : name,
        utilizadores: value,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }))
      .sort((a, b) => b.utilizadores - a.utilizadores)
      .slice(0, 5);
  }, [profiles, orgUnits]);

  // Calculate activity by type
  const activityByType = useMemo(() => {
    if (!recentLogs) return [];
    
    const counts: Record<string, number> = {};
    recentLogs.forEach(log => {
      const label = ACTION_LABELS[log.action] || log.action;
      counts[label] = (counts[label] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([name, value], index) => ({
        name: name.length > 12 ? name.substring(0, 12) + "..." : name,
        count: value,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [recentLogs]);

  const stats = [
    {
      title: "Total de Utilizadores",
      value: profileStats?.total || 0,
      icon: Users,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
      href: "/admin/utilizadores",
    },
    {
      title: "Utilizadores Ativos",
      value: profileStats?.active || 0,
      icon: UserCheck,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      href: "/admin/utilizadores?status=ACTIVE",
    },
    {
      title: "Utilizadores Inativos",
      value: profileStats?.inactive || 0,
      icon: UserX,
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
      href: "/admin/utilizadores?status=INACTIVE",
    },
    {
      title: "Perfis de Acesso",
      value: roleStats?.totalRoles || 0,
      icon: Shield,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
      href: "/admin/perfis",
    },
    {
      title: "Permissões",
      value: roleStats?.totalPermissions || 0,
      icon: Key,
      color: "text-accent",
      bgColor: "bg-accent/10",
      href: "/admin/permissoes",
    },
  ];

  const getActionBadgeVariant = (action: string) => {
    if (action.includes("CREATE") || action === "LOGIN") return "default";
    if (action.includes("UPDATE") || action.includes("CHANGE")) return "secondary";
    if (action.includes("REMOVE") || action === "LOGOUT") return "outline";
    return "secondary";
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Painel de Administração</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral do sistema de gestão de utilizadores e acessos
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <Link key={stat.title} to={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold mt-1">
                        {loadingProfiles || loadingRoles ? "..." : stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Atividade nos Últimos 7 Dias
              </CardTitle>
              <CardDescription>Número de ações registadas por dia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityByDay} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAtividade" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="atividade"
                      name="Ações"
                      stroke="hsl(var(--chart-1))"
                      fillOpacity={1}
                      fill="url(#colorAtividade)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Users by Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Distribuição de Utilizadores
              </CardTitle>
              <CardDescription>Por estado de conta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center justify-center">
                {profileStats && (profileStats.active > 0 || profileStats.inactive > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={usersByStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {usersByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-muted-foreground text-center">
                    Sem dados de utilizadores
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users by Org Unit */}
          <Card>
            <CardHeader>
              <CardTitle>Utilizadores por Unidade Orgânica</CardTitle>
              <CardDescription>Top 5 unidades com mais utilizadores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                {usersByOrgUnit.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={usersByOrgUnit} 
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        tick={{ fontSize: 11 }}
                        width={100}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="utilizadores" radius={[0, 4, 4, 0]}>
                        {usersByOrgUnit.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Sem dados de unidades orgânicas
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Atividade</CardTitle>
              <CardDescription>Ações mais frequentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                {activityByType.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={activityByType}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 10 }}
                        height={50}
                      />
                      <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="count" name="Ocorrências" radius={[4, 4, 0, 0]}>
                        {activityByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Sem dados de atividade
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link to="/admin/utilizadores">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Gerir Utilizadores</p>
                  <p className="text-sm text-muted-foreground">Criar, editar e gerir acessos</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
          <Link to="/admin/perfis">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-chart-4/10">
                  <Shield className="h-5 w-5 text-chart-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Gerir Perfis</p>
                  <p className="text-sm text-muted-foreground">Configurar permissões</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
          <Link to="/admin/permissoes">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-accent/10">
                  <Key className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Ver Permissões</p>
                  <p className="text-sm text-muted-foreground">Lista de permissões do sistema</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
          <Link to="/admin/auditoria">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-chart-2/10">
                  <ScrollText className="h-5 w-5 text-chart-2" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Ver Auditoria</p>
                  <p className="text-sm text-muted-foreground">Histórico de ações</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Atividade Recente
              </CardTitle>
              <CardDescription>Últimas ações registadas no sistema</CardDescription>
            </div>
            <Link to="/admin/auditoria">
              <Button variant="outline" size="sm">
                Ver Tudo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loadingLogs ? (
              <div className="text-center py-8 text-muted-foreground">A carregar...</div>
            ) : recentLogs && recentLogs.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Utilizador</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Entidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLogs.slice(0, 10).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(log.created_at), "dd/MM HH:mm", { locale: pt })}
                      </TableCell>
                      <TableCell className="font-medium">
                        {getActorName(log.actor_user_id)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionBadgeVariant(log.action)}>
                          {ACTION_LABELS[log.action] || log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{log.entity_type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Sem atividade recente registada
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
