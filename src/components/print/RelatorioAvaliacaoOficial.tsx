import React from "react";
import tribunalLogo from "@/assets/tribunal-logo.png";

interface ObjectiveData {
  id: string;
  descricao: string;
  meta?: string;
  indicador?: string;
  planeado?: string;
  realizado?: string;
  pontuacao?: number;
}

interface CompetencyData {
  id: string;
  nome: string;
  pontuacao?: number;
}

interface RelatorioAvaliacaoOficialProps {
  ano: string;
  semestre: string;
  orgaoServico: string;
  areaDepartamento: string;
  categoriaCarreira: string;
  nomeAvaliado: string;
  funcaoExercida: string;
  dataInicioFuncao: string;
  avaliador: string;
  funcaoAvaliador: string;
  tipoAvaliacao: string;
  modeloAplicado: string;
  periodoAvaliado: string;
  objectivos: ObjectiveData[];
  competenciasTransversais: CompetencyData[];
  competenciasTecnicas: CompetencyData[];
  notaObjectivos: number;
  notaCompetenciasTransversais: number;
  notaCompetenciasTecnicas: number;
  notaFinal: number;
  classificacaoQualitativa: string;
  pontosFortesAvaliador: string;
  aspectosMelhorarAvaliador: string;
  recomendacoesAvaliador: string;
  comentarioAvaliado: string;
  conclusaoEncaminhamentos: string;
  dataAssinatura: string;
}

export function RelatorioAvaliacaoOficial({
  ano,
  semestre,
  orgaoServico,
  areaDepartamento,
  categoriaCarreira,
  nomeAvaliado,
  funcaoExercida,
  dataInicioFuncao,
  avaliador,
  funcaoAvaliador,
  tipoAvaliacao,
  modeloAplicado,
  periodoAvaliado,
  objectivos,
  competenciasTransversais,
  competenciasTecnicas,
  notaObjectivos,
  notaCompetenciasTransversais,
  notaCompetenciasTecnicas,
  notaFinal,
  classificacaoQualitativa,
  pontosFortesAvaliador,
  aspectosMelhorarAvaliador,
  recomendacoesAvaliador,
  comentarioAvaliado,
  conclusaoEncaminhamentos,
  dataAssinatura
}: RelatorioAvaliacaoOficialProps) {
  const classificacoes = ["Muito Bom", "Bom", "Suficiente", "Insuficiente", "Mau"];

  return (
    <div className="hidden print:block print-report-oficial bg-white text-black p-8 text-sm">
      {/* Header */}
      <div className="flex items-center justify-center mb-6 border-b-2 border-black pb-4">
        <div className="flex items-center gap-4">
          <img src={tribunalLogo} alt="Logo" className="h-16 w-auto" />
          <div className="text-center">
            <p className="text-xs font-semibold">TRIBUNAL DE CONTAS</p>
            <p className="text-xs">REPÚBLICA DE ANGOLA</p>
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-center text-lg font-bold mb-1">
        FICHA / RELATÓRIO GERAL DE AVALIAÇÃO DE DESEMPENHO
      </h1>
      <p className="text-center text-xs mb-6 italic">
        (Nos termos do RADFP – Decreto Presidencial n.º 173/25)
      </p>

      {/* Section I - Identificação Geral */}
      <div className="mb-4">
        <h2 className="font-bold text-sm bg-gray-200 px-2 py-1 mb-2">I. IDENTIFICAÇÃO GERAL</h2>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="border border-gray-400 p-2">
            <span className="font-semibold">Ano: </span>{ano}
          </div>
          <div className="border border-gray-400 p-2">
            <span className="font-semibold">Semestre: </span>{semestre}
          </div>
          <div className="border border-gray-400 p-2">
            <span className="font-semibold">Órgão/Serviço: </span>{orgaoServico}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 text-xs mt-2">
          <div className="border border-gray-400 p-2">
            <span className="font-semibold">Área/Departamento: </span>{areaDepartamento}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs mt-2">
          <div className="border border-gray-400 p-2">
            <span className="font-semibold">Categoria/Carreira: </span>{categoriaCarreira}
          </div>
          <div className="border border-gray-400 p-2">
            <span className="font-semibold">Nome do Avaliado: </span>{nomeAvaliado}
          </div>
          <div className="border border-gray-400 p-2">
            <span className="font-semibold">Função Exercida: </span>{funcaoExercida}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs mt-2">
          <div className="border border-gray-400 p-2">
            <span className="font-semibold">Data de Início na Função: </span>{dataInicioFuncao}
          </div>
          <div className="border border-gray-400 p-2">
            <span className="font-semibold">Avaliador: </span>{avaliador}
          </div>
          <div className="border border-gray-400 p-2">
            <span className="font-semibold">Função do Avaliador: </span>{funcaoAvaliador}
          </div>
        </div>
      </div>

      {/* Section II - Enquadramento */}
      <div className="mb-4">
        <h2 className="font-bold text-sm bg-gray-200 px-2 py-1 mb-2">II. ENQUADRAMENTO DA AVALIAÇÃO</h2>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="border border-gray-400 p-2">
            <span className="font-semibold">Tipo de Avaliação: </span>{tipoAvaliacao}
          </div>
          <div className="border border-gray-400 p-2">
            <span className="font-semibold">Modelo Aplicado: </span>{modeloAplicado}
          </div>
          <div className="border border-gray-400 p-2">
            <span className="font-semibold">Período Avaliado: </span>{periodoAvaliado}
          </div>
        </div>
      </div>

      {/* Section III - Objectivos */}
      <div className="mb-4">
        <h2 className="font-bold text-sm bg-gray-200 px-2 py-1 mb-2">III. OBJECTIVOS DE DESEMPENHO (até 60%)</h2>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 p-1 text-left">Objectivo</th>
              <th className="border border-gray-400 p-1 text-center w-20">Meta</th>
              <th className="border border-gray-400 p-1 text-center w-20">Indicador</th>
              <th className="border border-gray-400 p-1 text-center w-16">Planeado</th>
              <th className="border border-gray-400 p-1 text-center w-16">Realizado</th>
              <th className="border border-gray-400 p-1 text-center w-16">Pontuação</th>
            </tr>
          </thead>
          <tbody>
            {objectivos.map((obj, index) => (
              <tr key={obj.id}>
                <td className="border border-gray-400 p-1">{index + 1}. {obj.descricao}</td>
                <td className="border border-gray-400 p-1 text-center">{obj.meta || "-"}</td>
                <td className="border border-gray-400 p-1 text-center">{obj.indicador || "-"}</td>
                <td className="border border-gray-400 p-1 text-center">{obj.planeado || "-"}</td>
                <td className="border border-gray-400 p-1 text-center">{obj.realizado || "-"}</td>
                <td className="border border-gray-400 p-1 text-center">{obj.pontuacao?.toFixed(1) || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section IV - Competências Transversais */}
      <div className="mb-4">
        <h2 className="font-bold text-sm bg-gray-200 px-2 py-1 mb-2">IV. COMPETÊNCIAS TRANSVERSAIS (até 20%)</h2>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 p-1 text-left">Competência</th>
              <th className="border border-gray-400 p-1 text-center w-20">Pontuação</th>
            </tr>
          </thead>
          <tbody>
            {competenciasTransversais.map((comp) => (
              <tr key={comp.id}>
                <td className="border border-gray-400 p-1">{comp.nome}</td>
                <td className="border border-gray-400 p-1 text-center">{comp.pontuacao?.toFixed(1) || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section V - Competências Técnicas */}
      <div className="mb-4">
        <h2 className="font-bold text-sm bg-gray-200 px-2 py-1 mb-2">V. COMPETÊNCIAS ESPECÍFICAS / TÉCNICAS (até 20%)</h2>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 p-1 text-left">Competência</th>
              <th className="border border-gray-400 p-1 text-center w-20">Pontuação</th>
            </tr>
          </thead>
          <tbody>
            {competenciasTecnicas.map((comp) => (
              <tr key={comp.id}>
                <td className="border border-gray-400 p-1">{comp.nome}</td>
                <td className="border border-gray-400 p-1 text-center">{comp.pontuacao?.toFixed(1) || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section VI - Nota Final */}
      <div className="mb-4">
        <h2 className="font-bold text-sm bg-gray-200 px-2 py-1 mb-2">VI. NOTA FINAL DE AVALIAÇÃO</h2>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="border border-gray-400 p-2 text-center">
            <span className="font-semibold block">Objectivos</span>
            <span className="text-lg font-bold">{notaObjectivos.toFixed(1)}</span>
          </div>
          <div className="border border-gray-400 p-2 text-center">
            <span className="font-semibold block">Comp. Transversais</span>
            <span className="text-lg font-bold">{notaCompetenciasTransversais.toFixed(1)}</span>
          </div>
          <div className="border border-gray-400 p-2 text-center">
            <span className="font-semibold block">Comp. Técnicas</span>
            <span className="text-lg font-bold">{notaCompetenciasTecnicas.toFixed(1)}</span>
          </div>
          <div className="border border-gray-400 p-2 text-center bg-gray-100">
            <span className="font-semibold block">Nota Final (NFA)</span>
            <span className="text-xl font-bold">{notaFinal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Section VII - Classificação Qualitativa */}
      <div className="mb-4">
        <h2 className="font-bold text-sm bg-gray-200 px-2 py-1 mb-2">VII. CLASSIFICAÇÃO QUALITATIVA FINAL</h2>
        <div className="flex justify-center gap-4 text-xs">
          {classificacoes.map((c) => (
            <div 
              key={c} 
              className={`border border-gray-400 px-3 py-2 ${classificacaoQualitativa === c ? 'bg-gray-300 font-bold' : ''}`}
            >
              {c}
            </div>
          ))}
        </div>
      </div>

      {/* Page break for second page */}
      <div className="break-before-page"></div>

      {/* Section VIII - Análise Descritiva */}
      <div className="mb-4">
        <h2 className="font-bold text-sm bg-gray-200 px-2 py-1 mb-2">VIII. ANÁLISE DESCRITIVA DO AVALIADOR</h2>
        <div className="space-y-2 text-xs">
          <div className="border border-gray-400 p-2">
            <span className="font-semibold">Pontos fortes: </span>
            <p className="mt-1">{pontosFortesAvaliador || "—"}</p>
          </div>
          <div className="border border-gray-400 p-2">
            <span className="font-semibold">Aspectos a melhorar: </span>
            <p className="mt-1">{aspectosMelhorarAvaliador || "—"}</p>
          </div>
          <div className="border border-gray-400 p-2">
            <span className="font-semibold">Recomendações: </span>
            <p className="mt-1">{recomendacoesAvaliador || "—"}</p>
          </div>
        </div>
      </div>

      {/* Section IX - Autoavaliação */}
      <div className="mb-4">
        <h2 className="font-bold text-sm bg-gray-200 px-2 py-1 mb-2">IX. AUTOAVALIAÇÃO DO AVALIADO</h2>
        <div className="border border-gray-400 p-2 text-xs min-h-[60px]">
          <span className="font-semibold">Comentário do avaliado: </span>
          <p className="mt-1">{comentarioAvaliado || "—"}</p>
        </div>
      </div>

      {/* Section X - Conclusão */}
      <div className="mb-4">
        <h2 className="font-bold text-sm bg-gray-200 px-2 py-1 mb-2">X. CONCLUSÃO E ENCAMINHAMENTOS</h2>
        <div className="border border-gray-400 p-2 text-xs min-h-[60px]">
          <p>{conclusaoEncaminhamentos || "—"}</p>
        </div>
      </div>

      {/* Section XI - Assinaturas */}
      <div className="mb-4">
        <h2 className="font-bold text-sm bg-gray-200 px-2 py-1 mb-2">XI. ASSINATURAS</h2>
        <div className="grid grid-cols-3 gap-4 text-xs mt-4">
          <div className="text-center">
            <div className="border-b border-black mb-1 h-12"></div>
            <p className="font-semibold">Avaliador</p>
          </div>
          <div className="text-center">
            <div className="border-b border-black mb-1 h-12"></div>
            <p className="font-semibold">Avaliado</p>
          </div>
          <div className="text-center">
            <div className="border-b border-black mb-1 h-12"></div>
            <p className="font-semibold">Responsável pela Homologação</p>
          </div>
        </div>
        <div className="text-center mt-4 text-xs">
          <span className="font-semibold">Data: </span>{dataAssinatura}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-400 text-center text-xs">
        <p>Tribunal de Contas de Angola - Sistema de Gestão de Avaliação de Desempenho</p>
        <p className="text-gray-600">Documento gerado automaticamente pelo SGAD - Ref: RADFP/2025</p>
      </div>
    </div>
  );
}
