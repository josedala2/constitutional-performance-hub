import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Globe, Save, Send, Printer } from "lucide-react";
import { toast } from "sonner";
import { PrintHeader } from "@/components/print/PrintHeader";
import { PrintFooter } from "@/components/print/PrintFooter";

interface QuestionRow {
  id: number;
  texto: string;
  resposta: string;
}

const initialQuestoes: QuestionRow[] = [
  { id: 1, texto: "O agente público foi cortês e prestou a adequada informação e os devidos esclarecimentos?", resposta: "4" },
  { id: 2, texto: "O agente público tratou o assunto em conformidade com a Lei?", resposta: "4" },
  { id: 3, texto: "O tempo de espera foi o necessário?", resposta: "3" },
  { id: 4, texto: "As condições do serviço público são adequadas?", resposta: "4" },
];

const opcoes = [
  { value: "1", label: "Mau" },
  { value: "2", label: "Regular" },
  { value: "3", label: "Bom" },
  { value: "4", label: "Excelente" },
];

export default function FichaUtentesExternos() {
  const [questoes, setQuestoes] = useState(initialQuestoes);
  const [sugestoes, setSugestoes] = useState(
    "Sugiro a implementação de um sistema de senhas electrónicas para melhorar a organização do atendimento. O espaço de espera poderia ter mais lugares sentados."
  );

  const handleSubmit = () => {
    toast.success("Avaliação de utente externo registada com sucesso!");
  };

  const handleSave = () => {
    toast.success("Avaliação guardada com sucesso!");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRespostaChange = (index: number, value: string) => {
    const updated = [...questoes];
    updated[index].resposta = value;
    setQuestoes(updated);
  };

  return (
    <AppLayout>
      <div className="space-y-6 print:space-y-4 print-container">
        {/* Print Header */}
        <PrintHeader 
          title="Ficha de Avaliação dos Utentes Externos" 
          subtitle="Anexo V - Artigo 51.º alínea e)"
        />
        
        {/* Screen Header */}
        <div className="flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">
                Ficha de Avaliação dos Utentes Externos
              </h1>
              <p className="text-sm text-muted-foreground">
                Anexo V - Artigo 51.º alínea e)
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
              Guardar
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
                <Input id="nome" defaultValue="José António Pereira Lima" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgao">Órgão/Serviço</Label>
                <Input id="orgao" defaultValue="Gabinete de Atendimento ao Público" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Input id="categoria" defaultValue="Técnico Profissional" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="utente">Avaliador - Utente N.º</Label>
                <Input id="utente" defaultValue="TC-2025-0847" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questionário em Tabela */}
        <Card>
          <CardHeader className="text-center border-b bg-primary/5">
            <CardTitle className="font-serif text-xl">AVALIE O NOSSO ATENDIMENTO</CardTitle>
            <CardDescription className="text-base">A SUA OPINIÃO É MUITO IMPORTANTE</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[50px] text-center font-semibold">N.º</TableHead>
                  <TableHead className="font-semibold">Questão</TableHead>
                  {opcoes.map((opcao) => (
                    <TableHead key={opcao.value} className="w-[100px] text-center font-semibold">
                      {opcao.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {questoes.map((questao, index) => (
                  <TableRow key={questao.id} className="hover:bg-muted/30">
                    <TableCell className="text-center font-medium">{questao.id}</TableCell>
                    <TableCell className="font-medium">{questao.texto}</TableCell>
                    {opcoes.map((opcao) => (
                      <TableCell key={opcao.value} className="text-center">
                        <input
                          type="radio"
                          name={`questao-${questao.id}`}
                          value={opcao.value}
                          checked={questao.resposta === opcao.value}
                          onChange={() => handleRespostaChange(index, opcao.value)}
                          className="h-4 w-4 cursor-pointer accent-primary"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Sugestões */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sugestões</CardTitle>
            <CardDescription>Apresente as suas sugestões para melhoria do serviço</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              value={sugestoes}
              onChange={(e) => setSugestoes(e.target.value)}
              className="min-h-[120px]" 
            />
          </CardContent>
        </Card>

        {/* Agradecimento */}
        <div className="text-center py-4">
          <p className="font-serif text-lg text-primary">Muito obrigado pela sua colaboração!</p>
          <p className="text-sm text-muted-foreground mt-1">A sua opinião ajuda-nos a melhorar os nossos serviços.</p>
        </div>

        {/* Print Footer */}
        <PrintFooter documentCode="SGAD-FUE-001" />
      </div>
    </AppLayout>
  );
}
