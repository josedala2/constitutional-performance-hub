import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { ChevronDown, Users } from "lucide-react";
import tribunalLogo from "@/assets/tribunal-logo.png";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A password deve ter pelo menos 6 caracteres"),
});

const signupSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A password deve ter pelo menos 6 caracteres"),
  fullName: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
});

const TEST_USERS = [
  { email: "admin@tribunal.ao", password: "Admin123!", role: "ADMIN", label: "Administrador" },
  { email: "rh@tribunal.ao", password: "RH123456!", role: "RH", label: "Recursos Humanos" },
  { email: "auditor@tribunal.ao", password: "Auditor123!", role: "AUDITOR", label: "Auditor" },
  { email: "avaliador@tribunal.ao", password: "Avaliador123!", role: "AVALIADOR", label: "Avaliador" },
  { email: "avaliado@tribunal.ao", password: "Avaliado123!", role: "AVALIADO", label: "Avaliado" },
  { email: "par@tribunal.ao", password: "Par12345!", role: "PAR", label: "Par" },
  { email: "utente.interno@tribunal.ao", password: "Interno123!", role: "UTENTE_INTERNO", label: "Utente Interno" },
  { email: "utente.externo@tribunal.ao", password: "Externo123!", role: "UTENTE_EXTERNO", label: "Utente Externo" },
];

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-chart-1/20 text-chart-1 border-chart-1/30 hover:bg-chart-1/30",
  RH: "bg-chart-2/20 text-chart-2 border-chart-2/30 hover:bg-chart-2/30",
  AUDITOR: "bg-chart-3/20 text-chart-3 border-chart-3/30 hover:bg-chart-3/30",
  AVALIADOR: "bg-chart-4/20 text-chart-4 border-chart-4/30 hover:bg-chart-4/30",
  AVALIADO: "bg-chart-5/20 text-chart-5 border-chart-5/30 hover:bg-chart-5/30",
  PAR: "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30",
  UTENTE_INTERNO: "bg-secondary text-secondary-foreground border-border hover:bg-secondary/80",
  UTENTE_EXTERNO: "bg-muted text-foreground border-border hover:bg-muted/80",
};

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ email: "", password: "", fullName: "" });
  const [showTestUsers, setShowTestUsers] = useState(false);

  // Obter a rota pretendida (se existir)
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate(from, { replace: true });
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate(from, { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, from]);

  const handleQuickFill = (email: string, password: string) => {
    setLoginData({ email, password });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validated = loginSchema.parse(loginData);
      const { error } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({ title: "Erro", description: "Credenciais inválidas", variant: "destructive" });
        } else {
          toast({ title: "Erro", description: error.message, variant: "destructive" });
        }
      } else {
        toast({ title: "Sucesso", description: "Login efetuado com sucesso" });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({ title: "Erro de validação", description: err.errors[0].message, variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validated = signupSchema.parse(signupData);
      const { error } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: validated.fullName,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({ title: "Erro", description: "Este email já está registado", variant: "destructive" });
        } else {
          toast({ title: "Erro", description: error.message, variant: "destructive" });
        }
      } else {
        toast({ title: "Sucesso", description: "Conta criada com sucesso. Verifique o seu email." });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({ title: "Erro de validação", description: err.errors[0].message, variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img src={tribunalLogo} alt="Tribunal de Contas" className="h-16 mx-auto mb-4" />
          <CardTitle className="text-2xl font-serif">SGAD</CardTitle>
          <CardDescription>Sistema de Gestão de Avaliação de Desempenho</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Registar</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "A entrar..." : "Entrar"}
                </Button>
              </form>

              {/* Quick fill test users */}
              <Collapsible open={showTestUsers} onOpenChange={setShowTestUsers} className="mt-4">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between text-muted-foreground text-sm">
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Utilizadores de Teste
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showTestUsers ? "rotate-180" : ""}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    {TEST_USERS.map((user) => (
                      <Button
                        key={user.email}
                        type="button"
                        variant="outline"
                        size="sm"
                        className={`text-xs justify-start ${ROLE_COLORS[user.role]}`}
                        onClick={() => handleQuickFill(user.email, user.password)}
                      >
                        {user.label}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Clique para preencher as credenciais automaticamente
                  </p>
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nome Completo</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    placeholder="Nome completo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "A registar..." : "Criar Conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
