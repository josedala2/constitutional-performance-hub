import tribunalLogo from "@/assets/tribunal-logo.png";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Objectivo {
  descricao: string;
  meta: string;
  metaRealizada: string;
  pontuacao: number;
  dataConclusao: string;
}

interface Competencia {
  nome: string;
  pontuacao: number;
  observacoes?: string;
}

interface ComponenteNAF {
  nome: string;
  peso: number;
  valor: number;
}

export interface RelatorioOficialData {
  // 1. Identificação do Avaliado
  nomeCompleto: string;
  orgaoServico: string;
  categoriaFuncao: string;
  superiorHierarquico: string;
  
  // 2. Objectivos Individuais (40%)
  objectivosIndividuais: Objectivo[];
  
  // 3. Objectivos de Equipa (20%)
  objectivosEquipa: Objectivo[];
  
  // 4. Competências Transversais (20%)
  competenciasTransversais: Competencia[];
  
  // 5. Competências Técnicas Específicas (20%)
  competenciasTecnicas: Competencia[];
  
  // 6. Nota de Avaliação Final (NAF)
  componentesNAF: ComponenteNAF[];
  naf: number;
  classificacaoFinal: string;
  
  // 7. Conclusão e Recomendações
  conclusao: string;
  
  // 8. Assinaturas
  dataAvaliador?: string;
  dataAvaliado?: string;
}

interface RelatorioOficialProps {
  data: RelatorioOficialData;
  showPrintStyles?: boolean;
}

export function RelatorioOficial({ data, showPrintStyles = true }: RelatorioOficialProps) {
  const containerClass = showPrintStyles 
    ? "hidden print:block print-content bg-white text-black p-6"
    : "bg-white text-black p-6 border rounded-lg";

  return (
    <div className={containerClass}>
      {/* Cabeçalho Oficial */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <img 
            src={tribunalLogo} 
            alt="Tribunal de Contas" 
            className="h-16 w-auto object-contain"
            style={{ maxHeight: '60px' }}
          />
        </div>
        <p className="text-xs uppercase tracking-widest text-gray-600 font-medium">
          República de Angola
        </p>
        <p className="text-sm font-semibold text-gray-800 mb-2">
          Tribunal de Contas
        </p>
        <p className="text-xs text-gray-600 mb-4">
          Sistema de Gestão de Avaliação de Desempenho (SGAD)
        </p>
        <h1 className="text-lg font-bold text-gray-900 font-serif border-b-2 border-gray-800 pb-2 inline-block">
          RELATÓRIO DE AVALIAÇÃO DE DESEMPENHO
        </h1>
      </div>

      {/* 1. Identificação do Avaliado */}
      <section className="mb-6">
        <h2 className="text-sm font-bold bg-gray-100 p-2 mb-3 border-l-4 border-gray-800">
          1. Identificação do Avaliado
        </h2>
        <Table className="border">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="border text-xs font-semibold text-gray-900 w-1/4">Nome Completo</TableHead>
              <TableHead className="border text-xs font-semibold text-gray-900 w-1/4">Órgão/Serviço</TableHead>
              <TableHead className="border text-xs font-semibold text-gray-900 w-1/4">Categoria/Função</TableHead>
              <TableHead className="border text-xs font-semibold text-gray-900 w-1/4">Superior Hierárquico</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="border text-xs">{data.nomeCompleto}</TableCell>
              <TableCell className="border text-xs">{data.orgaoServico}</TableCell>
              <TableCell className="border text-xs">{data.categoriaFuncao}</TableCell>
              <TableCell className="border text-xs">{data.superiorHierarquico}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      {/* 2. Objectivos Individuais (40%) */}
      <section className="mb-6">
        <h2 className="text-sm font-bold bg-gray-100 p-2 mb-3 border-l-4 border-gray-800">
          2. Objectivos Individuais (40%)
        </h2>
        <Table className="border">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="border text-xs font-semibold text-gray-900">Descrição</TableHead>
              <TableHead className="border text-xs font-semibold text-gray-900 w-20 text-center">Meta</TableHead>
              <TableHead className="border text-xs font-semibold text-gray-900 w-24 text-center">Meta Realizada</TableHead>
              <TableHead className="border text-xs font-semibold text-gray-900 w-24 text-center">Pontuação (1-5)</TableHead>
              <TableHead className="border text-xs font-semibold text-gray-900 w-28 text-center">Data de Conclusão</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.objectivosIndividuais.map((obj, index) => (
              <TableRow key={index}>
                <TableCell className="border text-xs">{obj.descricao}</TableCell>
                <TableCell className="border text-xs text-center">{obj.meta}</TableCell>
                <TableCell className="border text-xs text-center">{obj.metaRealizada}</TableCell>
                <TableCell className="border text-xs text-center font-medium">{obj.pontuacao}</TableCell>
                <TableCell className="border text-xs text-center">{obj.dataConclusao}</TableCell>
              </TableRow>
            ))}
            {data.objectivosIndividuais.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="border text-xs text-center text-gray-500 py-4">
                  Sem objectivos individuais registados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      {/* 3. Objectivos de Equipa (20%) */}
      <section className="mb-6">
        <h2 className="text-sm font-bold bg-gray-100 p-2 mb-3 border-l-4 border-gray-800">
          3. Objectivos de Equipa (20%)
        </h2>
        <Table className="border">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="border text-xs font-semibold text-gray-900">Descrição</TableHead>
              <TableHead className="border text-xs font-semibold text-gray-900 w-20 text-center">Meta</TableHead>
              <TableHead className="border text-xs font-semibold text-gray-900 w-24 text-center">Meta Realizada</TableHead>
              <TableHead className="border text-xs font-semibold text-gray-900 w-24 text-center">Pontuação (1-5)</TableHead>
              <TableHead className="border text-xs font-semibold text-gray-900 w-28 text-center">Data de Conclusão</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.objectivosEquipa.map((obj, index) => (
              <TableRow key={index}>
                <TableCell className="border text-xs">{obj.descricao}</TableCell>
                <TableCell className="border text-xs text-center">{obj.meta}</TableCell>
                <TableCell className="border text-xs text-center">{obj.metaRealizada}</TableCell>
                <TableCell className="border text-xs text-center font-medium">{obj.pontuacao}</TableCell>
                <TableCell className="border text-xs text-center">{obj.dataConclusao}</TableCell>
              </TableRow>
            ))}
            {data.objectivosEquipa.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="border text-xs text-center text-gray-500 py-4">
                  Sem objectivos de equipa registados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      {/* 4. Competências Transversais (20%) */}
      <section className="mb-6">
        <h2 className="text-sm font-bold bg-gray-100 p-2 mb-3 border-l-4 border-gray-800">
          4. Competências Transversais (20%)
        </h2>
        <Table className="border">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="border text-xs font-semibold text-gray-900">Competência</TableHead>
              <TableHead className="border text-xs font-semibold text-gray-900 w-24 text-center">Pontuação (1-5)</TableHead>
              <TableHead className="border text-xs font-semibold text-gray-900">Observações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.competenciasTransversais.map((comp, index) => (
              <TableRow key={index}>
                <TableCell className="border text-xs">{comp.nome}</TableCell>
                <TableCell className="border text-xs text-center font-medium">{comp.pontuacao}</TableCell>
                <TableCell className="border text-xs">{comp.observacoes || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      {/* 5. Competências Técnicas Específicas (20%) */}
      <section className="mb-6">
        <h2 className="text-sm font-bold bg-gray-100 p-2 mb-3 border-l-4 border-gray-800">
          5. Competências Técnicas Específicas (20%)
        </h2>
        <Table className="border">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="border text-xs font-semibold text-gray-900">Competência</TableHead>
              <TableHead className="border text-xs font-semibold text-gray-900 w-24 text-center">Pontuação (1-5)</TableHead>
              <TableHead className="border text-xs font-semibold text-gray-900">Observações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.competenciasTecnicas.map((comp, index) => (
              <TableRow key={index}>
                <TableCell className="border text-xs">{comp.nome}</TableCell>
                <TableCell className="border text-xs text-center font-medium">{comp.pontuacao}</TableCell>
                <TableCell className="border text-xs">{comp.observacoes || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      {/* 6. Nota de Avaliação Final (NAF) */}
      <section className="mb-6">
        <h2 className="text-sm font-bold bg-gray-100 p-2 mb-3 border-l-4 border-gray-800">
          6. Nota de Avaliação Final (NAF)
        </h2>
        <div className="bg-gray-50 p-3 mb-3 border rounded text-xs">
          <p className="font-medium text-gray-700">
            NAF = (Objectivos Individuais × 40%) + (Objectivos de Equipa × 20%) + (Competências Transversais × 20%) + (Competências Técnicas × 20%)
          </p>
        </div>
        <Table className="border">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="border text-xs font-semibold text-gray-900">Componente</TableHead>
              <TableHead className="border text-xs font-semibold text-gray-900 w-20 text-center">Peso</TableHead>
              <TableHead className="border text-xs font-semibold text-gray-900 w-20 text-center">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.componentesNAF.map((comp, index) => (
              <TableRow key={index}>
                <TableCell className="border text-xs">{comp.nome}</TableCell>
                <TableCell className="border text-xs text-center">{comp.peso}%</TableCell>
                <TableCell className="border text-xs text-center font-medium">{comp.valor.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-gray-100 font-bold">
              <TableCell className="border text-xs" colSpan={2}>Nota de Avaliação Final (NAF)</TableCell>
              <TableCell className="border text-xs text-center text-lg">{data.naf.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow className="bg-primary/10">
              <TableCell className="border text-xs" colSpan={2}>Classificação Final</TableCell>
              <TableCell className="border text-xs text-center font-bold">{data.classificacaoFinal}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      {/* 7. Conclusão e Recomendações */}
      <section className="mb-6">
        <h2 className="text-sm font-bold bg-gray-100 p-2 mb-3 border-l-4 border-gray-800">
          7. Conclusão e Recomendações
        </h2>
        <div className="border rounded p-4 min-h-[80px] text-xs">
          {data.conclusao || <span className="text-gray-400">Sem conclusão registada</span>}
        </div>
      </section>

      {/* 8. Assinaturas */}
      <section className="mb-6 page-break-inside-avoid">
        <h2 className="text-sm font-bold bg-gray-100 p-2 mb-3 border-l-4 border-gray-800">
          8. Assinaturas
        </h2>
        <Table className="border">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="border text-xs font-semibold text-gray-900 text-center">Avaliador (Nome e Assinatura)</TableHead>
              <TableHead className="border text-xs font-semibold text-gray-900 w-28 text-center">Data</TableHead>
              <TableHead className="border text-xs font-semibold text-gray-900 text-center">Avaliado (Nome e Assinatura)</TableHead>
              <TableHead className="border text-xs font-semibold text-gray-900 w-28 text-center">Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="border h-20 align-bottom">
                <div className="border-t border-gray-400 mt-12 pt-2 text-center text-xs">
                  {data.superiorHierarquico}
                </div>
              </TableCell>
              <TableCell className="border text-xs text-center">{data.dataAvaliador || "___/___/______"}</TableCell>
              <TableCell className="border h-20 align-bottom">
                <div className="border-t border-gray-400 mt-12 pt-2 text-center text-xs">
                  {data.nomeCompleto}
                </div>
              </TableCell>
              <TableCell className="border text-xs text-center">{data.dataAvaliado || "___/___/______"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      {/* Rodapé */}
      <footer className="mt-8 pt-4 border-t text-center text-xs text-gray-500">
        <p>Sistema de Gestão de Avaliação de Desempenho (SGAD) - Tribunal de Contas de Angola</p>
        <p className="mt-1">Documento gerado automaticamente em {new Date().toLocaleDateString('pt-PT')}</p>
      </footer>
    </div>
  );
}
