import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, Save, Send, Printer } from "lucide-react";

const competencias = [
  { id: 1, nome: "Qualidade do atendimento", pontuacao: 0 },
  { id: 2, nome: "Tempo de resposta", pontuacao: 0 },
  { id: 3, nome: "Conhecimento técnico demonstrado", pontuacao: 0 },
  { id: 4, nome: "Disponibilidade", pontuacao: 0 },
  { id: 5, nome: "Comunicação", pontuacao: 0 },
  { id: 6, nome: "Resolução de problemas", pontuacao: 0 },
];

const pontuacaoOptions = [
  { value: "5", label: "5 - Muito Bom" },
  { value: "4", label: "4 - Bom" },
  { value: "3", label: "3 - Suficiente" },
  { value: "2", label: "2 - Insuficiente" },
  { value: "1", label: "1 - Mau" },
];

export default function FichaUtentesInternos() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">
                Ficha de Avaliação dos Utentes Internos
              </h1>
              <p className="text-sm text-muted-foreground">
                Anexo IV - Artigo 51.º alínea d)
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm">
              <Save className="mr-2 h-4 w-4" />
              Guardar Rascunho
            </Button>
            <Button size="sm">
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="nome">Nome Completo do Avaliado</Label>
                <Input id="nome" placeholder="Nome do colaborador" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgao">Órgão/Serviço</Label>
                <Input id="orgao" placeholder="Departamento" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Input id="categoria" placeholder="Categoria profissional" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="superior">Nome do Superior Hierárquico</Label>
                <Input id="superior" placeholder="Nome do superior" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competências */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Avaliação das Competências</CardTitle>
            <CardDescription>Avaliação realizada pelos utentes internos (outros departamentos)</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Competência</TableHead>
                  <TableHead>Pontuação (1-5)</TableHead>
                  <TableHead>Comentários do Avaliador</TableHead>
                  <TableHead>Comentários do Avaliado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competencias.map((comp) => (
                  <TableRow key={comp.id}>
                    <TableCell className="font-medium">{comp.nome}</TableCell>
                    <TableCell>
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="--" />
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
                      <Textarea placeholder="Comentários" className="min-h-[60px]" />
                    </TableCell>
                    <TableCell>
                      <Textarea placeholder="Comentários" className="min-h-[60px]" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex items-center justify-end gap-4">
              <span className="text-sm text-muted-foreground">Média:</span>
              <Badge variant="outline" className="text-base">0.00</Badge>
              <span className="text-sm text-muted-foreground">Grau de Desempenho:</span>
              <Badge variant="secondary">--</Badge>
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
                <Label>Avaliador (Utente Interno)</Label>
                <Input placeholder="Nome" />
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Avaliado</Label>
                <Input placeholder="Nome" />
                <Input type="date" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
