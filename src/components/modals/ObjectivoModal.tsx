import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Objective } from "@/types/sgad";
import { mockUsers } from "@/data/mockData";
import { Target, Save, X, Eye } from "lucide-react";
import { useState, useEffect } from "react";

interface ObjectivoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  objective?: Objective | null;
  mode: "view" | "edit" | "create";
  onSave?: (data: Partial<Objective>) => void;
}

export function ObjectivoModal({ open, onOpenChange, objective, mode, onSave }: ObjectivoModalProps) {
  const [formData, setFormData] = useState({
    descricao: objective?.descricao || "",
    tipo: objective?.tipo || "individual" as const,
    avaliado_id: objective?.avaliado_id || "",
    meta_planeada: objective?.meta_planeada || 0,
    meta_realizada: objective?.meta_realizada || 0,
    grau_concretizacao: objective?.grau_concretizacao || 0,
    pontuacao: objective?.pontuacao || 0,
  });

  useEffect(() => {
    if (objective) {
      setFormData({
        descricao: objective.descricao,
        tipo: objective.tipo,
        avaliado_id: objective.avaliado_id,
        meta_planeada: objective.meta_planeada,
        meta_realizada: objective.meta_realizada,
        grau_concretizacao: objective.grau_concretizacao,
        pontuacao: objective.pontuacao,
      });
    }
  }, [objective]);

  const isViewMode = mode === "view";
  const title = mode === "create" ? "Novo Objectivo" : mode === "edit" ? "Editar Objectivo" : "Detalhes do Objectivo";

  const avaliados = mockUsers.filter((u) => u.role === "avaliado");
  const selectedUser = avaliados.find((u) => u.id === formData.avaliado_id);

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
              {isViewMode ? <Eye className="h-5 w-5 text-primary" /> : <Target className="h-5 w-5 text-primary" />}
            </div>
            <div>
              <DialogTitle className="font-serif">{title}</DialogTitle>
              <DialogDescription>
                {isViewMode ? "Visualização dos dados do objectivo" : "Preencha os dados do objectivo"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição do Objectivo</Label>
            {isViewMode ? (
              <p className="text-base">{formData.descricao}</p>
            ) : (
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descreva o objectivo..."
                rows={3}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              {isViewMode ? (
                <Badge variant={formData.tipo === "individual" ? "default" : "secondary"}>
                  {formData.tipo === "individual" ? "Individual" : "Equipa"}
                </Badge>
              ) : (
                <Select
                  value={formData.tipo}
                  onValueChange={(v) => setFormData({ ...formData, tipo: v as "individual" | "equipa" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="equipa">Equipa</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="avaliado">Colaborador</Label>
              {isViewMode ? (
                <p className="font-medium">{selectedUser?.nome || "N/A"}</p>
              ) : (
                <Select
                  value={formData.avaliado_id}
                  onValueChange={(v) => setFormData({ ...formData, avaliado_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar colaborador" />
                  </SelectTrigger>
                  <SelectContent>
                    {avaliados.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meta_planeada">Meta Planeada</Label>
              {isViewMode ? (
                <p className="text-lg font-semibold">{formData.meta_planeada}</p>
              ) : (
                <Input
                  id="meta_planeada"
                  type="number"
                  value={formData.meta_planeada}
                  onChange={(e) => setFormData({ ...formData, meta_planeada: parseInt(e.target.value) || 0 })}
                  placeholder="Ex: 100"
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta_realizada">Meta Realizada</Label>
              {isViewMode ? (
                <p className="text-lg font-semibold">{formData.meta_realizada}</p>
              ) : (
                <Input
                  id="meta_realizada"
                  type="number"
                  value={formData.meta_realizada}
                  onChange={(e) => setFormData({ ...formData, meta_realizada: parseInt(e.target.value) || 0 })}
                  placeholder="Ex: 85"
                />
              )}
            </div>
          </div>

          {isViewMode && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Grau de Concretização</Label>
                  <div className="flex items-center gap-4">
                    <Progress value={formData.grau_concretizacao} className="flex-1 h-3" />
                    <span className="text-lg font-bold">{formData.grau_concretizacao.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 px-4 rounded-lg bg-secondary/50">
                  <span className="font-medium">Pontuação Final</span>
                  <span className="text-2xl font-bold text-primary">{formData.pontuacao.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
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
