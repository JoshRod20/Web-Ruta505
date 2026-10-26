import { ImageIcon } from '../icons/ActorIcons';
import { buildingIcon, locationIcon, phoneIcon } from '../../constants/icons';

// Las filas sin dato no se muestran.
const ROWS = [
  { key: 'lugar', icon: locationIcon },
  { key: 'telefono', icon: phoneIcon },
  { key: 'zona', icon: buildingIcon },
];

export default function ActorCard({ actor }) {
  return (
    <article className="actor-card">
      <div className="actor-card__media">
        {actor.imagen ? (
          <img src={actor.imagen} alt={`Foto de ${actor.nombre}`} loading="lazy" decoding="async" />
        ) : (
          <span className="actor-card__placeholder" aria-hidden="true">
            <ImageIcon size={40} />
          </span>
        )}
      </div>

      <div className="actor-card__body">
        <h2 className="actor-card__title" title={actor.nombre}>{actor.nombre}</h2>

        <ul className="actor-card__info">
          {ROWS.filter(({ key }) => actor[key]).map(({ key, icon }) => (
            <li key={key}>
              <img src={icon} alt="" className="actor-card__icon" />
              <span>{actor[key]}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

// Tarjeta gris animada mientras cargan los datos.
export function ActorCardSkeleton() {
  return (
    <div className="actor-card actor-card--skeleton" aria-hidden="true">
      <div className="actor-card__media" />
      <div className="actor-card__body">
        <span className="actor-card__bar actor-card__bar--title" />
        <span className="actor-card__bar" />
        <span className="actor-card__bar" />
        <span className="actor-card__bar" />
      </div>
    </div>
  );
}