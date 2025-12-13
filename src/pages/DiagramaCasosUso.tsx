import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Users, Building2, UserCheck, FileText, ArrowRight } from "lucide-react";

interface Actor {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface UseCase {
  id: string;
  title: string;
  description?: string;
  includes?: string[];
}

interface Connection {
  actorId: string;
  useCaseIds: string[];
}

const actors: Actor[] = [
  { id: "avaliador", name: "Avaliador", description: "Superior hierárquico", icon: <UserCheck className="w-6 h-6" />, color: "bg-primary" },
  { id: "avaliado", name: "Avaliado", description: "Pessoal técnico/não técnico", icon: <User className="w-6 h-6" />, color: "bg-secondary" },
  { id: "pares", name: "Colega Avaliador", description: "Avaliação entre pares", icon: <Users className="w-6 h-6" />, color: "bg-accent" },
  { id: "utenteInterno", name: "Utente Interno", description: "Colaborador interno", icon: <Building2 className="w-6 h-6" />, color: "bg-muted" },
  { id: "utenteExterno", name: "Utente Externo", description: "Cidadão/Entidade externa", icon: <User className="w-6 h-6" />, color: "bg-muted" },
  { id: "rh", name: "RH / Administração", description: "Recursos Humanos", icon: <FileText className="w-6 h-6" />, color: "bg-primary/80" },
];

const useCases: UseCase[] = [
  { id: "UC_Dados", title: "Registar dados do Avaliado", description: "Órgão/serviço, categoria, etc." },
  { id: "UC_Obj", title: "Definir objetivos", description: "Individuais e de equipa" },
  { id: "UC_Metas", title: "Registar metas quantitativas", description: "Planeado vs realizado" },
  { id: "UC_Comp", title: "Avaliar competências", description: "Transversais e técnicas" },
  { id: "UC_Ficha", title: "Preencher Ficha de Avaliação", description: "Pessoal técnico/não técnico", includes: ["UC_Obj", "UC_Metas", "UC_Comp", "UC_NAF", "UC_Qualit"] },
  { id: "UC_NAF", title: "Calcular Nota Final (NAF)", description: "Cálculo automático" },
  { id: "UC_Qualit", title: "Classificar avaliação qualitativa", description: "Muito bom, bom, suficiente, insuficiente" },
  { id: "UC_Pares", title: "Solicitar/Registar Avaliação entre Pares", description: "Avaliação colaborativa" },
  { id: "UC_UInt", title: "Solicitar/Registar Avaliação Utentes Internos", description: "Feedback interno" },
  { id: "UC_UExt", title: "Solicitar/Registar Avaliação Utentes Externos", description: "Feedback externo" },
  { id: "UC_RSup", title: "Emitir Relatório do Superior para Inferior", description: "Relatório hierárquico" },
  { id: "UC_RPares", title: "Emitir Relatório entre Pares", description: "Relatório de pares" },
  { id: "UC_RUInt", title: "Emitir Relatório Utentes Internos", description: "Relatório interno" },
  { id: "UC_RUExt", title: "Emitir Relatório Utentes Externos", description: "Relatório externo" },
  { id: "UC_Acomp", title: "Preencher Ficha de Acompanhamento", description: "Acompanhamento à avaliação" },
  { id: "UC_Assinar", title: "Assinar/Validar avaliação", description: "Validação formal" },
  { id: "UC_Consultar", title: "Consultar resultados", description: "Visualização de resultados" },
  { id: "UC_Arquivar", title: "Arquivar / Exportar processo", description: "Gestão documental" },
];

const connections: Connection[] = [
  { actorId: "avaliador", useCaseIds: ["UC_Dados", "UC_Obj", "UC_Metas", "UC_Comp", "UC_Ficha", "UC_Pares", "UC_UInt", "UC_UExt", "UC_RSup", "UC_Acomp", "UC_Assinar", "UC_Consultar"] },
  { actorId: "avaliado", useCaseIds: ["UC_Dados", "UC_Assinar", "UC_Consultar"] },
  { actorId: "pares", useCaseIds: ["UC_Pares", "UC_RPares"] },
  { actorId: "utenteInterno", useCaseIds: ["UC_UInt", "UC_RUInt"] },
  { actorId: "utenteExterno", useCaseIds: ["UC_UExt", "UC_RUExt"] },
  { actorId: "rh", useCaseIds: ["UC_Arquivar", "UC_Consultar"] },
];

const DiagramaCasosUso = () => {
  const getActorUseCases = (actorId: string) => {
    const connection = connections.find(c => c.actorId === actorId);
    return connection ? connection.useCaseIds : [];
  };

  const getUseCaseById = (id: string) => useCases.find(uc => uc.id === id);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-heading font-semibold text-foreground">
            Diagrama de Casos de Uso
          </h1>
          <p className="text-muted-foreground">
            Sistema de Avaliação de Desempenho - Visão geral das funcionalidades e atores
          </p>
        </div>

        {/* Actors Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Atores do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {actors.map((actor) => (
                <div 
                  key={actor.id} 
                  className="flex flex-col items-center p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-full ${actor.color} text-primary-foreground flex items-center justify-center mb-2`}>
                    {actor.icon}
                  </div>
                  <span className="font-medium text-sm text-center">{actor.name}</span>
                  <span className="text-xs text-muted-foreground text-center">{actor.description}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Use Cases by Actor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {actors.map((actor) => {
            const actorUseCases = getActorUseCases(actor.id);
            return (
              <Card key={actor.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${actor.color} text-primary-foreground flex items-center justify-center`}>
                      {actor.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base">{actor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{actor.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {actorUseCases.map((ucId) => {
                      const useCase = getUseCaseById(ucId);
                      if (!useCase) return null;
                      return (
                        <div 
                          key={ucId} 
                          className="p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{useCase.title}</p>
                              {useCase.description && (
                                <p className="text-xs text-muted-foreground mt-1">{useCase.description}</p>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {ucId}
                            </Badge>
                          </div>
                          {useCase.includes && useCase.includes.length > 0 && (
                            <div className="mt-2 pt-2 border-t">
                              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                <ArrowRight className="w-3 h-3" />
                                Inclui:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {useCase.includes.map((incId) => (
                                  <Badge key={incId} variant="secondary" className="text-xs">
                                    {getUseCaseById(incId)?.title.split(" ").slice(0, 2).join(" ")}...
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Full Use Cases List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Todos os Casos de Uso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {useCases.map((useCase) => (
                <div 
                  key={useCase.id} 
                  className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {useCase.id}
                    </Badge>
                  </div>
                  <p className="font-medium text-sm">{useCase.title}</p>
                  {useCase.description && (
                    <p className="text-xs text-muted-foreground mt-1">{useCase.description}</p>
                  )}
                  {useCase.includes && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        «include» {useCase.includes.length} casos de uso
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Legenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-sm">Ator Principal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg border-2 border-border bg-card flex items-center justify-center">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm">Caso de Uso</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">«include» - Inclusão</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">UC_XX</Badge>
                <span className="text-sm">Identificador</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default DiagramaCasosUso;
