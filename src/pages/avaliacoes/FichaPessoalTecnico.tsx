import { useState, useMemo, useRef } from "react";
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
import { toast } from "sonner";
import { PrintHeader } from "@/components/print/PrintHeader";
import { PrintFooter } from "@/components/print/PrintFooter";

interface ObjectiveRow {
  id: number;
  descricao: string;
  planificado: string;
  realizado: string;
  pontuacao: number;
  dataConclusao: string;
}

interface CompetencyRow {
  id: number;
  nome: string;
  pontuacao: number;
  observacao: string;
}

const initialObjectivosIndividuais: ObjectiveRow[] = [
  { id: 1, descricao: "Elaborar 15 relatórios de auditoria trimestral", planificado: "15", realizado: "14", pontuacao: 4, dataConclusao: "2025-06-15" },
  { id: 2, descricao: "Reduzir em 20% o tempo de processamento de documentos", planificado: "20%", realizado: "18%", pontuacao: 4, dataConclusao: "2025-05-30" },
  { id: 3, descricao: "Capacitar 10 colaboradores em procedimentos internos", planificado: "10", realizado: "10", pontuacao: 5, dataConclusao: "2025-04-20" },
];

const initialObjectivosEquipa: ObjectiveRow[] = [
  { id: 1, descricao: "Implementar novo sistema de arquivo digital", planificado: "100%", realizado: "95%", pontuacao: 4, dataConclusao: "2025-06-30" },
  { id: 2, descricao: "Realizar 4 sessões de formação interna", planificado: "4", realizado: "4", pontuacao: 5, dataConclusao: "2025-05-15" },
];

const initialCompetenciasTransversais: CompetencyRow[] = [
  { id: 1, nome: "Adaptação profissional", pontuacao: 4, observacao: "Demonstra boa capacidade de adaptação a novas situações" },
  { id: 2, nome: "Relacionamento interpessoal", pontuacao: 5, observacao: "Excelente relacionamento com colegas e superiores" },
  { id: 3, nome: "Cooperação e trabalho em equipa", pontuacao: 4, observacao: "Colabora activamente em projectos de equipa" },
  { id: 4, nome: "Integridade e Conduta", pontuacao: 5, observacao: "Comportamento exemplar e ético" },
  { id: 5, nome: "Assiduidade", pontuacao: 5, observacao: "Sem faltas injustificadas no período" },
  { id: 6, nome: "Pontualidade", pontuacao: 4, observacao: "Cumpre horários estabelecidos" },
  { id: 7, nome: "Utilização adequada dos recursos", pontuacao: 4, observacao: "Uso responsável dos recursos disponíveis" },
  { id: 8, nome: "Apresentação", pontuacao: 5, observacao: "Apresentação pessoal sempre adequada" },
];

const initialCompetenciasTecnicas: CompetencyRow[] = [
  { id: 1, nome: "Conhecimento técnico", pontuacao: 4, observacao: "Domina as ferramentas e procedimentos da área" },
  { id: 2, nome: "Qualidade do trabalho", pontuacao: 5, observacao: "Trabalho rigoroso e com elevada qualidade" },
  { id: 3, nome: "Produtividade", pontuacao: 4, observacao: "Cumpre prazos e metas estabelecidas" },
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

export default function FichaPessoalTecnico() {
  const [objectivosIndividuais, setObjectivosIndividuais] = useState(initialObjectivosIndividuais);
  const [objectivosEquipa, setObjectivosEquipa] = useState(initialObjectivosEquipa);
  const [competenciasTransversais, setCompetenciasTransversais] = useState(initialCompetenciasTransversais);
  const [competenciasTecnicas, setCompetenciasTecnicas] = useState(initialCompetenciasTecnicas);

  // Calculate averages
  const mediaObjIndividuais = useMemo(() => {
    const total = objectivosIndividuais.reduce((acc, obj) => acc + obj.pontuacao, 0);
    return objectivosIndividuais.length > 0 ? total / objectivosIndividuais.length : 0;
  }, [objectivosIndividuais]);

  const mediaObjEquipa = useMemo(() => {
    const total = objectivosEquipa.reduce((acc, obj) => acc + obj.pontuacao, 0);
    return objectivosEquipa.length > 0 ? total / objectivosEquipa.length : 0;
  }, [objectivosEquipa]);

  const mediaCompTransversais = useMemo(() => {
    const total = competenciasTransversais.reduce((acc, comp) => acc + comp.pontuacao, 0);
    return competenciasTransversais.length > 0 ? total / competenciasTransversais.length : 0;
  }, [competenciasTransversais]);

  const mediaCompTecnicas = useMemo(() => {
    const total = competenciasTecnicas.reduce((acc, comp) => acc + comp.pontuacao, 0);
    return competenciasTecnicas.length > 0 ? total / competenciasTecnicas.length : 0;
  }, [competenciasTecnicas]);

  // Calculate NAF: (Obj.Ind × 40%) + (Obj.Eq × 20%) + (Comp.Trans × 20%) + (Comp.Téc × 20%)
  const naf = useMemo(() => {
    return (mediaObjIndividuais * 0.4) + (mediaObjEquipa * 0.2) + (mediaCompTransversais * 0.2) + (mediaCompTecnicas * 0.2);
  }, [mediaObjIndividuais, mediaObjEquipa, mediaCompTransversais, mediaCompTecnicas]);

  const grauFinal = getGrauDesempenho(naf);

  const handleSubmit = () => {
    // Validate required fields
    const nomeAvaliado = (document.getElementById('nome') as HTMLInputElement)?.value;
    if (!nomeAvaliado?.trim()) {
      toast.error("Por favor, preencha o nome do avaliado.");
      return;
    }
    
    if (objectivosIndividuais.some(obj => !obj.descricao.trim())) {
      toast.error("Por favor, preencha todos os objectivos individuais.");
      return;
    }

    toast.success("Avaliação submetida com sucesso!", {
      description: `NAF: ${naf.toFixed(2)} - ${grauFinal}`,
    });
  };

  const handleSave = () => {
    const formData = {
      objectivosIndividuais,
      objectivosEquipa,
      competenciasTransversais,
      competenciasTecnicas,
      naf,
      grauFinal,
      savedAt: new Date().toISOString(),
    };
    
    localStorage.setItem('fichaAvaliacaoRascunho', JSON.stringify(formData));
    toast.success("Rascunho guardado com sucesso!", {
      description: "Os dados foram guardados localmente.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AppLayout>
      <div className="space-y-6 print:space-y-4 print-container">
        {/* Print Header - Only visible when printing */}
        <PrintHeader 
          title="Ficha de Avaliação - Pessoal Técnico e Não Técnico" 
          subtitle="Anexo I - Artigo 51.º alínea a)"
        />
        
        {/* Screen Header - Hidden when printing */}
        <div className="flex items-center justify-between no-print">
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
                <Input id="nome" defaultValue="Ana Maria Fernandes da Silva" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgao">Órgão/Serviço</Label>
                <Input id="orgao" defaultValue="Departamento Jurídico" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Input id="categoria" defaultValue="Técnico Superior" />
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
                        value={obj.planificado}
                        onChange={(e) => {
                          const updated = [...objectivosIndividuais];
                          updated[index].planificado = e.target.value;
                          setObjectivosIndividuais(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={obj.realizado}
                        onChange={(e) => {
                          const updated = [...objectivosIndividuais];
                          updated[index].realizado = e.target.value;
                          setObjectivosIndividuais(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={String(obj.pontuacao)}
                        onValueChange={(value) => {
                          const updated = [...objectivosIndividuais];
                          updated[index].pontuacao = parseInt(value);
                          setObjectivosIndividuais(updated);
                        }}
                      >
                        <SelectTrigger>
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
                        type="date" 
                        value={obj.dataConclusao}
                        onChange={(e) => {
                          const updated = [...objectivosIndividuais];
                          updated[index].dataConclusao = e.target.value;
                          setObjectivosIndividuais(updated);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex items-center justify-end gap-4">
              <span className="text-sm text-muted-foreground">Média:</span>
              <Badge variant="outline" className="text-base">{mediaObjIndividuais.toFixed(2)}</Badge>
              <span className="text-sm text-muted-foreground">Grau:</span>
              <Badge variant={getGrauBadgeVariant(getGrauDesempenho(mediaObjIndividuais))}>
                {getGrauDesempenho(mediaObjIndividuais)}
              </Badge>
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
                        value={obj.planificado}
                        onChange={(e) => {
                          const updated = [...objectivosEquipa];
                          updated[index].planificado = e.target.value;
                          setObjectivosEquipa(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={obj.realizado}
                        onChange={(e) => {
                          const updated = [...objectivosEquipa];
                          updated[index].realizado = e.target.value;
                          setObjectivosEquipa(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={String(obj.pontuacao)}
                        onValueChange={(value) => {
                          const updated = [...objectivosEquipa];
                          updated[index].pontuacao = parseInt(value);
                          setObjectivosEquipa(updated);
                        }}
                      >
                        <SelectTrigger>
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
                        type="date" 
                        value={obj.dataConclusao}
                        onChange={(e) => {
                          const updated = [...objectivosEquipa];
                          updated[index].dataConclusao = e.target.value;
                          setObjectivosEquipa(updated);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex items-center justify-end gap-4">
              <span className="text-sm text-muted-foreground">Média:</span>
              <Badge variant="outline" className="text-base">{mediaObjEquipa.toFixed(2)}</Badge>
              <span className="text-sm text-muted-foreground">Grau:</span>
              <Badge variant={getGrauBadgeVariant(getGrauDesempenho(mediaObjEquipa))}>
                {getGrauDesempenho(mediaObjEquipa)}
              </Badge>
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
                  <TableHead className="w-[30%]">Competência</TableHead>
                  <TableHead className="w-[20%]">Pontuação (1-5)</TableHead>
                  <TableHead>Observação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competenciasTransversais.map((comp, index) => (
                  <TableRow key={comp.id}>
                    <TableCell className="font-medium">{comp.nome}</TableCell>
                    <TableCell>
                      <Select
                        value={String(comp.pontuacao)}
                        onValueChange={(value) => {
                          const updated = [...competenciasTransversais];
                          updated[index].pontuacao = parseInt(value);
                          setCompetenciasTransversais(updated);
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
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
                          const updated = [...competenciasTransversais];
                          updated[index].observacao = e.target.value;
                          setCompetenciasTransversais(updated);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex items-center justify-end gap-4">
              <span className="text-sm text-muted-foreground">Média:</span>
              <Badge variant="outline" className="text-base">{mediaCompTransversais.toFixed(2)}</Badge>
              <span className="text-sm text-muted-foreground">Grau:</span>
              <Badge variant={getGrauBadgeVariant(getGrauDesempenho(mediaCompTransversais))}>
                {getGrauDesempenho(mediaCompTransversais)}
              </Badge>
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
                  <TableHead className="w-[30%]">Competência</TableHead>
                  <TableHead className="w-[20%]">Pontuação (1-5)</TableHead>
                  <TableHead>Observação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competenciasTecnicas.map((comp, index) => (
                  <TableRow key={comp.id}>
                    <TableCell className="font-medium">{comp.nome}</TableCell>
                    <TableCell>
                      <Select
                        value={String(comp.pontuacao)}
                        onValueChange={(value) => {
                          const updated = [...competenciasTecnicas];
                          updated[index].pontuacao = parseInt(value);
                          setCompetenciasTecnicas(updated);
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
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
                          const updated = [...competenciasTecnicas];
                          updated[index].observacao = e.target.value;
                          setCompetenciasTecnicas(updated);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex items-center justify-end gap-4">
              <span className="text-sm text-muted-foreground">Média:</span>
              <Badge variant="outline" className="text-base">{mediaCompTecnicas.toFixed(2)}</Badge>
              <span className="text-sm text-muted-foreground">Grau:</span>
              <Badge variant={getGrauBadgeVariant(getGrauDesempenho(mediaCompTecnicas))}>
                {getGrauDesempenho(mediaCompTecnicas)}
              </Badge>
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
            <div className="grid gap-4 md:grid-cols-4 mb-6">
              <div className="text-center p-3 rounded-lg bg-background">
                <p className="text-xs text-muted-foreground">Obj. Individuais (40%)</p>
                <p className="text-xl font-bold">{(mediaObjIndividuais * 0.4).toFixed(2)}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background">
                <p className="text-xs text-muted-foreground">Obj. Equipa (20%)</p>
                <p className="text-xl font-bold">{(mediaObjEquipa * 0.2).toFixed(2)}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background">
                <p className="text-xs text-muted-foreground">Comp. Trans. (20%)</p>
                <p className="text-xl font-bold">{(mediaCompTransversais * 0.2).toFixed(2)}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background">
                <p className="text-xs text-muted-foreground">Comp. Téc. (20%)</p>
                <p className="text-xl font-bold">{(mediaCompTecnicas * 0.2).toFixed(2)}</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Pontuação Final</p>
                <p className="font-serif text-4xl font-bold text-primary">{naf.toFixed(2)}</p>
              </div>
              <Separator orientation="vertical" className="hidden h-16 md:block" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Grau de Desempenho</p>
                <Badge className="mt-2 text-lg px-4 py-1" variant={getGrauBadgeVariant(grauFinal)}>
                  {grauFinal}
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
        <PrintFooter documentCode="SGAD-FPT-001" />
      </div>
    </AppLayout>
  );
}
