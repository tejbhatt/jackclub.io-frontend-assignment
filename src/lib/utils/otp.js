export const onlyDigits = (str) => (str || '').replace(/\D+/g, '');
export const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
export const range = (n) => Array.from({ length: n }, (_, i) => i);

export function normalizePaste(payload = '', maxLen = 6) {
  return onlyDigits(String(payload)).slice(0, maxLen);
}

export function isComplete(value, length) {
  return value.length === length && /^\d+$/.test(value);
}
