import { useState, useEffect, useCallback, useMemo } from "react";
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
  Download,
  Copy,
  AlertCircle,
  Settings,
  ClipboardList,
  BarChart3,
  Building2,
  ScrollText,
  Target,
  Award,
  GripVertical,
  Key,
  User,
  Bell,
  Folder,
  Calculator,
  CheckCircle,
  UserPlus,
  Sparkles
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MODULES, ROLE_PERMISSIONS, type AppRole, type ModuleCode } from "@/config/permissions";

// Module configuration with icons based on MODULES from permissions.ts
const MODULE_CONFIG: Record<string, { label: string; icon: React.ElementType; code: ModuleCode }> = {
  M01: { label: "Autenticação e Conta", icon: Key, code: "M01" },
  M02: { label: "Administração do Sistema", icon: Settings, code: "M02" },
  M03: { label: "Estrutura Organizacional", icon: Building2, code: "M03" },
  M04: { label: "Gestão de Utilizadores", icon: Users, code: "M04" },
  M05: { label: "Ciclos de Avaliação", icon: BarChart3, code: "M05" },
  M06: { label: "Catálogo de Competências", icon: Award, code: "M06" },
  M07: { label: "Objectivos e Metas", icon: Target, code: "M07" },
  M08: { label: "Acompanhamento Intermédio", icon: ClipboardList, code: "M08" },
  M09: { label: "Avaliação Superior", icon: UserCheck, code: "M09" },
  M10: { label: "Avaliação entre Pares", icon: Users, code: "M10" },
  M11: { label: "Avaliação Utente Interno", icon: UserPlus, code: "M11" },
  M12: { label: "Avaliação Utente Externo", icon: User, code: "M12" },
  M13: { label: "Cálculo NAF e Classificação", icon: Calculator, code: "M13" },
  M14: { label: "Homologação e Fecho", icon: CheckCircle, code: "M14" },
  M15: { label: "Relatórios e Estatísticas", icon: FileText, code: "M15" },
  M16: { label: "Auditoria e Logs", icon: ScrollText, code: "M16" },
  M17: { label: "Gestão Documental", icon: Folder, code: "M17" },
  M18: { label: "Notificações", icon: Bell, code: "M18" },
};

// Default module order based on MODULES
const DEFAULT_MODULE_ORDER: ModuleCode[] = [
  "M01", "M02", "M03", "M04", "M05", "M06", 
  "M07", "M08", "M09", "M10", "M11", "M12",
  "M13", "M14", "M15", "M16", "M17", "M18"
];

// Role name to AppRole mapping
const ROLE_NAME_MAP: Record<string, AppRole> = {
  "ADMIN": "admin",
  "DIRIGENTE": "dirigente", 
  "AVALIADOR": "avaliador",
  "AVALIADO": "avaliado",
  "UTENTE_INTERNO": "utente_interno",
  "UTENTE_EXTERNO": "utente_externo",
  // Lowercase variants
  "admin": "admin",
  "dirigente": "dirigente",
  "avaliador": "avaliador",
  "avaliado": "avaliado",
  "utente_interno": "utente_interno",
  "utente_externo": "utente_externo",
};

// Permission action columns - mapped to permissions.ts actions
const PERMISSION_ACTIONS = [
  { key: "view", label: "VER", icon: Eye },
  { key: "create", label: "CRIAR", icon: Plus },
  { key: "update", label: "EDITAR", icon: Pencil },
  { key: "delete", label: "ELIMINAR", icon: Trash2 },
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

// Type for custom permissions state
type CustomPermissions = Record<string, Record<string, boolean>>;

export default function PerfisPermissoes() {
  const [search, setSearch] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const [moduleOrder, setModuleOrder] = useState<ModuleCode[]>(DEFAULT_MODULE_ORDER);
  const [draggedModule, setDraggedModule] = useState<ModuleCode | null>(null);
  const [dragOverModule, setDragOverModule] = useState<ModuleCode | null>(null);
  
  // State for custom permissions per role
  const [customPermissions, setCustomPermissions] = useState<Record<string, CustomPermissions>>({});

  const { data: roles, isLoading: isLoadingRoles } = useRoles();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const { data: permissions } = usePermissions();
  const { data: rolePermissions, isLoading: isLoadingRolePermissions } = useRolePermissions(selectedRoleId || "");
  const updateRolePermissions = useUpdateRolePermissions();

  const selectedRole = roles?.find(r => r.id === selectedRoleId);

  // Get permissions matrix based on role configuration from permissions.ts
  const getPermissionsForRole = useCallback((roleName: string): Record<ModuleCode, string[]> => {
    const normalizedName = roleName.toUpperCase().replace(/\s+/g, '_');
    const appRole = ROLE_NAME_MAP[normalizedName] || ROLE_NAME_MAP[roleName.toLowerCase()];
    
    if (appRole && ROLE_PERMISSIONS[appRole]) {
      return ROLE_PERMISSIONS[appRole].modules as Record<ModuleCode, string[]>;
    }
    
    // Return empty permissions for unknown roles
    return {} as Record<ModuleCode, string[]>;
  }, []);

  // Get configured permissions for selected role (from config file)
  const configuredPermissions = useMemo(() => {
    if (!selectedRole) return {};
    return getPermissionsForRole(selectedRole.name);
  }, [selectedRole, getPermissionsForRole]);

  // Initialize custom permissions for a role based on config when role is selected
  useEffect(() => {
    if (selectedRoleId && selectedRole && !customPermissions[selectedRoleId]) {
      const initialPerms: CustomPermissions = {};
      DEFAULT_MODULE_ORDER.forEach(moduleCode => {
        initialPerms[moduleCode] = {};
        PERMISSION_ACTIONS.forEach(action => {
          const modulePerms = configuredPermissions[moduleCode];
          initialPerms[moduleCode][action.key] = modulePerms ? modulePerms.includes(action.key) : false;
        });
      });
      setCustomPermissions(prev => ({
        ...prev,
        [selectedRoleId]: initialPerms
      }));
    }
  }, [selectedRoleId, selectedRole, configuredPermissions]);

  // Check if a module has a specific action (using custom permissions)
  const hasPermission = useCallback((moduleCode: ModuleCode, action: string): boolean => {
    if (!selectedRoleId) return false;
    
    const rolePerms = customPermissions[selectedRoleId];
    if (rolePerms && rolePerms[moduleCode] !== undefined) {
      return rolePerms[moduleCode][action] ?? false;
    }
    
    // Fallback to config permissions
    const modulePerms = configuredPermissions[moduleCode];
    if (!modulePerms) return false;
    return modulePerms.includes(action);
  }, [selectedRoleId, customPermissions, configuredPermissions]);

  // Toggle a permission
  const toggleModulePermission = useCallback((moduleCode: ModuleCode, action: string) => {
    if (!selectedRoleId) return;
    
    setCustomPermissions(prev => {
      const rolePerms = prev[selectedRoleId] || {};
      const modulePerms = rolePerms[moduleCode] || {};
      
      return {
        ...prev,
        [selectedRoleId]: {
          ...rolePerms,
          [moduleCode]: {
            ...modulePerms,
            [action]: !modulePerms[action]
          }
        }
      };
    });
    setHasChanges(true);
  }, [selectedRoleId]);

  // Toggle all permissions for a module (row)
  const toggleAllModulePermissions = useCallback((moduleCode: ModuleCode) => {
    if (!selectedRoleId) return;
    
    const allChecked = PERMISSION_ACTIONS.every(action => hasPermission(moduleCode, action.key));
    
    setCustomPermissions(prev => {
      const rolePerms = prev[selectedRoleId] || {};
      const newModulePerms: Record<string, boolean> = {};
      PERMISSION_ACTIONS.forEach(action => {
        newModulePerms[action.key] = !allChecked;
      });
      
      return {
        ...prev,
        [selectedRoleId]: {
          ...rolePerms,
          [moduleCode]: newModulePerms
        }
      };
    });
    setHasChanges(true);
  }, [selectedRoleId, hasPermission]);

  // Toggle all permissions for an action (column)
  const toggleAllActionPermissions = useCallback((action: string) => {
    if (!selectedRoleId) return;
    
    const allChecked = sortedModules.every(moduleCode => hasPermission(moduleCode, action));
    
    setCustomPermissions(prev => {
      const rolePerms = prev[selectedRoleId] || {};
      const newRolePerms = { ...rolePerms };
      
      sortedModules.forEach(moduleCode => {
        newRolePerms[moduleCode] = {
          ...(newRolePerms[moduleCode] || {}),
          [action]: !allChecked
        };
      });
      
      return {
        ...prev,
        [selectedRoleId]: newRolePerms
      };
    });
    setHasChanges(true);
  }, [selectedRoleId, hasPermission]);

  // Reset permissions to default config
  const resetToDefaults = useCallback(() => {
    if (!selectedRoleId || !selectedRole) return;
    
    const initialPerms: CustomPermissions = {};
    DEFAULT_MODULE_ORDER.forEach(moduleCode => {
      initialPerms[moduleCode] = {};
      PERMISSION_ACTIONS.forEach(action => {
        const modulePerms = configuredPermissions[moduleCode];
        initialPerms[moduleCode][action.key] = modulePerms ? modulePerms.includes(action.key) : false;
      });
    });
    
    setCustomPermissions(prev => ({
      ...prev,
      [selectedRoleId]: initialPerms
    }));
    setHasChanges(false);
    toast.success("Permissões repostas para os valores padrão");
  }, [selectedRoleId, selectedRole, configuredPermissions]);

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

  // Get sorted modules based on moduleOrder - always show all modules from config
  const sortedModules = useMemo(() => {
    return [...moduleOrder];
  }, [moduleOrder]);

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

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, module: ModuleCode) => {
    setDraggedModule(module);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", module);
    // Add a custom drag image
    const dragElement = e.currentTarget as HTMLElement;
    if (dragElement) {
      e.dataTransfer.setDragImage(dragElement, 20, 20);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, module: ModuleCode) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedModule && module !== draggedModule) {
      setDragOverModule(module);
    }
  }, [draggedModule]);

  const handleDragLeave = useCallback(() => {
    setDragOverModule(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetModule: ModuleCode) => {
    e.preventDefault();
    if (!draggedModule || draggedModule === targetModule) {
      setDraggedModule(null);
      setDragOverModule(null);
      return;
    }

    setModuleOrder(prevOrder => {
      const newOrder = [...prevOrder];
      const draggedIndex = newOrder.indexOf(draggedModule);
      const targetIndex = newOrder.indexOf(targetModule);

      // If draggedModule is not in the order, add it
      if (draggedIndex === -1) {
        newOrder.splice(targetIndex, 0, draggedModule);
      } else {
        // Remove from old position and insert at new position
        newOrder.splice(draggedIndex, 1);
        const newTargetIndex = newOrder.indexOf(targetModule);
        newOrder.splice(newTargetIndex, 0, draggedModule);
      }

      return newOrder;
    });

    setDraggedModule(null);
    setDragOverModule(null);
    toast.success("Ordem dos módulos atualizada");
  }, [draggedModule]);

  const handleDragEnd = useCallback(() => {
    setDraggedModule(null);
    setDragOverModule(null);
  }, []);

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
                          {hasChanges && (
                            <Button variant="ghost" onClick={resetToDefaults} size="sm">
                              Repor Padrão
                            </Button>
                          )}
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
                        <div className="grid grid-cols-[auto_1fr_repeat(4,80px)] bg-muted/50 border-b">
                          <div className="p-3 w-8"></div>
                          <div className="p-3 font-medium text-sm text-muted-foreground">Módulo</div>
                          {PERMISSION_ACTIONS.map((action) => {
                            const Icon = action.icon;
                            const allChecked = sortedModules.every(m => hasPermission(m, action.key));
                            return (
                              <div 
                                key={action.key} 
                                className="p-3 text-center cursor-pointer hover:bg-muted transition-colors rounded"
                                onClick={() => toggleAllActionPermissions(action.key)}
                                title={`Clique para ${allChecked ? 'desmarcar' : 'marcar'} todos`}
                              >
                                <Icon className={cn(
                                  "h-4 w-4 mx-auto mb-1 transition-colors",
                                  allChecked ? "text-primary" : "text-muted-foreground"
                                )} />
                                <span className={cn(
                                  "text-[10px] font-medium uppercase transition-colors",
                                  allChecked ? "text-primary" : "text-muted-foreground"
                                )}>
                                  {action.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Matrix Rows */}
                        <ScrollArea className="h-[calc(100vh-480px)]">
                          <div>
                            {sortedModules.map((moduleCode) => {
                              const config = MODULE_CONFIG[moduleCode];
                              if (!config) return null;
                              
                              const ModuleIcon = config.icon;
                              const isDragging = draggedModule === moduleCode;
                              const isDragOver = dragOverModule === moduleCode;
                              const hasAnyPermission = PERMISSION_ACTIONS.some(action => 
                                hasPermission(moduleCode, action.key)
                              );
                              const allModulePermissions = PERMISSION_ACTIONS.every(action => 
                                hasPermission(moduleCode, action.key)
                              );
                              
                              return (
                                <div 
                                  key={moduleCode} 
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, moduleCode)}
                                  onDragOver={(e) => handleDragOver(e, moduleCode)}
                                  onDragLeave={handleDragLeave}
                                  onDrop={(e) => handleDrop(e, moduleCode)}
                                  onDragEnd={handleDragEnd}
                                  className={cn(
                                    "grid grid-cols-[auto_1fr_repeat(4,80px)] border-b last:border-0 transition-all",
                                    isDragging && "opacity-50 bg-muted",
                                    isDragOver && "bg-primary/10 border-primary border-2",
                                    !isDragging && !isDragOver && "hover:bg-muted/30"
                                  )}
                                >
                                  <div className="p-3 flex items-center cursor-grab active:cursor-grabbing">
                                    <GripVertical className="h-4 w-4 text-muted-foreground/50 hover:text-muted-foreground transition-colors" />
                                  </div>
                                  <div 
                                    className="p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 rounded transition-colors"
                                    onClick={() => toggleAllModulePermissions(moduleCode)}
                                    title="Clique para alternar todas as permissões deste módulo"
                                  >
                                    <div className={cn(
                                      "p-1.5 rounded",
                                      hasAnyPermission ? "bg-primary/10" : "bg-muted"
                                    )}>
                                      <ModuleIcon className={cn(
                                        "h-4 w-4",
                                        hasAnyPermission ? "text-primary" : "text-muted-foreground"
                                      )} />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="font-medium text-sm">{config.label}</span>
                                      <span className="text-[10px] text-muted-foreground">{moduleCode}</span>
                                    </div>
                                    {allModulePermissions && (
                                      <Badge variant="secondary" className="text-[9px] ml-auto">
                                        Acesso Total
                                      </Badge>
                                    )}
                                  </div>
                                  {PERMISSION_ACTIONS.map((action) => {
                                    const hasPerm = hasPermission(moduleCode, action.key);
                                    
                                    return (
                                      <div key={action.key} className="p-3 flex items-center justify-center">
                                        <Checkbox
                                          checked={hasPerm}
                                          onCheckedChange={() => toggleModulePermission(moduleCode, action.key)}
                                          className={cn(
                                            "h-5 w-5 cursor-pointer transition-all hover:scale-110",
                                            hasPerm && "bg-primary border-primary text-primary-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                          )}
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </div>
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
