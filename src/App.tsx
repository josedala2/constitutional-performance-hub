import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import CiclosAvaliacao from "./pages/CiclosAvaliacao";
import Colaboradores from "./pages/Colaboradores";
import Objectivos from "./pages/Objectivos";
import Competencias from "./pages/Competencias";
import Avaliacoes from "./pages/Avaliacoes";
import Relatorios from "./pages/Relatorios";
import Documentos from "./pages/Documentos";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";
import FichaPessoalTecnico from "./pages/avaliacoes/FichaPessoalTecnico";
import FichaEntrePares from "./pages/avaliacoes/FichaEntrePares";
import FichaUtentesInternos from "./pages/avaliacoes/FichaUtentesInternos";
import FichaUtentesExternos from "./pages/avaliacoes/FichaUtentesExternos";
import FichaAcompanhamento from "./pages/avaliacoes/FichaAcompanhamento";
import RelatorioDesempenhoSuperior from "./pages/relatorios/RelatorioDesempenhoSuperior";
import RelatorioEntrePares from "./pages/relatorios/RelatorioEntrePares";
import RelatorioUtentesInternos from "./pages/relatorios/RelatorioUtentesInternos";
import RelatorioUtentesExternos from "./pages/relatorios/RelatorioUtentesExternos";
import ProcessoAvaliacao from "./pages/ProcessoAvaliacao";
import Auth from "./pages/Auth";
import Utilizadores from "./pages/admin/Utilizadores";
import Perfis from "./pages/admin/Perfis";
import Permissoes from "./pages/admin/Permissoes";
import Auditoria from "./pages/admin/Auditoria";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/ciclos" element={<CiclosAvaliacao />} />
            <Route path="/colaboradores" element={<Colaboradores />} />
            <Route path="/objectivos" element={<Objectivos />} />
            <Route path="/competencias" element={<Competencias />} />
            <Route path="/avaliacoes" element={<Avaliacoes />} />
            <Route path="/avaliacoes/pessoal-tecnico" element={<FichaPessoalTecnico />} />
            <Route path="/avaliacoes/entre-pares" element={<FichaEntrePares />} />
            <Route path="/avaliacoes/utentes-internos" element={<FichaUtentesInternos />} />
            <Route path="/avaliacoes/utentes-externos" element={<FichaUtentesExternos />} />
            <Route path="/avaliacoes/acompanhamento" element={<FichaAcompanhamento />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/relatorios/desempenho-superior" element={<RelatorioDesempenhoSuperior />} />
            <Route path="/relatorios/entre-pares" element={<RelatorioEntrePares />} />
            <Route path="/relatorios/utentes-internos" element={<RelatorioUtentesInternos />} />
            <Route path="/relatorios/utentes-externos" element={<RelatorioUtentesExternos />} />
            <Route path="/processo" element={<ProcessoAvaliacao />} />
            <Route path="/documentos" element={<Documentos />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            {/* Admin Routes */}
            <Route path="/admin/utilizadores" element={<Utilizadores />} />
            <Route path="/admin/perfis" element={<Perfis />} />
            <Route path="/admin/permissoes" element={<Permissoes />} />
            <Route path="/admin/auditoria" element={<Auditoria />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
