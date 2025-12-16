import React from "react";

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
  nomeAvaliado: string;
  avaliador: string;
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
  nomeAvaliado,
  avaliador,
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
    <div className="hidden print:block print-report-radfp-continuous">
      {/* III. OBJECTIVOS DE DESEMPENHO */}
      <section className="section-radfp">
        <h2 className="section-title-radfp">III. OBJECTIVOS DE DESEMPENHO (até 60%)</h2>
        <p className="section-subtitle-radfp">Objectivos Individuais e de Equipa (descrever metas, indicadores, planeado, realizado e pontuação).</p>
        <table className="objectives-table-radfp">
          <thead>
            <tr>
              <th className="col-num">N.º</th>
              <th className="col-obj">Objectivo</th>
              <th className="col-meta">Meta</th>
              <th className="col-ind">Indicador</th>
              <th className="col-plan">Planeado</th>
              <th className="col-real">Realizado</th>
              <th className="col-pont">Pont.</th>
            </tr>
          </thead>
          <tbody>
            {objectivos.length > 0 ? objectivos.map((obj, index) => (
              <tr key={obj.id}>
                <td className="text-center">{index + 1}</td>
                <td>{obj.descricao}</td>
                <td className="text-center">{obj.meta || "—"}</td>
                <td className="text-center">{obj.indicador || "—"}</td>
                <td className="text-center">{obj.planeado || "—"}</td>
                <td className="text-center">{obj.realizado || "—"}</td>
                <td className="text-center font-bold">{obj.pontuacao?.toFixed(1) || "—"}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="empty-row">Sem objectivos registados</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* IV. COMPETÊNCIAS TRANSVERSAIS */}
      <section className="section-radfp">
        <h2 className="section-title-radfp">IV. COMPETÊNCIAS TRANSVERSAIS (até 20%)</h2>
        <p className="section-subtitle-radfp">Adaptação profissional; Relacionamento interpessoal; Trabalho em equipa; Integridade e conduta; Assiduidade e pontualidade; Uso adequado de recursos; Apresentação e postura; Responsabilidade.</p>
        <table className="competencies-table-radfp">
          <thead>
            <tr>
              <th>Competência</th>
              <th className="col-pont">Pontuação</th>
            </tr>
          </thead>
          <tbody>
            {competenciasTransversais.map((comp) => (
              <tr key={comp.id}>
                <td>{comp.nome}</td>
                <td className="text-center font-bold">{comp.pontuacao?.toFixed(1) || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* V. COMPETÊNCIAS ESPECÍFICAS / TÉCNICAS */}
      <section className="section-radfp">
        <h2 className="section-title-radfp">V. COMPETÊNCIAS ESPECÍFICAS / TÉCNICAS (até 20%)</h2>
        <p className="section-subtitle-radfp">Competências técnicas associadas à função.</p>
        <table className="competencies-table-radfp">
          <thead>
            <tr>
              <th>Competência</th>
              <th className="col-pont">Pontuação</th>
            </tr>
          </thead>
          <tbody>
            {competenciasTecnicas.map((comp) => (
              <tr key={comp.id}>
                <td>{comp.nome}</td>
                <td className="text-center font-bold">{comp.pontuacao?.toFixed(1) || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* VI. NOTA FINAL DE AVALIAÇÃO */}
      <section className="section-radfp">
        <h2 className="section-title-radfp">VI. NOTA FINAL DE AVALIAÇÃO</h2>
        <table className="naf-table-radfp">
          <thead>
            <tr>
              <th>Objectivos:</th>
              <th>Competências Transversais:</th>
              <th>Competências Técnicas:</th>
              <th>Nota Final (NFA):</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-center">{notaObjectivos.toFixed(2)}</td>
              <td className="text-center">{notaCompetenciasTransversais.toFixed(2)}</td>
              <td className="text-center">{notaCompetenciasTecnicas.toFixed(2)}</td>
              <td className="text-center naf-final-cell">{notaFinal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* VII. CLASSIFICAÇÃO QUALITATIVA FINAL */}
      <section className="section-radfp">
        <h2 className="section-title-radfp">VII. CLASSIFICAÇÃO QUALITATIVA FINAL</h2>
        <div className="classification-row-radfp">
          {classificacoes.map((c) => (
            <div key={c} className={`classification-box-radfp ${classificacaoQualitativa === c ? 'active' : ''}`}>
              <span className="checkbox-radfp">{classificacaoQualitativa === c ? '✓' : ''}</span>
              <span className="classification-text">{c}</span>
            </div>
          ))}
        </div>
      </section>

      {/* VIII. ANÁLISE DESCRITIVA DO AVALIADOR */}
      <section className="section-radfp">
        <h2 className="section-title-radfp">VIII. ANÁLISE DESCRITIVA DO AVALIADOR</h2>
        <div className="descriptive-field-radfp">
          <label>Pontos fortes:</label>
          <div className="field-content">{pontosFortesAvaliador || ""}</div>
        </div>
        <div className="descriptive-field-radfp">
          <label>Aspectos a melhorar:</label>
          <div className="field-content">{aspectosMelhorarAvaliador || ""}</div>
        </div>
        <div className="descriptive-field-radfp">
          <label>Recomendações:</label>
          <div className="field-content">{recomendacoesAvaliador || ""}</div>
        </div>
      </section>

      {/* IX. AUTOAVALIAÇÃO DO AVALIADO */}
      <section className="section-radfp">
        <h2 className="section-title-radfp">IX. AUTOAVALIAÇÃO DO AVALIADO</h2>
        <div className="descriptive-field-radfp">
          <label>Comentário do avaliado:</label>
          <div className="field-content large">{comentarioAvaliado || ""}</div>
        </div>
      </section>

      {/* X. CONCLUSÃO E ENCAMINHAMENTOS */}
      <section className="section-radfp">
        <h2 className="section-title-radfp">X. CONCLUSÃO E ENCAMINHAMENTOS</h2>
        <div className="descriptive-field-radfp">
          <label>Decisões e encaminhamentos futuros:</label>
          <div className="field-content">{conclusaoEncaminhamentos || ""}</div>
        </div>
      </section>

      {/* XI. ASSINATURAS */}
      <section className="section-radfp signatures-section-radfp">
        <h2 className="section-title-radfp">XI. ASSINATURAS</h2>
        <div className="signatures-grid-radfp">
          <div className="signature-item-radfp">
            <p className="signature-label">Avaliador:</p>
            <div className="signature-line-radfp"></div>
            <p className="signature-name-radfp">{avaliador}</p>
          </div>
          <div className="signature-item-radfp">
            <p className="signature-label">Avaliado:</p>
            <div className="signature-line-radfp"></div>
            <p className="signature-name-radfp">{nomeAvaliado}</p>
          </div>
          <div className="signature-item-radfp">
            <p className="signature-label">Responsável pela Homologação:</p>
            <div className="signature-line-radfp"></div>
            <p className="signature-name-radfp">_________________________</p>
          </div>
        </div>
        <div className="date-field-radfp">
          <p>Data: {dataAssinatura || "____/____/________"}</p>
        </div>
      </section>
    </div>
  );
}
