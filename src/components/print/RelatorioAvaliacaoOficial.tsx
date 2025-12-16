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
        {/* Official Header with Coat of Arms */}
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
          <h1 className="document-title">RELATÓRIO DE AVALIAÇÃO DE DESEMPENHO</h1>
          <p className="document-subtitle">Ficha Individual do Colaborador</p>
          <p className="legal-reference">(Nos termos do RADFP – Decreto Presidencial n.º 173/25)</p>
        </div>

        {/* Section I - Dados Pessoais */}
        <section className="report-section">
          <SectionHeader number="I" title="DADOS DO COLABORADOR" />
          <div className="personal-data-card">
            <div className="personal-data-grid">
              <div className="personal-data-main">
                <div className="collaborator-name">{nomeAvaliado}</div>
                <div className="collaborator-role">{funcaoExercida}</div>
              </div>
              <div className="personal-data-details">
                <div className="detail-row">
                  <span className="detail-label">Categoria/Carreira:</span>
                  <span className="detail-value">{categoriaCarreira}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Órgão/Serviço:</span>
                  <span className="detail-value">{orgaoServico}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Área/Departamento:</span>
                  <span className="detail-value">{areaDepartamento}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Data de Início:</span>
                  <span className="detail-value">{dataInicioFuncao}</span>
                </div>
                {email && (
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{email}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="naf-summary-box">
              <div className="naf-summary-label">NAF Médio</div>
              <div className="naf-summary-value">{notaFinal.toFixed(2)}</div>
              <div className="naf-summary-classification">{classificacaoQualitativa}</div>
            </div>
          </div>
        </section>

        {/* Section II - Histórico de Avaliações */}
        <section className="report-section">
          <SectionHeader number="II" title="HISTÓRICO DE AVALIAÇÕES" />
          <table className="report-table history-table">
            <thead>
              <tr>
                <th>Ciclo</th>
                <th className="col-center">Tipo</th>
                <th>Avaliador</th>
                <th className="col-center">Data</th>
                <th className="col-center">NAF</th>
                <th className="col-center">Classificação</th>
                <th className="col-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              {historicoAvaliacoes.length > 0 ? historicoAvaliacoes.map((eval_item) => (
                <tr key={eval_item.id}>
                  <td>{eval_item.ciclo}</td>
                  <td className="text-center">{eval_item.tipo}</td>
                  <td>{eval_item.avaliador}</td>
                  <td className="text-center">{eval_item.data}</td>
                  <td className="text-center score-cell">{eval_item.naf.toFixed(2)}</td>
                  <td className="text-center">
                    <span className={`classification-badge ${eval_item.classificacao.toLowerCase().replace(' ', '-')}`}>
                      {eval_item.classificacao}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className={`status-badge ${eval_item.estado}`}>
                      {eval_item.estado === 'homologada' ? 'Homologada' : 
                       eval_item.estado === 'submetida' ? 'Submetida' : 'Em Curso'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="text-center empty-row">Sem avaliações registadas</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Section III - Enquadramento da Avaliação Actual */}
        <section className="report-section">
          <SectionHeader number="III" title="ENQUADRAMENTO DA AVALIAÇÃO ACTUAL" />
          <div className="fields-grid cols-3">
            <FieldBox label="Ano" value={ano} />
            <FieldBox label="Semestre" value={semestre} />
            <FieldBox label="Período Avaliado" value={periodoAvaliado} />
          </div>
          <div className="fields-grid cols-3">
            <FieldBox label="Tipo de Avaliação" value={tipoAvaliacao} />
            <FieldBox label="Modelo Aplicado" value={modeloAplicado} />
            <FieldBox label="Avaliador" value={avaliador} />
          </div>
        </section>

        {/* Page 1 Footer */}
        <footer className="page-footer">
          <span>Página 1/3</span>
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
