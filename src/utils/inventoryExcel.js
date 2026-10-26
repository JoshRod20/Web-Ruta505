import {
  EXCEL_HEADERS,
  INVENTORY_FIELDS,
  MAX_FILE_BYTES,
} from '../constants/inventory';
import { cleanText, normalizeText } from './text';
import { validateInventoryFields } from './validators';

/**
 * Lee un Excel (.xls o .xlsx) y separa las filas válidas de las que tienen errores.
 * Columnas esperadas: Nombre del negocio, Categoría, Departamento y Municipio.
 * El número y el estado NO van en el archivo: se asignan solos.
 *
 * Devuelve { fileName, valid: [{ nombre, ... }], errors: [{ row, message }] }.
 * `row` es el número de fila tal como se ve en Excel.
 */
export async function parseInventoryFile(file) {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error('El archivo supera los 5 MB.');
  }

  // Se carga solo al importar para no engordar el resto de la app.
  const XLSX = await import('xlsx');

  let rows;
  try {
    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false });
  } catch {
    throw new Error('No pudimos leer el archivo. Verifica que sea un Excel válido.');
  }

  // La primera fila con contenido son los encabezados.
  const headerIndex = rows.findIndex((row) => row.some((cell) => cleanText(cell) !== ''));
  if (headerIndex === -1) throw new Error('El archivo está vacío.');

  const columnOf = {};
  rows[headerIndex].forEach((cell, index) => {
    const header = normalizeText(cell);
    Object.entries(EXCEL_HEADERS).forEach(([field, aliases]) => {
      if (aliases.includes(header) && columnOf[field] === undefined) columnOf[field] = index;
    });
  });

  const missing = INVENTORY_FIELDS.filter(({ key }) => columnOf[key] === undefined).map(
    ({ label }) => label
  );
  if (missing.length > 0) {
    throw new Error(`Faltan columnas en el archivo: ${missing.join(', ')}.`);
  }

  const valid = [];
  const errors = [];

  rows.slice(headerIndex + 1).forEach((cells, offset) => {
    const values = {};
    INVENTORY_FIELDS.forEach(({ key }) => {
      values[key] = cleanText(cells[columnOf[key]]);
    });

    if (Object.values(values).every((value) => !value)) return; // fila vacía

    const firstError = Object.values(validateInventoryFields(values))[0];
    if (firstError) errors.push({ row: headerIndex + offset + 2, message: firstError });
    else valid.push(values);
  });

  if (valid.length === 0 && errors.length === 0) {
    throw new Error('El archivo no tiene filas con datos.');
  }

  return { fileName: file.name, valid, errors };
}