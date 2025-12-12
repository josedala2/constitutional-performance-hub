import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { Plus, Search, Calendar, Edit, Eye, Trash2 } from "lucide-react";
import { mockCycles } from "@/data/mockData";
import { EvaluationCycle, getStatusVariant, translateStatus } from "@/types/sgad";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { CicloModal } from "@/components/modals/CicloModal";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { toast } from "sonner";

const CiclosAvaliacao = () => {
  const [cycles, setCycles] = useState(mockCycles);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<EvaluationCycle | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view");

  const handleView = (cycle: EvaluationCycle) => {
    setSelectedCycle(cycle);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleEdit = (cycle: EvaluationCycle) => {
    setSelectedCycle(cycle);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedCycle(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleDelete = (cycle: EvaluationCycle) => {
    setSelectedCycle(cycle);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCycle) {
      setCycles(cycles.filter((c) => c.id !== selectedCycle.id));
      toast.success("Ciclo eliminado com sucesso");
    }
    setDeleteDialogOpen(false);
  };

  const handleSave = (data: Partial<EvaluationCycle>) => {
    if (modalMode === "create") {
      const newCycle: EvaluationCycle = {
        id: `cycle-${Date.now()}`,
        ano: data.ano || new Date().getFullYear(),
        tipo: data.tipo || "semestral",
        semestre: data.semestre || 1,
        data_inicio: data.data_inicio || "",
        data_fim: data.data_fim || "",
        estado: data.estado || "aberto",
        created_at: new Date().toISOString(),
      };
      setCycles([newCycle, ...cycles]);
      toast.success("Ciclo criado com sucesso");
    } else if (modalMode === "edit" && selectedCycle) {
      setCycles(cycles.map((c) => (c.id === selectedCycle.id ? { ...c, ...data } : c)));
      toast.success("Ciclo actualizado com sucesso");
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Ciclos de Avaliação
            </h1>
            <p className="mt-1 text-muted-foreground">
              Gestão dos ciclos de avaliação de desempenho
            </p>
          </div>
          <Button variant="institutional" size="lg" onClick={handleCreate}>
            <Plus className="h-5 w-5 mr-2" />
            Novo Ciclo
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Pesquisar ciclos..." className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os estados</SelectItem>
                  <SelectItem value="aberto">Aberto</SelectItem>
                  <SelectItem value="em_acompanhamento">Em Acompanhamento</SelectItem>
                  <SelectItem value="fechado">Fechado</SelectItem>
                  <SelectItem value="homologado">Homologado</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Cycles Table */}
        <Card className="shadow-institutional">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              Lista de Ciclos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Período</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Data Fim</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cycles.map((cycle) => (
                  <TableRow key={cycle.id} className="hover:bg-secondary/50">
                    <TableCell className="font-medium">
                      {cycle.ano} - {cycle.semestre}º Semestre
                    </TableCell>
                    <TableCell className="capitalize">{cycle.tipo}</TableCell>
                    <TableCell>
                      {format(new Date(cycle.data_inicio), "d MMM yyyy", { locale: pt })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(cycle.data_fim), "d MMM yyyy", { locale: pt })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(cycle.estado)}>
                        {translateStatus(cycle.estado)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" title="Visualizar" onClick={() => handleView(cycle)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Editar" onClick={() => handleEdit(cycle)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Eliminar" onClick={() => handleDelete(cycle)}>
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
      <CicloModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        cycle={selectedCycle}
        mode={modalMode}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar Ciclo"
        description={`Tem a certeza que deseja eliminar o ciclo ${selectedCycle?.ano} - ${selectedCycle?.semestre}º Semestre? Esta acção não pode ser revertida.`}
        confirmText="Eliminar"
        variant="danger"
        onConfirm={confirmDelete}
      />
    </AppLayout>
  );
};

export default CiclosAvaliacao;
