import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database,
  Palette,
  Save
} from "lucide-react";

const Configuracoes = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Configurações
          </h1>
          <p className="mt-1 text-muted-foreground">
            Configurações do sistema e preferências do utilizador
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="geral" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="geral" className="gap-2">
              <Settings className="h-4 w-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="perfil" className="gap-2">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="notificacoes" className="gap-2">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="gap-2">
              <Shield className="h-4 w-4" />
              Segurança
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="geral" className="space-y-6">
            <Card className="shadow-institutional">
              <CardHeader>
                <CardTitle className="text-lg font-serif flex items-center gap-2">
                  <Database className="h-5 w-5 text-accent" />
                  Configurações do Sistema
                </CardTitle>
                <CardDescription>
                  Parâmetros gerais do sistema de avaliação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ciclo-tipo">Tipo de Ciclo Padrão</Label>
                    <Select defaultValue="semestral">
                      <SelectTrigger id="ciclo-tipo">
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="anual">Anual</SelectItem>
                        <SelectItem value="semestral">Semestral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dias-alerta">Dias para Alerta de Prazo</Label>
                    <Input id="dias-alerta" type="number" defaultValue="7" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Coeficientes de Avaliação</h4>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <Label htmlFor="coef-obj-ind">Objectivos Individuais (%)</Label>
                      <Input id="coef-obj-ind" type="number" defaultValue="40" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coef-obj-eq">Objectivos de Equipa (%)</Label>
                      <Input id="coef-obj-eq" type="number" defaultValue="20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coef-comp-trans">Competências Transversais (%)</Label>
                      <Input id="coef-comp-trans" type="number" defaultValue="20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coef-comp-tec">Competências Técnicas (%)</Label>
                      <Input id="coef-comp-tec" type="number" defaultValue="20" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="institutional">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-institutional">
              <CardHeader>
                <CardTitle className="text-lg font-serif flex items-center gap-2">
                  <Palette className="h-5 w-5 text-accent" />
                  Aparência
                </CardTitle>
                <CardDescription>
                  Personalização visual do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo Escuro</Label>
                    <p className="text-sm text-muted-foreground">
                      Activar tema escuro para o sistema
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Animações</Label>
                    <p className="text-sm text-muted-foreground">
                      Activar animações e transições
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Settings */}
          <TabsContent value="perfil" className="space-y-6">
            <Card className="shadow-institutional">
              <CardHeader>
                <CardTitle className="text-lg font-serif">Dados Pessoais</CardTitle>
                <CardDescription>
                  Informações do seu perfil de utilizador
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input id="nome" defaultValue="Dr. António Manuel Silva" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="antonio.silva@tc.ao" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cargo">Cargo</Label>
                    <Input id="cargo" defaultValue="Director de Recursos Humanos" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unidade">Unidade Orgânica</Label>
                    <Input id="unidade" defaultValue="Gabinete de Recursos Humanos" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="institutional">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notificacoes" className="space-y-6">
            <Card className="shadow-institutional">
              <CardHeader>
                <CardTitle className="text-lg font-serif">Preferências de Notificação</CardTitle>
                <CardDescription>
                  Configure como deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    { title: "Novas avaliações pendentes", desc: "Receber alerta quando houver avaliações para validar" },
                    { title: "Prazos próximos", desc: "Alertar sobre prazos de encerramento de ciclos" },
                    { title: "Objectivos actualizados", desc: "Notificar quando metas forem actualizadas" },
                    { title: "Homologações", desc: "Alertar sobre avaliações homologadas" },
                    { title: "Relatórios gerados", desc: "Notificar quando relatórios estiverem prontos" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>{item.title}</Label>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch defaultChecked={index < 3} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="seguranca" className="space-y-6">
            <Card className="shadow-institutional">
              <CardHeader>
                <CardTitle className="text-lg font-serif">Segurança da Conta</CardTitle>
                <CardDescription>
                  Gerir palavra-passe e segurança
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password-actual">Palavra-passe Actual</Label>
                    <Input id="password-actual" type="password" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="password-nova">Nova Palavra-passe</Label>
                      <Input id="password-nova" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-confirmar">Confirmar Palavra-passe</Label>
                      <Input id="password-confirmar" type="password" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="institutional">
                    <Save className="h-4 w-4 mr-2" />
                    Alterar Palavra-passe
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-institutional">
              <CardHeader>
                <CardTitle className="text-lg font-serif">Sessões Activas</CardTitle>
                <CardDescription>
                  Gerir dispositivos com sessão iniciada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">Este dispositivo</p>
                      <p className="text-sm text-muted-foreground">
                        Chrome em Windows • Luanda, Angola • Agora
                      </p>
                    </div>
                    <span className="text-sm text-success">Activa</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Configuracoes;
