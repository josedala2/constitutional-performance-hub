import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const data = [
  { name: "Superados", value: 25, color: "hsl(var(--chart-1))" },
  { name: "Atingidos", value: 45, color: "hsl(var(--chart-2))" },
  { name: "Em Progresso", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Não Atingidos", value: 10, color: "hsl(var(--chart-4))" },
];

export const ObjectivesCompletion = () => {
  return (
    <Card className="animate-fade-in-up">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Taxa de Cumprimento de Objectivos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`${value} objectivos`, ""]}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
