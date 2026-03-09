import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCRN(value: string): string {
  const digits = value.replace(/[^0-9]/g, "");
  if (digits.length <= 2) return digits;
  return digits.slice(0, 2) + "-" + digits.slice(2, 8);
}

export function formatCREF(value: string): string {
  const clean = value.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
  if (clean.length <= 6) return clean;
  if (clean.length <= 7) return clean.slice(0, 6) + "-" + clean.slice(6);
  return clean.slice(0, 6) + "-" + clean.slice(6, 7) + "/" + clean.slice(7, 9);
}

export function getPasswordStrength(pw: string): 0 | 1 | 2 | 3 | 4 {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score as 0 | 1 | 2 | 3 | 4;
}
