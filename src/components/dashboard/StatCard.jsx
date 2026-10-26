export default function StatCard({ label, value, icon, color, loading }) {
  let content;
  if (loading) content = <span className="stat-card__skeleton" aria-hidden="true" />;
  else if (value === null) content = '—';
  else content = value.toLocaleString('es');

  return (
    <article className="stat-card" aria-busy={loading}>
      <span className="stat-card__icon" style={{ backgroundColor: color }}>
        <img src={icon} alt="" />
      </span>
      <div className="stat-card__body">
        <span className="stat-card__value">{content}</span>
        <span className="stat-card__label">{label}</span>
      </div>
    </article>
  );
}