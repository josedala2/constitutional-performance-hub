import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Competency } from "@/types/sgad";
import { Award, Save, X, Eye, Star } from "lucide-react";
import { useState, useEffect } from "react";

interface CompetenciaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  competency?: Competency | null;
  mode: "view" | "edit" | "create";
  onSave?: (data: Partial<Competency>) => void;
}

const proficiencyLevels = [
  { level: 5, label: "Muito Bom", description: "Sempre demonstra a competência" },
  { level: 4, label: "Bom", description: "Na maioria das vezes demonstra" },
  { level: 3, label: "Suficiente", description: "Em algumas situações demonstra" },
  { level: 2, label: "Insuficiente", description: "Poucas vezes demonstra" },
  { level: 1, label: "Mau", description: "Não demonstra a competência" },
];

export function CompetenciaModal({ open, onOpenChange, competency, mode, onSave }: CompetenciaModalProps) {
  const [formData, setFormData] = useState({
    nome: competency?.nome || "",
    tipo: competency?.tipo || "transversal",
    carreira: competency?.carreira || "",
    descricao: "",
  });

  useEffect(() => {
    if (competency) {
      setFormData({
        nome: competency.nome,
        tipo: competency.tipo,
        carreira: competency.carreira || "",
        descricao: "",
      });
    }
  }, [competency]);

  const isViewMode = mode === "view";
  const title = mode === "create" ? "Nova Competência" : mode === "edit" ? "Editar Competência" : "Detalhes da Competência";

  const handleSave = () => {
    onSave?.(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              {isViewMode ? <Eye className="h-5 w-5 text-accent" /> : <Award className="h-5 w-5 text-accent" />}
            </div>
            <div>
              <DialogTitle className="font-serif">{title}</DialogTitle>
              <DialogDescription>
                {isViewMode ? "Visualização dos dados da competência" : "Preencha os dados da competência"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Competência</Label>
            {isViewMode ? (
              <p className="text-lg font-semibold">{formData.nome}</p>
            ) : (
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome da competência"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              {isViewMode ? (
                <Badge variant={formData.tipo === "transversal" ? "secondary" : "default"}>
                  {formData.tipo === "transversal" ? "Transversal" : "Técnica"}
                </Badge>
              ) : (
                <Select
                  value={formData.tipo}
                  onValueChange={(v) => setFormData({ ...formData, tipo: v as "transversal" | "tecnica" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transversal">Transversal</SelectItem>
                    <SelectItem value="tecnica">Técnica</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="carreira">Carreira Aplicável</Label>
              {isViewMode ? (
                <p className="font-medium">{formData.carreira || "Todas as carreiras"}</p>
              ) : (
                <Select
                  value={formData.carreira}
                  onValueChange={(v) => setFormData({ ...formData, carreira: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as carreiras" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as carreiras</SelectItem>
                    <SelectItem value="Técnico Superior">Técnico Superior</SelectItem>
                    <SelectItem value="Técnico Profissional">Técnico Profissional</SelectItem>
                    <SelectItem value="Administrativo">Administrativo</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {!isViewMode && (
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição (Opcional)</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descrição detalhada da competência..."
                rows={3}
              />
            </div>
          )}

          {isViewMode && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label>Níveis de Proficiência</Label>
                <div className="space-y-2">
                  {proficiencyLevels.map((level) => (
                    <div
                      key={level.level}
                      className="flex items-center gap-3 p-2 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-1">
                        {[...Array(level.level)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                        ))}
                        {[...Array(5 - level.level)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-muted" />
                        ))}
                      </div>
                      <span className="font-medium text-sm">{level.label}</span>
                      <span className="text-xs text-muted-foreground">- {level.description}</span>
                    </div>
                  ))}
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
