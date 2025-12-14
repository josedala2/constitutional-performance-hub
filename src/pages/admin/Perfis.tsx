import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useRoles, useCreateRole, useUpdateRole, useRolePermissions, usePermissions, useUpdateRolePermissions } from "@/hooks/useRoles";
import { Plus, Edit, Shield, Search, CheckSquare, Square } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

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

// Component to show permission count for a role
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

export default function Perfis() {
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const { data: roles, isLoading } = useRoles();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const { data: permissions } = usePermissions();
  const { data: rolePermissions, isLoading: isLoadingRolePermissions } = useRolePermissions(selectedRole?.id || "");
  const updateRolePermissions = useUpdateRolePermissions();

  // Update selected permissions when rolePermissions changes
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

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-serif text-foreground">Gestão de Perfis</h1>
            <p className="text-muted-foreground mt-1">Gerir perfis de acesso e permissões</p>
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
                <Button onClick={handleCreate} className="w-full" disabled={createRole.isPending}>
                  {createRole.isPending ? "A criar..." : "Criar Perfil"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar perfis..."
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Permissões</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="w-[150px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles?.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.description || "-"}</TableCell>
                      <TableCell>
                        <RolePermissionCount roleId={role.id} />
                      </TableCell>
                      <TableCell>
                        <Badge variant={role.is_system ? "secondary" : "outline"}>
                          {role.is_system ? "Sistema" : "Personalizado"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(role)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openPermissions(role)}>
                            <Shield className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Perfil</DialogTitle>
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
              <Button onClick={handleUpdate} className="w-full" disabled={updateRole.isPending}>
                {updateRole.isPending ? "A guardar..." : "Guardar Alterações"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Permissions Dialog */}
        <Dialog open={isPermissionsOpen} onOpenChange={setIsPermissionsOpen}>
          <DialogContent className="max-w-3xl max-h-[85vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Permissões - {selectedRole?.name}
              </DialogTitle>
            </DialogHeader>
            
            {isLoadingRolePermissions ? (
              <div className="text-center py-8 text-muted-foreground">A carregar permissões...</div>
            ) : (
              <div className="space-y-4">
                {/* Actions bar */}
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="text-sm text-muted-foreground">
                    {selectedPermissions.length} de {permissions?.length || 0} permissões selecionadas
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

                <ScrollArea className="h-[50vh] pr-4">
                  <div className="space-y-6">
                    {groupedPermissions &&
                      Object.entries(groupedPermissions)
                        .sort(([a], [b]) => (MODULE_LABELS[a] || a).localeCompare(MODULE_LABELS[b] || b))
                        .map(([module, perms]) => (
                          <div key={module} className="space-y-3">
                            <div className="flex items-center justify-between border-b pb-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-base">
                                  {MODULE_LABELS[module] || module}
                                </h3>
                                <Badge variant="secondary" className="text-xs">
                                  {perms?.filter(p => selectedPermissions.includes(p.id)).length}/{perms?.length}
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => 
                                  isModuleFullySelected(perms) 
                                    ? deselectAllInModule(perms) 
                                    : selectAllInModule(perms)
                                }
                              >
                                {isModuleFullySelected(perms) ? "Desmarcar módulo" : "Selecionar módulo"}
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {perms?.map((permission) => (
                                <div 
                                  key={permission.id} 
                                  className={`flex items-start space-x-2 p-2 rounded-md transition-colors ${
                                    selectedPermissions.includes(permission.id) 
                                      ? "bg-primary/5 border border-primary/20" 
                                      : "hover:bg-muted/50"
                                  }`}
                                >
                                  <Checkbox
                                    id={permission.id}
                                    checked={selectedPermissions.includes(permission.id)}
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
                                  <label
                                    htmlFor={permission.id}
                                    className="text-sm cursor-pointer flex-1"
                                  >
                                    <span className="font-mono text-xs text-primary">{permission.code}</span>
                                    {permission.description && (
                                      <span className="text-muted-foreground block text-xs mt-0.5">
                                        {permission.description}
                                      </span>
                                    )}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                  </div>
                </ScrollArea>

                <Button
                  onClick={handleSavePermissions}
                  className="w-full"
                  disabled={updateRolePermissions.isPending}
                >
                  {updateRolePermissions.isPending ? "A guardar..." : "Guardar Permissões"}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
