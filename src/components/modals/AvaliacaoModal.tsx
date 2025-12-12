import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Evaluation, getGradeVariant } from "@/types/sgad";
import { mockUsers, mockCycles } from "@/data/mockData";
import { ClipboardCheck, X, Eye, FileText, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface AvaliacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluation?: Evaluation | null;
  onHomologar?: () => void;
}

export function AvaliacaoModal({ open, onOpenChange, evaluation, onHomologar }: AvaliacaoModalProps) {
  if (!evaluation) return null;

  const avaliado = mockUsers.find((u) => u.id === evaluation.avaliado_id);
  const avaliador = mockUsers.find((u) => u.id === evaluation.avaliador_id);
  const ciclo = mockCycles.find((c) => c.id === evaluation.ciclo_id);

  const getTypeLabel = (tipo: string) => {
    switch (tipo) {
      case "superior": return "Superior Hierárquico";
      case "pares": return "Entre Pares";
      case "utente_interno": return "Utente Interno";
      case "utente_externo": return "Utente Externo";
      default: return tipo;
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "rascunho": return <Badge variant="secondary">Rascunho</Badge>;
      case "submetida": return <Badge variant="info">Submetida</Badge>;
      case "homologada": return <Badge variant="success">Homologada</Badge>;
      default: return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const initials = avaliado?.nome.split(" ").map((n) => n[0]).slice(0, 2).join("") || "??";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="font-serif">Detalhes da Avaliação</DialogTitle>
              <DialogDescription>
                Visualização completa da avaliação de desempenho
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Avaliado Info */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{avaliado?.nome}</h3>
              <p className="text-sm text-muted-foreground">{avaliado?.cargo}</p>
              <p className="text-xs text-muted-foreground">{avaliado?.unidade_organica}</p>
            </div>
            {getStatusBadge(evaluation.estado)}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Avaliação</Label>
              <Badge variant="outline">{getTypeLabel(evaluation.tipo)}</Badge>
            </div>
            <div className="space-y-2">
              <Label>Ciclo</Label>
              <p className="font-medium">{ciclo ? `${ciclo.ano}/${ciclo.semestre}º Semestre` : "N/A"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data da Avaliação</Label>
              <p className="font-medium">
                {format(new Date(evaluation.data_avaliacao), "d 'de' MMMM 'de' yyyy", { locale: pt })}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Avaliador</Label>
              <p className="font-medium">{avaliador?.nome || "N/A"}</p>
            </div>
          </div>

          <Separator />

          {/* NAF */}
          <div className="p-6 rounded-lg bg-gold/10 border border-gold/30 text-center">
            <Label className="text-sm text-muted-foreground">Nota de Avaliação Final (NAF)</Label>
            <p className="text-4xl font-bold font-serif text-primary mt-2">{evaluation.nota_final.toFixed(2)}</p>
            <Badge variant={getGradeVariant(evaluation.classificacao)} className="mt-3 text-base px-4 py-1">
              {evaluation.classificacao}
            </Badge>
          </div>

          {evaluation.comentarios && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label>Comentários</Label>
                <p className="text-sm text-muted-foreground p-3 bg-secondary/30 rounded-lg">
                  {evaluation.comentarios}
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" />
            Fechar
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Gerar Relatório
          </Button>
          {evaluation.estado === "submetida" && (
            <Button variant="institutional" onClick={onHomologar}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Homologar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
