import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  PERMISSION_TEMPLATES, 
  TEMPLATE_CATEGORIES, 
  PermissionTemplate,
  getUniquePermissions,
  compareWithTemplate 
} from "@/config/permissionTemplates";
import { useRoles, useRolePermissions, usePermissions, useUpdateRolePermissions } from "@/hooks/useRoles";
import { 
  FileStack,
  Shield,
  Users,
  Eye,
  Briefcase,
  ClipboardCheck,
  User,
  BarChart3,
  BookOpen,
  Scale,
  Building2,
  Check,
  Copy,
  ArrowRight,
  Sparkles,
  Info,
  AlertCircle,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  Shield,
  Users,
  Eye,
  Briefcase,
  ClipboardCheck,
  User,
  BarChart3,
  BookOpen,
  Scale,
  Building2,
};

export default function TemplatesPermissoes() {
  const [selectedTemplate, setSelectedTemplate] = useState<PermissionTemplate | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);

  const { data: roles } = useRoles();
  const { data: permissions } = usePermissions();
  const { data: rolePermissions } = useRolePermissions(selectedRoleId);
  const updateRolePermissions = useUpdateRolePermissions();

  const openApplyDialog = (template: PermissionTemplate) => {
    setSelectedTemplate(template);
    setSelectedRoleId("");
    setIsApplyDialogOpen(true);
  };

  const openPreviewDialog = (template: PermissionTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewDialogOpen(true);
  };

  const handleApplyTemplate = async () => {
    if (!selectedTemplate || !selectedRoleId || !permissions) return;

    // Get permission IDs from permission codes
    const templatePermissionCodes = getUniquePermissions(selectedTemplate);
    const permissionIds = permissions
      .filter(p => templatePermissionCodes.includes(p.code))
      .map(p => p.id);

    try {
      await updateRolePermissions.mutateAsync({
        roleId: selectedRoleId,
        permissionIds,
      });
      toast.success(`Template "${selectedTemplate.name}" aplicado com sucesso!`);
      setIsApplyDialogOpen(false);
    } catch (error) {
      toast.error("Erro ao aplicar template");
    }
  };

  const getTemplateIcon = (iconName: string) => {
    return ICON_MAP[iconName] || Shield;
  };

  const currentRolePermissionCodes = rolePermissions?.map(rp => {
    const perm = permissions?.find(p => p.id === rp.id);
    return perm?.code || "";
  }).filter(Boolean) || [];

  const comparison = selectedTemplate && selectedRoleId
    ? compareWithTemplate(selectedTemplate, currentRolePermissionCodes)
    : null;

  // Group permissions by module for preview
  const groupPermissionsByModule = (permissionCodes: string[]) => {
    const grouped: Record<string, string[]> = {};
    permissionCodes.forEach(code => {
      const [module] = code.split(".");
      if (!grouped[module]) grouped[module] = [];
      grouped[module].push(code);
    });
    return grouped;
  };

  const MODULE_LABELS: Record<string, string> = {
    users: "Utilizadores",
    roles: "Perfis",
    permissions: "Permissões",
    audit: "Auditoria",
    evaluations: "Avaliações",
    objectives: "Objectivos",
    competencies: "Competências",
    cycles: "Ciclos",
    reports: "Relatórios",
    documents: "Documentos",
    org_units: "Unidades Orgânicas",
    employees: "Colaboradores",
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Templates de Permissões</h1>
          <p className="text-muted-foreground mt-1">
            Aplique conjuntos pré-definidos de permissões a perfis de forma rápida e consistente
          </p>
        </div>

        {/* Info Banner */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Como usar os templates?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Selecione um template e aplique-o a um perfil existente. As permissões do perfil serão 
                  substituídas pelas do template. Pode pré-visualizar as permissões antes de aplicar.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates by Category */}
        <Tabs defaultValue="system">
          <TabsList>
            {Object.entries(TEMPLATE_CATEGORIES).map(([key, category]) => (
              <TabsTrigger key={key} value={key} className="gap-2">
                {category.label}
                <Badge variant="secondary" className="text-xs">
                  {PERMISSION_TEMPLATES.filter(t => t.category === key).length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(TEMPLATE_CATEGORIES).map(([categoryKey, category]) => (
            <TabsContent key={categoryKey} value={categoryKey} className="mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {PERMISSION_TEMPLATES
                  .filter(t => t.category === categoryKey)
                  .map((template) => {
                    const Icon = getTemplateIcon(template.icon);
                    const uniquePerms = getUniquePermissions(template);
                    
                    return (
                      <Card key={template.id} className="group hover:border-primary/50 transition-all">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className={cn(
                              "p-2.5 rounded-lg border",
                              template.color
                            )}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {uniquePerms.length} permissões
                            </Badge>
                          </div>
                          <CardTitle className="text-lg mt-3">{template.name}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {template.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {/* Permission preview badges */}
                          <div className="flex flex-wrap gap-1 mb-4">
                            {Object.keys(groupPermissionsByModule(uniquePerms)).slice(0, 4).map(module => (
                              <Badge key={module} variant="secondary" className="text-xs">
                                {MODULE_LABELS[module] || module}
                              </Badge>
                            ))}
                            {Object.keys(groupPermissionsByModule(uniquePerms)).length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{Object.keys(groupPermissionsByModule(uniquePerms)).length - 4}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => openPreviewDialog(template)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Detalhes
                            </Button>
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onClick={() => openApplyDialog(template)}
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              Aplicar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Preview Dialog */}
        <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedTemplate && (
                  <>
                    {(() => {
                      const Icon = getTemplateIcon(selectedTemplate.icon);
                      return <Icon className="h-5 w-5" />;
                    })()}
                    {selectedTemplate.name}
                  </>
                )}
              </DialogTitle>
              <DialogDescription>
                {selectedTemplate?.description}
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="h-[50vh] pr-4">
              <div className="space-y-4">
                {selectedTemplate && Object.entries(
                  groupPermissionsByModule(getUniquePermissions(selectedTemplate))
                ).map(([module, perms]) => (
                  <div key={module} className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <div className="p-1 rounded bg-primary/10">
                        <FileStack className="h-3 w-3 text-primary" />
                      </div>
                      {MODULE_LABELS[module] || module}
                      <Badge variant="secondary" className="text-xs ml-auto">
                        {perms.length}
                      </Badge>
                    </h4>
                    <div className="grid grid-cols-2 gap-2 pl-6">
                      {perms.map(code => {
                        const action = code.split(".")[1];
                        return (
                          <div 
                            key={code} 
                            className="flex items-center gap-2 text-sm p-2 rounded-md bg-muted/50"
                          >
                            <Check className="h-3 w-3 text-green-600" />
                            <code className="text-xs font-mono">{code}</code>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
                Fechar
              </Button>
              <Button onClick={() => {
                setIsPreviewDialogOpen(false);
                if (selectedTemplate) openApplyDialog(selectedTemplate);
              }}>
                <Copy className="h-4 w-4 mr-2" />
                Aplicar Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Apply Dialog */}
        <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Copy className="h-5 w-5" />
                Aplicar Template
              </DialogTitle>
              <DialogDescription>
                Selecione o perfil onde deseja aplicar o template "{selectedTemplate?.name}".
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Template info */}
              <div className={cn(
                "p-4 rounded-lg border flex items-start gap-3",
                selectedTemplate?.color
              )}>
                {selectedTemplate && (
                  <>
                    {(() => {
                      const Icon = getTemplateIcon(selectedTemplate.icon);
                      return <Icon className="h-5 w-5 mt-0.5" />;
                    })()}
                    <div>
                      <h4 className="font-medium">{selectedTemplate.name}</h4>
                      <p className="text-sm opacity-80">{selectedTemplate.description}</p>
                      <Badge variant="outline" className="mt-2">
                        {selectedTemplate && getUniquePermissions(selectedTemplate).length} permissões
                      </Badge>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>

              {/* Role selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Aplicar ao Perfil:</label>
                <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um perfil..." />
                  </SelectTrigger>
                  <SelectContent>
                    {roles?.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          {role.name}
                          {role.is_system && (
                            <Badge variant="secondary" className="text-[10px]">Sistema</Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Comparison preview */}
              {comparison && selectedRoleId && (
                <div className="space-y-3 p-4 rounded-lg border bg-muted/30">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Comparação com permissões actuais
                  </h4>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2 rounded-md bg-green-500/10">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-green-700">{comparison.matching.length}</p>
                      <p className="text-xs text-green-600">Já existentes</p>
                    </div>
                    <div className="text-center p-2 rounded-md bg-blue-500/10">
                      <AlertCircle className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-blue-700">{comparison.missing.length}</p>
                      <p className="text-xs text-blue-600">A adicionar</p>
                    </div>
                    <div className="text-center p-2 rounded-md bg-amber-500/10">
                      <XCircle className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-amber-700">{comparison.extra.length}</p>
                      <p className="text-xs text-amber-600">A remover</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    As permissões do perfil serão substituídas pelas do template
                  </p>
                </div>
              )}

              {/* Warning */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                <p className="text-sm text-amber-700">
                  Esta acção irá substituir todas as permissões actuais do perfil selecionado.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsApplyDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleApplyTemplate}
                disabled={!selectedRoleId || updateRolePermissions.isPending}
              >
                {updateRolePermissions.isPending ? "A aplicar..." : "Confirmar e Aplicar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
