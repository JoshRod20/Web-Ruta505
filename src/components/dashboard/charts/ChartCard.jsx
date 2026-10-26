// Tarjeta contenedora: título + estado de carga / sin datos / gráfico.
export default function ChartCard({ title, loading, isEmpty, children }) {
  let body = children;
  if (loading) body = <div className="chart-card__skeleton" aria-busy="true" />;
  else if (isEmpty) body = <p className="chart-card__empty">Aún no hay datos para mostrar.</p>;

  return (
    <article className="chart-card">
      <h2 className="chart-card__title">{title}</h2>
      <div className="chart-card__body">{body}</div>
    </article>
  );
}