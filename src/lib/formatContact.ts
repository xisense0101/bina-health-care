export function formatTel(raw?: string) {
  if (!raw) return '';
  let s = raw.trim();

  // remove leading tel: if provided
  s = s.replace(/^tel:/i, '');

  // if already starts with + and has digits, return as-is (normalize spaces)
  if (/^\+/i.test(s)) {
    // remove spaces
    return s.replace(/\s+/g, '');
  }

  // strip non-digits
  const digits = s.replace(/\D/g, '');

  if (!digits) return s;

  // If it's a 10-digit US number, add +1
  if (digits.length === 10) return `+1${digits}`;

  // If it's 11 digits starting with 1, ensure plus
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;

  // Otherwise, just prefix + and return digits
  return `+${digits}`;
}
