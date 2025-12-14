import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  Hash,
  Shield,
  Save,
  Loader2,
  Pencil,
  X
} from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  RH: "Recursos Humanos",
  AUDITOR: "Auditor",
  AVALIADOR: "Avaliador",
  AVALIADO: "Avaliado",
  PAR: "Par",
  UTENTE_INTERNO: "Utente Interno",
  UTENTE_EXTERNO: "Utente Externo",
};

const profileSchema = z.object({
  full_name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").max(100),
  phone: z.string().max(20).optional().nullable(),
  job_title: z.string().max(100).optional().nullable(),
});

export default function MeuPerfil() {
  const { profile, userRoles, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    job_title: profile?.job_title || "",
  });

  const initials = (profile?.full_name || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleEdit = () => {
    setFormData({
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
      job_title: profile?.job_title || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
      job_title: profile?.job_title || "",
    });
  };

  const handleSave = async () => {
    if (!profile?.id) return;

    try {
      const validated = profileSchema.parse(formData);
      setIsSaving(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: validated.full_name,
          phone: validated.phone || null,
          job_title: validated.job_title || null,
        })
        .eq("id", profile.id);

      if (error) throw error;

      await refreshProfile();
      setIsEditing(false);
      toast({
        title: "Perfil Atualizado",
        description: "Os seus dados foram guardados com sucesso.",
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          title: "Erro de Validação",
          description: err.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível guardar as alterações.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const orgUnitName = (profile as any)?.org_unit?.name || "Não atribuída";

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Meu Perfil</h1>
          <p className="text-muted-foreground mt-1">
            Visualize e edite as suas informações pessoais
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{profile?.full_name}</h2>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
                
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {userRoles.map((ur) => (
                    <Badge key={ur.id} variant="secondary">
                      {ROLE_LABELS[ur.role?.name || ""] || ur.role?.name}
                    </Badge>
                  ))}
                </div>

                <Separator className="my-4 w-full" />

                <div className="w-full space-y-3 text-left">
                  <div className="flex items-center gap-3 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Unidade:</span>
                    <span className="ml-auto font-medium truncate max-w-[120px]">{orgUnitName}</span>
                  </div>
                  {profile?.employee_code && (
                    <div className="flex items-center gap-3 text-sm">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Código:</span>
                      <span className="ml-auto font-medium">{profile.employee_code}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Estado:</span>
                    <Badge 
                      variant={profile?.status === "ACTIVE" ? "default" : "secondary"}
                      className="ml-auto"
                    >
                      {profile?.status === "ACTIVE" ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Card */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  {isEditing ? "Edite os seus dados abaixo" : "Os seus dados de perfil no sistema"}
                </CardDescription>
              </div>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isSaving}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Guardar
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Nome Completo
                  </Label>
                  {isEditing ? (
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="O seu nome completo"
                    />
                  ) : (
                    <p className="text-sm py-2 px-3 bg-muted/50 rounded-md">
                      {profile?.full_name || "-"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email
                  </Label>
                  <p className="text-sm py-2 px-3 bg-muted/50 rounded-md text-muted-foreground">
                    {profile?.email || "-"}
                  </p>
                  {isEditing && (
                    <p className="text-xs text-muted-foreground">
                      O email não pode ser alterado
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    Telefone
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+351 912 345 678"
                    />
                  ) : (
                    <p className="text-sm py-2 px-3 bg-muted/50 rounded-md">
                      {profile?.phone || "-"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job_title" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    Função
                  </Label>
                  {isEditing ? (
                    <Input
                      id="job_title"
                      value={formData.job_title}
                      onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                      placeholder="A sua função"
                    />
                  ) : (
                    <p className="text-sm py-2 px-3 bg-muted/50 rounded-md">
                      {profile?.job_title || "-"}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Permissões e Acessos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userRoles.map((ur) => (
                    <div key={ur.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Shield className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">
                          {ROLE_LABELS[ur.role?.name || ""] || ur.role?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {ur.scope_type === "GLOBAL" 
                            ? "Acesso global" 
                            : `Unidade: ${ur.org_unit?.name || "N/A"}`
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                  {userRoles.length === 0 && (
                    <p className="text-sm text-muted-foreground col-span-2">
                      Nenhum perfil de acesso atribuído
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
