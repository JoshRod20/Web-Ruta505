import { useMemo, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import SearchInput from '../../components/common/SearchInput';
import ActorCard, { ActorCardSkeleton } from '../../components/actors/ActorCard';
import useActors from '../../hooks/useActors';
import { PLACEHOLDER_CARDS } from '../../constants/actors';
import { ACTOR_TYPE_LABELS } from '../../constants/profiles';
import { normalizeText } from '../../utils/text';

// Texto sobre el que busca el input.
const searchableText = (actor) =>
  normalizeText(
    [
      actor.nombre,
      actor.departamento,
      actor.municipio,
      actor.telefono,
      actor.direccion,
      ACTOR_TYPE_LABELS[actor.tipoActor],
    ].join(' ')
  );

export default function ActorsPage() {
  const { actors, loading, error, photosFailed, reload } = useActors();
  const [search, setSearch] = useState('');

  const results = useMemo(() => {
    const term = normalizeText(search);
    return term ? actors.filter((actor) => searchableText(actor).includes(term)) : actors;
  }, [actors, search]);

  let content;
  if (loading) {
    content = (
      <div className="actor-grid" aria-busy="true" aria-label="Cargando actores culturales">
        {Array.from({ length: PLACEHOLDER_CARDS }, (_, index) => <ActorCardSkeleton key={index} />)}
      </div>
    );
  } else if (results.length === 0) {
    content = (
      <p className="actors__message">
        {search.trim()
          ? `No encontramos actores culturales para «${search.trim()}».`
          : 'Aún no hay actores culturales registrados.'}
      </p>
    );
  } else {
    content = (
      <div className="actor-grid">
        {results.map((actor) => <ActorCard key={actor.id} actor={actor} />)}
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Actores Culturales Registrados"
        subtitle="Consulta la información de los actores culturales de Ruta 505"
      />

      {(error || photosFailed) && (
        <div className="alert alert-warning d-flex align-items-center justify-content-between gap-3" role="alert">
          <span>{error || 'No pudimos cargar las fotos de los negocios.'}</span>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={reload}>
            Reintentar
          </button>
        </div>
      )}

      <div className="actors__toolbar">
        <SearchInput
          id="actors-search"
          label="Buscar actores culturales"
          value={search}
          onChange={setSearch}
        />
      </div>

      {content}
    </>
  );
}