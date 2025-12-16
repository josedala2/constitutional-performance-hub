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

interface EvaluationHistoryData {
  id: string;
  ciclo: string;
  tipo: string;
  avaliador: string;
  data: string;
  naf: number;
  classificacao: string;
  estado: string;
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
  email?: string;
  avaliador: string;
  funcaoAvaliador: string;
  tipoAvaliacao: string;
  modeloAplicado: string;
  periodoAvaliado: string;
  historicoAvaliacoes: EvaluationHistoryData[];
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
  email,
  avaliador,
  funcaoAvaliador,
  tipoAvaliacao,
  modeloAplicado,
  periodoAvaliado,
  historicoAvaliacoes,
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
      {/* ========== PAGE 1 - DADOS PESSOAIS E HISTÓRICO ========== */}
      <div className="report-page">
        {/* Official Header with Logo */}
        <header className="report-header-compact">
          <img src={tribunalLogo} alt="Tribunal de Contas" className="header-logo-main" />
          <div className="header-titles">
            <h1 className="header-institution">TRIBUNAL DE CONTAS</h1>
            <p className="header-country">REPÚBLICA DE ANGOLA</p>
          </div>
        </header>

        {/* Document Title */}
        <div className="document-title-compact">
          <h2 className="doc-title">RELATÓRIO DE AVALIAÇÃO DE DESEMPENHO</h2>
          <p className="doc-reference">Decreto Presidencial n.º 173/25 - RADFP</p>
        </div>

        {/* Section I - Identificação do Colaborador (Table Format) */}
        <section className="report-section-compact">
          <div className="section-header-line">
            <span className="section-num">I</span>
            <span className="section-txt">IDENTIFICAÇÃO DO COLABORADOR</span>
          </div>
          <table className="data-table">
            <tbody>
              <tr>
                <td className="label-cell">Nome Completo</td>
                <td className="value-cell" colSpan={3}>{nomeAvaliado}</td>
              </tr>
              <tr>
                <td className="label-cell">Função Exercida</td>
                <td className="value-cell">{funcaoExercida}</td>
                <td className="label-cell">Categoria/Carreira</td>
                <td className="value-cell">{categoriaCarreira}</td>
              </tr>
              <tr>
                <td className="label-cell">Órgão/Serviço</td>
                <td className="value-cell">{orgaoServico}</td>
                <td className="label-cell">Área/Departamento</td>
                <td className="value-cell">{areaDepartamento}</td>
              </tr>
              <tr>
                <td className="label-cell">Data de Início</td>
                <td className="value-cell">{dataInicioFuncao}</td>
                <td className="label-cell">Email</td>
                <td className="value-cell">{email || "—"}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Section II - Enquadramento da Avaliação */}
        <section className="report-section-compact">
          <div className="section-header-line">
            <span className="section-num">II</span>
            <span className="section-txt">ENQUADRAMENTO DA AVALIAÇÃO</span>
          </div>
          <table className="data-table">
            <tbody>
              <tr>
                <td className="label-cell">Ano</td>
                <td className="value-cell">{ano}</td>
                <td className="label-cell">Semestre</td>
                <td className="value-cell">{semestre}</td>
              </tr>
              <tr>
                <td className="label-cell">Período Avaliado</td>
                <td className="value-cell">{periodoAvaliado}</td>
                <td className="label-cell">Tipo de Avaliação</td>
                <td className="value-cell">{tipoAvaliacao}</td>
              </tr>
              <tr>
                <td className="label-cell">Modelo Aplicado</td>
                <td className="value-cell">{modeloAplicado}</td>
                <td className="label-cell">Avaliador</td>
                <td className="value-cell">{avaliador}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Section III - Resumo NAF */}
        <section className="report-section-compact">
          <div className="section-header-line">
            <span className="section-num">III</span>
            <span className="section-txt">NOTA DE AVALIAÇÃO FINAL</span>
          </div>
          <div className="naf-summary-compact">
            <div className="naf-box">
              <span className="naf-label">NAF</span>
              <span className="naf-value">{notaFinal.toFixed(2)}</span>
            </div>
            <div className="naf-classification-box">
              <span className="naf-class-label">Classificação Qualitativa</span>
              <span className="naf-class-value">{classificacaoQualitativa}</span>
            </div>
          </div>
        </section>

        {/* Section IV - Histórico de Avaliações */}
        <section className="report-section-compact">
          <div className="section-header-line">
            <span className="section-num">IV</span>
            <span className="section-txt">HISTÓRICO DE AVALIAÇÕES</span>
          </div>
          <table className="history-table-compact">
            <thead>
              <tr>
                <th>Ciclo</th>
                <th>Tipo</th>
                <th>Avaliador</th>
                <th>Data</th>
                <th>NAF</th>
                <th>Classificação</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {historicoAvaliacoes.length > 0 ? historicoAvaliacoes.map((eval_item) => (
                <tr key={eval_item.id}>
                  <td>{eval_item.ciclo}</td>
                  <td>{eval_item.tipo}</td>
                  <td>{eval_item.avaliador}</td>
                  <td>{eval_item.data}</td>
                  <td className="naf-cell">{eval_item.naf.toFixed(2)}</td>
                  <td>
                    <span className={`class-tag ${eval_item.classificacao.toLowerCase().replace(' ', '-')}`}>
                      {eval_item.classificacao}
                    </span>
                  </td>
                  <td>
                    <span className={`status-tag ${eval_item.estado}`}>
                      {eval_item.estado === 'homologada' ? 'Homologada' : 
                       eval_item.estado === 'submetida' ? 'Submetida' : 'Em Curso'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="empty-cell">Sem avaliações registadas</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Page 1 Footer */}
        <footer className="page-footer-compact">
          <span className="page-num">Página 1/3</span>
          <span className="page-ref">SGAD - Sistema de Gestão de Avaliação de Desempenho</span>
        </footer>
      </div>

      {/* ========== PAGE 2 - OBJECTIVOS E COMPETÊNCIAS ========== */}
      <div className="report-page page-break">
        {/* Continuation Header */}
        <header className="continuation-header">
          <div className="continuation-left">
            <img src={tribunalLogo} alt="Emblema" className="continuation-logo" />
            <div>
              <span className="continuation-title">Relatório de Avaliação de Desempenho</span>
              <span className="continuation-name">{nomeAvaliado}</span>
            </div>
          </div>
          <div className="continuation-right">
            <span>Página 2/3</span>
          </div>
        </header>

        {/* Section IV - Objectivos */}
        <section className="report-section">
          <SectionHeader number="IV" title="OBJECTIVOS DE DESEMPENHO (Ponderação: 60%)" />
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

        {/* Section V - Competências Transversais */}
        <section className="report-section">
          <SectionHeader number="V" title="COMPETÊNCIAS TRANSVERSAIS (Ponderação: 20%)" />
          <div className="competencies-grid">
            {competenciasTransversais.map((comp) => (
              <div key={comp.id} className="competency-item">
                <span className="competency-name">{comp.nome}</span>
                <span className="competency-score">{comp.pontuacao?.toFixed(1) || "—"}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section VI - Competências Técnicas */}
        <section className="report-section">
          <SectionHeader number="VI" title="COMPETÊNCIAS ESPECÍFICAS/TÉCNICAS (Ponderação: 20%)" />
          <div className="competencies-grid">
            {competenciasTecnicas.map((comp) => (
              <div key={comp.id} className="competency-item">
                <span className="competency-name">{comp.nome}</span>
                <span className="competency-score">{comp.pontuacao?.toFixed(1) || "—"}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section VII - Nota Final */}
        <section className="report-section naf-section">
          <SectionHeader number="VII" title="NOTA FINAL DE AVALIAÇÃO (NFA)" />
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

        {/* Section VIII - Classificação Qualitativa */}
        <section className="report-section classification-section">
          <SectionHeader number="VIII" title="CLASSIFICAÇÃO QUALITATIVA FINAL" />
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

      {/* ========== PAGE 3 - ANÁLISE E ASSINATURAS ========== */}
      <div className="report-page page-break">
        {/* Continuation Header */}
        <header className="continuation-header">
          <div className="continuation-left">
            <img src={tribunalLogo} alt="Emblema" className="continuation-logo" />
            <div>
              <span className="continuation-title">Relatório de Avaliação de Desempenho</span>
              <span className="continuation-name">{nomeAvaliado}</span>
            </div>
          </div>
          <div className="continuation-right">
            <span>Página 3/3</span>
          </div>
        </header>

        {/* Section IX - Análise Descritiva */}
        <section className="report-section">
          <SectionHeader number="IX" title="ANÁLISE DESCRITIVA DO AVALIADOR" />
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

        {/* Section X - Autoavaliação */}
        <section className="report-section">
          <SectionHeader number="X" title="AUTOAVALIAÇÃO DO AVALIADO" />
          <div className="self-assessment-box">
            <p className="self-assessment-text">{comentarioAvaliado || "—"}</p>
          </div>
        </section>

        {/* Section XI - Conclusão */}
        <section className="report-section">
          <SectionHeader number="XI" title="CONCLUSÃO E ENCAMINHAMENTOS" />
          <div className="conclusion-box">
            <p>{conclusaoEncaminhamentos || "—"}</p>
          </div>
        </section>

        {/* Section XII - Assinaturas */}
        <section className="report-section signatures-section">
          <SectionHeader number="XII" title="ASSINATURAS E HOMOLOGAÇÃO" />
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
