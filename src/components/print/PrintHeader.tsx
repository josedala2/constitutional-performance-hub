import tribunalLogo from "@/assets/tribunal-logo.png";

interface PrintHeaderProps {
  title: string;
  subtitle?: string;
}

export function PrintHeader({ title, subtitle }: PrintHeaderProps) {
  return (
    <div className="hidden print:block mb-6">
      {/* Logo centered at top */}
      <div className="flex justify-center mb-4">
        <img 
          src={tribunalLogo} 
          alt="Tribunal de Contas" 
          className="h-20 w-auto object-contain"
          style={{ maxHeight: '80px' }}
        />
      </div>
      
      {/* Institution name */}
      <div className="text-center mb-3">
        <p className="text-xs uppercase tracking-widest text-gray-600 font-medium">
          República de Angola
        </p>
        <p className="text-sm font-semibold text-gray-800">
          Tribunal de Contas
        </p>
      </div>
      
      {/* Document title */}
      <div className="text-center border-b-2 border-gray-800 pb-3">
        <h1 className="text-lg font-bold text-gray-900 font-serif">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-gray-600 mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
