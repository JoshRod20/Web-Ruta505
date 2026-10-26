export const INVENTORY_STATUS = {
  active: 'activo',
  inactive: 'inactivo',
  pending: 'pendiente',
};

export const STATUS_OPTIONS = [
  { value: INVENTORY_STATUS.active, label: 'Activo' },
  { value: INVENTORY_STATUS.inactive, label: 'Inactivo' },
  { value: INVENTORY_STATUS.pending, label: 'Pendiente' },
];

export const STATUS_LABELS = Object.fromEntries(
  STATUS_OPTIONS.map(({ value, label }) => [value, label])
);

// Campos del inventario. Los límites coinciden con las reglas de Firestore.
export const INVENTORY_FIELDS = [
  { key: 'nombre', label: 'Nombre del negocio', maxLength: 120 },
  { key: 'categoria', label: 'Categoría', maxLength: 80 },
  { key: 'departamento', label: 'Departamento', maxLength: 80 },
  { key: 'municipio', label: 'Municipio', maxLength: 80 },
];

// Encabezados que se reconocen en el Excel (sin tildes ni mayúsculas).
export const EXCEL_HEADERS = {
  nombre: ['nombre del negocio', 'nombre', 'negocio'],
  categoria: ['categoria'],
  departamento: ['departamento'],
  municipio: ['municipio'],
};

export const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

// El texto bajo el título cambia según la cuenta.
export const INVENTORY_SUBTITLES = {
  // Cuenta con role "institucion"
  intur:
    'Carga un archivo en formato Excel (.xls) o agrega un dato para visualizar el inventario turístico.',
  // Cuenta con esAdminPrincipal
  admin: 'Visualiza y gestiona el inventario turístico compartido por INTUR.',
};