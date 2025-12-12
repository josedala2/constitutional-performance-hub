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
import { Building2, Save, Send, Printer } from "lucide-react";
import { toast } from "sonner";

interface CompetencyRow {
  id: number;
  nome: string;
  pontuacao: number;
  comentarioAvaliador: string;
  comentarioAvaliado: string;
}

const initialCompetencias: CompetencyRow[] = [
  { id: 1, nome: "Qualidade do atendimento", pontuacao: 4, comentarioAvaliador: "Atendimento profissional e cordial", comentarioAvaliado: "Procuro sempre melhorar" },
  { id: 2, nome: "Tempo de resposta", pontuacao: 4, comentarioAvaliador: "Respostas dentro do prazo esperado", comentarioAvaliado: "Priorizo urgências" },
  { id: 3, nome: "Conhecimento técnico demonstrado", pontuacao: 5, comentarioAvaliador: "Excelente domínio técnico", comentarioAvaliado: "Actualizo-me constantemente" },
  { id: 4, nome: "Disponibilidade", pontuacao: 4, comentarioAvaliador: "Sempre disponível quando solicitado", comentarioAvaliado: "Esforço-me para ajudar" },
  { id: 5, nome: "Comunicação", pontuacao: 5, comentarioAvaliador: "Comunicação clara e eficaz", comentarioAvaliado: "Tento ser objectivo" },
  { id: 6, nome: "Resolução de problemas", pontuacao: 4, comentarioAvaliador: "Resolve problemas de forma eficiente", comentarioAvaliado: "Foco em soluções" },
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

export default function FichaUtentesInternos() {
  const [competencias, setCompetencias] = useState(initialCompetencias);

  const media = useMemo(() => {
    const total = competencias.reduce((acc, comp) => acc + comp.pontuacao, 0);
    return competencias.length > 0 ? total / competencias.length : 0;
  }, [competencias]);

  const grau = getGrauDesempenho(media);

  const handleSubmit = () => {
    toast.success("Avaliação de utentes internos submetida com sucesso!");
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
                <Label htmlFor="nome">Nome Completo do Avaliado</Label>
                <Input id="nome" defaultValue="Maria João Almeida Rodrigues" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgao">Órgão/Serviço</Label>
                <Input id="orgao" defaultValue="Gabinete de Atendimento" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Input id="categoria" defaultValue="Técnico Profissional" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="superior">Nome do Superior Hierárquico</Label>
                <Input id="superior" defaultValue="Dr. Fernando José Neto" />
              </div>
              <div className="space-y-2 md:col-span-4">
                <Label htmlFor="avaliador">Avaliador (Utente Interno - Departamento)</Label>
                <Input id="avaliador" defaultValue="Departamento de Contabilidade - Representado por Dra. Helena Sousa" />
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
                  <TableHead className="w-[20%]">Competência</TableHead>
                  <TableHead className="w-[15%]">Pontuação (1-5)</TableHead>
                  <TableHead className="w-[30%]">Comentários do Avaliador</TableHead>
                  <TableHead>Comentários do Avaliado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competencias.map((comp, index) => (
                  <TableRow key={comp.id}>
                    <TableCell className="font-medium">{comp.nome}</TableCell>
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
                      <Textarea 
                        value={comp.comentarioAvaliador}
                        onChange={(e) => {
                          const updated = [...competencias];
                          updated[index].comentarioAvaliador = e.target.value;
                          setCompetencias(updated);
                        }}
                        className="min-h-[60px]" 
                      />
                    </TableCell>
                    <TableCell>
                      <Textarea 
                        value={comp.comentarioAvaliado}
                        onChange={(e) => {
                          const updated = [...competencias];
                          updated[index].comentarioAvaliado = e.target.value;
                          setCompetencias(updated);
                        }}
                        className="min-h-[60px]" 
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
                <Label>Avaliador (Utente Interno)</Label>
                <Input defaultValue="Dra. Helena Maria Sousa" />
                <Input type="date" defaultValue="2025-06-25" />
              </div>
              <div className="space-y-2">
                <Label>Avaliado</Label>
                <Input defaultValue="Maria João Almeida Rodrigues" />
                <Input type="date" defaultValue="2025-06-25" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
