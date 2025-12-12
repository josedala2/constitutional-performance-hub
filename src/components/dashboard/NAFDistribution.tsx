import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { classificacao: "Muito Bom", count: 8, fill: "hsl(var(--grade-muito-bom))" },
  { classificacao: "Bom", count: 18, fill: "hsl(var(--grade-bom))" },
  { classificacao: "Suficiente", count: 12, fill: "hsl(var(--grade-suficiente))" },
  { classificacao: "Insuficiente", count: 5, fill: "hsl(var(--grade-insuficiente))" },
  { classificacao: "Mau", count: 2, fill: "hsl(var(--grade-mau))" },
];

export function NAFDistribution() {
  return (
    <Card className="shadow-institutional">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-serif">
          Distribuição das Classificações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="classificacao" 
                width={85}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-card p-2 shadow-md">
                        <p className="font-medium">{data.classificacao}</p>
                        <p className="text-sm text-muted-foreground">
                          {data.count} colaboradores
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total de avaliações</span>
            <span className="font-semibold">45</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-muted-foreground">Média institucional</span>
            <span className="font-semibold">4.28</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
