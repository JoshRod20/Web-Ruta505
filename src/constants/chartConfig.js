export const MONTHS_TO_SHOW = 12; // meses que muestra el gráfico de registros
export const MAX_PIE_SLICES = 10; // porciones del pastel; el resto se agrupa en "Otros"
export const OTHERS_LABEL = 'Otros';

// Se usan hex porque los atributos SVG no siempre resuelven variables CSS.
export const CHART_COLORS = {
  primary: '#065f2e',
  grid: '#ececec',
  cursor: 'rgba(6, 95, 46, 0.08)',
  others: '#bdbdbd',
  pie: [
    '#065f2e', '#8dc21f', '#0a9be0', '#f7941d', '#2e8b57',
    '#5bc0eb', '#c8d86a', '#ffb866', '#3d7a52', '#9bb0a5',
  ],
};