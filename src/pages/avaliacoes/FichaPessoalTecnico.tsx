import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileCheck, Save, Send, Printer } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const objectivosIndividuais = [
  { id: 1, descricao: "", planificado: "", realizado: "", pontuacao: 0 },
  { id: 2, descricao: "", planificado: "", realizado: "", pontuacao: 0 },
  { id: 3, descricao: "", planificado: "", realizado: "", pontuacao: 0 },
];

const objectivosEquipa = [
  { id: 1, descricao: "", planificado: "", realizado: "", pontuacao: 0 },
  { id: 2, descricao: "", planificado: "", realizado: "", pontuacao: 0 },
];

const competenciasTransversais = [
  { id: 1, nome: "Adaptação profissional", pontuacao: 0 },
  { id: 2, nome: "Relacionamento interpessoal", pontuacao: 0 },
  { id: 3, nome: "Cooperação e trabalho em equipa", pontuacao: 0 },
  { id: 4, nome: "Integridade e Conduta", pontuacao: 0 },
  { id: 5, nome: "Assiduidade", pontuacao: 0 },
  { id: 6, nome: "Pontualidade", pontuacao: 0 },
  { id: 7, nome: "Utilização adequada dos recursos", pontuacao: 0 },
  { id: 8, nome: "Apresentação", pontuacao: 0 },
];

const competenciasTecnicas = [
  { id: 1, nome: "Conhecimento técnico", pontuacao: 0 },
  { id: 2, nome: "Qualidade do trabalho", pontuacao: 0 },
  { id: 3, nome: "Produtividade", pontuacao: 0 },
];

const pontuacaoOptions = [
  { value: "5", label: "5 - Muito Bom" },
  { value: "4", label: "4 - Bom" },
  { value: "3", label: "3 - Suficiente" },
  { value: "2", label: "2 - Insuficiente" },
  { value: "1", label: "1 - Mau" },
];

export default function FichaPessoalTecnico() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <FileCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">
                Ficha de Avaliação - Pessoal Técnico e Não Técnico
              </h1>
              <p className="text-sm text-muted-foreground">
                Anexo I - Artigo 51.º alínea a)
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
              <div className="space-y-2">
                <Label htmlFor="semestre">Semestre</Label>
                <Select>
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
                <Input id="superior" placeholder="Nome do avaliador" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Objectivos Individuais */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Objectivos Individuais</CardTitle>
            <CardDescription>Coeficiente de peso: 40%</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Descrição</TableHead>
                  <TableHead>Meta Planificada</TableHead>
                  <TableHead>Meta Realizada</TableHead>
                  <TableHead>Pontuação (1-5)</TableHead>
                  <TableHead>Data Conclusão</TableHead>
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
                      <Input placeholder="Realizado" />
                    </TableCell>
                    <TableCell>
                      <Select>
                        <SelectTrigger>
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
                      <Input type="date" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex items-center justify-end gap-4">
              <span className="text-sm text-muted-foreground">Média:</span>
              <Badge variant="outline" className="text-base">0.00</Badge>
              <span className="text-sm text-muted-foreground">Grau:</span>
              <Badge variant="secondary">--</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Objectivos de Equipa */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Objectivos de Equipa</CardTitle>
            <CardDescription>Coeficiente de peso: 20%</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Descrição</TableHead>
                  <TableHead>Meta Planificada</TableHead>
                  <TableHead>Meta Realizada</TableHead>
                  <TableHead>Pontuação (1-5)</TableHead>
                  <TableHead>Data Conclusão</TableHead>
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
                      <Input placeholder="Realizado" />
                    </TableCell>
                    <TableCell>
                      <Select>
                        <SelectTrigger>
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
                      <Input type="date" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex items-center justify-end gap-4">
              <span className="text-sm text-muted-foreground">Média:</span>
              <Badge variant="outline" className="text-base">0.00</Badge>
              <span className="text-sm text-muted-foreground">Grau:</span>
              <Badge variant="secondary">--</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Competências Transversais */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Competências Transversais</CardTitle>
            <CardDescription>Coeficiente de peso: 20%</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Competência</TableHead>
                  <TableHead>Pontuação (1-5)</TableHead>
                  <TableHead>Observação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competenciasTransversais.map((comp) => (
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
                      <Input placeholder="Observação" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex items-center justify-end gap-4">
              <span className="text-sm text-muted-foreground">Média:</span>
              <Badge variant="outline" className="text-base">0.00</Badge>
              <span className="text-sm text-muted-foreground">Grau:</span>
              <Badge variant="secondary">--</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Competências Técnicas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Competências Técnicas Específicas</CardTitle>
            <CardDescription>Coeficiente de peso: 20%</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Competência</TableHead>
                  <TableHead>Pontuação (1-5)</TableHead>
                  <TableHead>Observação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competenciasTecnicas.map((comp) => (
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
                      <Input placeholder="Observação" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex items-center justify-end gap-4">
              <span className="text-sm text-muted-foreground">Média:</span>
              <Badge variant="outline" className="text-base">0.00</Badge>
              <span className="text-sm text-muted-foreground">Grau:</span>
              <Badge variant="secondary">--</Badge>
            </div>
          </CardContent>
        </Card>

        {/* NAF - Nota de Avaliação Final */}
        <Card className="border-gold/30 bg-gold/5">
          <CardHeader>
            <CardTitle className="text-lg">Nota de Avaliação Final (NAF)</CardTitle>
            <CardDescription>
              NAF = (Obj. Individuais × 40%) + (Obj. Equipa × 20%) + (Comp. Transversais × 20%) + (Comp. Técnicas × 20%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Pontuação Final</p>
                <p className="font-serif text-4xl font-bold text-primary">0.00</p>
              </div>
              <Separator orientation="vertical" className="hidden h-16 md:block" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Grau de Desempenho</p>
                <Badge className="mt-2 text-lg" variant="secondary">
                  A calcular
                </Badge>
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
