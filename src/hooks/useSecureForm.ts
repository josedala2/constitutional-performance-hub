/**
 * Secure Form Hook - OWASP Compliant Form Handling
 * 
 * Provides:
 * - Zod schema validation
 * - Rate limiting protection
 * - CSRF token management
 * - Error handling
 */

import { useState, useCallback, useEffect } from "react";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import {
  isRateLimited,
  clearRateLimit,
  getRemainingAttempts,
  generateCSRFToken,
  storeCSRFToken,
  validateCSRFToken,
} from "@/lib/validation";

interface UseSecureFormOptions<T> {
  schema: z.ZodSchema<T>;
  rateLimitKey?: string;
  maxAttempts?: number;
  windowMs?: number;
  enableCSRF?: boolean;
  onSuccess?: (data: T) => void | Promise<void>;
  onError?: (errors: string[]) => void;
}

interface SecureFormState<T> {
  data: Partial<T>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isRateLimited: boolean;
  remainingAttempts: number;
  csrfToken: string | null;
}

export function useSecureForm<T extends Record<string, unknown>>({
  schema,
  rateLimitKey,
  maxAttempts = 5,
  windowMs = 60000,
  enableCSRF = false,
  onSuccess,
  onError,
}: UseSecureFormOptions<T>) {
  const [state, setState] = useState<SecureFormState<T>>({
    data: {},
    errors: {},
    isSubmitting: false,
    isRateLimited: false,
    remainingAttempts: maxAttempts,
    csrfToken: null,
  });

  // Initialize CSRF token
  useEffect(() => {
    if (enableCSRF) {
      const token = generateCSRFToken();
      storeCSRFToken(token);
      setState((prev) => ({ ...prev, csrfToken: token }));
    }
  }, [enableCSRF]);

  // Update field value
  const setFieldValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, [field]: value },
      errors: { ...prev.errors, [field]: "" }, // Clear field error
    }));
  }, []);

  // Set multiple values
  const setValues = useCallback((values: Partial<T>) => {
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, ...values },
    }));
  }, []);

  // Validate single field
  const validateField = useCallback(
    <K extends keyof T>(field: K): boolean => {
      try {
        // Try to validate just this field if it exists in schema
        if ("shape" in schema && typeof (schema as Record<string, unknown>).shape === "object") {
          const shapeObj = (schema as { shape: Record<string, z.ZodType> }).shape;
          const fieldSchema = shapeObj[field as string];
          if (fieldSchema) {
            fieldSchema.parse(state.data[field]);
            setState((prev) => ({
              ...prev,
              errors: { ...prev.errors, [field]: "" },
            }));
            return true;
          }
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          setState((prev) => ({
            ...prev,
            errors: { ...prev.errors, [field]: error.errors[0]?.message || "Erro de validação" },
          }));
          return false;
        }
      }
      return true;
    },
    [schema, state.data]
  );

  // Validate all fields
  const validateAll = useCallback((): { success: boolean; data?: T; errors?: Record<string, string> } => {
    const result = schema.safeParse(state.data);

    if (result.success) {
      setState((prev) => ({ ...prev, errors: {} }));
      return { success: true, data: result.data };
    }

    const errors: Record<string, string> = {};
    for (const error of result.error.errors) {
      const field = error.path[0]?.toString() || "form";
      if (!errors[field]) {
        errors[field] = error.message;
      }
    }

    setState((prev) => ({ ...prev, errors }));
    return { success: false, errors };
  }, [schema, state.data]);

  // Submit handler
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      // Check rate limiting
      if (rateLimitKey && isRateLimited(rateLimitKey, maxAttempts, windowMs)) {
        setState((prev) => ({ ...prev, isRateLimited: true, remainingAttempts: 0 }));
        toast({
          title: "Demasiadas tentativas",
          description: "Por favor, aguarde antes de tentar novamente.",
          variant: "destructive",
        });
        onError?.(["Rate limit exceeded"]);
        return false;
      }

      // Update remaining attempts
      if (rateLimitKey) {
        const remaining = getRemainingAttempts(rateLimitKey, maxAttempts);
        setState((prev) => ({ ...prev, remainingAttempts: remaining }));
      }

      // Validate CSRF if enabled
      if (enableCSRF && state.csrfToken && !validateCSRFToken(state.csrfToken)) {
        toast({
          title: "Erro de segurança",
          description: "Sessão inválida. Por favor, recarregue a página.",
          variant: "destructive",
        });
        onError?.(["CSRF validation failed"]);
        return false;
      }

      // Validate form
      const validation = validateAll();
      if (!validation.success) {
        const errorMessages = Object.values(validation.errors || {}).filter(Boolean);
        toast({
          title: "Erro de validação",
          description: errorMessages[0] || "Verifique os campos do formulário.",
          variant: "destructive",
        });
        onError?.(errorMessages);
        return false;
      }

      // Submit
      setState((prev) => ({ ...prev, isSubmitting: true }));
      try {
        await onSuccess?.(validation.data!);
        
        // Clear rate limit on success
        if (rateLimitKey) {
          clearRateLimit(rateLimitKey);
          setState((prev) => ({ ...prev, remainingAttempts: maxAttempts }));
        }
        
        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erro ao submeter formulário";
        toast({
          title: "Erro",
          description: message,
          variant: "destructive",
        });
        onError?.([message]);
        return false;
      } finally {
        setState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [
      rateLimitKey,
      maxAttempts,
      windowMs,
      enableCSRF,
      state.csrfToken,
      validateAll,
      onSuccess,
      onError,
    ]
  );

  // Reset form
  const reset = useCallback((initialData?: Partial<T>) => {
    setState({
      data: initialData || {},
      errors: {},
      isSubmitting: false,
      isRateLimited: false,
      remainingAttempts: maxAttempts,
      csrfToken: enableCSRF ? generateCSRFToken() : null,
    });
    if (enableCSRF) {
      const token = generateCSRFToken();
      storeCSRFToken(token);
      setState((prev) => ({ ...prev, csrfToken: token }));
    }
  }, [maxAttempts, enableCSRF]);

  // Get field error
  const getFieldError = useCallback(
    (field: keyof T): string => {
      return state.errors[field as string] || "";
    },
    [state.errors]
  );

  // Check if field has error
  const hasFieldError = useCallback(
    (field: keyof T): boolean => {
      return !!state.errors[field as string];
    },
    [state.errors]
  );

  return {
    // State
    data: state.data,
    errors: state.errors,
    isSubmitting: state.isSubmitting,
    isRateLimited: state.isRateLimited,
    remainingAttempts: state.remainingAttempts,
    csrfToken: state.csrfToken,

    // Actions
    setFieldValue,
    setValues,
    validateField,
    validateAll,
    handleSubmit,
    reset,

    // Helpers
    getFieldError,
    hasFieldError,
  };
}

export default useSecureForm;
