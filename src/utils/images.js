// Tipo de imagen según los primeros caracteres del Base64.
const MIME_BY_PREFIX = [
  ['/9j/', 'image/jpeg'],
  ['iVBOR', 'image/png'],
  ['UklGR', 'image/webp'],
  ['R0lGOD', 'image/gif'],
];

const RAW_BASE64 = /^[A-Za-z0-9+/=\s]+$/;

/**
 * Convierte lo que haya guardado en Firestore en algo que <img> pueda mostrar:
 * Base64 puro, `data:image/...`, una URL, o un objeto con { data | url | uri | src }.
 * Devuelve null si no se reconoce.
 */
export function toImageSrc(value) {
  if (!value) return null;

  if (typeof value === 'object') {
    return toImageSrc(value.data ?? value.url ?? value.uri ?? value.src);
  }
  if (typeof value !== 'string') return null;

  const text = value.trim();
  if (/^(data:image\/|https?:\/\/|blob:)/i.test(text)) return text;
  if (text.length < 100 || !RAW_BASE64.test(text)) return null;

  const mime = MIME_BY_PREFIX.find(([prefix]) => text.startsWith(prefix))?.[1] ?? 'image/jpeg';
  return `data:${mime};base64,${text}`;
}

// Primera imagen utilizable de una lista, o null.
export function firstImageSrc(list) {
  if (!Array.isArray(list)) return null;
  for (const item of list) {
    const src = toImageSrc(item);
    if (src) return src;
  }
  return null;
}