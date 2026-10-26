// `value` va sin tildes ni mayúsculas: así se compara con lo guardado en Firestore
// (por ejemplo "Guía" y "guia" son el mismo tipo).
export const ACTOR_TYPES = [
  { value: 'artesano', label: 'Artesano' },
  { value: 'comunidad', label: 'Comunidad' },
  { value: 'guia', label: 'Guía' },
  { value: 'emprendedor', label: 'Emprendedor' },
];

export const ACTOR_TYPE_LABELS = Object.fromEntries(
  ACTOR_TYPES.map(({ value, label }) => [value, label])
);

// Datos que muestra cada tarjeta.
export const PROFILE_CARD_FIELDS = [
  { key: 'nombre', label: 'Nombre completo/negocio' },
  { key: 'departamento', label: 'Departamento', uppercase: true },
  { key: 'telefono', label: 'Teléfono' },
];

// Datos que muestra el modal ampliado.
export const PROFILE_DETAIL_FIELDS = [
  { key: 'nombre', label: 'Nombre completo/negocio' },
  { key: 'departamento', label: 'Departamento', uppercase: true },
  { key: 'municipio', label: 'Municipio', uppercase: true },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'turismo', label: 'Turismo que ofrece', uppercase: true },
];