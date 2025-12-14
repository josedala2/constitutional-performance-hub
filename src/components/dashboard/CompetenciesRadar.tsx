import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const data = [
  { competencia: "Comunicação", institucional: 3.8, individual: 3.5 },
  { competencia: "Trabalho Equipa", institucional: 3.6, individual: 3.7 },
  { competencia: "Orientação Resultados", institucional: 3.7, individual: 3.4 },
  { competencia: "Conhecimento Técnico", institucional: 3.5, individual: 3.9 },
  { competencia: "Adaptabilidade", institucional: 3.4, individual: 3.6 },
  { competencia: "Liderança", institucional: 3.3, individual: 3.2 },
];

export const CompetenciesRadar = () => {
  return (
    <Card className="animate-fade-in-up">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Análise de Competências
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid className="stroke-muted" />
              <PolarAngleAxis 
                dataKey="competencia" 
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 5]} 
                tick={{ fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Radar
                name="Média Institucional"
                dataKey="institucional"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
              />
              <Radar
                name="Média Individual"
                dataKey="individual"
                stroke="hsl(var(--accent))"
                fill="hsl(var(--accent))"
                fillOpacity={0.3}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
