import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, FileText, Clock, CheckCircle, XCircle, AlertCircle, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

export default function ReclamacoesRecursosUser() {
  const { user } = useAuth();

  const { data: minhasReclamacoes, isLoading: loadingReclamacoes } = useQuery({
    queryKey: ['minhas-reclamacoes', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('reclamacoes')
        .select(`
          *,
          ciclo:ciclos_avaliacao(ano, semestre, tipo),
          avaliador:profiles!reclamacoes_avaliador_id_fkey(full_name)
        `)
        .eq('reclamante_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: meusRecursos, isLoading: loadingRecursos } = useQuery({
    queryKey: ['meus-recursos', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('recursos')
        .select(`
          *,
          ciclo:ciclos_avaliacao(ano, semestre, tipo),
          reclamacao:reclamacoes(motivo),
          relator:profiles!recursos_membro_relator_id_fkey(full_name)
        `)
        .eq('recorrente_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
      pendente: { label: "Pendente", variant: "secondary", icon: <Clock className="h-3 w-3" /> },
      em_analise: { label: "Em Análise", variant: "default", icon: <AlertCircle className="h-3 w-3" /> },
      deferido: { label: "Deferido", variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
      indeferido: { label: "Indeferido", variant: "destructive", icon: <XCircle className="h-3 w-3" /> },
      concluido: { label: "Concluído", variant: "outline", icon: <CheckCircle className="h-3 w-3" /> },
    };
    const config = estados[estado] || { label: estado, variant: "secondary" as const, icon: null };
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
              <Scale className="h-8 w-8 text-primary" />
              Reclamações e Recursos
            </h1>
            <p className="text-muted-foreground mt-1">
              Consulte e acompanhe as suas reclamações e recursos
            </p>
          </div>
        </div>

        <Tabs defaultValue="reclamacoes" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="reclamacoes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reclamações ({minhasReclamacoes?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="recursos" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Recursos ({meusRecursos?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reclamacoes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Minhas Reclamações</CardTitle>
                <CardDescription>
                  Reclamações submetidas sobre avaliações de desempenho (Art. 32.º RADFP)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingReclamacoes ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : minhasReclamacoes && minhasReclamacoes.length > 0 ? (
                  <div className="space-y-4">
                    {minhasReclamacoes.map((reclamacao: any) => (
                      <div
                        key={reclamacao.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="font-medium">{reclamacao.motivo}</p>
                            <p className="text-sm text-muted-foreground">
                              Ciclo: {reclamacao.ciclo?.ano} - {reclamacao.ciclo?.tipo}
                              {reclamacao.ciclo?.semestre && ` (${reclamacao.ciclo.semestre}º Sem.)`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Avaliador: {reclamacao.avaliador?.full_name || "N/A"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Submetido em: {format(new Date(reclamacao.data_submissao), "dd/MM/yyyy", { locale: pt })}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {getEstadoBadge(reclamacao.estado)}
                            {reclamacao.data_limite_resposta && (
                              <span className="text-xs text-muted-foreground">
                                Prazo: {format(new Date(reclamacao.data_limite_resposta), "dd/MM/yyyy", { locale: pt })}
                              </span>
                            )}
                          </div>
                        </div>
                        {reclamacao.resposta_avaliador && (
                          <div className="mt-3 p-3 bg-muted rounded-md">
                            <p className="text-sm font-medium mb-1">Resposta do Avaliador:</p>
                            <p className="text-sm text-muted-foreground">{reclamacao.resposta_avaliador}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Não tem reclamações submetidas.</p>
                    <p className="text-sm mt-2">
                      As reclamações podem ser submetidas após a notificação da avaliação.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recursos" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Meus Recursos</CardTitle>
                <CardDescription>
                  Recursos para a Comissão de Avaliação (Art. 33.º-34.º RADFP)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingRecursos ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : meusRecursos && meusRecursos.length > 0 ? (
                  <div className="space-y-4">
                    {meusRecursos.map((recurso: any) => (
                      <div
                        key={recurso.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="font-medium">{recurso.motivo}</p>
                            <p className="text-sm text-muted-foreground">
                              Ciclo: {recurso.ciclo?.ano} - {recurso.ciclo?.tipo}
                              {recurso.ciclo?.semestre && ` (${recurso.ciclo.semestre}º Sem.)`}
                            </p>
                            {recurso.reclamacao && (
                              <p className="text-sm text-muted-foreground">
                                Reclamação: {recurso.reclamacao.motivo}
                              </p>
                            )}
                            {recurso.relator && (
                              <p className="text-sm text-muted-foreground">
                                Relator: {recurso.relator.full_name}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Submetido em: {format(new Date(recurso.data_submissao), "dd/MM/yyyy", { locale: pt })}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {getEstadoBadge(recurso.estado)}
                            {recurso.data_limite_decisao && (
                              <span className="text-xs text-muted-foreground">
                                Prazo: {format(new Date(recurso.data_limite_decisao), "dd/MM/yyyy", { locale: pt })}
                              </span>
                            )}
                          </div>
                        </div>
                        {recurso.decisao && (
                          <div className="mt-3 p-3 bg-muted rounded-md">
                            <p className="text-sm font-medium mb-1">
                              Decisão: <Badge variant={recurso.decisao === 'deferido' ? 'default' : 'destructive'}>{recurso.decisao}</Badge>
                            </p>
                            {recurso.fundamentacao_decisao && (
                              <p className="text-sm text-muted-foreground mt-2">{recurso.fundamentacao_decisao}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Scale className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Não tem recursos submetidos.</p>
                    <p className="text-sm mt-2">
                      Os recursos podem ser interpostos após decisão sobre reclamação.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
