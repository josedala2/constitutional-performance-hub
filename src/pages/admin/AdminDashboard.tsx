import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProfileStats } from "@/hooks/useProfiles";
import { useRoleStats } from "@/hooks/useRoles";
import { useRecentAuditLogs } from "@/hooks/useAuditLogs";
import { useProfiles } from "@/hooks/useProfiles";
import { format } from "date-fns";
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
  Activity
} from "lucide-react";

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

export default function AdminDashboard() {
  const { data: profileStats, isLoading: loadingProfiles } = useProfileStats();
  const { data: roleStats, isLoading: loadingRoles } = useRoleStats();
  const { data: recentLogs, isLoading: loadingLogs } = useRecentAuditLogs(10);
  const { data: profiles } = useProfiles();

  const getActorName = (actorId: string | null) => {
    if (!actorId) return "Sistema";
    const profile = profiles?.find((p) => p.id === actorId);
    return profile?.full_name || "Desconhecido";
  };

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
                  {recentLogs.map((log) => (
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
