import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Globe, Save, Send, Printer } from "lucide-react";
import { toast } from "sonner";

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

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
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
            <Button variant="outline" size="sm">
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

        {/* Questionário */}
        <Card className="border-gold/30 bg-gold/5">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-xl">AVALIE O NOSSO ATENDIMENTO</CardTitle>
            <CardDescription className="text-base">A SUA OPINIÃO É MUITO IMPORTANTE</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {questoes.map((questao, index) => (
              <div key={questao.id} className="space-y-3 p-4 rounded-lg bg-background">
                <Label className="text-base font-medium">{questao.texto}</Label>
                <RadioGroup 
                  className="flex flex-wrap gap-4"
                  value={questao.resposta}
                  onValueChange={(value) => {
                    const updated = [...questoes];
                    updated[index].resposta = value;
                    setQuestoes(updated);
                  }}
                >
                  {opcoes.map((opcao) => (
                    <div key={opcao.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={opcao.value} id={`q${questao.id}-${opcao.value}`} />
                      <Label 
                        htmlFor={`q${questao.id}-${opcao.value}`} 
                        className={`cursor-pointer ${questao.resposta === opcao.value ? 'font-semibold text-primary' : ''}`}
                      >
                        {opcao.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
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
      </div>
    </AppLayout>
  );
}
