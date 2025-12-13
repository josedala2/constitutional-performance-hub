import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Upload, 
  Download, 
  Search,
  Folder,
  File,
  FilePlus,
  Eye,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { DocumentoPreviewModal } from "@/components/modals/DocumentoPreviewModal";
import { toast } from "sonner";

const mockDocuments = [
  { 
    id: "1", 
    nome: "Ficha de Avaliação - Ana Fernandes", 
    tipo: "Ficha de Avaliação", 
    data: "2025-12-10", 
    tamanho: "245 KB",
    ciclo: "2025/1º Sem"
  },
  { 
    id: "2", 
    nome: "Relatório de Acompanhamento - Pedro Costa", 
    tipo: "Relatório", 
    data: "2025-12-08", 
    tamanho: "189 KB",
    ciclo: "2025/1º Sem"
  },
  { 
    id: "3", 
    nome: "Ficha de Avaliação Entre Pares - Sofia Martins", 
    tipo: "Ficha de Avaliação", 
    data: "2025-12-05", 
    tamanho: "156 KB",
    ciclo: "2025/1º Sem"
  },
  { 
    id: "4", 
    nome: "Relatório Institucional 2024/2º Sem", 
    tipo: "Relatório", 
    data: "2025-01-05", 
    tamanho: "2.4 MB",
    ciclo: "2024/2º Sem"
  },
];

const folders = [
  { nome: "Fichas de Avaliação", count: 45, icon: FileText },
  { nome: "Relatórios", count: 12, icon: File },
  { nome: "Anexos Legais", count: 11, icon: Folder },
  { nome: "Modelos", count: 8, icon: FilePlus },
];

const Documentos = () => {
  const [selectedDoc, setSelectedDoc] = useState<typeof mockDocuments[0] | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleView = (doc: typeof mockDocuments[0]) => {
    setSelectedDoc(doc);
    setPreviewOpen(true);
  };

  const handleDownload = (doc: typeof mockDocuments[0]) => {
    // Simulate download
    toast.success(`A descarregar "${doc.nome}"`, {
      description: `Tamanho: ${doc.tamanho}`,
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Documentos
            </h1>
            <p className="mt-1 text-muted-foreground">
              Arquivo de documentos e ficheiros do sistema
            </p>
          </div>
          <Button variant="institutional" size="lg">
            <Upload className="h-5 w-5 mr-2" />
            Carregar Documento
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Pesquisar documentos..." className="pl-9" />
            </div>
          </CardContent>
        </Card>

        {/* Folders Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {folders.map((folder, index) => (
            <Card 
              key={folder.nome}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-accent/10 p-3 group-hover:bg-accent/20 transition-colors">
                    <folder.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">{folder.nome}</p>
                    <p className="text-sm text-muted-foreground">{folder.count} ficheiros</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Documents List */}
        <Card className="shadow-institutional">
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              Documentos Recentes
            </CardTitle>
            <CardDescription>
              Últimos documentos adicionados ao sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-secondary p-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{doc.nome}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{doc.tipo}</span>
                        <span>•</span>
                        <span>{format(new Date(doc.data), "d MMM yyyy", { locale: pt })}</span>
                        <span>•</span>
                        <span>{doc.tamanho}</span>
                        <span>•</span>
                        <span>{doc.ciclo}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="Visualizar"
                      onClick={() => handleView(doc)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="Download"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Eliminar">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Preview Modal */}
        <DocumentoPreviewModal
          documento={selectedDoc}
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          onDownload={handleDownload}
        />
      </div>
    </AppLayout>
  );
};

export default Documentos;
