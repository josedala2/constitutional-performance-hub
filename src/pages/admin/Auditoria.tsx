import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuditLogs, useAuditActions, useAuditEntityTypes } from "@/hooks/useAuditLogs";
import { useProfiles } from "@/hooks/useProfiles";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Search, Eye, Calendar, Filter } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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

const ENTITY_LABELS: Record<string, string> = {
  USER: "Utilizador",
  ROLE: "Perfil",
  PERMISSION: "Permissão",
  AUTH: "Autenticação",
};

export default function Auditoria() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [page, setPage] = useState(1);

  const filters = {
    action: actionFilter !== "all" ? actionFilter : undefined,
    entity_type: entityFilter !== "all" ? entityFilter : undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
  };

  const { data: logsData, isLoading } = useAuditLogs(filters, page, 20);
  const { data: profiles } = useProfiles();
  const { data: actions } = useAuditActions();
  const { data: entityTypes } = useAuditEntityTypes();

  const logs = logsData?.data || [];

  const getActorName = (actorId: string | null) => {
    if (!actorId) return "Sistema";
    const profile = profiles?.find((p) => p.id === actorId);
    return profile?.full_name || "Desconhecido";
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      getActorName(log.actor_user_id).toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const openDetail = (log: any) => {
    setSelectedLog(log);
    setIsDetailOpen(true);
  };

  const getActionBadgeVariant = (action: string) => {
    if (action.includes("CREATE") || action === "LOGIN") return "default";
    if (action.includes("UPDATE") || action.includes("CHANGE")) return "secondary";
    if (action.includes("REMOVE") || action === "LOGOUT") return "outline";
    return "secondary";
  };

  const clearFilters = () => {
    setSearch("");
    setActionFilter("all");
    setEntityFilter("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Auditoria</h1>
          <p className="text-muted-foreground mt-1">
            Registo de todas as ações realizadas no sistema
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar por utilizador ou ação..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); setPage(1); }}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Ação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as ações</SelectItem>
                    {actions?.map((action) => (
                      <SelectItem key={action} value={action}>
                        {ACTION_LABELS[action] || action}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={entityFilter} onValueChange={(v) => { setEntityFilter(v); setPage(1); }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Entidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as entidades</SelectItem>
                    {entityTypes?.map((entity) => (
                      <SelectItem key={entity} value={entity}>
                        {ENTITY_LABELS[entity] || entity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">De:</span>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                    className="w-[160px]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Até:</span>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                    className="w-[160px]"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <Filter className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">A carregar...</div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Utilizador</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Entidade</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead className="w-[80px]">Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm">
                          {format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss", { locale: pt })}
                        </TableCell>
                        <TableCell className="font-medium">
                          {getActorName(log.actor_user_id)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getActionBadgeVariant(log.action)}>
                            {ACTION_LABELS[log.action] || log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>{ENTITY_LABELS[log.entity_type] || log.entity_type}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {log.ip_address || "-"}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => openDetail(log)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {logsData && logsData.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Página {logsData.page} de {logsData.totalPages} ({logsData.total} registos)
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= logsData.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                      >
                        Próxima
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
            {filteredLogs.length === 0 && !isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum registo encontrado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Registo</DialogTitle>
            </DialogHeader>
            {selectedLog && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Data/Hora</span>
                    <p className="font-medium">
                      {format(new Date(selectedLog.created_at), "dd/MM/yyyy HH:mm:ss", {
                        locale: pt,
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Utilizador</span>
                    <p className="font-medium">{getActorName(selectedLog.actor_user_id)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Ação</span>
                    <p className="font-medium">
                      {ACTION_LABELS[selectedLog.action] || selectedLog.action}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Entidade</span>
                    <p className="font-medium">
                      {ENTITY_LABELS[selectedLog.entity_type] || selectedLog.entity_type}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">ID da Entidade</span>
                    <p className="font-medium font-mono text-xs">
                      {selectedLog.entity_id || "-"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Endereço IP</span>
                    <p className="font-medium">{selectedLog.ip_address || "-"}</p>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">User Agent</span>
                  <p className="text-sm break-all">{selectedLog.user_agent || "-"}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Metadados</span>
                  <ScrollArea className="h-[200px] mt-2">
                    <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
