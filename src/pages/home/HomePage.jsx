import StatCard from '../../components/dashboard/StatCard';
import ChartCard from '../../components/dashboard/charts/ChartCard';
import BarsChart from '../../components/dashboard/charts/BarsChart';
import MonthlyLineChart from '../../components/dashboard/charts/MonthlyLineChart';
import MunicipalityPieChart from '../../components/dashboard/charts/MunicipalityPieChart';
import useDashboardStats from '../../hooks/useDashboardStats';
import { STAT_CARDS } from '../../constants/statCards';

export default function HomePage() {
  const { stats, charts, loading, failed, errors, reload } = useDashboardStats();

  const monthlyTotal = charts.monthly.reduce((sum, month) => sum + month.value, 0);

  return (
    <>
      <header className="home__header">
        <h1 className="home__title">Estadísticas</h1>
        <p className="home__subtitle">Visualiza información general de Ruta 505.</p>
      </header>

      {failed && !loading && (
        <div className="alert alert-warning d-flex align-items-center justify-content-between gap-3" role="alert">
          <span>
            No pudimos cargar algunas estadísticas.
            <small className="d-block text-muted">{errors.join(' · ')}</small>
          </span>
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

      <section className="chart-grid" aria-label="Gráficos estadísticos">
        <ChartCard
          title="Actores culturales por categoría"
          loading={loading}
          isEmpty={charts.category.length === 0}
        >
          <BarsChart data={charts.category} direction="horizontal" />
        </ChartCard>

        <ChartCard
          title="Distribución de actores culturales"
          loading={loading}
          isEmpty={charts.actorType.length === 0}
        >
          {/* Para barras verticales: direction="vertical" */}
          <BarsChart data={charts.actorType} direction="vertical" />
        </ChartCard>

        <ChartCard title="Registro de actores por mes" loading={loading} isEmpty={monthlyTotal === 0}>
          <MonthlyLineChart data={charts.monthly} />
        </ChartCard>

        <ChartCard
          title="Actores culturales por municipio"
          loading={loading}
          isEmpty={charts.municipality.length === 0}
        >
          <MunicipalityPieChart data={charts.municipality} />
        </ChartCard>
      </section>
    </>
  );
}