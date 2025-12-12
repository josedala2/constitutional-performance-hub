import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UsersRound, Save, Send, Printer } from "lucide-react";
import { toast } from "sonner";

interface CompetencyRow {
  id: number;
  nome: string;
  comportamentos: string;
  pontuacao: number;
  observacao: string;
}

const initialCompetenciasComportamentais: CompetencyRow[] = [
  { id: 1, nome: "Adaptação profissional", comportamentos: "Adapta-se rapidamente a novas tarefas e demonstra flexibilidade", pontuacao: 4, observacao: "Boa capacidade de adaptação" },
  { id: 2, nome: "Relacionamento interpessoal", comportamentos: "Mantém bom relacionamento com todos os colegas do departamento", pontuacao: 5, observacao: "Excelente comunicação" },
  { id: 3, nome: "Cooperação e trabalho em equipa", comportamentos: "Colabora activamente em projectos e apoia os colegas", pontuacao: 4, observacao: "Sempre disponível para ajudar" },
  { id: 4, nome: "Integridade e Conduta", comportamentos: "Comportamento ético e responsável em todas as situações", pontuacao: 5, observacao: "Exemplar" },
  { id: 5, nome: "Assiduidade", comportamentos: "Presente em todos os dias úteis, sem faltas injustificadas", pontuacao: 5, observacao: "100% de assiduidade" },
  { id: 6, nome: "Pontualidade", comportamentos: "Cumpre rigorosamente os horários estabelecidos", pontuacao: 4, observacao: "Raramente se atrasa" },
  { id: 7, nome: "Utilização adequada dos recursos", comportamentos: "Usa os recursos de forma consciente e económica", pontuacao: 4, observacao: "Cuidado com materiais" },
  { id: 8, nome: "Apresentação", comportamentos: "Apresentação pessoal adequada ao ambiente institucional", pontuacao: 5, observacao: "Sempre impecável" },
];

const pontuacaoOptions = [
  { value: "5", label: "5 - Muito Bom" },
  { value: "4", label: "4 - Bom" },
  { value: "3", label: "3 - Suficiente" },
  { value: "2", label: "2 - Insuficiente" },
  { value: "1", label: "1 - Mau" },
];

const getGrauDesempenho = (media: number): string => {
  if (media >= 4.5) return "Muito Bom";
  if (media >= 4) return "Bom";
  if (media >= 3) return "Suficiente";
  if (media >= 2) return "Insuficiente";
  return "Mau";
};

const getGrauBadgeVariant = (grau: string) => {
  switch (grau) {
    case "Muito Bom": return "muito-bom" as const;
    case "Bom": return "bom" as const;
    case "Suficiente": return "suficiente" as const;
    case "Insuficiente": return "insuficiente" as const;
    case "Mau": return "mau" as const;
    default: return "secondary" as const;
  }
};

export default function FichaEntrePares() {
  const [competencias, setCompetencias] = useState(initialCompetenciasComportamentais);

  const media = useMemo(() => {
    const total = competencias.reduce((acc, comp) => acc + comp.pontuacao, 0);
    return competencias.length > 0 ? total / competencias.length : 0;
  }, [competencias]);

  const grau = getGrauDesempenho(media);

  const handleSubmit = () => {
    toast.success("Avaliação entre pares submetida com sucesso!");
  };

  const handleSave = () => {
    toast.success("Rascunho guardado com sucesso!");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <UsersRound className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">
                Ficha de Avaliação Entre Pares
              </h1>
              <p className="text-sm text-muted-foreground">
                Anexo III - Artigo 51.º alínea c)
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Guardar Rascunho
            </Button>
            <Button size="sm" onClick={handleSubmit}>
              <Send className="mr-2 h-4 w-4" />
              Submeter
            </Button>
          </div>
        </div>

        {/* Identification */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Identificação</CardTitle>
            <CardDescription>Dados do avaliado e período de avaliação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="ano">Ano</Label>
                <Select defaultValue="2025">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semestre">Semestre</Label>
                <Select defaultValue="1">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar semestre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1º Semestre</SelectItem>
                    <SelectItem value="2">2º Semestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nome">Nome Completo do Avaliado</Label>
                <Input id="nome" defaultValue="Pedro Miguel Costa Santos" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgao">Órgão/Serviço</Label>
                <Input id="orgao" defaultValue="Gabinete de Informática" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Input id="categoria" defaultValue="Técnico Superior" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="avaliador">Avaliador (Par)</Label>
                <Input id="avaliador" defaultValue="Sofia Helena Martins Pereira" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competências Comportamentais */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Competências Comportamentais</CardTitle>
            <CardDescription>Avaliação das competências pelo par</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20%]">Competência</TableHead>
                  <TableHead className="w-[30%]">Comportamentos Observados</TableHead>
                  <TableHead className="w-[15%]">Pontuação (1-5)</TableHead>
                  <TableHead>Observação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competencias.map((comp, index) => (
                  <TableRow key={comp.id}>
                    <TableCell className="font-medium">{comp.nome}</TableCell>
                    <TableCell>
                      <Textarea 
                        value={comp.comportamentos}
                        onChange={(e) => {
                          const updated = [...competencias];
                          updated[index].comportamentos = e.target.value;
                          setCompetencias(updated);
                        }}
                        className="min-h-[60px]" 
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={String(comp.pontuacao)}
                        onValueChange={(value) => {
                          const updated = [...competencias];
                          updated[index].pontuacao = parseInt(value);
                          setCompetencias(updated);
                        }}
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {pontuacaoOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={comp.observacao}
                        onChange={(e) => {
                          const updated = [...competencias];
                          updated[index].observacao = e.target.value;
                          setCompetencias(updated);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex items-center justify-end gap-4">
              <span className="text-sm text-muted-foreground">Média:</span>
              <Badge variant="outline" className="text-base">{media.toFixed(2)}</Badge>
              <span className="text-sm text-muted-foreground">Grau de Desempenho:</span>
              <Badge variant={getGrauBadgeVariant(grau)}>{grau}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Assinaturas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assinaturas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Avaliador (Par)</Label>
                <Input defaultValue="Sofia Helena Martins Pereira" />
                <Input type="date" defaultValue="2025-06-28" />
              </div>
              <div className="space-y-2">
                <Label>Avaliado</Label>
                <Input defaultValue="Pedro Miguel Costa Santos" />
                <Input type="date" defaultValue="2025-06-28" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
