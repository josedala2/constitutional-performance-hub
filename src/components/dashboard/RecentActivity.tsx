import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck, Calendar, Target, Award } from "lucide-react";
import { mockActivities } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";

const activityIcons = {
  avaliacao_submetida: ClipboardCheck,
  ciclo_criado: Calendar,
  objetivo_atualizado: Target,
  homologacao: Award,
};

const activityColors = {
  avaliacao_submetida: "bg-info/10 text-info",
  ciclo_criado: "bg-success/10 text-success",
  objetivo_atualizado: "bg-warning/10 text-warning",
  homologacao: "bg-primary/10 text-primary",
};

export function RecentActivity() {
  return (
    <Card className="shadow-institutional">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-serif">Actividade Recente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity, index) => {
            const Icon = activityIcons[activity.tipo];
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 animate-slide-in-right"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`rounded-lg p-2 ${activityColors[activity.tipo]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.descricao}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{activity.usuario}</span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(activity.data), {
                        addSuffix: true,
                        locale: pt,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
