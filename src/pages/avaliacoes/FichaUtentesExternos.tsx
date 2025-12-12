import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Globe, Save, Send, Printer } from "lucide-react";

const questoes = [
  { id: 1, texto: "O agente público foi cortês e prestou a adequada informação e os devidos esclarecimentos?" },
  { id: 2, texto: "O agente público tratou o assunto em conformidade com a Lei?" },
  { id: 3, texto: "O tempo de espera foi o necessário?" },
  { id: 4, texto: "As condições do serviço público são adequadas?" },
];

const opcoes = [
  { value: "1", label: "Mau" },
  { value: "2", label: "Regular" },
  { value: "3", label: "Bom" },
  { value: "4", label: "Excelente" },
];

export default function FichaUtentesExternos() {
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
                <Label htmlFor="utente">Avaliador - Utente N.º</Label>
                <Input id="utente" placeholder="Número do utente" />
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
            {questoes.map((questao) => (
              <div key={questao.id} className="space-y-3">
                <Label className="text-base">{questao.texto}</Label>
                <RadioGroup className="flex flex-wrap gap-4">
                  {opcoes.map((opcao) => (
                    <div key={opcao.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={opcao.value} id={`q${questao.id}-${opcao.value}`} />
                      <Label htmlFor={`q${questao.id}-${opcao.value}`} className="cursor-pointer">
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
              placeholder="Escreva aqui as suas sugestões..." 
              className="min-h-[120px]" 
            />
          </CardContent>
        </Card>

        {/* Agradecimento */}
        <div className="text-center">
          <p className="font-serif text-lg text-primary">Muito obrigado!</p>
        </div>
      </div>
    </AppLayout>
  );
}
