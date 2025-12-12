import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EvaluationCycle, getStatusVariant, translateStatus } from "@/types/sgad";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Calendar, Save, X, Eye } from "lucide-react";
import { useState, useEffect } from "react";

interface CicloModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cycle?: EvaluationCycle | null;
  mode: "view" | "edit" | "create";
  onSave?: (data: Partial<EvaluationCycle>) => void;
}

export function CicloModal({ open, onOpenChange, cycle, mode, onSave }: CicloModalProps) {
  const [formData, setFormData] = useState({
    ano: cycle?.ano || new Date().getFullYear(),
    semestre: cycle?.semestre || 1,
    tipo: cycle?.tipo || "semestral",
    estado: cycle?.estado || "aberto",
    data_inicio: cycle?.data_inicio || "",
    data_fim: cycle?.data_fim || "",
  });

  useEffect(() => {
    if (cycle) {
      setFormData({
        ano: cycle.ano,
        semestre: cycle.semestre,
        tipo: cycle.tipo,
        estado: cycle.estado,
        data_inicio: cycle.data_inicio,
        data_fim: cycle.data_fim,
      });
    }
  }, [cycle]);

  const isViewMode = mode === "view";
  const title = mode === "create" ? "Novo Ciclo de Avaliação" : mode === "edit" ? "Editar Ciclo" : "Detalhes do Ciclo";

  const handleSave = () => {
    onSave?.(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              {isViewMode ? <Eye className="h-5 w-5 text-primary" /> : <Calendar className="h-5 w-5 text-primary" />}
            </div>
            <div>
              <DialogTitle className="font-serif">{title}</DialogTitle>
              <DialogDescription>
                {isViewMode ? "Visualização dos dados do ciclo" : "Preencha os dados do ciclo de avaliação"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ano">Ano</Label>
              {isViewMode ? (
                <p className="text-lg font-medium">{formData.ano}</p>
              ) : (
                <Input
                  id="ano"
                  type="number"
                  value={formData.ano}
                  onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value) })}
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="semestre">Semestre</Label>
              {isViewMode ? (
                <p className="text-lg font-medium">{formData.semestre}º Semestre</p>
              ) : (
                <Select
                  value={String(formData.semestre)}
                  onValueChange={(v) => setFormData({ ...formData, semestre: parseInt(v) as 1 | 2 })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1º Semestre</SelectItem>
                    <SelectItem value="2">2º Semestre</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              {isViewMode ? (
                <p className="text-lg font-medium capitalize">{formData.tipo}</p>
              ) : (
                <Select
                  value={formData.tipo}
                  onValueChange={(v) => setFormData({ ...formData, tipo: v as "anual" | "semestral" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semestral">Semestral</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              {isViewMode ? (
                <Badge variant={getStatusVariant(formData.estado)}>{translateStatus(formData.estado)}</Badge>
              ) : (
                <Select
                  value={formData.estado}
                  onValueChange={(v) => setFormData({ ...formData, estado: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aberto">Aberto</SelectItem>
                    <SelectItem value="em_acompanhamento">Em Acompanhamento</SelectItem>
                    <SelectItem value="fechado">Fechado</SelectItem>
                    <SelectItem value="homologado">Homologado</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_inicio">Data de Início</Label>
              {isViewMode ? (
                <p className="text-lg font-medium">
                  {formData.data_inicio && format(new Date(formData.data_inicio), "d 'de' MMMM 'de' yyyy", { locale: pt })}
                </p>
              ) : (
                <Input
                  id="data_inicio"
                  type="date"
                  value={formData.data_inicio}
                  onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_fim">Data de Fim</Label>
              {isViewMode ? (
                <p className="text-lg font-medium">
                  {formData.data_fim && format(new Date(formData.data_fim), "d 'de' MMMM 'de' yyyy", { locale: pt })}
                </p>
              ) : (
                <Input
                  id="data_fim"
                  type="date"
                  value={formData.data_fim}
                  onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                />
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" />
            {isViewMode ? "Fechar" : "Cancelar"}
          </Button>
          {!isViewMode && (
            <Button variant="institutional" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Guardar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
