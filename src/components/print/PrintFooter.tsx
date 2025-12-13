interface PrintFooterProps {
  documentCode?: string;
}

export function PrintFooter({ documentCode }: PrintFooterProps) {
  const currentDate = new Date().toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="print-footer hidden print:block">
      <p>
        Tribunal de Contas - Sistema de Gestão de Avaliação de Desempenho (SGAD)
        {documentCode && ` | ${documentCode}`}
        {` | Impresso em ${currentDate}`}
      </p>
    </div>
  );
}
