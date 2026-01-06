import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { 
  useCiclosAvaliacao, 
  useMembrosComissao, 
  useAddMembro, 
  useRemoveMembro,
  useSubstituirMembro,
  MembroComissao,
  MembroFormData 
} from "@/hooks/useComissaoAvaliacao";
import { useProfiles } from "@/hooks/useProfiles";
import { Users, UserPlus, Crown, UserMinus, AlertCircle, CheckCircle2, Info, ArrowRightLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const LIMITE_EFECTIVOS = 5;
const LIMITE_SUPLENTES = 2;

export default function ComissaoAvaliacao() {
  const [selectedCicloId, setSelectedCicloId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubstituirModalOpen, setIsSubstituirModalOpen] = useState(false);
  const [membroToRemove, setMembroToRemove] = useState<MembroComissao | null>(null);
  const [membroToSubstituir, setMembroToSubstituir] = useState<MembroComissao | null>(null);
  const [tipoMembroAdd, setTipoMembroAdd] = useState<"efectivo" | "suplente">("efectivo");
  
  const [formData, setFormData] = useState<Partial<MembroFormData>>({
    user_id: "",
    cargo_comissao: "vogal",
    observacoes: "",
  });

  const [substituicaoData, setSubstituicaoData] = useState({
    suplenteId: "",
    motivo: "",
  });

  const { data: ciclos, isLoading: loadingCiclos } = useCiclosAvaliacao();
  const { data: membros, isLoading: loadingMembros } = useMembrosComissao(selectedCicloId);
  const { data: profiles } = useProfiles();
  const addMembro = useAddMembro();
  const removeMembro = useRemoveMembro();
  const substituirMembro = useSubstituirMembro();

  // Separar membros por tipo (apenas activos - sem data_cessacao)
  const membrosEfectivos = useMemo(() => 
    membros?.filter(m => m.tipo_membro === "efectivo" && !m.data_cessacao) || [], 
    [membros]
  );
  
  const membrosSuplentes = useMemo(() => 
    membros?.filter(m => m.tipo_membro === "suplente" && !m.data_cessacao) || [], 
    [membros]
  );

  // Suplentes disponíveis para substituição
  const suplentesDisponiveis = useMemo(() => 
    membrosSuplentes.filter(m => !m.data_cessacao),
    [membrosSuplentes]
  );

  // Verificar se há presidente
  const temPresidente = useMemo(() => 
    membrosEfectivos.some(m => m.cargo_comissao === "presidente"),
    [membrosEfectivos]
  );

  // Próxima ordem disponível
  const proximaOrdemEfectivo = membrosEfectivos.length + 1;
  const proximaOrdemSuplente = membrosSuplentes.length + 1;

  // Perfis disponíveis (não estão na comissão)
  const profilesDisponiveis = useMemo(() => {
    const membrosIds = membros?.map(m => m.user_id) || [];
    return profiles?.filter(p => !membrosIds.includes(p.id) && p.status === "ACTIVE") || [];
  }, [profiles, membros]);

  // Verificar limites
  const podeAdicionarEfectivo = membrosEfectivos.length < LIMITE_EFECTIVOS;
  const podeAdicionarSuplente = membrosSuplentes.length < LIMITE_SUPLENTES;

  const handleOpenAddModal = (tipo: "efectivo" | "suplente") => {
    setTipoMembroAdd(tipo);
    setFormData({
      user_id: "",
      cargo_comissao: tipo === "efectivo" && !temPresidente ? "presidente" : "vogal",
      observacoes: "",
    });
    setIsAddModalOpen(true);
  };

  const handleAddMembro = async () => {
    if (!selectedCicloId || !formData.user_id) return;

    const ordem = tipoMembroAdd === "efectivo" ? proximaOrdemEfectivo : proximaOrdemSuplente;

    await addMembro.mutateAsync({
      ciclo_id: selectedCicloId,
      user_id: formData.user_id,
      tipo_membro: tipoMembroAdd,
      cargo_comissao: formData.cargo_comissao || "vogal",
      ordem,
      observacoes: formData.observacoes,
    });

    setIsAddModalOpen(false);
    setFormData({ user_id: "", cargo_comissao: "vogal", observacoes: "" });
  };

  const handleRemoveMembro = async () => {
    if (!membroToRemove || !selectedCicloId) return;
    await removeMembro.mutateAsync({ id: membroToRemove.id, cicloId: selectedCicloId });
    setMembroToRemove(null);
  };

  const handleOpenSubstituirModal = (membro: MembroComissao) => {
    setMembroToSubstituir(membro);
    setSubstituicaoData({ suplenteId: "", motivo: "" });
    setIsSubstituirModalOpen(true);
  };

  const handleSubstituir = async () => {
    if (!membroToSubstituir || !substituicaoData.suplenteId || !selectedCicloId) return;
    
    await substituirMembro.mutateAsync({
      membroEfectivoId: membroToSubstituir.id,
      membroSuplenteId: substituicaoData.suplenteId,
      cicloId: selectedCicloId,
      motivo: substituicaoData.motivo,
    });
    
    setIsSubstituirModalOpen(false);
    setMembroToSubstituir(null);
  };

  const formatCicloLabel = (ciclo: typeof ciclos extends (infer T)[] | undefined ? T : never) => {
    if (!ciclo) return "";
    return ciclo.tipo === "anual" 
      ? `${ciclo.ano} (Anual)` 
      : `${ciclo.ano} - ${ciclo.semestre}º Semestre`;
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "aberto": return <Badge variant="default">Aberto</Badge>;
      case "em_acompanhamento": return <Badge variant="secondary">Em Acompanhamento</Badge>;
      case "fechado": return <Badge variant="outline">Fechado</Badge>;
      case "homologado": return <Badge variant="outline" className="border-primary">Homologado</Badge>;
      default: return <Badge variant="outline">{estado}</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif text-foreground">Comissão de Avaliação</h1>
            <p className="text-muted-foreground mt-1">
              Gestão da composição da Comissão de Avaliação conforme Art. 21.º-24.º do RADFP
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select 
              value={selectedCicloId || ""} 
              onValueChange={(value) => setSelectedCicloId(value || null)}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Selecionar ciclo de avaliação" />
              </SelectTrigger>
              <SelectContent>
                {ciclos?.map((ciclo) => (
                  <SelectItem key={ciclo.id} value={ciclo.id}>
                    {formatCicloLabel(ciclo)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Info Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Composição da Comissão</AlertTitle>
          <AlertDescription>
            A Comissão de Avaliação é composta por <strong>5 membros efectivos</strong> (incluindo o Presidente) 
            e <strong>2 membros suplentes</strong>, conforme estabelecido no Art. 22.º do RADFP.
          </AlertDescription>
        </Alert>

        {!selectedCicloId ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                Selecione um ciclo de avaliação para gerir a composição da comissão.
              </p>
            </CardContent>
          </Card>
        ) : loadingMembros ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              A carregar membros da comissão...
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Membros Efectivos */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Membros Efectivos
                    </CardTitle>
                    <CardDescription>
                      {membrosEfectivos.length} de {LIMITE_EFECTIVOS} membros
                    </CardDescription>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleOpenAddModal("efectivo")}
                    disabled={!podeAdicionarEfectivo}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
                
                {/* Status da composição */}
                <div className="flex items-center gap-2 mt-2">
                  {temPresidente ? (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Presidente designado
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-600 border-amber-600">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Sem presidente
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {membrosEfectivos.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum membro efectivo designado.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Cargo</TableHead>
                        <TableHead className="w-20">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {membrosEfectivos.map((membro) => (
                        <TableRow key={membro.id}>
                          <TableCell className="font-medium">{membro.ordem}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{membro.profile?.full_name}</span>
                              <span className="text-xs text-muted-foreground">
                                {membro.profile?.job_title || membro.profile?.email}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {membro.cargo_comissao === "presidente" ? (
                              <Badge className="bg-amber-500 hover:bg-amber-600">
                                <Crown className="h-3 w-3 mr-1" />
                                Presidente
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Vogal</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleOpenSubstituirModal(membro)}
                                disabled={suplentesDisponiveis.length === 0}
                                title="Substituir por suplente"
                              >
                                <ArrowRightLeft className="h-4 w-4 text-primary" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setMembroToRemove(membro)}
                                title="Remover membro"
                              >
                                <UserMinus className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Membros Suplentes */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Membros Suplentes
                    </CardTitle>
                    <CardDescription>
                      {membrosSuplentes.length} de {LIMITE_SUPLENTES} membros
                    </CardDescription>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleOpenAddModal("suplente")}
                    disabled={!podeAdicionarSuplente}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {membrosSuplentes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum membro suplente designado.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead className="w-20">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {membrosSuplentes.map((membro) => (
                        <TableRow key={membro.id}>
                          <TableCell className="font-medium">{membro.ordem}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{membro.profile?.full_name}</span>
                              <span className="text-xs text-muted-foreground">
                                {membro.profile?.job_title || membro.profile?.email}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setMembroToRemove(membro)}
                            >
                              <UserMinus className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Member Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Adicionar Membro {tipoMembroAdd === "efectivo" ? "Efectivo" : "Suplente"}
              </DialogTitle>
              <DialogDescription>
                Selecione um colaborador para integrar a Comissão de Avaliação.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Colaborador *</Label>
                <Select 
                  value={formData.user_id} 
                  onValueChange={(value) => setFormData({ ...formData, user_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar colaborador" />
                  </SelectTrigger>
                  <SelectContent>
                    {profilesDisponiveis.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.full_name} {profile.job_title && `- ${profile.job_title}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {tipoMembroAdd === "efectivo" && (
                <div className="space-y-2">
                  <Label>Cargo na Comissão *</Label>
                  <Select 
                    value={formData.cargo_comissao} 
                    onValueChange={(value: "presidente" | "vogal") => 
                      setFormData({ ...formData, cargo_comissao: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presidente" disabled={temPresidente}>
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-amber-500" />
                          Presidente
                          {temPresidente && " (já designado)"}
                        </div>
                      </SelectItem>
                      <SelectItem value="vogal">Vogal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  value={formData.observacoes || ""}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Observações adicionais (opcional)"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleAddMembro} 
                disabled={!formData.user_id || addMembro.isPending}
              >
                {addMembro.isPending ? "A adicionar..." : "Adicionar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Remove Confirmation Dialog */}
        <ConfirmDialog
          open={!!membroToRemove}
          onOpenChange={(open) => !open && setMembroToRemove(null)}
          title="Remover membro da comissão"
          description={`Tem a certeza que deseja remover ${membroToRemove?.profile?.full_name} da Comissão de Avaliação?`}
          onConfirm={handleRemoveMembro}
        />

        {/* Substituir Modal */}
        <Dialog open={isSubstituirModalOpen} onOpenChange={setIsSubstituirModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5" />
                Substituir Membro Efectivo
              </DialogTitle>
              <DialogDescription>
                Substituir <strong>{membroToSubstituir?.profile?.full_name}</strong> por um membro suplente.
                O membro efectivo será cessado e o suplente assumirá a sua posição.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Membro Suplente *</Label>
                <Select 
                  value={substituicaoData.suplenteId} 
                  onValueChange={(value) => setSubstituicaoData(prev => ({ ...prev, suplenteId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar suplente" />
                  </SelectTrigger>
                  <SelectContent>
                    {suplentesDisponiveis.map((suplente) => (
                      <SelectItem key={suplente.id} value={suplente.id}>
                        {suplente.profile?.full_name} {suplente.profile?.job_title && `- ${suplente.profile.job_title}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Motivo da Substituição</Label>
                <Textarea
                  value={substituicaoData.motivo}
                  onChange={(e) => setSubstituicaoData(prev => ({ ...prev, motivo: e.target.value }))}
                  placeholder="Ex: Ausência prolongada, impedimento legal, etc."
                  rows={3}
                />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  O membro suplente assumirá o cargo de <strong>{membroToSubstituir?.cargo_comissao === "presidente" ? "Presidente" : "Vogal"}</strong> e 
                  a posição #{membroToSubstituir?.ordem} na comissão.
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSubstituirModalOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSubstituir} 
                disabled={!substituicaoData.suplenteId || substituirMembro.isPending}
              >
                {substituirMembro.isPending ? "A substituir..." : "Confirmar Substituição"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
