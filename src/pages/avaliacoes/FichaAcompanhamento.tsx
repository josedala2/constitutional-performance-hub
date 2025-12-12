import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Save, Send, Printer } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const objectivosIndividuais = [
  { id: 1, descricao: "", metaFinal: "", nivelAlcancado: "", nivelConcretizacao: "" },
  { id: 2, descricao: "", metaFinal: "", nivelAlcancado: "", nivelConcretizacao: "" },
  { id: 3, descricao: "", metaFinal: "", nivelAlcancado: "", nivelConcretizacao: "" },
];

const objectivosEquipa = [
  { id: 1, descricao: "", metaFinal: "", nivelAlcancado: "", nivelConcretizacao: "" },
  { id: 2, descricao: "", metaFinal: "", nivelAlcancado: "", nivelConcretizacao: "" },
];

const competenciasTransversais = [
  { id: 1, nome: "Adaptação profissional" },
  { id: 2, nome: "Relacionamento interpessoal" },
  { id: 3, nome: "Cooperação e trabalho em equipa" },
  { id: 4, nome: "Integridade e Conduta" },
  { id: 5, nome: "Assiduidade" },
  { id: 6, nome: "Pontualidade" },
];

const competenciasTecnicas = [
  { id: 1, nome: "Conhecimento técnico" },
  { id: 2, nome: "Qualidade do trabalho" },
  { id: 3, nome: "Produtividade" },
];

export default function FichaAcompanhamento() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">
                Ficha de Acompanhamento da Avaliação de Desempenho
              </h1>
              <p className="text-sm text-muted-foreground">
                Anexo X - Artigo 51.º alínea j)
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
                <Label htmlFor="nome">Nome Completo</Label>
                <Input id="nome" placeholder="Nome do colaborador" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgao">Órgão/Serviço</Label>
                <Input id="orgao" placeholder="Departamento" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Input id="cargo" placeholder="Cargo" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="superior">Nome do Superior Hierárquico</Label>
                <Input id="superior" placeholder="Nome do avaliador" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Objectivos Individuais */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Acompanhamento - Objectivos Individuais</CardTitle>
            <CardDescription>Monitorização do progresso dos objectivos individuais</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[35%]">Descrição</TableHead>
                  <TableHead>Meta Final</TableHead>
                  <TableHead>Nível Alcançado</TableHead>
                  <TableHead>Nível de Concretização</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {objectivosIndividuais.map((obj) => (
                  <TableRow key={obj.id}>
                    <TableCell>
                      <Textarea placeholder="Descreva o objectivo" className="min-h-[60px]" />
                    </TableCell>
                    <TableCell>
                      <Input placeholder="Meta" />
                    </TableCell>
                    <TableCell>
                      <Input placeholder="Alcançado" />
                    </TableCell>
                    <TableCell>
                      <Input placeholder="%" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Objectivos de Equipa */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Acompanhamento - Objectivos de Equipa</CardTitle>
            <CardDescription>Monitorização do progresso dos objectivos de equipa</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[35%]">Descrição</TableHead>
                  <TableHead>Meta Final</TableHead>
                  <TableHead>Nível Alcançado</TableHead>
                  <TableHead>Nível de Concretização</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {objectivosEquipa.map((obj) => (
                  <TableRow key={obj.id}>
                    <TableCell>
                      <Textarea placeholder="Descreva o objectivo" className="min-h-[60px]" />
                    </TableCell>
                    <TableCell>
                      <Input placeholder="Meta" />
                    </TableCell>
                    <TableCell>
                      <Input placeholder="Alcançado" />
                    </TableCell>
                    <TableCell>
                      <Input placeholder="%" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Competências Transversais */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Acompanhamento - Competências Transversais</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">Designação</TableHead>
                  <TableHead>Nível Esperado</TableHead>
                  <TableHead>Nível Alcançado</TableHead>
                  <TableHead>Nível de Concretização</TableHead>
                  <TableHead>Observações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competenciasTransversais.map((comp) => (
                  <TableRow key={comp.id}>
                    <TableCell className="font-medium">{comp.nome}</TableCell>
                    <TableCell>
                      <Input placeholder="1-5" className="w-16" />
                    </TableCell>
                    <TableCell>
                      <Input placeholder="1-5" className="w-16" />
                    </TableCell>
                    <TableCell>
                      <Input placeholder="%" className="w-16" />
                    </TableCell>
                    <TableCell>
                      <Input placeholder="Observações" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Competências Técnicas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Acompanhamento - Competências Técnicas Específicas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">Designação</TableHead>
                  <TableHead>Nível Esperado</TableHead>
                  <TableHead>Nível Alcançado</TableHead>
                  <TableHead>Nível de Concretização</TableHead>
                  <TableHead>Observações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competenciasTecnicas.map((comp) => (
                  <TableRow key={comp.id}>
                    <TableCell className="font-medium">{comp.nome}</TableCell>
                    <TableCell>
                      <Input placeholder="1-5" className="w-16" />
                    </TableCell>
                    <TableCell>
                      <Input placeholder="1-5" className="w-16" />
                    </TableCell>
                    <TableCell>
                      <Input placeholder="%" className="w-16" />
                    </TableCell>
                    <TableCell>
                      <Input placeholder="Observações" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Cálculo da Avaliação Global */}
        <Card className="border-gold/30 bg-gold/5">
          <CardHeader>
            <CardTitle className="text-lg">Cálculo da Avaliação Global do Desempenho</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Grau de concretização dos Objectivos</Label>
                <Input placeholder="Valor" />
              </div>
              <div className="space-y-2">
                <Label>Grau de concretização das Competências</Label>
                <Input placeholder="Valor" />
              </div>
              <div className="space-y-2">
                <Label>Avaliação Global do Desempenho</Label>
                <div className="flex items-center gap-2">
                  <Input placeholder="Valor" className="flex-1" />
                  <Badge variant="secondary" className="text-base px-4 py-2">--</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assinaturas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assinaturas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Avaliador</Label>
                <Input placeholder="Nome" />
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Avaliado</Label>
                <Input placeholder="Nome" />
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Validação do Responsável Máximo da Área</Label>
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
