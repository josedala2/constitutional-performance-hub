import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, HardDrive, Folder } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface Documento {
  id: string;
  nome: string;
  tipo: string;
  data: string;
  tamanho: string;
  ciclo: string;
}

interface DocumentoPreviewModalProps {
  documento: Documento | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: (documento: Documento) => void;
}

export const DocumentoPreviewModal = ({
  documento,
  open,
  onOpenChange,
  onDownload,
}: DocumentoPreviewModalProps) => {
  if (!documento) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif">
            <FileText className="h-5 w-5 text-accent" />
            Pré-visualização do Documento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Header */}
          <div className="flex items-start gap-4 p-4 bg-secondary/30 rounded-lg">
            <div className="rounded-lg bg-accent/10 p-4">
              <FileText className="h-10 w-10 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{documento.nome}</h3>
              <Badge variant="outline" className="mt-2">
                {documento.tipo}
              </Badge>
            </div>
          </div>

          {/* Document Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Data de Criação</p>
                <p className="font-medium">
                  {format(new Date(documento.data), "d 'de' MMMM 'de' yyyy", { locale: pt })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
              <HardDrive className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Tamanho</p>
                <p className="font-medium">{documento.tamanho}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg col-span-2">
              <Folder className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Ciclo de Avaliação</p>
                <p className="font-medium">{documento.ciclo}</p>
              </div>
            </div>
          </div>

          {/* Preview Placeholder */}
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-secondary/10">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Pré-visualização do conteúdo do documento
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              (Funcionalidade disponível após integração com sistema de ficheiros)
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            <Button variant="institutional" onClick={() => onDownload(documento)}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
