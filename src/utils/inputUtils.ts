export function sanitizeInput(str: string) {
  return str.trim();
}

export function sanitizeEmail(str: string) {
  return sanitizeInput(str).toLowerCase();
}

export function sanitizePassword(str: string) {
  return str;
}
