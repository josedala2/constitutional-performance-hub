import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface TestUserCredential {
  email: string;
  password: string;
  role: string;
  name: string;
}

interface TestUsersCredentialsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credentials: TestUserCredential[];
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  RH: "Recursos Humanos",
  AUDITOR: "Auditor",
  AVALIADOR: "Avaliador",
  AVALIADO: "Avaliado",
  PAR: "Par",
  UTENTE_INTERNO: "Utente Interno",
  UTENTE_EXTERNO: "Utente Externo",
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-chart-1 text-white",
  RH: "bg-chart-2 text-white",
  AUDITOR: "bg-chart-3 text-white",
  AVALIADOR: "bg-chart-4 text-white",
  AVALIADO: "bg-chart-5 text-white",
  PAR: "bg-primary text-primary-foreground",
  UTENTE_INTERNO: "bg-secondary text-secondary-foreground",
  UTENTE_EXTERNO: "bg-muted text-muted-foreground",
};

export function TestUsersCredentialsModal({
  open,
  onOpenChange,
  credentials,
}: TestUsersCredentialsModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (email: string, password: string, index: number) => {
    await navigator.clipboard.writeText(`${email} / ${password}`);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = async () => {
    const text = credentials
      .map((c) => `${c.role}: ${c.email} / ${c.password}`)
      .join("\n");
    await navigator.clipboard.writeText(text);
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            Utilizadores de Teste Criados
          </DialogTitle>
          <DialogDescription>
            Credenciais de acesso para os utilizadores de teste. Guarde estas informações.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Perfil</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Password</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {credentials.map((credential, index) => (
                <TableRow key={credential.email}>
                  <TableCell>
                    <Badge className={ROLE_COLORS[credential.role] || ""}>
                      {ROLE_LABELS[credential.role] || credential.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{credential.name}</TableCell>
                  <TableCell className="font-mono text-sm">{credential.email}</TableCell>
                  <TableCell className="font-mono text-sm">{credential.password}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(credential.email, credential.password, index)}
                      className="h-8 w-8"
                    >
                      {copiedIndex === index ? (
                        <Check className="h-4 w-4 text-chart-2" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleCopyAll}>
              {copiedIndex === -1 ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Todas
                </>
              )}
            </Button>
            <Button onClick={() => onOpenChange(false)}>Fechar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
