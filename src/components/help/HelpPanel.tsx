import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  HelpCircle, BookOpen, Lightbulb, Link as LinkIcon, Scale, Search, ArrowRight, X,
  LayoutDashboard, Users, ClipboardCheck, Target, Brain, Calendar, FileText, UserCog,
  Shield, Building2, ScrollText, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useHelpContent, useSearchHelpContent, HelpContent } from "@/hooks/useHelpContent";

interface HelpPanelProps {
  className?: string;
}

const iconMap: Record<string, React.ElementType> = {
  HelpCircle,
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Target,
  Brain,
  Calendar,
  FileText,
  UserCog,
  Shield,
  Building2,
  ScrollText,
  Scale,
};

function getIconComponent(iconName: string): React.ElementType {
  return iconMap[iconName] || HelpCircle;
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query || query.length < 2) return text;
  
  const normalizedQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const normalizedText = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const index = normalizedText.indexOf(normalizedQuery);
  
  if (index === -1) return text;
  
  const before = text.substring(0, index);
  const match = text.substring(index, index + query.length);
  const after = text.substring(index + query.length);
  
  return (
    <>
      {before}
      <mark className="bg-primary/20 text-primary font-medium rounded px-0.5">{match}</mark>
      {after}
    </>
  );
}

export function HelpPanel({ className }: HelpPanelProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"current" | "search">("current");
  const location = useLocation();
  const navigate = useNavigate();
  
  const { data: helpContent, isLoading: isLoadingContent } = useHelpContent(location.pathname);
  const { data: searchResults = [], isLoading: isSearching } = useSearchHelpContent(searchQuery);

  // Filter current page content based on local search
  const filteredSections = helpContent?.sections.filter(section => {
    if (!localSearchQuery || localSearchQuery.length < 2) return true;
    const query = localSearchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const titleMatch = section.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(query);
    const contentMatch = section.content.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(query);
    return titleMatch || contentMatch;
  }) || [];

  const filteredTips = helpContent?.tips?.filter(tip => {
    if (!localSearchQuery || localSearchQuery.length < 2) return true;
    const query = localSearchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return tip.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(query);
  }) || [];

  const filteredLegalRefs = helpContent?.legal_references?.filter(ref => {
    if (!localSearchQuery || localSearchQuery.length < 2) return true;
    const query = localSearchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return ref.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(query);
  }) || [];

  const filteredLinks = helpContent?.related_links?.filter(link => {
    if (!localSearchQuery || localSearchQuery.length < 2) return true;
    const query = localSearchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return link.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(query);
  }) || [];

  const hasLocalResults = localSearchQuery.length >= 2 && 
    (filteredSections.length > 0 || filteredTips.length > 0 || filteredLegalRefs.length > 0 || filteredLinks.length > 0);
  
  const noLocalResults = localSearchQuery.length >= 2 && 
    filteredSections.length === 0 && filteredTips.length === 0 && filteredLegalRefs.length === 0 && filteredLinks.length === 0;

  const handleResultClick = (route: string) => {
    navigate(route);
    setSearchQuery("");
    setActiveTab("current");
    setOpen(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.length >= 2) {
      setActiveTab("search");
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setActiveTab("current");
  };

  const clearLocalSearch = () => {
    setLocalSearchQuery("");
  };

  const IconComponent = helpContent ? getIconComponent(helpContent.icon) : HelpCircle;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground border-0",
                className
              )}
            >
              <HelpCircle className="h-6 w-6" />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Ajuda Contextual</p>
        </TooltipContent>
      </Tooltip>

      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 bg-muted/30 border-b space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-lg font-serif">
                {isLoadingContent ? "A carregar..." : helpContent?.title || "Ajuda"}
              </SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {helpContent?.description || "Informações de ajuda para esta página"}
              </p>
            </div>
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar em toda a ajuda..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "current" | "search")} className="flex-1 flex flex-col">
          <TabsList className="mx-6 mt-4 grid grid-cols-2">
            <TabsTrigger value="current" className="text-xs">
              Página Atual
            </TabsTrigger>
            <TabsTrigger value="search" className="text-xs">
              Resultados {isSearching ? "" : `(${searchResults.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="flex-1 m-0">
            <ScrollArea className="h-[calc(100vh-380px)] p-6">
              {/* Local Search for Current Page */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filtrar nesta página..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  className="pl-9 pr-9 h-9 text-sm"
                />
                {localSearchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={clearLocalSearch}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {isLoadingContent ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : helpContent ? (
                <div className="space-y-6">
                  {/* No results message */}
                  {noLocalResults && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">Nenhum resultado encontrado para "{localSearchQuery}"</p>
                      <p className="text-xs mt-1">Tente pesquisar globalmente na tab "Resultados"</p>
                    </div>
                  )}

                  {/* Local search results summary */}
                  {hasLocalResults && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b">
                      <span>
                        {filteredSections.length + filteredTips.length + filteredLegalRefs.length + filteredLinks.length} resultado(s) encontrado(s)
                      </span>
                      <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={clearLocalSearch}>
                        Limpar filtro
                      </Button>
                    </div>
                  )}

                  {/* Main Sections */}
                  {filteredSections.length > 0 && (
                    <Accordion type="multiple" defaultValue={filteredSections.map((_, i) => `section-${i}`)} className="w-full">
                      {filteredSections.map((section, index) => (
                        <AccordionItem key={index} value={`section-${index}`} className="border-b-0">
                          <AccordionTrigger className="hover:no-underline py-3">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-primary" />
                              <span className="font-medium text-sm">
                                {highlightMatch(section.title, localSearchQuery)}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-sm text-muted-foreground whitespace-pre-line pl-6">
                            {highlightMatch(section.content, localSearchQuery)}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}

                  {/* Tips */}
                  {filteredTips.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-amber-500" />
                          <h3 className="font-medium text-sm">Dicas</h3>
                        </div>
                        <ul className="space-y-2">
                          {filteredTips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="text-amber-500 mt-0.5">•</span>
                              {highlightMatch(tip, localSearchQuery)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}

                  {/* Legal References */}
                  {filteredLegalRefs.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Scale className="h-4 w-4 text-primary" />
                          <h3 className="font-medium text-sm">Referências Legais</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {filteredLegalRefs.map((ref, index) => (
                            <Badge key={index} variant="secondary" className="font-normal text-xs">
                              {highlightMatch(ref, localSearchQuery)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Related Links */}
                  {filteredLinks.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4 text-primary" />
                          <h3 className="font-medium text-sm">Links Relacionados</h3>
                        </div>
                        <div className="space-y-2">
                          {filteredLinks.map((link, index) => (
                            <Link
                              key={index}
                              to={link.href}
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-2 text-sm text-primary hover:underline"
                            >
                              <span>→</span>
                              {highlightMatch(link.label, localSearchQuery)}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="text-sm">Nenhuma ajuda disponível para esta página</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="search" className="flex-1 m-0">
            <ScrollArea className="h-[calc(100vh-320px)] p-6">
              {searchQuery.length < 2 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="text-sm">Digite pelo menos 2 caracteres para pesquisar</p>
                </div>
              ) : isSearching ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="text-sm">Nenhum resultado encontrado para "{searchQuery}"</p>
                  <p className="text-xs mt-2">Tente termos diferentes ou mais genéricos</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground mb-4">
                    {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
                  </p>
                  {searchResults.map((result: HelpContent) => {
                    const ResultIcon = getIconComponent(result.icon);
                    return (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result.route)}
                        className="w-full text-left p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-md bg-primary/10 shrink-0">
                            <ResultIcon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="font-medium text-sm truncate">
                                {highlightMatch(result.title, searchQuery)}
                              </h4>
                              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {highlightMatch(result.description, searchQuery)}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[10px] text-muted-foreground truncate">
                                {result.route}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            Precisa de mais ajuda? Contacte o suporte técnico.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
