import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Users, Building2, UserCheck, FileText, ArrowRight, Workflow } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Actor {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  position: { x: number; y: number };
}

interface UseCase {
  id: string;
  title: string;
  shortTitle: string;
  includes?: string[];
  position: { x: number; y: number };
  category: "dados" | "avaliacao" | "relatorios" | "gestao";
}

interface Connection {
  actorId: string;
  useCaseIds: string[];
}

const actors: Actor[] = [
  { id: "avaliador", name: "Avaliador", description: "Superior hierárquico", icon: <UserCheck className="w-5 h-5" />, color: "bg-primary", position: { x: 50, y: 200 } },
  { id: "avaliado", name: "Avaliado", description: "Pessoal técnico", icon: <User className="w-5 h-5" />, color: "bg-secondary", position: { x: 50, y: 350 } },
  { id: "pares", name: "Pares", description: "Avaliação entre pares", icon: <Users className="w-5 h-5" />, color: "bg-accent", position: { x: 50, y: 500 } },
  { id: "utenteInterno", name: "Utente Int.", description: "Colaborador interno", icon: <Building2 className="w-5 h-5" />, color: "bg-muted", position: { x: 50, y: 650 } },
  { id: "utenteExterno", name: "Utente Ext.", description: "Cidadão externo", icon: <User className="w-5 h-5" />, color: "bg-muted", position: { x: 50, y: 800 } },
  { id: "rh", name: "RH", description: "Recursos Humanos", icon: <FileText className="w-5 h-5" />, color: "bg-primary/80", position: { x: 50, y: 950 } },
];

const useCases: UseCase[] = [
  // Dados & Objetivos
  { id: "UC_Dados", title: "Registar dados do Avaliado", shortTitle: "Dados Avaliado", position: { x: 280, y: 100 }, category: "dados" },
  { id: "UC_Obj", title: "Definir objetivos", shortTitle: "Objetivos", position: { x: 280, y: 180 }, category: "dados" },
  { id: "UC_Metas", title: "Registar metas quantitativas", shortTitle: "Metas", position: { x: 280, y: 260 }, category: "dados" },
  { id: "UC_Comp", title: "Avaliar competências", shortTitle: "Competências", position: { x: 280, y: 340 }, category: "dados" },
  
  // Avaliações
  { id: "UC_Ficha", title: "Preencher Ficha de Avaliação", shortTitle: "Ficha Avaliação", position: { x: 520, y: 180 }, category: "avaliacao", includes: ["UC_Obj", "UC_Metas", "UC_Comp", "UC_NAF", "UC_Qualit"] },
  { id: "UC_NAF", title: "Calcular NAF", shortTitle: "Calcular NAF", position: { x: 520, y: 260 }, category: "avaliacao" },
  { id: "UC_Qualit", title: "Classificar avaliação", shortTitle: "Classificação", position: { x: 520, y: 340 }, category: "avaliacao" },
  { id: "UC_Pares", title: "Avaliação entre Pares", shortTitle: "Entre Pares", position: { x: 520, y: 420 }, category: "avaliacao" },
  { id: "UC_UInt", title: "Avaliação Utentes Internos", shortTitle: "Utentes Int.", position: { x: 520, y: 500 }, category: "avaliacao" },
  { id: "UC_UExt", title: "Avaliação Utentes Externos", shortTitle: "Utentes Ext.", position: { x: 520, y: 580 }, category: "avaliacao" },
  
  // Relatórios
  { id: "UC_RSup", title: "Relatório Superior-Subordinado", shortTitle: "Rel. Superior", position: { x: 760, y: 180 }, category: "relatorios" },
  { id: "UC_RPares", title: "Relatório entre Pares", shortTitle: "Rel. Pares", position: { x: 760, y: 260 }, category: "relatorios" },
  { id: "UC_RUInt", title: "Relatório Utentes Internos", shortTitle: "Rel. Ut. Int.", position: { x: 760, y: 340 }, category: "relatorios" },
  { id: "UC_RUExt", title: "Relatório Utentes Externos", shortTitle: "Rel. Ut. Ext.", position: { x: 760, y: 420 }, category: "relatorios" },
  
  // Gestão
  { id: "UC_Acomp", title: "Ficha de Acompanhamento", shortTitle: "Acompanhamento", position: { x: 760, y: 540 }, category: "gestao" },
  { id: "UC_Assinar", title: "Assinar/Validar", shortTitle: "Validar", position: { x: 760, y: 620 }, category: "gestao" },
  { id: "UC_Consultar", title: "Consultar resultados", shortTitle: "Consultar", position: { x: 760, y: 700 }, category: "gestao" },
  { id: "UC_Arquivar", title: "Arquivar processo", shortTitle: "Arquivar", position: { x: 760, y: 780 }, category: "gestao" },
];

const connections: Connection[] = [
  { actorId: "avaliador", useCaseIds: ["UC_Dados", "UC_Obj", "UC_Metas", "UC_Comp", "UC_Ficha", "UC_Pares", "UC_UInt", "UC_UExt", "UC_RSup", "UC_Acomp", "UC_Assinar", "UC_Consultar"] },
  { actorId: "avaliado", useCaseIds: ["UC_Dados", "UC_Assinar", "UC_Consultar"] },
  { actorId: "pares", useCaseIds: ["UC_Pares", "UC_RPares"] },
  { actorId: "utenteInterno", useCaseIds: ["UC_UInt", "UC_RUInt"] },
  { actorId: "utenteExterno", useCaseIds: ["UC_UExt", "UC_RUExt"] },
  { actorId: "rh", useCaseIds: ["UC_Arquivar", "UC_Consultar"] },
];

const categoryColors = {
  dados: "border-blue-500 bg-blue-50 dark:bg-blue-950/30",
  avaliacao: "border-amber-500 bg-amber-50 dark:bg-amber-950/30",
  relatorios: "border-green-500 bg-green-50 dark:bg-green-950/30",
  gestao: "border-purple-500 bg-purple-50 dark:bg-purple-950/30",
};

const categoryLabels = {
  dados: "Dados & Objetivos",
  avaliacao: "Avaliações",
  relatorios: "Relatórios",
  gestao: "Gestão",
};

const DiagramaCasosUso = () => {
  const [selectedActor, setSelectedActor] = useState<string | null>(null);
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null);

  const getActorConnections = (actorId: string) => {
    const connection = connections.find(c => c.actorId === actorId);
    return connection ? connection.useCaseIds : [];
  };

  const isUseCaseConnected = (useCaseId: string) => {
    if (!selectedActor) return false;
    return getActorConnections(selectedActor).includes(useCaseId);
  };

  const isActorConnected = (actorId: string) => {
    if (!selectedUseCase) return false;
    const connection = connections.find(c => c.actorId === actorId);
    return connection ? connection.useCaseIds.includes(selectedUseCase) : false;
  };

  const getUseCaseById = (id: string) => useCases.find(uc => uc.id === id);

  const handleActorClick = (actorId: string) => {
    setSelectedUseCase(null);
    setSelectedActor(selectedActor === actorId ? null : actorId);
  };

  const handleUseCaseClick = (useCaseId: string) => {
    setSelectedActor(null);
    setSelectedUseCase(selectedUseCase === useCaseId ? null : useCaseId);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Workflow className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-heading font-semibold text-foreground">
              Diagrama de Casos de Uso
            </h1>
          </div>
          <p className="text-muted-foreground">
            Sistema de Avaliação de Desempenho - Clique num ator ou caso de uso para ver as conexões
          </p>
        </div>

        {/* Workflow Diagram */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              Fluxo do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative overflow-x-auto">
              <svg 
                viewBox="0 0 1000 1050" 
                className="w-full min-w-[900px] h-auto"
                style={{ minHeight: "600px" }}
              >
                {/* Background */}
                <rect width="100%" height="100%" fill="hsl(var(--background))" />
                
                {/* Category Labels */}
                <text x="280" y="60" className="fill-muted-foreground text-xs font-medium">DADOS & OBJETIVOS</text>
                <text x="520" y="60" className="fill-muted-foreground text-xs font-medium">AVALIAÇÕES</text>
                <text x="760" y="60" className="fill-muted-foreground text-xs font-medium">RELATÓRIOS & GESTÃO</text>
                
                {/* Column Separators */}
                <line x1="220" y1="70" x2="220" y2="1000" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="4" />
                <line x1="460" y1="70" x2="460" y2="1000" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="4" />
                <line x1="700" y1="70" x2="700" y2="1000" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="4" />
                
                {/* Actor Label */}
                <text x="50" y="60" className="fill-muted-foreground text-xs font-medium">ATORES</text>
                
                {/* Connection Lines */}
                {connections.map((conn) => {
                  const actor = actors.find(a => a.id === conn.actorId);
                  if (!actor) return null;
                  
                  return conn.useCaseIds.map((ucId) => {
                    const useCase = getUseCaseById(ucId);
                    if (!useCase) return null;
                    
                    const isHighlighted = 
                      (selectedActor === conn.actorId) || 
                      (selectedUseCase === ucId);
                    
                    const isConnectedToSelection = 
                      (selectedActor && conn.actorId === selectedActor && conn.useCaseIds.includes(ucId)) ||
                      (selectedUseCase === ucId && conn.useCaseIds.includes(ucId));
                    
                    const startX = actor.position.x + 80;
                    const startY = actor.position.y + 25;
                    const endX = useCase.position.x;
                    const endY = useCase.position.y + 20;
                    
                    const midX = (startX + endX) / 2;
                    
                    return (
                      <path
                        key={`${conn.actorId}-${ucId}`}
                        d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                        fill="none"
                        stroke={isHighlighted ? "hsl(var(--primary))" : "hsl(var(--border))"}
                        strokeWidth={isHighlighted ? 2 : 1}
                        opacity={selectedActor || selectedUseCase ? (isHighlighted ? 1 : 0.15) : 0.4}
                        className="transition-all duration-300"
                      />
                    );
                  });
                })}
                
                {/* Include Connections */}
                {useCases.filter(uc => uc.includes).map((useCase) => {
                  return useCase.includes?.map((incId) => {
                    const includedUC = getUseCaseById(incId);
                    if (!includedUC) return null;
                    
                    const startX = useCase.position.x;
                    const startY = useCase.position.y + 20;
                    const endX = includedUC.position.x + 160;
                    const endY = includedUC.position.y + 20;
                    
                    return (
                      <g key={`include-${useCase.id}-${incId}`}>
                        <line
                          x1={startX}
                          y1={startY}
                          x2={endX}
                          y2={endY}
                          stroke="hsl(var(--muted-foreground))"
                          strokeWidth="1"
                          strokeDasharray="6 3"
                          opacity={0.5}
                        />
                        <text
                          x={(startX + endX) / 2}
                          y={(startY + endY) / 2 - 5}
                          className="fill-muted-foreground"
                          fontSize="8"
                          textAnchor="middle"
                        >
                          «include»
                        </text>
                      </g>
                    );
                  });
                })}
                
                {/* Actors */}
                {actors.map((actor) => {
                  const isSelected = selectedActor === actor.id;
                  const isConnected = isActorConnected(actor.id);
                  const shouldHighlight = isSelected || isConnected;
                  const shouldDim = (selectedActor || selectedUseCase) && !shouldHighlight;
                  
                  return (
                    <g 
                      key={actor.id}
                      onClick={() => handleActorClick(actor.id)}
                      className="cursor-pointer transition-all duration-300"
                      opacity={shouldDim ? 0.3 : 1}
                    >
                      {/* Actor Circle */}
                      <circle
                        cx={actor.position.x + 40}
                        cy={actor.position.y + 25}
                        r="30"
                        fill={isSelected ? "hsl(var(--primary))" : "hsl(var(--card))"}
                        stroke={isSelected ? "hsl(var(--primary))" : "hsl(var(--border))"}
                        strokeWidth={isSelected ? 3 : 2}
                        className="transition-all duration-200"
                      />
                      {/* Actor Icon Placeholder */}
                      <circle
                        cx={actor.position.x + 40}
                        cy={actor.position.y + 18}
                        r="8"
                        fill={isSelected ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"}
                      />
                      <rect
                        x={actor.position.x + 30}
                        y={actor.position.y + 28}
                        width="20"
                        height="12"
                        rx="3"
                        fill={isSelected ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"}
                      />
                      {/* Actor Name */}
                      <text
                        x={actor.position.x + 40}
                        y={actor.position.y + 70}
                        textAnchor="middle"
                        className={cn(
                          "text-xs font-medium",
                          isSelected ? "fill-primary" : "fill-foreground"
                        )}
                      >
                        {actor.name}
                      </text>
                      <text
                        x={actor.position.x + 40}
                        y={actor.position.y + 82}
                        textAnchor="middle"
                        className="fill-muted-foreground text-[9px]"
                      >
                        {actor.description}
                      </text>
                    </g>
                  );
                })}
                
                {/* Use Cases */}
                {useCases.map((useCase) => {
                  const isSelected = selectedUseCase === useCase.id;
                  const isConnected = isUseCaseConnected(useCase.id);
                  const shouldHighlight = isSelected || isConnected;
                  const shouldDim = (selectedActor || selectedUseCase) && !shouldHighlight;
                  
                  const categoryColor = useCase.category === "dados" ? "#3b82f6" :
                                        useCase.category === "avaliacao" ? "#f59e0b" :
                                        useCase.category === "relatorios" ? "#22c55e" : "#a855f7";
                  
                  return (
                    <g 
                      key={useCase.id}
                      onClick={() => handleUseCaseClick(useCase.id)}
                      className="cursor-pointer transition-all duration-300"
                      opacity={shouldDim ? 0.3 : 1}
                    >
                      {/* Use Case Ellipse */}
                      <ellipse
                        cx={useCase.position.x + 80}
                        cy={useCase.position.y + 20}
                        rx="75"
                        ry="25"
                        fill={isSelected ? categoryColor : "hsl(var(--card))"}
                        stroke={categoryColor}
                        strokeWidth={isSelected || isConnected ? 3 : 2}
                        className="transition-all duration-200"
                      />
                      {/* Use Case Title */}
                      <text
                        x={useCase.position.x + 80}
                        y={useCase.position.y + 24}
                        textAnchor="middle"
                        className={cn(
                          "text-[10px] font-medium",
                          isSelected ? "fill-white" : "fill-foreground"
                        )}
                      >
                        {useCase.shortTitle}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Legend & Selected Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Legend */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Legenda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-sm">Ator</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-6 rounded-full border-2 border-muted-foreground bg-card" />
                  <span className="text-sm">Caso de Uso</span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-2">Categorias:</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(categoryLabels).map(([key, label]) => {
                    const color = key === "dados" ? "bg-blue-500" :
                                  key === "avaliacao" ? "bg-amber-500" :
                                  key === "relatorios" ? "bg-green-500" : "bg-purple-500";
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full", color)} />
                        <span className="text-xs">{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="pt-2 border-t flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Linha tracejada = «include»</span>
              </div>
            </CardContent>
          </Card>

          {/* Selected Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {selectedActor ? "Ator Selecionado" : selectedUseCase ? "Caso de Uso Selecionado" : "Detalhes"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedActor ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      {actors.find(a => a.id === selectedActor)?.icon}
                    </div>
                    <div>
                      <p className="font-medium">{actors.find(a => a.id === selectedActor)?.name}</p>
                      <p className="text-sm text-muted-foreground">{actors.find(a => a.id === selectedActor)?.description}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium mb-2">Casos de Uso:</p>
                    <div className="flex flex-wrap gap-1">
                      {getActorConnections(selectedActor).map((ucId) => {
                        const uc = getUseCaseById(ucId);
                        return (
                          <Badge key={ucId} variant="outline" className="text-xs">
                            {uc?.shortTitle}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : selectedUseCase ? (
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">{getUseCaseById(selectedUseCase)?.title}</p>
                    <Badge variant="outline" className="text-xs mt-1">{selectedUseCase}</Badge>
                  </div>
                  {getUseCaseById(selectedUseCase)?.includes && (
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium mb-2">Inclui:</p>
                      <div className="flex flex-wrap gap-1">
                        {getUseCaseById(selectedUseCase)?.includes?.map((incId) => (
                          <Badge key={incId} variant="secondary" className="text-xs">
                            {getUseCaseById(incId)?.shortTitle}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium mb-2">Atores:</p>
                    <div className="flex flex-wrap gap-1">
                      {connections
                        .filter(c => c.useCaseIds.includes(selectedUseCase))
                        .map((c) => {
                          const actor = actors.find(a => a.id === c.actorId);
                          return (
                            <Badge key={c.actorId} variant="outline" className="text-xs">
                              {actor?.name}
                            </Badge>
                          );
                        })}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Clique num ator ou caso de uso no diagrama para ver os detalhes e conexões.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default DiagramaCasosUso;
