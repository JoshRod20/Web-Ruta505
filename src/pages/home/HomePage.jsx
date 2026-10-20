import StatCard from '../../components/dashboard/StatCard';
import useDashboardStats from '../../hooks/useDashboardStats';
import { STAT_CARDS } from '../../constants/statCards';

export default function HomePage() {
  const { stats, loading, failed, reload } = useDashboardStats();

  return (
    <>
      <header className="home__header">
        <h1 className="home__title">Estadísticas</h1>
        <p className="home__subtitle">Visualiza información general de Ruta 505.</p>
      </header>

      {failed && !loading && (
        <div className="alert alert-warning d-flex align-items-center justify-content-between gap-3" role="alert">
          <span>No pudimos cargar algunas estadísticas.</span>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={reload}>
            Reintentar
          </button>
        </div>
      )}

      <section className="stat-grid" aria-label="Resumen general">
        {STAT_CARDS.map(({ key, ...card }) => (
          <StatCard key={key} {...card} value={stats[key]} loading={loading} />
        ))}
      </section>

      {/* Aquí irán las gráficas */}
    </>
  );
}