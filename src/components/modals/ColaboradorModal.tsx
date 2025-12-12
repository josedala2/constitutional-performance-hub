import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { User, translateRole } from "@/types/sgad";
import { Users, Save, X, Eye, Mail, Phone } from "lucide-react";
import { useState, useEffect } from "react";

interface ColaboradorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  mode: "view" | "edit" | "create";
  onSave?: (data: Partial<User>) => void;
}

export function ColaboradorModal({ open, onOpenChange, user, mode, onSave }: ColaboradorModalProps) {
  const [formData, setFormData] = useState({
    nome: user?.nome || "",
    email: user?.email || "",
    cargo: user?.cargo || "",
    unidade_organica: user?.unidade_organica || "",
    role: user?.role || "avaliado",
    ativo: user?.ativo ?? true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome,
        email: user.email,
        cargo: user.cargo,
        unidade_organica: user.unidade_organica,
        role: user.role,
        ativo: user.ativo,
      });
    }
  }, [user]);

  const isViewMode = mode === "view";
  const title = mode === "create" ? "Novo Colaborador" : mode === "edit" ? "Editar Colaborador" : "Perfil do Colaborador";

  const handleSave = () => {
    onSave?.(formData);
    onOpenChange(false);
  };

  const initials = formData.nome.split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              {isViewMode ? <Eye className="h-5 w-5 text-primary" /> : <Users className="h-5 w-5 text-primary" />}
            </div>
            <div>
              <DialogTitle className="font-serif">{title}</DialogTitle>
              <DialogDescription>
                {isViewMode ? "Visualização dos dados do colaborador" : "Preencha os dados do colaborador"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Avatar and Name */}
          {isViewMode && (
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{formData.nome}</h3>
                <p className="text-muted-foreground">{formData.cargo}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="nome">Nome Completo</Label>
              {isViewMode ? (
                <p className="text-lg font-medium">{formData.nome}</p>
              ) : (
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome completo"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {isViewMode ? (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{formData.email}</p>
                </div>
              ) : (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@tc.ao"
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              {isViewMode ? (
                <p className="font-medium">{formData.cargo}</p>
              ) : (
                <Input
                  id="cargo"
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  placeholder="Cargo"
                />
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unidade">Unidade Orgânica</Label>
              {isViewMode ? (
                <p className="font-medium">{formData.unidade_organica}</p>
              ) : (
                <Select
                  value={formData.unidade_organica}
                  onValueChange={(v) => setFormData({ ...formData, unidade_organica: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Departamento Jurídico">Departamento Jurídico</SelectItem>
                    <SelectItem value="Gabinete de Recursos Humanos">Gabinete de Recursos Humanos</SelectItem>
                    <SelectItem value="Gabinete de Arquivo">Gabinete de Arquivo</SelectItem>
                    <SelectItem value="Gabinete de Informática">Gabinete de Informática</SelectItem>
                    <SelectItem value="Gabinete de Contabilidade">Gabinete de Contabilidade</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Perfil</Label>
              {isViewMode ? (
                <Badge variant="secondary">{translateRole(formData.role as any)}</Badge>
              ) : (
                <Select
                  value={formData.role}
                  onValueChange={(v) => setFormData({ ...formData, role: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="avaliado">Avaliado</SelectItem>
                    <SelectItem value="avaliador">Avaliador</SelectItem>
                    <SelectItem value="dirigente">Dirigente</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label>Estado</Label>
              <p className="text-sm text-muted-foreground">
                {formData.ativo ? "Colaborador activo no sistema" : "Colaborador inactivo"}
              </p>
            </div>
            {isViewMode ? (
              <Badge variant={formData.ativo ? "success" : "destructive"}>
                {formData.ativo ? "Activo" : "Inactivo"}
              </Badge>
            ) : (
              <Switch
                checked={formData.ativo}
                onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
              />
            )}
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
