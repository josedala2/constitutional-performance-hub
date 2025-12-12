import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Target, Edit, Trash2 } from "lucide-react";
import { mockObjectives, mockUsers } from "@/data/mockData";

const Objectivos = () => {
  const getAvaliado = (id: string) => mockUsers.find((u) => u.id === id);

  const getProgressColor = (value: number) => {
    if (value >= 90) return "bg-grade-muito-bom";
    if (value >= 75) return "bg-grade-bom";
    if (value >= 50) return "bg-grade-suficiente";
    if (value >= 25) return "bg-grade-insuficiente";
    return "bg-grade-mau";
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Objectivos
            </h1>
            <p className="mt-1 text-muted-foreground">
              Gestão dos objectivos individuais e de equipa
            </p>
          </div>
          <Button variant="institutional" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Novo Objectivo
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="gradient-institutional text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Objectivos Individuais</p>
                  <p className="text-3xl font-bold font-serif mt-1">
                    {mockObjectives.filter((o) => o.tipo === "individual").length}
                  </p>
                </div>
                <Target className="h-10 w-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card className="gradient-gold text-accent-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Objectivos de Equipa</p>
                  <p className="text-3xl font-bold font-serif mt-1">
                    {mockObjectives.filter((o) => o.tipo === "equipa").length}
                  </p>
                </div>
                <Target className="h-10 w-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Média de Concretização</p>
                  <p className="text-3xl font-bold font-serif mt-1 text-success">
                    {(
                      mockObjectives.reduce((acc, o) => acc + o.grau_concretizacao, 0) /
                      mockObjectives.length
                    ).toFixed(1)}%
                  </p>
                </div>
                <div className="rounded-lg bg-success/10 p-3">
                  <Target className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Pesquisar objectivos..." className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="equipa">Equipa</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Colaborador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {mockUsers
                    .filter((u) => u.role === "avaliado")
                    .map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.nome}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Objectives Table */}
        <Card className="shadow-institutional">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Target className="h-5 w-5 text-accent" />
              Lista de Objectivos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Descrição</TableHead>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-center">Meta</TableHead>
                  <TableHead className="w-[15%]">Concretização</TableHead>
                  <TableHead>Pontuação</TableHead>
                  <TableHead className="text-right">Acções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockObjectives.map((obj) => {
                  const avaliado = getAvaliado(obj.avaliado_id);
                  return (
                    <TableRow key={obj.id} className="hover:bg-secondary/50">
                      <TableCell className="font-medium">{obj.descricao}</TableCell>
                      <TableCell>{avaliado?.nome || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={obj.tipo === "individual" ? "default" : "secondary"}>
                          {obj.tipo === "individual" ? "Individual" : "Equipa"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-muted-foreground">{obj.meta_realizada}</span>
                        <span className="mx-1">/</span>
                        <span className="font-medium">{obj.meta_planeada}</span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{obj.grau_concretizacao.toFixed(1)}%</span>
                          </div>
                          <Progress
                            value={obj.grau_concretizacao}
                            className="h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">{obj.pontuacao.toFixed(2)}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Objectivos;
