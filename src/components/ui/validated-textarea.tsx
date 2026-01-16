/**
 * Validated Textarea Component
 * 
 * Textarea component with built-in validation feedback,
 * character count, and security features.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export interface ValidatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  success?: boolean;
  hint?: string;
  showValidation?: boolean;
  showCharCount?: boolean;
  sanitize?: (value: string) => string;
  onSanitizedChange?: (value: string) => void;
}

const ValidatedTextarea = React.forwardRef<HTMLTextAreaElement, ValidatedTextareaProps>(
  (
    {
      className,
      error,
      success,
      hint,
      showValidation = true,
      showCharCount = false,
      maxLength,
      sanitize,
      onSanitizedChange,
      onChange,
      value,
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = React.useState(0);

    React.useEffect(() => {
      if (typeof value === "string") {
        setCharCount(value.length);
      }
    }, [value]);

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let newValue = e.target.value;
        
        // Apply sanitization if provided
        if (sanitize) {
          newValue = sanitize(newValue);
          e.target.value = newValue;
        }
        
        setCharCount(newValue.length);
        
        // Call both handlers
        onChange?.(e);
        onSanitizedChange?.(newValue);
      },
      [sanitize, onChange, onSanitizedChange]
    );

    const hasError = !!error;
    const hasSuccess = success && !hasError;
    const isNearLimit = maxLength && charCount > maxLength * 0.9;
    const isOverLimit = maxLength && charCount > maxLength;

    return (
      <div className="relative w-full">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-y",
            hasError
              ? "border-destructive focus-visible:ring-destructive/50"
              : hasSuccess && showValidation
              ? "border-green-500 focus-visible:ring-green-500/50"
              : "border-input focus-visible:ring-ring",
            className
          )}
          ref={ref}
          onChange={handleChange}
          value={value}
          maxLength={maxLength}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${props.id}-error` : undefined}
          {...props}
        />
        
        {/* Validation icon */}
        {showValidation && (hasError || hasSuccess) && (
          <div className="absolute right-3 top-3 pointer-events-none">
            {hasError ? (
              <AlertCircle className="h-4 w-4 text-destructive" />
            ) : hasSuccess ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : null}
          </div>
        )}
        
        {/* Character count */}
        {showCharCount && maxLength && (
          <div
            className={cn(
              "absolute right-3 bottom-2 text-xs",
              isOverLimit
                ? "text-destructive font-medium"
                : isNearLimit
                ? "text-yellow-600"
                : "text-muted-foreground"
            )}
          >
            {charCount}/{maxLength}
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

ValidatedTextarea.displayName = "ValidatedTextarea";

export { ValidatedTextarea };
