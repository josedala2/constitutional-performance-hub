import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, differenceInDays, isPast } from "date-fns";
import { pt } from "date-fns/locale";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Gavel,
  MessageSquare,
  Scale,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  useReclamacoes,
  useRecursos,
  useRespondReclamacao,
  useUpdateRecurso,
  useReclamacoesRecursosStats,
  type Reclamacao,
  type Recurso,
} from "@/hooks/useReclamacoesRecursos";
import { useMembrosComissao } from "@/hooks/useComissaoAvaliacao";

// Fetch ciclos
function useCiclos() {
  return useQuery({
    queryKey: ["ciclos_avaliacao"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ciclos_avaliacao")
        .select("*")
        .order("ano", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

function getEstadoBadge(estado: string) {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
    pendente: { variant: "secondary", icon: <Clock className="h-3 w-3" /> },
    em_analise: { variant: "default", icon: <FileText className="h-3 w-3" /> },
    em_deliberacao: { variant: "default", icon: <Scale className="h-3 w-3" /> },
    respondida: { variant: "outline", icon: <MessageSquare className="h-3 w-3" /> },
    decidido: { variant: "default", icon: <Gavel className="h-3 w-3" /> },
    arquivada: { variant: "secondary", icon: <XCircle className="h-3 w-3" /> },
    arquivado: { variant: "secondary", icon: <XCircle className="h-3 w-3" /> },
  };

  const config = variants[estado] || variants.pendente;
  const label = estado.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      {config.icon}
      {label}
    </Badge>
  );
}

function getDecisaoBadge(decisao: string | null) {
  if (!decisao) return null;

  const config: Record<string, { className: string; icon: React.ReactNode }> = {
    deferido: { className: "bg-green-100 text-green-800", icon: <CheckCircle2 className="h-3 w-3" /> },
    indeferido: { className: "bg-red-100 text-red-800", icon: <XCircle className="h-3 w-3" /> },
    parcialmente_deferido: { className: "bg-yellow-100 text-yellow-800", icon: <AlertTriangle className="h-3 w-3" /> },
  };

  const cfg = config[decisao];
  const label = decisao.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Badge className={`flex items-center gap-1 ${cfg.className}`}>
      {cfg.icon}
      {label}
    </Badge>
  );
}

function ReclamacaoRow({
  reclamacao,
  onRespond,
}: {
  reclamacao: Reclamacao;
  onRespond: (r: Reclamacao) => void;
}) {
  const prazoExpirado = reclamacao.data_limite_resposta && isPast(new Date(reclamacao.data_limite_resposta));
  const diasRestantes = reclamacao.data_limite_resposta
    ? differenceInDays(new Date(reclamacao.data_limite_resposta), new Date())
    : null;

  return (
    <TableRow>
      <TableCell className="font-medium">
        {reclamacao.reclamante?.full_name || "—"}
      </TableCell>
      <TableCell>{reclamacao.avaliador?.full_name || "—"}</TableCell>
      <TableCell className="max-w-[200px] truncate" title={reclamacao.motivo}>
        {reclamacao.motivo}
      </TableCell>
      <TableCell>
        {format(new Date(reclamacao.data_submissao), "dd/MM/yyyy", { locale: pt })}
      </TableCell>
      <TableCell>
        {reclamacao.data_limite_resposta && (
          <div className="flex items-center gap-1">
            <span className={prazoExpirado ? "text-destructive" : ""}>
              {format(new Date(reclamacao.data_limite_resposta), "dd/MM/yyyy", { locale: pt })}
            </span>
            {!reclamacao.data_resposta && diasRestantes !== null && (
              <Badge variant={prazoExpirado ? "destructive" : diasRestantes <= 3 ? "secondary" : "outline"} className="text-xs">
                {prazoExpirado ? "Expirado" : `${diasRestantes}d`}
              </Badge>
            )}
          </div>
        )}
      </TableCell>
      <TableCell>{getEstadoBadge(reclamacao.estado)}</TableCell>
      <TableCell>{getDecisaoBadge(reclamacao.decisao_avaliador)}</TableCell>
      <TableCell>
        {reclamacao.estado === "pendente" || reclamacao.estado === "em_analise" ? (
          <Button size="sm" variant="outline" onClick={() => onRespond(reclamacao)}>
            Responder
          </Button>
        ) : reclamacao.resposta_avaliador ? (
          <Button size="sm" variant="ghost" onClick={() => onRespond(reclamacao)}>
            Ver Resposta
          </Button>
        ) : null}
      </TableCell>
    </TableRow>
  );
}

function RecursoRow({
  recurso,
  onManage,
}: {
  recurso: Recurso;
  onManage: (r: Recurso) => void;
}) {
  const prazoExpirado = recurso.data_limite_decisao && isPast(new Date(recurso.data_limite_decisao));
  const diasRestantes = recurso.data_limite_decisao
    ? differenceInDays(new Date(recurso.data_limite_decisao), new Date())
    : null;

  return (
    <TableRow>
      <TableCell className="font-medium">
        {recurso.recorrente?.full_name || "—"}
      </TableCell>
      <TableCell className="max-w-[200px] truncate" title={recurso.motivo}>
        {recurso.motivo}
      </TableCell>
      <TableCell>
        {format(new Date(recurso.data_submissao), "dd/MM/yyyy", { locale: pt })}
      </TableCell>
      <TableCell>
        {recurso.data_limite_decisao && (
          <div className="flex items-center gap-1">
            <span className={prazoExpirado ? "text-destructive" : ""}>
              {format(new Date(recurso.data_limite_decisao), "dd/MM/yyyy", { locale: pt })}
            </span>
            {!recurso.data_decisao && diasRestantes !== null && (
              <Badge variant={prazoExpirado ? "destructive" : diasRestantes <= 5 ? "secondary" : "outline"} className="text-xs">
                {prazoExpirado ? "Expirado" : `${diasRestantes}d`}
              </Badge>
            )}
          </div>
        )}
      </TableCell>
      <TableCell>{recurso.membro_relator?.full_name || "Não atribuído"}</TableCell>
      <TableCell>{getEstadoBadge(recurso.estado)}</TableCell>
      <TableCell>{getDecisaoBadge(recurso.decisao)}</TableCell>
      <TableCell>
        <Button size="sm" variant="outline" onClick={() => onManage(recurso)}>
          {recurso.estado === "decidido" ? "Ver Detalhes" : "Gerir"}
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function ReclamacoesRecursos() {
  const [selectedCiclo, setSelectedCiclo] = useState<string>("");
  const [selectedReclamacao, setSelectedReclamacao] = useState<Reclamacao | null>(null);
  const [selectedRecurso, setSelectedRecurso] = useState<Recurso | null>(null);
  const [resposta, setResposta] = useState("");
  const [decisao, setDecisao] = useState<"deferido" | "indeferido" | "parcialmente_deferido" | "">("");
  const [fundamentacao, setFundamentacao] = useState("");

  const { data: ciclos, isLoading: loadingCiclos } = useCiclos();
  const { data: reclamacoes, isLoading: loadingReclamacoes } = useReclamacoes(selectedCiclo || undefined);
  const { data: recursos, isLoading: loadingRecursos } = useRecursos(selectedCiclo || undefined);
  const { data: membrosComissao } = useMembrosComissao(selectedCiclo || null);
  const stats = useReclamacoesRecursosStats(selectedCiclo || undefined);

  const respondMutation = useRespondReclamacao();
  const updateRecursoMutation = useUpdateRecurso();

  const handleRespondReclamacao = () => {
    if (!selectedReclamacao || !decisao) return;
    respondMutation.mutate(
      {
        id: selectedReclamacao.id,
        resposta_avaliador: resposta,
        decisao_avaliador: decisao as "deferido" | "indeferido" | "parcialmente_deferido",
      },
      {
        onSuccess: () => {
          setSelectedReclamacao(null);
          setResposta("");
          setDecisao("");
        },
      }
    );
  };

  const handleDecideRecurso = () => {
    if (!selectedRecurso || !decisao) return;
    updateRecursoMutation.mutate(
      {
        id: selectedRecurso.id,
        decisao: decisao as "deferido" | "indeferido" | "parcialmente_deferido",
        fundamentacao_decisao: fundamentacao,
      },
      {
        onSuccess: () => {
          setSelectedRecurso(null);
          setFundamentacao("");
          setDecisao("");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Reclamações e Recursos
        </h1>
        <p className="text-muted-foreground">
          Gestão de reclamações e recursos conforme Art. 32.º-34.º do RADFP
        </p>
      </div>

      {/* Ciclo Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ciclo de Avaliação</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCiclo} onValueChange={setSelectedCiclo}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Selecione um ciclo..." />
            </SelectTrigger>
            <SelectContent>
              {ciclos?.map((ciclo) => (
                <SelectItem key={ciclo.id} value={ciclo.id}>
                  {ciclo.ano} - {ciclo.tipo === "semestral" ? `${ciclo.semestre}º Semestre` : "Anual"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reclamações</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReclamacoes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.reclamacoesPendentes} pendentes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reclamações Respondidas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reclamacoesRespondidas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Recursos</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRecursos}</div>
            <p className="text-xs text-muted-foreground">
              {stats.recursosPendentes} em análise
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recursos Decididos</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recursosDecididos}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="reclamacoes">
        <TabsList>
          <TabsTrigger value="reclamacoes" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Reclamações ({reclamacoes?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="recursos" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            Recursos ({recursos?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reclamacoes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Reclamações (Art. 32.º)</CardTitle>
              <CardDescription>
                Prazo de 10 dias úteis para submissão após notificação da avaliação.
                Prazo de 15 dias úteis para resposta do avaliador.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingReclamacoes ? (
                <p className="text-muted-foreground">A carregar...</p>
              ) : reclamacoes?.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma reclamação registada para este ciclo.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reclamante</TableHead>
                      <TableHead>Avaliador</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Data Submissão</TableHead>
                      <TableHead>Prazo Resposta</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Decisão</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reclamacoes?.map((rec) => (
                      <ReclamacaoRow
                        key={rec.id}
                        reclamacao={rec}
                        onRespond={(r) => {
                          setSelectedReclamacao(r);
                          setResposta(r.resposta_avaliador || "");
                          setDecisao((r.decisao_avaliador as typeof decisao) || "");
                        }}
                      />
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recursos" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recursos (Art. 33.º-34.º)</CardTitle>
              <CardDescription>
                Prazo de 10 dias úteis para interposição após resposta da reclamação.
                Prazo de 30 dias para decisão da Comissão de Avaliação.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingRecursos ? (
                <p className="text-muted-foreground">A carregar...</p>
              ) : recursos?.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum recurso registado para este ciclo.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recorrente</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Data Submissão</TableHead>
                      <TableHead>Prazo Decisão</TableHead>
                      <TableHead>Relator</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Decisão</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recursos?.map((rec) => (
                      <RecursoRow
                        key={rec.id}
                        recurso={rec}
                        onManage={(r) => {
                          setSelectedRecurso(r);
                          setFundamentacao(r.fundamentacao_decisao || "");
                          setDecisao((r.decisao as typeof decisao) || "");
                        }}
                      />
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Respond Reclamação Dialog */}
      <Dialog open={!!selectedReclamacao} onOpenChange={() => setSelectedReclamacao(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedReclamacao?.estado === "respondida" ? "Detalhes da Reclamação" : "Responder à Reclamação"}
            </DialogTitle>
            <DialogDescription>
              Reclamante: {selectedReclamacao?.reclamante?.full_name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Motivo</Label>
              <p className="text-sm mt-1">{selectedReclamacao?.motivo}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Fundamentação</Label>
              <p className="text-sm mt-1 whitespace-pre-wrap">{selectedReclamacao?.fundamentacao}</p>
            </div>

            <div className="border-t pt-4">
              <Label>Resposta do Avaliador</Label>
              <Textarea
                value={resposta}
                onChange={(e) => setResposta(e.target.value)}
                placeholder="Escreva a sua resposta..."
                rows={4}
                disabled={selectedReclamacao?.estado === "respondida"}
              />
            </div>

            <div>
              <Label>Decisão</Label>
              <Select
                value={decisao}
                onValueChange={(v) => setDecisao(v as typeof decisao)}
                disabled={selectedReclamacao?.estado === "respondida"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a decisão..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deferido">Deferido</SelectItem>
                  <SelectItem value="parcialmente_deferido">Parcialmente Deferido</SelectItem>
                  <SelectItem value="indeferido">Indeferido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReclamacao(null)}>
              Fechar
            </Button>
            {selectedReclamacao?.estado !== "respondida" && (
              <Button
                onClick={handleRespondReclamacao}
                disabled={!resposta || !decisao || respondMutation.isPending}
              >
                Submeter Resposta
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Recurso Dialog */}
      <Dialog open={!!selectedRecurso} onOpenChange={() => setSelectedRecurso(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedRecurso?.estado === "decidido" ? "Detalhes do Recurso" : "Gerir Recurso"}
            </DialogTitle>
            <DialogDescription>
              Recorrente: {selectedRecurso?.recorrente?.full_name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Motivo</Label>
              <p className="text-sm mt-1">{selectedRecurso?.motivo}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Fundamentação do Recorrente</Label>
              <p className="text-sm mt-1 whitespace-pre-wrap">{selectedRecurso?.fundamentacao}</p>
            </div>

            <div className="border-t pt-4">
              <Label>Fundamentação da Decisão (Comissão)</Label>
              <Textarea
                value={fundamentacao}
                onChange={(e) => setFundamentacao(e.target.value)}
                placeholder="Fundamentação da decisão da Comissão de Avaliação..."
                rows={4}
                disabled={selectedRecurso?.estado === "decidido"}
              />
            </div>

            <div>
              <Label>Decisão da Comissão</Label>
              <Select
                value={decisao}
                onValueChange={(v) => setDecisao(v as typeof decisao)}
                disabled={selectedRecurso?.estado === "decidido"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a decisão..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deferido">Deferido</SelectItem>
                  <SelectItem value="parcialmente_deferido">Parcialmente Deferido</SelectItem>
                  <SelectItem value="indeferido">Indeferido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRecurso(null)}>
              Fechar
            </Button>
            {selectedRecurso?.estado !== "decidido" && (
              <Button
                onClick={handleDecideRecurso}
                disabled={!fundamentacao || !decisao || updateRecursoMutation.isPending}
              >
                Registar Decisão
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
