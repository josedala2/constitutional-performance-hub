import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { mockEmployeeSummaries } from "@/data/mockData";
import { getGradeVariant } from "@/types/sgad";

export function EvaluationProgress() {
  return (
    <Card className="shadow-institutional">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-serif">Avaliações em Curso</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockEmployeeSummaries.map((summary, index) => (
          <div
            key={summary.avaliado.id}
            className="space-y-2 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                  {summary.avaliado.nome.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium">{summary.avaliado.nome}</p>
                  <p className="text-xs text-muted-foreground">{summary.avaliado.cargo}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getGradeVariant(summary.classificacao as any)} className="text-xs">
                  {summary.classificacao}
                </Badge>
                <span className="text-sm font-semibold">{summary.naf.toFixed(2)}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progresso da avaliação</span>
                <span>
                  {summary.estado === "concluida" ? "100%" : 
                   summary.estado === "em_progresso" ? "65%" : "25%"}
                </span>
              </div>
              <Progress 
                value={
                  summary.estado === "concluida" ? 100 : 
                  summary.estado === "em_progresso" ? 65 : 25
                } 
                className="h-2"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
