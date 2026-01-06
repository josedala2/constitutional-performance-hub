import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useRoles } from "@/hooks/useRoles";
import { 
  Boxes, 
  Shield, 
  Eye, 
  Plus, 
  Pencil, 
  Trash2, 
  Check, 
  X,
  Info,
  Save,
  Settings2,
  Lock,
  Unlock
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { MODULES, ModuleCode, PermissionAction } from "@/config/permissions";
import { cn } from "@/lib/utils";

interface ModuleAccess {
  moduleCode: ModuleCode;
  roleId: string;
  permissions: PermissionAction[];
}

const ACTION_CONFIG: Record<PermissionAction, { label: string; icon: React.ElementType; color: string }> = {
  view: { label: "Ver", icon: Eye, color: "text-blue-600 bg-blue-500/10 border-blue-500/20" },
  create: { label: "Criar", icon: Plus, color: "text-green-600 bg-green-500/10 border-green-500/20" },
  update: { label: "Editar", icon: Pencil, color: "text-amber-600 bg-amber-500/10 border-amber-500/20" },
  delete: { label: "Eliminar", icon: Trash2, color: "text-red-600 bg-red-500/10 border-red-500/20" },
};

const ACTIONS: PermissionAction[] = ["view", "create", "update", "delete"];

export default function AcessosModulos() {
  const { data: roles, isLoading: isLoadingRoles } = useRoles();
  const [selectedModule, setSelectedModule] = useState<typeof MODULES[0] | null>(null);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [modulePermissions, setModulePermissions] = useState<Record<string, PermissionAction[]>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize module permissions for selected module
  useEffect(() => {
    if (selectedModule && roles) {
      const initialPermissions: Record<string, PermissionAction[]> = {};
      roles.forEach(role => {
        // Start with empty permissions - in a real app, this would load from database
        initialPermissions[role.id] = [];
      });
      setModulePermissions(initialPermissions);
      setHasChanges(false);
    }
  }, [selectedModule, roles]);

  const openConfigDialog = (module: typeof MODULES[0]) => {
    setSelectedModule(module);
    setIsConfigDialogOpen(true);
  };

  const togglePermission = (roleId: string, action: PermissionAction) => {
    setModulePermissions(prev => {
      const current = prev[roleId] || [];
      const newPermissions = current.includes(action)
        ? current.filter(a => a !== action)
        : [...current, action];
      return { ...prev, [roleId]: newPermissions };
    });
    setHasChanges(true);
  };

  const toggleAllForRole = (roleId: string) => {
    setModulePermissions(prev => {
      const current = prev[roleId] || [];
      const hasAll = ACTIONS.every(a => current.includes(a));
      return { ...prev, [roleId]: hasAll ? [] : [...ACTIONS] };
    });
    setHasChanges(true);
  };

  const toggleAllForAction = (action: PermissionAction) => {
    if (!roles) return;
    setModulePermissions(prev => {
      const allHaveAction = roles.every(role => (prev[role.id] || []).includes(action));
      const newPermissions = { ...prev };
      roles.forEach(role => {
        const current = prev[role.id] || [];
        if (allHaveAction) {
          newPermissions[role.id] = current.filter(a => a !== action);
        } else {
          if (!current.includes(action)) {
            newPermissions[role.id] = [...current, action];
          }
        }
      });
      return newPermissions;
    });
    setHasChanges(true);
  };

  const savePermissions = async () => {
    // In a real implementation, this would save to the database
    toast.success("Permissões do módulo guardadas com sucesso");
    setHasChanges(false);
    setIsConfigDialogOpen(false);
  };

  const getRolePermissionCount = (roleId: string) => {
    return (modulePermissions[roleId] || []).length;
  };

  const getTotalPermissionsForModule = () => {
    if (!roles) return 0;
    return roles.reduce((acc, role) => acc + (modulePermissions[role.id] || []).length, 0);
  };

  // Group modules by category
  const moduleGroups = [
    {
      name: "Autenticação e Sistema",
      modules: MODULES.filter(m => ["M01", "M02", "M03", "M04"].includes(m.code)),
    },
    {
      name: "Ciclos e Definições",
      modules: MODULES.filter(m => ["M05", "M06", "M07"].includes(m.code)),
    },
    {
      name: "Avaliações",
      modules: MODULES.filter(m => ["M08", "M09", "M10", "M11", "M12"].includes(m.code)),
    },
    {
      name: "Resultados e Relatórios",
      modules: MODULES.filter(m => ["M13", "M14", "M15", "M16"].includes(m.code)),
    },
    {
      name: "Documentos e Notificações",
      modules: MODULES.filter(m => ["M17", "M18"].includes(m.code)),
    },
  ];

  return (
    <AppLayout>
      <TooltipProvider>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold font-serif text-foreground">Acessos por Módulo</h1>
            <p className="text-muted-foreground mt-1">
              Defina quais perfis têm acesso a cada módulo do sistema e suas permissões
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Boxes className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{MODULES.length}</p>
                    <p className="text-sm text-muted-foreground">Módulos do Sistema</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{roles?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Perfis Disponíveis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <Settings2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{ACTIONS.length}</p>
                    <p className="text-sm text-muted-foreground">Tipos de Permissão</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Module Groups */}
          <div className="space-y-6">
            {moduleGroups.map((group) => (
              <Card key={group.name}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Boxes className="h-5 w-5 text-primary" />
                    {group.name}
                  </CardTitle>
                  <CardDescription>
                    {group.modules.length} módulos neste grupo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {group.modules.map((module) => (
                      <Card 
                        key={module.code} 
                        className="hover:border-primary/50 transition-colors cursor-pointer group"
                        onClick={() => openConfigDialog(module)}
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                                <Badge variant="outline" className="font-mono text-xs">
                                  {module.code}
                                </Badge>
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">{module.label}</h4>
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                  {module.description}
                                </p>
                              </div>
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Settings2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Configurar acessos</TooltipContent>
                            </Tooltip>
                          </div>
                          <div className="flex gap-1 mt-3">
                            {ACTIONS.map(action => {
                              const config = ACTION_CONFIG[action];
                              const Icon = config.icon;
                              return (
                                <Tooltip key={action}>
                                  <TooltipTrigger asChild>
                                    <div className={cn(
                                      "p-1.5 rounded border",
                                      config.color
                                    )}>
                                      <Icon className="h-3 w-3" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>{config.label}</TooltipContent>
                                </Tooltip>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Configuration Dialog */}
          <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">
                    {selectedModule?.code}
                  </Badge>
                  {selectedModule?.label}
                </DialogTitle>
                <DialogDescription>
                  {selectedModule?.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Info banner */}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700">
                    Selecione as permissões que cada perfil deve ter para este módulo
                  </span>
                </div>

                {/* Permissions matrix */}
                <ScrollArea className="h-[50vh]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Perfil</TableHead>
                        {ACTIONS.map(action => {
                          const config = ACTION_CONFIG[action];
                          const Icon = config.icon;
                          return (
                            <TableHead key={action} className="text-center w-[100px]">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1"
                                onClick={() => toggleAllForAction(action)}
                              >
                                <Icon className="h-4 w-4" />
                                {config.label}
                              </Button>
                            </TableHead>
                          );
                        })}
                        <TableHead className="text-center w-[100px]">Todos</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingRoles ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            A carregar perfis...
                          </TableCell>
                        </TableRow>
                      ) : (
                        roles?.map((role) => {
                          const permissions = modulePermissions[role.id] || [];
                          const hasAllPermissions = ACTIONS.every(a => permissions.includes(a));
                          const hasNoPermissions = permissions.length === 0;
                          
                          return (
                            <TableRow key={role.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className={cn(
                                    "p-1.5 rounded",
                                    role.is_system ? "bg-amber-500/10" : "bg-primary/10"
                                  )}>
                                    {role.is_system ? (
                                      <Lock className="h-4 w-4 text-amber-600" />
                                    ) : (
                                      <Shield className="h-4 w-4 text-primary" />
                                    )}
                                  </div>
                                  <div>
                                    <span className="font-medium">{role.name}</span>
                                    {role.is_system && (
                                      <Badge variant="secondary" className="ml-2 text-[10px]">
                                        Sistema
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              {ACTIONS.map(action => {
                                const hasPermission = permissions.includes(action);
                                const config = ACTION_CONFIG[action];
                                
                                return (
                                  <TableCell key={action} className="text-center">
                                    <div className="flex justify-center">
                                      <Checkbox
                                        checked={hasPermission}
                                        onCheckedChange={() => togglePermission(role.id, action)}
                                        className={cn(
                                          "h-5 w-5",
                                          hasPermission && "border-primary"
                                        )}
                                      />
                                    </div>
                                  </TableCell>
                                );
                              })}
                              <TableCell className="text-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleAllForRole(role.id)}
                                  className={cn(
                                    "h-8 w-8 p-0",
                                    hasAllPermissions && "text-green-600",
                                    hasNoPermissions && "text-muted-foreground"
                                  )}
                                >
                                  {hasAllPermissions ? (
                                    <Check className="h-4 w-4" />
                                  ) : hasNoPermissions ? (
                                    <X className="h-4 w-4" />
                                  ) : (
                                    <Badge variant="outline" className="text-[10px]">
                                      {permissions.length}
                                    </Badge>
                                  )}
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>

                {/* Summary */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Total de permissões configuradas: 
                      <Badge variant="secondary" className="ml-2">
                        {getTotalPermissionsForModule()}
                      </Badge>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsConfigDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={savePermissions}
                      disabled={!hasChanges}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Guardar Alterações
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </TooltipProvider>
    </AppLayout>
  );
}
