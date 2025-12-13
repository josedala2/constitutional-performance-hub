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
import { ClipboardList, Save, Send, Printer } from "lucide-react";
import { toast } from "sonner";
import { PrintHeader } from "@/components/print/PrintHeader";
import { PrintFooter } from "@/components/print/PrintFooter";

interface ObjectiveRow {
  id: number;
  descricao: string;
  metaFinal: string;
  nivelAlcancado: string;
  nivelConcretizacao: string;
}

interface CompetencyRow {
  id: number;
  nome: string;
  nivelEsperado: number;
  nivelAlcancado: number;
  nivelConcretizacao: string;
  observacoes: string;
}

const initialObjectivosIndividuais: ObjectiveRow[] = [
  { id: 1, descricao: "Elaborar relatórios de auditoria trimestral", metaFinal: "15", nivelAlcancado: "14", nivelConcretizacao: "93%" },
  { id: 2, descricao: "Reduzir tempo de processamento", metaFinal: "20%", nivelAlcancado: "18%", nivelConcretizacao: "90%" },
  { id: 3, descricao: "Capacitar colaboradores", metaFinal: "10", nivelAlcancado: "10", nivelConcretizacao: "100%" },
];

const initialObjectivosEquipa: ObjectiveRow[] = [
  { id: 1, descricao: "Implementar sistema de arquivo digital", metaFinal: "100%", nivelAlcancado: "95%", nivelConcretizacao: "95%" },
  { id: 2, descricao: "Realizar sessões de formação interna", metaFinal: "4", nivelAlcancado: "4", nivelConcretizacao: "100%" },
];

const initialCompetenciasTransversais: CompetencyRow[] = [
  { id: 1, nome: "Adaptação profissional", nivelEsperado: 4, nivelAlcancado: 4, nivelConcretizacao: "100%", observacoes: "Objectivo atingido" },
  { id: 2, nome: "Relacionamento interpessoal", nivelEsperado: 4, nivelAlcancado: 5, nivelConcretizacao: "125%", observacoes: "Superou expectativas" },
  { id: 3, nome: "Cooperação e trabalho em equipa", nivelEsperado: 4, nivelAlcancado: 4, nivelConcretizacao: "100%", observacoes: "Objectivo atingido" },
  { id: 4, nome: "Integridade e Conduta", nivelEsperado: 5, nivelAlcancado: 5, nivelConcretizacao: "100%", observacoes: "Exemplar" },
  { id: 5, nome: "Assiduidade", nivelEsperado: 5, nivelAlcancado: 5, nivelConcretizacao: "100%", observacoes: "Sem faltas" },
  { id: 6, nome: "Pontualidade", nivelEsperado: 4, nivelAlcancado: 4, nivelConcretizacao: "100%", observacoes: "Cumpre horários" },
];

const initialCompetenciasTecnicas: CompetencyRow[] = [
  { id: 1, nome: "Conhecimento técnico", nivelEsperado: 4, nivelAlcancado: 4, nivelConcretizacao: "100%", observacoes: "Domínio adequado" },
  { id: 2, nome: "Qualidade do trabalho", nivelEsperado: 4, nivelAlcancado: 5, nivelConcretizacao: "125%", observacoes: "Qualidade superior" },
  { id: 3, nome: "Produtividade", nivelEsperado: 4, nivelAlcancado: 4, nivelConcretizacao: "100%", observacoes: "Metas cumpridas" },
];

const getGrauDesempenho = (valor: number): string => {
  if (valor >= 4.5) return "Muito Bom";
  if (valor >= 4) return "Bom";
  if (valor >= 3) return "Suficiente";
  if (valor >= 2) return "Insuficiente";
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

export default function FichaAcompanhamento() {
  const [objectivosIndividuais, setObjectivosIndividuais] = useState(initialObjectivosIndividuais);
  const [objectivosEquipa, setObjectivosEquipa] = useState(initialObjectivosEquipa);
  const [competenciasTransversais, setCompetenciasTransversais] = useState(initialCompetenciasTransversais);
  const [competenciasTecnicas, setCompetenciasTecnicas] = useState(initialCompetenciasTecnicas);

  const [grauObjectivos, setGrauObjectivos] = useState("4.35");
  const [grauCompetencias, setGrauCompetencias] = useState("4.42");

  const avaliacaoGlobal = useMemo(() => {
    return (parseFloat(grauObjectivos) + parseFloat(grauCompetencias)) / 2;
  }, [grauObjectivos, grauCompetencias]);

  const grauFinal = getGrauDesempenho(avaliacaoGlobal);

  const handleSubmit = () => {
    toast.success("Ficha de acompanhamento submetida com sucesso!");
  };

  const handleSave = () => {
    toast.success("Rascunho guardado com sucesso!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AppLayout>
      <div className="space-y-6 print:space-y-4 print-container">
        {/* Print Header */}
        <PrintHeader 
          title="Ficha de Acompanhamento da Avaliação de Desempenho" 
          subtitle="Anexo X - Artigo 51.º alínea j)"
        />
        
        {/* Screen Header */}
        <div className="flex items-center justify-between no-print">
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
            <Button variant="outline" size="sm" onClick={handlePrint}>
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
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input id="nome" defaultValue="Ana Maria Fernandes da Silva" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgao">Órgão/Serviço</Label>
                <Input id="orgao" defaultValue="Departamento Jurídico" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Input id="cargo" defaultValue="Técnico Superior" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="superior">Nome do Superior Hierárquico</Label>
                <Input id="superior" defaultValue="Dr. António Manuel Silva" />
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
                {objectivosIndividuais.map((obj, index) => (
                  <TableRow key={obj.id}>
                    <TableCell>
                      <Textarea 
                        value={obj.descricao}
                        onChange={(e) => {
                          const updated = [...objectivosIndividuais];
                          updated[index].descricao = e.target.value;
                          setObjectivosIndividuais(updated);
                        }}
                        className="min-h-[60px]" 
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={obj.metaFinal}
                        onChange={(e) => {
                          const updated = [...objectivosIndividuais];
                          updated[index].metaFinal = e.target.value;
                          setObjectivosIndividuais(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={obj.nivelAlcancado}
                        onChange={(e) => {
                          const updated = [...objectivosIndividuais];
                          updated[index].nivelAlcancado = e.target.value;
                          setObjectivosIndividuais(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-sm">{obj.nivelConcretizacao}</Badge>
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
                {objectivosEquipa.map((obj, index) => (
                  <TableRow key={obj.id}>
                    <TableCell>
                      <Textarea 
                        value={obj.descricao}
                        onChange={(e) => {
                          const updated = [...objectivosEquipa];
                          updated[index].descricao = e.target.value;
                          setObjectivosEquipa(updated);
                        }}
                        className="min-h-[60px]" 
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={obj.metaFinal}
                        onChange={(e) => {
                          const updated = [...objectivosEquipa];
                          updated[index].metaFinal = e.target.value;
                          setObjectivosEquipa(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={obj.nivelAlcancado}
                        onChange={(e) => {
                          const updated = [...objectivosEquipa];
                          updated[index].nivelAlcancado = e.target.value;
                          setObjectivosEquipa(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-sm">{obj.nivelConcretizacao}</Badge>
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
                  <TableHead className="w-[25%]">Designação</TableHead>
                  <TableHead>Nível Esperado</TableHead>
                  <TableHead>Nível Alcançado</TableHead>
                  <TableHead>Concretização</TableHead>
                  <TableHead>Observações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competenciasTransversais.map((comp, index) => (
                  <TableRow key={comp.id}>
                    <TableCell className="font-medium">{comp.nome}</TableCell>
                    <TableCell>
                      <Input 
                        value={comp.nivelEsperado}
                        className="w-16 text-center"
                        onChange={(e) => {
                          const updated = [...competenciasTransversais];
                          updated[index].nivelEsperado = parseInt(e.target.value) || 0;
                          setCompetenciasTransversais(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={comp.nivelAlcancado}
                        className="w-16 text-center"
                        onChange={(e) => {
                          const updated = [...competenciasTransversais];
                          updated[index].nivelAlcancado = parseInt(e.target.value) || 0;
                          setCompetenciasTransversais(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-sm">{comp.nivelConcretizacao}</Badge>
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={comp.observacoes}
                        onChange={(e) => {
                          const updated = [...competenciasTransversais];
                          updated[index].observacoes = e.target.value;
                          setCompetenciasTransversais(updated);
                        }}
                      />
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
                  <TableHead className="w-[25%]">Designação</TableHead>
                  <TableHead>Nível Esperado</TableHead>
                  <TableHead>Nível Alcançado</TableHead>
                  <TableHead>Concretização</TableHead>
                  <TableHead>Observações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competenciasTecnicas.map((comp, index) => (
                  <TableRow key={comp.id}>
                    <TableCell className="font-medium">{comp.nome}</TableCell>
                    <TableCell>
                      <Input 
                        value={comp.nivelEsperado}
                        className="w-16 text-center"
                        onChange={(e) => {
                          const updated = [...competenciasTecnicas];
                          updated[index].nivelEsperado = parseInt(e.target.value) || 0;
                          setCompetenciasTecnicas(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={comp.nivelAlcancado}
                        className="w-16 text-center"
                        onChange={(e) => {
                          const updated = [...competenciasTecnicas];
                          updated[index].nivelAlcancado = parseInt(e.target.value) || 0;
                          setCompetenciasTecnicas(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-sm">{comp.nivelConcretizacao}</Badge>
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={comp.observacoes}
                        onChange={(e) => {
                          const updated = [...competenciasTecnicas];
                          updated[index].observacoes = e.target.value;
                          setCompetenciasTecnicas(updated);
                        }}
                      />
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
                <Input 
                  value={grauObjectivos}
                  onChange={(e) => setGrauObjectivos(e.target.value)}
                  className="text-center text-lg font-semibold"
                />
              </div>
              <div className="space-y-2">
                <Label>Grau de concretização das Competências</Label>
                <Input 
                  value={grauCompetencias}
                  onChange={(e) => setGrauCompetencias(e.target.value)}
                  className="text-center text-lg font-semibold"
                />
              </div>
              <div className="space-y-2">
                <Label>Avaliação Global do Desempenho</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    value={avaliacaoGlobal.toFixed(2)} 
                    className="flex-1 text-center text-lg font-semibold" 
                    readOnly 
                  />
                  <Badge variant={getGrauBadgeVariant(grauFinal)} className="text-base px-4 py-2">
                    {grauFinal}
                  </Badge>
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
                <Input defaultValue="Dr. António Manuel Silva" />
                <Input type="date" defaultValue="2025-06-30" />
              </div>
              <div className="space-y-2">
                <Label>Avaliado</Label>
                <Input defaultValue="Ana Maria Fernandes da Silva" />
                <Input type="date" defaultValue="2025-06-30" />
              </div>
              <div className="space-y-2">
                <Label>Validação do Responsável Máximo da Área</Label>
                <Input defaultValue="Dr. Carlos Alberto Mendes" />
                <Input type="date" defaultValue="2025-07-05" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Print Footer */}
        <PrintFooter documentCode="SGAD-FAC-001" />
      </div>
    </AppLayout>
  );
}
