import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Users, Eye, ClipboardCheck, Edit, Trash2 } from "lucide-react";
import { mockUsers } from "@/data/mockData";
import { User, translateRole } from "@/types/sgad";
import { ColaboradorModal } from "@/components/modals/ColaboradorModal";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { toast } from "sonner";

const Colaboradores = () => {
  const [users, setUsers] = useState(mockUsers);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view");

  const colaboradores = users.filter(
    (u) => u.role === "avaliado" || u.role === "avaliador"
  );

  const handleView = (user: User) => {
    setSelectedUser(user);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      toast.success("Colaborador eliminado com sucesso");
    }
    setDeleteDialogOpen(false);
  };

  const handleSave = (data: Partial<User>) => {
    if (modalMode === "create") {
      const newUser: User = {
        id: `user-${Date.now()}`,
        nome: data.nome || "",
        email: data.email || "",
        role: data.role || "avaliado",
        cargo: data.cargo || "",
        carreira: "Técnico",
        unidade_organica: data.unidade_organica || "",
        ativo: data.ativo ?? true,
      };
      setUsers([newUser, ...users]);
      toast.success("Colaborador criado com sucesso");
    } else if (modalMode === "edit" && selectedUser) {
      setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, ...data } : u)));
      toast.success("Colaborador actualizado com sucesso");
    }
  };

  // Stats
  const totalAtivos = colaboradores.filter((c) => c.ativo).length;
  const avaliadores = colaboradores.filter((c) => c.role === "avaliador").length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Colaboradores
            </h1>
            <p className="mt-1 text-muted-foreground">
              Gestão dos colaboradores e suas avaliações
            </p>
          </div>
          <Button variant="institutional" size="lg" onClick={handleCreate}>
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Colaborador
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalAtivos}</p>
                <p className="text-sm text-muted-foreground">Total Activos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-lg bg-success/10 p-3">
                <ClipboardCheck className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">33</p>
                <p className="text-sm text-muted-foreground">Avaliados</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-lg bg-warning/10 p-3">
                <ClipboardCheck className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-lg bg-accent/10 p-3">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avaliadores}</p>
                <p className="text-sm text-muted-foreground">Avaliadores</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Pesquisar colaboradores..." className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Unidade Orgânica" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as unidades</SelectItem>
                  <SelectItem value="juridico">Departamento Jurídico</SelectItem>
                  <SelectItem value="rh">Gabinete de Recursos Humanos</SelectItem>
                  <SelectItem value="arquivo">Gabinete de Arquivo</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="avaliador">Avaliador</SelectItem>
                  <SelectItem value="avaliado">Avaliado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="shadow-institutional">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              Lista de Colaboradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Unidade Orgânica</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {colaboradores.map((user) => (
                  <TableRow key={user.id} className="hover:bg-secondary/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.nome}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.cargo}</TableCell>
                    <TableCell>{user.unidade_organica}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{translateRole(user.role)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.ativo ? "success" : "destructive"}>
                        {user.ativo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" title="Ver perfil" onClick={() => handleView(user)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Editar" onClick={() => handleEdit(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Eliminar" onClick={() => handleDelete(user)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <ColaboradorModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        user={selectedUser}
        mode={modalMode}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar Colaborador"
        description={`Tem a certeza que deseja eliminar o colaborador ${selectedUser?.nome}? Esta acção não pode ser revertida.`}
        confirmText="Eliminar"
        variant="danger"
        onConfirm={confirmDelete}
      />
    </AppLayout>
  );
};

export default Colaboradores;
