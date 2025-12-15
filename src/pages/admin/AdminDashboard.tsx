import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProfileStats, useProfiles } from "@/hooks/useProfiles";
import { useRoleStats, useRoles } from "@/hooks/useRoles";
import { useRecentAuditLogs } from "@/hooks/useAuditLogs";
import { useOrgUnits } from "@/hooks/useOrgUnits";
import { format, subDays, startOfDay, formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { TestUsersCredentialsModal } from "@/components/modals/TestUsersCredentialsModal";
import { 
  Users, 
  Shield, 
  Key, 
  ScrollText, 
  UserCheck, 
  UserX,
  ArrowRight,
  Activity,
  TrendingUp,
  UserPlus,
  Loader2,
  Building2,
  Clock,
  Sparkles
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
  RadialBarChart,
  RadialBar,
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

const ACTION_ICONS: Record<string, string> = {
  LOGIN: "🔐",
  LOGOUT: "🚪",
  USER_CREATE: "👤",
  USER_UPDATE: "✏️",
  USER_STATUS_CHANGE: "🔄",
  ROLE_CREATE: "🛡️",
  ROLE_UPDATE: "⚙️",
  ROLE_ASSIGN: "📋",
  ROLE_REMOVE: "❌",
  PERMISSION_CHANGE: "🔑",
};

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "hsl(var(--chart-1))",
  RH: "hsl(var(--chart-2))",
  AVALIADOR: "hsl(var(--chart-3))",
  AVALIADO: "hsl(var(--chart-4))",
  AUDITOR: "hsl(var(--chart-5))",
  PAR: "hsl(280 65% 55%)",
  UTENTE_INTERNO: "hsl(199 89% 48%)",
  UTENTE_EXTERNO: "hsl(38 92% 50%)",
};

interface TestUserCredential {
  email: string;
  password: string;
  role: string;
  name: string;
}

export default function AdminDashboard() {
  const [isCreatingTestUsers, setIsCreatingTestUsers] = useState(false);
  const [credentialsModalOpen, setCredentialsModalOpen] = useState(false);
  const [testUserCredentials, setTestUserCredentials] = useState<TestUserCredential[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: profileStats, isLoading: loadingProfiles } = useProfileStats();
  const { data: roleStats, isLoading: loadingRoles } = useRoleStats();
  const { data: recentLogs, isLoading: loadingLogs } = useRecentAuditLogs(50);
  const { data: profiles } = useProfiles();
  const { data: orgUnits } = useOrgUnits();
  const { data: roles } = useRoles();

  // Fetch users by role
  const { data: userRoles } = useQuery({
    queryKey: ['user-roles-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role_id, roles(name)');
      if (error) throw error;
      return data;
    },
  });

  const handleCreateTestUsers = async () => {
    setIsCreatingTestUsers(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-test-users');
      
      if (error) throw error;

      if (data?.success) {
        const createdCount = data.results?.filter((r: any) => r.status === 'created').length || 0;
        
        toast({
          title: "Utilizadores de Teste Criados",
          description: `${createdCount} utilizadores criados com sucesso.`,
        });
        
        if (data.credentials && data.credentials.length > 0) {
          setTestUserCredentials(data.credentials);
          setCredentialsModalOpen(true);
        }
        
        queryClient.invalidateQueries({ queryKey: ['profiles'] });
        queryClient.invalidateQueries({ queryKey: ['profile-stats'] });
        queryClient.invalidateQueries({ queryKey: ['user-roles-stats'] });
      } else {
        throw new Error(data?.error || 'Erro desconhecido');
      }
    } catch (error: any) {
      console.error('Error creating test users:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar os utilizadores de teste.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingTestUsers(false);
    }
  };

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

  // Calculate users by role
  const usersByRole = useMemo(() => {
    if (!userRoles || !roles) return [];
    
    const counts: Record<string, number> = {};
    userRoles.forEach(ur => {
      const roleName = (ur.roles as any)?.name || 'Sem Perfil';
      counts[roleName] = (counts[roleName] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([name, value]) => ({
        name,
        value,
        fill: ROLE_COLORS[name] || CHART_COLORS[0],
      }))
      .sort((a, b) => b.value - a.value);
  }, [userRoles, roles]);

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
        name: name.length > 20 ? name.substring(0, 20) + "..." : name,
        utilizadores: value,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }))
      .sort((a, b) => b.utilizadores - a.utilizadores)
      .slice(0, 5);
  }, [profiles, orgUnits]);

  const stats = [
    {
      title: "Total de Utilizadores",
      value: profileStats?.total || 0,
      icon: Users,
      gradient: "from-chart-1/20 to-chart-1/5",
      iconBg: "bg-chart-1",
      href: "/admin/utilizadores",
    },
    {
      title: "Utilizadores Ativos",
      value: profileStats?.active || 0,
      icon: UserCheck,
      gradient: "from-chart-2/20 to-chart-2/5",
      iconBg: "bg-chart-2",
      href: "/admin/utilizadores?status=ACTIVE",
    },
    {
      title: "Utilizadores Inativos",
      value: profileStats?.inactive || 0,
      icon: UserX,
      gradient: "from-chart-5/20 to-chart-5/5",
      iconBg: "bg-chart-5",
      href: "/admin/utilizadores?status=INACTIVE",
    },
    {
      title: "Perfis de Acesso",
      value: roleStats?.totalRoles || 0,
      icon: Shield,
      gradient: "from-chart-4/20 to-chart-4/5",
      iconBg: "bg-chart-4",
      href: "/admin/perfis",
    },
    {
      title: "Permissões",
      value: roleStats?.totalPermissions || 0,
      icon: Key,
      gradient: "from-accent/20 to-accent/5",
      iconBg: "bg-accent",
      href: "/admin/permissoes",
    },
  ];

  const quickActions = [
    { title: "Gerir Utilizadores", desc: "Criar, editar e gerir acessos", icon: Users, href: "/admin/utilizadores", color: "bg-primary" },
    { title: "Gerir Perfis", desc: "Configurar permissões", icon: Shield, href: "/admin/perfis", color: "bg-chart-4" },
    { title: "Unidades Orgânicas", desc: "Estrutura organizacional", icon: Building2, href: "/admin/unidades-organicas", color: "bg-chart-3" },
    { title: "Ver Auditoria", desc: "Histórico de ações", icon: ScrollText, href: "/admin/auditoria", color: "bg-chart-2" },
  ];

  const getActionBadgeVariant = (action: string): "default" | "secondary" | "outline" | "destructive" => {
    if (action.includes("CREATE") || action === "LOGIN") return "default";
    if (action.includes("UPDATE") || action.includes("CHANGE")) return "secondary";
    if (action.includes("REMOVE") || action === "LOGOUT") return "outline";
    return "secondary";
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl gradient-institutional flex items-center justify-center shadow-institutional">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-serif text-foreground">Painel de Administração</h1>
                <p className="text-muted-foreground">
                  Visão geral do sistema de gestão de utilizadores e acessos
                </p>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleCreateTestUsers} 
            disabled={isCreatingTestUsers}
            className="gradient-institutional text-primary-foreground shadow-institutional hover:opacity-90 transition-opacity"
          >
            {isCreatingTestUsers ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                A criar...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Criar Utilizadores de Teste
              </>
            )}
          </Button>
        </div>

        {/* Stats Grid with enhanced design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((stat, index) => (
            <Link key={stat.title} to={stat.href}>
              <Card 
                className={`relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50`} />
                <CardContent className="relative pt-6 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-4xl font-bold font-serif">
                        {loadingProfiles || loadingRoles ? (
                          <span className="animate-pulse">...</span>
                        ) : stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                    <span>Ver detalhes</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Trend Chart */}
          <Card className="lg:col-span-2 shadow-institutional">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-chart-1/10">
                  <TrendingUp className="h-4 w-4 text-chart-1" />
                </div>
                <div>
                  <CardTitle className="text-lg">Atividade nos Últimos 7 Dias</CardTitle>
                  <CardDescription>Número de ações registadas por dia</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityByDay} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAtividade" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      allowDecimals={false}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                        boxShadow: "0 4px 20px -4px rgba(0,0,0,0.1)",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="atividade"
                      name="Ações"
                      stroke="hsl(var(--chart-1))"
                      fillOpacity={1}
                      fill="url(#colorAtividade)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Users by Status Donut */}
          <Card className="shadow-institutional">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-chart-2/10">
                  <Users className="h-4 w-4 text-chart-2" />
                </div>
                <div>
                  <CardTitle className="text-lg">Estado das Contas</CardTitle>
                  <CardDescription>Utilizadores por estado</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] flex items-center justify-center">
                {profileStats && (profileStats.active > 0 || profileStats.inactive > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={usersByStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {usersByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-muted-foreground text-center">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    Sem dados
                  </div>
                )}
              </div>
              {/* Legend */}
              <div className="flex justify-center gap-6 mt-2">
                {usersByStatus.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-muted-foreground">{item.name}: <strong className="text-foreground">{item.value}</strong></span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users by Role */}
          <Card className="shadow-institutional">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-chart-4/10">
                  <Shield className="h-4 w-4 text-chart-4" />
                </div>
                <div>
                  <CardTitle className="text-lg">Utilizadores por Perfil</CardTitle>
                  <CardDescription>Distribuição de perfis de acesso</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                {usersByRole.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={usersByRole}
                      margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                        allowDecimals={false}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px",
                        }}
                        formatter={(value) => [`${value} utilizadores`, 'Total']}
                      />
                      <Bar 
                        dataKey="value" 
                        name="Utilizadores" 
                        radius={[8, 8, 0, 0]}
                      >
                        {usersByRole.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Shield className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      Sem dados de perfis
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Users by Org Unit */}
          <Card className="shadow-institutional">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-chart-3/10">
                  <Building2 className="h-4 w-4 text-chart-3" />
                </div>
                <div>
                  <CardTitle className="text-lg">Utilizadores por Unidade</CardTitle>
                  <CardDescription>Top 5 unidades orgânicas</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                {usersByOrgUnit.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={usersByOrgUnit} 
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" horizontal={false} />
                      <XAxis 
                        type="number" 
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                        allowDecimals={false}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        width={120}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px",
                        }}
                      />
                      <Bar dataKey="utilizadores" radius={[0, 8, 8, 0]}>
                        {usersByOrgUnit.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Building2 className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      Sem dados de unidades
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={action.title} to={action.href}>
              <Card 
                className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group border-transparent hover:border-primary/20 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${action.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{action.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{action.desc}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity - Enhanced */}
        <Card className="shadow-institutional">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Activity className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-xl">Atividade Recente</CardTitle>
                <CardDescription>Últimas ações registadas no sistema</CardDescription>
              </div>
            </div>
            <Link to="/admin/auditoria">
              <Button variant="outline" size="sm" className="group">
                Ver Tudo
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {loadingLogs ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                A carregar...
              </div>
            ) : recentLogs && recentLogs.length > 0 ? (
              <div className="divide-y divide-border">
                {recentLogs.slice(0, 8).map((log, index) => (
                  <div 
                    key={log.id} 
                    className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors animate-slide-in-right"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
                      {ACTION_ICONS[log.action] || "📝"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium truncate">{getActorName(log.actor_user_id)}</span>
                        <Badge variant={getActionBadgeVariant(log.action)} className="text-xs">
                          {ACTION_LABELS[log.action] || log.action}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {log.entity_type}
                        {log.entity_id && <span className="opacity-60"> • ID: {log.entity_id.slice(0, 8)}...</span>}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: pt })}
                      </div>
                      <p className="text-xs text-muted-foreground/60">
                        {format(new Date(log.created_at), "dd/MM HH:mm", { locale: pt })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Activity className="h-12 w-12 mb-3 opacity-20" />
                <p>Sem atividade recente registada</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <TestUsersCredentialsModal
        open={credentialsModalOpen}
        onOpenChange={setCredentialsModalOpen}
        credentials={testUserCredentials}
      />
    </AppLayout>
  );
}
