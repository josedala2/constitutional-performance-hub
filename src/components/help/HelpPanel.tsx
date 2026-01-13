import { useState } from "react";
import { useLocation } from "react-router-dom";
import { HelpCircle, X, BookOpen, Lightbulb, Link as LinkIcon, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getHelpContent, HelpContent } from "@/config/helpContent";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface HelpPanelProps {
  className?: string;
}

export function HelpPanel({ className }: HelpPanelProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const helpContent = getHelpContent(location.pathname);

  if (!helpContent) {
    return null;
  }

  const IconComponent = helpContent.icon;

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
        <SheetHeader className="p-6 pb-4 bg-muted/30 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-lg font-serif">{helpContent.title}</SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">{helpContent.description}</p>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {/* Main Sections */}
            <Accordion type="multiple" defaultValue={helpContent.sections.map((_, i) => `section-${i}`)} className="w-full">
              {helpContent.sections.map((section, index) => (
                <AccordionItem key={index} value={`section-${index}`} className="border-b-0">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{section.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground whitespace-pre-line pl-6">
                    {section.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Tips */}
            {helpContent.tips && helpContent.tips.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <h3 className="font-medium text-sm">Dicas</h3>
                  </div>
                  <ul className="space-y-2">
                    {helpContent.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-amber-500 mt-0.5">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Legal Reference */}
            {helpContent.legalReference && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-primary" />
                    <h3 className="font-medium text-sm">Referência Legal</h3>
                  </div>
                  <Badge variant="secondary" className="font-normal">
                    {helpContent.legalReference}
                  </Badge>
                </div>
              </>
            )}

            {/* Related Links */}
            {helpContent.relatedLinks && helpContent.relatedLinks.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-primary" />
                    <h3 className="font-medium text-sm">Links Relacionados</h3>
                  </div>
                  <div className="space-y-2">
                    {helpContent.relatedLinks.map((link, index) => (
                      <Link
                        key={index}
                        to={link.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <span>→</span>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

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
