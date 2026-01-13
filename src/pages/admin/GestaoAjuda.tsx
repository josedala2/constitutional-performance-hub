import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Plus, Search, Edit2, Trash2, BookOpen, Save, X, Loader2,
  HelpCircle, LayoutDashboard, Users, ClipboardCheck, Target, 
  Brain, Calendar, FileText, UserCog, Shield, Building2, ScrollText, Scale,
  GripVertical
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAllHelpContent, HelpContent, HelpSection, RelatedLink } from "@/hooks/useHelpContent";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";

const ICON_OPTIONS = [
  { value: "HelpCircle", label: "Ajuda", icon: HelpCircle },
  { value: "LayoutDashboard", label: "Dashboard", icon: LayoutDashboard },
  { value: "Users", label: "Utilizadores", icon: Users },
  { value: "ClipboardCheck", label: "Avaliações", icon: ClipboardCheck },
  { value: "Target", label: "Objetivos", icon: Target },
  { value: "Brain", label: "Competências", icon: Brain },
  { value: "Calendar", label: "Calendário", icon: Calendar },
  { value: "FileText", label: "Documentos", icon: FileText },
  { value: "UserCog", label: "Configurações", icon: UserCog },
  { value: "Shield", label: "Segurança", icon: Shield },
  { value: "Building2", label: "Organização", icon: Building2 },
  { value: "ScrollText", label: "Auditoria", icon: ScrollText },
  { value: "Scale", label: "Legal", icon: Scale },
];

interface FormData {
  route: string;
  title: string;
  description: string;
  icon: string;
  sections: HelpSection[];
  tips: string[];
  related_links: RelatedLink[];
  legal_references: string[];
  keywords: string[];
}

const emptyFormData: FormData = {
  route: "",
  title: "",
  description: "",
  icon: "HelpCircle",
  sections: [],
  tips: [],
  related_links: [],
  legal_references: [],
  keywords: [],
};

export default function GestaoAjuda() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: helpContents = [], isLoading } = useAllHelpContent();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<HelpContent | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyFormData);
  const [isSaving, setIsSaving] = useState(false);
  
  // Drag and drop state for sections
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);
  const [dragOverSectionIndex, setDragOverSectionIndex] = useState<number | null>(null);
  const dragSectionRef = useRef<HTMLDivElement | null>(null);
  
  // Drag and drop state for tips
  const [draggedTipIndex, setDraggedTipIndex] = useState<number | null>(null);
  const [dragOverTipIndex, setDragOverTipIndex] = useState<number | null>(null);
  
  // Drag and drop state for related links
  const [draggedLinkIndex, setDraggedLinkIndex] = useState<number | null>(null);
  const [dragOverLinkIndex, setDragOverLinkIndex] = useState<number | null>(null);
  
  // Drag and drop state for legal references
  const [draggedLegalRefIndex, setDraggedLegalRefIndex] = useState<number | null>(null);
  const [dragOverLegalRefIndex, setDragOverLegalRefIndex] = useState<number | null>(null);
  
  // Temporary inputs for arrays
  const [newSection, setNewSection] = useState({ title: "", content: "" });
  const [newTip, setNewTip] = useState("");
  const [newLink, setNewLink] = useState({ label: "", href: "" });
  const [newLegalRef, setNewLegalRef] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  const filteredContents = helpContents.filter(content =>
    content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreateDialog = () => {
    setSelectedContent(null);
    setFormData(emptyFormData);
    setDialogOpen(true);
  };

  const openEditDialog = (content: HelpContent) => {
    setSelectedContent(content);
    setFormData({
      route: content.route,
      title: content.title,
      description: content.description,
      icon: content.icon,
      sections: content.sections || [],
      tips: content.tips || [],
      related_links: content.related_links || [],
      legal_references: content.legal_references || [],
      keywords: content.keywords || [],
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (content: HelpContent) => {
    setSelectedContent(content);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.route || !formData.title || !formData.description) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios (rota, título e descrição).",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        route: formData.route.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        icon: formData.icon,
        sections: JSON.parse(JSON.stringify(formData.sections)),
        tips: formData.tips,
        related_links: JSON.parse(JSON.stringify(formData.related_links)),
        legal_references: formData.legal_references,
        keywords: formData.keywords,
      };

      if (selectedContent) {
        const { error } = await supabase
          .from("help_content")
          .update(payload)
          .eq("id", selectedContent.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Conteúdo de ajuda atualizado.",
        });
      } else {
        const { error } = await supabase
          .from("help_content")
          .insert([payload]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Conteúdo de ajuda criado.",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["help-content-all"] });
      queryClient.invalidateQueries({ queryKey: ["help-content"] });
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível guardar o conteúdo.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedContent) return;

    try {
      const { error } = await supabase
        .from("help_content")
        .delete()
        .eq("id", selectedContent.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Conteúdo de ajuda eliminado.",
      });

      queryClient.invalidateQueries({ queryKey: ["help-content-all"] });
      queryClient.invalidateQueries({ queryKey: ["help-content"] });
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível eliminar o conteúdo.",
        variant: "destructive",
      });
    }
  };

  // Array management functions
  const addSection = () => {
    if (newSection.title && newSection.content) {
      setFormData(prev => ({
        ...prev,
        sections: [...prev.sections, { ...newSection }],
      }));
      setNewSection({ title: "", content: "" });
    }
  };

  const removeSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  // Drag and drop handlers for sections
  const handleSectionDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedSectionIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
    if (dragSectionRef.current) {
      dragSectionRef.current.style.opacity = "0.5";
    }
  };

  const handleSectionDragEnd = () => {
    setDraggedSectionIndex(null);
    setDragOverSectionIndex(null);
    if (dragSectionRef.current) {
      dragSectionRef.current.style.opacity = "1";
    }
  };

  const handleSectionDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedSectionIndex !== null && draggedSectionIndex !== index) {
      setDragOverSectionIndex(index);
    }
  };

  const handleSectionDragLeave = () => {
    setDragOverSectionIndex(null);
  };

  const handleSectionDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedSectionIndex === null || draggedSectionIndex === targetIndex) {
      setDragOverSectionIndex(null);
      return;
    }

    setFormData(prev => {
      const newSections = [...prev.sections];
      const [draggedItem] = newSections.splice(draggedSectionIndex, 1);
      newSections.splice(targetIndex, 0, draggedItem);
      return { ...prev, sections: newSections };
    });

    setDraggedSectionIndex(null);
    setDragOverSectionIndex(null);
  };

  const addTip = () => {
    if (newTip.trim()) {
      setFormData(prev => ({
        ...prev,
        tips: [...prev.tips, newTip.trim()],
      }));
      setNewTip("");
    }
  };

  const removeTip = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tips: prev.tips.filter((_, i) => i !== index),
    }));
  };

  // Drag and drop handlers for tips
  const handleTipDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedTipIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleTipDragEnd = () => {
    setDraggedTipIndex(null);
    setDragOverTipIndex(null);
  };

  const handleTipDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedTipIndex !== null && draggedTipIndex !== index) {
      setDragOverTipIndex(index);
    }
  };

  const handleTipDragLeave = () => {
    setDragOverTipIndex(null);
  };

  const handleTipDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedTipIndex === null || draggedTipIndex === targetIndex) {
      setDragOverTipIndex(null);
      return;
    }

    setFormData(prev => {
      const newTips = [...prev.tips];
      const [draggedItem] = newTips.splice(draggedTipIndex, 1);
      newTips.splice(targetIndex, 0, draggedItem);
      return { ...prev, tips: newTips };
    });

    setDraggedTipIndex(null);
    setDragOverTipIndex(null);
  };

  const addLink = () => {
    if (newLink.label && newLink.href) {
      setFormData(prev => ({
        ...prev,
        related_links: [...prev.related_links, { ...newLink }],
      }));
      setNewLink({ label: "", href: "" });
    }
  };

  const removeLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      related_links: prev.related_links.filter((_, i) => i !== index),
    }));
  };

  // Drag and drop handlers for related links
  const handleLinkDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedLinkIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleLinkDragEnd = () => {
    setDraggedLinkIndex(null);
    setDragOverLinkIndex(null);
  };

  const handleLinkDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedLinkIndex !== null && draggedLinkIndex !== index) {
      setDragOverLinkIndex(index);
    }
  };

  const handleLinkDragLeave = () => {
    setDragOverLinkIndex(null);
  };

  const handleLinkDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedLinkIndex === null || draggedLinkIndex === targetIndex) {
      setDragOverLinkIndex(null);
      return;
    }

    setFormData(prev => {
      const newLinks = [...prev.related_links];
      const [draggedItem] = newLinks.splice(draggedLinkIndex, 1);
      newLinks.splice(targetIndex, 0, draggedItem);
      return { ...prev, related_links: newLinks };
    });

    setDraggedLinkIndex(null);
    setDragOverLinkIndex(null);
  };

  const addLegalRef = () => {
    if (newLegalRef.trim()) {
      setFormData(prev => ({
        ...prev,
        legal_references: [...prev.legal_references, newLegalRef.trim()],
      }));
      setNewLegalRef("");
    }
  };

  const removeLegalRef = (index: number) => {
    setFormData(prev => ({
      ...prev,
      legal_references: prev.legal_references.filter((_, i) => i !== index),
    }));
  };

  // Drag and drop handlers for legal references
  const handleLegalRefDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedLegalRefIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleLegalRefDragEnd = () => {
    setDraggedLegalRefIndex(null);
    setDragOverLegalRefIndex(null);
  };

  const handleLegalRefDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedLegalRefIndex !== null && draggedLegalRefIndex !== index) {
      setDragOverLegalRefIndex(index);
    }
  };

  const handleLegalRefDragLeave = () => {
    setDragOverLegalRefIndex(null);
  };

  const handleLegalRefDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedLegalRefIndex === null || draggedLegalRefIndex === targetIndex) {
      setDragOverLegalRefIndex(null);
      return;
    }

    setFormData(prev => {
      const newRefs = [...prev.legal_references];
      const [draggedItem] = newRefs.splice(draggedLegalRefIndex, 1);
      newRefs.splice(targetIndex, 0, draggedItem);
      return { ...prev, legal_references: newRefs };
    });

    setDraggedLegalRefIndex(null);
    setDragOverLegalRefIndex(null);
  };

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()],
      }));
      setNewKeyword("");
    }
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index),
    }));
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = ICON_OPTIONS.find(opt => opt.value === iconName);
    return iconOption?.icon || HelpCircle;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Gestão de Ajuda</h1>
            <p className="text-muted-foreground">Gerir conteúdos de ajuda contextual do sistema</p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Conteúdo
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por título, rota ou descrição..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredContents.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>Nenhum conteúdo de ajuda encontrado</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Rota</TableHead>
                    <TableHead className="hidden md:table-cell">Secções</TableHead>
                    <TableHead className="hidden lg:table-cell">Dicas</TableHead>
                    <TableHead className="w-24">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContents.map((content) => {
                    const IconComponent = getIconComponent(content.icon);
                    return (
                      <TableRow key={content.id}>
                        <TableCell>
                          <div className="p-2 rounded-md bg-primary/10 w-fit">
                            <IconComponent className="h-4 w-4 text-primary" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{content.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {content.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs">
                            {content.route}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {content.sections?.length || 0}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {content.tips?.length || 0}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(content)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(content)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>
              {selectedContent ? "Editar Conteúdo de Ajuda" : "Novo Conteúdo de Ajuda"}
            </DialogTitle>
            <DialogDescription>
              Preencha os campos para configurar a ajuda contextual desta página.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[calc(90vh-180px)] p-6 pt-4">
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="route">Rota *</Label>
                  <Input
                    id="route"
                    placeholder="/exemplo/pagina"
                    value={formData.route}
                    onChange={(e) => setFormData(prev => ({ ...prev, route: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Ícone</Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map((option) => {
                        const IconComp = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <IconComp className="h-4 w-4" />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  placeholder="Título da ajuda"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  placeholder="Descrição breve do conteúdo desta página"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <Separator />

              {/* Sections */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Secções</Label>
                  {formData.sections.length > 1 && (
                    <span className="text-xs text-muted-foreground">
                      Arraste para reordenar
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {formData.sections.map((section, index) => (
                    <div
                      key={index}
                      ref={draggedSectionIndex === index ? dragSectionRef : null}
                      draggable
                      onDragStart={(e) => handleSectionDragStart(e, index)}
                      onDragEnd={handleSectionDragEnd}
                      onDragOver={(e) => handleSectionDragOver(e, index)}
                      onDragLeave={handleSectionDragLeave}
                      onDrop={(e) => handleSectionDrop(e, index)}
                      className={`flex items-start gap-2 p-3 rounded-lg border bg-muted/30 cursor-move transition-all ${
                        dragOverSectionIndex === index
                          ? "border-primary border-2 bg-primary/5"
                          : ""
                      } ${
                        draggedSectionIndex === index
                          ? "opacity-50"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-center h-full pt-1 text-muted-foreground hover:text-foreground">
                        <GripVertical className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{section.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{section.content}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeSection(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="grid gap-2">
                  <Input
                    placeholder="Título da secção"
                    value={newSection.title}
                    onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Conteúdo da secção"
                    value={newSection.content}
                    onChange={(e) => setNewSection(prev => ({ ...prev, content: e.target.value }))}
                    rows={2}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addSection}>
                    <Plus className="h-4 w-4 mr-1" /> Adicionar Secção
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Tips */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Dicas</Label>
                  {formData.tips.length > 1 && (
                    <span className="text-xs text-muted-foreground">
                      Arraste para reordenar
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {formData.tips.map((tip, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={(e) => handleTipDragStart(e, index)}
                      onDragEnd={handleTipDragEnd}
                      onDragOver={(e) => handleTipDragOver(e, index)}
                      onDragLeave={handleTipDragLeave}
                      onDrop={(e) => handleTipDrop(e, index)}
                      className={`flex items-center gap-2 p-2 rounded-lg border bg-muted/30 cursor-move transition-all ${
                        dragOverTipIndex === index
                          ? "border-primary border-2 bg-primary/5"
                          : ""
                      } ${
                        draggedTipIndex === index
                          ? "opacity-50"
                          : ""
                      }`}
                    >
                      <div className="text-muted-foreground hover:text-foreground">
                        <GripVertical className="h-4 w-4" />
                      </div>
                      <span className="flex-1 text-sm truncate">{tip}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeTip(index)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nova dica"
                    value={newTip}
                    onChange={(e) => setNewTip(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTip())}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addTip}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Related Links */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Links Relacionados</Label>
                  {formData.related_links.length > 1 && (
                    <span className="text-xs text-muted-foreground">
                      Arraste para reordenar
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {formData.related_links.map((link, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={(e) => handleLinkDragStart(e, index)}
                      onDragEnd={handleLinkDragEnd}
                      onDragOver={(e) => handleLinkDragOver(e, index)}
                      onDragLeave={handleLinkDragLeave}
                      onDrop={(e) => handleLinkDrop(e, index)}
                      className={`flex items-center gap-2 p-2 rounded-lg border bg-muted/30 cursor-move transition-all ${
                        dragOverLinkIndex === index
                          ? "border-primary border-2 bg-primary/5"
                          : ""
                      } ${
                        draggedLinkIndex === index
                          ? "opacity-50"
                          : ""
                      }`}
                    >
                      <div className="text-muted-foreground hover:text-foreground">
                        <GripVertical className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">{link.label}</span>
                      <span className="text-xs text-muted-foreground flex-1">→ {link.href}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeLink(index)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Label"
                    value={newLink.label}
                    onChange={(e) => setNewLink(prev => ({ ...prev, label: e.target.value }))}
                  />
                  <Input
                    placeholder="/rota"
                    value={newLink.href}
                    onChange={(e) => setNewLink(prev => ({ ...prev, href: e.target.value }))}
                  />
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addLink}>
                  <Plus className="h-4 w-4 mr-1" /> Adicionar Link
                </Button>
              </div>

              <Separator />

              {/* Legal References */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Referências Legais</Label>
                  {formData.legal_references.length > 1 && (
                    <span className="text-xs text-muted-foreground">
                      Arraste para reordenar
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {formData.legal_references.map((ref, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={(e) => handleLegalRefDragStart(e, index)}
                      onDragEnd={handleLegalRefDragEnd}
                      onDragOver={(e) => handleLegalRefDragOver(e, index)}
                      onDragLeave={handleLegalRefDragLeave}
                      onDrop={(e) => handleLegalRefDrop(e, index)}
                      className={`flex items-center gap-2 p-2 rounded-lg border bg-muted/30 cursor-move transition-all ${
                        dragOverLegalRefIndex === index
                          ? "border-primary border-2 bg-primary/5"
                          : ""
                      } ${
                        draggedLegalRefIndex === index
                          ? "opacity-50"
                          : ""
                      }`}
                    >
                      <div className="text-muted-foreground hover:text-foreground">
                        <GripVertical className="h-4 w-4" />
                      </div>
                      <span className="flex-1 text-sm truncate">{ref}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeLegalRef(index)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: Lei n.º 66-B/2007"
                    value={newLegalRef}
                    onChange={(e) => setNewLegalRef(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLegalRef())}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addLegalRef}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Keywords */}
              <div className="space-y-3">
                <Label>Palavras-chave (para pesquisa)</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.keywords.map((kw, index) => (
                    <Badge key={index} variant="secondary" className="gap-1 pr-1">
                      {kw}
                      <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={() => removeKeyword(index)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nova palavra-chave"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addKeyword}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="p-6 pt-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  A guardar...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar Conteúdo de Ajuda"
        description={`Tem a certeza que deseja eliminar a ajuda para "${selectedContent?.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Eliminar"
        onConfirm={handleDelete}
        variant="danger"
      />
    </AppLayout>
  );
}
