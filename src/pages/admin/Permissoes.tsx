import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Search, Key } from "lucide-react";

interface Permission {
  id: string;
  code: string;
  description: string | null;
  created_at: string;
}

export default function Permissoes() {
  const [search, setSearch] = useState("");

  const { data: permissions, isLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("permissions").select("*").order("code");
      if (error) throw error;
      return data as Permission[];
    },
  });

  const filteredPermissions = permissions?.filter(
    (permission) =>
      permission.code.toLowerCase().includes(search.toLowerCase()) ||
      permission.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Group permissions by module
  const groupedPermissions = filteredPermissions?.reduce((acc, permission) => {
    const module = permission.code.split(".")[0];
    if (!acc[module]) acc[module] = [];
    acc[module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const getModuleLabel = (module: string) => {
    const labels: Record<string, string> = {
      users: "Utilizadores",
      roles: "Perfis",
      permissions: "Permissões",
      audit: "Auditoria",
      evaluations: "Avaliações",
      objectives: "Objectivos",
      competencies: "Competências",
      cycles: "Ciclos",
      reports: "Relatórios",
    };
    return labels[module] || module;
  };

  const getActionLabel = (code: string) => {
    const parts = code.split(".");
    const action = parts[parts.length - 1];
    const labels: Record<string, string> = {
      create: "Criar",
      read: "Visualizar",
      update: "Atualizar",
      delete: "Eliminar",
      disable: "Desativar",
      assign: "Atribuir",
    };
    return labels[action] || action;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Permissões</h1>
          <p className="text-muted-foreground mt-1">
            Lista de todas as permissões disponíveis no sistema
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar permissões..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">A carregar...</div>
            ) : (
              <div className="space-y-8">
                {groupedPermissions &&
                  Object.entries(groupedPermissions).map(([module, perms]) => (
                    <div key={module}>
                      <div className="flex items-center gap-2 mb-4">
                        <Key className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">{getModuleLabel(module)}</h3>
                        <Badge variant="secondary">{perms.length}</Badge>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Código</TableHead>
                            <TableHead>Ação</TableHead>
                            <TableHead>Descrição</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {perms.map((permission) => (
                            <TableRow key={permission.id}>
                              <TableCell className="font-mono text-sm">
                                {permission.code}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {getActionLabel(permission.code)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {permission.description || "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
              </div>
            )}
            {filteredPermissions?.length === 0 && !isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma permissão encontrada
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
