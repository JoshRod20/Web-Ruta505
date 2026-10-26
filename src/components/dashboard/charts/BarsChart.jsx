import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CHART_COLORS } from '../../../constants/chartConfig';

const ROW_HEIGHT = 36;
const AXIS_TICK = { fontSize: 11 };
const truncate = (max) => (text) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

/**
 * Gráfico de barras. direction: 'horizontal' | 'vertical'.
 * El tooltip muestra el nombre completo al pasar el cursor.
 */
export default function BarsChart({
  data,
  direction = 'horizontal',
  color = CHART_COLORS.primary,
  valueLabel = 'Actores',
}) {
  const horizontal = direction === 'horizontal';
  const height = horizontal ? Math.max(220, data.length * ROW_HEIGHT + 40) : 280;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={{ top: 20, right: 28, bottom: 0, left: horizontal ? 0 : -16 }}
      >
        <CartesianGrid stroke={CHART_COLORS.grid} horizontal={!horizontal} vertical={horizontal} />

        {horizontal && <XAxis type="number" allowDecimals={false} tick={AXIS_TICK} />}
        {horizontal && (
          <YAxis type="category" dataKey="name" width={130} tick={AXIS_TICK} tickFormatter={truncate(18)} />
        )}
        {!horizontal && (
          <XAxis dataKey="name" interval={0} tick={AXIS_TICK} tickFormatter={truncate(10)} />
        )}
        {!horizontal && <YAxis allowDecimals={false} tick={AXIS_TICK} />}

        <Tooltip cursor={{ fill: CHART_COLORS.cursor }} formatter={(value) => [value, valueLabel]} />
        <Bar
          dataKey="value"
          fill={color}
          maxBarSize={horizontal ? 22 : 34}
          radius={horizontal ? [0, 8, 8, 0] : [10, 10, 0, 0]}
          label={{ position: horizontal ? 'right' : 'top', fontSize: 11 }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}