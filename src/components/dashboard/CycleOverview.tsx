import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight, Clock } from "lucide-react";
import { mockCycles } from "@/data/mockData";
import { getStatusVariant, translateStatus } from "@/types/sgad";
import { format, differenceInDays } from "date-fns";
import { pt } from "date-fns/locale";
import { Link } from "react-router-dom";

export function CycleOverview() {
  const currentCycle = mockCycles[0];
  const daysRemaining = differenceInDays(new Date(currentCycle.data_fim), new Date());

  return (
    <Card className="shadow-institutional">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-serif">Ciclo de Avaliação Actual</CardTitle>
        <Link to="/ciclos">
          <Button variant="ghost" size="sm" className="text-xs">
            Ver todos <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Cycle */}
          <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                <span className="font-serif font-semibold">
                  {currentCycle.ano} - {currentCycle.semestre}º Semestre
                </span>
              </div>
              <Badge variant={getStatusVariant(currentCycle.estado)}>
                {translateStatus(currentCycle.estado)}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Início</p>
                <p className="font-medium">
                  {format(new Date(currentCycle.data_inicio), "d 'de' MMMM", { locale: pt })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Fim</p>
                <p className="font-medium">
                  {format(new Date(currentCycle.data_fim), "d 'de' MMMM", { locale: pt })}
                </p>
              </div>
            </div>
            {daysRemaining > 0 && (
              <div className="mt-3 flex items-center gap-2 text-sm text-warning">
                <Clock className="h-4 w-4" />
                <span>{daysRemaining} dias restantes para encerramento</span>
              </div>
            )}
          </div>

          {/* Previous Cycles */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Ciclos Anteriores
            </p>
            {mockCycles.slice(1).map((cycle) => (
              <div
                key={cycle.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {cycle.ano} - {cycle.semestre}º Semestre
                  </span>
                </div>
                <Badge variant={getStatusVariant(cycle.estado)} className="text-xs">
                  {translateStatus(cycle.estado)}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
