import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useProfiles, useUpdateProfile, useUpdateProfileStatus } from "@/hooks/useProfiles";
import { useOrgUnits } from "@/hooks/useOrgUnits";
import { useAssignUserRole, useRemoveUserRole, useUserRoles } from "@/hooks/useUserRoles";
import { useRoles } from "@/hooks/useRoles";
import { toast } from "@/hooks/use-toast";
import { Search, Plus, MoreHorizontal, Edit, UserCheck, UserX, Shield, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { UserStatus } from "@/types/auth";

export default function Utilizadores() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [orgUnitFilter, setOrgUnitFilter] = useState<string>("all");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRolesOpen, setIsRolesOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; userId: string; currentStatus: UserStatus } | null>(null);

  const { data: profiles, isLoading } = useProfiles();
  const { data: orgUnits } = useOrgUnits();
  const { data: roles } = useRoles();
  const updateProfile = useUpdateProfile();
  const updateStatus = useUpdateProfileStatus();
  const assignRole = useAssignUserRole();
  const removeRole = useRemoveUserRole();
  const { data: userRoles } = useUserRoles(selectedUser?.id || "");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    employee_code: "",
    phone: "",
    job_title: "",
    org_unit_id: "",
  });

  const filteredProfiles = profiles?.filter((profile) => {
    const matchesSearch =
      profile.full_name.toLowerCase().includes(search.toLowerCase()) ||
      profile.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || profile.status === statusFilter;
    const matchesOrgUnit = orgUnitFilter === "all" || profile.org_unit_id === orgUnitFilter;
    return matchesSearch && matchesStatus && matchesOrgUnit;
  });

  const handleUpdate = async () => {
    if (!selectedUser) return;
    try {
      await updateProfile.mutateAsync({
        id: selectedUser.id,
        data: {
          full_name: formData.full_name,
          email: formData.email,
          employee_code: formData.employee_code || null,
          phone: formData.phone || null,
          job_title: formData.job_title || null,
          org_unit_id: formData.org_unit_id || null,
        },
      });
      setIsEditOpen(false);
      resetForm();
    } catch (error: any) {
      // Error handled by hook
    }
  };

  const handleToggleStatus = async () => {
    if (!confirmDialog) return;
    const newStatus: UserStatus = confirmDialog.currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await updateStatus.mutateAsync({
        id: confirmDialog.userId,
        status: newStatus,
        oldStatus: confirmDialog.currentStatus,
      });
    } catch (error: any) {
      // Error handled by hook
    }
    setConfirmDialog(null);
  };

  const handleAssignRole = async (roleId: string) => {
    if (!selectedUser) return;
    try {
      await assignRole.mutateAsync({
        userId: selectedUser.id,
        assignment: {
          role_id: roleId,
          scope_type: "GLOBAL",
        },
      });
    } catch (error: any) {
      // Error handled by hook
    }
  };

  const handleRemoveRole = async (userRoleId: string, roleId: string, roleName: string) => {
    if (!selectedUser) return;
    try {
      await removeRole.mutateAsync({
        userRoleId,
        userId: selectedUser.id,
        roleId,
        roleName,
      });
    } catch (error: any) {
      // Error handled by hook
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: "",
      email: "",
      employee_code: "",
      phone: "",
      job_title: "",
      org_unit_id: "",
    });
    setSelectedUser(null);
  };

  const openEdit = (profile: any) => {
    setSelectedUser(profile);
    setFormData({
      full_name: profile.full_name,
      email: profile.email,
      employee_code: profile.employee_code || "",
      phone: profile.phone || "",
      job_title: profile.job_title || "",
      org_unit_id: profile.org_unit_id || "",
    });
    setIsEditOpen(true);
  };

  const openRoles = (profile: any) => {
    setSelectedUser(profile);
    setIsRolesOpen(true);
  };

  // Get available roles (not already assigned)
  const availableRoles = roles?.filter(
    (role) => !userRoles?.some((ur) => ur.role?.id === role.id)
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-serif text-foreground">Gestão de Utilizadores</h1>
            <p className="text-muted-foreground mt-1">Gerir utilizadores, estados e perfis de acesso</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por nome ou email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os estados</SelectItem>
                  <SelectItem value="ACTIVE">Ativos</SelectItem>
                  <SelectItem value="INACTIVE">Inativos</SelectItem>
                </SelectContent>
              </Select>
              <Select value={orgUnitFilter} onValueChange={setOrgUnitFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Unidade Orgânica" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as unidades</SelectItem>
                  {orgUnits?.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                    <TableHead>Email</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles?.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell className="font-medium">{profile.full_name}</TableCell>
                      <TableCell>{profile.email}</TableCell>
                      <TableCell>{profile.job_title || "-"}</TableCell>
                      <TableCell>
                        {orgUnits?.find((u) => u.id === profile.org_unit_id)?.name || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={profile.status === "ACTIVE" ? "default" : "secondary"}>
                          {profile.status === "ACTIVE" ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(profile)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openRoles(profile)}>
                              <Shield className="h-4 w-4 mr-2" />
                              Gerir Perfis
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                setConfirmDialog({
                                  open: true,
                                  userId: profile.id,
                                  currentStatus: profile.status as UserStatus,
                                })
                              }
                            >
                              {profile.status === "ACTIVE" ? (
                                <>
                                  <UserX className="h-4 w-4 mr-2" />
                                  Desativar
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Ativar
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
              <DialogTitle>Editar Utilizador</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Nome Completo *</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Código de Funcionário</Label>
                  <Input
                    value={formData.employee_code}
                    onChange={(e) => setFormData({ ...formData, employee_code: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cargo</Label>
                <Input
                  value={formData.job_title}
                  onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Unidade Orgânica</Label>
                <Select
                  value={formData.org_unit_id}
                  onValueChange={(value) => setFormData({ ...formData, org_unit_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {orgUnits?.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleUpdate} className="w-full" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "A guardar..." : "Guardar Alterações"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Roles Dialog */}
        <Dialog open={isRolesOpen} onOpenChange={setIsRolesOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gerir Perfis - {selectedUser?.full_name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* Current roles */}
              <div className="space-y-2">
                <Label>Perfis Atribuídos</Label>
                <div className="flex flex-wrap gap-2">
                  {userRoles?.map((ur) => (
                    <Badge key={ur.id} variant="secondary" className="flex items-center gap-1">
                      {ur.role?.name}
                      <button
                        onClick={() => handleRemoveRole(ur.id, ur.role?.id || "", ur.role?.name || "")}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {(!userRoles || userRoles.length === 0) && (
                    <span className="text-sm text-muted-foreground">Sem perfis atribuídos</span>
                  )}
                </div>
              </div>

              {/* Assign new role */}
              <div className="space-y-2">
                <Label>Atribuir Novo Perfil</Label>
                <Select onValueChange={handleAssignRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles?.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Confirm Dialog */}
        <ConfirmDialog
          open={confirmDialog?.open || false}
          onOpenChange={(open) => !open && setConfirmDialog(null)}
          title={`Confirmar ${confirmDialog?.currentStatus === "ACTIVE" ? "desativação" : "ativação"}`}
          description={`Tem a certeza que deseja ${confirmDialog?.currentStatus === "ACTIVE" ? "desativar" : "ativar"} este utilizador?`}
          onConfirm={handleToggleStatus}
        />
      </div>
    </AppLayout>
  );
}
