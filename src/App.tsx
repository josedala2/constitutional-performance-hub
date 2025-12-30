import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/guards/AuthGuard";
import { AdminGuard } from "@/components/guards/AdminGuard";
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
import FluxogramaAvaliacao from "./pages/FluxogramaAvaliacao";
import Auth from "./pages/Auth";
import MeuPerfil from "./pages/MeuPerfil";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Utilizadores from "./pages/admin/Utilizadores";
import Perfis from "./pages/admin/Perfis";
import Permissoes from "./pages/admin/Permissoes";
import Auditoria from "./pages/admin/Auditoria";
import UnidadesOrganicas from "./pages/admin/UnidadesOrganicas";
import ConsultaAvaliacoes from "./pages/ConsultaAvaliacoes";
import Instalar from "./pages/Instalar";

const queryClient = new QueryClient();

// Componente wrapper para rotas protegidas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/instalar" element={<Instalar />} />
            
            {/* Rotas protegidas */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/ciclos" element={<ProtectedRoute><CiclosAvaliacao /></ProtectedRoute>} />
            <Route path="/colaboradores" element={<ProtectedRoute><Colaboradores /></ProtectedRoute>} />
            <Route path="/objectivos" element={<ProtectedRoute><Objectivos /></ProtectedRoute>} />
            <Route path="/competencias" element={<ProtectedRoute><Competencias /></ProtectedRoute>} />
            <Route path="/avaliacoes" element={<ProtectedRoute><Avaliacoes /></ProtectedRoute>} />
            <Route path="/avaliacoes/pessoal-tecnico" element={<ProtectedRoute><FichaPessoalTecnico /></ProtectedRoute>} />
            <Route path="/avaliacoes/entre-pares" element={<ProtectedRoute><FichaEntrePares /></ProtectedRoute>} />
            <Route path="/avaliacoes/utentes-internos" element={<ProtectedRoute><FichaUtentesInternos /></ProtectedRoute>} />
            <Route path="/avaliacoes/utentes-externos" element={<ProtectedRoute><FichaUtentesExternos /></ProtectedRoute>} />
            <Route path="/avaliacoes/acompanhamento" element={<ProtectedRoute><FichaAcompanhamento /></ProtectedRoute>} />
            <Route path="/consulta-avaliacoes" element={<ProtectedRoute><ConsultaAvaliacoes /></ProtectedRoute>} />
            <Route path="/relatorios" element={<ProtectedRoute><Relatorios /></ProtectedRoute>} />
            <Route path="/relatorios/desempenho-superior" element={<ProtectedRoute><RelatorioDesempenhoSuperior /></ProtectedRoute>} />
            <Route path="/relatorios/entre-pares" element={<ProtectedRoute><RelatorioEntrePares /></ProtectedRoute>} />
            <Route path="/relatorios/utentes-internos" element={<ProtectedRoute><RelatorioUtentesInternos /></ProtectedRoute>} />
            <Route path="/relatorios/utentes-externos" element={<ProtectedRoute><RelatorioUtentesExternos /></ProtectedRoute>} />
            <Route path="/processo" element={<ProtectedRoute><ProcessoAvaliacao /></ProtectedRoute>} />
            <Route path="/fluxograma" element={<ProtectedRoute><FluxogramaAvaliacao /></ProtectedRoute>} />
            <Route path="/documentos" element={<ProtectedRoute><Documentos /></ProtectedRoute>} />
            <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
            <Route path="/meu-perfil" element={<ProtectedRoute><MeuPerfil /></ProtectedRoute>} />
            
            {/* Rotas de Administração - apenas ADMIN e RH */}
            <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
            <Route path="/admin/utilizadores" element={<AdminGuard><Utilizadores /></AdminGuard>} />
            <Route path="/admin/perfis" element={<AdminGuard><Perfis /></AdminGuard>} />
            <Route path="/admin/permissoes" element={<AdminGuard><Permissoes /></AdminGuard>} />
            <Route path="/admin/auditoria" element={<AdminGuard><Auditoria /></AdminGuard>} />
            <Route path="/admin/unidades" element={<AdminGuard><UnidadesOrganicas /></AdminGuard>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
