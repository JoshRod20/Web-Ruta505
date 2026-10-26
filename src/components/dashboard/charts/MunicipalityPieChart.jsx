import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_COLORS, OTHERS_LABEL } from '../../../constants/chartConfig';

const colorOf = (item, index) =>
  item.name === OTHERS_LABEL ? CHART_COLORS.others : CHART_COLORS.pie[index % CHART_COLORS.pie.length];

export default function MunicipalityPieChart({ data }) {
  // Porción resaltada: se activa desde el pastel o desde la leyenda
  const [active, setActive] = useState(null);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="pie-chart">
      <div className="pie-chart__plot">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius="90%"
              stroke="#fff"
              strokeWidth={2}
              onMouseEnter={(_, index) => setActive(index)}
              onMouseLeave={() => setActive(null)}
            >
              {data.map((item, index) => (
                <Cell
                  key={item.name}
                  fill={colorOf(item, index)}
                  fillOpacity={active === null || active === index ? 1 : 0.35}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} (${Math.round((value / total) * 100)}%)`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="pie-chart__legend">
        {data.map((item, index) => (
          <li
            key={item.name}
            className={`pie-chart__item ${active === index ? 'is-active' : ''}`}
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(null)}
          >
            <span className="pie-chart__dot" style={{ backgroundColor: colorOf(item, index) }} />
            <span className="pie-chart__name">{item.name}</span>
            <strong className="pie-chart__value">{item.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}