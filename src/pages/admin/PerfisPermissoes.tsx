import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useRoles, useCreateRole, useUpdateRole, useRolePermissions, usePermissions, useUpdateRolePermissions } from "@/hooks/useRoles";
import { 
  Plus, 
  Edit, 
  Shield, 
  Search, 
  Users, 
  FileText,
  Eye,
  Pencil,
  Trash2,
  UserCheck,
  Star,
  Download,
  Copy,
  AlertCircle,
  Lock,
  Settings,
  ClipboardList,
  BarChart3,
  Building2,
  ScrollText,
  Target,
  Award
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Module configuration with icons
const MODULE_CONFIG: Record<string, { label: string; icon: React.ElementType }> = {
  users: { label: "Utilizadores", icon: Users },
  roles: { label: "Perfis", icon: Shield },
  permissions: { label: "Permissões", icon: Settings },
  audit: { label: "Auditoria", icon: ScrollText },
  evaluations: { label: "Avaliações", icon: ClipboardList },
  objectives: { label: "Objectivos", icon: Target },
  competencies: { label: "Competências", icon: Award },
  cycles: { label: "Ciclos", icon: BarChart3 },
  reports: { label: "Relatórios", icon: FileText },
  documents: { label: "Documentos", icon: FileText },
  org_units: { label: "Unidades Orgânicas", icon: Building2 },
  employees: { label: "Colaboradores", icon: Users },
  user_roles: { label: "Atribuição de Perfis", icon: UserCheck },
};

// Permission action columns
const PERMISSION_ACTIONS = [
  { key: "read", label: "VER", icon: Eye },
  { key: "create", label: "CRIAR", icon: Plus },
  { key: "update", label: "EDITAR", icon: Pencil },
  { key: "delete", label: "ELIMINAR", icon: Trash2 },
  { key: "assign", label: "ATRIBUIR", icon: UserCheck },
];

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
  
  if (isLoading) return <span>...</span>;
  return <>{data}</>;
}

function RolePermissionCount({ roleId }: { roleId: string }) {
  const { data: rolePermissions, isLoading } = useRolePermissions(roleId);
  if (isLoading) return <span>...</span>;
  return <>{rolePermissions?.length || 0}</>;
}

export default function PerfisPermissoes() {
  const [search, setSearch] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: roles, isLoading: isLoadingRoles } = useRoles();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const { data: permissions } = usePermissions();
  const { data: rolePermissions, isLoading: isLoadingRolePermissions } = useRolePermissions(selectedRoleId || "");
  const updateRolePermissions = useUpdateRolePermissions();

  const selectedRole = roles?.find(r => r.id === selectedRoleId);

  // Select first role by default
  useEffect(() => {
    if (roles?.length && !selectedRoleId) {
      setSelectedRoleId(roles[0].id);
    }
  }, [roles, selectedRoleId]);

  // Update selected permissions when role changes
  useEffect(() => {
    if (rolePermissions) {
      setSelectedPermissions(rolePermissions.map((p) => p.id));
      setHasChanges(false);
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
      setFormData({ name: "", description: "" });
    } catch (error: any) {
      // Error handled by hook
    }
  };

  const handleUpdate = async () => {
    if (!selectedRole) return;
    try {
      await updateRole.mutateAsync({ id: selectedRole.id, data: formData });
      setIsEditOpen(false);
      setFormData({ name: "", description: "" });
    } catch (error: any) {
      // Error handled by hook
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedRoleId) return;
    try {
      await updateRolePermissions.mutateAsync({
        roleId: selectedRoleId,
        permissionIds: selectedPermissions,
      });
      setHasChanges(false);
      toast.success("Permissões guardadas com sucesso");
    } catch (error: any) {
      // Error handled by hook
    }
  };

  const openEdit = () => {
    if (!selectedRole) return;
    setFormData({ name: selectedRole.name, description: selectedRole.description || "" });
    setIsEditOpen(true);
  };

  const handleDuplicate = async () => {
    if (!selectedRole) return;
    try {
      const newRole = await createRole.mutateAsync({
        name: `${selectedRole.name} (Cópia)`,
        description: selectedRole.description || "",
      });
      // Copy permissions
      if (newRole && rolePermissions) {
        await updateRolePermissions.mutateAsync({
          roleId: newRole.id,
          permissionIds: rolePermissions.map(p => p.id),
        });
      }
      toast.success("Perfil duplicado com sucesso");
    } catch (error) {
      toast.error("Erro ao duplicar perfil");
    }
  };

  // Group permissions by module for the matrix
  const groupedPermissions = permissions?.reduce((acc, permission) => {
    const module = permission.code.split(".")[0];
    if (!acc[module]) acc[module] = {};
    const action = permission.code.split(".")[1];
    acc[module][action] = permission;
    return acc;
  }, {} as Record<string, Record<string, typeof permissions[0]>>);

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      }
      return [...prev, permissionId];
    });
    setHasChanges(true);
  };

  const isPermissionSelected = (permissionId: string) => {
    return selectedPermissions.includes(permissionId);
  };

  return (
    <AppLayout>
      <TooltipProvider>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold font-serif text-foreground">Perfis e Permissões</h1>
            <p className="text-muted-foreground mt-1">
              Configurar perfis de acesso e permissões do sistema
            </p>
          </div>

          {/* Main Content - Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Panel - Profiles List */}
            <div className="lg:col-span-4">
              <Card className="h-full">
                <CardContent className="p-4 space-y-4">
                  {/* Header with title and buttons */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Perfis</h2>
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="h-9 w-9">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Exportar</TooltipContent>
                      </Tooltip>
                      <Button onClick={() => setIsCreateOpen(true)} className="h-9">
                        <Plus className="h-4 w-4 mr-1" />
                        Novo
                      </Button>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Pesquisar perfis..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Profiles List */}
                  <ScrollArea className="h-[calc(100vh-380px)]">
                    <div className="space-y-2 pr-4">
                      {isLoadingRoles ? (
                        <div className="text-center py-8 text-muted-foreground">A carregar...</div>
                      ) : (
                        filteredRoles?.map((role) => (
                          <div
                            key={role.id}
                            onClick={() => setSelectedRoleId(role.id)}
                            className={cn(
                              "p-3 rounded-lg border cursor-pointer transition-all",
                              selectedRoleId === role.id
                                ? "bg-primary/5 border-primary shadow-sm"
                                : "hover:bg-muted/50 border-transparent"
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div className={cn(
                                "p-2 rounded-lg",
                                role.is_system ? "bg-blue-500/10" : "bg-primary/10"
                              )}>
                                <Shield className={cn(
                                  "h-5 w-5",
                                  role.is_system ? "text-blue-600" : "text-primary"
                                )} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium truncate">{role.name}</span>
                                  {role.is_system && (
                                    <Badge variant="secondary" className="text-[10px] shrink-0">
                                      Sistema
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                  {role.description || "Sem descrição"}
                                </p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    <RoleUsersCount roleId={role.id} />
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    <RolePermissionCount roleId={role.id} />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Permissions Matrix */}
            <div className="lg:col-span-8">
              <Card className="h-full">
                <CardContent className="p-6">
                  {selectedRole ? (
                    <div className="space-y-6">
                      {/* Role Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-xl font-semibold">{selectedRole.name}</h2>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {selectedRole.description || "Acesso ao sistema"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={handleDuplicate} disabled={createRole.isPending}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicar
                          </Button>
                          <Button onClick={openEdit}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                        </div>
                      </div>

                      {/* Permissions Matrix */}
                      <div className="border rounded-lg overflow-hidden">
                        {/* Matrix Header */}
                        <div className="grid grid-cols-[1fr_repeat(5,80px)] bg-muted/50 border-b">
                          <div className="p-3 font-medium text-sm"></div>
                          {PERMISSION_ACTIONS.map((action) => {
                            const Icon = action.icon;
                            return (
                              <div key={action.key} className="p-3 text-center">
                                <Icon className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                                <span className="text-[10px] font-medium text-muted-foreground uppercase">
                                  {action.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Matrix Rows */}
                        <ScrollArea className="h-[calc(100vh-480px)]">
                          {isLoadingRolePermissions ? (
                            <div className="text-center py-8 text-muted-foreground">
                              A carregar permissões...
                            </div>
                          ) : (
                            <div>
                              {groupedPermissions && Object.entries(groupedPermissions)
                                .sort(([a], [b]) => (MODULE_CONFIG[a]?.label || a).localeCompare(MODULE_CONFIG[b]?.label || b))
                                .map(([module, actions]) => {
                                  const config = MODULE_CONFIG[module] || { label: module, icon: FileText };
                                  const ModuleIcon = config.icon;
                                  
                                  return (
                                    <div key={module} className="grid grid-cols-[1fr_repeat(5,80px)] border-b last:border-0 hover:bg-muted/30 transition-colors">
                                      <div className="p-3 flex items-center gap-3">
                                        <div className="p-1.5 rounded bg-muted">
                                          <ModuleIcon className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <span className="font-medium text-sm">{config.label}</span>
                                      </div>
                                      {PERMISSION_ACTIONS.map((action) => {
                                        const permission = actions[action.key];
                                        const hasPermission = permission && isPermissionSelected(permission.id);
                                        
                                        return (
                                          <div key={action.key} className="p-3 flex items-center justify-center">
                                            {permission ? (
                                              <Checkbox
                                                checked={hasPermission}
                                                onCheckedChange={() => togglePermission(permission.id)}
                                                className={cn(
                                                  "h-5 w-5",
                                                  hasPermission && "bg-primary border-primary text-primary-foreground"
                                                )}
                                              />
                                            ) : (
                                              <span className="text-muted-foreground">—</span>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </ScrollArea>
                      </div>

                      {/* Warning for system profiles */}
                      {selectedRole.is_system && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                          <p className="text-sm text-amber-700">
                            Este é um perfil de sistema. As alterações afetarão todos os utilizadores com este perfil.
                          </p>
                        </div>
                      )}

                      {/* Save Button */}
                      {hasChanges && (
                        <div className="flex justify-end">
                          <Button 
                            onClick={handleSavePermissions} 
                            disabled={updateRolePermissions.isPending}
                          >
                            {updateRolePermissions.isPending ? "A guardar..." : "Guardar Alterações"}
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                      <Shield className="h-12 w-12 mb-4 opacity-50" />
                      <p>Selecione um perfil para ver as permissões</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Create Dialog */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
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
        </div>
      </TooltipProvider>
    </AppLayout>
  );
}
