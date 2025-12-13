interface SignatureProps {
  name: string;
  label: string;
  date?: string;
}

interface PrintSignaturesProps {
  signatures: SignatureProps[];
}

export function PrintSignatures({ signatures }: PrintSignaturesProps) {
  return (
    <div className="print-signatures hidden print:grid mt-8">
      {signatures.map((sig, index) => (
        <div key={index} className="print-signature-box">
          <div className="name">{sig.name}</div>
          <div className="label">{sig.label}</div>
          {sig.date && <div className="text-xs text-muted-foreground mt-1">{sig.date}</div>}
        </div>
      ))}
    </div>
  );
}
