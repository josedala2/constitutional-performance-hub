import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { departamento: "Jurídico", naf: 3.8, color: "hsl(var(--chart-1))" },
  { departamento: "Financeiro", naf: 3.6, color: "hsl(var(--chart-2))" },
  { departamento: "Administrativo", naf: 3.4, color: "hsl(var(--chart-3))" },
  { departamento: "TI", naf: 3.9, color: "hsl(var(--chart-4))" },
  { departamento: "RH", naf: 3.5, color: "hsl(var(--chart-5))" },
];

export const DepartmentComparison = () => {
  return (
    <Card className="animate-fade-in-up">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Desempenho por Departamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              layout="vertical"
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                type="number" 
                domain={[0, 5]} 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis 
                dataKey="departamento" 
                type="category" 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`NAF: ${value.toFixed(2)}`, ""]}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Bar dataKey="naf" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
