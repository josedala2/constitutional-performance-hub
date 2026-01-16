/**
 * SGAD Validation Module - OWASP TOP 10 Compliant
 * 
 * Provides centralized validation schemas and utilities for:
 * - A01:2021 Broken Access Control (input validation)
 * - A03:2021 Injection (input sanitization)
 * - A07:2021 Cross-Site Scripting (XSS prevention)
 */

import { z } from "zod";

// ==========================================
// SANITIZATION UTILITIES
// ==========================================

/**
 * Sanitize string to prevent XSS attacks
 * Removes HTML tags and dangerous characters
 */
export function sanitizeString(input: string): string {
  if (!input) return "";
  return input
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[<>'"&]/g, (char) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;',
      };
      return entities[char] || char;
    })
    .trim();
}

/**
 * Sanitize for SQL-like patterns (defense in depth)
 */
export function sanitizeForQuery(input: string): string {
  if (!input) return "";
  return input
    .replace(/['";\\]/g, "")
    .replace(/--/g, "")
    .replace(/\/\*/g, "")
    .replace(/\*\//g, "")
    .trim();
}

/**
 * Normalize Portuguese text (remove accents for comparison)
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// ==========================================
// CUSTOM ZOD VALIDATORS
// ==========================================

/**
 * Safe string validator with sanitization
 */
export const safeString = (minLength = 0, maxLength = 255) =>
  z
    .string()
    .min(minLength, `Deve ter pelo menos ${minLength} caracteres`)
    .max(maxLength, `Deve ter no máximo ${maxLength} caracteres`)
    .transform(sanitizeString);

/**
 * Email validator with additional checks
 */
export const safeEmail = z
  .string()
  .email("Email inválido")
  .max(255, "Email demasiado longo")
  .transform((email) => email.toLowerCase().trim())
  .refine(
    (email) => !email.includes("..") && !email.startsWith(".") && !email.endsWith("."),
    "Formato de email inválido"
  );

/**
 * Password validator with strength requirements
 */
export const safePassword = z
  .string()
  .min(8, "A password deve ter pelo menos 8 caracteres")
  .max(128, "A password é demasiado longa")
  .refine(
    (password) => /[A-Z]/.test(password),
    "Deve conter pelo menos uma letra maiúscula"
  )
  .refine(
    (password) => /[a-z]/.test(password),
    "Deve conter pelo menos uma letra minúscula"
  )
  .refine(
    (password) => /[0-9]/.test(password),
    "Deve conter pelo menos um número"
  )
  .refine(
    (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    "Deve conter pelo menos um caractere especial"
  );

/**
 * Simple password for login (no strength check)
 */
export const loginPassword = z
  .string()
  .min(6, "A password deve ter pelo menos 6 caracteres")
  .max(128, "A password é demasiado longa");

/**
 * Phone number validator (Angolan format)
 */
export const safePhone = z
  .string()
  .optional()
  .refine(
    (phone) => !phone || /^(\+244)?[0-9]{9}$/.test(phone.replace(/\s/g, "")),
    "Número de telefone inválido"
  )
  .transform((phone) => (phone ? phone.replace(/\s/g, "") : undefined));

/**
 * Year validator
 */
export const safeYear = z
  .number()
  .int("Deve ser um número inteiro")
  .min(2000, "Ano inválido")
  .max(2100, "Ano inválido");

/**
 * Date string validator (YYYY-MM-DD format)
 */
export const safeDateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido (YYYY-MM-DD)")
  .refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  }, "Data inválida");

/**
 * UUID validator
 */
export const safeUUID = z
  .string()
  .uuid("ID inválido")
  .or(z.string().regex(/^[a-f0-9-]{36}$/i, "ID inválido"));

/**
 * Percentage validator (0-100)
 */
export const safePercentage = z
  .number()
  .min(0, "Valor mínimo é 0")
  .max(100, "Valor máximo é 100");

/**
 * Score validator (1-5 scale)
 */
export const safeScore = z
  .number()
  .min(1, "Pontuação mínima é 1")
  .max(5, "Pontuação máxima é 5");

/**
 * Non-negative number validator
 */
export const safeNonNegative = z
  .number()
  .min(0, "Valor não pode ser negativo");

// ==========================================
// FORM SCHEMAS
// ==========================================

/**
 * Login form schema
 */
export const loginFormSchema = z.object({
  email: safeEmail,
  password: loginPassword,
});

/**
 * Signup form schema with strong password
 */
export const signupFormSchema = z.object({
  email: safeEmail,
  password: safePassword,
  fullName: safeString(2, 100).refine(
    (name) => name.split(" ").length >= 2,
    "Insira o nome completo"
  ),
});

/**
 * Profile form schema
 */
export const profileFormSchema = z.object({
  full_name: safeString(2, 100),
  email: safeEmail,
  phone: safePhone,
  job_title: safeString(0, 100).optional(),
  employee_code: safeString(0, 20).optional(),
});

/**
 * Colaborador (User) form schema
 */
export const colaboradorFormSchema = z.object({
  nome: safeString(2, 100),
  email: safeEmail,
  cargo: safeString(2, 100),
  unidade_organica: z.string().min(1, "Selecione uma unidade orgânica"),
  role: z.enum(["admin", "dirigente", "avaliador", "avaliado", "utente_interno", "utente_externo"]),
  ativo: z.boolean(),
});

/**
 * Ciclo de Avaliação form schema
 */
export const cicloFormSchema = z.object({
  ano: safeYear,
  semestre: z.union([z.literal(1), z.literal(2)]).optional(),
  tipo: z.enum(["anual", "semestral"]),
  estado: z.enum(["aberto", "em_acompanhamento", "fechado", "homologado"]),
  data_inicio: safeDateString,
  data_fim: safeDateString,
}).refine(
  (data) => new Date(data.data_fim) > new Date(data.data_inicio),
  {
    message: "A data de fim deve ser posterior à data de início",
    path: ["data_fim"],
  }
);

/**
 * Competência form schema
 */
export const competenciaFormSchema = z.object({
  nome: safeString(2, 100),
  tipo: z.enum(["transversal", "tecnica"]),
  carreira: safeString(0, 50).optional(),
  descricao: safeString(0, 500).optional(),
});

/**
 * Objectivo form schema
 */
export const objectivoFormSchema = z.object({
  descricao: safeString(5, 500),
  tipo: z.enum(["individual", "equipa"]),
  avaliado_id: safeUUID,
  meta_planeada: safeNonNegative,
  meta_realizada: safeNonNegative.optional(),
  grau_concretizacao: safePercentage.optional(),
  pontuacao: safeScore.optional(),
});

/**
 * Reclamação form schema
 */
export const reclamacaoFormSchema = z.object({
  motivo: safeString(5, 200),
  fundamentacao: safeString(20, 2000),
  avaliacao_id: safeUUID,
  avaliador_id: safeUUID,
});

/**
 * Recurso form schema
 */
export const recursoFormSchema = z.object({
  motivo: safeString(5, 200),
  fundamentacao: safeString(20, 2000),
  reclamacao_id: safeUUID.optional(),
});

/**
 * Help content form schema
 */
export const helpContentFormSchema = z.object({
  route: safeString(1, 100).refine(
    (route) => route.startsWith("/"),
    "A rota deve começar com /"
  ),
  title: safeString(2, 100),
  description: safeString(10, 500),
  icon: safeString(1, 50).optional(),
  sections: z.array(z.object({
    title: safeString(2, 100),
    content: safeString(10, 2000),
  })).optional(),
  tips: z.array(safeString(5, 300)).optional(),
  legal_references: z.array(safeString(5, 200)).optional(),
  keywords: z.array(safeString(2, 50)).optional(),
  related_links: z.array(z.object({
    label: safeString(2, 100),
    url: z.string().url("URL inválido"),
  })).optional(),
});

/**
 * Org Unit form schema
 */
export const orgUnitFormSchema = z.object({
  name: safeString(2, 100),
  parent_id: safeUUID.nullable().optional(),
});

/**
 * User role assignment schema
 */
export const userRoleAssignmentSchema = z.object({
  role_id: safeUUID,
  scope_type: z.enum(["GLOBAL", "ORG_UNIT"]),
  scope_id: safeUUID.nullable().optional(),
});

// ==========================================
// VALIDATION HELPERS
// ==========================================

export type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; errors: string[] };

/**
 * Validate data against a schema and return structured result
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.errors.map((e) => e.message),
  };
}

/**
 * Get first validation error message
 */
export function getFirstError<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): string | null {
  const result = schema.safeParse(data);
  if (result.success) return null;
  return result.error.errors[0]?.message || "Erro de validação";
}

// ==========================================
// RATE LIMITING (Client-side protection)
// ==========================================

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

/**
 * Check if action is rate limited
 * @param key - Unique key for the action (e.g., "login_user@email.com")
 * @param maxAttempts - Maximum attempts allowed
 * @param windowMs - Time window in milliseconds
 */
export function isRateLimited(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry) {
    rateLimitMap.set(key, { count: 1, firstAttempt: now });
    return false;
  }

  // Reset if outside window
  if (now - entry.firstAttempt > windowMs) {
    rateLimitMap.set(key, { count: 1, firstAttempt: now });
    return false;
  }

  // Increment and check
  entry.count++;
  return entry.count > maxAttempts;
}

/**
 * Clear rate limit for a key
 */
export function clearRateLimit(key: string): void {
  rateLimitMap.delete(key);
}

/**
 * Get remaining attempts
 */
export function getRemainingAttempts(
  key: string,
  maxAttempts: number = 5
): number {
  const entry = rateLimitMap.get(key);
  if (!entry) return maxAttempts;
  return Math.max(0, maxAttempts - entry.count);
}

// ==========================================
// CSRF PROTECTION
// ==========================================

/**
 * Generate a CSRF token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Store CSRF token in session
 */
export function storeCSRFToken(token: string): void {
  sessionStorage.setItem("csrf_token", token);
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string): boolean {
  const stored = sessionStorage.getItem("csrf_token");
  return stored === token && token.length === 64;
}

// ==========================================
// INPUT MASKS
// ==========================================

/**
 * Format phone number
 */
export function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 9)}`;
}

/**
 * Format employee code
 */
export function formatEmployeeCode(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 20);
}

// ==========================================
// TYPE EXPORTS
// ==========================================

export type LoginFormData = z.infer<typeof loginFormSchema>;
export type SignupFormData = z.infer<typeof signupFormSchema>;
export type ProfileFormData = z.infer<typeof profileFormSchema>;
export type ColaboradorFormData = z.infer<typeof colaboradorFormSchema>;
export type CicloFormData = z.infer<typeof cicloFormSchema>;
export type CompetenciaFormData = z.infer<typeof competenciaFormSchema>;
export type ObjectivoFormData = z.infer<typeof objectivoFormSchema>;
export type ReclamacaoFormData = z.infer<typeof reclamacaoFormSchema>;
export type RecursoFormData = z.infer<typeof recursoFormSchema>;
export type HelpContentFormData = z.infer<typeof helpContentFormSchema>;
export type OrgUnitFormData = z.infer<typeof orgUnitFormSchema>;
export type UserRoleAssignmentData = z.infer<typeof userRoleAssignmentSchema>;
