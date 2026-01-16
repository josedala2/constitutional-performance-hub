import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ValidatedInput } from "@/components/ui/validated-input";
import { User, translateRole } from "@/types/sgad";
import { colaboradorFormSchema, sanitizeString, ColaboradorFormData } from "@/lib/validation";
import { Users, Save, X, Eye, Mail } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

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
    role: user?.role || "avaliado" as const,
    ativo: user?.ativo ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      setErrors({});
    }
  }, [user]);

  const isViewMode = mode === "view";
  const title = mode === "create" ? "Novo Colaborador" : mode === "edit" ? "Editar Colaborador" : "Perfil do Colaborador";

  const validateForm = useCallback(() => {
    try {
      colaboradorFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0]?.toString();
          if (field && !newErrors[field]) {
            newErrors[field] = err.message;
          }
        });
        setErrors(newErrors);
        toast({
          title: "Erro de validação",
          description: error.errors[0]?.message || "Verifique os campos do formulário.",
          variant: "destructive",
        });
      }
      return false;
    }
  }, [formData]);

  const handleSave = () => {
    if (!validateForm()) return;
    
    // Sanitize data before saving
    const sanitizedData = {
      ...formData,
      nome: sanitizeString(formData.nome),
      cargo: sanitizeString(formData.cargo),
    };
    
    onSave?.(sanitizedData);
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
              <ValidatedInput
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  onBlur={() => {
                    if (!formData.nome.trim()) {
                      setErrors((prev) => ({ ...prev, nome: "Nome é obrigatório" }));
                    } else if (formData.nome.length < 2) {
                      setErrors((prev) => ({ ...prev, nome: "Deve ter pelo menos 2 caracteres" }));
                    } else {
                      setErrors((prev) => ({ ...prev, nome: "" }));
                    }
                  }}
                  placeholder="Nome completo"
                  error={errors.nome}
                  maxLength={100}
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
              <ValidatedInput
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase().trim() })}
                  onBlur={() => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!formData.email.trim()) {
                      setErrors((prev) => ({ ...prev, email: "Email é obrigatório" }));
                    } else if (!emailRegex.test(formData.email)) {
                      setErrors((prev) => ({ ...prev, email: "Email inválido" }));
                    } else {
                      setErrors((prev) => ({ ...prev, email: "" }));
                    }
                  }}
                  placeholder="email@tc.ao"
                  error={errors.email}
                  maxLength={255}
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              {isViewMode ? (
                <p className="font-medium">{formData.cargo}</p>
              ) : (
              <ValidatedInput
                  id="cargo"
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  onBlur={() => {
                    if (!formData.cargo.trim()) {
                      setErrors((prev) => ({ ...prev, cargo: "Cargo é obrigatório" }));
                    } else if (formData.cargo.length < 2) {
                      setErrors((prev) => ({ ...prev, cargo: "Deve ter pelo menos 2 caracteres" }));
                    } else {
                      setErrors((prev) => ({ ...prev, cargo: "" }));
                    }
                  }}
                  placeholder="Cargo"
                  error={errors.cargo}
                  maxLength={100}
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
