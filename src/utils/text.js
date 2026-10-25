// Minúsculas y sin tildes: "León" y "leon" son iguales al comparar.
export const normalizeText = (text) =>
  String(text ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

// Quita espacios sobrantes: "  Finca   El Paraíso " -> "Finca El Paraíso".
export const cleanText = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();