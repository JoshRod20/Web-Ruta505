import { OTHERS_LABEL } from '../constants/chartConfig';

export const normalizeKey = (text) =>
  text.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Cuenta cuántas veces aparece cada texto, sin distinguir mayúsculas ni tildes
 * ("Léon" y "leon" son el mismo grupo). Devuelve [{ name, value }] de mayor a menor.
 */
export function countByLabel(values, { emptyLabel = 'Sin dato', format = (t) => t } = {}) {
  const groups = new Map();

  values.forEach((raw) => {
    const text = typeof raw === 'string' ? raw.trim() : '';
    const key = text ? normalizeKey(text) : '__empty__';
    const group = groups.get(key);

    if (group) group.value += 1;
    else groups.set(key, { name: text ? format(text) : emptyLabel, value: 1 });
  });

  return [...groups.values()].sort(
    (a, b) => b.value - a.value || a.name.localeCompare(b.name, 'es')
  );
}

// Conserva los `max` primeros y suma el resto en una sola porción "Otros".
export function limitWithOthers(data, max) {
  if (data.length <= max) return data;
  const rest = data.slice(max).reduce((sum, item) => sum + item.value, 0);
  return [...data.slice(0, max), { name: OTHERS_LABEL, value: rest }];
}

const MONTH_FORMAT = new Intl.DateTimeFormat('es', { month: 'short', year: '2-digit' });

/**
 * Cuenta fechas por mes en los últimos `months` meses (incluido el actual).
 * Los meses sin registros quedan en 0.
 */
export function countByMonth(dates, months, now = new Date()) {
  const buckets = [];
  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      name: MONTH_FORMAT.format(d),
      value: 0,
    });
  }

  const byKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));
  dates.forEach((date) => {
    const bucket = date ? byKey.get(`${date.getFullYear()}-${date.getMonth()}`) : null;
    if (bucket) bucket.value += 1;
  });

  return buckets.map(({ name, value }) => ({ name, value }));
}