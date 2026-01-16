/**
 * Validated Input Component
 * 
 * Input component with built-in validation feedback
 * and security features for OWASP compliance.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  success?: boolean;
  hint?: string;
  showValidation?: boolean;
  sanitize?: (value: string) => string;
  onSanitizedChange?: (value: string) => void;
}

const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  (
    {
      className,
      type,
      error,
      success,
      hint,
      showValidation = true,
      sanitize,
      onSanitizedChange,
      onChange,
      ...props
    },
    ref
  ) => {
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        
        // Apply sanitization if provided
        if (sanitize) {
          value = sanitize(value);
          e.target.value = value;
        }
        
        // Call both handlers
        onChange?.(e);
        onSanitizedChange?.(value);
      },
      [sanitize, onChange, onSanitizedChange]
    );

    const hasError = !!error;
    const hasSuccess = success && !hasError;

    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors",
            hasError
              ? "border-destructive focus-visible:ring-destructive/50"
              : hasSuccess && showValidation
              ? "border-green-500 focus-visible:ring-green-500/50"
              : "border-input focus-visible:ring-ring",
            className
          )}
          ref={ref}
          onChange={handleChange}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${props.id}-error` : undefined}
          {...props}
        />
        
        {/* Validation icon */}
        {showValidation && (hasError || hasSuccess) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {hasError ? (
              <AlertCircle className="h-4 w-4 text-destructive" />
            ) : hasSuccess ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : null}
          </div>
        )}
        
        {/* Error message */}
        {hasError && (
          <p
            id={`${props.id}-error`}
            className="mt-1.5 text-sm text-destructive flex items-center gap-1"
            role="alert"
          >
            <AlertCircle className="h-3 w-3 flex-shrink-0" />
            {error}
          </p>
        )}
        
        {/* Hint text */}
        {hint && !hasError && (
          <p className="mt-1.5 text-sm text-muted-foreground">{hint}</p>
        )}
      </div>
    );
  }
);

ValidatedInput.displayName = "ValidatedInput";

export { ValidatedInput };
