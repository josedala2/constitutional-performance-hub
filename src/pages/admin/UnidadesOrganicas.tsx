import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useOrgUnits, useCreateOrgUnit, useUpdateOrgUnit, useDeleteOrgUnit } from "@/hooks/useOrgUnits";
import { useProfiles } from "@/hooks/useProfiles";
import { Search, Plus, Edit, Trash2, Building2, ChevronRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";

export default function UnidadesOrganicas() {
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; unitId: string; unitName: string } | null>(null);
  const [formData, setFormData] = useState({ name: "", parent_id: "" });

  const { data: orgUnits, isLoading } = useOrgUnits();
  const { data: profiles } = useProfiles();
  const createOrgUnit = useCreateOrgUnit();
  const updateOrgUnit = useUpdateOrgUnit();
  const deleteOrgUnit = useDeleteOrgUnit();

  const filteredUnits = orgUnits?.filter((unit) =>
    unit.name.toLowerCase().includes(search.toLowerCase())
  );

  // Build hierarchy for display
  const getParentName = (parentId: string | null) => {
    if (!parentId) return null;
    return orgUnits?.find((u) => u.id === parentId)?.name || null;
  };

  const getChildrenCount = (unitId: string) => {
    return orgUnits?.filter((u) => u.parent_id === unitId).length || 0;
  };

  const getUsersCount = (unitId: string) => {
    return profiles?.filter((p) => p.org_unit_id === unitId).length || 0;
  };

  const handleCreate = async () => {
    try {
      await createOrgUnit.mutateAsync({
        name: formData.name,
        parent_id: formData.parent_id || null,
      });
      setIsCreateOpen(false);
      resetForm();
    } catch (error: any) {
      // Error handled by hook
    }
  };

  const handleUpdate = async () => {
    if (!selectedUnit) return;
    try {
      await updateOrgUnit.mutateAsync({
        id: selectedUnit.id,
        data: {
          name: formData.name,
          parent_id: formData.parent_id || null,
        },
      });
      setIsEditOpen(false);
      resetForm();
    } catch (error: any) {
      // Error handled by hook
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog) return;
    try {
      await deleteOrgUnit.mutateAsync(deleteDialog.unitId);
    } catch (error: any) {
      // Error handled by hook
    }
    setDeleteDialog(null);
  };

  const resetForm = () => {
    setFormData({ name: "", parent_id: "" });
    setSelectedUnit(null);
  };

  const openEdit = (unit: any) => {
    setSelectedUnit(unit);
    setFormData({
      name: unit.name,
      parent_id: unit.parent_id || "",
    });
    setIsEditOpen(true);
  };

  // Get available parents (exclude self and children to prevent circular references)
  const getAvailableParents = (excludeId?: string) => {
    if (!excludeId) return orgUnits;
    
    const getDescendants = (parentId: string): string[] => {
      const children = orgUnits?.filter((u) => u.parent_id === parentId) || [];
      return children.flatMap((child) => [child.id, ...getDescendants(child.id)]);
    };
    
    const descendants = getDescendants(excludeId);
    return orgUnits?.filter((u) => u.id !== excludeId && !descendants.includes(u.id));
  };

  // Build breadcrumb path for a unit
  const getBreadcrumbPath = (unitId: string): string[] => {
    const path: string[] = [];
    let currentId: string | null = unitId;
    
    while (currentId) {
      const unit = orgUnits?.find((u) => u.id === currentId);
      if (unit) {
        path.unshift(unit.name);
        currentId = unit.parent_id;
      } else {
        break;
      }
    }
    
    return path;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-serif text-foreground">Unidades Orgânicas</h1>
            <p className="text-muted-foreground mt-1">Gerir a estrutura organizacional da instituição</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Unidade
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Unidade Orgânica</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Nome *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Gabinete de Recursos Humanos"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unidade Superior</Label>
                  <Select
                    value={formData.parent_id}
                    onValueChange={(value) => setFormData({ ...formData, parent_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Nenhuma (unidade raiz)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhuma (unidade raiz)</SelectItem>
                      {orgUnits?.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleCreate} 
                  className="w-full" 
                  disabled={createOrgUnit.isPending || !formData.name.trim()}
                >
                  {createOrgUnit.isPending ? "A criar..." : "Criar Unidade"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{orgUnits?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total de Unidades</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-secondary/50">
                  <Building2 className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {orgUnits?.filter((u) => !u.parent_id).length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Unidades Raiz</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-muted">
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {orgUnits?.filter((u) => u.parent_id).length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Sub-unidades</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar unidades..."
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
                    <TableHead>Hierarquia</TableHead>
                    <TableHead>Sub-unidades</TableHead>
                    <TableHead>Utilizadores</TableHead>
                    <TableHead className="w-[120px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUnits?.map((unit) => {
                    const path = getBreadcrumbPath(unit.id);
                    const childrenCount = getChildrenCount(unit.id);
                    const usersCount = getUsersCount(unit.id);
                    
                    return (
                      <TableRow key={unit.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{unit.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            {path.map((name, index) => (
                              <span key={index} className="flex items-center gap-1">
                                {index > 0 && <ChevronRight className="h-3 w-3" />}
                                <span className={index === path.length - 1 ? "text-foreground font-medium" : ""}>
                                  {name}
                                </span>
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{childrenCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{usersCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(unit)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setDeleteDialog({ 
                                open: true, 
                                unitId: unit.id, 
                                unitName: unit.name 
                              })}
                              disabled={childrenCount > 0 || usersCount > 0}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
            {filteredUnits?.length === 0 && !isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma unidade orgânica encontrada
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Unidade Orgânica</DialogTitle>
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
                <Label>Unidade Superior</Label>
                <Select
                  value={formData.parent_id}
                  onValueChange={(value) => setFormData({ ...formData, parent_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nenhuma (unidade raiz)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhuma (unidade raiz)</SelectItem>
                    {getAvailableParents(selectedUnit?.id)?.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleUpdate} 
                className="w-full" 
                disabled={updateOrgUnit.isPending || !formData.name.trim()}
              >
                {updateOrgUnit.isPending ? "A guardar..." : "Guardar Alterações"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm Dialog */}
        <ConfirmDialog
          open={deleteDialog?.open || false}
          onOpenChange={(open) => !open && setDeleteDialog(null)}
          title="Eliminar Unidade Orgânica"
          description={`Tem a certeza que deseja eliminar a unidade "${deleteDialog?.unitName}"? Esta ação não pode ser revertida.`}
          onConfirm={handleDelete}
          confirmText="Eliminar"
          variant="danger"
        />
      </div>
    </AppLayout>
  );
}