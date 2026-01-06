import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRoles, useCreateRole, useUpdateRole, useRolePermissions, usePermissions, useUpdateRolePermissions, useRoleStats } from "@/hooks/useRoles";
import { Plus, Edit, Shield, Search, CheckSquare, Square, Key, Users, Lock, Unlock, Trash2, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const MODULE_LABELS: Record<string, string> = {
  audit: "Auditoria",
  competencies: "Competências",
  cycles: "Ciclos de Avaliação",
  documents: "Documentos",
  employees: "Colaboradores",
  evaluations: "Avaliações",
  objectives: "Objectivos",
  org_units: "Unidades Orgânicas",
  permissions: "Permissões",
  reports: "Relatórios",
  roles: "Perfis",
  user_roles: "Atribuição de Perfis",
  users: "Utilizadores",
};

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  create: { label: "Criar", color: "bg-green-500/10 text-green-700 border-green-500/20" },
  read: { label: "Visualizar", color: "bg-blue-500/10 text-blue-700 border-blue-500/20" },
  update: { label: "Atualizar", color: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
  delete: { label: "Eliminar", color: "bg-red-500/10 text-red-700 border-red-500/20" },
  disable: { label: "Desativar", color: "bg-orange-500/10 text-orange-700 border-orange-500/20" },
  assign: { label: "Atribuir", color: "bg-purple-500/10 text-purple-700 border-purple-500/20" },
};

function RolePermissionCount({ roleId }: { roleId: string }) {
  const { data: rolePermissions, isLoading } = useRolePermissions(roleId);
  
  if (isLoading) return <span className="text-muted-foreground text-sm">...</span>;
  
  const count = rolePermissions?.length || 0;
  return (
    <Badge variant="outline" className="font-mono">
      {count}
    </Badge>
  );
}

function RoleUsersCount({ roleId }: { roleId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["role-users-count", roleId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role_id", roleId);
      if (error) throw error;
      return count || 0;
    },
  });
  
  if (isLoading) return <span className="text-muted-foreground text-sm">...</span>;
  
  return (
    <Badge variant="secondary" className="font-mono">
      <Users className="h-3 w-3 mr-1" />
      {data}
    </Badge>
  );
}

export default function PerfisPermissoes() {
  const [activeTab, setActiveTab] = useState("perfis");
  const [search, setSearch] = useState("");
  const [permissionSearch, setPermissionSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const { data: roles, isLoading: isLoadingRoles } = useRoles();
  const { data: roleStats } = useRoleStats();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const { data: permissions, isLoading: isLoadingPermissions } = usePermissions();
  const { data: rolePermissions, isLoading: isLoadingRolePermissions } = useRolePermissions(selectedRole?.id || "");
  const updateRolePermissions = useUpdateRolePermissions();

  useEffect(() => {
    if (rolePermissions) {
      setSelectedPermissions(rolePermissions.map((p) => p.id));
    }
  }, [rolePermissions]);

  const filteredRoles = roles?.filter(
    (role) =>
      role.name.toLowerCase().includes(search.toLowerCase()) ||
      role.description?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPermissions = permissions?.filter(
    (permission) =>
      permission.code.toLowerCase().includes(permissionSearch.toLowerCase()) ||
      permission.description?.toLowerCase().includes(permissionSearch.toLowerCase())
  );

  const handleCreate = async () => {
    try {
      await createRole.mutateAsync(formData);
      setIsCreateOpen(false);
      resetForm();
    } catch (error: any) {
      // Error handled by hook
    }
  };

  const handleUpdate = async () => {
    if (!selectedRole) return;
    try {
      await updateRole.mutateAsync({ id: selectedRole.id, data: formData });
      setIsEditOpen(false);
      resetForm();
    } catch (error: any) {
      // Error handled by hook
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    try {
      await updateRolePermissions.mutateAsync({
        roleId: selectedRole.id,
        permissionIds: selectedPermissions,
      });
      setIsPermissionsOpen(false);
    } catch (error: any) {
      // Error handled by hook
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setSelectedRole(null);
  };

  const openEdit = (role: any) => {
    setSelectedRole(role);
    setFormData({ name: role.name, description: role.description || "" });
    setIsEditOpen(true);
  };

  const openPermissions = (role: any) => {
    setSelectedRole(role);
    setSelectedPermissions([]);
    setIsPermissionsOpen(true);
  };

  // Group permissions by module
  const groupedPermissions = permissions?.reduce((acc, permission) => {
    const module = permission.code.split(".")[0];
    if (!acc[module]) acc[module] = [];
    acc[module].push(permission);
    return acc;
  }, {} as Record<string, typeof permissions>);

  const groupedFilteredPermissions = filteredPermissions?.reduce((acc, permission) => {
    const module = permission.code.split(".")[0];
    if (!acc[module]) acc[module] = [];
    acc[module].push(permission);
    return acc;
  }, {} as Record<string, typeof permissions>);

  const selectAllInModule = (modulePermissions: typeof permissions) => {
    const moduleIds = modulePermissions?.map(p => p.id) || [];
    setSelectedPermissions(prev => [...new Set([...prev, ...moduleIds])]);
  };

  const deselectAllInModule = (modulePermissions: typeof permissions) => {
    const moduleIds = modulePermissions?.map(p => p.id) || [];
    setSelectedPermissions(prev => prev.filter(id => !moduleIds.includes(id)));
  };

  const selectAll = () => {
    setSelectedPermissions(permissions?.map(p => p.id) || []);
  };

  const deselectAll = () => {
    setSelectedPermissions([]);
  };

  const isModuleFullySelected = (modulePermissions: typeof permissions) => {
    return modulePermissions?.every(p => selectedPermissions.includes(p.id)) || false;
  };

  const getActionInfo = (code: string) => {
    const parts = code.split(".");
    const action = parts[parts.length - 1];
    return ACTION_LABELS[action] || { label: action, color: "bg-muted text-muted-foreground" };
  };

  return (
    <AppLayout>
      <TooltipProvider>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-serif text-foreground">Perfis e Permissões</h1>
              <p className="text-muted-foreground mt-1">
                Configurar perfis de acesso e permissões do sistema
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{roleStats?.totalRoles || 0}</p>
                    <p className="text-sm text-muted-foreground">Perfis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <Key className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{roleStats?.totalPermissions || 0}</p>
                    <p className="text-sm text-muted-foreground">Permissões</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-amber-500/10">
                    <Lock className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{roles?.filter(r => r.is_system).length || 0}</p>
                    <p className="text-sm text-muted-foreground">Perfis de Sistema</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <Unlock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{roles?.filter(r => !r.is_system).length || 0}</p>
                    <p className="text-sm text-muted-foreground">Perfis Personalizados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content with Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="perfis" className="gap-2">
                <Shield className="h-4 w-4" />
                Perfis de Acesso
              </TabsTrigger>
              <TabsTrigger value="permissoes" className="gap-2">
                <Key className="h-4 w-4" />
                Catálogo de Permissões
              </TabsTrigger>
            </TabsList>

            {/* Perfis Tab */}
            <TabsContent value="perfis" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="relative max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Pesquisar perfis..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Novo Perfil
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Criar Perfil</DialogTitle>
                          <DialogDescription>
                            Crie um novo perfil de acesso com permissões personalizadas.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label>Nome *</Label>
                            <Input
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="Ex: GESTOR"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Descrição</Label>
                            <Textarea
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              placeholder="Descrição do perfil"
                            />
                          </div>
                          <Button onClick={handleCreate} className="w-full" disabled={createRole.isPending || !formData.name}>
                            {createRole.isPending ? "A criar..." : "Criar Perfil"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingRoles ? (
                    <div className="text-center py-8 text-muted-foreground">A carregar...</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Perfil</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Utilizadores</TableHead>
                          <TableHead>Permissões</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead className="w-[120px]">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRoles?.map((role) => (
                          <TableRow key={role.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded ${role.is_system ? 'bg-amber-500/10' : 'bg-primary/10'}`}>
                                  {role.is_system ? (
                                    <Lock className="h-4 w-4 text-amber-600" />
                                  ) : (
                                    <Shield className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                                <span className="font-medium">{role.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground max-w-[200px] truncate">
                              {role.description || "-"}
                            </TableCell>
                            <TableCell>
                              <RoleUsersCount roleId={role.id} />
                            </TableCell>
                            <TableCell>
                              <RolePermissionCount roleId={role.id} />
                            </TableCell>
                            <TableCell>
                              <Badge variant={role.is_system ? "secondary" : "outline"}>
                                {role.is_system ? "Sistema" : "Personalizado"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => openEdit(role)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Editar perfil</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => openPermissions(role)}>
                                      <Key className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Gerir permissões</TooltipContent>
                                </Tooltip>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                  {filteredRoles?.length === 0 && !isLoadingRoles && (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhum perfil encontrado
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Permissões Tab */}
            <TabsContent value="permissoes" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Catálogo de Permissões</CardTitle>
                      <CardDescription>
                        Lista de todas as permissões disponíveis no sistema, organizadas por módulo.
                      </CardDescription>
                    </div>
                    <div className="relative max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Pesquisar permissões..."
                        value={permissionSearch}
                        onChange={(e) => setPermissionSearch(e.target.value)}
                        className="pl-10 w-[300px]"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingPermissions ? (
                    <div className="text-center py-8 text-muted-foreground">A carregar...</div>
                  ) : (
                    <div className="space-y-8">
                      {groupedFilteredPermissions &&
                        Object.entries(groupedFilteredPermissions)
                          .sort(([a], [b]) => (MODULE_LABELS[a] || a).localeCompare(MODULE_LABELS[b] || b))
                          .map(([module, perms]) => (
                            <div key={module}>
                              <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 rounded-lg bg-primary/10">
                                  <Key className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold">{MODULE_LABELS[module] || module}</h3>
                                <Badge variant="secondary">{perms?.length}</Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {perms?.map((permission) => {
                                  const actionInfo = getActionInfo(permission.code);
                                  return (
                                    <div
                                      key={permission.id}
                                      className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                    >
                                      <div className="flex items-start justify-between gap-2">
                                        <code className="text-xs font-mono text-primary bg-primary/5 px-2 py-1 rounded">
                                          {permission.code}
                                        </code>
                                        <Badge className={`${actionInfo.color} text-xs`} variant="outline">
                                          {actionInfo.label}
                                        </Badge>
                                      </div>
                                      {permission.description && (
                                        <p className="text-sm text-muted-foreground mt-2">
                                          {permission.description}
                                        </p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                              <Separator className="mt-6" />
                            </div>
                          ))}
                    </div>
                  )}
                  {filteredPermissions?.length === 0 && !isLoadingPermissions && (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhuma permissão encontrada
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Edit Dialog */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Perfil</DialogTitle>
                <DialogDescription>
                  Atualize as informações do perfil de acesso.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Nome *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <Button onClick={handleUpdate} className="w-full" disabled={updateRole.isPending || !formData.name}>
                  {updateRole.isPending ? "A guardar..." : "Guardar Alterações"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Permissions Dialog */}
          <Dialog open={isPermissionsOpen} onOpenChange={setIsPermissionsOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Permissões - {selectedRole?.name}
                </DialogTitle>
                <DialogDescription>
                  Selecione as permissões que este perfil deve ter acesso.
                </DialogDescription>
              </DialogHeader>
              
              {isLoadingRolePermissions ? (
                <div className="text-center py-8 text-muted-foreground">A carregar permissões...</div>
              ) : (
                <div className="space-y-4">
                  {/* Actions bar */}
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">
                        {selectedPermissions.length}/{permissions?.length || 0}
                      </Badge>
                      <span className="text-sm text-muted-foreground">permissões selecionadas</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={selectAll}>
                        <CheckSquare className="h-4 w-4 mr-1" />
                        Selecionar Todas
                      </Button>
                      <Button variant="outline" size="sm" onClick={deselectAll}>
                        <Square className="h-4 w-4 mr-1" />
                        Limpar Seleção
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="h-[55vh] pr-4">
                    <div className="space-y-6">
                      {groupedPermissions &&
                        Object.entries(groupedPermissions)
                          .sort(([a], [b]) => (MODULE_LABELS[a] || a).localeCompare(MODULE_LABELS[b] || b))
                          .map(([module, perms]) => {
                            const selectedCount = perms?.filter(p => selectedPermissions.includes(p.id)).length || 0;
                            const totalCount = perms?.length || 0;
                            const isFullySelected = isModuleFullySelected(perms);
                            
                            return (
                              <div key={module} className="space-y-3">
                                <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                                  <div className="flex items-center gap-3">
                                    <Checkbox
                                      checked={isFullySelected}
                                      onCheckedChange={() => 
                                        isFullySelected 
                                          ? deselectAllInModule(perms) 
                                          : selectAllInModule(perms)
                                      }
                                    />
                                    <h3 className="font-semibold">
                                      {MODULE_LABELS[module] || module}
                                    </h3>
                                    <Badge 
                                      variant={selectedCount === totalCount ? "default" : "secondary"} 
                                      className="text-xs"
                                    >
                                      {selectedCount}/{totalCount}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4">
                                  {perms?.map((permission) => {
                                    const isSelected = selectedPermissions.includes(permission.id);
                                    const actionInfo = getActionInfo(permission.code);
                                    
                                    return (
                                      <div 
                                        key={permission.id} 
                                        className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                                          isSelected 
                                            ? "bg-primary/5 border-primary/30" 
                                            : "hover:bg-muted/50 border-transparent"
                                        }`}
                                        onClick={() => {
                                          if (isSelected) {
                                            setSelectedPermissions(selectedPermissions.filter((id) => id !== permission.id));
                                          } else {
                                            setSelectedPermissions([...selectedPermissions, permission.id]);
                                          }
                                        }}
                                      >
                                        <Checkbox
                                          checked={isSelected}
                                          onCheckedChange={(checked) => {
                                            if (checked) {
                                              setSelectedPermissions([...selectedPermissions, permission.id]);
                                            } else {
                                              setSelectedPermissions(
                                                selectedPermissions.filter((id) => id !== permission.id)
                                              );
                                            }
                                          }}
                                          className="mt-0.5"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <code className="text-xs font-mono text-primary">
                                              {permission.code}
                                            </code>
                                            <Badge className={`${actionInfo.color} text-[10px]`} variant="outline">
                                              {actionInfo.label}
                                            </Badge>
                                          </div>
                                          {permission.description && (
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                              {permission.description}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                    </div>
                  </ScrollArea>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsPermissionsOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSavePermissions}
                      className="flex-1"
                      disabled={updateRolePermissions.isPending}
                    >
                      {updateRolePermissions.isPending ? "A guardar..." : "Guardar Permissões"}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </TooltipProvider>
    </AppLayout>
  );
}
