import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Target,
  ClipboardCheck,
  BarChart3,
  Shield,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  CheckCircle2,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  details: string[];
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Bem-vindo ao SGAD",
    description: "Sistema de Gestão de Avaliação de Desempenho do Tribunal de Contas",
    icon: Sparkles,
    color: "from-primary to-primary/80",
    details: [
      "Baseado no RADFP (Decreto Presidencial N.º 173/25)",
      "Gestão completa do ciclo de avaliação",
      "Conformidade legal garantida",
    ],
  },
  {
    id: "dashboard",
    title: "Painel Principal",
    description: "Visão geral do estado das avaliações e métricas principais",
    icon: LayoutDashboard,
    color: "from-blue-500 to-blue-600",
    details: [
      "Estatísticas em tempo real",
      "Progresso das avaliações",
      "Alertas e notificações importantes",
    ],
  },
  {
    id: "ciclos",
    title: "Ciclos de Avaliação",
    description: "Gestão dos períodos de avaliação anuais e semestrais",
    icon: Calendar,
    color: "from-green-500 to-green-600",
    details: [
      "Criação de ciclos anuais/semestrais",
      "Definição de datas de início e fim",
      "Controlo do estado do ciclo",
    ],
  },
  {
    id: "colaboradores",
    title: "Colaboradores",
    description: "Gestão dos funcionários e suas informações",
    icon: Users,
    color: "from-purple-500 to-purple-600",
    details: [
      "Cadastro de funcionários",
      "Associação a unidades orgânicas",
      "Atribuição de avaliadores",
    ],
  },
  {
    id: "objectivos",
    title: "Objectivos",
    description: "Definição e acompanhamento de metas SMART",
    icon: Target,
    color: "from-orange-500 to-orange-600",
    details: [
      "Objectivos específicos, mensuráveis, alcançáveis",
      "Peso de 60% na nota final",
      "Acompanhamento trimestral",
    ],
  },
  {
    id: "avaliacoes",
    title: "Avaliações",
    description: "Fichas de avaliação por categoria",
    icon: ClipboardCheck,
    color: "from-red-500 to-red-600",
    details: [
      "Avaliação Pessoal Técnico/Não Técnico",
      "Avaliação Entre Pares",
      "Avaliação por Utentes (Internos e Externos)",
    ],
  },
  {
    id: "relatorios",
    title: "Relatórios",
    description: "Relatórios oficiais e análises de desempenho",
    icon: BarChart3,
    color: "from-teal-500 to-teal-600",
    details: [
      "Relatórios por tipo de avaliação",
      "Exportação para PDF",
      "Conformidade com modelo oficial RADFP",
    ],
  },
  {
    id: "admin",
    title: "Administração",
    description: "Gestão do sistema, utilizadores e permissões",
    icon: Shield,
    color: "from-slate-500 to-slate-600",
    details: [
      "Gestão da Comissão de Avaliação",
      "Reclamações e Recursos (Art. 32-34)",
      "Auditoria e controlo de acessos",
    ],
  },
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function OnboardingTour({ isOpen, onClose, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const step = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;
  const isLastStep = currentStep === onboardingSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handlePrev = () => {
    if (isAnimating || isFirstStep) return;
    setIsAnimating(true);
    setCurrentStep((prev) => prev - 1);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleSkip = () => {
    onComplete();
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-2xl mx-4"
        >
          {/* Card */}
          <div className="bg-card rounded-2xl shadow-2xl border overflow-hidden">
            {/* Header with gradient */}
            <div className={cn("h-32 bg-gradient-to-r relative overflow-hidden", step.color)}>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAtMTZjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Step indicator */}
              <div className="absolute top-4 left-4 text-white/80 text-sm font-medium">
                {currentStep + 1} / {onboardingSteps.length}
              </div>

              {/* Icon */}
              <div className="absolute -bottom-8 left-8">
                <div className="h-20 w-20 rounded-2xl bg-card shadow-lg flex items-center justify-center border">
                  <step.icon className="h-10 w-10 text-primary" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="pt-14 px-8 pb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {step.title}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {step.description}
                  </p>

                  {/* Details list */}
                  <ul className="space-y-3 mb-8">
                    {step.details.map((detail, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>

              {/* Progress bar */}
              <div className="mb-6">
                <Progress value={progress} className="h-2" />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-muted-foreground"
                >
                  Saltar tour
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={isFirstStep}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="gap-2"
                  >
                    {isLastStep ? (
                      <>
                        Começar
                        <Play className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Próximo
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Step dots */}
            <div className="flex justify-center gap-2 pb-6">
              {onboardingSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === currentStep
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook para gerir o estado do onboarding
export function useOnboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(() => {
    return localStorage.getItem("sgad-onboarding-completed") === "true";
  });

  const startTour = () => setIsOpen(true);
  const closeTour = () => setIsOpen(false);
  
  const completeTour = () => {
    localStorage.setItem("sgad-onboarding-completed", "true");
    setHasCompleted(true);
    setIsOpen(false);
  };

  const resetTour = () => {
    localStorage.removeItem("sgad-onboarding-completed");
    setHasCompleted(false);
  };

  // Auto-show on first visit
  useEffect(() => {
    if (!hasCompleted) {
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [hasCompleted]);

  return {
    isOpen,
    hasCompleted,
    startTour,
    closeTour,
    completeTour,
    resetTour,
  };
}
