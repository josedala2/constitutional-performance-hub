import tribunalLogo from "@/assets/tribunal-logo.png";

interface PrintHeaderProps {
  title: string;
  subtitle?: string;
}

export function PrintHeader({ title, subtitle }: PrintHeaderProps) {
  return (
    <div className="print-header hidden print:flex">
      <img src={tribunalLogo} alt="Tribunal de Contas" />
      <h1>{title}</h1>
      {subtitle && <p className="subtitle">{subtitle}</p>}
    </div>
  );
}
