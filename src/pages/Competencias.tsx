import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Award, Star, Edit } from "lucide-react";
import { mockCompetencies } from "@/data/mockData";

const proficiencyLevels = [
  { level: 5, label: "Muito Bom", description: "Sempre demonstra a competência" },
  { level: 4, label: "Bom", description: "Na maioria das vezes demonstra" },
  { level: 3, label: "Suficiente", description: "Em algumas situações demonstra" },
  { level: 2, label: "Insuficiente", description: "Poucas vezes demonstra" },
  { level: 1, label: "Mau", description: "Não demonstra a competência" },
];

const Competencias = () => {
  const transversais = mockCompetencies.filter((c) => c.tipo === "transversal");
  const tecnicas = mockCompetencies.filter((c) => c.tipo === "tecnica");

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Competências
            </h1>
            <p className="mt-1 text-muted-foreground">
              Gestão das competências transversais e técnicas
            </p>
          </div>
          <Button variant="institutional" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Nova Competência
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Pesquisar competências..." className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Carreira" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as carreiras</SelectItem>
                  <SelectItem value="ts">Técnico Superior</SelectItem>
                  <SelectItem value="tp">Técnico Profissional</SelectItem>
                  <SelectItem value="admin">Administrativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Proficiency Scale */}
        <Card className="bg-secondary/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-serif">Escala de Proficiência</CardTitle>
            <CardDescription>Níveis de avaliação aplicáveis às competências</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {proficiencyLevels.map((level) => (
                <div
                  key={level.level}
                  className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2"
                >
                  <div className="flex items-center gap-1">
                    {[...Array(level.level)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                    ))}
                    {[...Array(5 - level.level)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 text-muted" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{level.label}</span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    ({level.level})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Competencies Tabs */}
        <Tabs defaultValue="transversais" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="transversais" className="gap-2">
              <Award className="h-4 w-4" />
              Transversais ({transversais.length})
            </TabsTrigger>
            <TabsTrigger value="tecnicas" className="gap-2">
              <Award className="h-4 w-4" />
              Técnicas ({tecnicas.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transversais" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {transversais.map((competency, index) => (
                <Card
                  key={competency.id}
                  className="shadow-institutional hover:shadow-lg transition-shadow animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="rounded-lg bg-accent/10 p-2">
                        <Award className="h-5 w-5 text-accent" />
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-base mt-3">{competency.nome}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Transversal</Badge>
                      <span className="text-xs text-muted-foreground">Todas as carreiras</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tecnicas" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tecnicas.map((competency, index) => (
                <Card
                  key={competency.id}
                  className="shadow-institutional hover:shadow-lg transition-shadow animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-base mt-3">{competency.nome}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge>Técnica</Badge>
                      <span className="text-xs text-muted-foreground">
                        {competency.carreira || "Geral"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Competencias;
