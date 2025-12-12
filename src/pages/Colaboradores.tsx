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
import { Plus, Search, Users, Eye, ClipboardCheck, Mail } from "lucide-react";
import { mockUsers } from "@/data/mockData";
import { translateRole } from "@/types/sgad";

const Colaboradores = () => {
  const colaboradores = mockUsers.filter(
    (u) => u.role === "avaliado" || u.role === "avaliador"
  );

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
          <Button variant="institutional" size="lg">
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
                <p className="text-2xl font-bold">45</p>
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
                <p className="text-2xl font-bold">5</p>
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
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Ver perfil">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Enviar email">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Ver avaliação">
                          <ClipboardCheck className="h-4 w-4" />
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
    </AppLayout>
  );
};

export default Colaboradores;
