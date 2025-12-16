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

  const SectionHeader = ({ number, title }: { number: string; title: string }) => (
    <div className="report-section-header">
      <span className="section-number">{number}.</span>
      <span className="section-title">{title}</span>
    </div>
  );

  const FieldBox = ({ label, value, className = "" }: { label: string; value: string; className?: string }) => (
    <div className={`field-box ${className}`}>
      <span className="field-label">{label}</span>
      <span className="field-value">{value || "—"}</span>
    </div>
  );

  return (
    <div className="hidden print:block print-report-oficial">
      {/* ========== PAGE 1 ========== */}
      <div className="report-page">
        {/* Official Header with Coat of Arms styling */}
        <header className="report-header">
          <div className="header-emblem">
            <img src={tribunalLogo} alt="Emblema" className="emblem-img" />
          </div>
          <div className="header-text">
            <p className="institution-name">TRIBUNAL DE CONTAS</p>
            <p className="country-name">REPÚBLICA DE ANGOLA</p>
            <div className="header-divider"></div>
          </div>
        </header>

        {/* Document Title */}
        <div className="document-title-section">
          <h1 className="document-title">FICHA DE AVALIAÇÃO DE DESEMPENHO</h1>
          <p className="document-subtitle">Relatório Geral de Avaliação</p>
          <p className="legal-reference">(Nos termos do RADFP – Decreto Presidencial n.º 173/25)</p>
        </div>

        {/* Section I - Identificação Geral */}
        <section className="report-section">
          <SectionHeader number="I" title="IDENTIFICAÇÃO GERAL" />
          <div className="fields-grid cols-3">
            <FieldBox label="Ano" value={ano} />
            <FieldBox label="Semestre" value={semestre} />
            <FieldBox label="Órgão/Serviço" value={orgaoServico} />
          </div>
          <div className="fields-grid cols-1">
            <FieldBox label="Área/Departamento" value={areaDepartamento} />
          </div>
          <div className="fields-grid cols-2">
            <FieldBox label="Nome do Avaliado" value={nomeAvaliado} className="highlight" />
            <FieldBox label="Categoria/Carreira" value={categoriaCarreira} />
          </div>
          <div className="fields-grid cols-2">
            <FieldBox label="Função Exercida" value={funcaoExercida} />
            <FieldBox label="Data de Início na Função" value={dataInicioFuncao} />
          </div>
          <div className="fields-grid cols-2">
            <FieldBox label="Avaliador (Superior Hierárquico)" value={avaliador} />
            <FieldBox label="Função do Avaliador" value={funcaoAvaliador} />
          </div>
        </section>

        {/* Section II - Enquadramento */}
        <section className="report-section">
          <SectionHeader number="II" title="ENQUADRAMENTO DA AVALIAÇÃO" />
          <div className="fields-grid cols-3">
            <FieldBox label="Tipo de Avaliação" value={tipoAvaliacao} />
            <FieldBox label="Modelo Aplicado" value={modeloAplicado} />
            <FieldBox label="Período Avaliado" value={periodoAvaliado} />
          </div>
        </section>

        {/* Section III - Objectivos */}
        <section className="report-section">
          <SectionHeader number="III" title="OBJECTIVOS DE DESEMPENHO (Ponderação: 60%)" />
          <table className="report-table">
            <thead>
              <tr>
                <th className="col-desc">Objectivo</th>
                <th className="col-center">Meta</th>
                <th className="col-center">Indicador</th>
                <th className="col-center">Planeado</th>
                <th className="col-center">Realizado</th>
                <th className="col-center col-score">Pontuação</th>
              </tr>
            </thead>
            <tbody>
              {objectivos.length > 0 ? objectivos.map((obj, index) => (
                <tr key={obj.id}>
                  <td>{index + 1}. {obj.descricao}</td>
                  <td className="text-center">{obj.meta || "—"}</td>
                  <td className="text-center">{obj.indicador || "—"}</td>
                  <td className="text-center">{obj.planeado || "—"}</td>
                  <td className="text-center">{obj.realizado || "—"}</td>
                  <td className="text-center score-cell">{obj.pontuacao?.toFixed(1) || "—"}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="text-center empty-row">Sem objectivos registados</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Section IV - Competências Transversais */}
        <section className="report-section">
          <SectionHeader number="IV" title="COMPETÊNCIAS TRANSVERSAIS (Ponderação: 20%)" />
          <div className="competencies-grid">
            {competenciasTransversais.map((comp) => (
              <div key={comp.id} className="competency-item">
                <span className="competency-name">{comp.nome}</span>
                <span className="competency-score">{comp.pontuacao?.toFixed(1) || "—"}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section V - Competências Técnicas */}
        <section className="report-section">
          <SectionHeader number="V" title="COMPETÊNCIAS ESPECÍFICAS/TÉCNICAS (Ponderação: 20%)" />
          <div className="competencies-grid">
            {competenciasTecnicas.map((comp) => (
              <div key={comp.id} className="competency-item">
                <span className="competency-name">{comp.nome}</span>
                <span className="competency-score">{comp.pontuacao?.toFixed(1) || "—"}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section VI - Nota Final */}
        <section className="report-section naf-section">
          <SectionHeader number="VI" title="NOTA FINAL DE AVALIAÇÃO (NFA)" />
          <div className="naf-grid">
            <div className="naf-component">
              <span className="naf-label">Objectivos</span>
              <span className="naf-value">{notaObjectivos.toFixed(2)}</span>
              <span className="naf-weight">60%</span>
            </div>
            <div className="naf-component">
              <span className="naf-label">Comp. Transversais</span>
              <span className="naf-value">{notaCompetenciasTransversais.toFixed(2)}</span>
              <span className="naf-weight">20%</span>
            </div>
            <div className="naf-component">
              <span className="naf-label">Comp. Técnicas</span>
              <span className="naf-value">{notaCompetenciasTecnicas.toFixed(2)}</span>
              <span className="naf-weight">20%</span>
            </div>
            <div className="naf-final">
              <span className="naf-final-label">NOTA FINAL</span>
              <span className="naf-final-value">{notaFinal.toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* Section VII - Classificação Qualitativa */}
        <section className="report-section classification-section">
          <SectionHeader number="VII" title="CLASSIFICAÇÃO QUALITATIVA FINAL" />
          <div className="classification-grid">
            {classificacoes.map((c) => (
              <div 
                key={c} 
                className={`classification-item ${classificacaoQualitativa === c ? 'active' : ''}`}
              >
                <span className="classification-checkbox">{classificacaoQualitativa === c ? '✓' : ''}</span>
                <span className="classification-label">{c}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ========== PAGE 2 ========== */}
      <div className="report-page page-break">
        {/* Continuation Header */}
        <header className="continuation-header">
          <div className="continuation-left">
            <span className="continuation-title">Ficha de Avaliação de Desempenho</span>
            <span className="continuation-name">{nomeAvaliado}</span>
          </div>
          <div className="continuation-right">
            <span>Página 2/2</span>
          </div>
        </header>

        {/* Section VIII - Análise Descritiva */}
        <section className="report-section">
          <SectionHeader number="VIII" title="ANÁLISE DESCRITIVA DO AVALIADOR" />
          <div className="descriptive-block">
            <div className="descriptive-item">
              <h4 className="descriptive-label">Pontos Fortes:</h4>
              <div className="descriptive-content">
                {pontosFortesAvaliador || "—"}
              </div>
            </div>
            <div className="descriptive-item">
              <h4 className="descriptive-label">Aspectos a Melhorar:</h4>
              <div className="descriptive-content">
                {aspectosMelhorarAvaliador || "—"}
              </div>
            </div>
            <div className="descriptive-item">
              <h4 className="descriptive-label">Recomendações:</h4>
              <div className="descriptive-content">
                {recomendacoesAvaliador || "—"}
              </div>
            </div>
          </div>
        </section>

        {/* Section IX - Autoavaliação */}
        <section className="report-section">
          <SectionHeader number="IX" title="AUTOAVALIAÇÃO DO AVALIADO" />
          <div className="self-assessment-box">
            <p className="self-assessment-text">{comentarioAvaliado || "—"}</p>
          </div>
        </section>

        {/* Section X - Conclusão */}
        <section className="report-section">
          <SectionHeader number="X" title="CONCLUSÃO E ENCAMINHAMENTOS" />
          <div className="conclusion-box">
            <p>{conclusaoEncaminhamentos || "—"}</p>
          </div>
        </section>

        {/* Section XI - Assinaturas */}
        <section className="report-section signatures-section">
          <SectionHeader number="XI" title="ASSINATURAS E HOMOLOGAÇÃO" />
          <div className="signatures-grid">
            <div className="signature-block">
              <div className="signature-line"></div>
              <p className="signature-role">O Avaliador</p>
              <p className="signature-name">{avaliador}</p>
              <p className="signature-date">Data: ____/____/________</p>
            </div>
            <div className="signature-block">
              <div className="signature-line"></div>
              <p className="signature-role">O Avaliado</p>
              <p className="signature-name">{nomeAvaliado}</p>
              <p className="signature-date">Data: ____/____/________</p>
            </div>
            <div className="signature-block">
              <div className="signature-line"></div>
              <p className="signature-role">Homologação</p>
              <p className="signature-name">O Dirigente Máximo</p>
              <p className="signature-date">Data: ____/____/________</p>
            </div>
          </div>
          <div className="seal-area">
            <p className="seal-label">(Carimbo)</p>
          </div>
        </section>

        {/* Official Footer */}
        <footer className="report-footer">
          <div className="footer-line"></div>
          <div className="footer-content">
            <p className="footer-institution">TRIBUNAL DE CONTAS DA REPÚBLICA DE ANGOLA</p>
            <p className="footer-system">Sistema de Gestão de Avaliação de Desempenho (SGAD)</p>
            <p className="footer-reference">Ref: RADFP/{ano} | Gerado em: {dataAssinatura}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
